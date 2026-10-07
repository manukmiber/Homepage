#!/usr/bin/env node
// Made-up performance figures in the shape of the hourly snapshot, for local
// development only. Every number is invented by a seeded generator; nothing
// here comes from real traffic.
//
//   npm run seed:local      puts it into the local R2 bucket for `wrangler dev`
//   scripts/check-site.mjs  renders it and scans what /models would show

const HOUR = 3600000;
const DAY = 24 * HOUR;

const PROFILES = [
  { id: 'Jagad-512B-V1', rph: 9, ttft: 720, tps: 48, reply: 350, prompt: 4500, cache: 0.33, err: 0.004, seed: 11 },
  { id: 'Asmarandana-512B-V1', rph: 6, ttft: 910, tps: 42, reply: 420, prompt: 5200, cache: 0.28, err: 0.006, seed: 23 },
  { id: 'Wissangeni-512B-V1', rph: 4, ttft: 1310, tps: 36, reply: 500, prompt: 6100, cache: 0.22, err: 0.009, seed: 37 },
  // The decision model: many short calls, answered in one step.
  { id: 'pranata-v1', decision: true, rph: 900, ttft: 0, tps: 0, reply: 0, latency: 180, prompt: 600, cache: 0, err: 0.002, seed: 53 },
];

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

/** One bucket of traffic: `hours` long, starting at `t`. */
function bucket(p, r, t, hours) {
  const hour = new Date(t).getUTCHours();
  const daily = 0.55 + 0.45 * Math.sin(((hour - 6) / 24) * 2 * Math.PI) ** 2;
  const requests = Math.max(0, Math.round(p.rph * hours * daily * (0.7 + 0.6 * r())));
  if (!requests) {
    return { requests: 0, errors: 0, input: 0, output: 0, cached: 0, ttft: null, latency: null, tps: null };
  }
  const errors = r() < p.err * requests ? 1 + Math.floor(r() * 2) : 0;
  const input = Math.round(requests * p.prompt * (0.85 + 0.3 * r()));
  if (p.decision) {
    const latency = p.latency * (0.8 + 0.4 * r());
    return { requests, errors, input, output: 0, cached: 0, ttft: null, latency: round(latency), tps: null };
  }
  const output = Math.round(requests * p.reply * (0.85 + 0.3 * r()));
  const cached = Math.round(input * p.cache * (0.8 + 0.4 * r()));
  const ttft = p.ttft * (0.85 + 0.3 * r());
  const tps = p.tps * (0.9 + 0.2 * r());
  const latency = ttft + ((output / requests) / tps) * 1000;
  return { requests, errors, input, output, cached, ttft: round(ttft), latency: round(latency), tps: round(tps) };
}

function series(list, start, step) {
  const pick = (k) => list.map((b) => b[k]);
  return {
    start,
    step_ms: step,
    requests: pick('requests'),
    errors: pick('errors'),
    input_tokens: pick('input'),
    output_tokens: pick('output'),
    cached_tokens: pick('cached'),
    ttft_ms: pick('ttft'),
    latency_ms: pick('latency'),
    tps: pick('tps'),
  };
}

function figures(list, hours) {
  const sum = (k) => list.reduce((a, b) => a + b[k], 0);
  const requests = sum('requests');
  const errors = sum('errors');
  const input = sum('input');
  const output = sum('output');
  const cached = sum('cached');
  const spread = (k) => {
    const v = list.filter((b) => b[k] != null).map((b) => b[k]).sort((a, b) => a - b);
    if (!v.length) return { avg: null, p50: null, p95: null };
    const at = (q) => v[Math.min(v.length - 1, Math.floor(q * v.length))];
    return { avg: round(v.reduce((a, b) => a + b, 0) / v.length), p50: round(at(0.5)), p95: round(at(0.95)) };
  };
  return {
    requests,
    served: requests - errors,
    errors,
    availability: requests ? round(1 - errors / requests, 4) : null,
    input_tokens: input,
    output_tokens: output,
    cached_tokens: cached,
    cache_rate: input ? round(cached / input, 4) : null,
    avg_input_tokens: requests ? round(input / requests) : null,
    avg_output_tokens: requests ? round(output / requests) : null,
    ttft_ms: spread('ttft'),
    latency_ms: spread('latency'),
    tps: spread('tps'),
    per_second: round((requests - errors) / (hours * 3600), 2),
  };
}

export function sampleSnapshot(asOf = Math.floor(Date.now() / HOUR) * HOUR) {
  const models = PROFILES.map((p) => {
    const r = rng(p.seed);
    // 14 days of hours: the last 7 are charted, the 7 before are "previous".
    const hours = Array.from({ length: 336 }, (_, i) => bucket(p, r, asOf - (336 - i) * HOUR, 1));
    // 60 days of days: the last 30 are charted, the 30 before are "previous".
    const dayStart = Math.floor(asOf / DAY) * DAY;
    const days = Array.from({ length: 60 }, (_, i) => bucket(p, r, dayStart - (60 - i) * DAY, 24));
    const model = {
      id: p.id,
      stats: {
        '24h': { current: figures(hours.slice(-24), 24), previous: figures(hours.slice(-48, -24), 24) },
        '7d': { current: figures(hours.slice(-168), 168), previous: figures(hours.slice(-336, -168), 168) },
        '30d': { current: figures(days.slice(-30), 720), previous: figures(days.slice(-60, -30), 720) },
      },
      hourly: series(hours.slice(-168), asOf - 168 * HOUR, HOUR),
      daily: series(days.slice(-30), dayStart - 30 * DAY, DAY),
    };
    if (p.decision) {
      const answered = days.reduce((a, b) => a + b.requests - b.errors, 0);
      const last = hours[hours.length - 1];
      model.decisions = {
        answered_to_date: answered,
        per_second_last_hour: round((last.requests - last.errors) / 3600, 2),
        per_second_busiest_minute_24h: round(Math.max(...hours.slice(-24).map((h) => h.requests)) / 3600 * 1.6, 2),
      };
    }
    return model;
  });
  return { as_of: new Date(asOf).toISOString(), models };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(JSON.stringify(sampleSnapshot()));
}
