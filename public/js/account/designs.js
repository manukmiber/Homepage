// hosting:start
// Zeiko Sites' fifty designs and the fonts they are set in (TEMPLATES.md has
// the brief: where each one comes from and what it must not turn into).
//
// A design belongs to one kind of site (templates.js `TEMPLATES`) and is
// written only in the shared names: the seven colours of `colors` (each of
// which the person may replace), --f-head, --f-body and --f-label (each of
// which the person may replace with any font below), --w-head, and the
// shapes in `vars`. Its `css` comes after templates.js's BASE_CSS. A colour
// written into `css` itself would be one the person cannot change: use the
// names, or a shade of black or white over them.
//
// The fonts are the site's own files (public/fonts/sites, Latin, licences in
// fonts/ at the repository's root); publishing copies the ones a page uses
// into the website.

/** Every font a design may be set in. `w` is its weight for headings;
 * `text: false` keeps a font for headings only. */
export const FONTS = {
  literata: { name: 'Literata', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['literata.woff2', '200 900']] },
  newsreader: { name: 'Newsreader', group: 'serif', fallback: 'serif', w: 600, text: true, files: [['newsreader.woff2', '200 800']] },
  'source-serif-4': { name: 'Source Serif 4', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['source-serif-4.woff2', '200 900']] },
  alegreya: { name: 'Alegreya', group: 'serif', fallback: 'serif', w: 800, text: true, files: [['alegreya.woff2', '400 900']] },
  'crimson-pro': { name: 'Crimson Pro', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['crimson-pro.woff2', '200 900']] },
  'eb-garamond': { name: 'EB Garamond', group: 'serif', fallback: 'serif', w: 600, text: true, files: [['eb-garamond.woff2', '400 800']] },
  spectral: { name: 'Spectral', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['spectral-400.woff2', '400'], ['spectral-700.woff2', '700']] },
  'libre-caslon-text': { name: 'Libre Caslon Text', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['libre-caslon-text-400.woff2', '400'], ['libre-caslon-text-700.woff2', '700']] },
  'bodoni-moda': { name: 'Bodoni Moda', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['bodoni-moda.woff2', '400 900']] },
  cinzel: { name: 'Cinzel', group: 'serif', fallback: 'serif', w: 600, text: false, files: [['cinzel.woff2', '400 900']] },
  'young-serif': { name: 'Young Serif', group: 'serif', fallback: 'serif', w: 400, text: false, files: [['young-serif-400.woff2', '400']] },
  'abril-fatface': { name: 'Abril Fatface', group: 'display', fallback: 'serif', w: 400, text: false, files: [['abril-fatface-400.woff2', '400']] },
  bitter: { name: 'Bitter', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['bitter.woff2', '100 900']] },
  'zilla-slab': { name: 'Zilla Slab', group: 'serif', fallback: 'serif', w: 700, text: true, files: [['zilla-slab-400.woff2', '400'], ['zilla-slab-700.woff2', '700']] },
  'alfa-slab-one': { name: 'Alfa Slab One', group: 'display', fallback: 'serif', w: 400, text: false, files: [['alfa-slab-one-400.woff2', '400']] },
  'public-sans': { name: 'Public Sans', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['public-sans.woff2', '100 900']] },
  'work-sans': { name: 'Work Sans', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['work-sans.woff2', '100 900']] },
  archivo: { name: 'Archivo', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['archivo.woff2', '100 900']] },
  'archivo-narrow': { name: 'Archivo Narrow', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['archivo-narrow.woff2', '400 700']] },
  rubik: { name: 'Rubik', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['rubik.woff2', '300 900']] },
  nunito: { name: 'Nunito', group: 'sans', fallback: 'sans', w: 800, text: true, files: [['nunito.woff2', '200 1000']] },
  lexend: { name: 'Lexend', group: 'sans', fallback: 'sans', w: 600, text: true, files: [['lexend.woff2', '100 900']] },
  'plus-jakarta-sans': { name: 'Plus Jakarta Sans', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['plus-jakarta-sans.woff2', '200 800']] },
  karla: { name: 'Karla', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['karla.woff2', '200 800']] },
  chivo: { name: 'Chivo', group: 'sans', fallback: 'sans', w: 800, text: true, files: [['chivo.woff2', '100 900']] },
  'schibsted-grotesk': { name: 'Schibsted Grotesk', group: 'sans', fallback: 'sans', w: 800, text: true, files: [['schibsted-grotesk.woff2', '400 900']] },
  'atkinson-hyperlegible': { name: 'Atkinson Hyperlegible', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['atkinson-hyperlegible-400.woff2', '400'], ['atkinson-hyperlegible-700.woff2', '700']] },
  'ibm-plex-sans': { name: 'IBM Plex Sans', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['ibm-plex-sans-400.woff2', '400'], ['ibm-plex-sans-700.woff2', '700']] },
  barlow: { name: 'Barlow', group: 'sans', fallback: 'sans', w: 700, text: true, files: [['barlow-400.woff2', '400'], ['barlow-700.woff2', '700']] },
  'barlow-condensed': { name: 'Barlow Condensed', group: 'sans', fallback: 'sans', w: 700, text: false, files: [['barlow-condensed-500.woff2', '500'], ['barlow-condensed-700.woff2', '700']] },
  fredoka: { name: 'Fredoka', group: 'sans', fallback: 'sans', w: 600, text: true, files: [['fredoka.woff2', '300 700']] },
  'big-shoulders-display': { name: 'Big Shoulders Display', group: 'display', fallback: 'sans', w: 800, text: false, files: [['big-shoulders-display.woff2', '100 900']] },
  anton: { name: 'Anton', group: 'display', fallback: 'sans', w: 400, text: false, files: [['anton-400.woff2', '400']] },
  'lilita-one': { name: 'Lilita One', group: 'display', fallback: 'sans', w: 400, text: false, files: [['lilita-one-400.woff2', '400']] },
  bungee: { name: 'Bungee', group: 'display', fallback: 'sans', w: 400, text: false, files: [['bungee-400.woff2', '400']] },
  caveat: { name: 'Caveat', group: 'hand', fallback: 'cursive', w: 700, text: false, files: [['caveat.woff2', '400 700']] },
  kalam: { name: 'Kalam', group: 'hand', fallback: 'cursive', w: 700, text: true, files: [['kalam-400.woff2', '400'], ['kalam-700.woff2', '700']] },
  'patrick-hand': { name: 'Patrick Hand', group: 'hand', fallback: 'cursive', w: 400, text: true, files: [['patrick-hand-400.woff2', '400']] },
  'dancing-script': { name: 'Dancing Script', group: 'hand', fallback: 'cursive', w: 700, text: false, files: [['dancing-script.woff2', '400 700']] },
  'great-vibes': { name: 'Great Vibes', group: 'hand', fallback: 'cursive', w: 400, text: false, files: [['great-vibes-400.woff2', '400']] },
  'permanent-marker': { name: 'Permanent Marker', group: 'hand', fallback: 'cursive', w: 400, text: false, files: [['permanent-marker-400.woff2', '400']] },
  'courier-prime': { name: 'Courier Prime', group: 'mono', fallback: 'mono', w: 700, text: true, files: [['courier-prime-400.woff2', '400'], ['courier-prime-700.woff2', '700']] },
  'special-elite': { name: 'Special Elite', group: 'mono', fallback: 'mono', w: 400, text: false, files: [['special-elite-400.woff2', '400']] },
  silkscreen: { name: 'Silkscreen', group: 'mono', fallback: 'mono', w: 700, text: false, files: [['silkscreen-400.woff2', '400'], ['silkscreen-700.woff2', '700']] },
  'sistem-sans': { name: 'Sans (bawaan HP)', group: 'system', w: 700, text: true, stack: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' },
  'sistem-serif': { name: 'Serif (bawaan HP)', group: 'system', w: 700, text: true, stack: 'Georgia,"Noto Serif","Times New Roman",serif' },
};

const d = (id, kind, name, note, fonts, colors, extra = {}) => ({ id, kind, name, note, fonts, colors, ...extra });

