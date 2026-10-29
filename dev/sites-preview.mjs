// Zeiko Sites' designs, built from made-up content (dev/sites-sample.mjs)
// for looking at while one is made or changed (TEMPLATES.md). Writes
// dev/out/sites/: a folder per design and variant, each the exact files
// "Save and publish" uploads (fonts included) plus placeholder pictures, and
// an index.html that shows them all at a phone's width and a laptop's.
//
//   npm run sites:preview              build
//   npm run sites:preview -- --serve   build, then serve at :8742 (PORT=…)
//   npm run sites:preview -- --shots   build, then draw every design's
//                                      thumbnail into public/img/sites/
//                                      (needs chromium and cwebp)
//   npm run sites:preview -- --lang en the templates' own words in English

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'node:http';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setLang } from '../public/js/account/lang.js';
import { buildSite, DESIGNS, TEMPLATES } from '../public/js/account/templates.js';
import { SAMPLES } from './sites-sample.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(ROOT, 'dev', 'out', 'sites');
const args = process.argv.slice(2);
const lang = args.includes('--lang') && args[args.indexOf('--lang') + 1] === 'en' ? 'en' : 'id';
setLang(lang);

// Each variant pins the scheme, so what shows does not depend on the
// computer's own setting.
const VARIANTS = [
  { name: 'contoh', label: 'Sample' },
  { name: 'kosong', label: 'Name only', empty: true },
  { name: 'warna', label: 'Own colours and fonts', own: { colors: { accent: '#ffd60a', paper: '#1d2633', surface: '#26324a' }, fonts: { head: 'bungee', body: 'lexend' } } },
  { name: 'malam', label: 'Night', dark: true, only: (d) => Boolean(d.dark) },
];

const pinScheme = (css, dark) => css.replace('@media (prefers-color-scheme:dark){', dark ? '@media all{' : '@media not all{');

/** A placeholder picture: its name and shape written on a tinted field. */
function placeholder(path) {
  const m = /-(\d+)x(\d+)\.svg$/.exec(path) || [null, 4, 3];
  const w = 1200;
  const hgt = Math.round((w * Number(m[2])) / Number(m[1]));
  let hue = 0;
  for (const ch of path) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
  const name = path.split('/').pop().replace(/\.svg$/, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}">
<defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="40" fill="hsl(${hue} 30% 72%)"/><rect width="20" height="40" fill="hsl(${hue} 30% 66%)"/></pattern></defs>
<rect width="100%" height="100%" fill="url(#p)"/>
<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="${Math.round(Math.min(w, hgt) / 9)}" fill="hsl(${hue} 30% 22%)">${name} · ${m[1]}:${m[2]}</text>
</svg>
`;
}

const pictures = (c) => [c.logo, c.cover, ...(c.items || []).flatMap((it) => [it.image, it.link])].filter((p) => /^img\/.+\.svg$/.test(p || ''));

function write(dir, files) {
  for (const f of files) {
    const p = join(dir, f.path);
    mkdirSync(dirname(p), { recursive: true });
    if (f.from) copyFileSync(join(PUBLIC, f.from), p);
    else writeFileSync(p, f.text);
  }
}

rmSync(OUT, { recursive: true, force: true });
const tpls = TEMPLATES();
const variantsOf = (d) => VARIANTS.filter((v) => !v.only || v.only(d));
for (const design of DESIGNS) {
  const sample = SAMPLES[design.kind];
  for (const v of variantsOf(design)) {
    const content = v.empty ? { title: sample.title, design: design.id } : { ...sample, design: design.id, ...v.own };
    const files = buildSite(design.kind, content, lang).map((f) => (f.path === 'style.css' ? { ...f, text: pinScheme(f.text, v.dark) } : f));
    write(join(OUT, design.id, v.name), [...files, ...pictures(content).map((p) => ({ path: p, text: placeholder(p) }))]);
  }
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const frame = (src, label, desk = false) => `<figure class="${desk ? 'desk' : 'phone'}"><div class="screen"><iframe src="${src}" title="${esc(label)}" loading="lazy"></iframe></div><figcaption><a href="${src}">${esc(label)}</a></figcaption></figure>`;
const kinds = Object.keys(tpls);
const sections = kinds.map((kind) => `<h2 id="${kind}">${esc(tpls[kind].name)} <code>${kind}</code></h2>
${DESIGNS.filter((d) => d.kind === kind).map((d) => `<section id="${d.id}"><h3>${esc(d.name)} <code>${d.id}</code></h3><p>${esc(d.note[lang === 'id' ? 1 : 0])}</p>
<div class="row">${variantsOf(d).map((v) => frame(`${d.id}/${v.name}/index.html`, v.label)).join('')}${frame(`${d.id}/contoh/index.html`, 'Laptop, 1280 px', true)}</div></section>`).join('\n')}`).join('\n');
writeFileSync(join(OUT, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Zeiko Sites designs</title>
<style>
body{margin:0;padding:20px;font:15px/1.5 system-ui,sans-serif;background:#e9eaec;color:#1b1f24}
h1{margin:0 0 4px}h2{margin:48px 0 0;padding-top:12px;border-top:3px solid #1b1f24}h3{margin:28px 0 2px}p{margin:0 0 12px;color:#4a525c}nav a{margin-right:12px}
.row{display:flex;gap:18px;overflow-x:auto;padding-bottom:10px;align-items:flex-start}
figure{margin:0;flex:none}figcaption{font-size:13px;margin-top:4px}
.screen{background:#fff;box-shadow:0 0 0 1px #c4c8cd;overflow:hidden}
.phone .screen{width:375px;height:740px}.phone iframe{width:375px;height:740px;border:0}
.desk .screen{width:512px;height:344px}.desk iframe{width:1280px;height:860px;border:0;transform:scale(.4);transform-origin:0 0}
</style></head><body>
<h1>Zeiko Sites designs</h1>
<p>${DESIGNS.length} designs, built from dev/sites-sample.mjs by dev/sites-preview.mjs. Each frame is the page "Save and publish" makes, with its scheme pinned. Brief and checklist: TEMPLATES.md.</p>
<nav>${kinds.map((k) => `<a href="#${k}">${esc(tpls[k].name)}</a>`).join('')}</nav>
${sections}
</body></html>
`);

