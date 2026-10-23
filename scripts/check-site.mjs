#!/usr/bin/env node
// Guards everything under public/ before it ships. See CLAUDE.md.
//
//   1. Nothing on the site may describe how the API is built or run.
//   2. The site makes no requests of its own: no scripts, fonts or data
//      from anywhere else, no fetch/XHR/WebSocket — except the account area
//      (public/account/, public/js/account/), whose scripts talk to the
//      account door and nowhere else: app.js on the account pages, and
//      session.js, which every page with the top bar loads to show who is
//      signed in.
//   3. Every price carries a data-price key, and a key reads the same
//      everywhere it appears.
//   4. Every /models#<id> link lands on a model that exists.
//   5. What src/render.js puts into /models on the server passes the same
//      rules, carries no text out of the snapshot, and fills every
//      placeholder models.html has.
//   6. The account area — its files, and its pages (public/js/account/
//      views.js) rendered from a made-up account — passes the same rules
//      except billing words and the details a customer gets with their key
//      (the account area is where both belong), and escapes everything the
//      account holds.
//   7. The docs (public/docs/, and public/id/docs/ in Indonesian) pass the
//      same rules except the details a caller needs to connect, and every
//      link to a docs page, and to a heading on one, lands.
//   8. Every page is in English and Indonesian: the EN | ID switch on each
//      lands on its twin, and the Indonesian pages pass an Indonesian list
//      of the same banned words.
//
// Exits 1 with one line per problem. Reword the page; never trim the lists
// below to make a check pass.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, sanitize } from '../src/render.js';
import { sampleSnapshot } from '../dev/sample-stats.mjs';
import * as accountViews from '../public/js/account/views.js';
import * as accountMe from '../public/js/account/me.js';
import * as accountLang from '../public/js/account/lang.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC = join(ROOT, 'public');

