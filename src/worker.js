// The only code that runs on the server side of the site.
//
// `run_worker_first` in wrangler.jsonc sends /models and /account here;
// every other path is a plain file and never reaches this code.
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/account' || url.pathname.startsWith('/account/')) {
      return accountShell(request, env);
    }
    if (url.pathname !== '/models') return env.ASSETS.fetch(request);

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
