// The account area (/account and its pages). The pages are plain files; this
// script asks the account door for the visitor's Zeiko Account and draws the
// page from the answer (views.js). The door's address is the page's
// <meta name="zeiko-accounts">; the sign-in lives there as a cookie of its
// own, so nothing about the visitor is kept on this site.
//
// Every action is a form with `data-act`. The door answers only this site's
// own pages, and only with the `X-Zeiko` mark this script adds.

import * as view from './views.js';

const DOOR = (document.querySelector('meta[name="zeiko-accounts"]') || {}).content?.replace(/\/+$/, '') || '';
const root = document.getElementById('acct');
const navEl = document.getElementById('nav');
const here = new URL(location.href);
const path = here.pathname.replace(/\/+$/, '') || '/account';
const params = here.searchParams;

/* ------------------------------------------------------------- the door */

/** One call to the door: `{status, data}`; status 0 when it did not answer
 *  (or took longer than 20 seconds, so a page never waits forever). */
async function ask(method, tail, body) {
  const headers = { 'x-zeiko': '1' };
  if (body !== undefined) headers['content-type'] = 'application/json';
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 20_000);
  try {
    const res = await fetch(`${DOOR}/v1${tail}`, {
      method,
      credentials: 'include',
      headers: method === 'GET' ? {} : headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: stop.signal,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  } catch {
    return { status: 0, data: null };
  } finally {
    clearTimeout(timer);
  }
}

/** A refusal in the door's own words (written for customers), else ours. */
function problem(r) {
  if (r.status >= 400 && r.status < 500 && r.data && r.data.error && typeof r.data.error.message === 'string') {
    return r.data.error.message;
  }
  return 'Not available right now. Try again in a minute.';
}

/* --------------------------------------------------------------- helpers */

/** Only our own account pages are places to come back to. */
function safeNext(next) {
  return typeof next === 'string' && /^\/account(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?(#[A-Za-z0-9_-]*)?$/.test(next) ? next : '';
}

// A referral code from a link (?ref=) is kept for 30 days on this browser,
// so it is still there when the visitor gets round to signing up.
const REF_KEY = 'zeiko.ref';
function rememberRef() {
  const ref = (params.get('ref') || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 32);
  if (ref) {
    try {
      localStorage.setItem(REF_KEY, JSON.stringify({ code: ref, until: Date.now() + 30 * 86_400_000 }));
    } catch {
      /* private mode: the form still has it */
    }
  }
  return ref;
}
function savedRef() {
  try {
    const v = JSON.parse(localStorage.getItem(REF_KEY) || 'null');
    return v && v.until > Date.now() ? String(v.code || '') : '';
  } catch {
    return '';
  }
}

// Only fixed sentences reach a page from the address bar: a query string is
// the visitor's text, and putting it on the page would let anyone make the
// site say anything.
const FLASH = {
  welcome: ['ok', 'Your account is ready, here and in Zeiko Chat. Buy a plan or add balance to start calling Pranata V1.'],
  'signed-in': ['ok', 'You are signed in.'],
  'verify-sent': ['ok', 'We sent a new code. Type it above, or open the link in the email.'],
  verified: ['ok', 'Your email is confirmed.'],
  password: ['ok', 'Your password is saved.'],
  email: ['ok', 'Your new email is saved. Type the code we sent there to confirm it.'],
  rotated: ['ok', 'Your new key is below. The old one no longer works.'],
  cancelled: ['warn', 'Nothing was charged. Pick a plan or an amount whenever you are ready.'],
  linked: ['ok', 'That sign-in method is connected.'],
  'link-taken': ['err', 'That account is already connected to another Zeiko Account.'],
  // Where the subscription plans send a subscriber back:
  // /account?m=subscription-paid, -failed or -partial.
  'subscription-paid': ['ok', 'Payment received — thank you. Your plan is renewed; the next link arrives by email before it runs out.'],
  'subscription-failed': ['err', 'That payment did not go through. Nothing was charged; the link in the email still works.'],
  'subscription-partial': ['warn', 'Only part of the amount arrived. Finish it from the same payment page, or contact us.'],
};
const SIGNIN_NOTE = {
  oauth: 'That sign-in did not go through. Try again.',
  taken: 'That email already has an account. Sign in with its password, then connect this method in Settings.',
};

function flashFromAddress() {
  const m = params.get('m');
  return m && FLASH[m] ? view.flash(...FLASH[m]) : '';
}

function draw(html) {
  root.innerHTML = html;
  const focus = root.querySelector('[role="alert"]');
  if (focus) focus.scrollIntoView({ block: 'nearest' });
  // On the sign-in pages, the first empty box is ready to type in — with a
  // mouse only, so a phone's keyboard does not jump up unasked.
  if (root.querySelector('.auth form') && matchMedia('(pointer: fine)').matches) {
    const box = [...root.querySelectorAll('.auth input:not([type="hidden"])')].find((i) => !i.value);
    if (box) box.focus();
  }
}

function setNav(signedIn) {
  if (navEl) navEl.innerHTML = view.nav(signedIn);
}

const TITLES = { '/account': 'Account', '/account/plans': 'Plans & balance', '/account/key': 'API key', '/account/settings': 'Settings', '/account/how-to-buy': 'How to pay', '/account/pay': 'Pay by QRIS' };
const TABS = { '/account': 'overview', '/account/plans': 'plans', '/account/key': 'key', '/account/settings': 'settings', '/account/how-to-buy': 'howtobuy', '/account/pay': 'pay' };

// A QRIS payment's page asks again every few seconds while it can still move.
const PAY_POLL_MS = 8_000;
// How long the thanks after "I've paid" stays before the account opens.
const THANKS_MS = 10_000;
let payTimer = 0;
let thanked = false;
const PAY_ID = /^[A-Za-z0-9_-]{1,64}$/;

/* ----------------------------------------------------------------- pages */

let session = { account: null, signInWith: {}, mail: false };
let o = null;

async function loadSession() {
  const r = await ask('GET', '/session');
  if (r.status === 200 && r.data) session = r.data;
  return r.status;
}

function publicPage(extra = {}) {
  const next = safeNext(params.get('next') || '');
  const opts = session.signInWith || {};
  if (path === '/account/signup') {
    document.title = 'Create account — ZeikoAI';
    draw(view.signUp({ error: extra.error || '', email: extra.email || '', username: extra.username || '', next, ref: extra.ref ?? (rememberRef() || savedRef()), opts, door: DOOR }));
  } else if (path === '/account/forgot') {
    document.title = 'Forgot password — ZeikoAI';
    draw(view.forgot({ error: extra.error || '', sent: Boolean(extra.sent) }));
  } else if (path === '/account/reset') {
    document.title = 'New password — ZeikoAI';
    draw(view.reset({ error: extra.error || '', token: params.get('token') || '' }));
  } else {
    document.title = 'Sign in — ZeikoAI';
    const note = SIGNIN_NOTE[params.get('m')] || '';
    draw(view.signIn({ error: extra.error || note, notice: extra.notice || '', email: extra.email || '', next, opts, door: DOOR }));
  }
}

async function accountPage(extra = {}) {
  const r = await ask('GET', '/account');
  if (r.status === 401) {
    location.replace(`/account/signin?next=${encodeURIComponent(path + here.hash)}`);
    return;
  }
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: 'Not available right now', text: problem(r), link: path, label: 'Try again' }));
    return;
  }
  o = r.data;
  let flash = extra.flash || flashFromAddress();

  // Back from paying: ask where the payment stands, so the page says so.
  const paid = params.get('paid');
  if (!flash && paid && /^[A-Za-z0-9_-]{1,64}$/.test(paid)) {
    const p = await ask('POST', `/payments/${encodeURIComponent(paid)}/recheck`);
    if (p.status === 200 && p.data && p.data.paid) {
      flash = view.flash('ok', 'Payment received — thank you. Your plan or balance is updated.');
      const fresh = await ask('GET', '/account');
      if (fresh.status === 200 && fresh.data) o = fresh.data;
    } else if (p.status === 200) {
      flash = view.flash('warn', 'Thanks! Your payment is on its way. It shows up here once the network confirms it — usually within a few minutes.');
    }
  }
  const tab = TABS[path] || 'overview';
  document.title = `${TITLES[path] || 'Account'} — ZeikoAI`;
  if (tab === 'pay') return payPage(flash);
  if (tab === 'plans') draw(view.plans(o, { flash, pick: extra.pick || params.get('plan') || '' }));
  else if (tab === 'key') draw(view.key(o, { flash, shown: extra.shown, apiBase: o.apiBase || '' }));
  else if (tab === 'settings') draw(view.settings(o, { flash, door: DOOR }));
  else if (tab === 'howtobuy') draw(view.howToBuy(o, flash));
  else draw(view.overview(o, flash));
  if (here.hash && !extra.flash) {
    const at = document.getElementById(here.hash.slice(1));
    if (at) at.scrollIntoView();
  }
}

