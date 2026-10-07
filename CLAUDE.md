# CLAUDE.md

This repository is the public ZeikoAI website. It shows **the models, their
prices, and how each model is performing.** Nothing else.

`/models` stays: it is where visitors look the models up, with each model's
live performance figures.

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
- **Tokenizer**: which tokenizer is used or how tokens are counted. Say
  "priced per million tokens" and stop there.
- **Billing**: invoices, billing periods, payment methods or currencies
  (USDT, TRC20, IDR), tax, subscriptions, how or when a customer is charged.
  The site shows prices, never billing.
- **Infrastructure**: where or how the API is hosted, Workers, R2, KV, D1,
  databases, buckets, logs, dashboards, admin panels, internal repositories,
  environment variables, secrets.
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
  that reasoning tokens count as output.
- Each model's performance on `/models`, over the last 24 hours, 7 days and
  30 days, each beside the window before it: time to first token, output
  speed, latency, availability, requests, input and output tokens, cache
  rate, and their charts. Say where they come from as "updated every hour"
  and stop there.
- How to request a key (the contact section).

## Layout

```
public/
  index.html      landing: hero, models, pricing + cost estimator, FAQ, contact
  models.html     /models: at-a-glance table, then each model's specs and rate card
  404.html
  _redirects      old /models/<id> links → /models#<id>
  css/style.css   the only stylesheet; colour tokens for light and dark
  js/main.js      theme, mobile menu, copy buttons, hero bars, estimator, chart hover
src/
  worker.js       runs for /models only: fills its placeholders from the snapshot
  render.js       snapshot → HTML for those placeholders; numbers only
dev/
  sample-stats.mjs  made-up figures for local development and the check
scripts/
  check-site.mjs  leak scan + price consistency + rendered /models (npm run check)
wrangler.jsonc    static assets, plus the worker for /models and its R2 binding
```

Everything is a static file except `/models`, and the browser never asks for
anything but this site's own files:

- **One piece of server code.** `src/worker.js` runs for `/models` only
  (`run_worker_first`). It reads the hourly snapshot from the `MODELS` R2
  binding and fills the page's placeholders (`data-perf-bar`, `data-perf`,
  `data-stat`) before the page leaves. Every other path never reaches it.
- **`src/render.js` is the only door from the snapshot to the page.** It
  reads numbers and nothing else; every string on the page is a fixed label
  written there or a number formatted there. The snapshot carries other
  fields; never copy one of them, or any text at all, onto the page. The
  check renders a sample laced with junk text and fails if any gets through.
- **Never serve the snapshot to the browser**, whole or in part: no data
  file, no JSON endpoint, no inline JSON. Only finished HTML goes out.
- **No runtime requests.** No `fetch`, XHR, WebSocket, analytics, web fonts or
  CDN scripts. The network tab shows only this site's own files.
- **No build step**, no framework, no dependencies besides wrangler.
- Every page must read fine with JavaScript off. The figures and charts are
  rendered on the server; JavaScript only adds chart hover and the estimator
  (which stays hidden without it).
- If the snapshot is missing or unreadable, `/models` goes out as the static
  file, with "not available right now" where the figures would be.

## Prices: one key, many places

Each rate appears in several places, and every one of them is marked with
`data-price="<model-id>:<rate>"`. The rate keys are `input`, `cache`, `out`
(standard band), `out-none` and `out-max`. The refused-request fee is just
`data-price="refusal"`.

Pranata V1 has its own keys: `pranata-v1:input` (per million
input tokens) and `decision:<plan-id>` for each plan (`welcome`, `expand`,
`huh`, `question`, `enough`).

When a rate changes, change **every** element that carries its key:

- `index.html`: the hero rate card (Jagad only), the model cards, the pricing
  table, and the refusal note and FAQ entry.
- `models.html`: the at-a-glance table and that model's rate card.
- Decision: `index.html`'s `#decision` section (per-token card and plan
  cards) and `models.html`'s Decision sheet (its rate table).

The estimator reads its rates from the pricing table (`#rateTable`), and the
hero bars size themselves from their prices, so neither needs editing.
Any new `$` amount on a page must carry a `data-price` key too.

## Pranata V1 stands apart

The decision model is not one of the roleplay models and must not be mixed in
with them: it has its own section on both pages (`#decision` on the landing
page, its own sheet below the roleplay sheets on `/models`), it is not in the
pricing table, the estimator, the at-a-glance table or the "Models: 3" stat,
and plans cover it only. Its figures on `/models` come from the snapshot's
`decisions` block and `per_second` (calls, not streamed replies:
`render.js::decisionSection`) — measured counts only. Never put a made-up,
animated or "live-looking" number in the figures; they are hourly and say so.
"Active users: about 890" is the operator's own figure, written as static copy
beside the specs, never in the measured panel; change it when they do. The
high-demand notice is the operator's wording; take it down when they say so.
The model's id is `pranata-v1` (display name Pranata V1).

## Adding, renaming or removing a model

- `index.html`: the model card, a `<tr data-model="…">` row in the pricing
  table, the "Models" stat, and "three"/"3" in the copy and meta tags.
- `models.html`: a jump chip, an at-a-glance row, and a full
  `<article id="<model-id>">` sheet (copy one of the existing ones).
- The FAQ entry "Which model should I pick?".
- `models.html`: the model's `data-perf` section and its three `data-stat`
  cells in the at-a-glance table. Its figures appear once the snapshot
  carries that model id.

## Before every commit

```bash
npm run check
```

It fails on banned words, external URLs, network calls, a price that reads
differently in two places, a `$` amount without `data-price`, or a link to a
model that `models.html` does not have. It also renders the made-up sample
through `src/render.js` and holds that output to the same rules, fails if any
text from the snapshot reaches it, and fails if a placeholder on `/models`
would stay empty. Reword the page until it passes. Never shorten the banned
list to make it pass.

The check only catches words. It will not catch a sentence that gives the
game away in plain language ("the name you call is the name you see in the
response"). Read your own copy with the rule above in mind.

## Conventions

- Site copy is English, short and concrete.
- Colours are tokens on `:root`, redefined for dark mode in both the
  `prefers-color-scheme` block and `[data-theme="dark"]`. Add a new colour
  to all three.
- Layouts must work at 375px wide with no horizontal scroll.
- Preview locally with `npm run seed:local` once (made-up figures into the
  local bucket), then `npx wrangler dev` (http://localhost:8787).
- Charts: thin marks, hairline grid, one colour per series from the
  `--series-*` tokens (validated for colour-blind separation in both themes),
  a legend only when a chart has two series, and a table view under them.
