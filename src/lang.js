// The language a visitor reads when the address does not say which.
//
// Their own choice always wins: the zk_lang cookie, which the EN | ID switch
// keeps for the whole domain (public/js/main.js). Without one, the country
// Cloudflare says the visit comes from: Indonesia reads Indonesian, every
// other country English, and so does a visit Cloudflare cannot place (XX,
// T1, or no country at all).
//
// Pure functions, so scripts/check-site.mjs can try every case in Node.

/** The visitor's own choice, 'id' or 'en', or null when they made none. */
export function chosenLang(cookie) {
  const m = /(?:^|;\s*)zk_lang=(id|en)(?:;|$)/.exec(cookie || '');
  return m ? m[1] : null;
}

/** Their choice, else their country's language. */
export function visitorLang(cookie, country) {
  return chosenLang(cookie) || (country === 'ID' ? 'id' : 'en');
}

/**
 * Where an English page sends a visitor from Indonesia who has chosen
 * nothing: the same address under /id/ (`/hosting` → `/id/hosting`, `/` →
 * `/id/`). null answers the page as asked:
 *
 * - a visitor who chose a language, or comes from anywhere else;
 * - an address already under /id/ (an Indonesian link opened abroad stays
 *   Indonesian), or the account area (one page for both languages);
 * - anything but GET or HEAD;
 * - a visitor who came from a page of this site: they followed a link here,
 *   the EN switch among them, and keep what they asked for even when no
 *   script could keep the choice (JavaScript off, cookies blocked).
 *
 * Whether the twin exists is the caller's to ask.
 */
export function twinFor({ method, url, cookie, country, referer }) {
  if (method !== 'GET' && method !== 'HEAD') return null;
  if (chosenLang(cookie) || country !== 'ID') return null;
  const path = url.pathname;
  if (path === '/id' || path.startsWith('/id/')) return null;
  if (path === '/account' || path.startsWith('/account/')) return null;
  if (referer) {
    try {
      if (new URL(referer).origin === url.origin) return null;
    } catch {
      // Not an address: as if there were none.
    }
  }
  return `/id${path}`;
}
