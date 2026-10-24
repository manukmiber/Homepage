---
name: Zeiko
description: The Zeiko website and account area, drawn as a Windows 95-era desktop where every product is a program you open.
colors:
  desktop-teal: "#008080"
  face-grey: "#c0c0c0"
  bevel-highlight: "#ffffff"
  bevel-light: "#dfdfdf"
  bevel-shadow: "#808080"
  bevel-dark: "#000000"
  well-white: "#ffffff"
  text: "#000000"
  muted: "#444444"
  title-navy: "#000080"
  title-text: "#ffffff"
  title-off-grey: "#737373"
  title-off-text: "#ffffff"
  selection-navy: "#000080"
  selection-text: "#ffffff"
  link-blue: "#0000ee"
  tooltip-yellow: "#ffffe1"
  desktop-text: "#ffffff"
  block-navy: "#000080"
  block-grey: "#808080"
  decision-teal: "#008080"
  ok-green: "#008000"
  warn-ochre: "#806000"
  error-maroon: "#800000"
  series-1: "#000080"
  series-2: "#d00000"
  grid-line: "#d4d4d4"
  prompt-black: "#000000"
  prompt-text: "#c0c0c0"
typography:
  display:
    fontFamily: "DotGothic16, Arimo, Arial, sans-serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
  headline:
    fontFamily: "DotGothic16, Arimo, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0em"
  title:
    fontFamily: "Arimo, Arial, Helvetica Neue, Helvetica, sans-serif"
    fontSize: "clamp(1.35rem, 3vw, 1.8rem)"
    fontWeight: 700
    lineHeight: 1.2
  chrome:
    fontFamily: "DotGothic16, Arimo, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    letterSpacing: "0em"
  body:
    fontFamily: "Arimo, Arial, Helvetica Neue, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arimo, Arial, Helvetica Neue, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  code:
    fontFamily: "Cousine, Courier New, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
spacing:
  bevel: "2px"
  frame: "3px"
  field-gap: "4px"
  group: "14px"
  window-body: "clamp(14px, 2.4vw, 22px)"
  section: "clamp(28px, 4.4vw, 52px)"
  wrap: "1160px"
  taskbar: "42px"
components:
  button:
    backgroundColor: "{colors.face-grey}"
    textColor: "{colors.text}"
    typography: "{typography.chrome}"
    rounded: "{rounded.none}"
    padding: "6px 18px"
    height: "38px"
  button-default:
    backgroundColor: "{colors.face-grey}"
    textColor: "{colors.text}"
    typography: "{typography.chrome}"
    rounded: "{rounded.none}"
    padding: "6px 18px"
    height: "38px"
  field:
    backgroundColor: "{colors.well-white}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "6px 8px"
    height: "36px"
  window:
    backgroundColor: "{colors.face-grey}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "{spacing.frame}"
  window-title:
    backgroundColor: "{colors.title-navy}"
    textColor: "{colors.title-text}"
    typography: "{typography.chrome}"
    padding: "3px 3px 3px 5px"
    height: "30px"
  window-title-inactive:
    backgroundColor: "{colors.title-off-grey}"
    textColor: "{colors.title-off-text}"
    typography: "{typography.chrome}"
    padding: "3px 3px 3px 5px"
    height: "30px"
  well:
    backgroundColor: "{colors.well-white}"
    textColor: "{colors.text}"
    padding: "12px"
  tooltip:
    backgroundColor: "{colors.tooltip-yellow}"
    textColor: "{colors.bevel-dark}"
    typography: "{typography.label}"
    padding: "5px 9px"
  list-header:
    backgroundColor: "{colors.face-grey}"
    textColor: "{colors.text}"
    typography: "{typography.chrome}"
    padding: "4px 12px"
  code-window-screen:
    backgroundColor: "{colors.prompt-black}"
    textColor: "{colors.prompt-text}"
    typography: "{typography.code}"
    padding: "12px 14px"
  taskbar:
    backgroundColor: "{colors.face-grey}"
    textColor: "{colors.text}"
    typography: "{typography.chrome}"
    height: "{spacing.taskbar}"
    padding: "4px"