// [what it is, pattern]. Case-insensitive; matched against the raw file,
// comments included, because comments ship too.
const BANNED = [
  // how the API is put together
  ['architecture', /\brelay/i],
  ['architecture', /\bup-?stream/i],
  ['architecture', /\bprox(y|ies|ied)\b/i],
  ['architecture', /\bback-?end/i],
  ['architecture', /\bgateway/i],
  ['architecture', /\brout(er|ers|ing|ed)\b/i],
  ['architecture', /\b(provider|vendor)s?\b/i],
  ['architecture', /\bfail-?over/i],
  ['architecture', /\bload[- ]balanc/i],
  ['architecture', /\bqueue/i],
  ['architecture', /\bpac(ed|ing)\b/i],
  ['architecture', /\bwhite-?label/i],
  ['architecture', /\bresell/i],
  ['architecture', /\bpowered by\b/i],
  ['architecture', /\bunderlying\b/i],
  ['architecture', /\bbase model/i],
  ['architecture', /\bfine-?tun/i],
  ['architecture', /\binference\b/i],
  // tokens are priced, never explained
  ['tokenizer', /\btokeni[sz](e|es|ed|er|ers|ation|ing)\b/i],
  ['tokenizer', /\bcharacters divided\b/i],
  ['tokenizer', /\b(counted|counting) (with|by)\b/i],
  // the site shows prices, never billing
  ['billing', /\b(bill|bills|billed|billing|invoice|invoices|invoiced|invoicing)\b/i],
  ['billing', /\b(usdt|trc-?20|idr|rupiah|crypto|wallet)\b/i],
  ['billing', /\b(tax|taxes|vat|subscription|subscriptions|payment|payments|pay|pays|paid|charged|top-?up)\b/i],
  // where it runs
  ['infrastructure', /\bworkers?\b/i],
  ['infrastructure', /\bcloudflare/i],
  ['infrastructure', /\bwrangler/i],
  ['infrastructure', /\b(R2|KV|D1)\b/],
  ['infrastructure', /\bdurable object/i],
  ['infrastructure', /\bbucket/i],
  ['infrastructure', /\bdatabase/i],
  ['infrastructure', /\b(supabase|firebase|redis|postgres|mysql|sqlite|mongo)/i],
  ['infrastructure', /\b(aws|gcp|azure|vercel|netlify|heroku|lambda)\b/i],
  ['infrastructure', /\b(gpu|gpus|h100|a100|cluster|datacenter|data center|region)s?\b/i],
  ['infrastructure', /\b(dashboard|admin|internal)\b/i],
  ['infrastructure', /\b(secret|secrets|api_key|apikey)\b/i],
  // how requests are handled: refusal checks, model names, what is kept
  ['decision logic', /\b(detect(s|ed|ion)?|classif(y|ier|ies|ied)|recogni[sz](e|es|ed))\b/i],
  ['decision logic', /\b(alias|aliases|aliased|mapped|masked|renamed)\b/i],
  ['data handling', /\b(stored|storage|retention|retain(s|ed)?)\b/i],
  // where the performance figures come from
  ['infrastructure', /\b(logs|logging|logged|request log)\b/i],
  ['infrastructure', /\bsnapshots?\b/i],
  // third parties watching visitors
  ['network', /\b(analytics|tracking)\b/i],
  // who else's models these might be
  ['model origin', /\b(openrouter|anthropic|claude|chatgpt|gemini|google|deepseek|qwen|llama|mistral|mixtral|grok|xai|kimi|moonshot|glm|zhipu|cohere|perplexity|nvidia|groq|fireworks|together\.ai|hugging ?face)\b/i],
  ['model origin', /\bgpt-?\d/i],
  // how to connect: arrives with the key, never from the site
  ['connection detail', /\bsk-[a-z0-9]/i],
  ['connection detail', /\bbearer\b/i],
  ['connection detail', /\bauthorization\b/i],
  ['connection detail', /\bbase[_ ]?url\b/i],
  ['connection detail', /\/v1\b/i],
  ['connection detail', /\bcurl\b/i],
  ['connection detail', /\.(workers|pages)\.dev\b/i],
  ['connection detail', /\bapi\.[a-z0-9-]+\./i],
  ['connection detail', /\bai\.zeiko/i],
  // notes to ourselves
  ['internal note', /\b(TODO|FIXME|HACK|XXX)\b/],
  // the same, in Indonesian (public/id/ and the account area's ID text)
  ['architecture', /\b(penyedia|antrean|antrian|perantara)\b/i],
  ['billing', /\b(tagihan|ditagih|menagih|faktur|pajak|langganan|berlangganan|kripto|dompet)\b/i],
  ['billing', /\b(bayar|membayar|dibayar|dibayarkan|pembayaran|bayaran)\b/i],
  ['infrastructure', /\b(basis data|pangkalan data|dasbor|klaster|pusat data)\b/i],
  ['decision logic', /\b(deteksi|mendeteksi|terdeteksi|klasifikasi|mengklasifikasi|dikenali)\b/i],
  ['data handling', /\b(disimpan|tersimpan|penyimpanan|retensi)\b/i],
  ['network', /\b(analitik|pelacakan)\b/i],
];

// No request may leave the page.
const NETWORK = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bEventSource\b/,
  /\bWebSocket\b/,
  /\bsendBeacon\b/,
  /\bimport\s*\(/,
  /<iframe\b/i,
];

// The only absolute URL allowed is the SVG namespace in the favicon.
const URL_RE = /(?:https?:)?\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s"'<>)]*/gi;
const URL_OK = [/^(?:https?:)?\/\/www\.w3\.org\/2000\/svg$/i];

const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.txt', '.svg', '.xml', '.webmanifest', '']);

const problems = [];
const report = (file, index, src, msg) => {
  const line = src.slice(0, index).split('\n').length;
  const name = file.startsWith(ROOT) ? relative(ROOT, file) : file;
  problems.push(`${name}:${line}  ${msg}`);
};

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(PUBLIC).filter((f) => TEXT_EXT.has(extname(f)));

