// Zeiko Drive on the site: its pages are served by its own Worker through the
// DRIVE service binding, and its plans are drawn into /drive from its catalog.
//
// The catalog is the operator's own (the plans they set), so names come
// through escaped and every other value is a number formatted here. Nothing
// else from the answer reaches the page.

/** Paths that belong to Zeiko Drive, not to this site. */
export function isDrivePath(path) {
  return (
    path === '/dashboard' ||
    path.startsWith('/dashboard/') ||
    path.startsWith('/api/') ||
    path.startsWith('/d/') ||
    path.startsWith('/z/') ||
    path.startsWith('/ad/') ||
    path === '/share-target' ||
    // A shared link: 64 letters and digits, then 32 (the signature).
    /^\/[0-9A-Za-z]{64}\/[0-9A-Za-z]{32}(\/|$)/.test(path)
  );
}

const GIB = 2 ** 30;

const WORDS = {
  en: {
    month: '/month',
    largest: (gb) => `Files up to ${gb} each`,
    members: (n) => `Share with up to ${n} people`,
    compress: (n) => `${n} photo & video compressions a month`,
    pick: 'Choose',
    perGb: (rp) => `${rp} per GB`,
    best: 'Best value',
  },
  id: {
    month: '/bulan',
    largest: (gb) => `File sampai ${gb} per file`,
    members: (n) => `Berbagi dengan sampai ${n} orang`,
    compress: (n) => `${n} kompres foto & video per bulan`,
    pick: 'Pilih',
    perGb: (rp) => `${rp} per GB`,
    best: 'Paling hemat',
  },
};

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const num = (n) => (Number.isFinite(n) ? Math.round(n) : 0);
const rupiah = (n) => `Rp${num(n).toLocaleString('id-ID')}`;
function size(bytes) {
  const gb = num(bytes) / GIB;
  if (gb >= 1024) return `${(gb / 1024).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TB`;
  return `${gb.toLocaleString('id-ID', { maximumFractionDigits: 1 })} GB`;
}

/** Whether a family plan (more than one person) is on sale. */
export function hasFamily(catalog) {
  return Array.isArray(catalog && catalog.plans)
    ? catalog.plans.some((p) => p && p.active !== false && num(p.price_idr) > 0 && num(p.max_members) > 1)
    : false;
}

/** The cheapest plan's monthly price ("Rp1.000"), or null. */
export function cheapest(catalog) {
  const prices = Array.isArray(catalog && catalog.plans)
    ? catalog.plans.map((p) => num(p && p.price_idr)).filter((n) => n > 0)
    : [];
  return prices.length ? rupiah(Math.min(...prices)) : null;
}

/** The plan cards for /drive, or null when the catalog says nothing usable. */
export function renderPlans(catalog, lang = 'en') {
  const w = WORDS[lang] || WORDS.en;
  const plans = Array.isArray(catalog && catalog.plans)
    ? catalog.plans.filter((p) => p && p.active !== false && num(p.price_idr) > 0 && num(p.storage_bytes) > 0)
    : [];
  if (!plans.length) return null;
  const perGb = (p) => num(p.price_idr) / (num(p.storage_bytes) / GIB);
  const best = plans.reduce((a, b) => (perGb(b) < perGb(a) ? b : a));
  const back = '/dashboard/paket';
  return plans
    .map((p) => {
      const facts = [
        num(p.max_file_bytes) ? w.largest(size(p.max_file_bytes)) : null,
        num(p.max_members) > 1 ? w.members(num(p.max_members)) : null,
        num(p.compress_quota) ? w.compress(num(p.compress_quota).toLocaleString('id-ID')) : null,
      ].filter(Boolean);
      return `<article class="plan" id="drive-${esc(String(p.code || '').replace(/[^a-z0-9_-]/gi, ''))}">
  <div class="plan-top"><h4>${esc(p.name)}</h4>${p === best ? `<span class="plan-best">${w.best}</span>` : ''}</div>
  <p class="plan-price">${rupiah(p.price_idr)}<small>${w.month}</small></p>
  <p class="plan-reqs"><strong>${size(p.storage_bytes)}</strong> · ${w.perGb(rupiah(perGb(p)))}</p>
  <ul class="drive-facts">${facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <a class="btn btn-ghost btn-sm" href="${back}">${w.pick}</a>
</article>`;
    })
    .join('\n');
}
