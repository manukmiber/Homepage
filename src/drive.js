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
  },
  id: {
    month: '/bulan',
    largest: (gb) => `File sampai ${gb} per file`,
    members: (n) => `Berbagi dengan sampai ${n} orang`,
    compress: (n) => `${n} kompres foto & video per bulan`,
    pick: 'Pilih',
    best: 'Paling hemat',
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