// The account area: the one place that talks to anything but this site, and
// only to the account door.
const ACCOUNT_DIRS = [join(PUBLIC, 'account'), join(PUBLIC, 'js', 'account')];
const inAccount = (f) => ACCOUNT_DIRS.some((d) => f.startsWith(d + '/') || f.startsWith(d + '\\'));
const DOOR = 'https://auth.zeiko.biz.id';
const html = [];
const prices = new Map(); // key -> [{ value, file, index, src }]

// The one contact address is the operator's own mailbox; its local part is
// not a word on the page. Only this exact address is let through, blanked to
// the same length so line numbers stay true.
const CONTACT = 'admin@zeiko.biz.id';

// The homepage's playground (#try) is the one exception outside the account
// area, on the operator's request: js/try.js may call the account door —
// `fetch(DOOR …)` and the door's /v1 path, nothing else. Every page with the
// top bar names the door in its <meta name="zeiko-accounts"> (the top bar's
// script, js/account/session.js, and the playground read it there), and
// nowhere else. Every other rule, billing included, holds.
const PLAYGROUND = join(PUBLIC, 'js', 'try.js');
const HOME = join(PUBLIC, 'index.html');
const DOOR_META = `<meta name="zeiko-accounts" content="${DOOR}">`;
const SESSION_SCRIPT = '<script type="module" src="/js/account/session.js">';

// The docs are the one public place allowed the details a caller needs to
// connect, on the operator's request: the API's address (the only other
// address they may name), its paths, the Authorization header, and curl and
// SDK examples, whose key parameter is `api_key` / `apiKey`. The examples
// are text in <pre> blocks, so a fetch( there is not a request; the pages
// run main.js and nothing else. Every other rule, billing included, holds.
const DOCS = join(PUBLIC, 'docs');
const DOCS_ID = join(PUBLIC, 'id', 'docs');
const under = (d, f) => f.startsWith(d + '/') || f.startsWith(d + '\\');
const inDocs = (f) => under(DOCS, f) || under(DOCS_ID, f);
const API_ADDR = 'https://ai.zeiko.biz.id';
const SDK_KEY = /^api_?key$/i;
const blankPre = (src) => src.replace(/<pre\b[\s\S]*?<\/pre>/gi, (m) => m.replace(/[^\n]/g, ' '));

// Zeiko Drive, the file storage product, is the third exception, on the
// operator's request (October 2026: "that rule is for the AI project; for
// this one it is safe"). Its own page (drive.html, and id/drive.html) and the
// marked Drive blocks elsewhere (<!-- drive:start --> … <!-- drive:end -->)
// may say what a storage product has to say — storage, its prices in rupiah,
// paying for a plan — and link to the app at /dashboard. Only these words, and
// "dashboard" only as that path; every other rule holds there too, and the
// AI products' copy keeps the rule whole.
const DRIVE_PAGES = new Set([join(PUBLIC, 'drive.html'), join(PUBLIC, 'id', 'drive.html')]);
const DRIVE_WORDS = /^(storage|rupiah|pay|paid|pays|penyimpanan|disimpan|tersimpan|bayar|membayar|dibayar|pembayaran)$/i;
function driveRanges(file, src) {
  if (DRIVE_PAGES.has(file)) return [[0, src.length]];
  const out = [];
  for (const m of src.matchAll(/<!-- drive:start -->[\s\S]*?<!-- drive:end -->/g)) out.push([m.index, m.index + m[0].length]);
  return out;
}
const inRanges = (ranges, i) => ranges.some(([a, b]) => i >= a && i < b);
// Zeiko Drive's app is at its own address, which every page may link to, and
// "/dashboard" (its old address here) is still the way back to it, so as a
// path it is allowed on every page and in the account area (sign-in comes
// back through it); the word on its own is still banned everywhere.
const DRIVE_ADDR = 'https://drive.zeiko.biz.id';
const driveLink = (url) => url === DRIVE_ADDR || url.startsWith(DRIVE_ADDR + '/');
const drivePath = (src, m) => /^dashboard$/i.test(m[0]) && src[m.index - 1] === '/';
function driveAllows(src, ranges, m) {
  if (drivePath(src, m)) return true;
  return inRanges(ranges, m.index) && DRIVE_WORDS.test(m[0]);
}

