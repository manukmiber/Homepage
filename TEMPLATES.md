# Zeiko Sites templates

The owner's brief (2026-10-28/29): templates ready to fill in for every package on `/sites`, **at
least fifty of them**, that **do not look AI-made**, with **every font and every colour changeable**
by the person, and **a phone and a desktop view while they edit**. This file is how they are built,
the rules each one keeps, and how to make or change one. `CLAUDE.md` ("Zeiko Sites in the account")
says where it sits in the account area.

## Kinds and designs

A site is one of seven **kinds**: what the editor asks for and the markup it builds
(`templates.js` `TEMPLATES`). A package names its kind (the door's `sites.packages[].template`).
Each kind has several **designs**: how the page looks (`designs.js` `DESIGNS`), fifty in all. The
person picks a design in the editor and can change it any time; the content stays.

| Kind | Packages on `/sites` | Designs |
|---|---|---|
| `homepage` Profile page | school profile, personal portfolio, teacher's CV | 9 |
| `news` News | class / student council / club, blog and wall magazine, project (P5, contests, research) | 9 |
| `gallery` Gallery | yearbook and alumni gallery, portfolio of pictures and video | 7 |
| `links` Links card | business card and contact list, link-in-bio | 8 |
| `invite` Invitation | graduation, farewell, reunion | 7 |
| `catalog` Catalogue | small business catalogue | 6 |
| `library` Library | school e-library | 4 |

A new kind needs the door's packages changed too (the relay's `sites.packages`); a new design does
not: it is a row in `designs.js`, a thumbnail and nothing else.

## Files

| File | What it holds |
|---|---|
| `public/js/account/templates.js` | the kinds, cleaning the document (`cleanContent`), the markup (`buildSite`) and the look engine (`scheme`, `lookOf`, `styleSheet`, `BASE_CSS`) |
| `public/js/account/designs.js` | the font catalogue (`FONTS`) and the fifty designs (`DESIGNS`) |
| `public/js/account/preview.js` | reading the editor's form (`contentFromForm`, also used to save) and the live preview (`mountPreview`) |
| `public/js/account/views.js` `siteEditor` | the editor: design picker, fonts, colours, the page's fields, the preview's frame |
| `public/js/account/app.js` `sites-content` | saving, and publishing: the page's files plus its fonts, stale fonts removed |
| `public/fonts/sites/` | the fonts (Latin woff2), licences in `fonts/` at the repository's root |
| `public/img/sites/<design>.webp` | each design's thumbnail in the picker (`npm run sites:preview -- --shots`) |
| `dev/sites-sample.mjs`, `dev/sites-preview.mjs` | made-up content per kind, and the preview of every design (below) |

## The rules every design keeps

The person's site is theirs: nothing of Zeiko's look (no Windows 95, no Zeiko mark) and no credit
line. The footer is `© year name`.

- **Everything typed is escaped** and a link is one of the site's own files, `http(s)`, `mailto`,
  `tel`, or nothing. The check builds every design from junk and fails on what gets through.
- **No request leaves the site.** Fonts are copied into it at publish (`fonts/…`), never loaded from
  elsewhere; no CDN, no analytics, no embed. The only script is the library's search.
- **Colours are the seven names, nothing else** (below). A literal colour in a design's CSS is one
  the person cannot change; the only exceptions are black or white at low opacity over the names
  (shadows, grain, tape).
- **Fonts are `--f-head`, `--f-body`, `--f-label`, and headings weigh `--w-head`.** A design never
  names a font family or a heading weight in its CSS (`w` on the design sets its own head font's
  weight).
- **375 px with no sideways scroll, and 1280 px that looks laid out, not stretched.** Wide layouts
  sit inside `@media (min-width: …)` so the editor's preview can lay them out per screen.
- **A name alone looks finished**: empty sections, headings and lists are left out by `buildSite`;
  no design may rely on a picture, a cover, a tagline or a contact being there.