export const DESIGNS = [
  /* ------------------------------------------------ profile pages */
  d('kop-surat', 'homepage', 'Kop Surat',
    ['A school letterhead: the name between a thick and a thin rule, plain and official.', 'Kop surat sekolah: nama di atas garis tebal dan tipis, resmi dan rapi.'],
    { head: 'libre-caslon-text', body: 'source-serif-4', label: 'public-sans' },
    { paper: '#ffffff', surface: '#f3f2ee', ink: '#161616', muted: '#4f4f4f', line: '#161616', accent: '#6e1a1a', second: '#161616' },
    { vars: { wrap: '880px', r: '0', 'r-btn': '2px' }, css: `
.top-in{flex-direction:column;text-align:center;gap:10px;padding-bottom:0}
.logo{width:84px;height:84px;object-fit:contain}
.title{font-size:clamp(1.7rem,5vw,2.6rem)}.tagline{font-family:var(--f-label);font-size:.95rem}
.top-in::after{content:"";display:block;width:100%;height:8px;margin-top:16px;border-top:3px solid var(--line);border-bottom:1px solid var(--line)}
@media (min-width:700px){.top-in{display:grid;grid-template-columns:96px 1fr 96px;align-items:center}.names{grid-column:2}.top-in::after{grid-column:1/-1}}
.cover-wrap{margin-top:22px}
.items h2,.part h2,.contact h2{font-size:1.4rem;padding-bottom:.3em;border-bottom:1px solid var(--line)}
.part{padding:6px 0}.part-media img{border:1px solid var(--line);padding:4px;background:var(--surface)}
.contact{border-top:3px double var(--line)}.bottom{text-align:center;border-top:1px solid var(--line)}` }),

  d('papan-nama', 'homepage', 'Papan Nama',
    ['The name board at a school gate: white letters on a painted board on two posts.', 'Papan nama di gerbang sekolah: huruf putih di papan bercat, berdiri di dua tiang.'],
    { head: 'archivo-narrow', body: 'public-sans', label: 'archivo-narrow' },
    { paper: '#f6f7f5', surface: '#ffffff', ink: '#14201a', muted: '#4a5650', line: '#c9d1cc', accent: '#0f5132', second: '#7d8480' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.top-in{background:var(--accent);color:var(--on-accent);margin-top:26px;padding:26px 24px;box-shadow:inset 0 0 0 5px var(--accent),inset 0 0 0 8px var(--on-accent);max-width:min(var(--wrap),100% - 36px)}
.title{text-transform:uppercase;letter-spacing:.02em}.tagline{color:inherit}
.logo{background:var(--surface);border:3px solid var(--on-accent);object-fit:contain}
.top::after{content:"";order:1;width:min(var(--wrap),100% - 36px);height:34px;margin:0 auto;background:linear-gradient(90deg,transparent 14%,var(--second) 14% calc(14% + 12px),transparent 0),linear-gradient(270deg,transparent 14%,var(--second) 14% calc(14% + 12px),transparent 0)}
.cover-wrap{order:2}
.part{padding:10px 0 20px;border-bottom:1px solid var(--line)}.part h2{color:var(--accent-text);font-size:1.7rem}` }),

  d('rapor', 'homepage', 'Rapor',
    ['A report card: every section a row of the table, its name in the left column.', 'Buku rapor: setiap bagian satu baris tabel, namanya di kolom kiri.'],
    { head: 'bitter', body: 'atkinson-hyperlegible', label: 'bitter' },
    { paper: '#ffffff', surface: '#edf1f7', ink: '#1a1f2b', muted: '#4b5466', line: '#8d9ab0', accent: '#23408e', second: '#b3261e' },
    { vars: { r: '0', 'r-btn': '0', wrap: '920px' }, css: `
.top-in{border:2px solid var(--line);margin-top:28px;padding:18px 20px;background:var(--surface);max-width:min(var(--wrap),100% - 36px)}
.title{font-size:clamp(1.7rem,5vw,2.5rem)}
.cover-wrap{max-width:min(var(--wrap),100% - 36px);padding:0}.cover{border:2px solid var(--line);border-top:0}
.about{max-width:none;border:2px solid var(--line);border-bottom:0;padding:16px 20px;margin:0}
.main{padding-top:0}.items{border-bottom:2px solid var(--line)}.items-in{gap:0}
.part{gap:0;border:2px solid var(--line);border-bottom:0}
.part h2{margin:0;padding:10px 16px;background:var(--surface);border-bottom:2px solid var(--line);font-size:1.12rem}
.part-body>p,.part-media{margin:14px 16px}
@media (min-width:720px){.part,.part.has-img{grid-template-columns:minmax(170px,28%) 1fr;gap:0}.part-body{display:contents}
.part h2{grid-column:1;grid-row:1/span 12;border-bottom:0;border-right:2px solid var(--line)}.part-media,.part-body>p{grid-column:2}}
.contact{border:2px solid var(--line);padding:4px 20px 18px;margin-top:28px}.contact h2{color:var(--second-text)}` }),

  d('putih-abu', 'homepage', 'Putih Abu',
    ['The high-school uniform: a white page over a grey band, the name tall and tight.', 'Seragam SMA: halaman putih di atas pita abu-abu, nama sekolah tinggi dan rapat.'],
    { head: 'big-shoulders-display', body: 'work-sans', label: 'work-sans' },
    { paper: '#ffffff', surface: '#eceef0', ink: '#17191c', muted: '#50555c', line: '#d3d6da', accent: '#5d636b', second: '#b3261e' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1040px' }, css: `
.top{border-bottom:30px solid var(--accent);box-shadow:0 6px 0 var(--second)}
.top-in{align-items:flex-end;padding-top:44px}
.title{font-size:clamp(2.8rem,11vw,5.6rem);line-height:.92;text-transform:uppercase}
.cover-wrap{padding-bottom:0}.cover{max-height:420px}
.items-in{grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:34px 28px}
.part,.part.has-img{display:block}.part-media img{aspect-ratio:3/2;object-fit:cover;margin-bottom:12px}
.part h2{text-transform:uppercase;font-size:2rem;line-height:1}` }),

  d('lembar-riwayat', 'homepage', 'Lembar Riwayat',
    ['A CV for a teacher or a professional: name and contact in a column of their own.', 'CV guru atau profesional: nama dan kontak di kolomnya sendiri.'],
    { head: 'source-serif-4', body: 'ibm-plex-sans', label: 'ibm-plex-sans' },
    { paper: '#ffffff', surface: '#f1f4f4', ink: '#1b2224', muted: '#50595c', line: '#d5dcdd', accent: '#0b5d6b', second: '#0b5d6b' },
    { vars: { r: '4px', 'r-btn': '4px', wrap: '780px' }, css: `
.top{background:var(--surface);border-bottom:1px solid var(--line)}
.top-in{flex-direction:column;align-items:flex-start;padding-bottom:28px}
.logo{width:116px;height:116px;border-radius:50%}
.title{font-size:clamp(2rem,6vw,2.7rem)}.tagline{font-size:1.1rem}
@media (min-width:960px){body{display:grid;grid-template-columns:330px minmax(0,1fr);max-width:1200px;margin:0 auto}
.top{grid-row:1/span 3;position:sticky;top:0;align-self:start;min-height:100vh;border-bottom:0;border-right:1px solid var(--line)}.top-in{padding:56px 32px}
.cover-wrap{padding:0 32px}.main,.bottom{grid-column:2}}
.part{padding-bottom:6px;border-bottom:1px solid var(--line)}.part h2{font-size:1.35rem;color:var(--accent-text)}
.part.has-img{grid-template-columns:1fr}.part-media img{max-width:320px}` }),

  d('halaman-putih', 'homepage', 'Halaman Putih',
    ['A personal portfolio set like a catalogue of one person: a very large name, big pictures, lots of white.', 'Portofolio diri seperti katalog satu orang: nama sangat besar, gambar besar, banyak ruang putih.'],
    { head: 'bodoni-moda', body: 'karla', label: 'karla' },
    { paper: '#ffffff', surface: '#f4f4f4', ink: '#000000', muted: '#555555', line: '#000000', accent: '#a3001b', second: '#000000' },
    { w: 500, vars: { r: '0', 'r-btn': '0', wrap: '1120px' }, dark: { paper: '#0e0e0e', surface: '#1a1a1a', ink: '#f2f2f2', muted: '#a8a8a8', line: '#f2f2f2', accent: '#ff5c6c' }, css: `
.top-in{display:block;padding-top:56px}.logo{width:56px;height:56px;margin-bottom:22px}
.title{font-size:clamp(3rem,13vw,8.4rem);line-height:.9;letter-spacing:-.02em}
.tagline{font-size:1.25rem;max-width:34ch;margin-top:20px;color:var(--ink)}
.part{padding:44px 0;border-top:1px solid var(--line)}.part h2{font-size:clamp(1.8rem,4vw,2.8rem)}
@media (min-width:820px){.part.has-img{grid-template-columns:7fr 5fr;gap:44px}.part.has-img:nth-child(even) .part-media{order:2}}
.btn{background:none;color:var(--ink);border:1px solid var(--ink)}.btn:hover{background:var(--ink);color:var(--paper)}` }),

  d('buku-tulis', 'homepage', 'Buku Tulis',
    ['A school exercise book: blue lines, the red margin, the name written in pen.', 'Buku tulis sekolah: garis biru, margin merah, nama ditulis dengan pulpen.'],
    { head: 'kalam', body: 'atkinson-hyperlegible', label: 'kalam' },
    { paper: '#ffffff', surface: '#ffffff', ink: '#1e2a4a', muted: '#4b5878', line: '#b4cbeb', accent: '#1f3fae', second: '#e0565b' },
    { vars: { r: '0', 'r-btn': '12px 4px 14px 5px', wrap: '760px' }, css: `
html{background:var(--accent-soft)}
body{max-width:820px;margin:0 auto;line-height:32px;background-color:var(--paper);background-image:linear-gradient(90deg,transparent 44px,var(--second) 44px 46px,transparent 46px),repeating-linear-gradient(180deg,transparent 0 31px,var(--line) 31px 32px);background-position:0 8px}
.wrap{padding-left:62px}.cover-wrap{padding-left:62px}
.title{font-size:2.6rem;line-height:48px;color:var(--accent-text)}
h2,.part h2{color:var(--accent-text);line-height:32px;margin:32px 0 0;font-size:1.7rem}
p,.about p{margin:0 0 32px}.part{gap:0}
.part-media img{border:6px solid #fff;box-shadow:2px 3px 0 rgba(0,0,0,.18);transform:rotate(-1.3deg);margin:8px 0 24px}
.btn{background:none;color:var(--accent-text);border:2px solid currentColor;font-size:1.15rem}` }),

  d('piagam', 'homepage', 'Piagam',
    ['A certificate of merit: a double frame round the page, centred lines, a seal of a dot between rules.', 'Piagam penghargaan: bingkai ganda di tepi halaman, baris di tengah, segel titik di antara garis.'],
    { head: 'cinzel', body: 'eb-garamond', label: 'cinzel' },
    { paper: '#ffffff', surface: '#f7f5ef', ink: '#1f1a14', muted: '#5a5145', line: '#8c6d2b', accent: '#23395d', second: '#8c6d2b' },
    { vars: { r: '0', 'r-btn': '0', wrap: '820px', size: '18px' }, css: `
body{margin:10px;border:6px double var(--line);min-height:calc(100vh - 20px)}
.top-in{flex-direction:column;text-align:center;padding-top:44px}
.title{font-size:clamp(1.8rem,6vw,3.1rem);letter-spacing:.04em}.tagline{font-style:italic;font-size:1.15rem}
.top-in::after{content:"";width:180px;height:14px;background:radial-gradient(circle,var(--line) 4px,transparent 4.5px) center/14px 14px no-repeat,linear-gradient(var(--line),var(--line)) center/100% 1px no-repeat}
.about,.part,.contact,.bottom{text-align:center}.about{margin:0 auto}
.part h2{font-size:1.35rem;letter-spacing:.05em}.part.has-img{grid-template-columns:1fr}.part-media img{max-width:460px;margin:0 auto}
.buttons{justify-content:center}.btn{letter-spacing:.06em}` }),

  d('kebun-sekolah', 'homepage', 'Kebun Sekolah',
    ['A green school: sections as beds in the garden, each named on a plant tag.', 'Sekolah hijau: bagian-bagian seperti bedeng di kebun, masing-masing diberi label tanaman.'],
    { head: 'alegreya', body: 'karla', label: 'karla' },
    { paper: '#f2f6ef', surface: '#ffffff', ink: '#1d2a1c', muted: '#4d5c4b', line: '#c6d4c2', accent: '#2f6b34', second: '#7a4b26' },
    { vars: { r: '6px', 'r-btn': '6px' }, css: `
.cover-wrap{order:-1;max-width:none;padding:0}.cover{border-radius:0;max-height:380px}
.title{color:var(--accent-text)}
.items-in{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.part,.part.has-img{display:block;background:var(--surface);border:1px solid var(--line);border-bottom:6px solid var(--second);padding:18px}
.part h2{display:inline-block;background:var(--second);color:var(--on-second);padding:.2em .8em .25em 1.1em;font-size:1.1rem;clip-path:polygon(12px 0,100% 0,100% 100%,12px 100%,0 50%)}
.part-media img{aspect-ratio:3/2;object-fit:cover;margin-bottom:12px}` }),

  /* ------------------------------------------------ news */
  d('mading', 'news', 'Mading',
    ['The wall magazine: notes pinned to cork, each at its own slight angle.', 'Majalah dinding: tulisan ditempel di papan gabus, masing-masing sedikit miring.'],
    { head: 'caveat', body: 'atkinson-hyperlegible', label: 'patrick-hand' },
    { paper: '#b8874f', surface: '#fffdf6', ink: '#1f1b16', muted: '#4f463b', line: '#8a6236', accent: '#1d4fa8', second: '#d23b3b' },
    { vars: { r: '0', 'r-btn': '4px', wrap: '1000px' }, css: `
body{background-image:radial-gradient(rgba(0,0,0,.14) 1px,transparent 1.6px),radial-gradient(rgba(255,255,255,.13) 1px,transparent 1.6px);background-size:9px 9px,13px 13px;background-position:0 0,4px 6px}
.top-in{background:var(--surface);margin-top:28px;padding:18px 22px;max-width:min(640px,100% - 36px);transform:rotate(-.7deg);box-shadow:3px 4px 0 rgba(0,0,0,.25)}
.title{font-size:clamp(2.6rem,10vw,4rem)}
.cover-wrap{margin-top:18px}.cover{border:8px solid var(--surface);transform:rotate(.5deg)}
.about,.contact{background:var(--surface);padding:16px 20px;box-shadow:3px 4px 0 rgba(0,0,0,.22);border:0}
.items-h{font-size:2.4rem}
.items-in{grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:30px}
.post{position:relative;background:var(--surface);padding:20px 18px 12px;box-shadow:3px 4px 0 rgba(0,0,0,.22)}
.post:nth-child(3n+1){transform:rotate(-1deg)}.post:nth-child(3n+2){transform:rotate(.8deg)}
.post::before{content:"";position:absolute;top:-8px;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:var(--second);box-shadow:inset -3px -3px 0 rgba(0,0,0,.25)}
.post:nth-child(even)::before{background:var(--accent)}
.post h3{font-size:1.7rem;line-height:1.1}.date{font-size:1.1rem}.bottom{color:var(--ink)}` }),

  d('koran-sekolah', 'news', 'Koran Sekolah',
    ['A school newspaper: a masthead between rules, the newest story across the top, the rest in columns.', 'Koran sekolah: nama koran di antara garis, berita terbaru di atas, sisanya dalam kolom.'],
    { head: 'libre-caslon-text', body: 'newsreader', label: 'newsreader' },
    { paper: '#f1f2f2', surface: '#ffffff', ink: '#1c1c1c', muted: '#555555', line: '#1c1c1c', accent: '#1c1c1c', second: '#9e1b32' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1080px' }, css: `
.top-in{display:block;text-align:center;padding-top:22px;padding-bottom:10px;border-bottom:4px double var(--line)}
.logo{width:56px;height:56px;margin:0 auto 10px}
.title{font-size:clamp(2.3rem,9.5vw,4.8rem);letter-spacing:-.01em}
.tagline{font-style:italic;color:var(--ink);border-top:1px solid var(--line);margin-top:10px;padding-top:6px}
.cover-wrap{margin-top:16px}.about{max-width:none;padding-bottom:12px;border-bottom:1px solid var(--line)}
.items-h{font-size:1.1rem;border-bottom:2px solid var(--line);padding-bottom:4px}
.items-in{display:block}
.post{padding-bottom:18px;margin-bottom:18px;border-bottom:1px solid var(--line);break-inside:avoid}
.post:first-child h3{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.05}
.date{font-style:italic;color:var(--second-text)}
@media (min-width:820px){.items-in{columns:2;column-gap:40px;column-rule:1px solid var(--line)}.post:first-child{column-span:all}}` }),

  d('buletin', 'news', 'Buletin OSIS',
    ['A student council bulletin in red and white: a tall name on a red band, dates large in the margin.', 'Buletin OSIS merah putih: nama tinggi di pita merah, tanggal besar di pinggir.'],
    { head: 'anton', body: 'work-sans', label: 'work-sans' },
    { paper: '#ffffff', surface: '#f7f1f1', ink: '#1b1b1b', muted: '#555555', line: '#1b1b1b', accent: '#c8102e', second: '#1b1b1b' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.top{background:var(--accent);color:var(--on-accent)}
.top-in{padding-top:30px;padding-bottom:26px}
.title{font-size:clamp(2.6rem,11vw,5.6rem);line-height:.92;text-transform:uppercase}.tagline{color:inherit}
.cover-wrap{background:linear-gradient(var(--accent) 50%,transparent 50%);max-width:none;padding:0 max(18px,calc((100% - var(--wrap))/2 + 18px))}
.items-h{font-size:3rem;text-transform:uppercase}
.items-in{gap:0}
.post{padding:18px 0 8px;border-top:4px solid var(--line)}
@media (min-width:760px){.post{display:grid;grid-template-columns:160px 1fr;gap:26px}}
.date{font-family:var(--f-head);font-size:1.4rem;line-height:1.15;color:var(--accent-text)}
.post h3{font-size:1.9rem;text-transform:uppercase;line-height:1}` }),

  d('jurnal-proyek', 'news', 'Jurnal Proyek',
    ['A project or research log: every entry on a line through time, its date on the left.', 'Catatan proyek atau penelitian: setiap catatan di garis waktu, tanggalnya di kiri.'],
    { head: 'newsreader', body: 'public-sans', label: 'public-sans' },
    { paper: '#ffffff', surface: '#eef3ef', ink: '#182219', muted: '#4f5b50', line: '#b9c8bb', accent: '#2c5e3f', second: '#2c5e3f' },
    { vars: { r: '4px', 'r-btn': '4px', wrap: '900px' }, css: `
.top-in{border-bottom:1px solid var(--line)}.title{font-size:clamp(2rem,6vw,3.2rem)}
.about{font-family:var(--f-head);font-size:1.25rem;line-height:1.5}
.items-in{gap:0;border-left:2px solid var(--line);margin-left:7px}
.post{position:relative;padding:2px 0 28px 26px}
.post::before{content:"";position:absolute;left:-9px;top:6px;width:16px;height:16px;box-sizing:border-box;background:var(--paper);border:3px solid var(--accent);border-radius:50%}
.date{font-weight:600;color:var(--accent-text)}.post h3{font-size:1.5rem}
@media (min-width:800px){.items-in{border:0;margin:0}.post{display:grid;grid-template-columns:170px 1fr;gap:28px;padding:0}
.post::before{left:190px}.post-body{border-left:2px solid var(--line);padding:0 0 30px 28px}.date{text-align:right;padding-top:2px}}` }),

  d('catatan', 'news', 'Catatan',
    ['A personal blog, set for reading: one narrow column, generous type, nothing else.', 'Blog pribadi yang enak dibaca: satu kolom sempit, huruf lega, tanpa hiasan.'],
    { head: 'literata', body: 'literata', label: 'karla' },
    { paper: '#ffffff', surface: '#f4f4f6', ink: '#222024', muted: '#5d5a63', line: '#e0dee4', accent: '#2b4ea2', second: '#2b4ea2' },
    { vars: { wrap: '680px', r: '3px', 'r-btn': '3px', size: '18px' }, dark: { paper: '#18171b', surface: '#222126', ink: '#e8e6ec', muted: '#a7a3ad', line: '#34323a', accent: '#8fa8ff' }, css: `
body{line-height:1.7}.top-in{padding-top:60px;padding-bottom:30px}
.title{font-size:clamp(2rem,6vw,2.7rem)}
.items-h{font-size:1rem;font-family:var(--f-label);color:var(--muted);font-weight:600}
.items-in{gap:0}.post{padding:28px 0;border-bottom:1px solid var(--line)}
.post h3{font-size:1.75rem;line-height:1.2}.post img{margin:20px 0}
.date{font-size:.85rem}` }),

  d('fotokopian', 'news', 'Fotokopian',
    ['Photocopied notices: black toner on white sheets, stapled, the pictures gone grey.', 'Pengumuman fotokopian: tinta hitam di kertas putih, distaples, foto jadi abu-abu.'],
    { head: 'archivo-narrow', body: 'courier-prime', label: 'courier-prime' },
    { paper: '#d9d9d6', surface: '#ffffff', ink: '#161616', muted: '#404040', line: '#161616', accent: '#161616', second: '#8d8d8d' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.top-in{background:var(--surface);margin-top:26px;padding:20px;max-width:min(var(--wrap),100% - 36px);box-shadow:6px 6px 0 rgba(0,0,0,.18)}
.title{font-size:clamp(2.3rem,8vw,4rem);text-transform:uppercase;line-height:.95}
.cover,.post img{filter:grayscale(1) contrast(1.3)}
.about{background:var(--surface);padding:18px 20px}
.items-in{gap:26px}
.post{position:relative;background:var(--surface);background-image:radial-gradient(rgba(0,0,0,.06) 1px,transparent 1.3px);background-size:5px 5px;padding:24px 20px 14px;box-shadow:5px 5px 0 rgba(0,0,0,.18)}
.post::before{content:"";position:absolute;top:12px;left:16px;width:24px;height:4px;background:var(--second);transform:rotate(-28deg)}
.date{font-weight:700;color:var(--ink)}
.contact{background:var(--surface);padding:6px 20px 18px;border:0}` }),

  d('zine', 'news', 'Zine Ekskul',
    ['A club zine printed in two inks: fluorescent pink, blue and black, cut and pasted.', 'Zine ekskul dicetak dua warna: pink stabilo, biru dan hitam, digunting dan ditempel.'],
    { head: 'permanent-marker', body: 'courier-prime', label: 'courier-prime' },
    { paper: '#ffffff', surface: '#ffffff', ink: '#1a1a1a', muted: '#3d3d3d', line: '#1a1a1a', accent: '#ff48b0', second: '#0078bf' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.title{display:inline-block;font-size:clamp(2.3rem,9vw,4.6rem);line-height:1.05;background:var(--accent);color:var(--on-accent);padding:.08em .3em;transform:rotate(-2deg)}
.tagline{margin-top:14px}
.items-in{gap:30px}
.post{position:relative;border:3px solid var(--line);padding:18px;background:var(--surface)}
@media (min-width:700px){.post:nth-child(odd){margin-right:8%}.post:nth-child(even){margin-left:8%}}
.post img{filter:grayscale(1) contrast(1.2);box-shadow:8px 8px 0 var(--second)}
.post h3{font-size:1.7rem}
.date{display:inline-block;background:var(--second);color:var(--on-second);padding:2px 8px;font-weight:700}
.btn{border:3px solid var(--line)}` }),

  d('majalah', 'news', 'Majalah',
    ['A magazine: the cover picture with the name over it, one long feature, then the rest in two columns.', 'Majalah: foto sampul dengan nama di atasnya, satu tulisan utama, lalu sisanya dua kolom.'],
    { head: 'bodoni-moda', body: 'spectral', label: 'schibsted-grotesk' },
    { paper: '#ffffff', surface: '#f2f2f2', ink: '#1a1a1a', muted: '#595959', line: '#dadada', accent: '#0d3b66', second: '#0d3b66' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1080px' }, css: `
.top{position:relative}.cover-wrap{order:-1;max-width:none;padding:0}
.cover{border-radius:0;height:min(80vh,640px);max-height:none}
.top:has(.cover) .top-in{position:absolute;left:0;right:0;bottom:0;color:#fff;padding-top:80px;padding-bottom:28px;background:linear-gradient(transparent,rgba(0,0,0,.7));max-width:none;padding-left:max(18px,calc((100% - var(--wrap))/2 + 18px))}
.top:has(.cover) .tagline{color:#fff}
.title{font-size:clamp(2.6rem,9vw,5.4rem);line-height:.95}
.items-h{font-family:var(--f-label);font-size:1rem;border-bottom:1px solid var(--line);padding-bottom:6px}
.date{font-size:.8rem;letter-spacing:.04em;color:var(--accent-text)}
.post img{aspect-ratio:3/2;object-fit:cover}.post h3{font-size:1.5rem}
@media (min-width:760px){.items-in{grid-template-columns:1fr 1fr;gap:36px 32px}.post:first-child{grid-column:1/-1}
.post:first-child .post-body{display:grid;grid-template-columns:3fr 2fr;gap:0 30px}.post:first-child img{grid-column:1;grid-row:1/span 9;margin:0}.post:first-child h3{font-size:2.5rem}}` }),

  d('warta-kelas', 'news', 'Warta Kelas',
    ['Class news for younger pupils: round letters, cards in three colours, a scalloped top.', 'Warta kelas untuk siswa SD dan SMP: huruf bulat, kartu tiga warna, tepi atas bergelombang.'],
    { head: 'fredoka', body: 'nunito', label: 'fredoka' },
    { paper: '#ffffff', surface: '#fff3cf', ink: '#1f2433', muted: '#4c5368', line: '#e6e8ef', accent: '#3557d4', second: '#f2b705' },
    { vars: { r: '16px', 'r-btn': '14px' }, css: `
.top{background:var(--accent);color:var(--on-accent)}.tagline{color:inherit}
.top::after{content:"";order:3;height:18px;background:radial-gradient(circle at 12px 0,var(--accent) 12px,var(--paper) 12.5px) 0 0/24px 18px repeat-x}
.top-in{padding-bottom:16px}.title{font-size:clamp(2.2rem,8vw,3.6rem)}
.cover-wrap{order:4;margin-top:14px}
.items-h{color:var(--accent-text)}
.items-in{grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))}
.post{border-radius:20px;padding:20px;background:var(--surface)}
.post:nth-child(3n+2){background:var(--accent-soft)}.post:nth-child(3n){background:var(--second-soft)}
.date{display:inline-block;background:var(--second);color:var(--on-second);border-radius:999px;padding:2px 12px;font-weight:600}` }),

  /* ------------------------------------------------ galleries */
  d('polaroid', 'gallery', 'Polaroid',
    ['Instant photos on a table: white frames, a strip of tape, captions written on the frame.', 'Foto instan di atas meja: bingkai putih, selotip, keterangan ditulis di bingkainya.'],
    { head: 'caveat', body: 'karla', label: 'caveat' },
    { paper: '#dfe4e8', surface: '#ffffff', ink: '#1f2428', muted: '#4a525a', line: '#c3cbd2', accent: '#2a5d9f', second: '#f4d03f' },
    { vars: { r: '0', 'r-btn': '4px' }, css: `
.title{font-size:clamp(2.6rem,9vw,4.2rem)}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:34px 24px}
.work{position:relative;background:var(--surface);padding:12px 12px 6px;box-shadow:2px 3px 0 rgba(0,0,0,.16)}
.work:nth-child(4n+1){transform:rotate(-1.6deg)}.work:nth-child(4n+2){transform:rotate(1.1deg)}.work:nth-child(4n){transform:rotate(1.7deg)}
.work::before{content:"";position:absolute;top:-10px;left:50%;width:76px;height:22px;margin-left:-38px;background:var(--second);opacity:.8;transform:rotate(-3deg)}
.work-media img,.work-media video{aspect-ratio:1;object-fit:cover}
.work figcaption{font-family:var(--f-label);font-size:1.4rem;line-height:1.2;min-height:2.6em}
.work figcaption p{font-family:var(--f-label);font-size:1.15rem}` }),

  d('album-kenangan', 'gallery', 'Album Kenangan',
    ['An old photo album: dark pages, prints with white borders held by gold corners.', 'Album foto lama: halaman gelap, cetakan foto berbingkai putih dijepit sudut emas.'],
    { head: 'eb-garamond', body: 'eb-garamond', label: 'courier-prime' },
    { paper: '#2b241d', surface: '#3a3128', ink: '#efe6d8', muted: '#c8bba7', line: '#5a4b3b', accent: '#d8b46a', second: '#f1ece2' },
    { vars: { r: '0', 'r-btn': '0', size: '18px' }, css: `
.top-in{flex-direction:column;text-align:center}.title{font-style:italic;font-size:clamp(2.2rem,8vw,3.6rem)}
.top-in::after{content:"";width:120px;border-top:1px solid var(--accent)}
.about{margin:0 auto;text-align:center}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:40px 30px}
.work-media{position:relative;border:9px solid var(--second)}
.work-media::before,.work-media::after{content:"";position:absolute;width:28px;height:28px;z-index:1}
.work-media::before{top:-9px;left:-9px;background:linear-gradient(135deg,var(--accent) 50%,transparent 50%)}
.work-media::after{right:-9px;bottom:-9px;background:linear-gradient(315deg,var(--accent) 50%,transparent 50%)}
.work figcaption{text-align:center;font-family:var(--f-label);font-size:.95rem}` }),

  d('ruang-pamer', 'gallery', 'Ruang Pamer',
    ['A gallery wall: every work at its own shape, in columns, with a small label beside it.', 'Dinding pameran: setiap karya dengan bentuk aslinya, dalam kolom, dengan label kecil.'],
    { head: 'archivo-narrow', body: 'public-sans', label: 'public-sans' },
    { paper: '#ffffff', surface: '#f5f5f5', ink: '#151515', muted: '#5c5c5c', line: '#e6e6e6', accent: '#151515', second: '#151515' },
    { w: 600, vars: { r: '0', 'r-btn': '0', wrap: '1240px' }, dark: { paper: '#141414', surface: '#1d1d1d', ink: '#efefef', muted: '#a3a3a3', line: '#2e2e2e', accent: '#efefef', second: '#efefef' }, css: `
.top-in{padding-top:46px;padding-bottom:36px}.title{font-size:clamp(2rem,6vw,3.4rem);letter-spacing:-.01em}
.about{font-size:1.15rem;max-width:52ch}
.items-h{display:none}
.items-in.grid{display:block;columns:3 260px;column-gap:30px}
.work{break-inside:avoid;margin:0 0 36px}
.work figcaption{font-size:.85rem;color:var(--muted);border-left:1px solid var(--ink);padding-left:10px;margin-top:12px}
.work figcaption strong{color:var(--ink);font-weight:600}.work figcaption p{font-size:.85rem}` }),

  d('lembar-kontak', 'gallery', 'Lembar Kontak',
    ['A film contact sheet: frames in a strip with sprocket holes, numbered, the pick marked in red pencil.', 'Lembar kontak film: bingkai berderet dengan lubang film, bernomor, pilihan ditandai pensil merah.'],
    { head: 'big-shoulders-display', body: 'work-sans', label: 'courier-prime' },
    { paper: '#1e1d1b', surface: '#2a2926', ink: '#f1efe9', muted: '#b9b5ab', line: '#4a4843', accent: '#e2382f', second: '#f3b333' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1100px' }, css: `
.title{text-transform:uppercase;font-size:clamp(2.4rem,9vw,4.4rem)}
.items-in.grid{counter-reset:frame;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:0;padding:26px 8px;background:linear-gradient(90deg,var(--paper) 0 7px,transparent 7px) 0 8px/17px 9px repeat-x,linear-gradient(90deg,var(--paper) 0 7px,transparent 7px) 0 calc(100% - 8px)/17px 9px repeat-x,var(--surface)}
.work{counter-increment:frame;position:relative;padding:14px 10px 10px}
.work::before{content:counter(frame) "A";position:absolute;top:-1px;left:12px;font-family:var(--f-label);font-size:.75rem;color:var(--second-text)}
.work-media img,.work-media video{aspect-ratio:3/2;object-fit:cover;border-radius:0}
.work:first-child .work-media{outline:3px solid var(--accent);outline-offset:4px;border-radius:2px}
.work figcaption{font-family:var(--f-label);font-size:.85rem}` }),

  d('buku-tahunan', 'gallery', 'Buku Tahunan',
    ['A yearbook page: portraits in rows, a name under each and a line they chose.', 'Halaman buku tahunan: foto berderet, nama di bawahnya dan satu kalimat pilihan mereka.'],
    { head: 'barlow-condensed', body: 'barlow', label: 'barlow-condensed' },
    { paper: '#ffffff', surface: '#eef1f6', ink: '#162033', muted: '#4a556b', line: '#cfd6e2', accent: '#1b3a8c', second: '#f2c230' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1060px' }, css: `
.top{background:var(--accent);color:var(--on-accent);border-bottom:8px solid var(--second)}.tagline{color:inherit}
.title{text-transform:uppercase;font-size:clamp(2.6rem,10vw,5rem);line-height:.95}
.items-h{text-transform:uppercase}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(45%,180px),1fr));gap:24px 16px}
.work-media img,.work-media video{aspect-ratio:4/5;object-fit:cover}
.work figcaption{text-align:center}
.work figcaption strong{font-family:var(--f-head);font-weight:700;font-size:1.3rem;text-transform:uppercase;letter-spacing:.02em}
.work figcaption p{font-style:italic}.work figcaption p::before{content:"\\201C"}.work figcaption p::after{content:"\\201D"}` }),

  d('kliping', 'gallery', 'Kliping',
    ['A scrapbook on brown kraft paper: cuttings taped down, typed labels under each.', 'Kliping di kertas kraft cokelat: potongan ditempel selotip, label ketikan di bawahnya.'],
    { head: 'special-elite', body: 'karla', label: 'special-elite' },
    { paper: '#c8a97e', surface: '#f7f3ea', ink: '#241c12', muted: '#4a3d2b', line: '#8b6d47', accent: '#2f4f8f', second: '#8fb3d9' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
body{background-image:repeating-linear-gradient(115deg,rgba(0,0,0,.025) 0 2px,transparent 2px 7px)}
.title{display:inline-block;background:var(--surface);padding:6px 16px;transform:rotate(-1.5deg);font-size:clamp(1.9rem,7vw,3.2rem)}
.tagline{color:var(--ink)}
.about{background:var(--surface);padding:16px 20px;transform:rotate(.4deg)}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:36px 28px}
.work{position:relative;background:var(--surface);padding:10px 10px 14px;box-shadow:2px 3px 0 rgba(0,0,0,.18)}
.work:nth-child(odd){transform:rotate(-1deg)}.work:nth-child(even){transform:rotate(1.2deg)}
.work::before,.work::after{content:"";position:absolute;width:56px;height:20px;background:var(--second);opacity:.75}
.work::before{top:-8px;left:-14px;transform:rotate(-38deg)}.work::after{top:-8px;right:-14px;transform:rotate(38deg)}
.work figcaption{font-family:var(--f-label)}.work figcaption p{font-family:var(--f-body)}
.contact{background:var(--surface);padding:6px 20px 18px;border:0}` }),

  d('layar-lebar', 'gallery', 'Layar Lebar',
    ['A showreel for video work: every clip wide, between black bars, the first one across the page.', 'Showreel video: setiap klip lebar di antara pita hitam, klip pertama selebar halaman.'],
    { head: 'schibsted-grotesk', body: 'schibsted-grotesk', label: 'schibsted-grotesk' },
    { paper: '#1b222b', surface: '#232c37', ink: '#eef1f5', muted: '#aab4c0', line: '#364253', accent: '#f0b429', second: '#000000' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1180px' }, css: `
.title{text-transform:uppercase;font-size:clamp(2.4rem,9vw,5rem);letter-spacing:-.01em}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,420px),1fr));gap:34px}
.work:first-child{grid-column:1/-1}
.work-media{border-top:14px solid var(--second);border-bottom:14px solid var(--second);background:var(--second)}
.work-media img,.work-media video{aspect-ratio:16/9;object-fit:cover}
.work figcaption strong{font-size:1.15rem}` }),

  /* ------------------------------------------------ link cards */
  d('kartu-nama', 'links', 'Kartu Nama',
    ['A business card on a desk, a second one under it; the links as lines on the back.', 'Kartu nama di atas meja dengan satu kartu lagi di bawahnya; link-nya baris di bagian belakang.'],
    { head: 'spectral', body: 'public-sans', label: 'public-sans' },
    { paper: '#e7e9ec', surface: '#ffffff', ink: '#1d2127', muted: '#4f5661', line: '#d0d4da', accent: '#1d2127', second: '#c9cdd3' },
    { vars: { r: '2px', 'r-btn': '2px', wrap: '600px' }, css: `
