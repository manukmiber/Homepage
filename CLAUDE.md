# CLAUDE.md

This repository is the public Zeiko website. It sells **Zeiko's cloud
products** — Zeiko Sites, Zeiko Hosting, Zeiko VPS and Zeiko Drive (with
Zeiko S3) — with their prices in rupiah, and, behind sign-in, holds **the
customer's own Zeiko Account** (`/account`): where those products are
ordered, paid by QRIS, renewed and run.

**The AI products are off the site** (the owner's, 2026-11-02: "mulai saat ini
kita fokus jualan cloud product, AI dan pranata kita tarik dulu"): no Pranata V1,
no roleplay models, no `/models`, no playground, no API docs. Old addresses
are sent on by `public/_redirects`. Do not bring any of it back without the
owner asking.

**Zeiko AI is linked for signed-in people only** (the owner's, 2026-11-03:
"cara akses dashboard ainya dari proxychat bisa langsung buka UI AI chat", then
"udah aku serve the page tapi di proxychat ga ada"). The chat app is at its own
address, `https://ai.zeiko.biz.id` (`AI_APP` in `app.js`), signed in with the
same Zeiko Account, and its token packs are bought there. Here it is a row in
the Overview's products (`views.js::productRows`), a "Zeiko AI" link after
Drive in the top bar's products once someone is signed in (`session.js::aiLink`
on the public pages, `views.js::nav` in the account area), and a `next=` a
sign-in may go back to (below). The pages themselves keep the AI products off
the site: no page, price, model name or link for it in any HTML file, so a
visitor who is not signed in never sees it, and `npm run check` lets that
address through in the account files only (`aiLink`).

The homepage's tab name is `Zeiko >_<` (the owner's, 2026-11-03: "nama tab
proxychat cukup"), in both languages; `og:title` keeps the long one for link
previews. The other pages keep their own titles.

`/docs` is the customers' guides to the products and the account.
`/drive` (and `/id/drive`) is **Zeiko Drive**, the file storage on the same
account, whose app is at its own address, `https://drive.zeiko.biz.id` (below).

## The rule: never leak anything about how it is built or run

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

**The docs had a second exception** for the API's connection details; it went
with the API docs (2026-11-02). The guides now hold to every rule above, and
connection details appear nowhere on the site.

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
2026). Its own pages (`hosting.html`, `vps.html`, `sites.html`, the homepage,
and their Indonesian twins: `HOSTING_PAGES` in the check) and blocks marked
`<!-- hosting:start -->` … `<!-- hosting:end -->` (the hosting docs and the
account guide; in the account area's script,
`// hosting:start` … `// hosting:end`) may name what a hosting plan comes
with — web and object storage, MySQL databases, Cloudflare CDN — its prices
in rupiah, and paying for one. Everything else above holds there too. **Who runs the hosting is
never named or hinted at anywhere in this repository** — pages, comments,
commit messages: say what the customer gets, never where it comes from.

## What the site may show

- Each cloud product: what it does in plain words, what every plan comes
  with, and every price, in rupiah, typed from the door's own lists
  (`data-price`, below) or, for Drive, drawn from Drive's catalog.
- How ordering works: the Zeiko Account, QRIS, the payment checked by hand in
  1–5 minutes, hosting and a VPS made within 1–2 hours, a website from Zeiko
  Sites at once.
- Help: WhatsApp `+62 819-3241-6096` (08.00–22.00 WIB; VPS 24/7), the guides
  (`/docs`), and the status page (`/status`).
- Labelled illustrations of a product's own screen ("Illustration"), with
  fixed, made-up content, never animated.
- A "Sign in" link to `/account`, which becomes the visitor's own name once
  they are signed in (below, "Who is signed in").

## Layout

