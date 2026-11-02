---
name: Zeiko
description: Zeiko's website and account area, for its cloud products (Sites, Hosting, VPS, Drive), read like a clear price list in a shop that answers in plain words.
colors:
  bg: "#ffffff"
  ground: "#f4f5f8"
  surface: "#ffffff"
  ink: "#1f2639"
  muted: "#586074"
  line: "#e3e5eb"
  line-strong: "#cdd1da"
  amber: "#f0ae48"
  marker: "#f7cd7c"
  focus: "#2563eb"
  ok: "#18794e"
  warn: "#8a5300"
  err: "#b42318"
  dark-bg: "#10131b"
  dark-ground: "#151a24"
  dark-surface: "#1a2030"
  dark-ink: "#eee6d7"
  dark-muted: "#a3a9b8"
  dark-marker: "#66491a"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.6vw, 2rem)"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.45
  price:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 1.9rem)"
    fontWeight: 800
    fontFeature: "tnum"
  code:
    fontFamily: "Cousine, ui-monospace, monospace"
    fontSize: "14px"
rounded:
  control: "8px"
  card: "14px"
spacing:
  scale: "4 8 12 16 24 32 48 72"
  gutter: "16px"
  wrap: "1120px"
  narrow: "720px"
  header: "64px"
---

# Design System: Zeiko

## Overview

**Creative North Star: "A price list that answers in plain words."** Zeiko sells cloud products to people in
Indonesia, many on an Android phone and many who have never bought hosting: a teacher who needs a class
website, a shop that wants WordPress, a developer who wants a server, a family that wants somewhere for its
files. The site works like a good shop counter. It asks what you want to put online, names the product that
does it, puts the price where you look first, and puts the one next step beside it.

Chosen by the agent on the owner's instruction of 2026-11-02 ("aku serahkan semua ke kamu … yang terbaik
untuk cloud product, no AI slop UI"). It replaces the Windows 95 desktop of 2026-10-24. The AI products and
Pranata V1 are off the site from the same day.

**Key characteristics:**
- Light by default, with a dark scheme beside it; navy ink from the logo on white.
- One accent, the amber of the logo's dot, and it marks one thing: **the price**. A price figure sits on an
  amber highlighter band, like a price circled on a printed list. Nothing else is amber.
- Plain rows before cards. Plan lists are price-list rows (what you get, the price, Order), not a grid of
  identical cards. Cards are kept for the four choices on the homepage, where the whole card is the button.
- Needs before product names. The homepage asks "What do you want to put online?" and answers with four
  needs in everyday words; the product name and its starting price sit under each.
- Real things only. Prices are typed from the products' own lists (`data-price`), Drive's come from its
  catalog, illustrations say "Illustration", and nothing is invented: no testimonials, logos or counts.

## Colors

Three roles, and every value is a token on bare `:root`, redefined in
`@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and in `:root[data-theme="dark"]`
(**The Three Places Rule**: a colour that lives in only one of them disappears when somebody pins the scheme).

- **Ink** (`--ink`, `#1f2639`, the logo's navy): text, headings, the primary button, the selected state.
  In the dark scheme it becomes the logo's cream (`#eee6d7`), so the primary button turns cream with navy text.
- **Neutrals**: `--bg` (page), `--ground` (a cool grey for alternating bands, wells and code), `--surface`
  (cards, fields), `--muted` (secondary text, at least 4.5:1 on `--bg` and `--ground`), `--line` and
  `--line-strong` (rules and field borders).
- **Amber** (`--amber`, `#f0ae48`, the logo's dot) and **marker** (`--marker`, a lighter amber that ink reads on):
  the price band, and nothing else. Never amber text on white (it fails contrast), never an amber button.
- **Status** (`--ok`, `--warn`, `--err`, each with a `-bg` tint): status rows, alerts and field errors only.
- **Focus** (`--focus`): the focus ring, a 2px outline offset 2px, on everything that takes focus.

## Typography

**Plus Jakarta Sans** for everything, set from the site's own variable file (`/fonts/plus-jakarta-sans.woff2`,
200–800). It was drawn in Jakarta for the city's own identity: an Indonesian face for an Indonesian
product, compact enough for long Indonesian words on a 375px screen, with tabular figures for prices.
**Cousine** stays for code in the docs.

