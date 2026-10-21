# The Playful Index

A responsive, single-screen research directory about playfulness in digital interfaces, built with HTML, CSS, and vanilla JavaScript.

The website source is in [`playful-index/dist/`](playful-index/dist/). It includes the four-section overview, card-flip navigation, a dot cursor, and twelve curated resources with locally stored preview images.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory playful-index/dist
```

Open http://127.0.0.1:4173/ . No installation or build step is required. Use an HTTP server because resource content loads from JSON.

## Update resources

Edit [`playful-index/dist/resources.json`](playful-index/dist/resources.json). Preview images are stored in [`playful-index/dist/assets/previews/`](playful-index/dist/assets/previews/).

See the [project documentation](playful-index/README.md) for content fields and interaction details. This repository stores the project source; it does not configure website deployment.
