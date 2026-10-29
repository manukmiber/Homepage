// hosting:start
// Zeiko Sites' templates (the owner's, 2026-10-28: "template disiapkan —
// beranda, berita/update, dll. — dan pelanggan juga boleh unggah sendiri";
// 2026-10-29: "minimal 50 template … tidak seperti AI made … semua font dan
// warna bisa diganti").
//
// A package's site is one of seven kinds (TEMPLATES: what the editor asks
// for), drawn in one of fifty designs (designs.js: how it looks). The editor
// (views.js `siteEditor`) keeps what the person typed, their design and any
// font or colour of their own as one JSON document at the account door
// (`/v1/sites/{id}/content`); publishing turns it into plain files here, in
// the browser — index.html, style.css, the font files the page uses and, for
// the library, a small search script — which app.js uploads like any other
// file. Nothing is built anywhere else. TEMPLATES.md is the brief.
//
// Everything the person typed goes into their page escaped (`h`); a link is
// one of their own files, an http(s) address, an email or a phone number, or
// it is left out; a colour is #rrggbb and a font one of FONTS, or the
// design's own.

import { L } from './lang.js';
import { DESIGNS, FONTS } from './designs.js';

export { DESIGNS, FONTS };

/** Item fields: what one entry of a list holds. */
const FIELDS = ['title', 'text', 'image', 'link', 'price', 'date'];

/**
 * Each kind: what the editor asks for. `items` names the list and the
 * fields each entry has; `event` asks for a date and a place (invitations);
 * `order` puts a "via WhatsApp" button on each entry (catalogue).
 */
export const TEMPLATES = () => ({
  homepage: {
    name: L('Profile page', 'Halaman profil'),
    hint: L('A school, a person or a teacher: who you are, a few sections, and how to reach you.', 'Sekolah, diri sendiri, atau guru: siapa kamu, beberapa bagian, dan cara menghubungimu.'),
    cover: true,
    items: { label: L('Sections', 'Bagian'), one: L('Section', 'Bagian'), fields: ['title', 'text', 'image'] },
  },
  gallery: {
    name: L('Gallery', 'Galeri'),
    hint: L('Pictures and videos with a caption each: a portfolio or a yearbook.', 'Gambar dan video dengan keterangan: portofolio atau buku tahunan.'),
    cover: false,
    items: { label: L('Works', 'Karya'), one: L('Work', 'Karya'), fields: ['image', 'title', 'text', 'link'] },
  },
  links: {
    name: L('Links card', 'Kartu link'),
    hint: L('Your name, a line about you, and a button for every place people can find you.', 'Namamu, satu kalimat tentangmu, dan satu tombol untuk setiap tempat orang bisa menemukanmu.'),
    cover: false,
    items: { label: L('Links', 'Link'), one: L('Link', 'Link'), fields: ['title', 'link'] },
  },
  news: {
    name: L('News', 'Berita'),
    hint: L('Posts with a date, newest first: a class, a club, a blog or a project.', 'Tulisan bertanggal, terbaru di atas: kelas, ekskul, blog, atau proyek.'),
    cover: true,
    items: { label: L('Posts', 'Tulisan'), one: L('Post', 'Tulisan'), fields: ['date', 'title', 'text', 'image'] },
  },
  invite: {
    name: L('Invitation', 'Undangan'),
    hint: L('The event, when and where, the programme, and a button to reply on WhatsApp.', 'Acaranya, kapan dan di mana, susunan acara, dan tombol untuk konfirmasi lewat WhatsApp.'),
    cover: true,
    event: true,
    items: { label: L('Programme', 'Susunan acara'), one: L('Item', 'Acara'), fields: ['date', 'title', 'text'] },
  },
  catalog: {
    name: L('Catalogue', 'Katalog'),
    hint: L('Products with a picture and a price, each with a button to order on WhatsApp.', 'Produk dengan gambar dan harga, masing-masing dengan tombol pesan lewat WhatsApp.'),
    cover: false,
    order: true,
    items: { label: L('Products', 'Produk'), one: L('Product', 'Produk'), fields: ['image', 'title', 'text', 'price'] },
  },
  library: {
    name: L('Library', 'Perpustakaan'),
    hint: L('Books and documents to read or download, with a search box.', 'Buku dan dokumen untuk dibaca atau diunduh, dengan kotak pencarian.'),
    cover: false,
    search: true,
    items: { label: L('Books and documents', 'Buku dan dokumen'), one: L('Book', 'Buku'), fields: ['image', 'title', 'text', 'link'] },
  },
});

