// hosting:start
// The template editor's live preview (views.js `siteEditor`, the owner's of
// 2026-10-29: "ada 2 viewport, Desktop dan mobile"): the page the form would
// publish, drawn in the editor as a phone and as a laptop show it, again on
// every change.
//
// The account page allows no frame and no inline style, so the page is drawn
// into a shadow root instead, with its style.css as a constructed sheet. Its
// `@media (min-width…)` rules become container queries on the screen it is
// drawn in, and `vh` the height of that screen, so each screen lays the page
// out at its own width whatever the editor's window is. Pictures come from
// the website itself (`base`), the fonts from this site's /fonts/sites/.

import { buildSite, COLOR_KEYS, designFont, designFor, cleanContent } from './templates.js';

const FIELDS = ['title', 'text', 'image', 'link', 'price', 'date'];
const HEX = /^#[0-9a-f]{6}$/i;

/** The editor's form (its fields as an object) as the document it keeps. A
 * colour counts as the person's own only when it differs from the design the
 * form was showing (`shownDesign`). */
export function contentFromForm(f, template) {
  const items = [];
  for (let i = 0; i < 300; i += 1) {
    if (!Object.keys(f).some((k) => k.startsWith(`item-${i}-`))) break;
    items.push(Object.fromEntries(FIELDS.map((k) => [k, f[`item-${i}-${k}`] || ''])));
  }
  const shown = designFor(template, f.shownDesign);
  const colors = f.resetColors === '1' ? {} : Object.fromEntries(COLOR_KEYS.map((k) => {
    const v = String(f[`color-${k}`] || '').toLowerCase();
    return [k, HEX.test(v) && v !== shown.colors[k] ? v : ''];
  }));
  return cleanContent({
    design: f.design, title: f.title, tagline: f.tagline, about: f.about, logo: f.logo, cover: f.cover,
    fonts: { head: f.fontHead, body: f.fontBody, label: f.fontLabel },
    colors,
    contact: { whatsapp: f.whatsapp, phone: f.phone, email: f.email, address: f.address, maps: f.maps, instagram: f.instagram, tiktok: f.tiktok, youtube: f.youtube, facebook: f.facebook },
    event: { date: f.eventDate, time: f.eventTime, place: f.eventPlace, maps: f.eventMaps },
    items,
  }, template);
}

/** A page's style.css for a screen in the editor: what it says about the
 * page's own window said about the screen instead. */
function forScreen(css) {
  const faces = [];
  const rest = css.replace(/@font-face\{[^}]*\}\n?/g, (m) => {
    faces.push(m.replace(/url\(fonts\//g, 'url(/fonts/sites/'));
    return '';
  });
  const sheet = rest
    .replace(/:root\{/g, ':host{')
    .replace(/(^|[}\s,])(html|body)(?=[\s{,.:[#])/g, '$1.zs-$2')
    .replace(/@media \((min|max)-width:/g, '@container zs ($1-width:')
    .replace(/(\d)vh\b/g, '$1cqh');
  return { faces: faces.join(''), sheet: `${sheet}\n.zs-html{container:zs/size;height:100%;overflow:auto;overscroll-behavior:contain;background:var(--paper)}.zs-body{min-height:100%}` };
}

const fontSheet = typeof CSSStyleSheet === 'function' ? new CSSStyleSheet() : null;

/** Draws the preview in `box` (the editor's `[data-site-preview]`) from
 * `form`, now and after every change to it. */
export function mountPreview(box, form, template, base) {
  if (!box || !form || !fontSheet || !('adoptedStyleSheets' in Document.prototype)) return;
  if (!document.adoptedStyleSheets.includes(fontSheet)) document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontSheet];
  const screens = [...box.querySelectorAll('[data-screen]')].map((el) => {
    const canvas = el.querySelector('.pv-canvas');
    const root = canvas.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = '<div class="zs-html"><div class="zs-body"></div></div>';
    // A link in the preview goes nowhere: the editor stays open.
    root.addEventListener('click', (e) => { if (e.target.closest('a')) e.preventDefault(); });
    return { el, canvas, root, sheet, width: Number(el.dataset.width), height: Number(el.dataset.height) };
  });
  const fit = () => {
    for (const s of screens) {
      if (s.el.hidden) continue;
      const room = s.el.parentElement.clientWidth;
      const k = Math.min(1, room / s.width);
      s.canvas.style.width = `${s.width}px`;
      s.canvas.style.height = `${s.height}px`;
      s.canvas.style.transform = `scale(${k})`;
      s.el.querySelector('.pv-screen').style.width = `${Math.floor(s.width * k)}px`;
      s.el.querySelector('.pv-screen').style.height = `${Math.floor(s.height * k)}px`;
    }
  };
  const draw = () => {
    const f = Object.fromEntries(new FormData(form));
    const files = buildSite(template, contentFromForm(f, template), document.documentElement.lang === 'id' ? 'id' : 'en');
    const page = new DOMParser().parseFromString(files.find((x) => x.path === 'index.html').text, 'text/html');
    const { faces, sheet } = forScreen(files.find((x) => x.path === 'style.css').text);
    fontSheet.replaceSync(faces);
    page.querySelectorAll('script').forEach((x) => x.remove());
    page.querySelectorAll('[src]').forEach((x) => x.setAttribute('src', new URL(x.getAttribute('src'), base).href));
    page.querySelectorAll('.search[hidden]').forEach((x) => x.removeAttribute('hidden'));
    for (const s of screens) {
      s.sheet.replaceSync(sheet);
      const body = s.root.querySelector('.zs-body');
      body.className = `zs-body ${page.body.className}`;
      body.replaceChildren(...[...page.body.childNodes].map((n) => document.importNode(n, true)));
    }
  };
  let timer = 0;
  const later = () => {
    clearTimeout(timer);
    timer = setTimeout(draw, 200);
  };
  // Another design: the colours still the old design's become the new one's,
  // and the font lists name the new design's fonts.
  form.addEventListener('change', (e) => {
    if (e.target.name !== 'design' || !form.elements.shownDesign) return;
    const was = designFor(template, form.elements.shownDesign.value);
    const now = designFor(template, e.target.value);
    for (const k of COLOR_KEYS) {
      const input = form.elements[`color-${k}`];
      if (input && input.value.toLowerCase() === was.colors[k]) input.value = now.colors[k];
    }
    form.elements.shownDesign.value = now.id;
    for (const [role, name] of [['head', 'fontHead'], ['body', 'fontBody'], ['label', 'fontLabel']]) {
      const first = form.elements[name] && form.elements[name].querySelector('option[value=""]');
      if (first) first.textContent = designFont(now, role);
    }
  });
  form.addEventListener('input', later);
  form.addEventListener('change', later);
  // The screen switch: a phone, a laptop, or both side by side.
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pv]');
    if (!b) return;
    const want = b.dataset.pv;
    for (const x of box.querySelectorAll('[data-pv]')) x.setAttribute('aria-pressed', String(x === b));
    for (const s of screens) s.el.hidden = want !== 'both' && s.el.dataset.screen !== want;
    box.classList.toggle('pv-both', want === 'both');
    fit();
  });
  addEventListener('resize', fit);
  draw();
  fit();
}
// hosting:end