```
public/
  index.html      the homepage (the owner's, 2026-11-02: the cloud products only):
                  "What do you want to put online?" and four needs, each with its
                  product and starting price (Drive's from its catalog), how ordering
                  works, what comes with every product, FAQ, WhatsApp. A hosting page
                  for the check (HOSTING_PAGES)
  id/             every page above and below in Indonesian (see "Two languages")
  drive.html      /drive: Zeiko Drive's features, plans (drawn from Drive's catalog), FAQ
  id/drive.html   /id/drive: the same page in Indonesian
  hosting.html    /hosting: Zeiko Hosting's plans (typed here, in rupiah), what runs on
                  it, static sites, the way from order to online, FAQ (a static file)
  id/hosting.html /id/hosting: the same page in Indonesian
  vps.html        /vps: Zeiko VPS's plans (typed here, in rupiah), systems, free domain,
                  the way from order to online, FAQ (a static file)
  id/vps.html     /id/vps: the same page in Indonesian
  sites.html      /sites: Zeiko Sites' school and business packages and the static site
                  by the GB (typed here, in rupiah), the way from order to online, FAQ
  id/sites.html   /id/sites: the same page in Indonesian
  marketing-template.html  /marketing-template: the seven A4 sheets (the poster of every
                  product, then Hosting, VPS, two for Sites, two for Drive), each with its
                  download button, and all of them in one ZIP; the sheets are in Indonesian
  id/marketing-template.html  /id/marketing-template: the same page in Indonesian
  status.html     /status: whether each service answers, filled by src/worker.js from
                  the status document (src/status.js); "not available" without it
  id/status.html  /id/status: the same page in Indonesian
  404.html
  _redirects      the AI products' old addresses (/models, the API docs) → / and /docs/
  img/marketing/  the sheets: a PNG (1588 × 2246) to download, a JPG preview (794 ×
                  1123) for the page, and zeiko-materi-promosi.zip with every PNG. They
                  are pictures, so the check cannot read their prices: when a price on
                  a product page changes, make the sheet again, and strip the export's
                  metadata (it names the design and its author) before it goes in.
                  zeiko-semua-produk.png, the poster of every product, is drawn from
                  dev/marketing/semua-produk.html (the command is in its head). It prints
                  Drive's Mini at Rp1 a month as a promo until 15 November 2026 (the owner's,
                  2026-11-02): after that day, make it again with Drive's price.
                  zeiko-vps.png is drawn the same way from dev/marketing/vps.html (the
                  owner's of 2026-11-03: the old sheet still had the first price list).
                  zeiko-hosting.png is still a design export, and still gives the free
                  address under zeiko.biz.id: make it again in dev/marketing/ next
  img/            logo.svg: the Zeiko mark (kawung: four petals round an amber
                  dot, brand/zeiko/); mark-16.svg / mark-32.svg: the same icon drawn in
                  pixels (the favicon); mark-mail.png: the icon the account emails
                  show. The site draws no other icons: words carry every action,
                  except os/: each VPS system's own logo (the owner's, 2026-11-03),
                  beside its name on /vps, the order form and the VPS sheet, on a light
                  tile (`--logo-tile`); their sources and licences are in brand/os/
  fonts/          Plus Jakarta Sans and Cousine (woff2, Latin subset), the site's own
                  font files; their licences are in fonts/ at the repository's root;
                  sites/: the fonts of Zeiko Sites' designs (TEMPLATES.md)
  css/site.css    the only stylesheet (DESIGN.md), for every page and the account
                  area: tokens for light and dark
  js/main.js      the light and dark switch, the language cookie, the header's shadow,
                  copy buttons, the footer's year
  docs/           /docs: the guides, one plain page per topic (index.html is /docs/)
  account/index.html  /account and every page under it: one plain page
  js/account/     Zeiko Accounts: app.js asks the account door, views.js draws,
                  lang.js picks English or Indonesian, payguide.js (and
                  payguide.id.js) is the buying guide's text, me.js names the
                  person for the top bar, session.js (on every page) asks who is
                  signed in; templates.js, designs.js and preview.js are Zeiko
                  Sites' templates, their fifty designs and the editor's preview
src/
  worker.js       fills /drive and the homepage from Drive's catalog and /status from
                  the status document, sends /dashboard… to Drive's address, answers
                  404.html for the rest
  status.js       the status document → /status's two placeholders; ids and numbers only
  drive.js        Drive's address (DRIVE_URL, driveAddress); Drive's catalog → plan
                  cards (numbers and escaped plan names only) and Zeiko S3's lines
dev/
  marketing/      semua-produk.html: the poster of every product, and vps.html: the Zeiko
                  VPS sheet, each one A4 page in the site's look, rendered by headless
                  Chromium into img/marketing/; qr-zeiko-id.svg is their QR code to
                  https://zeiko.biz.id/id/
  sites-sample.mjs, sites-preview.mjs  Zeiko Sites' designs built from made-up
                  content into dev/out/ (gitignored), and their thumbnails
                  (npm run sites:preview, TEMPLATES.md)
scripts/
  check-site.mjs  leak scan + price consistency + rendered /status, Zeiko S3 and
                  /account + docs links and docs list (npm run check)
wrangler.jsonc    static assets, plus the worker for /, /drive, /status and /account, its
                  R2 binding (the status document), and the DRIVE service binding
```

