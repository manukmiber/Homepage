# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all confirmed by the owner (2026-10-24), arriving at the same site:

- **Developers and businesses** who wire Pranata V1 into their own product: they read the model page,
  the docs and the prices, try a question in the playground, then create a Zeiko Account and buy a
  plan. Mostly on a desktop when reading docs; often on a phone when first looking.
- **Builders of roleplay apps** who want Jagad, Asmarandana or Wisanggeni: they compare the three
  models, their rates and their measured performance on `/models`, then ask for a key.
- **Everyday people in Indonesia** who use Zeiko Drive (file storage, paid in rupiah) and Zeiko Chat:
  they arrive on a phone, often in Indonesian, to read about Drive, sign in, or pay for something.

Behind sign-in, the same people use **their Zeiko Account** (`/account`): sign up (with the city they
live in), buy a plan or add balance, pay by QRIS or crypto, copy their Pranata V1 key, see usage, and
change settings.

## Product Purpose

The public site says what Zeiko sells — the models, what they cost, how each one is performing — and
lets a visitor act on it: try Pranata V1, create an account, buy, or ask for a key. The account area
is where the customer's own plan, balance, payments and key live. Success is a visitor who
understands the offer in one screen and finishes what they came to do without help.

## Positioning

- **Pranata V1** is a decision model built in-house: a text and a question in, a probability for
  every option out (yes or no, pick one, score it). Fast, consistent from one call to the next, sold
  by plan from $1 for 30 days.
- **The roleplay models** are priced per million tokens, with every rate on the page, and their
  real performance (time to first token, speed, latency, availability) measured and published
  every hour.
- **Zeiko Drive** is file storage for Indonesia, priced in rupiah, opened at its own address.
- **One Zeiko Account** signs a person into ZeikoAI, Zeiko Chat and Zeiko Drive.

## Operating Context

- Two languages on every page, English and Indonesian (`/…` and `/id/…`); the account pages draw in
  the visitor's language. Indonesian copy uses "kamu".
- Many visitors are on Android phones; layouts must work at 375px with no horizontal scroll.
- Developers read code samples and tables in the docs and copy model IDs.
- Buying is done in the account area; a QRIS payment is paid from a banking or e-wallet app by
  scanning the QR the page draws.

## Capabilities and Constraints

- Plain HTML, CSS and JavaScript, no build step, no framework, served as static files by a Cloudflare
  Worker that fills `/models`, `/drive` and the account shell. `public/css/style.css` is the one
  stylesheet.
- **What may never appear on the site** is set in `CLAUDE.md` ("never leak anything about how the API
  works") and enforced by `npm run check`; it covers class names, file names and comments too.
- No runtime requests to anyone but the site itself, except the account pages, the sign-in badge and
  the playground, which ask the account door only. No analytics, no CDN, no third-party fonts.
  **Font files may be hosted on the site itself** (owner, 2026-10-24).
- Every public page reads fine with JavaScript off; the account area and the playground say they
  need it.
- Prices carry `data-price` keys and must agree everywhere; figures on `/models` are measured and
  hourly, never typed in, padded or animated.
- Colours are tokens on `:root` with a dark theme (system and manual switch).

## Brand Commitments

- Names: Zeiko (the site), ZeikoAI, Pranata V1, Jagad 512B V1, Asmarandana 512B V1, Wisanggeni 512B
  V1, Zeiko Drive, Zeiko Chat, Zeiko Account. Model IDs are lowercase and exact.
- The Zeiko mark (`public/img/logo.svg`, `logo-day.svg`), shared with Zeiko Chat.
- Pranata V1 stands apart from the roleplay models and leads the homepage.
- Wording the owner set stays as written: the high-demand notice, the QRIS "Thanks, we're gonna check
  your payment".
- **Visual era pinned by the owner (2026-10-24): Windows 95**, for the website, the account pages and
  the operator panel. The homepage is a full desktop (icons, windows, a taskbar with a Start menu as
  the navigation); every other page uses the era's windows and controls in an ordinary scrolling
  layout. A dark "appearance scheme" stays beside the standard one. No Windows or Microsoft name,
  logo or icon is used: the Start button carries the Zeiko mark and every icon is drawn for Zeiko.

## Evidence on Hand

- Measured performance per model, hourly, over 24 hours, 7 days and 30 days (`/models`).
- The playground: a real answer from Pranata V1, live.
- The product pages and docs (26 pages, both languages).
- **Absent, and not to be invented:** testimonials, customer logos, user counts (the owner removed
  one), benchmarks against other models, press.

## Product Principles

1. Say the offer plainly: what it does, what it costs, where to start.
2. Show real things: a live answer, measured figures, actual prices — illustrations are labelled.
3. Every page works on a phone, in both languages, with JavaScript off where it can.
4. Nothing on the page explains how the service is built.
5. The account area is a tool: the next thing to do is obvious, and money is always clear.

## Accessibility & Inclusion

WCAG AA contrast in both themes, visible focus, keyboard reachable controls, reduced-motion respected,
charts with a table view.