/** A QRIS payment of the person's, redrawn until it stops moving. */
async function payPage(flash) {
  clearTimeout(payTimer);
  const id = params.get('id') || '';
  if (!PAY_ID.test(id)) return location.replace('/account/plans');
  const r = await ask('GET', `/payments/${encodeURIComponent(id)}/qris`);
  // A poll that was on its way when "I've paid" went through: the thanks stays.
  if (thanked) return;
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: 'Not available right now', text: problem(r), link: '/account/plans', label: 'Plans & balance' }));
    return;
  }
  draw(view.qrisPay(o, r.data, flash || ''));
  if (r.data.status === 'waiting' || r.data.status === 'confirming') {
    payTimer = setTimeout(() => {
      // Not while the person is pressing "I've paid".
      if (root.querySelector('form[aria-busy="true"]')) return payPage(flash);
      return payPage('');
    }, PAY_POLL_MS);
  }
}

/** "I've paid" went through: thank them, then back to the account. */
function thanks(q) {
  thanked = true;
  clearTimeout(payTimer);
  const until = Date.now() + THANKS_MS;
  draw(view.qrisThanks(o, q, THANKS_MS / 1000));
  const tick = () => {
    const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    const at = document.getElementById('qris-countdown');
    if (at) at.textContent = String(left);
    if (left === 0) return location.assign('/account');
    payTimer = setTimeout(tick, 250);
    return undefined;
  };
  payTimer = setTimeout(tick, 250);
}

