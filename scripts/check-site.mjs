#!/usr/bin/env node
// Guards everything under public/ before it ships. See CLAUDE.md.
//
//   1. Nothing on the site may describe how the API is built or run.
//   2. The site makes no requests of its own: no scripts, fonts or data
//      from anywhere else, no fetch/XHR/WebSocket.
//   3. Every price carries a data-price key, and a key reads the same
//      everywhere it appears.
//   4. Every /models#<id> link lands on a model that exists.
//
// Exits 1 with one line per problem. Reword the page; never trim the lists
// below to make a check pass.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  // tokens are billed, never explained
  ['tokenizer', /\btokeni[sz](er|ers|ation|ing)\b/i],
  ['tokenizer', /\bcharacters divided\b/i],
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
  // what gets measured
  ['telemetry', /\b(logs|logging|logged|request log)\b/i],
  ['telemetry', /\b(telemetry|analytics|tracking)\b/i],
  ['telemetry', /\b(latency|ttft|throughput|uptime)\b/i],
  ['telemetry', /\btime to first token\b/i],
  ['telemetry', /\btokens? per second\b|\btok\/s\b/i],
  ['telemetry', /\b(cache|hit) rate\b/i],
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
  problems.push(`${relative(ROOT, file)}:${line}  ${msg}`);
};

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(PUBLIC).filter((f) => TEXT_EXT.has(extname(f)));
const html = [];
const prices = new Map(); // key -> [{ value, file, index, src }]

for (const file of files) {
  const src = readFileSync(file, 'utf8');

  for (const [what, re] of BANNED) {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const m of src.matchAll(g)) report(file, m.index, src, `${what}: "${m[0]}"`);
  }

  for (const re of NETWORK) {
    const g = new RegExp(re.source, re.flags + 'g');
    for (const m of src.matchAll(g)) report(file, m.index, src, `network call: "${m[0]}" (the site fetches nothing)`);
  }

  for (const m of src.matchAll(URL_RE)) {
    if (!URL_OK.some((ok) => ok.test(m[0]))) report(file, m.index, src, `external URL: "${m[0]}"`);
  }

  if (extname(file) === '.html') html.push({ file, src });
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
    for (const m of src.matchAll(/href="\/models#([^"]+)"|href="#([^"]+)"/g)) {
      const id = m[1] ?? (file === models.file ? m[2] : null);
      if (!id) continue;
      if (!models.src.includes(`id="${id}"`)) report(file, m.index, src, `link to /models#${id}, but models.html has no id="${id}"`);
    }
  }
}

// ----------------------------------------------------------------- result

if (problems.length) {
  console.error(`check-site: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nSee CLAUDE.md. Fix the page, not the check.');
  process.exit(1);
}

console.log(`check-site: ${files.length} files clean, ${prices.size} price keys consistent.`);
