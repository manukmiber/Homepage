# CLAUDE.md

This repository is the public ZeikoAI website. It shows **the models, their
prices, and how each model is performing** — and, behind sign-in, **the
customer's own Zeiko Account** (`/account`): where Pranata V1 plans and the
balance are bought and the key is handed over.

`/models` stays: it is where visitors look the models up, with each model's
live performance figures. `/docs` is the documentation: the products, the
account, pricing, and the API (below).

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

**The second exception is the docs (`public/docs/`)**, on the operator's
explicit request: they may show the connection details a caller needs — the
API's address (`https://ai.zeiko.biz.id/v1`, the only other address they may
name), its endpoint paths, the `Authorization: Bearer` header, and `curl`
and SDK examples (whose key parameter is `api_key` / `apiKey`). A key is
always `YOUR_API_KEY` or `$ZEIKO_API_KEY`: never the key format, its prefix
or an example key. Everything else above stays banned there too — billing
included: the docs say "buy a plan" and "add balance", never how payment
works; that is the buying guide's, inside the account area.

The same rule covers everything else in this repository: README, code
comments, commit messages, PR titles and PR descriptions. Never name or
describe the API's backend or the relay. Writing about how *this static
site* is built and deployed is fine.

## What the site may show

- Each model's display name, model ID, one-line description, and content
  rating (SFW / Adult / Unrestricted).
- Context window (256K), max output (32,000 tokens), streaming support, the
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
- The playground (`#try`, below): "5 free tries every 30 minutes" and
  nothing more about what a try costs or whose plan it uses.
- The docs (`/docs`, below): all of the above, plus how to call the API.
- A "Sign in" link to `/account`.

## Layout

```
public/
  index.html      landing: Pranata V1 hero and #decision first, then the roleplay
                  models, pricing + cost estimator, FAQ, contact
  models.html     /models: at-a-glance table, then each model's specs and rate card
  404.html
  _redirects      old /models/<id> links → /models#<id>
  img/            logo.svg / logo-day.svg: the Zeiko mark, shared with Zeiko Chat,
                  night and day drawings shown by theme (`.logo-night`, `.logo-day`)
  css/style.css   the only stylesheet; colour tokens for light and dark
  js/main.js      theme, mobile menu, topbar, copy buttons, effort bars, plan
                  value, estimator, chart hover
  js/try.js       the homepage playground (#try): asks the account door's /v1/try
  docs/           /docs: one plain page per topic (index.html is /docs/)
  account/index.html  /account and every page under it: one plain page
  js/account/     Zeiko Accounts: app.js asks the account door, views.js draws,
                  payguide.js is the buying guide's text
src/
  worker.js       runs for /models only: fills its placeholders from the snapshot
  render.js       snapshot → HTML for those placeholders; numbers only
dev/
  sample-stats.mjs  made-up figures for local development and the check
scripts/
  check-site.mjs  leak scan + price consistency + rendered /models and /account
                  + docs links and docs list (npm run check)
wrangler.jsonc    static assets, plus the worker for /models and /account and its R2 binding
```

Everything is a static file except `/models`, and the browser never asks
for anything but this site's own files — **except the account area** (below),
whose script talks to the account door and nowhere else:

- **One piece of server code.** `src/worker.js` runs for `/models` and
  `/account` only (`run_worker_first`); for `/account…` it only hands back
  `public/account/index.html`, so deep links open. It reads the hourly snapshot from the `MODELS` R2
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
  CDN scripts. The network tab shows only this site's own files. Two
  exceptions, both to the account door only: `public/js/account/app.js`, and
  the homepage playground `public/js/try.js` (see "The playground").
- **No build step**, no framework, no dependencies besides wrangler.
- Every page must read fine with JavaScript off, except the account area
  and the playground, which need it and say so (`<noscript>`). The figures and charts are
  rendered on the server; JavaScript only adds chart hover, the estimator
  and the plans' "requests per dollar" line (both stay hidden without it).
- If the snapshot is missing or unreadable, `/models` goes out as the static
  file, with "not available right now" where the figures would be.

## Zeiko Accounts (`public/account/`, `public/js/account/`)

One account for ZeikoAI and Zeiko Chat: the same login (email and password,
Google, GitHub) and **one balance** for both. `/account` is one plain page;
its script (`app.js`) asks the **account door** —
`https://auth.zeiko.biz.id`, the page's `<meta name="zeiko-accounts">` — for
everything, with the visitor's own cookie for the door
(`credentials: 'include'`). **The site holds no secret and no sign-in for
it**: no Worker code, no `ACCOUNTS_*`, no `SESSION_SECRET`, no Google or
GitHub keys. Google and GitHub sign-in start and finish at the door
(`/oauth/<name>`), which sends the browser back to `/account…`.

