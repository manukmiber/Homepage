// Signed values for the account area: the session cookie, the sign-in state
// for Google and GitHub, and the links in emails. HMAC-SHA-256 over a JSON
// payload with Web Crypto; nothing here is stored anywhere, so a value is
// good exactly as long as its signature and its `exp` say.

const enc = new TextEncoder();
const keys = new Map();

function key(secret) {
  if (!keys.has(secret)) {
    keys.set(
      secret,
      crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    );
  }
  return keys.get(secret);
}

export function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromB64url(text) {
  const s = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function randomToken(bytes = 18) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** Compare two strings without stopping at the first difference. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function mac(secret, purpose, body) {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(`${purpose}.${body}`));
  return b64url(new Uint8Array(sig));
}

/** `payload` signed for one purpose, good for `ttlMs`. */
export async function seal(secret, purpose, payload, ttlMs) {
  const body = b64url(enc.encode(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })));
  return `${body}.${await mac(secret, purpose, body)}`;
}

/** The payload, or null when the value was not signed by us for this purpose or has expired. */
export async function open(secret, purpose, value) {
  if (typeof value !== 'string' || value.length > 4096) return null;
  const dot = value.indexOf('.');
  if (dot < 1) return null;
  const body = value.slice(0, dot);
  if (!safeEqual(await mac(secret, purpose, body), value.slice(dot + 1))) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body)));
    if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
