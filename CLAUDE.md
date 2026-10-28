# CLAUDE.md

This repository is the public ZeikoAI website. It shows **the models, their
prices, and how each model is performing** — and, behind sign-in, **the
customer's own Zeiko Account** (`/account`): where Pranata V1 plans and the
balance are bought and the key is handed over.

`/models` stays: it is where visitors look the models up, with each model's
live performance figures. `/docs` is the documentation: the products, the
account, pricing, and the API (below). `/drive` (and `/id/drive`) is **Zeiko
Drive**, the file storage on the same account, whose app is at its own
address, `https://drive.zeiko.biz.id` (below).

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

**The third exception is Zeiko Drive**, on the operator's request (October
2026: the rule above is for the AI products). Its own pages (`drive.html`,
`id/drive.html`) and blocks marked `<!-- drive:start -->` … `<!-- drive:end -->`
may say what a storage product has to say — storage, prices in rupiah,
paying for a plan — and every page may link to the app at
`https://drive.zeiko.biz.id`, or at `/dashboard` (the path only; the word on
its own stays banned). Everything else above holds
there too, and the AI products' copy keeps the rule whole.

**The fourth exception is Zeiko Hosting**, on the operator's request (October
2026). Its own pages (`hosting.html`, `id/hosting.html`) and blocks marked
`<!-- hosting:start -->` … `<!-- hosting:end -->` (the homepage's window and
About column, the hosting docs; in the account area's script,
`// hosting:start` … `// hosting:end`) may name what a hosting plan comes
with — web and object storage, MySQL databases, Cloudflare CDN — its prices
in rupiah, and paying for one. Everything else above holds there too. **Who runs the hosting is
never named or hinted at anywhere in this repository** — pages, comments,
commit messages: say what the customer gets, never where it comes from.

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
- A "Sign in" link to `/account`, which becomes the visitor's own name once
  they are signed in (below, "Who is signed in").

## Layout

```
public/
  index.html      landing, drawn as a desktop: icons down the side, one window per
                  section (Pranata V1 hero and #decision first, then Zeiko Drive
                  (#drive), the roleplay models, pricing + cost estimator, FAQ,
                  contact, About), and a taskbar whose Start menu is the navigation
  id/             every page above and below in Indonesian (see "Two languages")
  drive.html      /drive: Zeiko Drive's features, plans (drawn from Drive's catalog), FAQ
  id/drive.html   /id/drive: the same page in Indonesian
  hosting.html    /hosting: Zeiko Hosting's plans (typed here, in rupiah), what runs on
                  it, static sites, the way from order to online, FAQ (a static file)
  id/hosting.html /id/hosting: the same page in Indonesian
  models.html     /models: at-a-glance table, then each model's specs and rate card
  404.html
  _redirects      old /models/<id> links → /models#<id>
  img/            logo.svg / logo-day.svg: the Zeiko mark, shared with Zeiko Chat;
                  mark-16.svg / mark-32.svg: the same mark drawn in pixels (title
                  bars, the Start button, the favicon); icons/: 16×16 pixel icons
                  drawn for Zeiko, shown at 16 or 32 px, never another size
  fonts/          Arimo and Cousine (woff2, Latin subset), the site's own font
                  files; their licences are in fonts/ at the repository's root
  css/style.css   the only stylesheet; colour and bevel tokens for light and dark
  js/main.js      theme, mobile menu, topbar, copy buttons, effort bars, plan
                  value, estimator, chart hover, and the homepage desktop (caption
                  buttons, taskbar buttons, the Start menu, the clock)
  js/try.js       the homepage playground (#try): asks the account door's /v1/try
  docs/           /docs: one plain page per topic (index.html is /docs/)
  account/index.html  /account and every page under it: one plain page
  js/account/     Zeiko Accounts: app.js asks the account door, views.js draws,
                  lang.js picks English or Indonesian, payguide.js (and
                  payguide.id.js) is the buying guide's text, me.js names the
                  person for the top bar, session.js (on every page) asks who is
                  signed in
src/
  worker.js       fills /models from the snapshot and /drive from Drive's catalog,
                  sends /dashboard… to Drive's address, answers 404.html for the rest
  render.js       snapshot → HTML for those placeholders; numbers only
  drive.js        Drive's address (DRIVE_URL, driveAddress); Drive's catalog → plan
                  cards (numbers and escaped plan names only) and Zeiko S3's lines
dev/
  sample-stats.mjs  made-up figures for local development and the check
scripts/
  check-site.mjs  leak scan + price consistency + rendered /models and /account
                  + docs links and docs list (npm run check)
wrangler.jsonc    static assets, plus the worker for /models, /drive and /account, its R2
                  binding, and (in production) the DRIVE service binding
```

