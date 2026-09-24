# CLAUDE.md

This repository is the public ZeikoAI website. It does two things:
**it shows the models, and it shows their prices.** Nothing else.

`/models` stays: it is where visitors look the models up.

## The rule: never leak anything about how the API works

Everything under `public/` ships to every visitor: HTML and its comments, JS
and CSS and their comments, `<meta>` tags, `alt` text, class names, file names,
and anything a browser's network tab would show. Treat all of it as public.

**Never put any of the following on the site**, in copy, comments, example code
or anywhere else:

- **Architecture**: backend, relay, proxy, gateway, router, upstream, provider
  or vendor, failover, load balancing, queues, pacing, rate-limit internals.
- **What runs the models**: base model, model family, the lab or vendor
  behind it, fine-tuning, hardware, GPUs, regions, or any parameter count
  beyond the product name.
- **Tokenizer**: which tokenizer is used or how tokens are counted. Say "billed
  per token" and stop there.
- **Infrastructure**: where or how the API is hosted, Workers, R2, KV, D1,
  databases, buckets, logs, dashboards, admin panels, internal repositories,
  environment variables, secrets.
- **Telemetry**: request counts, token volumes, latency, time to first token,
  throughput, uptime, cache hit rates, or anything else read from request logs.
- **Decision logic**: how refusals are detected, how caching works, how model
  names are mapped, what is stored and for how long.
- **Connection details**: the API base URL or hostname, endpoint paths, the
  key format or prefix, example keys, `Authorization` headers, `curl`/SDK
  snippets. A customer gets all of that together with their key, never
  from the site.

When in doubt, leave it out. If a request would put any of the above on the
site, say so and ask before doing it, even if the request is explicit.

The same rule covers everything else in this repository: README, code
comments, commit messages, PR titles and PR descriptions. Never name or
describe the API's backend or the relay. Writing about how *this static
site* is built and deployed is fine.

## What the site may show

- Each model's display name, model ID, one-line description, and content
  rating (SFW / Adult / Unrestricted).
- Context window (256K), max output (8,192 tokens), streaming support, the
  thinking-effort levels (`none` … `max`), and "works with the official
  OpenAI SDKs".
- Every rate: input, cache read, the output rate in each of the three bands,
  and the flat fee for a refused request; which effort lands in which band;
  that reasoning tokens bill as output.
- Billing: one invoice per period, per-model breakdown, USDT (TRC20), IDR
  rate printed on the invoice, no subscription.
- How to request a key (the contact section).

## Layout

```
public/
  index.html      landing: hero, models, pricing + bill estimator, FAQ, contact
  models.html     /models: at-a-glance table, then each model's specs and rate card
  404.html
  _redirects      old /models/<id> links → /models#<id>
  css/style.css   the only stylesheet; colour tokens for light and dark
  js/main.js      theme, mobile menu, copy buttons, hero bars, estimator
scripts/
  check-site.mjs  leak scan + price consistency (npm run check)
wrangler.jsonc    serves public/ as static assets and nothing else
```

It is a static site, and it stays one:

- **No server code.** No worker script, no bindings, no `run_worker_first`.
- **No runtime requests.** No `fetch`, XHR, WebSocket, analytics, web fonts or
  CDN scripts. Every number is written into the HTML, so the page is complete
  as shipped and the network tab shows only this site's own files.
- **No build step**, no framework, no dependencies besides wrangler.
- Every page must read fine with JavaScript off. The estimator is the only
  part that needs it, and it stays hidden without it.

## Prices: one key, many places

Each rate appears in several places, and every one of them is marked with
`data-price="<model-id>:<rate>"`. The rate keys are `input`, `cache`, `out`
(standard band), `out-none` and `out-max`. The refused-request fee is just
`data-price="refusal"`.

When a rate changes, change **every** element that carries its key:

- `index.html`: the hero rate card (Jagad only), the model cards, the pricing
  table, and the refusal note and FAQ entry.
- `models.html`: the at-a-glance table and that model's rate card.

The estimator reads its rates from the pricing table (`#rateTable`), and the
hero bars size themselves from their prices, so neither needs editing.
Any new `$` amount on a page must carry a `data-price` key too.

## Adding, renaming or removing a model

- `index.html`: the model card, a `<tr data-model="…">` row in the pricing
  table, the "Models" stat, and "three"/"3" in the copy and meta tags.
- `models.html`: a jump chip, an at-a-glance row, and a full
  `<article id="<model-id>">` sheet (copy one of the existing ones).
- The FAQ entry "Which model should I pick?".

## Before every commit

```bash
npm run check
```

It fails on banned words, external URLs, network calls, a price that reads
differently in two places, a `$` amount without `data-price`, or a link to a
model that `models.html` does not have. Reword the page until it passes.
Never shorten the banned list to make it pass.

The check only catches words. It will not catch a sentence that gives the
game away in plain language ("the name you call is the name you see in the
response"). Read your own copy with the rule above in mind.

## Conventions

- Site copy is English, short and concrete.
- Colours are tokens on `:root`, redefined for dark mode in both the
  `prefers-color-scheme` block and `[data-theme="dark"]`. Add a new colour
  to all three.
- Layouts must work at 375px wide with no horizontal scroll.
- Preview locally with `npx wrangler dev` (http://localhost:8787).
