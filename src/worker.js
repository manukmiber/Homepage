// The only code that runs on the server side of the site.
//
// `run_worker_first` in wrangler.jsonc sends /models, /drive and /account
// here; every other path that is a plain file never reaches this code. A
// path that is no file at all does, and is either Zeiko Drive's or the
// site's 404 page.
//
// Zeiko Drive (/dashboard, its /api, downloads and shared links) is its own
// Worker, reached through the DRIVE service binding: this code only hands
// the request over. Without the binding, /dashboard says Drive is not open
// yet. /drive (and /id/drive) is a plain page whose plan cards are drawn
// here from Drive's own catalog (src/drive.js), so a price changed there
// shows here without touching the page.
//
// /account and every page under it is one plain file,
// public/account/index.html: the visitor's browser signs in with the account
// door itself (public/js/account/), so nothing here knows who anyone is and
// this code holds no secret. It only hands every account address the same
// page, so a link to /account/plans or /account/reset?token=… opens.
//
// For /models, the static page is fetched as usual and the latest hourly
// snapshot in R2 is rendered into its placeholders (see src/render.js). The
// visitor's browser only ever receives finished HTML: no data file, no script
// fetching one. If the snapshot is missing or unreadable, the static page
// goes out as is, with its "not available right now" notes.

import { render, sanitize } from './render.js';
import { cheapest, hasFamily, isDrivePath, renderPlans } from './drive.js';

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

/** The site's own 404 page, for a path that is neither a file nor Drive's. */
async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
  return new Response(page.body, { status: 404, headers: page.headers });
}

/** /dashboard before Drive is connected: the product page says what it is. */
function driveClosed(request) {
  const id = (request.headers.get('cookie') || '').includes('zk_lang=id');
  return Response.redirect(new URL(id ? '/id/drive' : '/drive', request.url).toString(), 302);
}

/** /drive and /id/drive, with the plan cards from Drive's catalog. */
async function drivePage(request, env, lang) {
  const page = await env.ASSETS.fetch(request);
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html') || !env.DRIVE) return page;
  let cards = null;
  let from = null;
  let family = false;
  try {
    const res = await env.DRIVE.fetch(new Request(new URL('/api/public/catalog', request.url)));
    if (res.ok) {
      const catalog = await res.json();
      cards = renderPlans(catalog, lang);
      from = cheapest(catalog);
      family = hasFamily(catalog);
    }
  } catch {
    cards = null;
  }
  if (!cards) return page;
  const out = new HTMLRewriter()
    .on('[data-drive-plans]', {
      element(el) {
        el.setInnerContent(cards, { html: true });
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
    if (isDrivePath(url.pathname)) {
      if (env.DRIVE) return env.DRIVE.fetch(request);
      if (url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/')) return driveClosed(request);
      return notFound(request, env);
    }
    if (url.pathname === '/account' || url.pathname.startsWith('/account/')) {
      return accountShell(request, env);
    }
    if (url.pathname === '/drive') return drivePage(request, env, 'en');
    if (url.pathname === '/id/drive') return drivePage(request, env, 'id');
    if (url.pathname !== '/models') {
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

    const view = await load(env);
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

async function load(env) {
  try {
    if (!env.MODELS) return null;
    const object = await env.MODELS.get(OBJECT);
    if (!object) return null;
    return render(sanitize(await object.json()));
  } catch {
    return null;
  }
}