console.log(`sites-preview: ${DESIGNS.length} designs in ${OUT}`);

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
function serve(port) {
  return new Promise((done) => {
    const server = createServer((req, res) => {
      let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
      if (p.endsWith('/')) p += 'index.html';
      try {
        const body = readFileSync(join(OUT, p));
        res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }).end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(port, () => done(server));
  });
}

const port = Number(process.env.PORT) || 8742;
if (args.includes('--shots')) {
  // A phone's first screen of each design's sample, for the editor's picker,
  // five at a time (each Chromium on a profile of its own).
  const run = promisify(execFile);
  const server = await serve(0);
  const at = server.address().port;
  const shots = join(PUBLIC, 'img', 'sites');
  const tmp = join(OUT, '_shots');
  mkdirSync(shots, { recursive: true });
  const waiting = [...DESIGNS];
  const one = async () => {
    for (let d = waiting.shift(); d; d = waiting.shift()) {
      const png = join(tmp, `${d.id}.png`);
      const profile = join(tmp, `profile-${d.id}`);
      mkdirSync(profile, { recursive: true });
      // Chromium in a slow sandbox sometimes leaves without drawing: ask again.
      for (let tries = 0; tries < 4 && !existsSync(png); tries += 1) {
        await run('chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--force-device-scale-factor=1', '--window-size=390,640', '--virtual-time-budget=5000', `--screenshot=${png}`, `http://localhost:${at}/${d.id}/contoh/index.html`], { timeout: 120000 }).catch(() => {});
      }
      if (!existsSync(png)) throw new Error(`sites-preview: no picture of ${d.id}`);
      await run('cwebp', ['-quiet', '-q', '72', '-resize', '234', '384', png, '-o', join(shots, `${d.id}.webp`)]);
    }
  };
  await Promise.all([one(), one(), one(), one(), one()]);
  server.close();
  rmSync(tmp, { recursive: true, force: true });
  console.log(`sites-preview: ${DESIGNS.length} thumbnails in ${shots}`);
} else if (args.includes('--serve')) {
  await serve(port);
  console.log(`http://localhost:${port}/`);
}