/* --------------------------------------------------------------- actions */

const SIGNED_OUT_PAGES = new Set(['/account/signin', '/account/signup', '/account/forgot', '/account/reset']);

/** Where a checkout goes next: the crypto payment page, or the QR. */
function paying(r, back) {
  if (r.status === 200 && r.data && r.data.qris && PAY_ID.test(r.data.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.id)}`);
  if (r.status === 200 && r.data && r.data.invoiceUrl) return location.assign(r.data.invoiceUrl);
  return back(problem(r));
}

async function act(name, f, submitter) {
  const back = (text, kind = 'err') => accountPage({ flash: view.flash(kind, text) });
  switch (name) {
    case 'signin': {
      const r = await ask('POST', '/login', { email: f.email || '', password: f.password || '' });
      if (r.status === 200) return location.assign(safeNext(f.next) || '/account');
      return publicPage({ error: problem(r), email: f.email });
    }
    case 'signup': {
      const r = await ask('POST', '/signup', { email: f.email || '', username: f.username || '', password: f.password || '', referral: f.referral || '' });
      if (r.status === 200) return location.assign(safeNext(f.next) || '/account?m=welcome');
      return publicPage({ error: problem(r), email: f.email, username: f.username, ref: f.referral || '' });
    }
    case 'forgot': {
      const r = await ask('POST', '/forgot', { email: f.email || '' });
      return publicPage(r.status === 200 ? { sent: true } : { error: problem(r) });
    }
    case 'reset': {
      const r = await ask('POST', '/reset', { token: f.token || '', password: f.password || '' });
      if (r.status === 200) return location.assign('/account?m=password');
      return publicPage({ error: problem(r) });
    }
    case 'signout': {
      await ask('POST', '/logout', {});
      return location.assign('/account/signin');
    }
    case 'verify-send': {
      const r = await ask('POST', '/resend', {});
      return r.status === 200 ? back(FLASH['verify-sent'][1], 'ok') : back(problem(r));
    }
    case 'verify-code': {
      const r = await ask('POST', '/verify', { code: f.code || '' });
      return r.status === 200 ? back(FLASH.verified[1], 'ok') : back(problem(r));
    }
    case 'buy': {
      const product = f.product === 'chat' ? 'chat' : 'pranata';
      const method = submitter && submitter.value === 'qris' ? 'qris' : 'crypto';
      const r = await ask('POST', '/checkout', { product, kind: 'plan', plan: f.plan || '', method });
      return paying(r, back);
    }
    case 'topup': {
      const raw = submitter && submitter.value === 'custom' ? f.custom : submitter ? submitter.value : f.custom;
      const amountUsd = Math.floor(Number(raw));
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) return back('Pick an amount, or type one in whole dollars.');
      const method = f.method === 'qris' ? 'qris' : 'crypto';
      const r = await ask('POST', '/checkout', { product: 'chat', kind: 'credit', amountUsd, method });
      return paying(r, back);
    }
    case 'qris-sent': {
      if (!PAY_ID.test(f.id || '')) return back('That payment was not found.');
      const r = await ask('POST', `/payments/${encodeURIComponent(f.id)}/sent`, {});
      if (r.status === 200 && r.data) return thanks(r.data);
      return payPage(view.flash('err', problem(r)));
    }
    case 'subscribe': {
      const product = f.product === 'chat' ? 'chat' : 'pranata';
      const r = await ask('POST', '/subscribe', { product, plan: f.plan || '' });
      if (r.status === 200) return back('We emailed you a link for this plan. A new one arrives before every renewal.', 'ok');
      return back(problem(r));
    }
    case 'key-reveal': {
      const r = await ask('GET', '/key');
      if (r.status === 200 && r.data && r.data.key) return accountPage({ shown: r.data.key });
      return back(problem(r));
    }
    case 'key-rotate': {
      if (f.sure !== '1') return back('Tick the box to confirm.');
      const r = await ask('POST', '/key/rotate', {});
      if (r.status === 200 && r.data && r.data.key) return accountPage({ shown: r.data.key, flash: view.flash(...FLASH.rotated) });
      return back(problem(r));
    }
    case 'password': {
      const r = await ask('POST', '/password', { current: f.current || '', password: f.password || '' });
      return r.status === 200 ? back(FLASH.password[1], 'ok') : back(problem(r));
    }
    case 'email': {
      const r = await ask('POST', '/email', { current: f.current || '', email: f.email || '' });
      return r.status === 200 ? back(FLASH.email[1], 'ok') : back(problem(r));
    }
    default:
      return undefined;
  }
}

document.addEventListener('submit', async (e) => {
  const form = e.target.closest('form[data-act]');
  if (!form) return;
  e.preventDefault();
  const fields = {};
  for (const [k, v] of new FormData(form).entries()) if (typeof v === 'string') fields[k] = v.slice(0, 4096);
  const buttons = form.querySelectorAll('button');
  // The button pressed says what is happening ("Signing in…") until the
  // door answers.
  const pressed = e.submitter && form.contains(e.submitter) ? e.submitter : form.querySelector('button[type="submit"]');
  const before = pressed ? pressed.innerHTML : '';
  if (pressed && pressed.dataset.busy) pressed.textContent = pressed.dataset.busy;
  form.setAttribute('aria-busy', 'true');
  buttons.forEach((b) => { b.disabled = true; });
  try {
    await act(form.dataset.act, fields, e.submitter || null);
  } finally {
    buttons.forEach((b) => { b.disabled = false; });
    form.removeAttribute('aria-busy');
    if (pressed && pressed.dataset.busy) pressed.innerHTML = before;
  }
});

// Show or hide a password as it is typed.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-reveal]');
  if (!btn) return;
  const box = document.getElementById(btn.dataset.reveal);
  if (!box) return;
  const show = box.type === 'password';
  box.type = show ? 'text' : 'password';
  btn.setAttribute('aria-pressed', String(show));
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  box.focus();
});

// "Caps Lock is on" under a password box, while it is.
function capsNote(e) {
  const box = e.target;
  if (!(box instanceof HTMLInputElement) || !box.closest('.pw') || typeof e.getModifierState !== 'function') return;
  const note = box.closest('.field')?.querySelector('.caps-note');
  if (note) note.hidden = !e.getModifierState('CapsLock');
}
document.addEventListener('keydown', capsNote);
document.addEventListener('keyup', capsNote);

/* ----------------------------------------------------------------- start */

async function start() {
  rememberRef();
  if (!DOOR) {
    draw(view.message({ heading: 'Accounts open soon', text: 'Signing in is not available yet. Check back shortly.', link: '/', label: 'Back to the site' }));
    return;
  }
  // A confirmation link works without being signed in.
  if (path === '/account/verify') {
    const r = await ask('POST', '/verify', { token: params.get('token') || '' });
    const status = await loadSession();
    setNav(Boolean(session.account));
    if (r.status === 200) {
      if (session.account) return location.replace('/account?m=verified');
      return draw(view.message({ heading: 'Email confirmed', text: 'Thanks — your email is confirmed. Sign in to carry on.', link: '/account/signin', label: 'Sign in' }));
    }
    return draw(view.message({ heading: status ? 'That link did not work' : 'Not available right now', text: problem(r), link: '/account', label: 'Go to your account' }));
  }
  const status = await loadSession();
  if (status !== 200) {
    setNav(false);
    draw(view.message({ heading: 'Not available right now', text: 'Signing in is not available right now. Try again in a minute.', link: path, label: 'Try again' }));
    return;
  }
  const signedIn = Boolean(session.account);
  setNav(signedIn);
  if (SIGNED_OUT_PAGES.has(path)) {
    if (signedIn && path !== '/account/reset') return location.replace(safeNext(params.get('next') || '') || '/account');
    return publicPage();
  }
  if (!signedIn) return location.replace(`/account/signin?next=${encodeURIComponent(path + here.hash)}`);
  return accountPage();
}

start();
