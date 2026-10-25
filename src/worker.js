// The only code that runs on the server side of the site.
//
// `run_worker_first` in wrangler.jsonc sends /models, /drive and /account
// (and /id/models, /id/drive) here; every other path that is a plain file
// never reaches this code. A path that is no file at all does, and is either
// the way back to Zeiko Drive (/dashboard…) or the site's 404 page, in
// Indonesian under /id/ or for a visitor who chose it (the zk_lang cookie).
//
// Zeiko Drive is its own Worker at its own address, drive.zeiko.biz.id.
// /dashboard/… (its old address here) sends the visitor there, the same path
// after it. /drive (and /id/drive) is a plain page whose plan cards are drawn
// here from Drive's own catalog (src/drive.js, through the DRIVE service
// binding), so a price changed there shows here without touching the page.
//
// /account and every page under it is one plain file,
// public/account/index.html: the visitor's browser signs in with the account
// door itself (public/js/account/), so nothing here knows who anyone is and
// this code holds no secret. It only hands every account address the same
// page, so a link to /account/plans or /account/reset?token=… opens.
//
// For /models (and /id/models), the static page is fetched as usual and the
// latest hourly snapshot in R2 is rendered into its placeholders, in the
// page's language (see src/render.js). The
// visitor's browser only ever receives finished HTML: no data file, no script
// fetching one. If the snapshot is missing or unreadable, the static page
// goes out as is, with its "not available right now" notes.

import { render, sanitize } from './render.js';
import { cheapest, driveAddress, driveCatalog, hasFamily, renderPlans, renderS3 } from './drive.js';

/** The account page, whatever account address was asked for. */
async function accountShell(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const page = await env.ASSETS.fetch(new Request(new URL('/account/', url), { method: request.method }));
  const headers = new Headers(page.headers);
  headers.set('cache-control', 'no-store');
  headers.set('x-frame-options', 'DENY');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'same-origin');
  return new Response(page.body, { status: page.status, headers });
}

const OBJECT = 'models.json';

/** The language a visitor reads: /id/… is Indonesian, elsewhere their zk_lang choice. */
function langOf(request, url) {
  if (url.pathname === '/id' || url.pathname.startsWith('/id/')) return 'id';
  return /(?:^|;\s*)zk_lang=id(?:;|$)/.test(request.headers.get('cookie') || '') ? 'id' : 'en';
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

/** / and /id/: the homepage as written, with Zeiko S3 shown once it is open. */
async function homePage(request, env, lang) {
  const page = await env.ASSETS.fetch(request);
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html')) return page;
  const catalog = await driveCatalog(env, request.url);
  const s3 = catalog ? renderS3(catalog, lang) : null;
  if (!s3) return page;
  const out = s3Shown(new HTMLRewriter(), s3).transform(page);
  const headers = new Headers(out.headers);
  headers.delete('etag');
  headers.delete('last-modified');
  headers.set('cache-control', 'public, max-age=60');
  return new Response(out.body, { status: out.status, headers });
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
  const out = s3Shown(new HTMLRewriter(), s3)
    .on('[data-drive-plans]', {
      element(el) {
        if (cards) el.setInnerContent(cards, { html: true });
      },
    })
    .on('[data-drive-from]', {
      element(el) {
        if (from) {
          el.setInnerContent(from);
          el.removeAttribute('hidden');
        }
      },
    })
    .on('[data-drive-from-note]', {
      element(el) {
        if (from) el.removeAttribute('hidden');
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const drive = driveAddress(url);
    if (drive) return Response.redirect(drive, 302);
    if (url.pathname === '/account' || url.pathname.startsWith('/account/')) {
      return accountShell(request, env);
    }
    if (url.pathname === '/') return homePage(request, env, 'en');
    if (url.pathname === '/id' || url.pathname === '/id/') return homePage(request, env, 'id');
    if (url.pathname === '/drive') return drivePage(request, env, 'en');
    if (url.pathname === '/id/drive') return drivePage(request, env, 'id');
    const lang = url.pathname === '/id/models' ? 'id' : 'en';
    if (url.pathname !== '/models' && url.pathname !== '/id/models') {
      const res = await env.ASSETS.fetch(request);
      return res.status === 404 ? notFound(request, env) : res;
    }

    // The page is rewritten every hour, so the static file's validators no
    // longer describe what goes out. Ask for the whole file every time.
    const plain = new Request(request);
    plain.headers.delete('if-none-match');
    plain.headers.delete('if-modified-since');
    const page = await env.ASSETS.fetch(plain);
    if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html')) return page;

    const view = await load(env, lang);
    if (!view) return page;

    const out = new HTMLRewriter()
      .on('[data-perf-bar]', {
        element(el) {
          el.setInnerContent(view.bar, { html: true });
          el.removeAttribute('hidden');
        },
      })
      .on('[data-perf]', {
        element(el) {
          const html = view.models[el.getAttribute('data-perf')];
          if (html) el.setInnerContent(html, { html: true });
        },
      })
      .on('[data-stat]', {
        element(el) {
          const [id, key] = (el.getAttribute('data-stat') || '').split(':');
          const html = view.glance[id] && view.glance[id][key];
          if (html) el.setInnerContent(html, { html: true });
        },
      })
      .transform(page);

    const headers = new Headers(out.headers);
    headers.delete('etag');
    headers.delete('last-modified');
    headers.set('cache-control', 'public, max-age=300');
    return new Response(out.body, { status: out.status, headers });
  },
};

async function load(env, lang) {
  try {
    if (!env.MODELS) return null;
    const object = await env.MODELS.get(OBJECT);
    if (!object) return null;
    return render(sanitize(await object.json()), lang);
  } catch {
    return null;
  }
}
