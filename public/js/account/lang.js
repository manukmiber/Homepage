// The account area's language. The account pages are one page for both
// languages: the one the visitor chose — the zk_lang cookie, which the EN | ID
// switch on every page of the site keeps (main.js) — and without a choice the
// one the page came in (<html lang>, which the site writes from where the
// visit comes from). `L(en, id)` says one thing in the page's language.
//
// No document (scripts/check-site.mjs renders the pages in Node): English,
// until setLang() says otherwise.

function firstLang() {
  if (typeof document === 'undefined') return 'en';
  const kept = /(?:^|;\s*)zk_lang=(id|en)(?:;|$)/.exec(document.cookie);
  if (kept) return kept[1];
  return document.documentElement.lang === 'id' ? 'id' : 'en';
}

let lang = firstLang();

export const getLang = () => lang;

export function setLang(next) {
  lang = next === 'id' ? 'id' : 'en';
}

export const L = (en, id) => (lang === 'id' ? id : en);

/** Whole numbers, grouped the way the page's language writes them. */
export const num = (n) => Number(n || 0).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US');

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
};

/** A date as "3 Oct 2026" (UTC). */
export function day(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
