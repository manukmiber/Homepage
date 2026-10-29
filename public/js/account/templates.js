// hosting:start
// Zeiko Sites' templates (the owner's, 2026-10-28: "template disiapkan —
// beranda, berita/update, dll. — dan pelanggan juga boleh unggah sendiri").
//
// A package's site starts from one of these. The editor (views.js
// `siteEditor`) keeps what the person typed as one JSON document at the
// account door (`/v1/sites/{id}/content`); publishing turns it into plain
// files here, in the browser — index.html, style.css and, for the library, a
// small search script — which app.js uploads like any other file. Nothing is
// built anywhere else.
//
// Everything the person typed goes into their page escaped (`h`); a link is
// one of their own files, an http(s) address, an email or a phone number, or
// it is left out.

import { L } from './lang.js';

/** Item fields: what one entry of a list holds. */
const FIELDS = ['title', 'text', 'image', 'link', 'price', 'date'];

/**
 * Each template: what the editor asks for. `items` names the list and the
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
  image: L('Picture', 'Gambar'),
  link: L('Link or file', 'Link atau file'),
  price: L('Price', 'Harga'),
  date: L('Date or time', 'Tanggal atau jam'),
});

/** A new site's document: its name and nothing else. */
export function blankContent(template, title = '') {
  return { v: 1, template, title, tagline: '', about: '', accent: '#1f4e9d', logo: '', cover: '', contact: {}, event: {}, items: [] };
}

const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');