- **Pictures of any shape** and video files (`.mp4`, `.webm`, `.mov`) work wherever a picture does.
- **Readable whatever colours are picked**: `scheme` moves text, small text and coloured words
  until they read at 4.5:1 on the background and on boxes, and picks black or white text for every
  fill. Buttons are at least 44 px tall; links have a visible focus; motion respects reduced motion.
- **JavaScript off**: the page reads the same; the library's search box stays hidden.
- **A night scheme only when the design has one** (`dark`), and only while the colours are the
  design's: colours the person picked are kept day and night.

## The look

`styleSheet` writes, in order: the `@font-face` rules of the fonts in use, `:root` with the shared
names, the night scheme if any, `BASE_CSS` (every kind drawn plainly), then the design's `css`.

Colours (`COLOR_KEYS`, every one changeable in the editor):

| Name | Use |
|---|---|
| `paper` | the page's background |
| `surface` | boxes, cards, notes, the search field |
| `ink` | text |
| `muted` | small text: dates, captions, the tagline |
| `line` | rules, borders, frames |
| `accent` | the main colour: buttons and fills |
| `second` | the second colour: tape, pins, badges, stripes |

Worked out from them (`scheme`): `on-accent` and `on-second` (text on those fills),
`accent-text` and `second-text` (the colour as words on the page), `accent-soft` and
`second-soft` (tints for areas), and `scheme` (`light` or `dark`, for `color-scheme`).

