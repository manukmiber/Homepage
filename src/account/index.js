// Zeiko Accounts: everything under /account. One account for ZeikoAI and
// Zeiko Chat: sign up and sign in (email and password, Google, GitHub), and
// the customer's own area: plan, requests left, the one balance, payments,
// key and settings. Confirmation and reset emails are Zeiko Chat's own.
//
// Nothing is kept here. The session is a signed cookie and the sign-in state
// for Google and GitHub is a signed cookie; the accounts themselves are asked
// for on every page (service.js).
// Every page works without JavaScript: every action is a form, and every form
// carries a CSRF value that must match its cookie.

import { open, randomToken, safeEqual, seal } from './crypto.js';
import { ask, configured, problem } from './service.js';
import * as view from './views.js';

const SESSION_MS = 30 * 86_400_000;
const OAUTH_MS = 10 * 60_000;
const MAX_FORM_BYTES = 16 * 1024;

/* ------------------------------------------------------------- plumbing */

function cookies(request) {
  const out = {};
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookie(name, value, { path = '/account', maxAge, secure }) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, 'HttpOnly', 'SameSite=Lax'];
  if (secure) parts.push('Secure');
  if (maxAge !== undefined) parts.push(`Max-Age=${Math.floor(maxAge / 1000)}`);
  return parts.join('; ');
}

const SECURITY = {
  'cache-control': 'no-store',
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'same-origin',
  'content-security-policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'",
};

class Ctx {
  constructor(request, env, waitUntil) {
    this.request = request;
    this.env = env;
    this.waitUntil = waitUntil;
    this.url = new URL(request.url);
    this.origin = this.url.origin;
    this.secure = this.url.protocol === 'https:';
    this.jar = cookies(request);
    this.setCookies = [];
    this.ip = request.headers.get('cf-connecting-ip') || '';
    this.csrf = this.jar.zk_c && /^[A-Za-z0-9_-]{16,64}$/.test(this.jar.zk_c) ? this.jar.zk_c : null;
    if (!this.csrf) {
      this.csrf = randomToken();
      this.setCookies.push(cookie('zk_c', this.csrf, { secure: this.secure }));
    }
    this.opts = {
      google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
    };
  }

  async session() {
    const s = await open(this.env.SESSION_SECRET, 'session', this.jar.zk_s);
    return s && typeof s.a === 'string' ? s.a : null;
  }

  async signIn(accountId) {
    const value = await seal(this.env.SESSION_SECRET, 'session', { a: accountId }, SESSION_MS);
    this.setCookies.push(cookie('zk_s', value, { maxAge: SESSION_MS, secure: this.secure }));
  }

  signOut() {
    this.setCookies.push(cookie('zk_s', '', { maxAge: 0, secure: this.secure }));
  }

  respond(body, status = 200, extra = {}) {
    const headers = new Headers({ ...SECURITY, ...extra });
    for (const c of this.setCookies) headers.append('set-cookie', c);
    return new Response(body, { status, headers });
  }

  html(body, status = 200) {
    return this.respond(body.replaceAll('__CSRF__', view.esc(this.csrf)), status, { 'content-type': 'text/html; charset=utf-8' });
  }

  redirect(location, status = 303) {
    return this.respond(null, status, { location });
  }

  page(title, body, { signedIn = false, bare = false, status = 200 } = {}) {
    return this.html(view.page({ title, body, signedIn, bare }), status);
  }

  /** The form, or null when it is too big, not a form, or its CSRF value is wrong. */
  async form() {
    const length = Number(this.request.headers.get('content-length') || 0);
    if (length > MAX_FORM_BYTES) return null;
    const origin = this.request.headers.get('origin');
    if (origin && origin !== this.origin) return null;
    let data;
    try {
      data = await this.request.formData();
    } catch {
      return null;
    }
    const fields = {};
    for (const [k, v] of data.entries()) if (typeof v === 'string') fields[k] = v.slice(0, 4096);
    return safeEqual(fields.csrf || '', this.csrf) ? fields : null;
  }

