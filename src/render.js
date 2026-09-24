// Turns the hourly model snapshot into the performance sections of /models.
//
// This file is the only door between the snapshot and the page. It reads
// numbers and nothing else: every other field the snapshot may carry is
// dropped by sanitize(), and every string that reaches the page is either a
// fixed label written here or a number formatted here. Never copy a string
// out of the snapshot onto the page.
//
// Pure functions only (no Workers APIs), so scripts/check-site.mjs can run
// the same code in Node and scan what it would put on the page.

export const WINDOWS = [
  { id: '24h', label: 'Last 24 hours', short: '24 hours', prev: 'previous 24 hours', unit: 'per hour', avg: 'hourly average' },
  { id: '7d', label: 'Last 7 days', short: '7 days', prev: 'previous 7 days', unit: 'per 6 hours', avg: '6-hour average' },
  { id: '30d', label: 'Last 30 days', short: '30 days', prev: 'previous 30 days', unit: 'per day', avg: 'daily average' },
];
export const DEFAULT_WINDOW = '7d';

const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const FIGURES = ['requests', 'served', 'errors', 'availability', 'input_tokens', 'output_tokens',
  'cached_tokens', 'cache_rate', 'avg_input_tokens', 'avg_output_tokens'];
const SPREADS = ['ttft_ms', 'latency_ms', 'tps'];
const SERIES = ['requests', 'errors', 'input_tokens', 'output_tokens', 'cached_tokens', 'ttft_ms', 'latency_ms', 'tps'];

// ------------------------------------------------------------- sanitize

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function figures(o) {
  if (!o || typeof o !== 'object') return null;
  const f = {};
  for (const k of FIGURES) f[k] = num(o[k]);
  for (const k of SPREADS) {
    const d = o[k] && typeof o[k] === 'object' ? o[k] : {};
    f[k] = { avg: num(d.avg), p50: num(d.p50), p95: num(d.p95) };
  }
  return f;
}

function series(s, keep) {
  if (!s || typeof s !== 'object') return null;
  const start = num(s.start);
  const step = num(s.step_ms);
  if (start == null || !(step > 0)) return null;
  let len = Infinity;
  for (const k of SERIES) len = Math.min(len, Array.isArray(s[k]) ? s[k].length : 0);
  if (!(len > 0)) return null;
  const take = Math.min(len, keep);
  const skip = len - take;
  const out = { start: start + skip * step, step };
  for (const k of SERIES) out[k] = s[k].slice(skip, len).map(num);
  return out;
}

/** Everything the page may use, and nothing else. */
export function sanitize(doc) {
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.models)) return null;
  const asOf = typeof doc.as_of === 'string' ? Date.parse(doc.as_of) : NaN;
  const models = {};
  for (const m of doc.models) {
    if (!m || typeof m.id !== 'string' || !ID.test(m.id)) continue;
    const stats = {};
    for (const w of WINDOWS) {
      const s = m.stats && m.stats[w.id];
      stats[w.id] = { cur: figures(s && s.current), prev: figures(s && s.previous) };
    }
    models[m.id] = { stats, hourly: series(m.hourly, 168), daily: series(m.daily, 30) };
  }
  return { asOf: Number.isFinite(asOf) ? asOf : null, models };
}

// ------------------------------------------------------------ formatting

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad = (n) => String(n).padStart(2, '0');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function trim(v, d) {
  return v.toFixed(d).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}