Everything is a static file, filled in on the way out for a few pages, and
the browser never asks for anything but this site's own files — **except the
account area** (below), whose script talks to the account door and nowhere
else:

- **One piece of server code.** `src/worker.js` runs first for the homepage
  (`/`, `/id/`), `/drive`, `/status` and `/account` (`run_worker_first`), and
  for any path that is no file (`/dashboard…`, below, or a 404); for
  `/account…` it only hands back `public/account/index.html`, so deep links
  open. Every other path never reaches it.
- **Only finished HTML goes out**: no data file, no JSON endpoint, no inline
  JSON. What the worker fills in is numbers and fixed words (`src/drive.js`,
  `src/status.js`); the check renders both from samples laced with junk text.
- **No runtime requests.** No `fetch`, XHR, WebSocket, analytics, third-party
  web fonts or CDN scripts (the fonts are the site's own files, in
  `public/fonts`). The network tab shows only this site's own files. Two
  exceptions, both to the account door only: `public/js/account/app.js` and
  the top bar's `public/js/account/session.js` (see "Who is signed in").
- **No build step**, no framework, no dependencies besides wrangler.
- Every page must read fine with JavaScript off, except the account area,
  which needs it and says so (`<noscript>`).

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
  free one of its own, six random letters and digits **under
  zeikosite.biz.id** (`k3x9qa.zeikosite.biz.id`, made by the door; the
  owner's of 2026-11-03, the door's `address.freeBase`, which
  `addressFields` shows, falling back to `base`). A name of the customer's own
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
  from the door's `GET /v1/vps` — plans (vCPU, RAM, NVMe, object storage,
  `monthIdr`), the systems (`templates`), `maxMonths` (12), `bonus`
  (`[{fromMonths, freeMonths}]`, below), `setupIdr` and `gift {months, tlds,
  freeMonths, domainIdr}`. **A VPS
  is paid for 1 to 12 months** (the owner's, 2026-11-01: "bebas 1–12 tapi
  tetap kasih pemberitahuan"), each at the month's price: under `gift.months`
  (6) an order pays the setup (Rp10.000) once; from 6 there is no setup, a
  free .my.id/.biz.id/.web.id domain free for `gift.freeMonths` (two years),
  and free months on every payment, renewals too, **by tier** (the owner's,
  2026-11-03: 6–9 months one free, 10–12 two; `bonusTiers`, `freeFor`,
  `tiersText`; a door from before sends one `bonusMonths` from
  `gift.months`, still read). The order form's months are a `<select
  name="months">` ("6 months + 1 free", "10 months + 2 free"), with the
  notice of what paying longer brings beside it (`vpsLongNote`, an `alert-ok`),
  and posts `/v1/vps/order {plan, months, template, name, password, domain,
  lang}`; a refused order is drawn again with what was typed, **the password
  left out**, and the password is never drawn into a page. A system may
  carry a licence, paid once with the order (`extraIdr`: Windows Server 2025
  +Rp50.000), said beside it ("sekali bayar"); each system is a tile with its
  logo (`osLogo`, `OS_LOGOS`: `/img/os/<id>.svg` for the ids we have, an empty
  tile for any other); the free domain field hides under 6 months
  (`option.vps-short:checked`); after its free months the free domain is
  carried by the renewals at `gift.domainIdr` per 3 months. Cards renew
  from a select of the door's `renew` (one bill per length: `months` booked,
  `freeMonths`, `totalIdr` and what it carries), posting `/renew {months}`;
  they upgrade (`/upgrade {plan}`, the same `upgradeBlock` as hosting) and
  cancel an unpaid order. A card's cycle is `month`, `half`, `year` or the
  months booked (`vpsCycle`).
- **A VPS's address** (the owner's, 2026-10-29: it hides the server's own,
  priced like a hosting's): the order form has the same `addressFields`
  (`free`, `name`, `own`, and the free domain with 6 months or more), its
  inputs renamed `addressName`, `ownDomain` and `domain` (the free domain)
  because the form already has a `name`; only the chosen one is sent, and
  **only the chosen one's field is shown** (`.host-address .host-addr-field`
  hidden, the chosen one's shown by `:has()`; with one class the rule lost to
  `label.field` and every field showed, the owner's report of 2026-11-03).
  The free domain says how long it is free from `gift.freeMonths` (a year
  for a hosting, two for a VPS). The door's `address {base, freeBase, months,
  nameIdr, domainIdr}` prices it: the free address is under `freeBase`
  (zeikosite.biz.id), a name straight under `base` (zeiko.biz.id). A card
  says the address (a free one only once it answers, `signInAt`), signs in
  at `panelUser` as the door gives it, tells an own domain to CNAME to
  `freeAddress`, and has **Change the address** (`addressBlock`, posting
  `/v1/vps/{id}/address {address: name|own, name, domain}`) or "Moving to
  …" (`nextDomain`). `/vps` says it under `#domain` with the
  `hosting:name`, `hosting:domain`, `hosting:move-name` and
  `hosting:move-domain` keys.
- **A smaller plan, from the next renewal** (VPS only, the owner's,
  2026-10-29; `downgradeBlock`): a running card with `downgrade: [plans]`
  offers the cheaper plans on sale and posts `/v1/vps/{id}/downgrade {plan}`;
  an empty `plan` ("Keep my current plan") drops the choice. Nothing changes
  or is charged now and the days already paid are not given back; the card's
  renewal buttons are then priced at the smaller plan (`lowerPlan`,
  `lowerPlanName`), and the plan change is made by hand after that renewal is
  paid (`nextPlan`, "Moving to …"). A hosting still has none.
- **Controls** (VPS, `controlsBlock`, `requestsList`; the owner's,
  2026-10-29): a running card has start, stop, reboot and emergency console
  buttons, a new-password form and a reinstall form, each posting
  `/v1/vps/{id}/request {kind, …}` (`kind`: start, stop, reboot, reinstall,
  password, console; a reinstall also sends `template`, `password`, an
  optional `sshKey` and `confirm: true`). Each is done by hand and answered
  under the card (`requests: [{kind, status: open|done|cancelled, answer,
  createdAt, doneAt}]`); a waiting one can be withdrawn
  (`/v1/vps/{id}/request/{rid}/cancel`). **The password typed in these forms
  goes to the door once and is never drawn back.** The page promises no time
  for them, only that we answer there.
- **Ending a plan** (hosting and VPS, `endBlock`, `endedLine`): a hosting has
  no downgrade (the owner's: end it and order again; the refund is sent by
  hand within 3 working days). A paid card offers "End this plan" with the
  door's `end.refundIdr`, where to send it (`refundTo`, free text, required
  when there is money) and a box to tick; it posts `/v1/hosting/{id}/end`
  or `/v1/vps/{id}/end`. An ending card says what is coming
  (`refundAskedAt`, `refundIdr`, `refundTo`), an ended one that it was sent
  (`refundedAt`). The pay page says
  `product: "vps"` and goes back to `/account/vps`.