function scan(file, src) {
  const words = src.split(CONTACT).join(' '.repeat(CONTACT.length));
  const drive = driveRanges(file, src);
  for (const [what, re] of BANNED) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const m of words.matchAll(g)) {
      if (file === PLAYGROUND && what === 'connection detail' && /^\/v1$/i.test(m[0])) continue;
      if (inDocs(file) && (what === 'connection detail' || (what === 'infrastructure' && SDK_KEY.test(m[0])))) continue;
      if (driveAllows(words, drive, m)) continue;
      report(file, m.index, src, `${what}: "${m[0]}"`);
    }
  }

  const code = inDocs(file) ? blankPre(src) : src;
  for (const re of NETWORK) {
    const g = new RegExp(re.source, re.flags + 'g');
    for (const m of code.matchAll(g)) {
      if (file === PLAYGROUND && src.startsWith('fetch(DOOR ', m.index)) continue;
      report(file, m.index, src, `network call: "${m[0]}" (the site fetches nothing; the playground asks only the account door)`);
    }
  }

  for (const m of src.matchAll(URL_RE)) {
    if (URL_OK.some((ok) => ok.test(m[0]))) continue;
    if (driveLink(m[0])) continue;
    if (m[0] === DOOR && src.slice(m.index - DOOR_META.indexOf(DOOR)).startsWith(DOOR_META)) continue;
    if (inDocs(file) && (m[0] === API_ADDR || m[0].startsWith(API_ADDR + '/'))) continue;
    report(file, m.index, src, `external URL: "${m[0]}"`);
  }

  if (inDocs(file)) {
    for (const m of src.matchAll(/<script\b[^>]*>/gi)) {
      if (m[0] !== '<script src="/js/main.js">' && m[0] !== SESSION_SCRIPT) report(file, m.index, src, `script on a docs page: "${m[0]}" (the docs run main.js and the top bar's session.js only)`);
    }
  }
  // A page with the top bar shows who is signed in: it names the door and
  // loads the script that asks it.
  if (extname(file) === '.html' && /class="nav-account"/.test(src)) {
    if (!src.includes(DOOR_META)) report(file, 0, src, `the top bar needs ${DOOR_META} (js/account/session.js reads the door there)`);
    if (!src.includes(SESSION_SCRIPT)) report(file, 0, src, `the top bar needs ${SESSION_SCRIPT}</script>`);
  }
}

const accountFiles = [];
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (inAccount(file)) {
    accountFiles.push({ file, src });
    continue;
  }
  scan(file, src);
  if (extname(file) === '.html') html.push({ file, src });
}

if (files.includes(PLAYGROUND)) {
  const home = html.find((h) => h.file === HOME);
  if (!home || !home.src.includes(DOOR_META)) {
    problems.push(`public/index.html: the playground (js/try.js) reads the account door from ${DOOR_META}`);
  }
}

// ---------------------------------------------------------------- prices

const PRICE_EL = /data-price="([^"]+)"[^>]*>([^<]*)</g;
for (const { file, src } of html) {
  for (const m of src.matchAll(PRICE_EL)) {
    const [, key, value] = m;
    if (!prices.has(key)) prices.set(key, []);
    prices.get(key).push({ value: value.trim(), file, index: m.index, src });
  }

  // A $ amount outside a data-price element is a price nobody will
  // remember to update.
  const guarded = [...src.matchAll(PRICE_EL)].map((m) => [m.index, m.index + m[0].length]);
  for (const m of src.matchAll(/\$\s?\d/g)) {
    if (!guarded.some(([from, to]) => m.index >= from && m.index < to)) {
      report(file, m.index, src, `price without data-price: "${src.slice(m.index).match(/^\$\s?[\d.,]+/)[0]}"`);
    }
  }
}