---

# Design System: Zeiko

## Overview

**Creative North Star: "The Program You Open"**

The site is a desktop of the Windows 95 era, pinned by the owner on 2026-10-24. Zeiko's products are programs: Pranata V1 is a window already running, Drive is a file manager, the docs are a help viewer, code is a command prompt, the account is a property sheet. Everything is built from the era's few materials, which are used literally rather than quoted: grey chrome raised and sunk by two-pixel bevels, solid navy title bars, white wells for anything you read or type into, navy blocks for every quantity, and a pale yellow tooltip for anything that is a note.

The homepage is the full desktop: a teal field, a column of 32 px icons on the left, overlapping windows that carry caption buttons and minimise to a taskbar, and a Start menu (a `<details>`, so it opens without JavaScript) that is the site's navigation. Every other page is one maximised window in an ordinary scrolling layout: its title bar names the application and the document ("Zeiko - Models"), a menu bar sits under it, and the footer closes the window. Density is the era's: compact controls, 15–16 px chrome, figures in sunken fields, no airy marketing spacing.

A night appearance scheme sits beside the standard one: dark teal desktop, charcoal chrome, the same bevel logic with every bevel colour redefined. No Windows or Microsoft name, logo or icon appears anywhere on the site; the Start button carries the Zeiko mark and every icon is drawn for Zeiko.

**Key Characteristics:**
- Six bevel tokens build every surface; depth is never a blurred shadow.
- Navy title bar means active; grey means inactive. One window is active at a time.
- White wells hold documents, fields, lists, tables, figures and charts.
- Every probability, meter and progress is navy segmented blocks in a thin sunken slot.
- A bitmap pixel face for chrome and page names, at 16, 32, 48 or 64 px only; Arimo for reading; Cousine for code and IDs.
- Square corners everywhere; the only round shape is the radio button.

## Colors

A system palette, not a brand palette: neutral grey chrome, one navy for focus and quantity, teal for the desktop, yellow for notes. Values below are the standard scheme; the night scheme redefines the same tokens (see the stylesheet and `.impeccable/design.json`).