- **The public VPS page** (`/vps`, `/id/vps`, the owner's, 2026-10-29; prices
  of 2026-11-01): ten plans by size (Extra Small, Small, Medium, Large), each
  named vCPU.RAM.NVMe.object storage (`Medium 2.8.256.256`), with
  `data-price="vps:<plan id>"` a month (`vps:xs-1-2-25-25` … `vps:l-4-16-256-600`);
  `.vps-terms` says 1–5 months pay `vps:setup` (Rp10.000, once), 6–9 have no
  setup, a free domain for 2 years and 1 month free, and 10–12 the same with
  2 months free (renewals too; the owner's, 2026-11-03). `#systems` is a list
  of the nine systems, each with its logo (`.os-list`).
  `vps:windows` (Windows Server 2025's licence, Rp50.000 once; every Linux is
  free), `vps:domain` (Rp5.000 per 3 months after the free domain's 2 years)
  and `vps:egress` (Rp5.000 per 500 GB past the 500 GB a month that is free).
  VPS support is **human, 24/7, free** (the owner's, 2026-11-01): the page's
  WhatsApp line says 24/7, not the 08.00–22.00 of the other pages. `#high-compute`
  announces VPS High Compute (AMD EPYC Turin-D, 3.4 GHz) with no plan or
  price yet (TBA). It is a hosting page for the check (`HOSTING_PAGES`). The
  prices are typed from the door's `vps.plans`: change both together. It
  says IPv4 and nothing about IPv6 or where the servers are (not decided).
  Its top bar adds a VPS link to the nav and the Hosting pages link to it
  from the footer; the other pages' navs do not list it yet.
- **S3** (`views.js::s3`) is a tab that opens Zeiko S3 in Zeiko Drive
  (`https://drive.zeiko.biz.id/s3`), where it is bought, upgraded and
  renewed; the site shows no S3 price of its own.
- Both pages are hosting blocks for the check (`// hosting:start` …
  `// hosting:end` in `views.js`, `<!-- hosting:start -->` in their markup),
  and the check renders them in every state from the made-up account.
- On a phone the account tabs scroll sideways; `app.js::draw` brings the
  open one into the row.

## Zeiko Sites in the account (`/account/sites`), and `/sites`

The owner's (2026-10-28/29): static websites and the school and business
packages, sold in rupiah by QRIS and **live as soon as the payment is
checked**, on a free address of their own. Its pages are hosting pages and
hosting blocks for the check, like `/vps`.

- **`/sites` and `/id/sites`**: every package with `data-price="sites:<id>"`
  (a year), `:domain` (a year with a free domain) and `:event` (one event,
  until a day picked), and the static site by the GB (`hosting:static`). The
  door's `sites.packages` are what is asked: change both together.
- **The account** (`views.js::sites`, `siteCard`, `siteFiles`,
  `siteEditor`; `app.js::sitesPage`…): the order form (a package by the
  year, with a free domain or per event, or static by GB and months; the
  fields for the choice shown by `:has()`), each site's card (open it,
  renew, files, edit the page), `/account/sites/files?id=` (upload a folder
  or files, delete) and `/account/sites/edit?id=` (the template editor). The
  door is `GET /v1/sites`, `POST /v1/sites/order`, `/{id}/renew`,
  `/{id}/cancel`, `GET /{id}/files`, `POST /{id}/upload`,
  `/{id}/files/delete`, and `GET`/`PUT /{id}/content`.
- **Uploads go straight from the browser to the website's storage**
  (the owner's, 2026-10-29): the door grants each file at its size and
  answers a signed address per file; `app.js::sendFiles` PUTs the bytes
  there, four at a time, and accepts only `https://` addresses. That
  storage, `https://*.r2.cloudflarestorage.com`, is in the account shell's
  `connect-src` beside the door, and only there; the check holds the shell
  to exactly those two and blanks that one string in the shell's scan.
- **Templates** (`js/account/templates.js`, `designs.js`, `preview.js`; the
  brief, the rules and how to make one are in `TEMPLATES.md`): seven kinds —
  `homepage`, `gallery`, `links`, `news`, `invite`, `catalog`, `library` (a
  package's `template`; `upload` is files only) — drawn in **fifty designs**
  (the owner's, 2026-10-29: at least fifty, not AI-made, every font and colour
  changeable). The editor keeps what was typed at the door as one JSON document
  (`cleanContent`): the fields, `design`, `fonts {head, body, label}` (ids of
  `FONTS`, empty for the design's) and `colors` (seven `#rrggbb`, empty for the
  design's). **Save and publish** builds `index.html`, `style.css` (and
  `site.js` for the library's search) in the browser (`buildSite`), copies the
  fonts the page uses from this site's `/fonts/sites/` into the website (a
  same-origin `fetch` in `app.js`; Latin woff2 under OFL or Apache, licences in
  `fonts/`), uploads them like any file, and deletes the catalogue's fonts it no
  longer uses. Everything typed is escaped; a link is a file of the site,
  http(s), mailto or tel, or nothing; the WhatsApp buttons go to
  `https://wa.me/<their number>` (the one URL prefix the check lets through, in
  that file only). Text is kept readable whatever colours are picked
  (`scheme`). The check builds every design from junk and fails on `<script>`,
  `javascript:` or `../..` in what comes out, on a colour of the person's that
  does not reach the stylesheet, on a font file that is not this site's and on
  a design without its thumbnail (`public/img/sites/<design>.webp`).
- **The editor's preview** (`preview.js`, the owner's of 2026-10-29: "ada 2
  viewport, Desktop dan mobile"): the page as a phone (390 px) and a desktop
  (1280 px, scaled) would show it, redrawn on every change. No frame and no
  inline style are allowed in the account area, so it is drawn in a shadow root
  with constructed sheets, its media queries made container queries. The
  pictures load from the website itself, so the shell's `img-src` is `'self'
  data: https:`.

## Receipts (`/account/receipts`)

Every QRIS payment of the person's that was paid out has a PDF receipt, from
the door (`GET /v1/receipts`; the link is `{door}/v1/payments/{id}/receipt
?lang=id|en`, opened as a plain link with the visitor's cookie). The page
lists them; the pay page of a paid payment has **Download the receipt**; the
Overview's Payments and the hosting, VPS and Sites lists link to it.

## The status page (`/status`, `/id/status`)

Every few minutes the account door's side asks each service once and writes
`status.json` (ids and numbers only) into the same bucket as the model
snapshot. `src/worker.js` fills `[data-status-summary]` and
`[data-status-list]` from it with `src/status.js`, which names each service
from its own fixed list (`SERVICES`) and draws nothing for an id it does not
know. A document three rounds late says when it was last checked instead of
showing old states as current. The check renders it from a sample laced with
junk text and an unknown id. Never type a figure into the page.

## Two languages (EN | ID)

Every page is in English and in Indonesian (the operator's, October 2026):
`public/<page>.html` and its twin `public/id/<page>.html` — `/` and `/id/`,
`/hosting` and `/id/hosting`, `/drive` and `/id/drive`, `/docs/…` and
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
- **What scripts write**: `main.js` picks its words from the page's
  `<html lang>`; `src/drive.js` and `src/status.js` draw in the page's
  language; the worker answers `id/404.html` under `/id/` or for a
  `zk_lang=id` visitor.
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
  pager, footer): a change to it goes into all 34 pages, and the two
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
  or Zeiko AI at its own address, or `/dashboard…` (`safeNext`).
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
- **Pranata V1 is off sale** (the owner's, 2026-11-02). The account tabs are
  Overview, Hosting, VPS, Sites, S3 and Settings: **Plans & balance and the
  API key are off the tabs** (the owner's, 2026-11-03: "sembunyikan dulu";
  they are `pages()`, still titled and reachable by their links). The
  Overview leads with the cloud products. An account that already uses
  Pranata V1 (`views.js::usesPranata`: a plan, calls in the last 30 days, or
  balance) still sees its plan, balance, key and usage on the Overview, which
  links to both pages; nobody is offered a Pranata V1 plan. Whether the door still sells one if
  asked directly is the door's to decide, not this site's.
- Zeiko Chat's plans and the balance are bought on Plans & balance
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
- a page of Drive or of Zeiko AI at its own address (`APPS` in `app.js`:
  that origin exactly, a plain path and query, no user, no fragment); the
  sign-in pages then say "…to open Zeiko Drive" or "…to open Zeiko AI";
- `/dashboard…`, Drive's old address here, which `src/worker.js` still
  forwards there for old links.

Anything else goes to `/account`. The door's Google and GitHub sign-in hold
`next` to the same rule (Drive's address there is the door's own setting).

## Prices: one key, many places

Every price on a public page is typed into the HTML and marked with a
`data-price` key, and a key reads the same everywhere it appears
(`npm run check` fails until they all agree):

- `hosting:<plan>` (`mini` … `xl`) a month, with `:first`, `:year` and
  `:save`; `hosting:setup`, `:name`, `:domain`, `:move-name`, `:move-domain`,
  `:egress`, `:egress-gb`, `:static`.
- `vps:<plan id>` a month (`vps:xs-1-2-25-25` … `vps:l-4-16-256-600`),
  `vps:setup`, `vps:windows`, `vps:domain`, `vps:egress`.
- `sites:<package>` a year, with `:domain` and `:event`.

They appear on the product page, its Indonesian twin, the homepage (each
product's lowest price) and the guides. Rupiah is written `Rp17.000` in both
languages. **The door's own lists are what is actually asked**: change a
price there and on the pages together. Drive's prices are never typed: they
come from its catalog. When a price changes, the marketing sheets
(`img/marketing/`) are made again too.

## The guides (`public/docs/`, `public/id/docs/`)

`/docs` is seventeen plain pages, grouped Get started (`index`, `account`),
Zeiko Hosting (`hosting`, `hosting-domain`, `hosting-sites`, `hosting-tools`:
staging, Git, cron and PHP), Zeiko Drive (`drive`, `drive-plans`,
`drive-files`, `drive-sharing`, `drive-safety`, `drive-faq`) and Drive tools
(`drive-tools`, `drive-photo`, `drive-pdf`, `drive-docs`, `drive-video`),
each with its Indonesian twin under `/id/docs/`. `/docs/<name>` serves
`docs/<name>.html`; `/docs` itself goes to `/docs/`. The Zeiko Drive pages
are written from the Drive app itself (its own words and button names) and
sit in Drive blocks; they never type a Drive price: plans and prices are on
`/drive`. Zeiko Sites and Zeiko VPS have no guides yet; `index` says so.
They read fine with JavaScript off and load `main.js` and `session.js` only.

- **The guides list is in every page twice** — `.docs-list` beside the page,
  `.docs-menu` (a `<details>`) on a phone — in `index.html`'s order, with
  `aria-current="page"` on the page itself. A new page goes into all of
  them, and into the previous and next page's pager. `npm run check` holds
  every copy to `index.html`'s.
- Every `<h2>` has an `id`; the "On this page" box lists them. Links to
  `/docs/<name>#<id>`, and `#<id>` inside a docs page, must land: the check
  follows them.
- Code is `<div class="code">` with a `.code-bar` (label, Copy) and a
  `<pre id="code-N">`, its text HTML-escaped. Tables are `.doc-table` in a
  `.doc-table-wrap`; one of three columns or more with no figures to compare
  is also `.doc-table-cards` (one card per row on a phone, each `<td>` with a
  `data-label`).

## Before every commit

```bash
npm run check
```

It fails on banned words, external URLs, network calls, a price that reads
differently in two places, a `$` amount without `data-price`, a docs link or
docs list that does not match the docs pages, or an EN | ID switch that does
not land on its twin. It also renders /status, Zeiko S3's lines and every
account page from made-up data laced with junk text, and fails if any of it
gets through. Reword the page until it passes. Never shorten the banned
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
- **The look is DESIGN.md's** (2026-11-02, replacing the Windows 95 desktop):
  a price list that answers in plain words. Navy ink from the logo on white,
  Plus Jakarta Sans, one accent (the amber of the logo's dot) and only on
  prices, plan lists as rows, a dark scheme beside the light one. The header
  shows every product (a sideways-scrolling row on a phone); in the account
  area `views.js::nav` draws the products and `views.js::me` the person.
- Preview locally with `npx wrangler dev` (http://localhost:8787).
- Charts: thin marks, hairline grid, one colour per series from the
  `--series-*` tokens (validated for colour-blind separation in both themes),
  a legend only when a chart has two series, and a table view under them.