export const FIELD_LABEL = () => ({
  title: L('Title', 'Judul'),
  text: L('Text', 'Teks'),
  image: L('Picture or video', 'Gambar atau video'),
  link: L('Link or file', 'Link atau file'),
  price: L('Price', 'Harga'),
  date: L('Date or time', 'Tanggal atau jam'),
});

/** The colours a design is made of, every one of which the person may change. */
export const COLOR_KEYS = ['paper', 'surface', 'ink', 'muted', 'line', 'accent', 'second'];

export const COLOR_LABEL = () => ({
  paper: L('Background', 'Latar'),
  surface: L('Boxes and cards', 'Kotak dan kartu'),
  ink: L('Text', 'Teks'),
  muted: L('Small text', 'Teks kecil'),
  line: L('Lines and borders', 'Garis dan bingkai'),
  accent: L('Main colour (buttons)', 'Warna utama (tombol)'),
  second: L('Second colour', 'Warna kedua'),
});

/** The fonts a design uses, every one of which the person may change. */
export const FONT_ROLES = () => ({
  head: L('Headings', 'Judul'),
  body: L('Text', 'Teks'),
  label: L('Dates, prices and buttons', 'Tanggal, harga, dan tombol'),
});

export const FONT_GROUPS = () => ({
  serif: 'Serif',
  sans: 'Sans serif',
  display: L('Bold, for headings', 'Tegas, untuk judul'),
  hand: L('Handwriting', 'Tulisan tangan'),
  mono: L('Typewriter and pixel', 'Mesin tik dan piksel'),
  system: L("The phone's own", 'Bawaan HP'),
});

/** A font list's first choice: the design's own font for that role. */
export const designFont = (design, role) => `${L("The design's", 'Font desain')}: ${FONTS[design.fonts[role] || design.fonts.body].name}`;

/** The designs of one kind; the first is the one a new site starts on. */
export const designsOf = (kind) => DESIGNS.filter((d) => d.kind === kind);

/** A design of that kind by id, or the kind's first. */
export function designFor(kind, id) {
  const all = designsOf(kind);
  return all.find((d) => d.id === id) || all[0] || DESIGNS[0];
}

/** A new site's document: its name and nothing else. */
export function blankContent(template, title = '') {
  return { v: 1, template, design: designFor(template).id, title, tagline: '', about: '', logo: '', cover: '', fonts: {}, colors: {}, contact: {}, event: {}, items: [] };
}

const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');
const HEX = /^#[0-9a-f]{6}$/i;
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

/** The document as it is kept: known fields only, every value a short string. */
export function cleanContent(c, template) {
  const x = obj(c);
  const contact = obj(x.contact);
  const event = obj(x.event);
  const fonts = obj(x.fonts);
  const colors = obj(x.colors);
  // The first editor kept one colour, `accent`, always set to its default.
  const legacy = HEX.test(x.accent || '') && x.accent.toLowerCase() !== '#1f4e9d' ? x.accent.toLowerCase() : '';
  const items = (Array.isArray(x.items) ? x.items : [])
    .map((it) => Object.fromEntries(FIELDS.map((k) => [k, str(it && it[k], k === 'text' ? 4000 : 400)])))
    .filter((it) => FIELDS.some((k) => it[k].trim()))
    .slice(0, 200);
  return {
    v: 1,
    template,
    design: designFor(template, str(x.design, 60)).id,
    title: str(x.title, 120),
    tagline: str(x.tagline, 240),
    about: str(x.about, 6000),
    logo: str(x.logo, 300),
    cover: str(x.cover, 300),
    fonts: Object.fromEntries(['head', 'body', 'label'].map((k) => [k, Object.hasOwn(FONTS, fonts[k] || '') && (k !== 'body' || FONTS[fonts[k]].text) ? fonts[k] : ''])),
    colors: Object.fromEntries(COLOR_KEYS.map((k) => [k, HEX.test(colors[k] || '') ? colors[k].toLowerCase() : k === 'accent' ? legacy : ''])),
    contact: Object.fromEntries(['whatsapp', 'phone', 'email', 'address', 'maps', 'instagram', 'tiktok', 'youtube', 'facebook'].map((k) => [k, str(contact[k], 300)])),
    event: Object.fromEntries(['date', 'time', 'place', 'maps'].map((k) => [k, str(event[k], 300)])),
    items,
  };
}

