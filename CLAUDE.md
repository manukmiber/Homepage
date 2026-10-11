# CLAUDE.md

This repository is the public ZeikoAI website. It shows **the models, their
prices, and how each model is performing** — and, behind sign-in, **the
customer's own Zeiko Account** (`/account`): where Pranata V1 plans and the
balance are bought and the key is handed over.

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

**The one exception is the account area (`/account`, below)**, on the
operator's explicit request: there, the customer's own money (plan, balance,
payments, renewals, the payment page) and the details they get with their
key (the key itself, the address it goes with) may be shown. Everything
else above stays banned there too — architecture, what runs the models,
infrastructure, decision logic — and the public pages keep the rule whole:
a plan card says "Buy", never how payment works.

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
- How to request a key (the contact section) for the roleplay models, and
  "Buy" / "Create an account" for Pranata V1.
- A "Sign in" link to `/account`.

## Layout

```
public/
  index.html      landing: Pranata V1 hero and #decision first, then the roleplay
                  models, pricing + cost estimator, FAQ, contact
  models.html     /models: at-a-glance table, then each model's specs and rate card
  404.html
  _redirects      old /models/<id> links → /models#<id>
  css/style.css   the only stylesheet; colour tokens for light and dark
  js/main.js      theme, mobile menu, topbar, copy buttons, effort bars, plan
                  value, estimator, chart hover
src/
  worker.js       runs for /models only: fills its placeholders from the snapshot
  render.js       snapshot → HTML for those placeholders; numbers only
  account/        Zeiko Accounts (/account): index.js routes, views.js pages,
                  crypto.js signed cookies, service.js the accounts service
dev/
  sample-stats.mjs  made-up figures for local development and the check
scripts/
  check-site.mjs  leak scan + price consistency + rendered /models and /account (npm run check)
wrangler.jsonc    static assets, plus the worker for /models and /account and its R2 binding
```

Everything is a static file except `/models` and `/account`, and the browser
never asks for anything but this site's own files:

- **One piece of server code.** `src/worker.js` runs for `/models` and
  `/account` only (`run_worker_first`). It reads the hourly snapshot from the `MODELS` R2
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
  rendered on the server; JavaScript only adds chart hover, the estimator
  and the plans' "requests per dollar" line (both stay hidden without it).
- If the snapshot is missing or unreadable, `/models` goes out as the static
  file, with "not available right now" where the figures would be.

## Zeiko Accounts (`src/account/`)

One account for ZeikoAI and Zeiko Chat: the same login (email and password,
Google, GitHub) and **one balance** for both. `/account` is rendered by the
Worker from the accounts service (`service.js`, server to server with
`ACCOUNTS_URL` + `ACCOUNTS_TOKEN`); the browser never sees that address.

- **Nothing is stored here.** The session is an HMAC-signed cookie
  (`zk_s`, `crypto.js`, `SESSION_SECRET`), the Google/GitHub state another
  (`zk_o`, ten minutes). Every page asks the service again.
- **Every page works with JavaScript off**: every action is a `<form>` POST
  with a CSRF value that must equal its `zk_c` cookie, and a foreign
  `Origin` is refused. No `fetch` in `public/` still holds.
- **Only fixed sentences come from the address bar** (`?m=` → `FLASH`). A
  query string is the visitor's text; printing it would let anyone make the
  site say anything. Everything from the service goes through `esc`.
- **4xx messages from the service are shown as written** (they are written
  for customers); a 5xx or an unreachable service is "not available right
  now". `next=` only ever points at `/account…` (`safeNext`).
- Sign-up asks for a username: the account is also a Zeiko Chat account.
  Confirmation and password-reset emails are Zeiko Chat's own (its links,
  its reset page); this site sends no mail.
- Pages answer with `no-store`, `X-Frame-Options: DENY` and a CSP of
  `'self'` only (no inline styles: progress bars are SVG attributes).
- Settings are Worker secrets, never in `wrangler.jsonc`: `ACCOUNTS_URL`,
  `ACCOUNTS_TOKEN`, `SESSION_SECRET` (32+), optional `GOOGLE_CLIENT_ID`/
  `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`,
  `API_BASE_URL`. Locally: `.dev.vars` (gitignored).
- `npm run check` renders every account page from a made-up account laced
  with `<script>` and holds it to the banned list minus billing and
  connection details. Keep new pages in that list.
- UI words: "Account", never "dashboard" (banned); CSS class names ship in
  `public/` and are scanned too (`.funds`, not `.topup`).

## Prices: one key, many places

Each rate appears in several places, and every one of them is marked with
`data-price="<model-id>:<rate>"`. The rate keys are `input`, `cache`, `out`
(standard band), `out-none` and `out-max`. The refused-request fee is just
`data-price="refusal"`.

Pranata V1 has its own keys: `pranata-v1:input` (per million
input tokens) and `decision:<plan-id>` for each plan (`welcome`, `expand`,
`huh`, `question`, `enough`).

When a rate changes, change **every** element that carries its key:

- `index.html`: the effort card in `#models` (Jagad only), the model cards,
  the pricing table, and the refusal card and FAQ entry.
- `models.html`: the at-a-glance table and that model's rate card.
- Decision: `index.html`'s hero (the lede and the facts under the buttons:
  `pranata-v1:input` and `decision:welcome`), its `#decision` section (the
  facts strip and the plan cards) and `models.html`'s Decision sheet (its
  rate table).

The estimator reads its rates from the pricing table (`#rateTable`), the
effort bars size themselves from their prices, and each plan's "requests per
dollar" line, its meter and the "Best value" tag are worked out from the
plan's `data-price` and `data-requests`, so none of them needs editing. A
plan's `data-requests` must match the requests written on its card.
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
The operator removed the "Active users" figure; do not bring back a typed-in
user count. The high-demand notice is the operator's wording; take it down
when they say so. Plan cards link to `/account/plans?plan=<id>` ("Buy"); the
plan ids there must stay the accounts service's (`welcome`, `expand`, `huh`,
`question`, `enough`).
The model's id is `pranata-v1` (display name Pranata V1).

Pranata V1 leads the landing page, on the operator's request: the hero is
its own (name, price, "Create an account", the example answers card), then
`#decision`, and only then the roleplay models. It has its own accent,
`--dec` (teal), beside the site's `--brand` (indigo) used for the roleplay
models. The example answers card in the hero is illustrative and labelled
so ("Example answers"): fixed, made-up percentages showing what an answer
looks like, never a measured figure and never animated.

## Adding, renaming or removing a model

- `index.html`: the model card, a `<tr data-model="…">` row in the pricing
  table, the "Models" stat, and "three"/"3" in the copy and meta tags.
- `models.html`: a jump chip, an at-a-glance row, and a full
  `<article id="<model-id>">` sheet (copy one of the existing ones).
- The FAQ entry "Which roleplay model should I pick?".
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
