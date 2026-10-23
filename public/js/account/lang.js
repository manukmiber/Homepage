// The account area's language. The account pages are one page for both
// languages: Indonesian when the visitor chose it — the zk_lang cookie, which
// the EN | ID switch on every page of the site keeps (main.js) — English
// otherwise. `L(en, id)` says one thing in the page's language.
//
// No document (scripts/check-site.mjs renders the pages in Node): English,
// until setLang() says otherwise.

let lang = typeof document !== 'undefined' && /(?:^|;\s*)zk_lang=id(?:;|$)/.test(document.cookie) ? 'id' : 'en';

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