for (const [key, seen] of prices) {
  const values = new Set(seen.map((s) => s.value));
  if (values.size > 1) {
    for (const s of seen) report(s.file, s.index, s.src, `data-price="${key}" reads ${s.value}, but elsewhere ${[...values].filter((v) => v !== s.value).join(' / ')}`);
  }
}

// ---------------------------------------------------------- model anchors

const models = html.find((h) => h.file === join(PUBLIC, 'models.html'));
if (!models) {
  problems.push('public/models.html is missing — /models must exist');
} else {
  for (const { file, src } of html) {
    for (const m of src.matchAll(/href="(?:\/id)?\/models#([^"]+)"|href="#([^"]+)"/g)) {
      const id = m[1] ?? (file === models.file || file === join(PUBLIC, 'id', 'models.html') ? m[2] : null);
      if (!id) continue;
      if (!models.src.includes(`id="${id}"`)) report(file, m.index, src, `link to /models#${id}, but models.html has no id="${id}"`);
    }
  }
}

// ------------------------------------------------------------ docs links

// Every link to a docs page names a file that exists, and a #heading on it
// (or on the same docs page) names an id that page has.
const docsPages = new Map(html.filter((h) => inDocs(h.file)).map((h) => [h.file, h.src]));
for (const { file, src } of [...html, ...accountFiles]) {
  for (const m of src.matchAll(/href="\/(id\/)?docs\/([a-z0-9-]*)(?:#([^"]+))?"/g)) {
    const [, id, slug, hash] = m;
    const name = slug || 'index';
    const dir = id ? 'id/docs' : 'docs';
    const page = docsPages.get(join(PUBLIC, dir, `${name}.html`));
    if (!page) report(file, m.index, src, `link to /${dir}/${slug}, but there is no public/${dir}/${name}.html`);
    else if (hash && !page.includes(`id="${hash}"`)) report(file, m.index, src, `link to /${dir}/${slug}#${hash}, but that page has no id="${hash}"`);
  }
  if (!inDocs(file)) continue;
  for (const m of src.matchAll(/href="#([^"]+)"/g)) {
    if (!src.includes(`id="${m[1]}"`)) report(file, m.index, src, `link to #${m[1]}, but this page has no id="${m[1]}"`);
  }
}

// The docs list is written into every docs page twice (beside the page, and
// the phone's "Docs menu"): every copy lists every docs page, in the same
// order, and marks the page it is on. The Indonesian docs list the same
// pages, in the same order, under /id/docs/.
const sideOf = (src, cls) => {
  const at = src.indexOf(`class="${cls}"`);
  if (at < 0) return null;
  const end = src.indexOf(cls === 'docs-menu' ? '</details>' : '</nav>', at);
  return src.slice(at, end);
};
const hrefs = (part) => [...part.matchAll(/<a href="((?:\/id)?\/docs\/[a-z0-9-]*)"/g)].map((m) => m[1]);
const docsIndex = docsPages.get(join(DOCS, 'index.html'));
const order = docsIndex && sideOf(docsIndex, 'docs-list') ? hrefs(sideOf(docsIndex, 'docs-list')) : [];
for (const [file, src] of docsPages) {
  const id = under(DOCS_ID, file);
  const base = id ? '/id/docs/' : '/docs/';
  const want = id ? order.map((h) => '/id' + h) : order;
  const name = relative(id ? DOCS_ID : DOCS, file).replace(/\.html$/, '');
  const self = name === 'index' ? base : `${base}${name}`;
  if (!want.includes(self)) problems.push(`${relative(ROOT, file)} is not in the docs list (public/docs/index.html)`);
  for (const cls of ['docs-list', 'docs-menu']) {
    const part = sideOf(src, cls);
    if (!part) { problems.push(`${relative(ROOT, file)}: no .${cls}`); continue; }
    if (hrefs(part).join(' ') !== want.join(' ')) problems.push(`${relative(ROOT, file)}: its .${cls} does not list the docs pages as public/docs/index.html does`);
    if (!part.includes(`<a href="${self}" aria-current="page">`)) problems.push(`${relative(ROOT, file)}: its .${cls} does not mark this page (aria-current)`);
  }
}
for (const name of order.map((h) => h.slice('/docs/'.length) || 'index')) {
  if (!docsPages.has(join(DOCS_ID, `${name}.html`))) problems.push(`public/docs/${name}.html has no Indonesian twin (public/id/docs/${name}.html)`);
}

