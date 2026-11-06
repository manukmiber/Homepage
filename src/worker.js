// The only code that runs on the server side of the site.
//
// `run_worker_first` in wrangler.jsonc sends the homepage, /drive, /status and
// /account (and /id/, /id/drive, /id/status) here, and every other English
// page with an Indonesian twin (/hosting, /vps, /sites, /docs…); the other
// pages under /id/ and the site's own files (css, js, img, fonts) never reach
// this code. A path that is no file at all does, and is either the way back to
// Zeiko Drive (/dashboard…) or the site's 404 page.
// Old addresses (/models, the AI docs) are sent on by public/_redirects.
//
// A visitor from Indonesia who has not chosen a language is sent from an
// English page to its Indonesian twin (src/lang.js); the 404 page and the
// account page are drawn in the same language. Their own choice (the zk_lang
// cookie) always wins.
//
// Zeiko Drive is its own Worker at its own address, drive.zeiko.biz.id.
// /dashboard/… (its old address here) sends the visitor there, the same path
// after it. /drive (and /id/drive) is a plain page whose plan cards are drawn
// here from Drive's own catalog (src/drive.js, through the DRIVE service
// binding), so a price changed there shows here without touching the page;
// the homepage takes Drive's lowest price from the same catalog.
//
// /account and every page under it is one plain file,
// public/account/index.html: the visitor's browser signs in with the account
// door itself (public/js/account/), so nothing here knows who anyone is and
// this code holds no secret. It only hands every account address the same
// page, so a link to /account/plans or /account/reset?token=… opens.
//
// The visitor's browser only ever receives finished HTML: no data file, no
// script fetching one.

import { renderStatus } from './status.js';
import { cheapest, driveAddress, driveCatalog, hasFamily, renderPlans, renderS3 } from './drive.js';
import { twinFor, visitorLang } from './lang.js';

/** The country Cloudflare says the visit comes from (two letters), if any. */
const countryOf = (request) => request.cf?.country;

/** The account page, whatever account address was asked for, its <html lang>
 * the visitor's language: public/js/account/lang.js reads it when no choice
 * is kept. */
async function accountShell(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const lang = visitorLang(request.headers.get('cookie'), countryOf(request));
  const plain = await env.ASSETS.fetch(new Request(new URL('/account/', url), { method: request.method }));
  const page =
    request.method === 'GET'
      ? new HTMLRewriter()
          .on('html', {
            element(el) {
              el.setAttribute('lang', lang);
            },
          })
          .transform(plain)
      : plain;
  const headers = new Headers(page.headers);
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'no-store');
  headers.set('x-frame-options', 'DENY');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'same-origin');
  return new Response(page.body, { status: page.status, headers });
}

/** The language a visitor reads: /id/… is Indonesian, elsewhere their zk_lang
 * choice, else their country's (src/lang.js). */
function langOf(request, url) {
  if (url.pathname === '/id' || url.pathname.startsWith('/id/')) return 'id';
  return visitorLang(request.headers.get('cookie'), countryOf(request));
}

/** A visitor from Indonesia who has chosen nothing, on an English page with
 * an Indonesian twin: sent there (302), the query kept. The answer is this
 * visitor's alone, so it is never cached; no cookie is written, since being
 * sent is not a choice (an Indonesian page keeps one itself, main.js). */
async function toTwin(request, env, url) {
  const twin = twinFor({
    method: request.method,
    url,
    cookie: request.headers.get('cookie'),
    country: countryOf(request),
    referer: request.headers.get('referer'),
  });
  if (!twin) return null;
  const page = await env.ASSETS.fetch(new Request(new URL(twin, url), { method: 'HEAD' }));
  if (page.status !== 200) return null;
  return new Response(null, {
    status: 302,
    headers: { location: new URL(twin + url.search, url).href, 'cache-control': 'private, no-store' },
  });
}

/** The site's own 404 page, for a path that is neither a file nor Drive's. */
async function notFound(request, env) {
  const url = new URL(request.url);
  const path = langOf(request, url) === 'id' ? '/id/404.html' : '/404.html';
  const page = await env.ASSETS.fetch(new Request(new URL(path, url)));
  const headers = new Headers(page.headers);
  headers.append('vary', 'cookie');
  return new Response(page.body, { status: 404, headers });
}