/* ------------------------------------------------------------ building */

const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** Paragraphs from what was typed: a blank line starts a new one. */
const paras = (s) => String(s || '').trim().split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${h(p).replace(/\n/g, '<br>')}</p>`).join('');

/** One of the site's own files (`img/a.jpg`), never a path out of it. */
function ownFile(p) {
  const v = String(p || '').trim().replace(/^\/+/, '');
  return /^[A-Za-z0-9][A-Za-z0-9._ ()-]*(\/[A-Za-z0-9][A-Za-z0-9._ ()-]*)*$/.test(v) && !v.split('/').includes('..') ? v.split('/').map(encodeURIComponent).join('/') : '';
}

/** A link the page may carry: a file of the site, http(s), mailto or tel. */
export function safeLink(u) {
  const v = String(u || '').trim();
  if (!v) return '';
  if (/^https?:\/\/[^\s<>"']+$/i.test(v)) return v;
  if (/^mailto:[^\s<>"']+@[^\s<>"']+$/i.test(v)) return v;
  if (/^tel:\+?[0-9 -]{5,20}$/i.test(v)) return v.replace(/ /g, '');
  return ownFile(v);
}

/** A WhatsApp number as wa.me wants it: 0812… and +62 812… become 62812…. */
export function waNumber(s) {
  let d = String(s || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = `62${d.slice(1)}`;
  return d.length >= 9 && d.length <= 15 ? d : '';
}

const wa = (n, text) => (n ? `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '');
const web = (u) => /^https?:/i.test(u || '');

