// Zeiko Drive on the site: the app is at its own address, drive.zeiko.biz.id,
// and its plans are drawn into /drive from its catalog (asked through the
// DRIVE service binding).
//
// The catalog is the operator's own (the plans they set), so names come
// through escaped and every other value is a number formatted here. Nothing
// else from the answer reaches the page.

/** Where the app is. */
export const DRIVE_URL = 'https://drive.zeiko.biz.id';

/**
 * /dashboard/… was the app's address on this site, and it is still the way
 * back to it: the account pages (and Google and GitHub sign-in) only ever send
 * a visitor to a page of this site, so Drive's sign-in comes back through
 * /dashboard/masuk. The same path on Drive's own address, or null.
 */
export function driveAddress(url) {
  if (url.pathname !== '/dashboard' && !url.pathname.startsWith('/dashboard/')) return null;
  return `${DRIVE_URL}${url.pathname.slice('/dashboard'.length) || '/'}${url.search}`;
}

const GIB = 2 ** 30;

const WORDS = {
  en: {
    month: '/month',
    largest: (gb) => `Files up to ${gb} each`,
    members: (n) => `Share with up to ${n} people`,
    compress: (n) => `${n} photo & video compressions a month`,
    pick: 'Choose',
    best: 'Best value',
    s3Size: (price, min) => `${price} per GB a month, from ${min} GB`,
    s3Three: (price) => `3 copies in 3 places: ${price} per GB a month`,
    s3Out: (free, price, block) => `${free} of downloads free every month, then ${price} per ${block}`,
    s3OwnBoth: (zeiko, own) => `Your own S3 address: ${zeiko} on a Zeiko subdomain, or ${own} on your own domain, paid once`,
    s3OwnZeiko: (zeiko) => `Your own S3 address on a Zeiko subdomain: ${zeiko}, paid once`,
    s3OwnDomain: (own) => `Zeiko S3 on your own domain: ${own}, paid once`,
  },
  id: {
    month: '/bulan',
    largest: (gb) => `File sampai ${gb} per file`,
    members: (n) => `Berbagi dengan sampai ${n} orang`,
    compress: (n) => `${n} kompres foto & video per bulan`,
    pick: 'Pilih',
    best: 'Paling hemat',
    s3Size: (price, min) => `${price} per GB per bulan, mulai ${min} GB`,
    s3Three: (price) => `3 salinan di 3 lokasi: ${price} per GB per bulan`,
    s3Out: (free, price, block) => `Unduhan gratis ${free} tiap bulan, lalu ${price} per ${block}`,
    s3OwnBoth: (zeiko, own) => `Alamat S3 sendiri: ${zeiko} di subdomain Zeiko, atau ${own} di domainmu sendiri, sekali bayar`,
    s3OwnZeiko: (zeiko) => `Alamat S3 sendiri di subdomain Zeiko: ${zeiko}, sekali bayar`,
    s3OwnDomain: (own) => `Zeiko S3 di domainmu sendiri: ${own}, sekali bayar`,
  },
};

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const num = (n) => (Number.isFinite(n) ? Math.round(n) : 0);

// Drive's catalog names its fields in camelCase (`priceIdr`); older answers
// used snake_case (`price_idr`). Either is read, and only as a number.
const FIELDS = {
  price: ['priceIdr', 'price_idr'],
  storage: ['storageBytes', 'storage_bytes'],
  largest: ['maxFileBytes', 'max_file_bytes'],
  members: ['maxMembers', 'max_members'],
  compress: ['compressQuota', 'compress_quota'],
};
function field(p, name) {
  for (const key of FIELDS[name]) if (p && Number.isFinite(p[key])) return num(p[key]);
  return 0;
}
const rupiah = (n) => `Rp${num(n).toLocaleString('id-ID')}`;
function size(bytes) {
  const gb = num(bytes) / GIB;
  if (gb >= 1024) return `${(gb / 1024).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TB`;
  return `${gb.toLocaleString('id-ID', { maximumFractionDigits: 1 })} GB`;
}

/** Whether a family plan (more than one person) is on sale. */
export function hasFamily(catalog) {
  return Array.isArray(catalog && catalog.plans)
    ? catalog.plans.some((p) => p && p.active !== false && field(p, 'price') > 0 && field(p, 'members') > 1)
    : false;
}