Everything is a static file except `/models`, and the browser never asks
for anything but this site's own files — **except the account area** (below),
whose script talks to the account door and nowhere else:

- **One piece of server code.** `src/worker.js` runs first for `/models`,
  `/drive`, `/id/drive`, the homepage (`/`, `/id/`) and `/account` (`run_worker_first`), and for any path
  that is no file (`/dashboard…`, below, or a 404); for `/account…` it only hands back
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
- **No runtime requests.** No `fetch`, XHR, WebSocket, analytics, third-party
  web fonts or CDN scripts (the fonts are the site's own files, in
  `public/fonts`). The network tab shows only this site's own files. Three
  exceptions, all to the account door only: `public/js/account/app.js`, the
  top bar's `public/js/account/session.js` (see "Who is signed in"), and the
  homepage playground `public/js/try.js` (see "The playground").
- **No build step**, no framework, no dependencies besides wrangler.
- Every page must read fine with JavaScript off, except the account area
  and the playground, which need it and say so (`<noscript>`). The figures and charts are
  rendered on the server; JavaScript only adds chart hover, the estimator
  and the plans' "requests per dollar" line (both stay hidden without it).
- If the snapshot is missing or unreadable, `/models` goes out as the static
  file, with "not available right now" where the figures would be.

## Zeiko Drive (`/drive`, `drive.zeiko.biz.id`)