/** Zeiko S3's blocks (`[data-s3]`, hidden in the files) shown and filled, once it is open. */
function s3Shown(rewriter, facts) {
  if (!facts) return rewriter;
  return rewriter
    .on('[data-s3]', {
      element(el) {
        el.removeAttribute('hidden');
      },
    })
    .on('[data-s3-facts]', {
      element(el) {
        el.setInnerContent(facts, { html: true });
      },
    });
}

/** / and /id/: the homepage as written, with Drive's lowest price from its
 * catalog and Zeiko S3 shown once it is open. */
async function homePage(request, env, lang) {
  const page = await env.ASSETS.fetch(request);
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html')) return page;
  const catalog = await driveCatalog(env, request.url);
  const s3 = catalog ? renderS3(catalog, lang) : null;
  const from = catalog ? cheapest(catalog) : null;
  if (!s3 && !from) return page;
  const out = driveFrom(s3Shown(new HTMLRewriter(), s3), from).transform(page);
  const headers = new Headers(out.headers);
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'public, max-age=60');
  return new Response(out.body, { status: out.status, headers });
}

/** Drive's lowest price where a page asks for it (`[data-drive-from]`), and
 * its note shown in place of the plain words (`[data-drive-plain]`). */
function driveFrom(rewriter, from) {
  if (!from) return rewriter;
  return rewriter
    .on('[data-drive-from]', {
      element(el) {
        el.setInnerContent(from);
        el.removeAttribute('hidden');
      },
    })
    .on('[data-drive-from-note]', {
      element(el) {
        el.removeAttribute('hidden');
      },
    })
    .on('[data-drive-plain]', {
      element(el) {
        el.setAttribute('hidden', '');
      },
    });
}

/** /drive and /id/drive, with the plan cards from Drive's catalog. */
async function drivePage(request, env, lang) {
  const page = await env.ASSETS.fetch(request);
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html') || !env.DRIVE) return page;
  const catalog = await driveCatalog(env, request.url);
  const cards = catalog ? renderPlans(catalog, lang) : null;
  const from = catalog ? cheapest(catalog) : null;
  const family = catalog ? hasFamily(catalog) : false;
  const s3 = catalog ? renderS3(catalog, lang) : null;
  if (!cards && !s3) return page;
  const out = driveFrom(s3Shown(new HTMLRewriter(), s3), from)
    .on('[data-drive-plans]', {
      element(el) {
        if (cards) el.setInnerContent(cards, { html: true });
      },
    })
    .on('[data-drive-family]', {
      element(el) {
        if (family) el.removeAttribute('hidden');
      },
    })
    .transform(page);
  const headers = new Headers(out.headers);
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'public, max-age=60');
  return new Response(out.body, { status: out.status, headers });
}

/** /status and /id/status: each service's state, from the status document
 * in the same bucket as the model snapshot (src/status.js draws it). Without
 * it the page goes out as written: "not available right now". */
async function statusPage(request, env, lang) {
  const plain = new Request(request);
  plain.headers.delete('if-none-match');
  plain.headers.delete('if-modified-since');
  const page = await env.ASSETS.fetch(plain);
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html')) return page;
  let view = null;
  try {
    const object = env.MODELS ? await env.MODELS.get('status.json') : null;
    if (object) view = renderStatus(JSON.parse(await object.text()), lang, Date.now());
  } catch {
    view = null;
  }
  if (!view) return page;
  const out = new HTMLRewriter()
    .on('[data-status-summary]', {
      element(el) {
        el.setInnerContent(view.summary, { html: true });
      },
    })
    .on('[data-status-list]', {
      element(el) {
        el.setInnerContent(view.list, { html: true });
      },
    })
    .transform(page);
  const headers = new Headers(out.headers);
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'public, max-age=60');
  return new Response(out.body, { status: out.status, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const drive = driveAddress(url);
    if (drive) return Response.redirect(drive, 302);
    const twin = await toTwin(request, env, url);
    if (twin) return twin;
    if (url.pathname === '/account' || url.pathname.startsWith('/account/')) {
      return accountShell(request, env);
    }
    if (url.pathname === '/') return homePage(request, env, 'en');
    if (url.pathname === '/id' || url.pathname === '/id/') return homePage(request, env, 'id');
    if (url.pathname === '/drive') return drivePage(request, env, 'en');
    if (url.pathname === '/id/drive') return drivePage(request, env, 'id');
    if (url.pathname === '/status') return statusPage(request, env, 'en');
    if (url.pathname === '/id/status') return statusPage(request, env, 'id');
    const res = await env.ASSETS.fetch(request);
    return res.status === 404 ? notFound(request, env) : res;
  },
};