### Primary
- **Title Navy** (`--title`): the active window's title bar, the Start menu's side band, the active plan's title bar, the code window's bar, a `GET` verb tag, the avatar. It stays navy in the night scheme too.
- **Block Navy** (`--bar`): the filled blocks of the winning option, every meter, the waiting slot's walking block. Lightens to a periwinkle in the night scheme so it holds contrast on a dark well.
- **Selection Navy** (`--sel`): hover and focus on menu items, Start menu entries and desktop icon labels; the selected row in a list (Drive's first file); the current docs page; text selection.

### Secondary
- **Desktop Teal** (`--desktop`): the homepage desktop, the 404 desktop and the sign-in desktop. Nothing else is teal-filled.
- **Decision Teal** (`--dec`): a lamp (`.dot-dec`) and the latest bar in the usage chart; a marker, not a surface.

### Tertiary
- **Tooltip Yellow** (`--tip`): notes and balloons only: "Illustration" and "Example" tags, plan offers and the "Best value" tag, Drive's "Link copied" balloon, chart hover tips, the account's confirm-email banner and owed line. Always with a 1 px black border and black text, in both schemes.

### Neutral
- **Face Grey** (`--face`): all chrome: windows, buttons, menus, tabs, the taskbar, page background on non-desktop pages.
- **Bevel Highlight / Light / Shadow / Dark** (`--hi`, `--lt`, `--sh`, `--dk`): the four edge colours the bevel tokens are made of. `--sh` also draws every divider: the etched line, dotted row rules, tree lines.
- **Well White** (`--well`): sunken wells, fields, list views, the docs page, charts' plot areas.
- **Text** and **Muted** (`--text`, `--muted`): reading text; muted carries captions, units, labels in figure fields, fine print.
- **Title Off Grey** (`--title-off`): inactive title bars, non-best plan title bars, the sign-in aside's bar.
- **Link Blue** (`--link`): underlined links, always underlined; thicker underline on hover.
- **Status** (`--ok`, `--warn`, `--err`): badge and delta text, the danger button's label, field warnings. Text colours, never fills.
- **Series 1 / Series 2** (`--series-1`, `--series-2`) and **Grid Line** (`--grid-line`): chart marks and hairlines, validated for colour-blind separation in both schemes.
- **Prompt Black / Prompt Text** (`--code-bg`, `--code-text`): the command-prompt screen, the same in both schemes.

### Named Rules
**The Three Places Rule.** A colour is a token on bare `:root`, then redefined in both `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and `:root[data-theme="dark"]`. A new colour goes into all three, or it disappears when someone pins the scheme.

**The Active Window Rule.** Navy title bar means the window in front. On the desktop the window most in view is active and the rest go grey (`.is-off`); in a row of plans the best value is the active one; everything else uses `--title-off`.

**The Yellow Note Rule.** Pale yellow with a black border is the one voice for asides: a note, an offer, a balloon, a hover tip. It is never a button, a heading or a section fill.

## Typography

**Display Font:** DotGothic16 (with Arimo, Arial)
**Body Font:** Arimo (with Arial, Helvetica Neue, Helvetica)
**Label/Mono Font:** Cousine (with Courier New, ui-monospace)

**Character:** A bitmap face on a 16-pixel grid speaks for the machine (title bars, menus, buttons, tabs, column headers, the taskbar) and sets the large names; Arimo, with the era's Arial metrics, carries everything a person reads. All three are the site's own files in `/fonts`.

### Hierarchy
- **Display** (DotGothic16 400, 64px, 1): the product name in the homepage's front window. 48px under 760px.
- **Headline** (DotGothic16 400, 48px, 1.1): page names (page head, docs page, account head). 32px under 760px; the 404 dialog's heading is 32px.
- **Title** (Arimo 700, clamp(1.35rem, 3vw, 1.8rem), 1.2): section headings in windows and docs; window-section titles run to clamp(1.5rem, 3.4vw, 2.1rem). h3 is 1.1rem.
- **Chrome** (DotGothic16 400, 16px): every piece of chrome listed above, with font smoothing off. The default button, the selected tab and the pressed task button go bold.
- **Body** (Arimo 400, 16px, 1.55): reading text; docs prose at 1.7 line height and 74ch measure; ledes 1.1rem at 58ch.
- **Label** (Arimo 400, 13–14px): labels above figures, units, captions, fine print, tooltips.
- **Code** (Cousine 400, 14px, 1.55): code blocks, model IDs, the jump-list chips, table row keys.

### Named Rules
**The Grid of Sixteen Rule.** DotGothic16 is set at 16, 32, 48 or 64 px, nowhere else, with `-webkit-font-smoothing: none`, or its dots blur. Reading text never uses it.

**The Tabular Figures Rule.** Every price, count, percentage and clock uses `font-variant-numeric: tabular-nums`, so columns of figures line up.

## Layout

The homepage is a grid of a 104px icon column and the window area (max 1320px, 16px gutters); the first windows overlap, Pranata V1 in front at about three fifths and "Example answers" behind it, offset 46px down. Under 1000px they stack; under 760px the icons become one horizontally scrolling row so the front window still opens the screen, and the taskbar drops its task buttons. The taskbar is fixed to the bottom (42px plus the safe-area inset) and the desktop pads for it.

Every other page: a sticky title bar plus menu bar (`.topbar`), then a white page head, then sections inside a 1160px wrap (760px for narrow pages) separated by etched lines, then the footer. Under 960px the menu bar folds into a raised drop-down behind a menu button in the title bar. The docs are a 252px contents tree beside the topic; under 900px the tree becomes a `<details>` window at the top.

Spacing is the era's small steps: 3px window frames, 2–4px between fields in a strip, 14px inside group boxes and between cards, a fluid window body (clamp 14–22px), fluid section padding (clamp 28–52px). Everything works at 375px without horizontal scroll; wide tables scroll inside their well, and ledgers and card tables become one small block per row under 640px.

## Elevation & Depth

Depth is drawn, not cast. Every surface is raised or sunk by inset two-pixel bevels made from four edge colours, so the same tokens redraw correctly in the night scheme. There are no blurred shadows. The only outer edges are the default button's 1px black ring and the group box's 1px white etch.

### Shadow Vocabulary
- **Raised** (`--raise`: dark and highlight outer, shadow and light inner): buttons, caption buttons, tabs' cousins, column headers, chips, scroll thumbs, the Start button, task buttons, step numbers, docs cards and pager.
- **Raised window** (`--raise-win`: the same with light and highlight swapped): a window's frame, cards (as dialogs), plans, notices and callouts, the Start menu, the playground panel, the account property sheet, charts' frames.
- **Sunken** (`--sunk`): wells, fields, checkboxes and radios, list views, tables, the FAQ and docs trees, the docs page, the code screen, figure fields.
- **Pressed** (`--press`): a button held down (its label shifts 1px down-right), the open Start button, the active task.
- **Thin sunken** (`--thin-sunk`): status-bar fields, the tray, progress and meter slots, badges, inline code, the current menu-bar item.
- **Thin raised** (`--thin-raise`): reserved for a one-pixel raised edge; defined beside the others, currently unused.

### Named Rules
**The Bevel Grammar Rule.** Raised means you can press it or it is a window; sunken means it holds content or input; thin means it is a field in a bar or a slot for blocks. Choose the token by that meaning, never by looks.

**The Etch Rule.** Dividers are etched: 1px `--sh` over 1px `--hi` (`.etch`, section seams, the Start menu separator). Rows inside a well are divided by 1px dotted `--sh`.

## Shapes

Square everywhere (`border-radius: 0`). The only round form is the radio button and the window picker's option circles. Group boxes are 1px etched frames with their title set into the top edge on the face colour. Tabs are raised boxes open at the bottom, the selected one 2px taller and joined to its panel. Lamps are 9px squares; desktop and Start-menu icons are 32px; title bars, task buttons and inline icons are 16px.

Icons are 16×16 pixel SVGs drawn for Zeiko (`/img/icons`, `crispEdges`), shown at 16 or 32 px only, always `image-rendering: pixelated`; the Zeiko mark is redrawn in pixels as `mark-16.svg` and `mark-32.svg`. Small control glyphs (minimise, maximise, restore, close, arrows, check, plus, minus) are the `--g-*` data-URI tokens, redrawn in light grey for the night scheme.

## Components

### Buttons
Plain grey, raised, pressed when held.
- **Shape:** square (0px), raised bevel; 38px tall (32 small, 46 large, 28 extra-small; 44 on coarse pointers).
- **Default:** the chrome face at 16px on face grey; padding 6px 18px.
- **Default action (`.btn-primary`):** the era's default button: an extra 1px black ring outside the raised bevel and a bold label. One per group of actions.
- **Pressed / Focus:** pressed bevel with the label shifted 1px; focus is a 1px dotted outline 5px inside the edge.
- **Disabled:** shadow-grey label with a 1px highlight emboss.
- **Link button:** underlined link-blue text, no frame.

### Chips
- **Style:** the `/models` jump list as toolbar buttons: raised, 30px tall, Cousine 14px, a lamp beside the ID. Amount chips in the account are raised bold buttons.

### Cards / Containers
- **Window:** 3px face frame with `--raise-win`, a 30px title bar (16px icon, name in the chrome face, caption buttons added by script), an optional menu bar, a body, an optional status bar of thin-sunk fields.
- **Card:** a dialog: face grey, `--raise-win`, padding clamp 14–20px. Inside a window or the account property sheet it becomes a group box instead of a second window.
- **Group box:** 1px etched frame, 16px 14px 12px padding, title cut into the top edge.
- **Figure fields:** label-and-figure grids where each figure sits in its own sunken white field, 4px apart.

### Inputs / Fields
- **Style:** white well, sunken bevel, square, 36px, Arimo 16px. Selects carry a raised drop button drawn inside the field with the down glyph. Checkboxes and radios are 14px sunken wells with the check glyph or a centred dot.
- **Focus:** 1px dotted outline inside the field.
- **Error:** 2px solid `--err` outline after the user has touched the field.

### Navigation
- **Homepage:** the Start button (Zeiko mark and "Start", bold) opens a raised menu with a navy side band reading "Zeiko" in the 32px pixel face, 32px icons and 40px rows that turn navy on hover. The Start menu keeps `id="nav"`. Desktop icons are the same places; their labels select navy on hover or focus.
- **Other pages:** the title bar (pixel Zeiko mark, "Zeiko", then the document name in regular weight), with EN | ID and the scheme switch as small raised buttons at its right; under it the menu bar, whose items select navy and whose current item is thin-sunk. Under 960px the menu bar drops down from a menu button.

### Tables
The era's list view: a sunken white well with column headers as raised buttons in the chrome face, rows divided by dotted rules, a faint navy wash on row hover, figures right-aligned and tabular.

### Probability Blocks (signature)
Every probability, meter and progress is navy segmented blocks in a thin-sunk slot: `repeating-linear-gradient` of 8px blocks and 2px gaps (6px and 2px in meters and histogram columns). The winning option is `--bar` navy; the others are `--bar-2` grey. They animate only inside the playground's live answer (`.try-result`): filling in steps (`steps(9)`, 0.9s) as the answer lands. The waiting indicator is the same block walking along a slot in four steps.

### Tooltips and Notes
Pale yellow, 1px black border, black text, 12–13px: "Illustration" tags, offers, the "Best value" tag, balloons, chart hover tips, the confirm-email banner.

### Tree View
FAQ and docs contents: a sunken white well; FAQ items open with a plus box that turns to a minus; docs groups are a book icon with a dotted tree line and page icons; the current page is selected navy.

### Command Prompt
Code is a small window: raised frame, navy bar with the label and a Copy button, then a sunken black screen with light grey Cousine text. Copy buttons hide without JavaScript.

### Messages
Notices, callouts and alerts are raised dialogs with a 32px info, warning, ok or error icon beside the words. Empty states are a sunken well with a centred 32px icon.

### Account Property Sheet
A row of tabs over one raised panel (`.acct-panel`); cards inside it become group boxes; plans are small windows whose title bar is navy when it is yours or picked. Icons come from `views.js::icon()`, which returns the pixel icons at 16px.

## Do's and Don'ts

### Do:
- **Do** pick the bevel by meaning: `--raise` to press, `--raise-win` for a window or dialog, `--sunk` for a well or field, `--press` held down, `--thin-sunk` for bar fields and block slots.
- **Do** put documents, fields, lists, tables, figures and plots in white sunken wells.
- **Do** draw every probability, meter and progress as navy segmented blocks in a thin sunken slot, the top option navy and the rest grey.
- **Do** set every page other than the homepage as one maximised window whose title bar names the document (`.brand-doc`), with the footer as the window's foot and status bar.
- **Do** use the pale yellow tooltip, with its black border, for notes, offers and balloons.
- **Do** set DotGothic16 at 16, 32, 48 or 64 px only, with smoothing off.
- **Do** draw new icons for Zeiko on a 16×16 grid and show them at 16 or 32 px, pixelated.
- **Do** add every new colour to `:root` and both night-scheme blocks.

### Don't:
- **Don't** animate the hero's "Example answers", the Drive illustration or any figure on `/models`; only the playground's live answer fills in.
- **Don't** put any Windows or Microsoft name, logo, flag or icon on the site; the era is named only in these notes.
- **Don't** use blurred drop shadows, rounded corners or smooth gradients; title bars are solid colour.
- **Don't** set the pixel face at in-between sizes or use it for reading text.
- **Don't** scale an icon to sizes other than 16 or 32 px.
- **Don't** fill a section, button or heading with tooltip yellow or status colours.