- **The door answers this site's pages only** and wants `X-Zeiko: 1` on every
  post (`app.js::ask` adds it). The address is in two places in
  `index.html` — the `<meta>` and the `connect-src` of its
  Content-Security-Policy — and `npm run check` holds both to it.
- **The account area is the only place allowed a request**, to the door
  only, and only from `app.js`; `npm run check` scans its files with the
  account rules (money words and key details allowed, everything else
  banned — field names too: the door says `shown` for the key's ends, `key`
  for the key, `signInWith` for Google and GitHub).
- **Every value from the door or the visitor goes through `esc`**
  (`views.js`); the check renders every page from a made-up account laced
  with `<script>`.
- **Only fixed sentences come from the address bar** (`?m=` → `FLASH` in
  `app.js`). `next=` only ever points at `/account…` (`safeNext`).
- **4xx messages from the door are shown as written** (they are written for
  customers); a 5xx or no answer is "not available right now".
- Sign-up asks for a username and takes an optional **referral code**
  (pre-filled from `?ref=` on any account page, kept 30 days on the
  browser). The door keeps the code and gives its discount at checkout.
- Zeiko Chat's plans and the balance are bought here beside Pranata V1's
  (`product` on the buy and subscribe forms); top-ups go to the balance. The
  door's payment page sends the buyer back to `/account?paid=<id>`, and the
  subscription plans to `/account?m=subscription-paid|-failed|-partial`.
- Confirmation codes and reset links are mailed by the door. The reset link
  opens `/account/reset?token=…`, the confirmation link
  `/account/verify?token=…`; the code is typed in the banner.
- The shell answers with `no-store`, `X-Frame-Options: DENY` (from the
  worker) and its own CSP of `'self'` plus the door (no inline styles:
  progress bars are SVG attributes).
- UI words: "Account", never "dashboard" (banned); CSS class names ship in
  `public/` and are scanned too (`.funds`, not `.topup`).
- **QRIS, beside crypto** (`/account/pay?id=`, `views.js::qrisPay`): a
  plan card's second button and the balance's "Pay with" choice send
  `method: "qris"`; the door answers the payment's `qris` (rupiah, merchant,
  NMID, state, and while it can be paid the QR as rows of `0`/`1`), and the
  page draws the QR as SVG itself (`qrSvg`, which draws nothing for anything
  but 0 and 1). "I've paid" posts `/v1/payments/{id}/sent`; the page asks
  again every 8 s until the operator pays it out or turns it down — only the
  operator can, by hand. QRIS, rupiah and IDR are money words: account area
  only, never on the public pages.
- **The buying guide is `/account/how-to-buy`** ("How to pay", with a
  QRIS section of this site's own first, then
  `views.js::howToBuy`, text in `payguide.js`): Zeiko Chat's
  `public/docs/payments.md`, copied word for word except what differs here
  (the website's button names, both products sold here, no emails the
  website does not send) and the words the account rules ban ("provider" is
  "platform"). Linked from Plans & balance, the Overview's Payments and the
  public docs. Not a tab: `PAGES` in `views.js` titles it. Exchanges are
  named, never linked (a mistyped exchange link is a phishing page); its one
  address is payment@zeiko.biz.id. Gemini is an exchange too: the check lets
  that one word through as a table row of its own (`<th scope="row">`).
  The public pages may not say "payments", so the path is `how-to-buy`.

## The playground (`#try` on the homepage, `public/js/try.js`)

On the operator's request, anyone can ask Pranata V1 one real question of
each kind — yes or no (`noul`), pick one (`choice`), score it (`score`) — right
after the hero, and see the answer with its probabilities.

- **It asks the account door, `GET`/`POST /v1/try`, and nothing else.** The
  door's address is the homepage's `<meta name="zeiko-accounts">`; the
  `POST` carries `X-Zeiko: 1` and the visitor's own cookie for the door
  (`credentials: 'include'`), so a signed-in visitor counts as their account.
  `npm run check` lets `fetch(DOOR …)` and the door's `/v1` path through in
  `try.js` only, and the door's address in that one `<meta>` only.
- **The limit lives in the account door**, never here: 5 free tries per 30
  minutes per visitor, a ceiling across everybody, free tries never touch a
  plan. Past them a signed-in
  person's tries go through their plan, then their balance, then are owed up
  to a small cap; the account page shows what is owed. **The public page says
  only "5 free tries every 30 minutes"** — never what a try costs, whose plan
  it uses or what is owed (billing stays off the public pages).
- **Every value that comes back goes in as text** (`textContent`), never as
  markup; 4xx messages from the door are shown as written, anything else is
  "not available right now".
- The examples in the form are fixed, made-up texts; the answer is the
  model's own, live. Nothing from a try is kept on the site.

## Prices: one key, many places

