# proxychat — ZeikoAI site

The ZeikoAI site: a static landing page for the API (three roleplay models
behind an OpenAI-compatible endpoint, three pricing bands, USDT invoicing),
and `/models` — every model's specs, pricing and live performance, refreshed
hourly.

This repository holds the page only. The old Cloudflare worker that used to live
here was removed from `main`; it is still in git history if it is ever needed
(`git log --all`, commit `c2df3f7` and earlier).

## Layout

```
public/
  index.html       the landing page: hero, models, pricing, code samples, FAQ, contact
  models.html      /models and /models/<id> — one page, drawn from the snapshot
  css/style.css    colour tokens for light and dark
  css/models.css   the model pages and their charts
  js/main.js       theme toggle, mobile menu, code tabs, copy button
  js/models.js     the model catalogue, each model's page, hand-drawn SVG charts
src/worker.js      /data/models.json out of R2, and /models/<id> → models.html
dev/models.sample.json   a snapshot of made-up traffic, for local development only
wrangler.jsonc     static assets + the worker + the R2 binding
```

No build step, no CDN, no framework. Open `public/index.html` straight from disk
and the landing page is already complete. Everything but two paths is a static
file; `run_worker_first` sends only `/data/*` and `/models/*` to the worker.

## `/models` — how the numbers get here

```text
relay request log ──every hour──▶ per-model figures ──PUT──▶ R2: zeiko-models/models.json
                                                                     │
                     /models, /models/<id> ◀── /data/models.json ◀───┘  (src/worker.js)
```

The relay (`manukmiber/Chtting-relay-worker`) works out, once an hour, each
public model's time to first token, latency, output speed, cache rate, request
count and tokens in and out — over 24 hours, 7 days and 30 days, each beside the
period before — and uploads one JSON object to the `zeiko-models` R2 bucket.
Each model's entry is its `/v1/models` listing plus the page words written in
the relay dashboard (**Models → a model → Public page**), so nothing on this
site has to be edited when a model changes. The site never talks to the relay:
if the relay is offline, the page shows the last hour it published.

To connect it, create an R2 API token with **Object Read & Write** on the
`zeiko-models` bucket only, and fill in **Models → Public model page → R2
bucket** in the relay dashboard (account id, bucket, access key id, secret).
Press **Publish now** once; after that it uploads every hour by itself.

Until the first upload, `/models` says the figures are on their way.

## Run locally

```bash
npm install
npm run seed:local        # the made-up sample snapshot into the local R2
npx wrangler dev          # http://localhost:8787, /models included
# or, for the landing page alone:
python3 -m http.server -d public 8080
```

`dev/models.sample.json` is invented traffic for three models, only ever put in
the *local* bucket. The live bucket is written by the relay and nothing else.

## Deploy

```bash
npx wrangler deploy
```

Change `name` in `wrangler.jsonc` if the worker is called something else, then
attach a custom domain from the Cloudflare dashboard. The `zeiko-models` R2
bucket must exist before a deploy, because the worker binds to it.

## Still to fill in

- **Contact** in the "Request a key" section is still `hello@example.com` —
  replace it in `public/index.html` before the page is shared.
- **Base URL** in the code samples is still `https://api.your-domain.com` —
  replace it with the hostname actually handed to callers.
- If rates change, update both the `#pricing` table and the model cards on the
  landing page. `/models` needs nothing: it reads the rates the relay bills at.