  ask(method, path, body) {
    return ask(this.env, method, path, body, this.ip);
  }
}

/** Only our own account pages are places to come back to. */
function safeNext(next) {
  return typeof next === 'string' && /^\/account(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?$/.test(next) ? next : '';
}

/* -------------------------------------------------------------- flashes */

// Only fixed sentences reach a page from the address bar: a query string
// is the visitor's text, and putting it on the page would be a way to make
// the site say anything.
const FLASH = {
  welcome: ['ok', 'Your account is ready. Buy a plan or add a balance to start calling Pranata V1.'],
  'verify-sent': ['ok', 'We sent a new confirmation email. Open it and follow the link (or type the code in Zeiko Chat).'],
  'verify-failed': ['err', 'The confirmation email could not be sent. Try again in a few minutes.'],
  password: ['ok', 'Your password is saved.'],
  rotated: ['ok', 'Your new key is below. The old one no longer works.'],
  cancelled: ['warn', 'Nothing was charged. Pick a plan or an amount whenever you are ready.'],
  linked: ['ok', 'That sign-in method is connected.'],
  'link-taken': ['err', 'That account is already connected to another Zeiko Account.'],
};

/* ---------------------------------------------------------------- pages */

async function loadAccount(c, id) {
  const answer = await c.ask('GET', `/accounts/${encodeURIComponent(id)}`);
  if (answer.status === 200 && answer.data && answer.data.account) {
    return { o: answer.data };
  }
  if (answer.status === 404 && answer.data && answer.data.error && answer.data.error.code === 'no_account') {
    c.signOut();
    return { gone: true };
  }
  return { error: problem(answer) };
}

async function accountPage(c, id, tab, extra = {}) {
  const loaded = await loadAccount(c, id);
  if (loaded.gone) return c.redirect('/account/signin');
  if (loaded.error) {
    return c.page('Account', view.message({ heading: 'Not available right now', text: loaded.error, link: c.url.pathname, label: 'Try again' }), { signedIn: true, status: 503 });
  }
  const o = loaded.o;
  let flash = extra.flash || '';
  const code = c.url.searchParams.get('m');
  if (!flash && code && FLASH[code]) flash = view.flash(...FLASH[code]);

  // Back from paying: ask where the payment stands, so the page says so.
  const paid = c.url.searchParams.get('paid');
  if (!flash && paid && /^[A-Za-z0-9_-]{1,64}$/.test(paid)) {
    const r = await c.ask('POST', `/accounts/${encodeURIComponent(id)}/payments/${encodeURIComponent(paid)}/recheck`);
    if (r.status === 200 && r.data && r.data.paid) {
      flash = view.flash('ok', 'Payment received — thank you. Your plan or balance is updated.');
      const fresh = await loadAccount(c, id);
      if (fresh.o) Object.assign(o, fresh.o);
    } else if (r.status === 200) {
      flash = view.flash('warn', 'Thanks! Your payment is on its way. It shows up here once the network confirms it — usually within a few minutes.');
    }
  }

  const csrf = c.csrf;
  let body;
  if (tab === 'plans') body = view.plans(o, { csrf, flash, pick: extra.pick || c.url.searchParams.get('plan') || '' });
  else if (tab === 'key') body = view.key(o, { csrf, flash, secret: extra.secret, apiBase: c.env.API_BASE_URL || '' });
  else if (tab === 'settings') body = view.settings(o, { csrf, flash, opts: c.opts });
  else body = view.overview(o, flash);
  const titles = { plans: 'Plans & balance', key: 'API key', settings: 'Settings', overview: 'Account' };
  return c.page(titles[tab] || 'Account', body, { signedIn: true, status: extra.status || 200 });
}

/* -------------------------------------------------------------- sign in */

async function signInPage(c, state = {}) {
  const next = safeNext(state.next ?? c.url.searchParams.get('next'));
  const code = c.url.searchParams.get('m');
  const notice = state.notice || '';
  const error = state.error || (code === 'oauth' ? 'That sign-in did not go through. Try again.' : code === 'taken' ? 'That email already has an account. Sign in with its password, then connect this method in Settings.' : '');
  return c.page('Sign in', view.signIn({ csrf: c.csrf, error, notice, email: state.email, next, opts: c.opts }), { status: state.status || 200 });
}

async function signUpPage(c, state = {}) {
  const next = safeNext(state.next ?? c.url.searchParams.get('next'));
  return c.page('Create account', view.signUp({ csrf: c.csrf, error: state.error, email: state.email, username: state.username, next, opts: c.opts }), { status: state.status || 200 });
}

async function doSignIn(c) {
  const f = await c.form();
  if (!f) return signInPage(c, { error: 'This form was open too long. Try again.', status: 400 });
  const r = await c.ask('POST', '/login', { email: f.email || '', password: f.password || '' });
  if (r.status !== 200) return signInPage(c, { error: problem(r), email: f.email, next: f.next, status: r.status === 429 ? 429 : 400 });
  await c.signIn(r.data.account.id);
  return c.redirect(safeNext(f.next) || '/account');
}

async function doSignUp(c) {
  const f = await c.form();
  if (!f) return signUpPage(c, { error: 'This form was open too long. Try again.', status: 400 });
  const r = await c.ask('POST', '/signup', { email: f.email || '', username: f.username || '', password: f.password || '' });
  if (r.status !== 200) return signUpPage(c, { error: problem(r), email: f.email, username: f.username, next: f.next, status: r.status === 429 ? 429 : 400 });
  await c.signIn(r.data.account.id);
  return c.redirect(safeNext(f.next) || '/account?m=welcome');
}

/* -------------------------------------------------------- google/github */

const PROVIDERS = {
  google: {
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    id: (env) => env.GOOGLE_CLIENT_ID,
    secret: (env) => env.GOOGLE_CLIENT_SECRET,
    async who(env, code, redirect) {
      const token = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: redirect, grant_type: 'authorization_code' }),
      }).then((r) => r.json());
      if (!token.access_token) return null;
      const me = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { authorization: `Bearer ${token.access_token}` } }).then((r) => r.json());
      if (!me.sub) return null;
      return { subject: String(me.sub), email: me.email || '', emailVerified: me.email_verified === true, name: me.name || '' };
    },
  },
  github: {
    authorize: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
    id: (env) => env.GITHUB_CLIENT_ID,
    secret: (env) => env.GITHUB_CLIENT_SECRET,
    async who(env, code, redirect) {
      const token = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: redirect }),
      }).then((r) => r.json());
      if (!token.access_token) return null;
      const headers = { authorization: `Bearer ${token.access_token}`, accept: 'application/vnd.github+json', 'user-agent': 'ZeikoAI-accounts' };
      const me = await fetch('https://api.github.com/user', { headers }).then((r) => r.json());
      if (!me.id) return null;
      let email = '';
      let emailVerified = false;
      const emails = await fetch('https://api.github.com/user/emails', { headers }).then((r) => (r.ok ? r.json() : [])).catch(() => []);
      const primary = Array.isArray(emails) ? emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) : null;
      if (primary) {
        email = primary.email;
        emailVerified = true;
      } else if (me.email) {
        email = me.email;
      }
      return { subject: String(me.id), email, emailVerified, name: me.name || me.login || '' };
    },
  },
};