Each rate appears in several places, and every one of them is marked with
`data-price="<model-id>:<rate>"`. The rate keys are `input`, `cache`, `out`
(standard band), `out-none` and `out-max`. The refused-request fee is just
`data-price="refusal"`.

Pranata V1 has its own keys: `decision:<plan-id>` for each plan (`welcome`,
`expand`, `huh`, `question`, `enough`). On the operator's request Pranata V1
is sold by plan only: the site shows no per-token price for it (the old
`pranata-v1:input` key is gone; do not bring it back).

**Opening offers** (the operator's, October 2026): Expand runs 90 days for
the price of 30 for the first 1,000 people, once each; Question about
decision? runs 90 days when bought by 31 October (WIB). The door decides who
gets one (its plans carry `promo {days, until, left}`, which the account
page shows); the public pages only say so, in a `.plan-offer` line on the
plan card, the `/models` rate row and `docs/pricing.html`. A dated offer
carries `data-offer-until` and `main.js` hides it once passed, but the words
must still come off the pages afterwards — and the capped one when the
door's `left` reaches 0, which the site cannot see.

When a rate changes, change **every** element that carries its key
(`npm run check` fails until they all agree):

- `index.html`: the effort card in `#models` (Jagad only), the model cards,
  the pricing table, and the refusal card and FAQ entry.
- `models.html`: the at-a-glance table and that model's rate card.
- Decision: `index.html`'s hero (the lede and the facts under the buttons:
  `decision:welcome`), its `#decision` section (the
  facts strip and the plan cards) and `models.html`'s Decision sheet (its
  rate table).
- Docs: `docs/pricing.html` (every rate and plan), `docs/pranata-v1.html`
  (`decision:welcome`), `docs/index.html`
  (`decision:welcome`), `docs/roleplay.html` (Jagad's three output bands,
  `refusal`), `docs/api-chat.html` and `docs/faq.html` (`refusal`).

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

A model ID on the site is the API's own, exactly as `GET /v1/models` lists
it: lowercase (`jagad-512b-v1`, `wisanggeni-512b-v1`). It is what callers
copy, and the snapshot's figures are keyed on it. The display name
("Wisanggeni 512B V1") is only a label.

- `index.html`: the model card, a `<tr data-model="…">` row in the pricing
  table, the "Models" stat, and "three"/"3" in the copy and meta tags.
- `models.html`: a jump chip, an at-a-glance row, and a full
  `<article id="<model-id>">` sheet (copy one of the existing ones).
- The FAQ entry "Which roleplay model should I pick?".
- `models.html`: the model's `data-perf` section and its three `data-stat`
  cells in the at-a-glance table. Its figures appear once the snapshot
  carries that model id.
- The docs: `docs/roleplay.html` (the models table), `docs/pricing.html`
  (the rates table), `docs/api.html` (Model IDs), `docs/api-chat.html`
  (`model`), and "three" in their copy.

## The docs (`public/docs/`)

`/docs` is ten plain pages, one per topic, grouped Get started (`index`,
`account`, `playground`), Models (`pranata-v1`, `roleplay`, `pricing`) and
API (`api`, `api-decisions`, `api-chat`, `faq`). `/docs/<name>` serves
`docs/<name>.html`; `/docs` itself goes to `/docs/`. They read fine with
JavaScript off and load `main.js` only (theme, menu, the copy buttons on
code, which hide without it).

- **What the API does is written from the API itself**, never guessed: the
  request and answer shapes, limits and error codes are the ones the API
  returns. Change the docs with the API. Figures the site already states
  (256K context, 32,000 output tokens, 2,048 tokens per Pranata call) are
  the site's.
- **The docs list is in every page twice** — `.docs-list` beside the page,
  `.docs-menu` (a `<details>`) on a phone — in `index.html`'s order, with
  `aria-current="page"` on the page itself. A new page goes into all of
  them, and into the previous and next page's pager. `npm run check` holds
  every copy to `index.html`'s.
- Every `<h2>` has an `id`; the "On this page" box lists them. Links to
  `/docs/<name>#<id>`, and `#<id>` inside a docs page, must land: the check
  follows them.
- Code examples are `<div class="code">` with a `.code-bar` (label, Copy)
  and a `<pre id="code-N">`, its text HTML-escaped. Tables are
  `.doc-table` in a `.doc-table-wrap`; one of three columns or more with no
  figures to compare is also `.doc-table-cards` (one card per row on a
  phone, each `<td>` with a `data-label`).

## Before every commit

```bash
npm run check
```

It fails on banned words, external URLs, network calls, a price that reads
differently in two places, a `$` amount without `data-price`, a link to a
model that `models.html` does not have, or a docs link or docs list that
does not match the docs pages. It also renders the made-up sample
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