// ------------------------------------------------------------ EN | ID

// Every page with the top bar carries the EN | ID switch, and it lands on
// the same page in the other language: a file that exists, whose own switch
// points back here.
const pageOf = (href) => {
  const path = href.split('#')[0];
  return join(PUBLIC, path.endsWith('/') ? `${path}index.html` : `${path}.html`);
};
const urlOf = (file) => {
  const rel = '/' + relative(PUBLIC, file).split('\\').join('/').replace(/\.html$/, '');
  return rel.endsWith('/index') ? rel.slice(0, -'index'.length) : rel;
};
const pages = new Map(html.map((h) => [h.file, h.src]));
const SWITCH = /<a class="lang-switch" href="([^"]+)" hreflang="(en|id)"/;
for (const [file, src] of pages) {
  if (!/class="nav-account"/.test(src) && !/class="lang-switch"/.test(src)) continue;
  const m = src.match(SWITCH);
  if (!m) { report(file, 0, src, 'no EN | ID switch (<a class="lang-switch" href="…" hreflang="…">)'); continue; }
  const twin = pageOf(m[1]);
  const lang = under(join(PUBLIC, 'id'), file) ? 'id' : 'en';
  if (m[2] === lang) report(file, m.index, src, `the EN | ID switch goes to ${m[2]}, the language this page is already in`);
  if (!src.includes(`<html lang="${lang}">`)) report(file, 0, src, `this page is in ${lang}, but its <html lang> says otherwise`);
  if (!pages.has(twin)) { report(file, m.index, src, `the EN | ID switch goes to ${m[1]}, but there is no ${relative(ROOT, twin)}`); continue; }
  const back = pages.get(twin).match(SWITCH);
  if (!back || pageOf(back[1]) !== file) report(file, m.index, src, `${m[1]} does not switch back to ${urlOf(file)}`);
}

// ------------------------------------------------------ rendered /models

// Render the made-up sample through the same code the server runs, with
// junk a real snapshot might carry mixed in. None of the junk may come out.
const RENDERED = 'rendered /models (dev sample)';
const snap = sampleSnapshot(Date.UTC(2026, 8, 24, 12));
snap.format = 'CANARY format';
snap.models[0].page = { notes: ['CANARY note'] };
snap.models[0].endpoints = ['CANARY endpoint'];
snap.models[1].stats['7d'].current.requests = 'CANARY count';
snap.models.push({ id: '<b>CANARY</b>', stats: {} });
// Both languages: /models in English, /id/models in Indonesian.
for (const [lang, page] of [['en', models], ['id', html.find((h) => h.file === join(PUBLIC, 'id', 'models.html'))]]) {
  const where = `${RENDERED}, ${lang}`;
  const view = render(sanitize(snap), lang);
  if (!view) {
    problems.push(`${where}: src/render.js rendered nothing`);
    continue;
  }
  const out = [view.bar, ...Object.values(view.models), ...Object.values(view.glance).flatMap(Object.values)].join('\n');
  scan(where, out);
  for (const m of out.matchAll(/CANARY/g)) report(where, m.index, out, 'text from the snapshot reached the page; only numbers may');
  for (const m of out.matchAll(/\$\s?\d/g)) report(where, m.index, out, 'a price in the performance figures; prices live in the static HTML');
  if (!page) {
    problems.push(`${where}: no page to fill (public/${lang === 'id' ? 'id/' : ''}models.html)`);
    continue;
  }
  for (const m of page.src.matchAll(/data-perf="([^"]+)"/g)) {
    if (!view.models[m[1]]) report(page.file, m.index, page.src, `data-perf="${m[1]}" has no model in the sample`);
  }
  for (const m of page.src.matchAll(/data-stat="([^":]+):([^"]+)"/g)) {
    if (!(view.glance[m[1]] && view.glance[m[1]][m[2]])) report(page.file, m.index, page.src, `data-stat="${m[1]}:${m[2]}" is never filled`);
  }
}

