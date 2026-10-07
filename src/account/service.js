// The accounts service: where Zeiko Accounts, plans, balances and keys live.
// The Worker asks it server to server, with ACCOUNTS_TOKEN, and the visitor's
// browser never sees its address. Every answer is `{ status, data }`; a
// service that cannot be reached is a 503 with a message of our own.

const TIMEOUT_MS = 15_000;

export function configured(env) {
  return Boolean(env.ACCOUNTS_URL && env.ACCOUNTS_TOKEN && env.SESSION_SECRET && env.SESSION_SECRET.length >= 32);
}

export async function ask(env, method, path, body, clientIp) {
  const url = `${String(env.ACCOUNTS_URL).replace(/\/+$/, '')}/site/v1${path}`;
  const headers = { authorization: `Bearer ${env.ACCOUNTS_TOKEN}`, accept: 'application/json' };
  if (clientIp) headers['x-site-client-ip'] = clientIp;
  if (body !== undefined) headers['content-type'] = 'application/json';
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  } catch {
    return { status: 503, data: null };
  }
}

/** A message fit to show the customer, for an answer that was not a success. */
export function problem(answer) {
  const { status, data } = answer;
  const message = data && data.error && typeof data.error.message === 'string' ? data.error.message : '';
  // The door itself answering "no such path" means it is shut or the token
  // is wrong: a setup problem, not something the customer did.
  const code = data && data.error ? data.error.code : '';
  if (status === 404 && (!code || code === 'not_found')) return UNAVAILABLE;
  if (status >= 500 || !message) return status === 503 || status === 502 ? UNAVAILABLE : FAILED;
  return message;
}

export const UNAVAILABLE = 'Accounts are not available right now. Try again in a few minutes.';
export const FAILED = 'Something went wrong on our side. Try again in a minute.';
