# ZeikoAI site

The public ZeikoAI website: the models, their prices, and how each model is
performing.

- `/` is the landing page: the models, the pricing table, a cost estimator,
  a pricing FAQ, and how to request a key.
- `/models` lists every model with its specs, full rate card and live
  performance: time to first token, output speed, latency, availability,
  requests, tokens and cache rate over 24 hours, 7 days and 30 days, with
  charts. The old `/models/<id>` links redirect to `/models#<id>`.

**Read [CLAUDE.md](CLAUDE.md) before changing anything.** It lists what the
site must never show, and every place a price has to be updated.

## Layout

```
public/
  index.html      landing page
  models.html     /models, with placeholders for the performance figures
  404.html
  _redirects      /models/<id> → /models#<id>
  css/style.css   one stylesheet, light and dark
  js/main.js      theme, menu, copy buttons, estimator, chart hover
src/
  worker.js       runs for /models only
  render.js       the hourly snapshot → the figures and charts on /models
dev/
  sample-stats.mjs  made-up figures for local development
scripts/
  check-site.mjs  npm run check
```

Every path but `/models` is a plain static file. For `/models`, the worker
reads the hourly snapshot from the `zeiko-models` R2 bucket and renders the
figures into the page before it is sent, so the browser receives finished
HTML and never asks for a data file. If there is no snapshot yet, `/models`
goes out without figures and says they are not available right now.

## Run locally

```bash
npm install
npm run seed:local        # made-up figures into the local bucket
npx wrangler dev          # http://localhost:8787
```

## Check

```bash
npm run check
```

This checks the site for words it must never contain and for requests to
anywhere else, and confirms that each price reads the same everywhere it
appears. It also renders the made-up figures through `src/render.js`, holds
the result to the same rules, and fails if any text from the snapshot would
reach the page. Run it before every commit. `npm run deploy` runs it first
and stops if it fails.

## Deploy

```bash
npm run deploy
```

The `zeiko-models` R2 bucket must exist before a deploy, because the worker
binds to it.

## Still to fill in

- **Contact**: the "Request a key" button points at `manukmiberxzeikoai.com`,
  which is not a valid email address (there is no `@`). Replace it in
  `public/index.html` with the real address.