function contactBlock(c, lang) {
  const t = (en, id) => (lang === 'id' ? id : en);
  const rows = [];
  const n = waNumber(c.whatsapp);
  if (n) rows.push(`<a class="btn" href="${h(wa(n))}">WhatsApp</a>`);
  if (c.phone && /^[+0-9 -]{5,20}$/.test(c.phone)) rows.push(`<a class="btn" href="tel:${h(c.phone.replace(/ /g, ''))}">${t('Call', 'Telepon')} ${h(c.phone)}</a>`);
  if (c.email && /^[^\s@<>"']+@[^\s@<>"']+$/.test(c.email)) rows.push(`<a class="btn" href="mailto:${h(c.email)}">${h(c.email)}</a>`);
  for (const [k, name] of [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['facebook', 'Facebook']]) {
    const link = safeLink(c[k]);
    if (web(link)) rows.push(`<a class="btn" href="${h(link)}">${name}</a>`);
  }
  const maps = safeLink(c.maps);
  const address = c.address ? `<p class="address">${h(c.address)}</p>` : '';
  const map = web(maps) ? `<p class="map"><a href="${h(maps)}">${t('See it on a map', 'Lihat di peta')}</a></p>` : '';
  if (!rows.length && !address && !map) return '';
  return `<section class="contact" id="contact"><h2>${t('Contact', 'Kontak')}</h2>${address}${map}${rows.length ? `<p class="buttons">${rows.join(' ')}</p>` : ''}</section>`;
}

const VIDEO = /\.(mp4|webm|mov|m4v)$/i;

/** A picture or a video of the site's own, or an https picture; else nothing. */
function media(path, alt, cls = '') {
  const own = ownFile(path);
  const c = cls ? ` class="${cls}"` : '';
  if (own && VIDEO.test(own)) return `<video${c} src="${h(own)}" controls preload="metadata" playsinline></video>`;
  const src = own || (/^https:\/\/[^\s<>"']+$/i.test(path || '') ? path : '');
  return src ? `<img${c} src="${h(src)}" alt="${h(alt)}" loading="lazy">` : '';
}

function itemsBlock(tpl, id, c, lang) {
  const t = (en, idn) => (lang === 'id' ? idn : en);
  if (!c.items.length) return '';
  const n = waNumber(c.contact.whatsapp);
  const cards = c.items.map((it) => {
    const link = safeLink(it.link);
    const img = media(it.image, it.title);
    const title = it.title ? `<h3>${h(it.title)}</h3>` : '';
    switch (id) {
      case 'links':
        return link ? `<a class="link-btn" href="${h(link)}"><span>${h(it.title || link)}</span></a>` : '';
      case 'gallery': {
        const shown = img && link && !img.startsWith('<video') ? `<a href="${h(link)}">${img}</a>` : img;
        return `<figure class="work">${shown ? `<div class="work-media">${shown}</div>` : ''}${!img && link ? `<p class="work-link"><a href="${h(link)}">${h(it.title || link)}</a></p>` : ''}<figcaption>${it.title ? `<strong>${h(it.title)}</strong>` : ''}${paras(it.text)}</figcaption></figure>`;
      }
      case 'catalog':
        return `<article class="card${img ? '' : ' no-img'}">${img ? `<div class="card-media">${img}</div>` : ''}<div class="card-body">${title}${it.price ? `<p class="price">${h(it.price)}</p>` : ''}${paras(it.text)}${n ? `<p class="order"><a class="btn" href="${h(wa(n, `${t('Hello, I would like to order', 'Halo, saya mau pesan')} ${it.title}`))}">${t('Order on WhatsApp', 'Pesan lewat WhatsApp')}</a></p>` : ''}</div></article>`;
      case 'library':
        return `<article class="book" data-q="${h(`${it.title} ${it.text}`.toLowerCase())}"><div class="book-cover">${img || `<span class="blank" aria-hidden="true">${h(it.title)}</span>`}</div><div class="book-body">${title}${paras(it.text)}${link ? `<p class="open"><a class="btn" href="${h(link)}">${t('Open', 'Buka')}</a></p>` : ''}</div></article>`;
      case 'news':
      case 'invite':
        return `<article class="post${img ? ' has-img' : ''}">${it.date ? `<p class="date">${h(it.date)}</p>` : ''}<div class="post-body">${title}${img}${paras(it.text)}</div></article>`;
      default:
        return `<section class="part${img ? ' has-img' : ''}">${img ? `<div class="part-media">${img}</div>` : ''}<div class="part-body">${it.title ? `<h2>${h(it.title)}</h2>` : ''}${paras(it.text)}</div></section>`;
    }
  }).join('\n');
  const grid = id === 'catalog' || id === 'library' || id === 'gallery' ? 'grid' : 'list';
  // Shown by site.js: without JavaScript a search box would do nothing.
  const search = id === 'library' ? `<p class="search" hidden><label>${t('Search', 'Cari')} <input type="search" id="q" autocomplete="off"></label></p>` : '';
  const heading = id === 'homepage' || id === 'links' ? '' : `<h2 class="items-h">${h(tpl.items.label)}</h2>`;
  return `<section class="items" id="items">${heading}${search}<div class="items-in ${grid}">${cards}</div></section>`;
}

function eventBlock(c, lang) {
  const e = c.event;
  if (!e.date && !e.place && !e.time) return '';
  const t = (en, id) => (lang === 'id' ? id : en);
  const maps = safeLink(e.maps);
  const n = waNumber(c.contact.whatsapp);
  return `<section class="event"><dl class="event-facts">
    ${e.date ? `<div><dt>${t('Date', 'Tanggal')}</dt><dd>${h(e.date)}</dd></div>` : ''}
    ${e.time ? `<div><dt>${t('Time', 'Waktu')}</dt><dd>${h(e.time)}</dd></div>` : ''}
    ${e.place ? `<div><dt>${t('Place', 'Tempat')}</dt><dd>${h(e.place)}${web(maps) ? ` <a class="map-link" href="${h(maps)}">${t('See it on a map', 'Lihat di peta')}</a>` : ''}</dd></div>` : ''}
  </dl>${n ? `<p class="rsvp"><a class="btn" href="${h(wa(n, `${t('I will come to', 'Saya akan hadir di')} ${c.title}`))}">${t('Reply on WhatsApp', 'Konfirmasi lewat WhatsApp')}</a></p>` : ''}</section>`;
}

/* ------------------------------------------------------------ the look */
// Every design is written in the same names (TEMPLATES.md, "The look"):
// seven colours (COLOR_KEYS) and what is worked out from them so words stay
// readable (`scheme`), three fonts (--f-head, --f-body, --f-label) and a few
// shapes. BASE_CSS draws every kind plainly in those names; the design's own
// CSS comes after it. The person's colours and fonts replace the design's
// before anything is worked out, so they reach every rule.

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
function luminance(c) {
  const [r, g, b] = rgb(c).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG contrast of two colours, 1 to 21. */
export const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** `c` moved toward `to` until it reads at 4.5:1 on every one of `on`. */
function readable(c, on, to) {
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const m = mix(c, to, t);
    if (on.every((bg) => contrast(m, bg) >= 4.5)) return m;
  }
  return to;
}
const onColor = (c) => (contrast(c, '#ffffff') >= contrast(c, '#111111') ? '#ffffff' : '#111111');

/**
 * One scheme's colours with what is worked out from them: text and small
 * text that read on the background and on boxes, the text on each colour's
 * fills (`on-accent`), each colour as words on the page (`accent-text`), and
 * a tint of each for areas (`accent-soft`).
 */
export function scheme(s) {
  const dark = luminance(s.paper) < 0.18;
  const to = dark ? '#ffffff' : '#000000';
  const on = [s.paper, s.surface];
  const ink = readable(s.ink, on, to);
  return {
    ...s,
    ink,
    muted: readable(s.muted, on, to),
    'on-accent': onColor(s.accent),
    'accent-text': readable(s.accent, on, dark ? '#ffffff' : ink),
    'accent-soft': mix(s.paper, s.accent, dark ? 0.24 : 0.13),
    'on-second': onColor(s.second),
    'second-text': readable(s.second, on, dark ? '#ffffff' : ink),
    'second-soft': mix(s.paper, s.second, dark ? 0.24 : 0.16),
    scheme: dark ? 'dark' : 'light',
  };
}

const FALLBACK = {
  serif: 'Georgia,"Noto Serif","Times New Roman",serif',
  sans: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
  mono: '"Courier New",monospace',
  cursive: 'cursive',
};
const stack = (f) => f.stack || `"${f.name}",${FALLBACK[f.fallback] || FALLBACK.sans}`;

/**
 * What a document looks like: its design, the three fonts and the colours
 * of each scheme. A night scheme is the design's own, and only while the
 * colours are the design's: colours someone picked are kept day and night.
 */
export function lookOf(template, c) {
  const design = designFor(template, c.design);
  const own = COLOR_KEYS.filter((k) => c.colors[k]);
  const fonts = {
    head: c.fonts.head || design.fonts.head,
    body: c.fonts.body || design.fonts.body,
    label: c.fonts.label || design.fonts.label || c.fonts.body || design.fonts.body,
  };
  return {
    design,
    fonts,
    light: scheme({ ...design.colors, ...Object.fromEntries(own.map((k) => [k, c.colors[k]])) }),
    dark: !own.length && design.dark ? scheme({ ...design.colors, ...design.dark }) : null,
  };
}

const BASE_VARS = { wrap: '960px', r: '8px', 'r-btn': '6px', size: '17px' };

const BASE_CSS = `*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;color-scheme:var(--scheme)}
body{margin:0;background:var(--paper);color:var(--ink);font:var(--size)/1.6 var(--f-body);overflow-wrap:break-word}
[hidden]{display:none!important}img,video{max-width:100%;height:auto;display:block}
a{color:var(--accent-text);text-underline-offset:.16em}
a:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--accent-text);outline-offset:3px}
h1,h2,h3{font-family:var(--f-head);font-weight:var(--w-head);line-height:1.15;margin:0}
p{margin:0 0 .85em}
.wrap{width:100%;max-width:var(--wrap);margin-left:auto;margin-right:auto;padding-left:18px;padding-right:18px}
.top{display:flex;flex-direction:column}
.top-in{display:flex;gap:16px;align-items:center;padding-top:34px;padding-bottom:22px}
.logo{width:72px;height:72px;object-fit:cover;flex:none;border-radius:var(--r)}
.title{font-size:clamp(2rem,6.5vw,3.2rem)}
.tagline{margin:.35em 0 0;color:var(--muted);font-size:1.05rem}
.cover-wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 18px}
.cover{width:100%;max-height:480px;object-fit:cover;border-radius:var(--r)}
.main{padding-top:26px;padding-bottom:52px}
.about{max-width:66ch;font-size:1.06rem}
h2{font-size:clamp(1.45rem,3.6vw,2rem);margin:1.6em 0 .55em}
h3{font-size:1.22rem;margin:.15em 0 .35em}
.date,.price,.event dt,.btn,.search label,.map-link{font-family:var(--f-label)}
.date{margin:0 0 .25em;color:var(--muted);font-size:.93rem}
.items-in{display:grid;gap:24px}
.items-in.grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))}
.part{display:grid;gap:16px}.part h2{margin:.1em 0 .5em}
.part-media img,.post img,.work-media img,.work-media video,.card-media img,.book-cover img{width:100%;border-radius:var(--r)}
@media (min-width:760px){.part.has-img{grid-template-columns:5fr 6fr;align-items:start;gap:32px}}
.post img{margin:.5em 0 .9em}
.work{margin:0}.work figcaption{padding-top:10px}.work figcaption strong{display:block}
.work figcaption p{margin:.2em 0 0;color:var(--muted);font-size:.95rem}
.card-media img{aspect-ratio:1;object-fit:cover}.card-body,.book-body{padding-top:10px}
.price{margin:.1em 0 .5em;font-weight:700;color:var(--accent-text)}
.book-cover img,.blank{width:100%;aspect-ratio:2/3;object-fit:cover}
.blank{display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;background:var(--accent);color:var(--on-accent);font-family:var(--f-head);font-weight:var(--w-head);line-height:1.2;border-radius:var(--r);overflow:hidden}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 18px;background:var(--accent);color:var(--on-accent);border:0;border-radius:var(--r-btn);text-decoration:none;font-weight:600;line-height:1.2;text-align:center}
.order,.open,.rsvp{margin:.6em 0 0}
.k-links .top-in{flex-direction:column;text-align:center}
.k-links .items-in{max-width:540px;margin:0 auto;gap:12px}
.link-btn{display:flex;align-items:center;justify-content:center;gap:10px;min-height:56px;padding:12px 18px;border:2px solid var(--accent);border-radius:var(--r);color:var(--accent-text);font-weight:700;text-align:center;text-decoration:none}
.event{margin:28px 0}.event-facts{display:grid;gap:16px;margin:0}
.event dt{color:var(--muted);font-size:.9rem}.event dd{margin:0;font-size:1.18rem;font-weight:700}
.map-link{display:block;font-size:.95rem;font-weight:400;margin-top:4px}
.search{margin:0 0 18px}.search label{display:block;font-weight:600}
.search input{display:block;width:min(100%,420px);min-height:46px;margin-top:6px;padding:8px 12px;font:inherit;color:var(--ink);background:var(--surface);border:2px solid var(--line);border-radius:var(--r)}
.contact{margin-top:56px;padding-top:6px;border-top:1px solid var(--line)}.contact h2{margin-top:.8em}
.address{color:var(--muted)}.buttons{display:flex;flex-wrap:wrap;gap:8px}
.bottom{padding:26px 0 34px;color:var(--muted);font-size:.9rem}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

/** The font files a look needs, by file name, each with the weights it has. */
function fontFiles(fonts) {
  const ids = [...new Set(Object.values(fonts))];
  return ids.flatMap((id) => (FONTS[id].files || []).map(([file, weight]) => ({ id, file, weight })));
}

/** The template's style.css, and the font files it names. */
export function styleSheet(template, c) {
  const { design, fonts, light, dark } = lookOf(template, c);
  const vars = (o) => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(';');
  const files = fontFiles(fonts);
  const faces = files.map((f) => `@font-face{font-family:"${FONTS[f.id].name}";src:url(fonts/${f.file}) format("woff2");font-weight:${f.weight};font-display:swap}`).join('\n');
  const weight = fonts.head === design.fonts.head && design.w ? design.w : FONTS[fonts.head].w;
  const shared = { ...BASE_VARS, ...design.vars, 'f-head': stack(FONTS[fonts.head]), 'f-body': stack(FONTS[fonts.body]), 'f-label': stack(FONTS[fonts.label]), 'w-head': weight };
  const css = `${faces ? `${faces}\n` : ''}:root{${vars(shared)};${vars(light)}}
${dark ? `@media (prefers-color-scheme:dark){:root{${vars(dark)}}}\n` : ''}${BASE_CSS}${design.css ? `${design.css.trim()}\n` : ''}`;
  return { css, files, paper: light.paper };
}

const SEARCH_JS = `(function(){var q=document.getElementById('q');if(!q)return;q.parentNode.parentNode.hidden=false;q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();document.querySelectorAll('.book').forEach(function(b){b.hidden=v&&b.getAttribute('data-q').indexOf(v)<0;});});})();\n`;

/**
 * The files a template makes from a document: `[{ path, type, text }]`, and
 * for each font the page uses `{ path, type, from }`: a file of this site
 * (`/fonts/sites/…`) that app.js copies into the website beside the page.
 * `lang` is the language of the words the template adds itself (buttons,
 * headings), `id` or `en`.
 */
export function buildSite(template, raw, lang = 'id') {
  const all = TEMPLATES();
  const id = all[template] ? template : 'homepage';
  const tpl = all[id];
  const c = cleanContent(raw, id);
  const look = styleSheet(id, c);
  const name = c.title || tpl.name;
  const logo = media(c.logo, '', 'logo');
  const cover = tpl.cover ? media(c.cover, '', 'cover') : '';
  const year = new Date().getFullYear();
  const html = `<!doctype html>
<html lang="${lang === 'id' ? 'id' : 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(name)}</title>
<meta name="description" content="${h(c.tagline || c.title)}">
<meta property="og:title" content="${h(name)}">
${c.tagline ? `<meta property="og:description" content="${h(c.tagline)}">\n` : ''}<meta name="theme-color" content="${look.paper}">
<link rel="stylesheet" href="style.css">
</head>
<body class="k-${id} d-${c.design}">
<header class="top">
<div class="wrap top-in">${logo}<div class="names"><h1 class="title">${h(name)}</h1>${c.tagline ? `<p class="tagline">${h(c.tagline)}</p>` : ''}</div></div>
${cover ? `<figure class="cover-wrap">${cover}</figure>` : ''}
</header>
<main class="wrap main" id="isi">
${c.about ? `<section class="about">${paras(c.about)}</section>` : ''}
${tpl.event ? eventBlock(c, lang) : ''}
${itemsBlock(tpl, id, c, lang)}
${contactBlock(c.contact, lang)}
</main>
<footer class="bottom"><div class="wrap">© ${year} ${h(name)}</div></footer>
${tpl.search ? '<script src="site.js"></script>\n' : ''}</body>
</html>
`;
  const files = [
    { path: 'index.html', type: 'text/html; charset=utf-8', text: html },
    { path: 'style.css', type: 'text/css; charset=utf-8', text: look.css },
    ...look.files.map((f) => ({ path: `fonts/${f.file}`, type: 'font/woff2', from: `/fonts/sites/${f.file}` })),
  ];
  if (tpl.search) files.push({ path: 'site.js', type: 'text/javascript; charset=utf-8', text: SEARCH_JS });
  return files;
}
// hosting:end