async function oauthStart(c, name) {
  const p = PROVIDERS[name];
  if (!p || !p.id(c.env) || !p.secret(c.env)) return c.redirect('/account/signin');
  const state = randomToken();
  const next = safeNext(c.url.searchParams.get('next'));
  // Signed in already: this connects the provider to the account.
  const linkTo = (await c.session()) || '';
  const sealed = await seal(c.env.SESSION_SECRET, 'oauth', { s: state, p: name, n: next, l: linkTo }, OAUTH_MS);
  c.setCookies.push(cookie('zk_o', sealed, { path: '/account/oauth', maxAge: OAUTH_MS, secure: c.secure }));
  const q = new URLSearchParams({
    client_id: p.id(c.env),
    redirect_uri: `${c.origin}/account/oauth/${name}/callback`,
    response_type: 'code',
    scope: p.scope,
    state,
  });
  if (name === 'google') q.set('prompt', 'select_account');
  return c.redirect(`${p.authorize}?${q}`, 302);
}

async function oauthDone(c, name) {
  const p = PROVIDERS[name];
  const held = await open(c.env.SESSION_SECRET, 'oauth', c.jar.zk_o);
  c.setCookies.push(cookie('zk_o', '', { path: '/account/oauth', maxAge: 0, secure: c.secure }));
  const code = c.url.searchParams.get('code');
  const state = c.url.searchParams.get('state') || '';
  if (!p || !held || held.p !== name || !safeEqual(held.s, state) || !code) return c.redirect('/account/signin?m=oauth');
  let who = null;
  try {
    who = await p.who(c.env, code, `${c.origin}/account/oauth/${name}/callback`);
  } catch {
    who = null;
  }
  if (!who) return c.redirect('/account/signin?m=oauth');
  const r = await c.ask('POST', '/oauth', { provider: name, ...who, linkTo: held.l || '' });
  if (r.status === 409 && held.l) return c.redirect('/account/settings?m=link-taken');
  if (r.status === 409) return c.redirect('/account/signin?m=taken');
  if (r.status !== 200) return c.page('Sign in', view.message({ heading: 'Not available right now', text: problem(r), link: '/account/signin', label: 'Back to sign in' }), { status: 503 });
  await c.signIn(r.data.account.id);
  const next = safeNext(held.n);
  if (r.data.created) return c.redirect(next || '/account?m=welcome');
  return c.redirect(next ? `${next}${next.includes('?') ? '&' : '?'}m=linked` : '/account');
}