function grouped(v) {
  return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const fmt = {
  count: (v) => (v == null ? '—' : grouped(v)),
  compact(v) {
    if (v == null) return '—';
    const a = Math.abs(v);
    if (a >= 1e9) return trim(v / 1e9, a >= 1e10 ? 1 : 2) + 'B';
    if (a >= 1e6) return trim(v / 1e6, a >= 1e7 ? 1 : 2) + 'M';
    if (a >= 1e4) return trim(v / 1e3, a >= 1e5 ? 0 : 1) + 'K';
    return grouped(v);
  },
  ms(v) {
    if (v == null) return '—';
    if (v < 1000) return Math.round(v) + ' ms';
    return trim(v / 1000, v < 10000 ? 2 : 1) + ' s';
  },
  tps: (v) => (v == null ? '—' : trim(v, 1) + ' tok/s'),
  pct: (v, d = 1) => (v == null ? '—' : trim(v * 100, d) + '%'),
};

function stamp(t) {
  const d = new Date(t);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:00 UTC`;
}

// --------------------------------------------------------------- buckets

function rows(s) {
  if (!s) return [];
  return s.requests.map((_, i) => ({
    t: s.start + i * s.step,
    span: s.step,
    requests: s.requests[i],
    errors: s.errors[i],
    input: s.input_tokens[i],
    output: s.output_tokens[i],
    cached: s.cached_tokens[i],
    ttft: s.ttft_ms[i],
    latency: s.latency_ms[i],
    tps: s.tps[i],
  }));
}

/** Hours folded into wider buckets: counts add up, timings average by request. */
function widen(list, k) {
  const out = [];
  for (let i = list.length % k; i + k <= list.length; i += k) {
    const part = list.slice(i, i + k);
    const b = { t: part[0].t, span: part[0].span * k };
    for (const key of ['requests', 'errors', 'input', 'output', 'cached']) {
      const vals = part.map((p) => p[key]).filter((v) => v != null);
      b[key] = vals.length ? vals.reduce((a, v) => a + v, 0) : null;
    }
    for (const key of ['ttft', 'latency', 'tps']) {
      let sum = 0, weight = 0, plain = 0, count = 0;
      for (const p of part) {
        if (p[key] == null) continue;
        plain += p[key]; count += 1;
        if (p.requests > 0) { sum += p[key] * p.requests; weight += p.requests; }
      }
      b[key] = weight > 0 ? sum / weight : count ? plain / count : null;
    }
    out.push(b);
  }
  return out;
}

function points(model, win) {
  if (win === '30d') return rows(model.daily);
  const hourly = rows(model.hourly);
  return win === '24h' ? hourly.slice(-24) : widen(hourly, 6);
}

function bucketLabel(p, win) {
  const d = new Date(p.t);
  const day = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  if (win === '30d') return day;
  const end = new Date(p.t + p.span);
  return `${day}, ${pad(d.getUTCHours())}:00–${pad(end.getUTCHours())}:00 UTC`;
}

function tickLabel(p, win) {
  const d = new Date(p.t);
  if (win === '24h') return `${pad(d.getUTCHours())}:00`;
  if (win === '7d') return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()}`;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

// ---------------------------------------------------------------- charts

// One size for every chart; the SVG scales with its card.
const G = { w: 340, h: 176, l: 46, r: 10, t: 12, b: 26 };
G.pw = G.w - G.l - G.r;
G.ph = G.h - G.t - G.b;

function niceMax(v) {
  if (!(v > 0)) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (v <= m * mag) return m * mag;
  return 10 * mag;
}

function frame(pts, max, axis, win) {
  const n = pts.length;
  let out = '';
  for (const f of [0, 0.5, 1]) {
    const y = G.t + G.ph - f * G.ph;
    out += `<line class="grid" x1="${G.l}" x2="${G.w - G.r}" y1="${y}" y2="${y}"/>`;
    out += `<text class="axis" x="${G.l - 6}" y="${y + 4}" text-anchor="end">${esc(axis(max * f))}</text>`;
  }
  const slot = G.pw / n;
  const ticks = n > 1 ? [0, Math.round((n - 1) / 3), Math.round((2 * (n - 1)) / 3), n - 1] : [0];
  ticks.forEach((i, k) => {
    const x = G.l + (i + 0.5) * slot;
    const anchor = k === 0 ? 'start' : k === ticks.length - 1 ? 'end' : 'middle';
    const tx = anchor === 'start' ? Math.max(x - slot / 2, G.l) : anchor === 'end' ? Math.min(x + slot / 2, G.w - G.r) : x;
    out += `<text class="axis" x="${tx.toFixed(1)}" y="${G.h - 8}" text-anchor="${anchor}">${esc(tickLabel(pts[i], win))}</text>`;
  });
  return out;
}

/** A column whose top corners are rounded and whose foot sits square on the baseline. */
function column(x, top, w, bottom, rounded) {
  const h = bottom - top;
  if (!(h > 0.4)) return '';
  const r = rounded ? Math.min(4, w / 2, h) : 0;
  const f = (v) => v.toFixed(1);
  if (!r) return `<path d="M${f(x)} ${f(bottom)}V${f(top)}H${f(x + w)}V${f(bottom)}Z"/>`;
  return `<path d="M${f(x)} ${f(bottom)}V${f(top + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(top)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(top + r)}V${f(bottom)}Z"/>`;
}

function columns(pts, keys, win, fmtV) {
  const totals = pts.map((p) => keys.reduce((a, k) => a + (p[k] || 0), 0));
  const max = niceMax(Math.max(0, ...totals));
  const slot = G.pw / pts.length;
  const w = Math.max(1, Math.min(24, slot - 2));
  const base = G.t + G.ph;
  const scale = (v) => (v / max) * G.ph;
  let marks = keys.map(() => '');
  pts.forEach((p, i) => {
    const x = G.l + i * slot + (slot - w) / 2;
    let bottom = base;
    const present = keys.map((k) => (p[k] || 0) > 0);
    const topIndex = present.lastIndexOf(true);
    keys.forEach((k, j) => {
      const v = p[k] || 0;
      if (!(v > 0)) return;
      const h = scale(v);
      const top = bottom - h;
      // A 2px surface gap between stacked segments.
      const foot = j > 0 && present.slice(0, j).some(Boolean) ? bottom - 2 : bottom;
      marks[j] += column(x, top, w, foot, j === topIndex);
      bottom = top;
    });
  });
  const body = marks.map((m, j) => `<g class="s${j + 1}">${m}</g>`).join('');
  return { svg: frame(pts, max, fmtV.axis, win) + body, max };
}

function line(pts, key, win, fmtV) {
  const vals = pts.map((p) => p[key]);
  const max = niceMax(Math.max(0, ...vals.filter((v) => v != null)));
  const slot = G.pw / pts.length;
  const x = (i) => G.l + (i + 0.5) * slot;
  const y = (v) => G.t + G.ph - (v / max) * G.ph;
  const base = G.t + G.ph;
  let path = '';
  let area = '';
  let run = [];
  const flush = () => {
    if (!run.length) return;
    path += run.map((i, k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)} ${y(vals[i]).toFixed(1)}`).join('');
    const first = run[0];
    const last = run[run.length - 1];
    area += `M${x(first).toFixed(1)} ${base}` + run.map((i) => `L${x(i).toFixed(1)} ${y(vals[i]).toFixed(1)}`).join('') + `L${x(last).toFixed(1)} ${base}Z`;
    run = [];
  };
  vals.forEach((v, i) => (v == null ? flush() : run.push(i)));
  flush();
  let end = '';
  for (let i = vals.length - 1; i >= 0; i--) {
    if (vals[i] != null) { end = `<circle class="end" cx="${x(i).toFixed(1)}" cy="${y(vals[i]).toFixed(1)}" r="4"/>`; break; }
  }
  const body = `<g class="s1"><path class="area" d="${area}"/><path class="line" d="${path}"/>${end}</g>`;
  return { svg: frame(pts, max, fmtV.axis, win) + body, max };
}

const AXIS = {
  count: (v) => fmt.compact(v),
  ms: (v) => (v >= 1000 ? trim(v / 1000, 1) + ' s' : Math.round(v) + ' ms'),
  tps: (v) => trim(v, 0),
};

function chart(spec, pts, win) {
  const has = pts.some((p) => spec.keys.some((k) => p[k] != null && (spec.kind === 'line' || p[k] > 0)));
  const head = `<figcaption><span class="chart-title">${esc(spec.title)}</span><span class="chart-sub">${esc(spec.sub(win))}</span></figcaption>`;
  const legend = spec.names.length > 1
    ? `<ul class="chart-legend">${spec.names.map((n, j) => `<li><i class="key s${j + 1}" aria-hidden="true"></i>${esc(n)}</li>`).join('')}</ul>`
    : '';
  if (!has) return `<figure class="chart">${head}<p class="chart-empty">No traffic in this window yet.</p></figure>`;
  const r = spec.kind === 'line'
    ? line(pts, spec.keys[0], win, { axis: AXIS[spec.fmt] })
    : columns(pts, spec.keys, win, { axis: AXIS[spec.fmt] });
  const f = spec.fmt === 'count' ? fmt.count : fmt[spec.fmt];
  const data = [
    `data-x="${esc(pts.map((p) => bucketLabel(p, win)).join('|'))}"`,
    `data-names="${esc(spec.names.join('|'))}"`,
    ...spec.keys.map((k, j) => `data-v${j + 1}="${esc(pts.map((p) => (p[k] == null ? 'no traffic' : f(p[k]))).join('|'))}"`),
    `data-geom="${G.l} ${G.pw} ${G.w} ${G.t} ${G.ph}"`,
  ].join(' ');
  const label = `${spec.title}, ${spec.sub(win)}`;
  return `<figure class="chart">${head}${legend}<div class="chart-plot">` +
    `<svg viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="${esc(label)}" tabindex="0" ${data}>${r.svg}</svg>` +
    `</div></figure>`;
}

const CHARTS = [
  { title: 'Requests', kind: 'columns', keys: ['requests'], names: ['Requests'], fmt: 'count', sub: (w) => WIN[w].unit },
  { title: 'Time to first token', kind: 'line', keys: ['ttft'], names: ['Time to first token'], fmt: 'ms', sub: (w) => WIN[w].avg },
  { title: 'Output speed', kind: 'line', keys: ['tps'], names: ['Output speed'], fmt: 'tps', sub: (w) => `${WIN[w].avg}, tokens per second` },
  { title: 'Latency', kind: 'line', keys: ['latency'], names: ['Latency'], fmt: 'ms', sub: (w) => `${WIN[w].avg}, full reply` },
  { title: 'Input tokens', kind: 'columns', keys: ['fresh', 'cached'], names: ['New input', 'Cache reads'], fmt: 'count', sub: (w) => WIN[w].unit },
  { title: 'Output tokens', kind: 'columns', keys: ['output'], names: ['Output tokens'], fmt: 'count', sub: (w) => WIN[w].unit },
];
const WIN = Object.fromEntries(WINDOWS.map((w) => [w.id, w]));

// ----------------------------------------------------------------- tiles

function delta(cur, prev, upIsGood, label) {
  if (cur == null || prev == null || !(prev > 0)) return '';
  const change = (cur - prev) / prev;
  if (Math.abs(change) < 0.005) return `<span class="delta flat">±0% vs ${esc(label)}</span>`;
  const up = change > 0;
  const tone = upIsGood == null ? 'flat' : up === upIsGood ? 'good' : 'bad';
  const size = trim(Math.abs(change) * 100, Math.abs(change) < 0.1 ? 1 : 0);
  return `<span class="delta ${tone}"><span aria-hidden="true">${up ? '▲' : '▼'}</span> ${up ? '+' : '−'}${size}% vs ${esc(label)}</span>`;
}

function tile(label, value, sub, d) {
  return `<div class="tile"><span class="tile-label">${esc(label)}</span>` +
    `<strong class="tile-value">${esc(value)}</strong>` +
    (sub ? `<span class="tile-sub">${esc(sub)}</span>` : '') + d + '</div>';
}

function tiles(s, w) {
  const c = s.cur;
  const p = s.prev || figures({});
  const pr = w.prev;
  return '<div class="tiles">' + [
    tile('Time to first token', fmt.ms(c.ttft_ms.p50), `median · p95 ${fmt.ms(c.ttft_ms.p95)}`, delta(c.ttft_ms.p50, p.ttft_ms.p50, false, pr)),
    tile('Output speed', fmt.tps(c.tps.p50), `median · average ${fmt.tps(c.tps.avg)}`, delta(c.tps.p50, p.tps.p50, true, pr)),
    tile('Latency', fmt.ms(c.latency_ms.p50), `median full reply · p95 ${fmt.ms(c.latency_ms.p95)}`, delta(c.latency_ms.p50, p.latency_ms.p50, false, pr)),
    tile('Availability', fmt.pct(c.availability, 2), `${fmt.count(c.errors ?? 0)} server errors`, delta(c.availability, p.availability, true, pr)),
    tile('Requests', fmt.compact(c.requests), c.served != null ? `${fmt.count(c.served)} answered` : '', delta(c.requests, p.requests, null, pr)),
    tile('Input tokens', fmt.compact(c.input_tokens), c.avg_input_tokens != null ? `${fmt.count(c.avg_input_tokens)} per request` : '', delta(c.input_tokens, p.input_tokens, null, pr)),
    tile('Output tokens', fmt.compact(c.output_tokens), c.avg_output_tokens != null ? `${fmt.count(c.avg_output_tokens)} per request` : '', delta(c.output_tokens, p.output_tokens, null, pr)),
    tile('Cache rate', fmt.pct(c.cache_rate), c.cached_tokens != null ? `${fmt.compact(c.cached_tokens)} tokens from cache` : '', delta(c.cache_rate, p.cache_rate, true, pr)),
  ].join('') + '</div>';
}

function table(pts, win) {
  const head = ['Period', 'Requests', 'Errors', 'First token', 'Latency', 'Speed', 'Input', 'Cache reads', 'Output'];
  const body = pts.map((p) => '<tr>' + [
    `<th scope="row">${esc(bucketLabel(p, win))}</th>`,
    fmt.count(p.requests), fmt.count(p.errors), fmt.ms(p.ttft), fmt.ms(p.latency), fmt.tps(p.tps),
    fmt.count(p.input), fmt.count(p.cached), fmt.count(p.output),
  ].map((c, i) => (i ? `<td>${esc(c)}</td>` : c)).join('') + '</tr>').join('');
  return `<details class="perf-table"><summary>Show these figures as a table</summary>` +
    `<div class="table-scroll"><table class="table"><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>` +
    `<tbody>${body}</tbody></table></div></details>`;
}

// ---------------------------------------------------------------- render

function modelSection(m) {
  let html = '<h3 class="perf-title">Performance ' +
    WINDOWS.map((w) => `<span data-w="${w.id}">· ${esc(w.short)}</span>`).join('') + '</h3>';
  for (const w of WINDOWS) {
    const s = m.stats[w.id];
    const pts = points(m, w.id).map((p) => ({ ...p, fresh: p.input == null ? null : Math.max(0, p.input - (p.cached || 0)) }));
    html += `<div data-w="${w.id}">`;
    html += s.cur && s.cur.requests != null
      ? tiles(s, w)
      : '<p class="perf-empty">No traffic in this window yet.</p>';
    if (pts.length) {
      html += '<div class="charts">' + CHARTS.map((c) => chart(c, pts, w.id)).join('') + '</div>';
      html += table(pts, w.id);
    }
    html += '</div>';
  }
  return html;
}

function glance(m) {
  const cell = (pick) => WINDOWS.map((w) => {
    const c = m.stats[w.id].cur;
    return `<span data-w="${w.id}">${esc(c ? pick(c) : '—')}</span>`;
  }).join('');
  return {
    ttft: cell((c) => fmt.ms(c.ttft_ms.p50)),
    tps: cell((c) => fmt.tps(c.tps.p50)),
    avail: cell((c) => fmt.pct(c.availability, 2)),
  };
}

function bar(asOf) {
  const radios = WINDOWS.map((w) =>
    `<label class="seg-item"><input type="radio" name="win" id="win-${w.id}" value="${w.id}"${w.id === DEFAULT_WINDOW ? ' checked' : ''}><span>${esc(w.label)}</span></label>`,
  ).join('');
  const when = asOf == null ? '' : `As of <time datetime="${new Date(asOf).toISOString()}">${esc(stamp(asOf))}</time>, updated every hour.`;
  return `<fieldset class="seg"><legend class="seg-legend">Performance window</legend>${radios}</fieldset>` +
    `<p class="perf-asof">${when}</p>`;
}

/**
 * The HTML for each placeholder on /models, from a sanitized snapshot:
 *   bar       the window picker and the as-of time
 *   models    one performance section per model id
 *   glance    the three live cells per model in the at-a-glance table
 */
export function render(view) {
  if (!view || !view.models) return null;
  const models = {};
  const cells = {};
  for (const [id, m] of Object.entries(view.models)) {
    models[id] = modelSection(m);
    cells[id] = glance(m);
  }
  if (!Object.keys(models).length) return null;
  return { bar: bar(view.asOf), models, glance: cells };
}