// ------------------------------------------------------- account pages

// The account area may talk about money (it is the customer's own) and may
// show the key and the address it goes with; everything else stays banned.
const ACCOUNT_OK = new Set(['billing', 'connection detail']);
const ACCOUNT_BANNED = BANNED.filter(([what]) => !ACCOUNT_OK.has(what));
const ACCOUNT = 'rendered /account (made-up account)';

function scanAccount(file, src) {
  const words = src.split(CONTACT).join(' '.repeat(CONTACT.length));
  for (const [what, re] of ACCOUNT_BANNED) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const m of words.matchAll(g)) {
      // "Continue with Google" is a sign-in button, not a model's origin.
      if (what === 'model origin' && /^google$/i.test(m[0])) continue;
      // Gemini is also a crypto exchange: the buying guide lists it, as a
      // table row of its own, and nowhere else.
      if (what === 'model origin' && m[0] === 'Gemini' && words.startsWith('<th scope="row">Gemini</th>', m.index - 16)) continue;
      if (drivePath(words, m)) continue;
      report(file, m.index, src, `${what}: "${m[0]}"`);
    }
  }
}

// Its files: the account door is the one address they may name (and Zeiko
// Drive's, the app a sign-in may go back to), and the account script and the
// top bar's the only places that may call it.
const CALLERS = new Set([join(PUBLIC, 'js', 'account', 'app.js'), join(PUBLIC, 'js', 'account', 'session.js')]);
for (const { file, src } of accountFiles) {
  scanAccount(file, src);
  for (const re of NETWORK) {
    const g = new RegExp(re.source, re.flags + 'g');
    for (const m of src.matchAll(g)) {
      if (CALLERS.has(file) && m[0].startsWith('fetch')) continue;
      report(file, m.index, src, `network call: "${m[0]}" (only the account script and the top bar call the account door)`);
    }
  }
  for (const m of src.matchAll(URL_RE)) {
    // A policy lists addresses with a `;` after each.
    const url = m[0].replace(/;$/, '');
    if (url === DOOR || driveLink(url) || URL_OK.some((ok) => ok.test(url))) continue;
    report(file, m.index, src, `external URL: "${m[0]}" (the account door is the only one)`);
  }
}
const shell = accountFiles.find((f) => f.file === join(PUBLIC, 'account', 'index.html'));
if (!shell) problems.push('public/account/index.html is missing — /account must exist');
else if (!shell.src.includes(`name="zeiko-accounts" content="${DOOR}"`) || !shell.src.includes(`connect-src 'self' ${DOOR};`)) {
  problems.push(`public/account/index.html: the account door (${DOOR}) must be its <meta name="zeiko-accounts"> and its only connect-src`);
}