.top-in{margin-top:40px;background:var(--surface);align-items:flex-start;text-align:left;padding:32px 28px;max-width:min(560px,100% - 32px);box-shadow:0 10px 0 -4px var(--second)}
.k-links .top-in{flex-direction:row;text-align:left}
.title{font-size:2rem}.tagline{font-size:1rem}
.k-links .items-in{gap:0;background:var(--surface);max-width:min(560px,100%);padding:6px 28px}
.link-btn{justify-content:flex-start;text-align:left;border:0;border-bottom:1px solid var(--line);border-radius:0;color:var(--ink);font-weight:600}
.link-btn:last-child{border-bottom:0}.link-btn:hover{color:var(--accent-text)}
.contact{max-width:560px;margin-left:auto;margin-right:auto;border:0}` }),

  d('stiker', 'links', 'Stiker',
    ['A sheet of die-cut stickers: every link a sticker with a white edge, stuck on a little crooked.', 'Lembar stiker: setiap link satu stiker bertepi putih, ditempel agak miring.'],
    { head: 'lilita-one', body: 'nunito', label: 'lilita-one' },
    { paper: '#ffd84d', surface: '#ffffff', ink: '#1d1d1f', muted: '#3f3f46', line: '#1d1d1f', accent: '#0a63c9', second: '#ff5c8a' },
    { vars: { r: '999px', 'r-btn': '999px' }, css: `