/* ------------------------------------------------------ password reset */

// The reset email and its page are Zeiko Chat's: one account, one password.
async function doForgot(c) {
  const f = await c.form();
  if (!f) return c.page('Forgot password', view.forgot({ csrf: c.csrf, error: 'This form was open too long. Try again.' }), { status: 400 });
  const r = await c.ask('POST', '/reset', { email: f.email || '' });
  if (r.status !== 200) return c.page('Forgot password', view.forgot({ csrf: c.csrf, error: problem(r) }), { status: r.status === 429 ? 429 : 400 });
  return c.page('Forgot password', view.forgot({ csrf: c.csrf, sent: true }));
}

/* ------------------------------------------------------------- actions */

async function action(c, id, path) {
  const f = await c.form();
  const back = (tab, text, kind = 'err', status = 400) => accountPage(c, id, tab, { flash: view.flash(kind, text), status });
  if (!f) return back(path === '/account/password' ? 'settings' : path.startsWith('/account/key') ? 'key' : 'plans', 'This page was open too long. Try again.');
  const enc = encodeURIComponent(id);
  const returnUrl = `${c.origin}/account`;

  switch (path) {
    case '/account/buy': {
      const r = await c.ask('POST', `/accounts/${enc}/checkout`, { kind: 'plan', plan: f.plan || '', returnUrl });
      if (r.status === 200 && r.data && r.data.invoiceUrl) return c.redirect(r.data.invoiceUrl);
      return back('plans', problem(r));
    }
    case '/account/topup': {
      const raw = f.amount === 'custom' ? f.custom : f.amount;
      const amountUsd = Math.floor(Number(raw));
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) return back('plans', 'Pick an amount, or type one in whole dollars.');
      const r = await c.ask('POST', `/accounts/${enc}/checkout`, { kind: 'credit', amountUsd, returnUrl });
      if (r.status === 200 && r.data && r.data.invoiceUrl) return c.redirect(r.data.invoiceUrl);
      return back('plans', problem(r));
    }
    case '/account/subscribe': {
      const r = await c.ask('POST', `/accounts/${enc}/subscribe`, { plan: f.plan || '' });
      if (r.status === 200) return back('plans', 'We emailed you a payment link for this plan. A new one arrives before every renewal.', 'ok', 200);
      return back('plans', problem(r));
    }
    case '/account/key/reveal': {
      const r = await c.ask('GET', `/accounts/${enc}/key`);
      if (r.status === 200 && r.data && r.data.secret) return accountPage(c, id, 'key', { secret: r.data.secret });
      return back('key', problem(r));
    }
    case '/account/key/rotate': {
      if (f.sure !== '1') return back('key', 'Tick the box to confirm.');
      const r = await c.ask('POST', `/accounts/${enc}/key/rotate`);
      if (r.status === 200 && r.data && r.data.secret) return accountPage(c, id, 'key', { secret: r.data.secret, flash: view.flash(...FLASH.rotated) });
      return back('key', problem(r));
    }
    case '/account/password': {
      const r = await c.ask('POST', `/accounts/${enc}/password`, { current: f.current || '', password: f.password || '' });
      if (r.status === 200) return c.redirect('/account/settings?m=password');
      return back('settings', problem(r));
    }
    case '/account/verify/send': {
      const r = await c.ask('POST', `/accounts/${enc}/resend`);
      return c.redirect(`/account?m=${r.status === 200 ? 'verify-sent' : 'verify-failed'}`);
    }
    default:
      return c.redirect('/account');
  }
}

