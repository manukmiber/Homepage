// Turns the status document into /status (and /id/status).
//
// The same rule as src/render.js: this file is the only door between the
// document and the page, and it reads ids and numbers and nothing else. A
// service is named here, from a fixed list (SERVICES); an id this file does
// not know is not drawn, and no string from the document reaches the page.
//
// Pure functions only, so scripts/check-site.mjs runs it in Node and scans
// what it would put on the page.

/** The services the page knows, in the order it lists them. */
export const SERVICES = ['website', 'account', 'api', 'chat', 'drive', 's3', 'hosting', 'vps', 'sites'];

const TEXT = {
  en: {
    names: {
      website: 'Website',
      account: 'Zeiko Account sign-in',
      api: 'ZeikoAI API',
      chat: 'Zeiko Chat',
      drive: 'Zeiko Drive',
      s3: 'Zeiko S3',
      hosting: 'Zeiko Hosting',
      vps: 'Zeiko VPS',
      sites: 'Static sites',
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    point: '.',
    up: 'Up',
    down: 'Not answering',
    unknown: 'Not checked',
    allUp: 'Everything is answering.',
    someDown: (n) => `${n} service${n === 1 ? ' is' : 's are'} not answering.`,
    checked: (t, every) => `Checked ${t} (WIB), every ${every} minute${every === 1 ? '' : 's'}.`,
    stale: (t) => `Not checked since ${t} (WIB): the states below are from then.`,
    answered: (ms) => `answered in ${ms} ms`,
    since: (t) => `since ${t}`,
    w24: '24 hours',
    w7: '7 days',
    w30: '30 days',
    none: '—',
    days: 'The last 30 days, one bar a day',
    day: (d, v) => `${d}: ${v}`,
    noData: 'no checks',
  },
  id: {
    names: {
      website: 'Website',
      account: 'Masuk Akun Zeiko',
      api: 'API ZeikoAI',
      chat: 'Zeiko Chat',
      drive: 'Zeiko Drive',
      s3: 'Zeiko S3',
      hosting: 'Zeiko Hosting',
      vps: 'Zeiko VPS',
      sites: 'Situs statis',
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    point: ',',
    up: 'Normal',
    down: 'Tidak menjawab',
    unknown: 'Belum dicek',
    allUp: 'Semua layanan menjawab.',
    someDown: (n) => `${n} layanan tidak menjawab.`,
    checked: (t, every) => `Dicek ${t} WIB, setiap ${every} menit.`,
    stale: (t) => `Belum dicek lagi sejak ${t} WIB: keadaan di bawah dari saat itu.`,
    answered: (ms) => `menjawab dalam ${ms} md`,
    since: (t) => `sejak ${t}`,
    w24: '24 jam',
    w7: '7 hari',
    w30: '30 hari',
    none: '—',
    days: '30 hari terakhir, satu batang per hari',
    day: (d, v) => `${d}: ${v}`,
    noData: 'belum ada cek',
  },
};

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const WIB = 7 * 3_600_000;

/** Only what the page draws: known ids, booleans and numbers. */
export function sanitizeStatus(doc) {
  if (!doc || typeof doc !== 'object' || doc.format !== 1) return null;
  const services = (Array.isArray(doc.services) ? doc.services : [])
    .filter((s) => s && SERVICES.includes(s.id))
    .map((s) => ({
      id: SERVICES[SERVICES.indexOf(s.id)],
      up: s.up === true ? true : s.up === false ? false : null,
      ms: num(s.ms),
      since: num(s.since),
      uptime: {
        '24h': num(s.uptime && s.uptime['24h']),
        '7d': num(s.uptime && s.uptime['7d']),
        '30d': num(s.uptime && s.uptime['30d']),
      },
      days: (Array.isArray(s.days) ? s.days : []).slice(-30).map((d) => ({ day: num(d && d.day), uptime: num(d && d.uptime) })),
    }))
    .sort((a, b) => SERVICES.indexOf(a.id) - SERVICES.indexOf(b.id));
  const checkedAt = num(doc.checkedAt);
  const every = num(doc.everyMinutes);
  if (!checkedAt) return null;
  return { checkedAt, everyMinutes: every && every >= 1 && every <= 60 ? Math.round(every) : 5, services };
}

function stamp(t, T) {
  const d = new Date(t + WIB);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCDate()} ${T.months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}.${pad(d.getUTCMinutes())}`;
}

function dayLabel(t, T) {
  const d = new Date(t + WIB);
  return `${d.getUTCDate()} ${T.months[d.getUTCMonth()]}`;
}

function pct(v, T) {
  if (v === null) return T.none;
  const text = v >= 99.995 ? '100' : v.toFixed(2);
  return `${text.replace('.', T.point)}%`;
}

/** The last 30 days as bars: full, a little short, or well short of 100%. */
function bars(days, T) {
  const w = 4;
  const gap = 1;
  const parts = days.map((d, i) => {
    const tone = d.uptime === null ? 'none' : d.uptime >= 99.9 ? 'ok' : d.uptime >= 95 ? 'warn' : 'bad';
    const title = T.day(d.day ? dayLabel(d.day, T) : T.none, d.uptime === null ? T.noData : pct(d.uptime, T));
    return `<rect class="sd sd-${tone}" x="${i * (w + gap)}" y="0" width="${w}" height="16"><title>${title}</title></rect>`;
  });
  const width = Math.max(1, days.length * (w + gap) - gap);
  return `<svg class="status-days" viewBox="0 0 ${width} 16" preserveAspectRatio="none" role="img" aria-label="${T.days}">${parts.join('')}</svg>`;
}

/**
 * The page's two placeholders: `summary` (one line above the list) and `list`
 * (a row per service). `now` decides whether the document is stale: three
 * rounds and ten minutes late.
 */
export function renderStatus(raw, lang, now) {
  const T = TEXT[lang] || TEXT.en;
  const doc = sanitizeStatus(raw);
  if (!doc) return null;
  const stale = now - doc.checkedAt > doc.everyMinutes * 3 * 60_000 + 10 * 60_000;
  const down = doc.services.filter((s) => s.up === false).length;
  const summary = stale
    ? `<p class="status-summary status-stale">${T.stale(stamp(doc.checkedAt, T))}</p>`
    : `<p class="status-summary ${down ? 'status-bad' : 'status-good'}"><strong>${down ? T.someDown(down) : T.allUp}</strong> ${T.checked(stamp(doc.checkedAt, T), doc.everyMinutes)}</p>`;
  const rows = doc.services.map((s) => {
    const [label, tone] = s.up === true ? [T.up, 'ok'] : s.up === false ? [T.down, 'err'] : [T.unknown, ''];
    const meta = [s.up === true && s.ms !== null ? T.answered(Math.round(s.ms)) : '', s.since ? T.since(stamp(s.since, T)) : ''].filter(Boolean).join(' · ');
    return `<article class="status-row">
      <div class="status-head"><h3>${T.names[s.id]}</h3><span class="tag tag-${tone}">${label}</span></div>
      ${meta ? `<p class="status-meta">${meta}</p>` : ''}
      <dl class="status-up">
        <div><dt>${T.w24}</dt><dd>${pct(s.uptime['24h'], T)}</dd></div>
        <div><dt>${T.w7}</dt><dd>${pct(s.uptime['7d'], T)}</dd></div>
        <div><dt>${T.w30}</dt><dd>${pct(s.uptime['30d'], T)}</dd></div>
      </dl>
      ${s.days.length ? bars(s.days, T) : ''}
    </article>`;
  });
  return { summary, list: rows.join('\n') };
}