/** The cheapest plan's monthly price ("Rp1.000"), or null. */
export function cheapest(catalog) {
  const prices = Array.isArray(catalog && catalog.plans)
    ? catalog.plans.map((p) => field(p, 'price')).filter((n) => n > 0)
    : [];
  return prices.length ? rupiah(Math.min(...prices)) : null;
}

/** The plan cards for /drive, or null when the catalog says nothing usable. */
export function renderPlans(catalog, lang = 'en') {
  const w = WORDS[lang] || WORDS.en;
  const plans = Array.isArray(catalog && catalog.plans)
    ? catalog.plans.filter((p) => p && p.active !== false && field(p, 'price') > 0 && field(p, 'storage') > 0)
    : [];
  if (!plans.length) return null;
  const perGb = (p) => field(p, 'price') / (field(p, 'storage') / GIB);
  const best = plans.reduce((a, b) => (perGb(b) < perGb(a) ? b : a));
  const back = `${DRIVE_URL}/paket`;
  return plans
    .map((p) => {
      const facts = [
        field(p, 'largest') ? w.largest(size(field(p, 'largest'))) : null,
        field(p, 'members') > 1 ? w.members(field(p, 'members')) : null,
        field(p, 'compress') ? w.compress(field(p, 'compress').toLocaleString('id-ID')) : null,
      ].filter(Boolean);
      return `<article class="plan" id="drive-${esc(String(p.code || '').replace(/[^a-z0-9_-]/gi, ''))}">
  <div class="plan-top"><h4>${esc(p.name)}</h4>${p === best ? `<span class="plan-best">${w.best}</span>` : ''}</div>
  <p class="plan-price">${rupiah(field(p, 'price'))}<small>${w.month}</small></p>
  <p class="plan-reqs"><strong>${size(field(p, 'storage'))}</strong></p>
  <ul class="drive-facts">${facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <a class="btn btn-ghost btn-sm" href="${back}">${w.pick}</a>
</article>`;
    })
    .join('\n');
}

/**
 * Zeiko S3's lines for the homepage and /drive (`[data-s3-facts]`), or null
 * while Zeiko S3 is not open: then every `[data-s3]` stays hidden. Each line
 * is shown only once Drive says that part works (`capabilities`), and only
 * numbers are read from the catalog.
 */
export function renderS3(catalog, lang = 'en') {
  const w = WORDS[lang] || WORDS.en;
  const can = (catalog && catalog.capabilities) || {};
  const cfg = (catalog && catalog.config) || {};
  const n = (key) => (Number.isFinite(cfg[key]) ? num(cfg[key]) : 0);
  if (can.s3 !== true || !n('s3_price_idr_per_gb_month') || !n('s3_min_gb')) return null;
  const lines = [w.s3Size(rupiah(n('s3_price_idr_per_gb_month')), n('s3_min_gb'))];
  if (can.s3ThreeCopies === true && n('s3_price_idr_per_gb_month_3x')) {
    lines.push(w.s3Three(rupiah(n('s3_price_idr_per_gb_month_3x'))));
  }
  if (n('s3_egress_free_bytes') && n('s3_egress_block_bytes') && n('s3_egress_block_idr')) {
    lines.push(w.s3Out(size(n('s3_egress_free_bytes')), rupiah(n('s3_egress_block_idr')), size(n('s3_egress_block_bytes'))));
  }
  const zeiko = can.s3UrlZeiko === true ? n('s3_url_zeiko_idr') : 0;
  const own = can.s3UrlCustom === true ? n('s3_url_custom_idr') : 0;
  if (zeiko && own) lines.push(w.s3OwnBoth(rupiah(zeiko), rupiah(own)));
  else if (zeiko) lines.push(w.s3OwnZeiko(rupiah(zeiko)));
  else if (own) lines.push(w.s3OwnDomain(rupiah(own)));
  return lines.map((l) => `<li>${esc(l)}</li>`).join('');
}

// Drive's catalog, asked at most once a minute per isolate: the homepage
// draws Zeiko S3 from it on every visit.
let kept = { at: 0, catalog: null };
export async function driveCatalog(env, base, now = Date.now()) {
  if (!env.DRIVE) return null;
  if (kept.catalog && now - kept.at < 60_000) return kept.catalog;
  try {
    const res = await env.DRIVE.fetch(new Request(new URL('/api/public/catalog', base)));
    if (!res.ok) return null;
    kept = { at: now, catalog: await res.json() };
    return kept.catalog;
  } catch {
    return null;
  }
}