- **Display** (800, clamp 2–3rem, 1.1, -0.02em): the one h1 per page.
- **Headline** (750, clamp 1.5–2rem): section h2.
- **Title** (700, 1.15rem): h3, plan names, card titles.
- **Body** (400, 16px, 1.6): reading text, 68ch at most; ledes 1.125rem in `--muted`.
- **Label** (500, 14px): field labels, specs, captions, the footer.
- **Price** (800, clamp 1.5–1.9rem, `tnum`): every price figure, on the amber band.

Every price, size and count uses `font-variant-numeric: tabular-nums`. No all-caps labels, no wide tracking.

## Layout

Mobile first: everything is built at 375px and opened up from there; nothing scrolls sideways except a wide
table inside its own box.

- **Header** (`.topbar`): sticky, white, a hairline below. Row one: the wordmark, then EN | ID, the scheme
  switch and "Sign in" (the person's name once signed in). On a phone the product links sit in a second
  row that scrolls sideways, so every product is one tap away with no hidden menu; from 960px they join row one.
- **Page head**: h1, lede, at most two actions, and on product pages the labelled illustration beside it
  on wide screens.
- **Sections** in a 1120px wrap (720px for reading), 48–72px apart, every other band on `--ground` only
  where it separates two different kinds of content.
- **Footer**: the wordmark and one sentence, then three short groups by what exists (Products, Help, Account).

## Elevation and shape

Flat. Depth comes from a 1px `--line` border and the `--ground` band, not from shadows. The only shadows are
the header once the page has moved and a menu or popover that floats over content. Corners: 8px on controls,
14px on cards and panels; no pills except the status tags.

## Components

- **Buttons**: 44px tall (36px small, 52px large), 8px corners, 600 weight. Primary is ink with white text
  (one per group of actions); secondary is an outline in `--line-strong` with ink text; a link button is
  underlined ink. No arrows on buttons.
- **Price**: the figure on the marker band (`linear-gradient` from 58% to 92% of its height), the unit after it
  in `--muted` at body size.
- **Plan rows** (`.plans` / `.plan`): one row per plan, divided by rules. Phone: name and specs, then the
  price, then Order. Desktop: name and specs | price | Order on one line. The plan the page leads with
  carries no badge; offers (a cheaper first month) are written under the price as a sentence.
- **Choice cards** (homepage): the whole card is the link; a need in plain words, one line on what it does,
  then the product name and its starting price on a rule at the foot.
- **Ticks** (`.ticks`): a list with a small ink check before each line.
- **Steps** (`.steps`): the real order-to-online process, numbered in ink squares.
- **FAQ** (`.faq`): `<details>` rows on rules, a plus that turns to a minus.
- **Fields**: 44px, white, `--line-strong` border, 8px corners; focus ring; errors in `--err` with the message.
- **Alerts and notes**: a tinted panel with a 1px border of the same hue; no left stripes.
- **Illustration** (`.drv`): a bordered panel drawn like the product's own screen, with an "Illustration" tag;
  fixed, made-up content, never animated.
- **Status** (`/status`): one row per service with a tag in its status colour and a strip of thirty days.

## Motion

Almost none. Hover and press states, the FAQ's open state, and nothing that moves on its own. Respect
`prefers-reduced-motion`.

## Do's and Don'ts

**Do:**
- Lead with what the visitor wants to do, in their words; the product name second.
- Put every price on the marker band, with its `data-price` key.
- Keep one primary button per group, and make every control do something real.
- Test every page at 375px, in both languages and both schemes, and with JavaScript off.

**Don't:**
- Use amber for anything but the price band and the logo's dot.
- Add gradients, glows, glass, blurred shadows, decorative icons, emoji, eyebrow pills or status dots that
  mark nothing.
- Fill a section because landing pages usually have one: no testimonials, logo bars or invented figures.
- Set text in all caps or wide tracking, or use a font other than Plus Jakarta Sans and Cousine.