/* -------------------------------------------------------------- router */

export async function handleAccount(request, env, ctx) {
  const c = new Ctx(request, env, (p) => (ctx && ctx.waitUntil ? ctx.waitUntil(p) : p));
  const path = c.url.pathname.replace(/\/+$/, '') || '/account';
  const method = request.method;

  if (!configured(env)) {
    return c.page('Account', view.message({ heading: 'Accounts open soon', text: 'Signing in is not available yet. Check back shortly.', link: '/', label: 'Back to the site' }), { status: 503, bare: true });
  }
  if (method !== 'GET' && method !== 'HEAD' && method !== 'POST') return c.respond('method not allowed', 405, { allow: 'GET, POST' });

  const id = await c.session();

  // Open to everyone.
  if (path === '/account/signin') {
    if (id) return c.redirect(safeNext(c.url.searchParams.get('next')) || '/account');
    return method === 'POST' ? doSignIn(c) : signInPage(c);
  }
  if (path === '/account/signup') {
    if (id) return c.redirect('/account');
    return method === 'POST' ? doSignUp(c) : signUpPage(c);
  }
  if (path === '/account/forgot') {
    return method === 'POST' ? doForgot(c) : c.page('Forgot password', view.forgot({ csrf: c.csrf }));
  }
  const oauth = path.match(/^\/account\/oauth\/(google|github)(\/callback)?$/);
  if (oauth) return oauth[2] ? oauthDone(c, oauth[1]) : oauthStart(c, oauth[1]);
  if (path === '/account/signout') {
    if (method === 'POST' && (await c.form())) c.signOut();
    return c.redirect('/');
  }

  // Signed in only.
  if (!id) {
    const next = safeNext(`${path}${c.url.search}`);
    return c.redirect(`/account/signin${next && next !== '/account' ? `?next=${encodeURIComponent(next)}` : ''}`);
  }
  if (method === 'POST') return action(c, id, path);
  if (path === '/account') return accountPage(c, id, 'overview');
  if (path === '/account/plans') return accountPage(c, id, 'plans');
  if (path === '/account/key') return accountPage(c, id, 'key');
  if (path === '/account/settings') return accountPage(c, id, 'settings');
  return c.redirect('/account');
}
