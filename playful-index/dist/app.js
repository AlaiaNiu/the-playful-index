/* All resource content is maintained in resources.json. */
'use strict';
const state = {resources: [], categories: [], category: null, originButton: null, animation: null, transition: 0};
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function safeURL(url) { const parsed = new URL(url); if(parsed.protocol !== 'https:') throw new Error('Resource links must use HTTPS.'); return escapeHTML(parsed.href); }
function announce(text) { $('#announcement').textContent = text; }
function resourceCard(resource) {
  return `<article class="resource-card">
    <div class="resource-copy">
    <p class="resource-meta">${escapeHTML(resource.type)}${resource.creator ? ` / ${escapeHTML(resource.creator)}` : ''}</p>
    <h3><a href="${safeURL(resource.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(resource.name)}</span><span class="external-arrow" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></h3>
    <p class="description">${escapeHTML(resource.description)}</p>
    ${resource.relevance ? `<details class="research-note"><summary>Research note</summary><p>${escapeHTML(resource.relevance)}</p></details>` : ''}
    ${resource.note ? `<p class="access-note">${escapeHTML(resource.note)}</p>` : ''}
    </div>
    ${resource.preview ? `<figure class="resource-preview${resource.previewFit === 'contain' ? ' preview-contain' : ''}"><img src="${escapeHTML(resource.preview)}" alt="${escapeHTML(resource.previewAlt || `Preview of ${resource.name}`)}" loading="lazy" decoding="async" width="240" height="160"></figure>` : ''}
  </article>`;
}
function foldedTransform(button) {
  const box = button.getBoundingClientRect(), stage = $('#stage').getBoundingClientRect();
  const x = box.left + box.width / 2 - stage.left - stage.width / 2;
  const y = box.top + box.height / 2 - stage.top - stage.height / 2;
  return `translate(${x}px, ${y}px) scale(${box.width/stage.width}, ${box.height/stage.height}) rotateY(-90deg)`;
}
async function playTurn(element, frames, duration) {
  if(reducedMotion.matches || !element.animate) return;
  const animation=element.animate(frames,{duration,easing:'cubic-bezier(.3,.65,.2,1)',fill:'both'});
  state.animation=animation;
  await animation.finished.catch(()=>{});
  // Cancelled turns are invalidated by the transition counter in the caller.
}
async function openSection(id) {
  if(state.category) return;
  const category = state.categories.find(c=>c.id===id);
  if(!category) return;
  const button = $(`[data-category="${id}"]`);
  const fold = foldedTransform(button);
  const turn=++state.transition;
  state.animation?.cancel();
  state.category=id; state.originButton=button;
  $('#panel-title').textContent=category.name;
  $('#panel-number').textContent=category.number;
  const resources=state.resources.filter(r=>r.category===id);
  $('#panel-count').textContent=`${resources.length} links`;
  $('#resource-grid').innerHTML=resources.length ? resources.map(resourceCard).join('') : '<p class="empty-note">More resources coming soon.</p>';
  const colors=getComputedStyle(button);
  const panel=$('#resource-panel');
  panel.style.setProperty('--panel-color',colors.getPropertyValue('--section-color'));
  panel.style.setProperty('--panel-ink',colors.getPropertyValue('--section-ink'));
  $('#overview').inert=true;
  await playTurn(button,[{transform:'rotateY(0deg)'},{transform:'rotateY(90deg)'}],210);
  if(turn!==state.transition) return;
  panel.hidden=false; panel.inert=false;
  $('#resource-scroll').scrollTop=0;
  $('#overview').inert=true; $('#overview').setAttribute('aria-hidden','true'); $('#overview').classList.add('is-away');
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));
  state.animation?.cancel();
  $('#panel-title').focus({preventScroll:true});
  announce(`${category.name}. ${resources.length} links. Escape returns to the index.`);
  await playTurn(panel,[{transform:fold},{transform:'translate(0px, 0px) scale(1, 1) rotateY(0deg)'}],390);
  if(turn===state.transition){state.animation?.cancel();state.animation=null;}
}
async function returnToOverview() {
  if(!state.category) return;
  const turn=++state.transition;
  state.animation?.cancel();
  const button=state.originButton;
  const panel=$('#resource-panel');
  state.category=null;
  panel.inert=true;
  if(!panel.hidden){
    await playTurn(panel,[{transform:'translate(0px, 0px) scale(1, 1) rotateY(0deg)'},{transform:foldedTransform(button)}],300);
    if(turn!==state.transition) return;
  }
  $('#resource-panel').hidden=true; $('#resource-panel').inert=true;
  $('#overview').inert=false; $('#overview').removeAttribute('aria-hidden'); $('#overview').classList.remove('is-away');
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-expanded','false'));
  state.animation?.cancel();
  // The card's front rotates back into place after its resource side folds away.
  button?.focus({preventScroll:true});
  await playTurn(button,[{transform:'rotateY(90deg)'},{transform:'rotateY(0deg)'}],210);
  if(turn!==state.transition) return;
  state.animation?.cancel();state.animation=null;
  announce('All four sections.');
}
async function init() {
  try {
    const response=await fetch('resources.json');
    if(!response.ok) throw new Error(`Collection returned ${response.status}.`);
    const data=await response.json();
    state.resources=data.resources; state.categories=data.categories;
    state.resources.forEach(r=>safeURL(r.url));
    document.querySelectorAll('[data-category]').forEach((button,index,buttons)=>{
      const category=state.categories.find(c=>c.id===button.dataset.category);
      button.querySelector('.tile-title').textContent=category.name;
      button.querySelector('.tile-count').textContent=`${state.resources.filter(r=>r.category===category.id).length} links`;
      button.disabled=false;
      button.addEventListener('click',()=>openSection(category.id));
      button.addEventListener('keydown',event=>{
        const offsets={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2};
        if(event.key in offsets){event.preventDefault();buttons[(index+offsets[event.key]+buttons.length)%buttons.length].focus();}
      });
    });
    $('#home-button').addEventListener('click',returnToOverview);
    $('#back-button').addEventListener('click',returnToOverview);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.category){event.preventDefault();returnToOverview();}});
    $('#collection-meta').textContent=`${state.resources.length} links / ${state.categories.length} sections`;
    announce('Four sections ready to explore.');
  }catch(error){
    announce('The collection could not be loaded. Reload to try again.');
    $('#collection-meta').innerHTML='Collection unavailable. <a href="resources.json">View resource data</a>.';
    console.error(error);
  }
}
init();