{
  const evil = '<script>CANARY</script>';
  const o = {
    account: { id: 'a1', username: 'acme', name: evil, email: 'ops@acme.test', emailVerified: false, hasPassword: false, google: true, github: false, createdAt: Date.UTC(2026, 8, 1) },
    mail: true,
    plan: { id: 'expand', name: 'Expand', paygo: false, requests: 100000, days: 30, expiresAt: Date.UTC(2026, 10, 1) },
    chat: {
      planName: 'Free', plan: 'free', expiresAt: null, url: 'https://chat.example',
      plans: [{ id: 'plus', name: evil, priceUsd: 3, days: 30, requests: 0, tagline: evil, subscription: true }],
    },
    usage: { used: 81234, amount: 100000, periodStart: Date.UTC(2026, 9, 1), resetsAt: Date.UTC(2026, 10, 1) },
    balance: { micro: 4_200_000, text: '$4.20', shared: true },
    owed: { micro: 1240, text: evil },
    prepaid: true,
    plans: [
      { id: 'welcome', name: evil, priceUsd: 1, days: 30, requests: 10000, subscription: true },
      { id: 'expand', name: 'Expand', priceUsd: 5, days: 30, requests: 150000, subscription: true, promo: { days: 90, until: null, left: 12 } },
      { id: 'question', name: evil, priceUsd: 25, days: 30, requests: 750000, subscription: false, promo: { days: 90, until: Date.UTC(2026, 9, 31, 17), left: null } },
    ],
    qris: { active: true },
    topUps: [2, 5], minTopUpUsd: 2, maxTopUpUsd: 1000,
    paymentsActive: true, subscriptionsActive: true,
    key: { id: 'k1', shown: 'abcd…wxyz', enabled: true },
    models: [{ id: 'pranata-v1', unit: 'mtok', usd: 0.003, window: 2000 }],
    payments: [
      { id: 'p1', kind: 'credit', what: evil, amountText: '$5.00', status: 'waiting', paid: false, invoiceUrl: 'https://pay.example/i', createdAt: Date.now(), method: 'crypto' },
      { id: 'p2', kind: 'plan', what: evil, amountText: '$25.00', status: 'confirming', paid: false, createdAt: Date.now(), method: 'qris', localText: evil },
    ],
    subscriptions: [],
    daily: [{ day: Date.now() - (Date.now() % 86_400_000), calls: 12, units: 14, inputTokens: 9000 }],
  };
  const opts = { google: true, github: true };
  o.signInWith = opts;
  o.referral = { code: evil, discountPct: 20 };
  const door = DOOR;
  // Both languages: the account pages are drawn in English or Indonesian.
  const pages = ['en', 'id'].flatMap((lang) => (accountLang.setLang(lang), [
    accountViews.nav(o.account),
    accountViews.nav(null),
    accountMe.meLink(accountMe.displayName(o.account), { title: evil }),
    accountMe.meLink(accountMe.displayName({ username: evil })),
    accountViews.overview(o, ''),
    accountViews.plans(o, { flash: '', pick: 'welcome' }),
    accountViews.key(o, { flash: '', shown: 'k-123', apiBase: 'https://example.test' }),
    accountViews.settings(o, { flash: '', door }),
    accountViews.howToBuy(o, ''),
    ...['waiting', 'confirming', 'paid', 'failed', 'expired', evil].map((status) => accountViews.qrisPay(o, {
      id: evil, what: evil, amountText: evil, rupiah: 449237, rupiahText: evil, merchant: evil, nmid: evil, product: 'pranata',
      qr: status === 'waiting' ? ['1010', '0101', '1100', '0011'] : [evil], status, createdAt: Date.now(), expiresAt: Date.now() + 3_600_000,
    }, '')),
    // Rows that are not all 0 and 1 draw no code at all.
    accountViews.qrisPay(o, { id: 'q', status: 'waiting', qr: ['10', `1${evil}`], rupiahText: 'Rp 1', expiresAt: 0 }, ''),
    accountViews.signIn({ error: evil, notice: '', email: evil, next: '/account', opts, door }),
    accountViews.signUp({ error: '', email: '', username: evil, next: '', ref: evil, opts, door }),
    accountViews.forgot({ error: '', sent: false }),
    accountViews.reset({ error: evil, token: evil }),
  ])).join('\n');
  accountLang.setLang('en');
  scanAccount(ACCOUNT, pages);
  for (const m of pages.matchAll(/<script>CANARY/g)) report(ACCOUNT, m.index, pages, 'an account value reached the page unescaped');
  for (const re of NETWORK) {
    const g = new RegExp(re.source, re.flags + 'g');
    for (const m of pages.matchAll(g)) report(ACCOUNT, m.index, pages, `network call: "${m[0]}"`);
  }
}

// ----------------------------------------------------------------- result

if (problems.length) {
  console.error(`check-site: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nSee CLAUDE.md. Fix the page, not the check.');
  process.exit(1);
}

console.log(`check-site: ${files.length} files (${accountFiles.length} in the account area), the rendered /models and the account pages clean, ${prices.size} price keys consistent.`);