/** The document as it is kept: known fields only, every value a short string. */
export function cleanContent(c, template) {
  const x = c && typeof c === 'object' ? c : {};
  const contact = x.contact && typeof x.contact === 'object' ? x.contact : {};
  const event = x.event && typeof x.event === 'object' ? x.event : {};
  const items = (Array.isArray(x.items) ? x.items : [])
    .map((it) => Object.fromEntries(FIELDS.map((k) => [k, str(it && it[k], k === 'text' ? 4000 : 400)])))
    .filter((it) => FIELDS.some((k) => it[k].trim()))
    .slice(0, 200);
  return {
    v: 1,
    template,
    title: str(x.title, 120),
    tagline: str(x.tagline, 240),
    about: str(x.about, 6000),
    accent: /^#[0-9a-fA-F]{6}$/.test(x.accent || '') ? x.accent : '#1f4e9d',
    logo: str(x.logo, 300),
    cover: str(x.cover, 300),
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

function contactBlock(c, lang) {
  const t = (en, id) => (lang === 'id' ? id : en);
  const rows = [];
  const n = waNumber(c.whatsapp);
  if (n) rows.push(`<a class="btn" href="${h(wa(n))}">WhatsApp</a>`);
  if (c.phone && /^[+0-9 -]{5,20}$/.test(c.phone)) rows.push(`<a class="btn" href="tel:${h(c.phone.replace(/ /g, ''))}">${t('Call', 'Telepon')} ${h(c.phone)}</a>`);
  if (c.email && /^[^\s@<>"']+@[^\s@<>"']+$/.test(c.email)) rows.push(`<a class="btn" href="mailto:${h(c.email)}">${h(c.email)}</a>`);
  for (const [k, name] of [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['facebook', 'Facebook']]) {
    const link = safeLink(c[k]);
    if (link && /^https?:/i.test(link)) rows.push(`<a class="btn" href="${h(link)}">${name}</a>`);
  }
  const maps = safeLink(c.maps);
  const address = c.address ? `<p class="address">${h(c.address)}${maps && /^https?:/i.test(maps) ? ` · <a href="${h(maps)}">${t('Map', 'Peta')}</a>` : ''}</p>` : '';
  if (!rows.length && !address) return '';
  return `<section class="contact" id="contact"><h2>${t('Contact', 'Kontak')}</h2>${address}<p class="buttons">${rows.join(' ')}</p></section>`;
}

function picture(path, alt, cls = '') {
  const src = ownFile(path) || (/^https:\/\/[^\s<>"']+$/i.test(path || '') ? path : '');
  return src ? `<img${cls ? ` class="${cls}"` : ''} src="${h(src)}" alt="${h(alt)}" loading="lazy">` : '';
}

function itemsBlock(tpl, id, c, lang) {
  const t = (en, idn) => (lang === 'id' ? idn : en);
  const items = id === 'news' ? [...c.items] : c.items;
  if (!items.length) return '';
  const n = waNumber(c.contact.whatsapp);
  const cards = items.map((it) => {
    const link = safeLink(it.link);
    const img = picture(it.image, it.title);
    switch (id) {
      case 'links':
        return link ? `<a class="link-btn" href="${h(link)}">${h(it.title || link)}</a>` : '';
      case 'gallery':
        return `<figure class="work">${link && !img ? `<a href="${h(link)}">${h(it.title || link)}</a>` : link ? `<a href="${h(link)}">${img}</a>` : img}<figcaption>${it.title ? `<strong>${h(it.title)}</strong>` : ''}${paras(it.text)}</figcaption></figure>`;
      case 'catalog':
        return `<article class="card">${img}<h3>${h(it.title)}</h3>${it.price ? `<p class="price">${h(it.price)}</p>` : ''}${paras(it.text)}${n ? `<p><a class="btn" href="${h(wa(n, `${t('Hello, I would like to order', 'Halo, saya mau pesan')} ${it.title}`))}">${t('Order on WhatsApp', 'Pesan lewat WhatsApp')}</a></p>` : ''}</article>`;
      case 'library':
        return `<article class="card book" data-q="${h(`${it.title} ${it.text}`.toLowerCase())}">${img}<h3>${h(it.title)}</h3>${paras(it.text)}${link ? `<p><a class="btn" href="${h(link)}">${t('Open', 'Buka')}</a></p>` : ''}</article>`;
      case 'news':
      case 'invite':
        return `<article class="post">${it.date ? `<p class="date">${h(it.date)}</p>` : ''}${it.title ? `<h3>${h(it.title)}</h3>` : ''}${img}${paras(it.text)}</article>`;
      default:
        return `<section class="part">${it.title ? `<h2>${h(it.title)}</h2>` : ''}${img}${paras(it.text)}</section>`;
    }
  }).join('\n');
  const grid = id === 'catalog' || id === 'library' || id === 'gallery' ? 'grid' : 'list';
  const search = id === 'library' ? `<p class="search"><label>${t('Search', 'Cari')} <input type="search" id="q" autocomplete="off"></label></p>` : '';
  return `<section class="items" id="items">${id === 'homepage' ? '' : `<h2>${h(tpl.items.label)}</h2>`}${search}<div class="${grid}">${cards}</div></section>`;
}

function eventBlock(c, lang) {
  const e = c.event;
  if (!e.date && !e.place) return '';
  const t = (en, id) => (lang === 'id' ? id : en);
  const maps = safeLink(e.maps);
  const n = waNumber(c.contact.whatsapp);
  return `<section class="event"><dl>
    ${e.date ? `<div><dt>${t('Date', 'Tanggal')}</dt><dd>${h(e.date)}</dd></div>` : ''}
    ${e.time ? `<div><dt>${t('Time', 'Waktu')}</dt><dd>${h(e.time)}</dd></div>` : ''}
    ${e.place ? `<div><dt>${t('Place', 'Tempat')}</dt><dd>${h(e.place)}${maps && /^https?:/i.test(maps) ? ` · <a href="${h(maps)}">${t('Map', 'Peta')}</a>` : ''}</dd></div>` : ''}
  </dl>${n ? `<p><a class="btn" href="${h(wa(n, `${t('I will come to', 'Saya akan hadir di')} ${c.title}`))}">${t('Reply on WhatsApp', 'Konfirmasi lewat WhatsApp')}</a></p>` : ''}</section>`;
}

const CSS = (accent) => `:root{--a:${accent};--ink:#1b1f24;--muted:#5b6470;--line:#e3e6ea;--bg:#ffffff;--soft:#f5f7f9}
@media (prefers-color-scheme:dark){:root{--ink:#e9ecef;--muted:#a5adb7;--line:#2c333b;--bg:#121619;--soft:#1b2026}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--a)}img{max-width:100%;height:auto;display:block;border-radius:10px}
.wrap{max-width:960px;margin:0 auto;padding:0 18px}
header.top{padding:28px 0 18px;border-bottom:1px solid var(--line)}
header.top .brand{display:flex;gap:14px;align-items:center}
header.top .logo{width:64px;height:64px;object-fit:cover;border-radius:14px}
h1{margin:0;font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.2}
.tagline{margin:4px 0 0;color:var(--muted)}
.cover{width:100%;max-height:420px;object-fit:cover;margin:18px 0 0}
main{padding:22px 0 40px}
h2{font-size:1.35rem;margin:34px 0 10px}h3{margin:10px 0 4px;font-size:1.1rem}
.about p,.part p,.post p{margin:0 0 12px}
.part img,.post img{margin:10px 0}
.list .post{padding:16px 0;border-bottom:1px solid var(--line)}
.date{margin:0;color:var(--muted);font-size:.95rem}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.card,.work{margin:0;padding:12px;background:var(--soft);border-radius:14px}
.card p{margin:6px 0}.work figcaption{padding-top:8px}.work figcaption p{margin:4px 0 0;color:var(--muted)}
.price{font-weight:700;color:var(--a)}
.btn{display:inline-block;padding:9px 16px;margin:4px 6px 4px 0;border-radius:999px;background:var(--a);color:#fff;text-decoration:none;font-weight:600}
.link-btn{display:block;margin:10px auto;max-width:520px;padding:14px 18px;border-radius:14px;border:2px solid var(--a);color:var(--a);text-align:center;font-weight:700;text-decoration:none}
body.links header.top{text-align:center;border:0}body.links header.top .brand{flex-direction:column}
.event dl{display:grid;gap:10px;margin:18px 0;padding:16px;background:var(--soft);border-radius:14px}
.event dt{color:var(--muted);font-size:.9rem}.event dd{margin:0;font-weight:700}
.search input{padding:8px 10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:var(--bg);color:var(--ink);width:min(100%,360px)}
.contact{margin-top:34px;padding-top:6px;border-top:1px solid var(--line)}.address{color:var(--muted)}
footer.bottom{padding:22px 0;color:var(--muted);font-size:.9rem;border-top:1px solid var(--line)}
`;

const SEARCH_JS = `(function(){var q=document.getElementById('q');if(!q)return;q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();document.querySelectorAll('.book').forEach(function(b){b.hidden=v&&b.getAttribute('data-q').indexOf(v)<0;});});})();\n`;

/**
 * The files a template makes from a document: `[{ path, type, text }]`.
 * `lang` is the language of the words the template adds itself (buttons,
 * headings), `id` or `en`.
 */
export function buildSite(template, raw, lang = 'id') {
  const all = TEMPLATES();
  const id = all[template] ? template : 'homepage';
  const tpl = all[id];
  const c = cleanContent(raw, id);
  const t = (en, idn) => (lang === 'id' ? idn : en);
  const logo = picture(c.logo, '', 'logo');
  const cover = tpl.cover ? picture(c.cover, '', 'cover') : '';
  const year = new Date().getFullYear();
  const html = `<!doctype html>
<html lang="${lang === 'id' ? 'id' : 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(c.title || tpl.name)}</title>
<meta name="description" content="${h(c.tagline || c.title)}">
<link rel="stylesheet" href="style.css">
</head>
<body class="${id}">
<header class="top"><div class="wrap">
<div class="brand">${logo}<div><h1>${h(c.title || tpl.name)}</h1>${c.tagline ? `<p class="tagline">${h(c.tagline)}</p>` : ''}</div></div>
${cover}
</div></header>
<main class="wrap">
${c.about ? `<section class="about">${paras(c.about)}</section>` : ''}
${tpl.event ? eventBlock(c, lang) : ''}
${itemsBlock(tpl, id, c, lang)}
${contactBlock(c.contact, lang)}
</main>
<footer class="bottom"><div class="wrap">© ${year} ${h(c.title)}</div></footer>
${tpl.search ? '<script src="site.js"></script>' : ''}
</body>
</html>
`;
  const files = [
    { path: 'index.html', type: 'text/html; charset=utf-8', text: html },
    { path: 'style.css', type: 'text/css; charset=utf-8', text: CSS(c.accent) },
  ];
  if (tpl.search) files.push({ path: 'site.js', type: 'text/javascript; charset=utf-8', text: SEARCH_JS });
  return files;
}
// hosting:end
