# The Playful Index

A minimal local research directory with four color fields in a single-screen 2×2 overview. Plain HTML, CSS and JavaScript. No build step or external dependencies. Not published.

## Preview

From this directory run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`, then open http://127.0.0.1:4173/ . Serve over HTTP because content is loaded from JSON.

## Four sections

1. Evolution of Moving — 4 links
2. Playful Interfaces — 3 links
3. Experimental Playground — 3 links
4. Perspective and Debates — 2 links

The collection contains the twelve links supplied by the user, including Codrops Creative Hub, in their requested groups and order. The ProQuest title and authors have now been verified against the live library record: UI Animations with Lottie and After Effects, by Mireia Alegre Ruiz and Emilio Rodriguez Martinez.

## Interaction

Select a color field to turn it over and expand its resource side. Returning reverses the card flip. The back button, wordmark or Escape returns to the overview and restores focus. Tab and Enter/Space operate the section buttons. Arrow keys move between them. Expanded content scrolls internally and external links open in new tabs. Reduced-motion preferences disable transition animations and movement on hover. Mouse and trackpad users see a small, outlined dot cursor; touch devices keep their native input behavior. The cursor uses a native SVG cursor asset, so it has no JavaScript tracking or follow delay.

The simplified interface has no random recommendation, search box, decorative illustration, hero slogan or popup dialog. Each resource shows its title, source and short description. Optional research notes expand inline.

## Content and colors

Edit `dist/resources.json` to update category names and resources. Resource fields are `id`, `category`, `name`, `type`, `creator`, HTTPS `url` and `description`, plus optional `relevance` and `note`. Counts update automatically. Descriptions summarize the linked source and research notes contain editorial observations.

Colors sampled visually from the supplied reference: red `#CA4438`, pink `#FFB9C3`, pale blue `#ACCCD8`, warm yellow `#FFDA80`. Background: `#FCF6E9`. Colors are defined in `dist/styles.css`; they also drive the matching expanded-panel headers.

## Files

- `dist/index.html`: the overview and expanded resource area
- `dist/styles.css`: single-screen layout, reference palette and responsive styles
- `dist/app.js`: resource loading, selection, transitions and keyboard operation
- `dist/resources.json`: the curated collection

Development preview captures and unused artwork from earlier designs are excluded from Git.

## Resource previews

Each resource has a small preview beside its text. Images are stored locally in `dist/assets/previews/`; these are official site previews, actual website screenshots, or the verified library book cover. Update `preview`, `previewAlt`, `previewSource`, and `previewKind` in the resource data to replace an image. Optional `previewFit: "contain"` preserves the entire book cover. Images load lazily. They are references to the linked work, with original creators retaining rights.