.title{font-size:clamp(2.6rem,10vw,4.4rem)}.tagline{color:var(--ink)}
.logo{border-radius:50%;box-shadow:0 0 0 6px var(--surface),0 0 0 8px var(--line)}
.k-links .items-in{display:flex;flex-wrap:wrap;justify-content:center;gap:20px 16px;max-width:640px}
.link-btn{background:var(--surface);color:var(--ink);border:3px solid var(--line);font-family:var(--f-head);font-weight:400;font-size:1.25rem;box-shadow:0 0 0 5px var(--surface),4px 6px 0 5px rgba(0,0,0,.18)}
.link-btn:nth-child(odd){transform:rotate(-2deg)}.link-btn:nth-child(even){transform:rotate(1.6deg)}
.link-btn:nth-child(3n+1){background:var(--accent);color:var(--on-accent)}.link-btn:nth-child(3n+2){background:var(--second);color:var(--on-second)}
.contact{border:0;text-align:center}.buttons{justify-content:center}` }),

  d('rambu', 'links', 'Rambu',
    ['Road signs: every link a green direction board with a white edge and an arrow, on one post.', 'Rambu jalan: setiap link papan petunjuk arah hijau bertepi putih dengan panah, di satu tiang.'],
    { head: 'barlow', body: 'barlow', label: 'barlow-condensed' },
    { paper: '#eef1ef', surface: '#ffffff', ink: '#15201a', muted: '#48544c', line: '#8b9096', accent: '#0a6b3d', second: '#1a4fa0' },
    { vars: { r: '8px', 'r-btn': '6px' }, css: `