Zeiko Drive is its own Worker at its own address, `https://drive.zeiko.biz.id`
(the operator's, October 2026; it was `/dashboard` on this site before). It
is paid by QRIS only — that is Drive's rule, set in Drive. Here it is two
things:

- **The product page**, `/drive` and `/id/drive`: plain files whose plan
  cards (`[data-drive-plans]`), lowest price (`[data-drive-from]`) and family
  lines (`[data-drive-family]`, hidden until a family plan is on sale) are
  filled by `src/worker.js` from Drive's public catalog, through
  `src/drive.js`. Prices are set where Drive's plans are run, so the page
  never carries a typed price; without Drive it says the plans show soon.
- **Zeiko S3** (Drive's object storage, the operator's, October 2026): a
  window on the homepage (`#s3`, with its desktop icon, Start menu line and
  footer link) and a section on `/drive` (`#s3`), all in Drive blocks and all
  marked `data-s3 hidden` in the files. **They stay hidden until Drive says
  Zeiko S3 is open** (the catalog's `capabilities.s3`); then `src/worker.js`
  removes `hidden` and fills `[data-s3-facts]` with `src/drive.js::renderS3`:
  the price per GB, three copies, downloads and an address of one's own, each
  line only while Drive says that part works, numbers only. The homepage goes
  through the worker for this and leaves untouched while Zeiko S3 is closed;
  the catalog is asked at most once a minute (`driveCatalog`). `main.js` gives
  a window still hidden no caption or taskbar button. `npm run check` fails a
  `data-s3` block that is not hidden and renders `renderS3` from a catalog
  laced with junk text. No hostname, tool name, `bucket` or `region` on the
  page: say what it does for the visitor.
- **The way back to the app**: "Open Drive" links go straight to
  `https://drive.zeiko.biz.id` (`DRIVE_URL` in `src/drive.js`; the check lets
  that one address through, on any page and in the account files).
  `/dashboard…` — the app's old address here — is sent there with the same
  path (`driveAddress`, 302), for old links and the `?next=/dashboard` on
  this site's own sign-up links. Because that path must reach the worker,
  `not_found_handling` is `none` and the worker answers `404.html` itself.
  The `DRIVE` service binding is only for the catalog.
- Sign-in from Drive comes back straight to Drive (see "Signing in for Zeiko
  Drive"), and a Drive QRIS payment's page goes back to Drive (`driveBack`:
  one of this site's subdomains, or `/dashboard…` here).
- **The Drive window** beside the copy on `/` (`#drive`), `/drive` and
  `/id/drive` (`.drv`) is an illustration and says so ("Illustration" /
  "Ilustrasi"): fixed, made-up files and sizes, never a real figure and
  never animated, like the hero's example answers card.
- **EN | ID**: see "Two languages" below.

## Zeiko Hosting (`/hosting`)

WordPress hosting (PHP, Node.js, Python and Ruby run too), managed in
cPanel, sold in rupiah by plan — Mini, Small, Medium, Large, Extra Large;
monthly or yearly, a year being ten months; the first month of the three
smaller plans cheaper on an account's first hosting — and static sites per
GB (the operator's, October 2026).

- **Prices are typed in the pages** with `data-price="hosting:<plan>"`,
  `:first`, `:year` and `:save` keys, so `/hosting`, `/id/hosting`, the
  homepage window and the docs must agree (`npm run check`). Rupiah is
  written `Rp17.000` in both languages. The door's prices (the relay's
  `hosting.plans`) are what is actually asked: change both together.
- **The address** (the operator's, 2026-10-27): every hosting starts on a
  free one of its own, six random letters and digits under zeiko.biz.id
  (`k3x9qa.zeiko.biz.id`, made by the door). A name of the customer's own
  goes **straight under zeiko.biz.id** (`toko-bunga.zeiko.biz.id`, the
  owner's of 2026-10-28; `hosting:name`, Rp3.000) or their own domain
  (`hosting:domain`, Rp5.000), each paid by three months in the same QRIS
  as the hosting: the first three with the order, the next with the renewal
  that needs them. **6 months** (six months' price) or a year may take a
  **free .my.id/.biz.id/.web.id domain** as the address (`address: gift`,
  typed as `giftDomain`; the option and its field hide while Monthly is
  picked, `.host-gift`), free for its first year, then `hosting:domain`
  per 3 months. **The setup** (`hosting:setup`, Rp5.000) is paid once,
  with the first payment. Changing a running hosting's
  address is one flat price, once: `hosting:move-name` (Rp3.000) or
  `hosting:move-domain` (Rp5.000).
  **Egress**: 500 GB a month free, then `hosting:egress` (Rp5.000) per
  500 GB by the GB (`hosting:egress-gb`, Rp10), measured by the door each
  month and added to the next renewal. The door's `hosting.nameIdr`,
  `domainIdr`, `nameMoveIdr`, `domainMoveIdr` and `egressBlockIdr` are what
  is asked: change them with the pages. The public pages say "added to
  your next renewal" — never "billed" (`ditagih` is banned too), nor
  "counted by" (a tokenizer word on this site).
- **Support is WhatsApp** (the owner's, 2026-10-28): payments, support and
  questions go to `https://wa.me/6281932416096` (+62 819-3241-6096,
  08.00–22.00 WIB) on every page and in the account area — the one
  outside address the check lets through besides Drive's, with an optional
  `?text=`. No page sends people to an email address.
- **Ordering is in the account area** (`/account/hosting`,
  `views.js::hosting`): each plan's Order button opens it with `?plan=`;
  the person picks an address (`address`: `free`, `name` with `name`, or
  `own` with `domain`; `views.js::addressFields`, the field for the choice
  shown by `:has()`), picks monthly or yearly, and pays by QRIS on
  the ordinary `/account/pay` page (`product: "hosting"`, which goes back to
  `/account/hosting`). A running hosting's card has **Change the address**
  (a name or a domain, one flat price). The
  door is `GET /v1/hosting` (plans, `address`, `egress`, and per hosting
  `renew.month`/`renew.year` with what each carries and `move`),
  `POST /v1/hosting/order`, `/v1/hosting/{id}/renew`, `/address` and
  `/cancel`. The
  relay checks the payment by hand and the operator makes the hosting by
  hand; the page promises 1–5 minutes for the first and **1–2 hours** for
  the second (the owner's, 2026-10-27, for hosting and VPS alike). Static
  sites are still ordered by email (a `mailto:`).
- **Upgrades** (the owner's, 2026-10-27): a running hosting's card offers
  the dearer plans on sale (`upgrade: [{id, name, monthIdr, priceIdr}]`
  from `GET /v1/hosting`), each at what the door asks for the days left;
  "Upgrade and pay by QRIS" posts `/v1/hosting/{id}/upgrade {plan}` and opens
  the ordinary pay page. A paid one shows as "Upgrading to …" until the
  operator has made it (`nextPlan`, `nextPlanName`). No downgrade: a plan
  is ended (below) and a new one ordered.
- **The docs** (`/docs/hosting`, `hosting-domain`, `hosting-sites`, and their
  Indonesian twins) are the customer's how-to: the welcome email, connecting
  a domain, SSL, cPanel, apps. They name cPanel's own menus; the details a
  customer gets with their hosting (panel address, nameservers, IP) are
  never written on the site — they come in the welcome email.
- **Never promise what the plan cannot give.** Each feature on the page must
  be one the hosting really has; ask the operator before adding one.

## Zeiko VPS and Zeiko S3 in the account (`/account/vps`, `/account/s3`)

The owner's (2026-10-27): one client area on the Zeiko Account for hosting,
VPS and S3 — buy, renew, upgrade — paid by QRIS.

- **VPS** (`views.js::vps`, `vpsCard`; `app.js::vpsPage`): everything comes
  from the door's `GET /v1/vps` — plans (vCPU, RAM, NVMe, object storage;
  a month, `halfYearIdr` for 6 months, a year), the systems (`templates`),
  `setupIdr` (once, with the first payment) and `gift {months, tlds}` (a
  free .my.id/.biz.id/.web.id domain from 6 months). The order form posts
  `/v1/vps/order {plan, cycle: month|half|year, template, name, password,
  domain, lang}`; a refused order is drawn again with what was typed,
  **the password left out**, and the password is never drawn into a page.
  A system may carry a licence, paid once with the setup (`extraIdr`:
  Windows +Rp20.000), said beside it; the free domain field hides while
  Monthly is picked; the free domain is free for its first year, then carried by
  the renewals at `gift.domainIdr` per 3 months (each renewal button's
  total includes it, and the line under them says so).
  Cards renew (`/renew {cycle}`), upgrade (`/upgrade {plan}`, the same
  `upgradeBlock` as hosting) and cancel an unpaid order.
- **Ending a plan** (hosting and VPS, `endBlock`, `endedLine`): there is no
  downgrade (the owner's: end it and order again; the refund is sent by
  hand within 3 working days). A paid card offers "End this plan" with the
  door's `end.refundIdr`, where to send it (`refundTo`, free text, required
  when there is money) and a box to tick; it posts `/v1/hosting/{id}/end`
  or `/v1/vps/{id}/end`. An ending card says what is coming
  (`refundAskedAt`, `refundIdr`, `refundTo`), an ended one that it was sent
  (`refundedAt`). The pay page says
  `product: "vps"` and goes back to `/account/vps`. No public VPS page yet:
  its prices are the door's only.
- **S3** (`views.js::s3`) is a tab that opens Zeiko S3 in Zeiko Drive
  (`https://drive.zeiko.biz.id/s3`), where it is bought, upgraded and
  renewed; the site shows no S3 price of its own.
- Both pages are hosting blocks for the check (`// hosting:start` …
  `// hosting:end` in `views.js`, `<!-- hosting:start -->` in their markup),
  and the check renders them in every state from the made-up account.
- On a phone the account tabs scroll sideways; `app.js::draw` brings the
  open one into the row.

## Two languages (EN | ID)

Every page is in English and in Indonesian (the operator's, October 2026):
`public/<page>.html` and its twin `public/id/<page>.html` — `/` and `/id/`,
`/models` and `/id/models`, `/drive` and `/id/drive`, `/docs/…` and
`/id/docs/…`, `404.html` and `id/404.html`.

- **The switch**: every page with the top bar has
  `<a class="lang-switch" href="<its twin>" hreflang="…" data-lang="…">`
  beside the theme button (on the homepage, in the taskbar's tray), and
  `<link rel="alternate" hreflang>` for both.
  `main.js` keeps the choice in the `zk_lang` cookie for the whole domain
  (Zeiko Drive reads it too); an Indonesian page sets it once if nothing is
  kept. `npm run check` fails a page without the switch, a switch to a page
  that does not exist, or a twin that does not switch back.
- **Links stay in the language**: an Indonesian page links to `/id/…` for
  every page that has a twin; the account pages (`/account…`) are one page
  for both languages.
- **Indonesian copy says the same as the English**, never more. Numbers are
  written the Indonesian way (2.048, 99,95%); prices stay in US dollars
  written as on the English pages (`$0.35`), so every `data-price` key reads
  the same everywhere. Product and plan names are not translated.
- **The rule holds in Indonesian too**: `scripts/check-site.mjs` has the
  banned words in Indonesian as well (penyedia, antrean, tagihan, bayar,
  langganan, kripto, dompet, basis data, dasbor, deteksi, klasifikasi,
  disimpan, penyimpanan, analitik, pelacakan…), with Drive's words
  (penyimpanan, bayar, pembayaran…) allowed in Drive blocks only, like
  storage and pay in English.
- **What scripts write**: `main.js` and `try.js` pick their words from the
  page's `<html lang>`; `src/render.js` renders `/models` with
  `render(view, 'en')` and `/id/models` with `render(view, 'id')` (labels,
  dates and number format, all in its `TEXT`); the worker answers
  `id/404.html` under `/id/` or for a `zk_lang=id` visitor.
- **The account pages** are drawn in the visitor's language
  (`public/js/account/lang.js`: the `zk_lang` cookie; `L(en, id)`). Every
  sentence in `views.js` and `app.js` is an `L('…', '…')`; the static shell
  (`account/index.html`) marks its words with `data-id`, `data-id-label` and
  `data-id-href`, which `app.js` swaps in. The buying guide is
  `payguide.js` and, in Indonesian, `payguide.id.js` (the same headings and
  anchors). The check renders every account page in both languages.
  Messages the account door writes come back in its own words (English).
- **A new page, or a change to one**, is made in both languages in the same
  commit. Every docs page has the same frame (top bar, both docs lists,
  pager, footer): a change to it goes into all 48 pages, and the two
  languages' docs lists and pagers stay the same.

## Zeiko Accounts (`public/account/`, `public/js/account/`)

One account for ZeikoAI, Zeiko Chat and Zeiko Drive: the same login (email
and password, Google, GitHub), and **one balance** for ZeikoAI and Zeiko Chat
(Drive has none: each Drive purchase is paid in the Drive app). `/account` is one plain page;
its script (`app.js`) asks the **account door** —
`https://auth.zeiko.biz.id`, the page's `<meta name="zeiko-accounts">` — for
everything, with the visitor's own cookie for the door
(`credentials: 'include'`). **The site holds no secret and no sign-in for
it**: no Worker code, no `ACCOUNTS_*`, no `SESSION_SECRET`, no Google or
GitHub keys. Google and GitHub sign-in start and finish at the door
(`/oauth/<name>`), which sends the browser back to `/account…`.

- **The door answers this site's pages only** and wants `X-Zeiko: 1` on every
  post (`app.js::ask` adds it). The address is in two places in
  `account/index.html` — the `<meta>` and the `connect-src` of its
  Content-Security-Policy — and in the `<meta>` of every public page with
  the top bar; `npm run check` holds them all to it.
- **The account area is the only place allowed a request**, to the door
  only, and only from `app.js` and `session.js`; `npm run check` scans its files with the
  account rules (money words and key details allowed, everything else
  banned — field names too: the door says `shown` for the key's ends, `key`
  for the key, `signInWith` for Google and GitHub).
- **Every value from the door or the visitor goes through `esc`**
  (`views.js`); the check renders every page from a made-up account laced
  with `<script>`.
- **Only fixed sentences come from the address bar** (`?m=` → `FLASH` in
  `app.js`). `next=` only ever points at `/account…`, a page of Zeiko Drive
  at its own address, or `/dashboard…` (`safeNext`).
- **4xx messages from the door are shown as written** (they are written for
  customers); a 5xx or no answer is "not available right now".
- Sign-up asks for a username and **the city the person lives in** (with
  an optional postal code; `cities.js` only suggests names): Zeiko Drive's
  local ads go by it, the operator's rule. The door refuses a sign-up with
  no city. An account without one (older, or Google/GitHub) gets a banner
  on every account page but Settings, whose **Where you live** card sets it
  (`POST /v1/location`).
- Sign-up also takes an optional **referral code**
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
  but 0 and 1). "I've paid" posts `/v1/payments/{id}/sent`, then the page
  says "Thanks, we're gonna check your payment" and opens `/account` after
  10 s (`thanks`, the operator's wording and timing). Opened again later,
  the payment page asks every 8 s until the operator pays it out or turns it
  down — only the operator can, by hand. QRIS, rupiah and IDR are money words: account area
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

## Who is signed in (`public/js/account/session.js`, `me.js`)

The account door's session (its cookie on its own host) is the only sign-in
there is: the site, Zeiko Drive and the account pages all ask it, and none
keeps one of its own. So every page with the top bar (on the homepage, the
Start menu, which keeps `id="nav"`) shows who that is:

- **Every page with the top bar** names the door in
  `<meta name="zeiko-accounts">` and loads
  `<script type="module" src="/js/account/session.js">`; `npm run check`
  fails a page with `.nav-account` that lacks either. The script asks the
  door `GET /v1/session` (with the visitor's cookie) and, signed in, puts the
  person's badge and name (`me.js::meLink`) where "Sign in" was.
- **`data-signed-out` / `data-signed-in`**: an element only for people
  without an account ("Create an account", "Already have one? Sign in") is
  hidden once someone is signed in; one only for people with one carries
  `hidden` in the page and is shown. Without JavaScript, or with the door
  not answering, the page stays as written: signed-out.
- **The tab keeps a hint of the name** (`sessionStorage` `zeiko.me`, set by
  `app.js` and `session.js`, dropped on sign-out), so the next page shows it
  at once; the door's answer always replaces it. It is asked again when the
  tab is looked at again, at most every 15 seconds.
- The account pages draw the same badge and name in their top bar
  (`views.js::nav(account)`), beside "Sign out".
- Every value from the door goes in escaped (`me.js::esc`, the one `esc`
  `views.js` uses too); the check renders the badge from a name laced with
  `<script>`.

## Signing in for Zeiko Drive (`next=`)

Zeiko Drive (its own address, `https://drive.zeiko.biz.id`) has no sign-in
of its own: it sends people to `/account/signin?next=https://drive.zeiko.biz.id/masuk?next=…`
and signs in by itself when they come back. So `next=` may be:

- one of the account pages (`/account…`);
- a page of Drive at its own address (`APPS` in `app.js`: that origin
  exactly, a plain path and query, no user, no fragment); the sign-in pages
  then say "…to open Zeiko Drive";
- `/dashboard…`, Drive's old address here, which `src/worker.js` still
  forwards there for old links.

Anything else goes to `/account`. The door's Google and GitHub sign-in hold
`next` to the same rule (Drive's address there is the door's own setting).

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
`#decision`, and only then the roleplay models. The example answers window
beside the hero is illustrative and labelled so ("Example answers"): fixed,
made-up percentages showing what an answer looks like, never a measured
figure and never animated (only the playground's live answer fills in).

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

## The docs (`public/docs/`, `public/id/docs/`)

`/docs` is twenty-one plain pages, one per topic, grouped Get started
(`index`, `account`, `playground`), Models (`pranata-v1`, `roleplay`,
`pricing`), API (`api`, `api-decisions`, `api-chat`, `faq`), Zeiko Drive
(`drive`, `drive-plans`, `drive-files`, `drive-sharing`, `drive-safety`,
`drive-faq`) and Drive tools (`drive-tools`, `drive-photo`, `drive-pdf`,
`drive-docs`, `drive-video`), each with its Indonesian twin
under `/id/docs/`. `/docs/<name>` serves `docs/<name>.html`; `/docs` itself
goes to `/docs/`. The Zeiko Drive pages are written from the Drive app
itself (its own words and button names) and sit in Drive blocks; they never
type a Drive price: plans and prices are on `/drive`. They read fine with
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

- Site copy is English and Indonesian, short and concrete; "kamu", not
  "Anda", in Indonesian.
- Colours are tokens on `:root`, redefined for dark mode in both the
  `prefers-color-scheme` block and `[data-theme="dark"]`. Add a new colour
  to all three.
- Layouts must work at 375px wide with no horizontal scroll.
- **The look is Windows 95** (the operator's, October 2026; `PRODUCT.md`,
  `DESIGN.md`): grey chrome with two-pixel bevels (the `--raise`, `--sunk`…
  tokens), navy title bars, white wells for documents and fields, navy blocks
  for every probability and meter, a teal desktop, and a night appearance
  scheme beside the standard one. The homepage is the desktop; every other
  page is one maximised window (title bar, menu bar, the page, a status bar).
  No Windows or Microsoft name, logo or icon: the Start button carries the
  Zeiko mark and every icon is drawn for Zeiko.
- Preview locally with `npm run seed:local` once (made-up figures into the
  local bucket), then `npx wrangler dev` (http://localhost:8787).
- Charts: thin marks, hairline grid, one colour per series from the
  `--series-*` tokens (validated for colour-blind separation in both themes),
  a legend only when a chart has two series, and a table view under them.