Shapes: `--wrap` (the page's width), `--r` (corners of pictures and boxes), `--r-btn` (buttons),
`--size` (body text). Hooks in the markup: `body.k-<kind>.d-<design>`, `.top`, `.top-in`, `.logo`,
`.names`, `.title`, `.tagline`, `.cover-wrap`, `.cover`, `.main`, `.about`, `.event` (`.event-facts`,
`.rsvp`, `.map-link`), `.items` (`.items-h`, `.search`, `.items-in.grid|.list`), the entries
(`.part`/`.part-media`/`.part-body`, `.post`/`.date`/`.post-body`, `.work`/`.work-media`,
`.link-btn`, `.card`/`.card-media`/`.card-body`/`.price`/`.order`, `.book`/`.book-cover`/`.blank`/
`.book-body`/`.open`), `.contact` (`.address`, `.map`, `.buttons`), `.btn` and `.bottom`.

## Not AI-made

Each design starts from **a real thing in the customer's world**, not from a style: a school
letterhead, a gate's name board, a report card, a wall magazine on cork, photocopied notices, a
club zine, a film contact sheet, a scrapbook, a till receipt, a painted warung sign, an airmail
envelope, road signs, an admission ticket, a typed letter of invitation with its "Hari/tanggal :"
lines, jar labels, a chalkboard menu, a carbon-copy receipt book, a market stall's awning, a
library's card catalogue. The thing sets the palette, the type and one signature detail; the rest
stays quiet.

Never, unless the thing itself asks for it:

- **Fonts**: Inter, Space Grotesk, Geist, Syne, Sora, Instrument Serif, Fraunces, Cal Sans, or the
  system stack for everything.
- **Palettes**: purple-to-blue gradients, indigo or violet buttons, cream with terracotta, near-black
  with one acid green or vermilion, emerald as the only accent, gradient text, coloured glows.
- **Layout and chrome**: the centred hero over three icon cards, a coloured stripe down the side of
  cards, glass and blur, all-caps mono labels over every heading, `A · B · C` meta lines, one word
  of a headline in another colour, decorative 01/02/03. Numbers only for a real sequence (a film's
  frames, a catalogue's order numbers, a programme's times).

Run the scanner over the built pages after a change (`node <avoid-ai-design>/scripts/detect.mjs
dev/out/sites`): no P0, and no P1 but K7, which it reports for every page because the focus rule
is in `style.css`, not in the HTML it reads.

## The designs

### homepage (9)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `kop-surat` Kop Surat | A school letterhead: the name between a thick and a thin rule, plain and official. | Libre Caslon Text / Source Serif 4 / Public Sans | — |
| `papan-nama` Papan Nama | The name board at a school gate: white letters on a painted board on two posts. | Archivo Narrow / Public Sans / Archivo Narrow | — |
| `rapor` Rapor | A report card: every section a row of the table, its name in the left column. | Bitter / Atkinson Hyperlegible / Bitter | — |
| `putih-abu` Putih Abu | The high-school uniform: a white page over a grey band, the name tall and tight. | Big Shoulders Display / Work Sans / Work Sans | — |
| `lembar-riwayat` Lembar Riwayat | A CV for a teacher or a professional: name and contact in a column of their own. | Source Serif 4 / IBM Plex Sans / IBM Plex Sans | — |
| `halaman-putih` Halaman Putih | A personal portfolio set like a catalogue of one person: a very large name, big pictures, lots of white. | Bodoni Moda / Karla / Karla | yes |
| `buku-tulis` Buku Tulis | A school exercise book: blue lines, the red margin, the name written in pen. | Kalam / Atkinson Hyperlegible / Kalam | — |
| `piagam` Piagam | A certificate of merit: a double frame round the page, centred lines, a seal of a dot between rules. | Cinzel / EB Garamond / Cinzel | — |
| `kebun-sekolah` Kebun Sekolah | A green school: sections as beds in the garden, each named on a plant tag. | Alegreya / Karla / Karla | — |

### news (9)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `mading` Mading | The wall magazine: notes pinned to cork, each at its own slight angle. | Caveat / Atkinson Hyperlegible / Patrick Hand | — |
| `koran-sekolah` Koran Sekolah | A school newspaper: a masthead between rules, the newest story across the top, the rest in columns. | Libre Caslon Text / Newsreader / Newsreader | — |
| `buletin` Buletin OSIS | A student council bulletin in red and white: a tall name on a red band, dates large in the margin. | Anton / Work Sans / Work Sans | — |
| `jurnal-proyek` Jurnal Proyek | A project or research log: every entry on a line through time, its date on the left. | Newsreader / Public Sans / Public Sans | — |
| `catatan` Catatan | A personal blog, set for reading: one narrow column, generous type, nothing else. | Literata / Literata / Karla | yes |
| `fotokopian` Fotokopian | Photocopied notices: black toner on white sheets, stapled, the pictures gone grey. | Archivo Narrow / Courier Prime / Courier Prime | — |
| `zine` Zine Ekskul | A club zine printed in two inks: fluorescent pink, blue and black, cut and pasted. | Permanent Marker / Courier Prime / Courier Prime | — |
| `majalah` Majalah | A magazine: the cover picture with the name over it, one long feature, then the rest in two columns. | Bodoni Moda / Spectral / Schibsted Grotesk | — |
| `warta-kelas` Warta Kelas | Class news for younger pupils: round letters, cards in three colours, a scalloped top. | Fredoka / Nunito / Fredoka | — |

### gallery (7)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `polaroid` Polaroid | Instant photos on a table: white frames, a strip of tape, captions written on the frame. | Caveat / Karla / Caveat | — |
| `album-kenangan` Album Kenangan | An old photo album: dark pages, prints with white borders held by gold corners. | EB Garamond / EB Garamond / Courier Prime | — |
| `ruang-pamer` Ruang Pamer | A gallery wall: every work at its own shape, in columns, with a small label beside it. | Archivo Narrow / Public Sans / Public Sans | yes |
| `lembar-kontak` Lembar Kontak | A film contact sheet: frames in a strip with sprocket holes, numbered, the pick marked in red pencil. | Big Shoulders Display / Work Sans / Courier Prime | — |
| `buku-tahunan` Buku Tahunan | A yearbook page: portraits in rows, a name under each and a line they chose. | Barlow Condensed / Barlow / Barlow Condensed | — |
| `kliping` Kliping | A scrapbook on brown kraft paper: cuttings taped down, typed labels under each. | Special Elite / Karla / Special Elite | — |
| `layar-lebar` Layar Lebar | A showreel for video work: every clip wide, between black bars, the first one across the page. | Schibsted Grotesk / Schibsted Grotesk / Schibsted Grotesk | — |

### links (8)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `kartu-nama` Kartu Nama | A business card on a desk, a second one under it; the links as lines on the back. | Spectral / Public Sans / Public Sans | — |
| `stiker` Stiker | A sheet of die-cut stickers: every link a sticker with a white edge, stuck on a little crooked. | Lilita One / Nunito / Lilita One | — |
| `rambu` Rambu | Road signs: every link a green direction board with a white edge and an arrow, on one post. | Barlow / Barlow / Barlow Condensed | — |
| `struk` Struk | A till receipt: a narrow strip with torn edges, the links as line items, a barcode at the end. | Courier Prime / Courier Prime / Courier Prime | — |
| `papan-warung` Papan Warung | A painted shop sign: red, blue and yellow boards, thick black outlines, letters like a sign painter's. | Bungee / Rubik / Rubik | — |
| `amplop` Amplop | An airmail envelope: red and blue stripes round the edge, a stamp for the photo, links written as address lines. | Young Serif / Karla / Courier Prime | — |
| `garis-tipis` Garis Tipis | Black on white, set left: a large name, the links as full rows that turn black when touched. | Archivo / Archivo / Archivo | yes |
| `daftar-kontak` Daftar Kontak | A shop's contact list: the business on top, every way to reach it a tile in two columns. | Plus Jakarta Sans / Plus Jakarta Sans / Plus Jakarta Sans | yes |

### invite (7)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `undangan-resmi` Undangan Resmi | A printed formal invitation: centred, a script title, small capitals for the details, a fine double frame. | Great Vibes / EB Garamond / Cinzel | — |
| `toga` Toga | A graduation: the date set as large as the name, a gold tassel line, the programme by the clock. | Big Shoulders Display / Work Sans / Work Sans | — |
| `reuni` Reuni | A reunion in the colours of an old poster: teal, mustard and tomato stripes, a fat serif title. | Abril Fatface / Rubik / Rubik | — |
| `karcis` Karcis | An admission ticket: the details on the ticket, the reply button on its stub behind a perforated line. | Alfa Slab One / Zilla Slab / Courier Prime | — |
| `kartu-ucapan` Kartu Ucapan | A folded greeting card: the picture and the name on the front, the words inside on the right. | Dancing Script / Spectral / Spectral | — |
| `poster-acara` Poster Acara | An event poster: the title as big as the page allows, the date and place in thick blocks. | Anton / Archivo / Archivo | — |
| `surat` Surat Undangan | A typed letter of invitation, sealed in wax: the details as "Hari/tanggal :" lines, the way they are typed here. | Special Elite / Courier Prime / Courier Prime | — |

### catalog (6)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `label-toples` Label Toples | Homemade jar labels: each product on a label with a double border and a price tag. | Young Serif / Lexend / Young Serif | — |
| `papan-menu` Papan Menu | A chalkboard menu in a wooden frame: chalk handwriting, prices at the end of dotted lines. | Kalam / Atkinson Hyperlegible / Kalam | — |
| `etalase` Etalase | A shop window: tall product photos two by two on a phone, the price on a strip across the corner. | Chivo / Chivo / Chivo | yes |
| `nota` Nota | A carbon-copy receipt book: the shop's name printed in red, the goods written in blue, prices on the right. | Patrick Hand / Atkinson Hyperlegible / Patrick Hand | — |
| `lapak` Lapak | A market stall under a striped awning: products on the table, prices on yellow stickers. | Alfa Slab One / Barlow / Alfa Slab One | — |
| `katalog-cetak` Katalog Cetak | A printed catalogue page: a ruled grid, every product numbered so it can be ordered by number. | Crimson Pro / Work Sans / Work Sans | — |

### library (4)

| Design | From | Fonts (head / body / label) | Night |
|---|---|---|---|
| `kartu-katalog` Kartu Katalog | The library card catalogue: every book an index card, red line, blue lines, a hole at the bottom. | Courier Prime / Courier Prime / Courier Prime | — |
| `rak-buku` Rak Buku | A bookshelf: covers standing three to a row on a phone, each row on its wooden shelf. | Alegreya / Literata / Alegreya | — |
| `pojok-baca` Pojok Baca | A reading corner for children: a big round search box, books on bright cards. | Fredoka / Nunito / Fredoka | — |
| `arsip` Arsip | A teacher's archive of modules and worksheets: one row per file, the Open button at the end of it. | IBM Plex Sans / IBM Plex Sans / IBM Plex Sans | yes |

The editor offers every design's fonts and more: 44 families from `public/fonts/sites/` plus the
phone's own sans and serif (46 choices), grouped serif, sans, bold for headings, handwriting,
typewriter and pixel. Fonts with `text: false` (display and script faces) are offered for headings
and labels only.

## The editor

- **Design**: a picker of the kind's designs, each with its thumbnail and its line from the table.
- **Fonts**: one list per role (headings, text, dates/prices/buttons); the first choice is the
  design's own, and empty means it.
- **Colours**: the seven colours, shown as the design's until changed. A colour counts as the
  person's only when it differs from the design the form was showing (`shownDesign`), so switching
  designs moves the untouched colours to the new design's. "Go back to the design's own colours"
  clears them.
- **Preview** (the owner's, 2026-10-29: "ada 2 viewport, Desktop dan mobile"): the page the form
  would publish, as a phone (390 px) and as a desktop (1280 px, scaled to fit), or both, redrawn
  200 ms after every change. The account page allows no frame and no inline style, so `preview.js`
  draws the page in a shadow root with its style.css as a constructed sheet, turns its
  `@media (min-width…)` into container queries on the screen and `vh` into the screen's height,
  and puts its `@font-face` rules on the document. Pictures load from the website itself, which is
  why the shell's `img-src` takes `https:`.
- **Publishing** sends `index.html`, `style.css`, `site.js` for the library, and each font file the
  page uses (fetched from this site's `/fonts/sites/`, skipped when the website already has the same
  file), then deletes the catalogue's fonts the page no longer uses.

## Making or changing a design

1. Pick the thing it comes from and write its one line (`note`, English and Indonesian). Check it
   against "Not AI-made" and against the designs of the same kind: a new one must differ in its
   structure or its signature, not only in colour.
2. Add the row to `designs.js`: `fonts` from `FONTS` (add a font: its woff2 in `public/fonts/sites/`,
   its licence in `fonts/`, its row in `FONTS`), the seven `colors` (text at 7:1 on `paper` where
   the thing allows it), `vars`, and its `css` written only in the shared names.
3. `npm run sites:preview -- --serve` and open `http://localhost:8742/`: every design as Sample,
   Name only, Own colours and fonts (a dark background, Bungee and Lexend), Night when it has one,
   and a desktop frame.
4. Check at 375 px and 1280 px: no sideways scroll, a name alone looks finished, a long title and a
   long price wrap, pictures of any shape, the own-colours frame still reads.
5. `npm run sites:preview -- --shots` redraws every thumbnail into `public/img/sites/` (Chromium and
   cwebp; five at a time, about ten minutes in this sandbox).
6. Run the scanner (above), then `npm run check`: it builds every design from junk and fails on
   escaping, on a colour of the person's that does not reach the stylesheet, on a font file that is
   not this site's, and on a design without a thumbnail.

## Open questions for the owner

- Showing the designs on `/sites` itself (a gallery of the fifty, or a live sample of each), so a
  visitor sees them before ordering. Today only the editor shows them.
- Per-design extras the fields do not cover yet: a "Save contact" vCard on the business card, a map
  embed, a countdown on invitations, the newest post first on News (posts show in the order typed).
- Fonts beyond Latin (Arabic for Islamic schools' names, for one): the files are Latin only.