.k-links .items-in{gap:10px}
.link-btn{justify-content:space-between;text-align:left;background:var(--accent);color:var(--on-accent);border:0;box-shadow:inset 0 0 0 3px var(--accent),inset 0 0 0 6px var(--on-accent);padding:16px 24px;font-size:1.2rem;min-height:64px}
.link-btn::after{content:"";flex:none;border-left:16px solid currentColor;border-top:11px solid transparent;border-bottom:11px solid transparent}
.link-btn:nth-child(even){background:var(--second);color:var(--on-second);box-shadow:inset 0 0 0 3px var(--second),inset 0 0 0 6px var(--on-second)}
.k-links .items-in::after{content:"";width:14px;height:70px;margin:0 auto;background:var(--line)}
.contact{text-align:center;border:0}.buttons{justify-content:center}` }),

  d('struk', 'links', 'Struk',
    ['A till receipt: a narrow strip with torn edges, the links as line items, a barcode at the end.', 'Struk belanja: kertas sempit bertepi sobek, link-nya baris belanjaan, barcode di ujungnya.'],
    { head: 'courier-prime', body: 'courier-prime', label: 'courier-prime' },
    { paper: '#d9d9d5', surface: '#ffffff', ink: '#222222', muted: '#555555', line: '#222222', accent: '#222222', second: '#222222' },
    { vars: { r: '0', 'r-btn': '0', wrap: '440px' }, css: `
