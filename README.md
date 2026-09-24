# ZeikoAI site

The public ZeikoAI website: the models and their prices, as static files.

- `/` is the landing page: the models, the pricing table, a cost estimator,
  a pricing FAQ, and how to request a key.
- `/models` lists every model with its specs and full rate card. The old
  `/models/<id>` links redirect to `/models#<id>`.

**Read [CLAUDE.md](CLAUDE.md) before changing anything.** It lists what the
site must never show, and every place a price has to be updated.

## Layout

```
public/
  index.html      landing page
  models.html     /models
  404.html
  _redirects      /models/<id> → /models#<id>
  css/style.css   one stylesheet, light and dark
  js/main.js      theme, menu, copy buttons, estimator
scripts/
  check-site.mjs  npm run check
```

No build step, no framework, no CDN, no requests to anywhere else. Every
number is in the HTML.

## Run locally

```bash
npm install
npx wrangler dev          # http://localhost:8787
```

## Check

```bash
npm run check
```

This checks the site for words it must never contain and for requests to
anywhere else. It also confirms that each price reads the same everywhere it
appears. Run it before every commit. `npm run deploy` runs it first and stops
if it fails.

## Deploy

```bash
npm run deploy
```

## Still to fill in

- **Contact**: the "Request a key" button points at `manukmiberxzeikoai.com`,
  which is not a valid email address (there is no `@`). Replace it in
  `public/index.html` with the real address.
