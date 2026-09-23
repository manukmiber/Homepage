/* ZeikoAI site — the only code that runs on the server side.
 *
 * Everything under public/ is served straight from static assets and never
 * reaches this file. `run_worker_first` in wrangler.jsonc sends exactly two
 * kinds of path here:
 *
 *   /data/models.json   the hourly model snapshot, read out of R2
 *   /models/<id>        one model's page — the same models.html as /models,
 *                       which reads the id from the URL itself
 *
 * The relay pushes models.json into the bucket once an hour. This site never
 * talks to the relay: if the relay is asleep, the page shows the last hour it
 * managed to publish.
 */

const OBJECT = 'models.json';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/data/models.json') {
      return snapshot(request, env);
    }

    if (url.pathname === '/models/' || url.pathname === '/models/index.html') {
      return Response.redirect(new URL('/models', url), 308);
    }

    if (url.pathname.startsWith('/models/')) {
      // One page renders every model; the id is read client-side from the path.
      const page = await env.ASSETS.fetch(new Request(new URL('/models', url), request));
      return new Response(page.body, page);
    }

    return env.ASSETS.fetch(request);
  },
};

async function snapshot(request, env) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json({ error: 'method not allowed' }, 405, { allow: 'GET, HEAD' });
  }
  if (!env.MODELS) {
    return json({ error: 'the models bucket is not bound to this worker' }, 503);
  }

  const object = await env.MODELS.get(OBJECT, {
    onlyIf: request.headers,
  });
  if (!object) {
    // Nothing published yet: the page says so rather than showing an error.
    return json({ error: 'no snapshot has been published yet' }, 404, { 'cache-control': 'no-store' });
  }

  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    // An hourly document: five minutes fresh, and served stale while the
    // browser checks again, so a reload is never a wait.
    'cache-control': 'public, max-age=300, stale-while-revalidate=3600',
    etag: object.httpEtag,
    'x-content-type-options': 'nosniff',
  });
  if (object.uploaded) headers.set('last-modified', object.uploaded.toUTCString());

  // `onlyIf` answered with metadata only: the caller's copy is current.
  if (!('body' in object) || request.method === 'HEAD') {
    const status = 'body' in object ? 200 : 304;
    return new Response(null, { status, headers });
  }
  return new Response(object.body, { headers });
}

function json(body, status, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...extra },
  });
}