.top,.main,.bottom{max-width:420px;margin:0 auto;background:var(--surface)}
.top{margin-top:30px;position:relative}
.top::before{content:"";position:absolute;top:-10px;left:0;right:0;height:10px;background:linear-gradient(135deg,var(--surface) 5px,transparent 0) 0 0/10px 10px repeat-x,linear-gradient(225deg,var(--surface) 5px,transparent 0) 0 0/10px 10px repeat-x;transform:scaleY(-1)}
.top-in{border-bottom:2px dashed var(--line)}
.title{font-size:1.6rem;text-transform:uppercase}.tagline{color:var(--ink)}
.main{padding:8px 0 10px}
.k-links .items-in{gap:0;padding:6px 18px 0}
.link-btn{justify-content:flex-start;border:0;border-radius:0;color:var(--ink);font-weight:400;min-height:46px;padding:8px 0;text-align:left}
.link-btn::after{content:"";flex:1;border-bottom:2px dotted var(--line);align-self:flex-end;margin-bottom:12px}
.k-links .items-in::after{content:"";height:46px;margin:18px 0 6px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 7px,transparent 7px 9px,var(--ink) 9px 10px,transparent 10px 13px)}
.contact{margin:0;padding:4px 18px 10px;border-top:2px dashed var(--line)}
.btn{background:none;color:var(--ink);border:2px solid var(--line)}
.bottom{position:relative;margin-bottom:30px;text-align:center;padding:10px 0 18px}
.bottom::after{content:"";position:absolute;bottom:-10px;left:0;right:0;height:10px;background:linear-gradient(135deg,var(--surface) 5px,transparent 0) 0 0/10px 10px repeat-x,linear-gradient(225deg,var(--surface) 5px,transparent 0) 0 0/10px 10px repeat-x}` }),

  d('papan-warung', 'links', 'Papan Warung',
    ['A painted shop sign: red, blue and yellow boards, thick black outlines, letters like a sign painter’s.', 'Papan warung dicat: papan merah, biru dan kuning, garis hitam tebal, huruf ala tukang cat papan.'],
    { head: 'bungee', body: 'rubik', label: 'rubik' },
    { paper: '#ffd200', surface: '#ffffff', ink: '#1a1a1a', muted: '#3a3a3a', line: '#1a1a1a', accent: '#d7261e', second: '#1d4fa3' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.top{background:var(--accent);color:var(--on-accent);border-bottom:6px solid var(--line)}.tagline{color:inherit;font-weight:600}
.title{font-size:clamp(2.1rem,9vw,3.8rem);text-shadow:3px 3px 0 var(--line)}
.logo{border:4px solid var(--line);background:var(--surface)}
.main{padding-top:34px}
.link-btn{background:var(--surface);color:var(--ink);border:4px solid var(--line);font-family:var(--f-head);font-weight:400;font-size:1.1rem;box-shadow:5px 5px 0 var(--line)}
.link-btn:nth-child(3n+2){background:var(--second);color:var(--on-second)}.link-btn:nth-child(3n){background:var(--accent);color:var(--on-accent)}
.contact{border-top:4px solid var(--line)}.btn{border:3px solid var(--line)}` }),

  d('amplop', 'links', 'Amplop',
    ['An airmail envelope: red and blue stripes round the edge, a stamp for the photo, links written as address lines.', 'Amplop pos udara: garis merah biru di tepi, prangko untuk foto, link ditulis seperti baris alamat.'],
    { head: 'young-serif', body: 'karla', label: 'courier-prime' },
    { paper: '#ffffff', surface: '#ffffff', ink: '#1c2340', muted: '#4b5270', line: '#c9cde0', accent: '#1c3d8f', second: '#c8202f' },
    { vars: { r: '0', 'r-btn': '0', wrap: '620px' }, css: `
body{border:12px solid transparent;border-image:repeating-linear-gradient(45deg,var(--second) 0 14px,var(--paper) 14px 22px,var(--accent) 22px 36px,var(--paper) 36px 44px) 12;min-height:100vh}
.logo{width:88px;height:100px;padding:6px;background:var(--surface);border:2px dashed var(--muted);border-radius:0}
.title{font-size:clamp(1.9rem,7vw,2.8rem)}
.k-links .items-in{gap:0}
.link-btn{justify-content:flex-start;text-align:left;border:0;border-bottom:1px solid var(--line);border-radius:0;color:var(--ink);font-family:var(--f-head);font-weight:400;font-size:1.25rem;min-height:58px;padding:14px 4px}
.link-btn:hover{color:var(--accent-text)}` }),

  d('garis-tipis', 'links', 'Garis Tipis',
    ['Black on white, set left: a large name, the links as full rows that turn black when touched.', 'Hitam di atas putih, rata kiri: nama besar, link sebagai baris penuh yang menghitam saat disentuh.'],
    { head: 'archivo', body: 'archivo', label: 'archivo' },
    { paper: '#ffffff', surface: '#f3f3f3', ink: '#000000', muted: '#555555', line: '#000000', accent: '#000000', second: '#000000' },
    { vars: { r: '0', 'r-btn': '0', wrap: '640px' }, dark: { paper: '#000000', surface: '#151515', ink: '#ffffff', muted: '#a6a6a6', line: '#ffffff', accent: '#ffffff', second: '#ffffff' }, css: `
.k-links .top-in{flex-direction:column;align-items:flex-start;text-align:left;padding-top:60px}
.title{font-size:clamp(2.4rem,9vw,3.8rem);letter-spacing:-.02em}
.k-links .items-in{gap:0;border-bottom:1px solid var(--line);max-width:none}
.link-btn{justify-content:flex-start;text-align:left;border:0;border-top:1px solid var(--line);border-radius:0;color:var(--ink);font-size:1.3rem;font-weight:600;min-height:68px;padding:18px 0;transition:background .15s,color .15s,padding .15s}
.link-btn:hover,.link-btn:focus-visible{background:var(--ink);color:var(--paper);padding-left:14px}
.contact{border:0}.btn{background:none;color:var(--ink);border:1px solid var(--line)}` }),

  d('daftar-kontak', 'links', 'Daftar Kontak',
    ['A shop’s contact list: the business on top, every way to reach it a tile in two columns.', 'Daftar kontak usaha: nama usaha di atas, setiap cara menghubungi satu ubin, dua kolom.'],
    { head: 'plus-jakarta-sans', body: 'plus-jakarta-sans', label: 'plus-jakarta-sans' },
    { paper: '#f3f5f8', surface: '#ffffff', ink: '#121a26', muted: '#4d5869', line: '#d9dee6', accent: '#0b4f8a', second: '#0b4f8a' },
    { vars: { r: '10px', 'r-btn': '8px', wrap: '680px' }, dark: { paper: '#10151d', surface: '#19202b', ink: '#e8edf4', muted: '#a1abba', line: '#2b3442', accent: '#6fb0ff', second: '#6fb0ff' }, css: `
.k-links .top-in{flex-direction:row;text-align:left}
.logo{width:64px;height:64px}
.k-links .items-in{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:none}
.link-btn{flex-direction:column;align-items:flex-start;justify-content:flex-end;text-align:left;min-height:100px;background:var(--surface);border:1px solid var(--line);color:var(--ink);font-size:1rem;padding:14px}
.link-btn:hover{border-color:var(--accent)}
.link-btn span{border-bottom:2px solid var(--accent);padding-bottom:2px}` }),

  /* ------------------------------------------------ invitations */
  d('undangan-resmi', 'invite', 'Undangan Resmi',
    ['A printed formal invitation: centred, a script title, small capitals for the details, a fine double frame.', 'Undangan resmi cetak: rata tengah, judul huruf sambung, keterangan huruf kapital kecil, bingkai ganda tipis.'],
    { head: 'great-vibes', body: 'eb-garamond', label: 'cinzel' },
    { paper: '#ffffff', surface: '#f8f6f1', ink: '#1f2436', muted: '#555b6e', line: '#b08d4a', accent: '#1f2f5a', second: '#b08d4a' },
    { vars: { r: '0', 'r-btn': '0', wrap: '680px', size: '18px' }, css: `
.top-in{flex-direction:column;text-align:center;padding-top:48px}
.title{font-size:clamp(2.8rem,11vw,4.4rem);line-height:1.15}
.tagline{font-family:var(--f-label);letter-spacing:.08em;font-size:.95rem}
.cover-wrap{max-width:640px;margin-top:10px}.cover{aspect-ratio:3/2}
.main{margin-top:26px;max-width:min(640px,100% - 40px);border:1px solid var(--line);outline:1px solid var(--line);outline-offset:6px;padding:30px 22px}
.about{margin:0 auto;text-align:center}
.event,.items{text-align:center}.event::before,.items::before{content:"";display:block;width:120px;height:1px;background:var(--line);margin:28px auto}
.event dt{font-family:var(--f-label);letter-spacing:.1em}.event dd{font-weight:500;font-size:1.3rem}
.items-h{font-family:var(--f-label);font-size:1.1rem;letter-spacing:.08em}
.items-in{gap:14px}.post .date{color:var(--second-text);font-family:var(--f-label)}.post h3{font-family:var(--f-body);font-weight:600;font-size:1.2rem}
.contact{text-align:center}.buttons{justify-content:center}.bottom{text-align:center}.btn{letter-spacing:.05em}` }),

  d('toga', 'invite', 'Toga',
    ['A graduation: the date set as large as the name, a gold tassel line, the programme by the clock.', 'Wisuda: tanggal sebesar nama acaranya, garis emas seperti tali toga, susunan acara per jam.'],
    { head: 'big-shoulders-display', body: 'work-sans', label: 'work-sans' },
    { paper: '#ffffff', surface: '#f1f3f8', ink: '#10172a', muted: '#4a5370', line: '#d6dbe7', accent: '#10172a', second: '#c9a227' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.top{background:var(--accent);color:var(--on-accent)}.tagline{color:inherit}
.title{text-transform:uppercase;font-size:clamp(1.9rem,6vw,2.9rem)}
.main{display:flex;flex-direction:column}.event{order:-1}
.event::before{content:"";display:block;height:8px;margin-bottom:10px;background:repeating-linear-gradient(90deg,var(--second) 0 16px,transparent 16px 20px)}
.event-facts{gap:0}.event dt{margin-top:16px}
.event dd{font-family:var(--f-head);font-weight:800;font-size:clamp(2rem,9vw,3.9rem);line-height:1;text-transform:uppercase}
.event .map-link{font-family:var(--f-body);font-size:1rem;text-transform:none}
.items-in{gap:0}.post{display:grid;grid-template-columns:92px 1fr;gap:14px;padding:14px 0;border-top:1px solid var(--line)}
.post .date{font-family:var(--f-head);font-weight:700;font-size:1.45rem;color:var(--ink)}` }),

  d('reuni', 'invite', 'Reuni',
    ['A reunion in the colours of an old poster: teal, mustard and tomato stripes, a fat serif title.', 'Reuni dengan warna poster lama: garis tosca, mustard dan tomat, judul serif gemuk.'],
    { head: 'abril-fatface', body: 'rubik', label: 'rubik' },
    { paper: '#0f5e63', surface: '#12494d', ink: '#fbf3e4', muted: '#cfe0dc', line: '#e5533d', accent: '#f2a93b', second: '#e5533d' },
    { vars: { r: '26px', 'r-btn': '999px' }, css: `
.top::after{content:"";order:3;height:36px;background:linear-gradient(var(--accent) 0 33.3%,var(--second) 33.3% 66.6%,var(--surface) 66.6%)}
.top-in{flex-direction:column;align-items:flex-start;padding-top:46px}
.title{font-size:clamp(2.6rem,11vw,5.2rem);line-height:.98}
.cover-wrap{order:4;margin-top:18px}
.event-facts{background:var(--surface);border-radius:var(--r);padding:22px}
.btn{font-weight:700}
.items-in{gap:0}.post{padding:12px 0;border-bottom:2px dotted var(--line)}.post .date{color:var(--accent-text);font-weight:700}` }),

  d('karcis', 'invite', 'Karcis',
    ['An admission ticket: the details on the ticket, the reply button on its stub behind a perforated line.', 'Karcis masuk: keterangan acara di karcisnya, tombol konfirmasi di sobekan di balik garis putus-putus.'],
    { head: 'alfa-slab-one', body: 'zilla-slab', label: 'courier-prime' },
    { paper: '#e6eaee', surface: '#fff6d9', ink: '#1f1f1f', muted: '#4d4d4d', line: '#1f1f1f', accent: '#b3122d', second: '#1f1f1f' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.title{font-size:clamp(2.1rem,8vw,3.5rem)}
.event{background:var(--surface);border:2px solid var(--line)}
.event-facts{padding:20px;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))}
.event dt{text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}
.event dd{font-family:var(--f-head);font-weight:400;font-size:1.3rem}
.rsvp{position:relative;margin:0;padding:18px 20px;border-top:2px dashed var(--line);background:var(--accent-soft)}
.rsvp::before,.rsvp::after{content:"";position:absolute;top:-12px;width:22px;height:22px;border-radius:50%;background:var(--paper);border:2px solid var(--line)}
.rsvp::before{left:-12px;clip-path:inset(0 0 0 50%)}.rsvp::after{right:-12px;clip-path:inset(0 50% 0 0)}
.items-in{gap:0}.post{display:grid;grid-template-columns:80px 1fr;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.post .date{font-weight:700;color:var(--ink)}` }),

  d('kartu-ucapan', 'invite', 'Kartu Ucapan',
    ['A folded greeting card: the picture and the name on the front, the words inside on the right.', 'Kartu ucapan lipat: foto dan nama di depan, isinya di halaman kanan.'],
    { head: 'dancing-script', body: 'spectral', label: 'spectral' },
    { paper: '#f7eef0', surface: '#ffffff', ink: '#2a2226', muted: '#5e5156', line: '#e2cfd5', accent: '#8c2f4f', second: '#6b7f5e' },
    { vars: { r: '4px', 'r-btn': '4px', wrap: '640px' }, css: `
.top{background:var(--surface)}.cover-wrap{order:-1;max-width:none;padding:0}.cover{border-radius:0;max-height:none;aspect-ratio:4/3}
.top-in{flex-direction:column;text-align:center;padding-bottom:30px}
.title{font-size:clamp(2.6rem,9vw,4.2rem);color:var(--accent-text)}
@media (min-width:900px){body{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
.top{grid-row:1/span 3;position:sticky;top:0;height:100vh;overflow:auto;justify-content:center;box-shadow:inset -18px 0 22px -20px rgba(0,0,0,.35)}.cover{aspect-ratio:auto;max-height:55vh}
.main,.bottom{grid-column:2}}
.items-in{gap:0}.post{padding:12px 0;border-bottom:1px solid var(--line)}.post .date{color:var(--second-text)}.post h3{font-family:var(--f-body);font-weight:700;font-size:1.15rem}` }),

  d('poster-acara', 'invite', 'Poster Acara',
    ['An event poster: the title as big as the page allows, the date and place in thick blocks.', 'Poster acara: judul sebesar yang muat di halaman, tanggal dan tempat dalam blok tebal.'],
    { head: 'anton', body: 'archivo', label: 'archivo' },
    { paper: '#ffffff', surface: '#f0f0f0', ink: '#141414', muted: '#4d4d4d', line: '#141414', accent: '#0039a6', second: '#ffd400' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1000px' }, css: `
.top-in{display:block;padding-top:26px}
.title{font-size:clamp(3.2rem,16vw,9rem);line-height:.86;text-transform:uppercase}
.tagline{font-family:var(--f-label);font-weight:700;font-size:1.2rem;color:var(--ink)}
.event-facts{gap:0;border-top:6px solid var(--line)}.event-facts>div{border-bottom:6px solid var(--line);padding:12px 0}
.event-facts>div:first-child{background:var(--second);color:var(--on-second);padding:12px}
.event-facts>div:first-child dt{color:inherit}
.event dd{font-family:var(--f-head);font-weight:400;font-size:clamp(1.8rem,7vw,3rem);line-height:1.05;text-transform:uppercase}
.event .map-link{font-family:var(--f-body);font-size:1rem;text-transform:none}
.btn{font-family:var(--f-head);font-weight:400;font-size:1.4rem;text-transform:uppercase}
.post{display:grid;grid-template-columns:90px 1fr;gap:12px}.post .date{font-weight:700;color:var(--ink)}` }),

  d('surat', 'invite', 'Surat Undangan',
    ['A typed letter of invitation, sealed in wax: the details as “Hari/tanggal :” lines, the way they are typed here.', 'Surat undangan diketik, bersegel lilin: keterangannya berbaris “Hari/tanggal :”, seperti biasa diketik.'],
    { head: 'special-elite', body: 'courier-prime', label: 'courier-prime' },
    { paper: '#d6dde3', surface: '#fbfaf5', ink: '#222222', muted: '#4d4d4d', line: '#9aa7b3', accent: '#233a6e', second: '#a12b2b' },
    { vars: { r: '0', 'r-btn': '0', wrap: '700px' }, css: `
.top,.main{max-width:680px;margin:0 auto;background:var(--surface)}
.top{margin-top:30px;padding-top:24px}
.top::before{content:"";order:-2;width:64px;height:64px;border-radius:50%;background:var(--second);margin:0 auto;box-shadow:inset 0 0 0 7px rgba(0,0,0,.16)}
.top-in{flex-direction:column;text-align:center;padding-top:16px}.title{font-size:1.9rem}
.main{padding:20px 28px 40px;margin-bottom:30px}
.event-facts{grid-template-columns:auto 1fr;gap:6px 14px}.event-facts>div{display:contents}
.event dt{color:var(--ink);font-size:1rem}.event dt::after{content:" :"}.event dd{font-size:1rem;font-weight:700}
.btn{background:none;color:var(--accent-text);border:2px solid currentColor}
.items-in{gap:0}.post{display:grid;grid-template-columns:72px 1fr;gap:10px}.post .date{color:var(--ink)}` }),

  /* ------------------------------------------------ catalogues */
  d('label-toples', 'catalog', 'Label Toples',
    ['Homemade jar labels: each product on a label with a double border and a price tag.', 'Label toples kue rumahan: setiap produk di label bergaris ganda dengan label harga.'],
    { head: 'young-serif', body: 'lexend', label: 'young-serif' },
    { paper: '#eef3f1', surface: '#ffffff', ink: '#2a1a14', muted: '#5a463c', line: '#2a1a14', accent: '#a3262a', second: '#e3b23c' },
    { vars: { r: '14px', 'r-btn': '10px' }, css: `
.top-in{flex-direction:column;text-align:center}.title{font-size:clamp(2.2rem,8vw,3.4rem)}
.logo{border-radius:50%}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(45%,210px),1fr));gap:14px}
.card{background:var(--surface);border:2px solid var(--line);border-radius:20px;padding:10px;outline:1px solid var(--line);outline-offset:-8px}
.card-body{text-align:center;padding:10px 8px 6px}.card h3{font-size:1.2rem}
.price{display:inline-block;background:var(--accent);color:var(--on-accent);padding:4px 14px;border-radius:4px 16px 16px 4px;font-weight:400}
.order .btn{width:100%;padding:8px 10px;font-size:.92rem}` }),

  d('papan-menu', 'catalog', 'Papan Menu',
    ['A chalkboard menu in a wooden frame: chalk handwriting, prices at the end of dotted lines.', 'Papan menu kapur berbingkai kayu: tulisan kapur, harga di ujung garis titik-titik.'],
    { head: 'kalam', body: 'atkinson-hyperlegible', label: 'kalam' },
    { paper: '#23302a', surface: '#2b3a33', ink: '#f2f2ea', muted: '#c9cfc6', line: '#8fa097', accent: '#f2d16b', second: '#7a5232' },
    { vars: { r: '6px', 'r-btn': '28px 8px 24px 10px', wrap: '760px' }, css: `
