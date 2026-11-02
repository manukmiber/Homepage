# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Zeiko sells cloud products to people in Indonesia (the owner's focus from 2026-11-02; the AI products
and Pranata V1 are off the site). They arrive at the same site, mostly on an Android phone and often in
Indonesian:

- **Schools, teachers, students and small businesses** who want a website without running a server:
  a school profile, a class or OSIS page, an invitation, a catalogue, a link-in-bio. They pick a
  package on `/sites`, fill in a design from their phone, and pay a few thousand rupiah a year.
- **People and businesses with a WordPress site or a PHP app** who want hosting with cPanel: they
  compare the plans on `/hosting`, order in the account and wait 1–2 hours.
- **Developers and builders** who want a server of their own for an app, a bot or a tool: `/vps`.
- **Everyday people** who want somewhere to keep and send their files: Zeiko Drive (`/drive`), at its
  own address.

Many have never bought hosting. They know their need ("a website for my school"), not the product
name, and they pay by QRIS from a banking app.

Behind sign-in, the same people use **their Zeiko Account** (`/account`): sign up (with the city they
live in), order hosting, a VPS or a website, pay by QRIS, renew and upgrade, read their receipts and
change settings.

## Product Purpose

The public site says what each cloud product does in plain words, what it costs in rupiah and how to
get it, and lets a visitor act on it: order in the account, or ask on WhatsApp first. The account
area is where the customer's own hosting, VPS and websites live. Success is a visitor who finds the
product for their need in one screen and finishes ordering without help.

## Positioning

- **Zeiko Sites**: ready websites for schools, events, people and small businesses, filled in from a
  phone from fifty designs, live as soon as the payment is checked, from Rp5.000 a year.
- **Zeiko Hosting**: WordPress hosting (PHP, Node.js, Python and Ruby run too) managed in cPanel,
  by the month or year, with a cheaper first month on the smaller plans, from Rp17.000 a month.
- **Zeiko VPS**: a server of one's own, Linux or Windows, with an IPv4 address, paid for 1 to 12 months,
  with human help around the clock, from Rp50.000 a month.
- **Zeiko Drive**: file storage priced in rupiah, opened at its own address; Zeiko S3 beside it.
- Every hosting, VPS and website starts online at a free address of its own under zeiko.biz.id.
- **One Zeiko Account** for every product; support is a person on WhatsApp.

## Operating Context

- Two languages on every page, English and Indonesian (`/…` and `/id/…`); the account pages draw in
  the visitor's language. Indonesian copy uses "kamu".
- Many visitors are on Android phones; layouts must work at 375px with no horizontal scroll.
- Buying is done in the account area; a QRIS payment is paid from a banking app by scanning the QR the
  page draws, and checked by hand.

## Capabilities and Constraints

- Plain HTML, CSS and JavaScript, no build step, no framework, served as static files by a Cloudflare
  Worker that fills the homepage, `/drive`, `/status` and the account shell.
- **What may never appear on the site** is set in `CLAUDE.md` and enforced by `npm run check`; it
  covers class names, file names and comments too. Who runs the hosting is never named.
- No runtime requests to anyone but the site itself, except the account pages and the sign-in badge,
  which ask the account door only. No analytics, no CDN, no third-party fonts. **Font files are hosted
  on the site itself.**
- Every public page reads fine with JavaScript off; the account area says it needs it.
- Prices carry `data-price` keys and must agree everywhere; Drive's come from its catalog.
- Colours are tokens on `:root` with a dark theme (system and manual switch).

## Brand Commitments

- Names: Zeiko (the site), Zeiko Sites, Zeiko Hosting, Zeiko VPS, Zeiko Drive, Zeiko S3, Zeiko Account,
  Zeiko Chat.
- The Zeiko logo (the owner's choice, 2026-11-02): **zeiko** in lowercase, drawn in one line weight,
  the dot of its i in amber; the icon is the z with that dot on a navy tile (`public/img/logo.svg`;
  every file and render in `brand/zeiko/`). Zeiko Chat keeps the earlier mark until the owner says
  otherwise.
- Wording the owner set stays as written: the QRIS "Thanks, we're gonna check your payment".
- **The look** is `DESIGN.md`'s (2026-11-02, on the owner's word "aku serahkan semua ke kamu … no AI
  slop UI"): a price list that answers in plain words, light with a dark scheme beside it. It replaces
  the Windows 95 desktop of 2026-10-24.

## Evidence on Hand

- Every price, typed from the products' own lists, and Drive's from its catalog.
- Whether each service answers, every few minutes (`/status`).
- The product pages and guides (both languages), and six price sheets to download.
- **Absent, and not to be invented:** testimonials, customer logos, user counts, uptime promises,
  press.

## Product Principles

1. Lead with the need, in the visitor's words; the product name second.
2. Show the price where the eye lands first, with nothing added that the page does not say.
3. Show real things: actual prices, a live status, labelled illustrations.
4. Every page works on a phone, in both languages, with JavaScript off where it can.
5. Nothing on the page says who runs the service or how it is built.
6. The account area is a tool: the next thing to do is obvious, and money is always clear.

## Accessibility & Inclusion

WCAG AA contrast in both themes, visible focus, keyboard reachable controls, reduced motion respected,
44px touch targets.