body{border:14px solid var(--second);min-height:100vh;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1.2px);background-size:4px 4px}
.top-in{flex-direction:column;text-align:center}.title{font-size:clamp(2.4rem,9vw,4rem);color:var(--accent-text)}
.items-h{text-align:center;color:var(--accent-text)}
.items-in.grid{grid-template-columns:1fr;gap:0}
.card{display:grid;gap:14px;padding:16px 0;border-bottom:1px dashed var(--line)}
.card:not(.no-img){grid-template-columns:1fr 88px}.card-media{order:2}
.card-body{padding:0;display:grid;grid-template-columns:1fr auto;column-gap:12px;align-content:start}
.card-body>*{grid-column:1/-1}
.card-body h3{grid-column:1;display:flex;gap:8px;font-size:1.4rem}.card-body h3::after{content:"";flex:1;min-width:20px;border-bottom:2px dotted var(--line);margin-bottom:.4em}
.price{grid-column:2;grid-row:1;align-self:end;max-width:9.5em;text-align:right;font-size:1.3rem;margin:0 0 .35em}
.btn{background:none;color:var(--ink);border:2px solid var(--ink);font-family:var(--f-head)}` }),

  d('etalase', 'catalog', 'Etalase',
    ['A shop window: tall product photos two by two on a phone, the price on a strip across the corner.', 'Etalase toko: foto produk tinggi, dua-dua di HP, harga di pita di sudut foto.'],
    { head: 'chivo', body: 'chivo', label: 'chivo' },
    { paper: '#ffffff', surface: '#f2f3f5', ink: '#15171a', muted: '#555b63', line: '#e1e4e8', accent: '#c2185b', second: '#15171a' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1100px' }, dark: { paper: '#121316', surface: '#1c1e22', ink: '#eceef1', muted: '#a2a8b1', line: '#2d3036', accent: '#ff6fa5', second: '#eceef1' }, css: `
.title{font-size:clamp(1.9rem,6vw,2.7rem)}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(45%,220px),1fr));gap:22px 12px}
.card{position:relative}.card-media img{aspect-ratio:4/5}
.card:not(.no-img) .price{position:absolute;top:12px;left:0;background:var(--accent);color:var(--on-accent);padding:4px 10px;font-size:.9rem}
.card.no-img{background:var(--surface);padding:14px}
.card h3{font-size:1rem;font-weight:600}.card-body p{font-size:.92rem;color:var(--muted)}
.order .btn{width:100%;padding:8px 10px;font-size:.92rem}` }),

  d('nota', 'catalog', 'Nota',
    ['A carbon-copy receipt book: the shop’s name printed in red, the goods written in blue, prices on the right.', 'Buku nota rangkap: nama toko dicetak merah, barang ditulis tinta biru, harga di kanan.'],
    { head: 'patrick-hand', body: 'atkinson-hyperlegible', label: 'patrick-hand' },
    { paper: '#eeeeea', surface: '#fff6f8', ink: '#1a3470', muted: '#475785', line: '#e2a8b8', accent: '#1a3470', second: '#c2324a' },
    { vars: { r: '0', 'r-btn': '4px', wrap: '760px' }, css: `
.top-in{margin-top:24px;background:var(--surface);border:2px solid var(--second);border-bottom:0;max-width:min(var(--wrap),100% - 36px)}
.title,.tagline{color:var(--second-text)}.title{font-size:clamp(2rem,7vw,3rem)}
.main{padding-top:0}
.about{background:var(--surface);border:2px solid var(--second);border-top:1px solid var(--line);padding:14px 18px;margin:0;max-width:none}
.items{background:var(--surface);border:2px solid var(--second);border-top:0}
.items-h{margin:0;padding:8px 18px;background:var(--second);color:var(--on-second);font-size:1.3rem}
.items-in.grid{grid-template-columns:1fr;gap:0}
.card{display:flex;gap:12px;align-items:flex-start;padding:10px 18px;border-bottom:1px solid var(--line)}
.card-media{flex:none;width:56px}.card-media img{border-radius:0}
.card-body{flex:1;padding:0;display:grid;grid-template-columns:1fr auto;column-gap:14px}.card-body>*{grid-column:1/-1}
.card-body h3{grid-column:1;font-size:1.35rem}.price{grid-column:2;grid-row:1;font-family:var(--f-head);font-size:1.3rem;font-weight:400;color:var(--ink)}
.card-body p{margin-bottom:.4em}` }),

  d('lapak', 'catalog', 'Lapak',
    ['A market stall under a striped awning: products on the table, prices on yellow stickers.', 'Lapak di bawah terpal bergaris: produk di atas meja, harga di stiker kuning.'],
    { head: 'alfa-slab-one', body: 'barlow', label: 'alfa-slab-one' },
    { paper: '#ffffff', surface: '#f4f6fa', ink: '#182033', muted: '#4b5368', line: '#d5dbe6', accent: '#1f5fbf', second: '#ffd23f' },
    { vars: { r: '4px', 'r-btn': '4px' }, css: `
.top::before{content:"";order:-2;height:52px;background:radial-gradient(circle at 18px 100%,var(--paper) 0 10px,transparent 10.5px) 0 0/36px 100% repeat-x,repeating-linear-gradient(90deg,var(--accent) 0 36px,var(--surface) 36px 72px)}
.title{font-size:clamp(2rem,7vw,3.1rem)}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(45%,210px),1fr));gap:14px}
.card{background:var(--surface);border:1px solid var(--line);padding:10px}
.price{display:inline-block;background:var(--second);color:var(--on-second);padding:4px 10px;border-radius:3px;transform:rotate(-4deg);font-weight:400}
.btn{font-family:var(--f-body);font-weight:700}.order .btn{width:100%;padding:8px 10px;font-size:.95rem}` }),

  d('katalog-cetak', 'catalog', 'Katalog Cetak',
    ['A printed catalogue page: a ruled grid, every product numbered so it can be ordered by number.', 'Halaman katalog cetak: kisi bergaris, setiap produk bernomor supaya bisa dipesan dengan nomornya.'],
    { head: 'crimson-pro', body: 'work-sans', label: 'work-sans' },
    { paper: '#ffffff', surface: '#ffffff', ink: '#1a1a1a', muted: '#575757', line: '#1a1a1a', accent: '#1a1a1a', second: '#9c1f1f' },
    { vars: { r: '0', 'r-btn': '0', wrap: '1040px' }, css: `
.top-in{border-bottom:2px solid var(--line)}.title{font-size:clamp(2rem,7vw,3.4rem)}
.items-in.grid{counter-reset:no;grid-template-columns:repeat(auto-fill,minmax(min(50%,220px),1fr));gap:0;border-top:1px solid var(--line);border-left:1px solid var(--line)}
.card{counter-increment:no;padding:12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.card::before{content:"No. " counter(no);display:block;margin-bottom:8px;font-family:var(--f-label);font-size:.8rem;color:var(--second-text)}
.card-media img{object-fit:contain;background:var(--surface)}.card h3{font-size:1.3rem}
.price{color:var(--ink)}` }),

  /* ------------------------------------------------ libraries */
  d('kartu-katalog', 'library', 'Kartu Katalog',
    ['The library card catalogue: every book an index card, red line, blue lines, a hole at the bottom.', 'Kartu katalog perpustakaan: setiap buku satu kartu, garis merah, garis biru, berlubang di bawah.'],
    { head: 'courier-prime', body: 'courier-prime', label: 'courier-prime' },
    { paper: '#e3e1dc', surface: '#fffef9', ink: '#222222', muted: '#4d4d4d', line: '#a9c0dc', accent: '#2a3f6e', second: '#d14b4b' },
    { vars: { r: '0', 'r-btn': '0' }, css: `
.title{text-transform:uppercase;font-size:clamp(1.8rem,6vw,2.6rem)}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:18px}
.book{position:relative;display:grid;grid-template-columns:64px 1fr;gap:14px;padding:12px 16px 30px;line-height:24px;background:linear-gradient(var(--second),var(--second)) 0 38px/100% 2px no-repeat,repeating-linear-gradient(transparent 0 23px,var(--line) 23px 24px) 0 14px,var(--surface);box-shadow:0 2px 0 rgba(0,0,0,.14)}
.book::after{content:"";position:absolute;bottom:8px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--paper)}
.book-body{padding:0}.book h3{font-size:1.05rem;line-height:24px}.book p{margin:0 0 24px}
.blank{font-size:.7rem;border-radius:0}
.search input{border:2px solid var(--ink);border-radius:0}` }),

  d('rak-buku', 'library', 'Rak Buku',
    ['A bookshelf: covers standing three to a row on a phone, each row on its wooden shelf.', 'Rak buku: sampul berdiri tiga sebaris di HP, setiap baris di atas papan kayu.'],
    { head: 'alegreya', body: 'literata', label: 'alegreya' },
    { paper: '#e4ebf0', surface: '#ffffff', ink: '#1f2328', muted: '#50565e', line: '#b9c4cc', accent: '#2e4a7d', second: '#8a6a4a' },
    { vars: { r: '0', 'r-btn': '3px' }, css: `
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(31%,150px),1fr));gap:34px 0}
.book{padding:0 9px}.book-cover{margin:0 -9px;padding:0 9px;border-bottom:12px solid var(--second);display:flex;align-items:flex-end}
.book-cover img,.blank{box-shadow:3px 0 0 rgba(0,0,0,.18)}
.blank{font-size:.9rem;border-radius:0}
.book-body h3{font-size:1rem;margin-top:4px}.book-body p{font-size:.88rem;color:var(--muted)}
.open .btn{min-height:40px;padding:8px 14px;font-size:.9rem}` }),

  d('pojok-baca', 'library', 'Pojok Baca',
    ['A reading corner for children: a big round search box, books on bright cards.', 'Pojok baca anak: kotak cari besar dan bulat, buku di kartu berwarna cerah.'],
    { head: 'fredoka', body: 'nunito', label: 'fredoka' },
    { paper: '#eaf6ff', surface: '#ffffff', ink: '#1d2b45', muted: '#4a5878', line: '#bcd7f0', accent: '#ff7a00', second: '#2d8cf0' },
    { vars: { r: '16px', 'r-btn': '14px', size: '18px' }, css: `
.title{font-size:clamp(2.2rem,8vw,3.4rem);color:var(--accent-text)}
.search input{border-radius:999px;font-size:1.2rem;padding:12px 22px;border:3px solid var(--accent);width:100%}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(45%,190px),1fr));gap:16px}
.book{background:var(--surface);border:3px solid var(--line);border-radius:22px;padding:12px}
.book:nth-child(3n+2) .blank{background:var(--second);color:var(--on-second)}.book:nth-child(3n) .blank{background:var(--ink);color:var(--paper)}
.book h3{font-size:1.1rem}` }),

  d('arsip', 'library', 'Arsip',
    ['A teacher’s archive of modules and worksheets: one row per file, the Open button at the end of it.', 'Arsip modul dan lembar kerja guru: satu baris per file, tombol Buka di ujungnya.'],
    { head: 'ibm-plex-sans', body: 'ibm-plex-sans', label: 'ibm-plex-sans' },
    { paper: '#ffffff', surface: '#f3f5f7', ink: '#161b22', muted: '#4f5864', line: '#d8dde3', accent: '#1d4f91', second: '#1d4f91' },
    { vars: { r: '3px', 'r-btn': '3px', wrap: '880px' }, dark: { paper: '#11151b', surface: '#1a2029', ink: '#e6eaf0', muted: '#a0a9b6', line: '#2c3440', accent: '#79a8ff', second: '#79a8ff' }, css: `
.search{position:sticky;top:0;z-index:1;background:var(--paper);padding:10px 0}.search input{width:100%}
.items-in.grid{grid-template-columns:1fr;gap:0;border-top:2px solid var(--ink)}
.book{display:grid;grid-template-columns:44px 1fr;gap:14px;padding:12px 0;border-bottom:1px solid var(--line);align-items:start}
.blank{font-size:0;padding:0;aspect-ratio:3/4;background:linear-gradient(225deg,var(--paper) 10px,var(--surface) 10px);border:1px solid var(--line)}
.book-cover img{aspect-ratio:3/4}
.book-body{padding:0;display:grid;grid-template-columns:1fr auto;column-gap:16px}.book-body>*{grid-column:1}
.book h3{font-size:1.05rem;margin:0}.book-body p{margin:2px 0 0;color:var(--muted);font-size:.93rem}
.open{grid-column:2!important;grid-row:1/span 3;margin:0}
@media (max-width:560px){.book-body{grid-template-columns:1fr}.open{grid-column:1!important;grid-row:auto;margin-top:8px}}` }),
];
// hosting:end
