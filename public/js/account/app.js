// The account area (/account and its pages). The pages are plain files; this
// script asks the account door for the visitor's Zeiko Account and draws the
// page from the answer (views.js). The door's address is the page's
// <meta name="zeiko-accounts">; the sign-in lives there as a cookie of its
// own, so nothing about the visitor is kept on this site.
//
// Every action is a form with `data-act`. The door answers only this site's
// own pages, and only with the `X-Zeiko` mark this script adds.

import * as view from './views.js';
import { remember } from './me.js';
import { L, getLang } from './lang.js';

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
  return L('Not available right now. Try again in a minute.', 'Sedang tidak tersedia. Coba lagi semenit lagi.');
}

/* --------------------------------------------------------------- helpers */

// The apps on this account that send people here to sign in, and ask to go
// back afterwards: Zeiko Drive, at its own address.
const APPS = ['https://drive.zeiko.biz.id'];

/** Where a visitor may be sent after signing in: one of our own account
 * pages, a page of an app on this account (APPS), or /dashboard… (Drive's
 * old address here, which still leads to it). Anything else is ''. */
function safeNext(next) {
  if (typeof next !== 'string' || next.length > 500) return '';
  if (/^\/account(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?(#[A-Za-z0-9_-]*)?$/.test(next)) return next;
  if (/^\/dashboard(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_%.-]*)?$/.test(next)) return next;
  try {
    const u = new URL(next);
    if (!APPS.includes(u.origin) || u.username || u.password || u.hash) return '';
    if (!/^\/[A-Za-z0-9/_-]*$/.test(u.pathname) || !/^(\?[A-Za-z0-9=&_%.-]*)?$/.test(u.search)) return '';
    return u.href;
  } catch {
    return '';
  }
}

/** The app a `next` leads to, for the sign-in page's words. */
function appOf(next) {
  return next.startsWith('/dashboard') || next.startsWith(`${APPS[0]}/`) ? 'drive' : '';
}

/** Where a Zeiko Drive payment goes back to: Drive at its own address, one
 * of this site's subdomains (drive.zeiko.biz.id), or its old address on this
 * site (/dashboard…, which sends the visitor there). Anything else, and it
 * is the account. */
function driveBack(q) {
  if (!q || q.product !== 'drive' || typeof q.back !== 'string') return '';
  try {
    const u = new URL(q.back, location.origin);
    if (u.origin === location.origin) return /^\/dashboard(\/|$)/.test(u.pathname) ? u.href : '';
    return u.protocol === 'https:' && u.hostname.endsWith(`.${location.hostname}`) ? u.href : '';
  } catch {
    return '';
  }
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
  welcome: ['ok', L('Your account is ready, here, in Zeiko Chat and in Zeiko Drive. Buy a plan or add balance to start calling Pranata V1.', 'Akunmu sudah siap, di sini, di Zeiko Chat, dan di Zeiko Drive. Beli paket atau isi saldo untuk mulai memanggil Pranata V1.')],
  'signed-in': ['ok', L('You are signed in.', 'Kamu sudah masuk.')],
  'verify-sent': ['ok', L('We sent a new code. Type it above, or open the link in the email.', 'Kami mengirim kode baru. Ketik di atas, atau buka link di email itu.')],
  verified: ['ok', L('Your email is confirmed.', 'Email-mu sudah dikonfirmasi.')],
  password: ['ok', L('Your password is saved.', 'Kata sandimu sudah diganti.')],
  email: ['ok', L('Your new email is saved. Type the code we sent there to confirm it.', 'Email barumu sudah dicatat. Ketik kode yang kami kirim ke sana untuk mengonfirmasinya.')],
  rotated: ['ok', L('Your new key is below. The old one no longer works.', 'Kunci barumu ada di bawah. Kunci lama sudah tidak berlaku.')],
  cancelled: ['warn', L('Nothing was charged. Pick a plan or an amount whenever you are ready.', 'Tidak ada yang ditagih. Pilih paket atau jumlah kapan pun kamu siap.')],
  linked: ['ok', L('That sign-in method is connected.', 'Cara masuk itu sudah tersambung.')],
  'link-taken': ['err', L('That account is already connected to another Zeiko Account.', 'Akun itu sudah tersambung ke Akun Zeiko lain.')],
  location: ['ok', L('Got it. Zeiko Drive uses this city from your next visit there.', 'Beres. Zeiko Drive memakai kota ini mulai kamu membukanya lagi.')],
  // Where the subscription plans send a subscriber back:
  // /account?m=subscription-paid, -failed or -partial.
  'subscription-paid': ['ok', L('Payment received — thank you. Your plan is renewed; the next link arrives by email before it runs out.', 'Pembayaran diterima — terima kasih. Paketmu diperpanjang; link berikutnya datang lewat email sebelum paket habis.')],
  'subscription-failed': ['err', L('That payment did not go through. Nothing was charged; the link in the email still works.', 'Pembayaran itu tidak berhasil. Tidak ada yang ditagih; link di email masih berlaku.')],
  'subscription-partial': ['warn', L('Only part of the amount arrived. Finish it from the same payment page, or contact us.', 'Baru sebagian jumlahnya yang masuk. Selesaikan dari halaman pembayaran yang sama, atau hubungi kami.')],
};
const SIGNIN_NOTE = {
  oauth: L('That sign-in did not go through. Try again.', 'Masuk tadi tidak berhasil. Coba lagi.'),
  taken: L('That email already has an account. Sign in with its password, then connect this method in Settings.', 'Email itu sudah punya akun. Masuk dengan kata sandinya, lalu sambungkan cara ini di Pengaturan.'),
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

/** The top bar for `account` (null when signed out), and the name kept for
 * the tab's next page (js/account/session.js). */
function setNav(account) {
  remember(account);
  if (navEl) navEl.innerHTML = view.nav(account);
}

const TITLES = {
  '/account': L('Account', 'Akun'),
  '/account/plans': L('Plans & balance', 'Paket & saldo'),
  '/account/key': L('API key', 'Kunci API'),
  '/account/settings': L('Settings', 'Pengaturan'),
  '/account/how-to-buy': L('How to pay', 'Cara membayar'),
  '/account/pay': L('Pay by QRIS', 'Bayar dengan QRIS'),
};
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
    document.title = `${L('Create account', 'Buat akun')} — Zeiko`;
    draw(view.signUp({ error: extra.error || '', email: extra.email || '', username: extra.username || '', city: extra.city || '', postalCode: extra.postalCode || '', next, app: appOf(next), ref: extra.ref ?? (rememberRef() || savedRef()), opts, door: DOOR }));
  } else if (path === '/account/forgot') {
    document.title = `${L('Forgot password', 'Lupa kata sandi')} — Zeiko`;
    draw(view.forgot({ error: extra.error || '', sent: Boolean(extra.sent) }));
  } else if (path === '/account/reset') {
    document.title = `${L('New password', 'Kata sandi baru')} — Zeiko`;
    draw(view.reset({ error: extra.error || '', token: params.get('token') || '' }));
  } else {
    document.title = `${L('Sign in', 'Masuk')} — Zeiko`;
    const note = SIGNIN_NOTE[params.get('m')] || '';
    draw(view.signIn({ error: extra.error || note, notice: extra.notice || '', email: extra.email || '', next, app: appOf(next), opts, door: DOOR }));
  }
}

async function accountPage(extra = {}) {
  const r = await ask('GET', '/account');
  if (r.status === 401) {
    location.replace(`/account/signin?next=${encodeURIComponent(path + here.hash)}`);
    return;
  }
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: path, label: L('Try again', 'Coba lagi') }));
    return;
  }
  o = r.data;
  let flash = extra.flash || flashFromAddress();

  // Back from paying: ask where the payment stands, so the page says so.
  const paid = params.get('paid');
  if (!flash && paid && /^[A-Za-z0-9_-]{1,64}$/.test(paid)) {
    const p = await ask('POST', `/payments/${encodeURIComponent(paid)}/recheck`);
    if (p.status === 200 && p.data && p.data.paid) {
      flash = view.flash('ok', L('Payment received — thank you. Your plan or balance is updated.', 'Pembayaran diterima — terima kasih. Paket atau saldomu sudah diperbarui.'));
      const fresh = await ask('GET', '/account');
      if (fresh.status === 200 && fresh.data) o = fresh.data;
    } else if (p.status === 200) {
      flash = view.flash('warn', L('Thanks! Your payment is on its way. It shows up here once the network confirms it — usually within a few minutes.', 'Terima kasih! Pembayaranmu sedang dalam perjalanan. Akan tampil di sini setelah jaringan mengonfirmasinya — biasanya dalam beberapa menit.'));
    }
  }
  const tab = TABS[path] || 'overview';
  document.title = `${TITLES[path] || TITLES['/account']} — Zeiko`;
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
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/plans', label: L('Plans & balance', 'Paket & saldo') }));
    return;
  }
  draw(view.qrisPay(o, { ...r.data, driveBack: driveBack(r.data) }, flash || ''));
  if (r.data.status === 'waiting' || r.data.status === 'confirming') {
    payTimer = setTimeout(() => {
      // Not while the person is pressing "I've paid".
      if (root.querySelector('form[aria-busy="true"]')) return payPage(flash);
      return payPage('');
    }, PAY_POLL_MS);
  }
}

/** "I've paid" went through: thank them, then back to the account (or to
 * Zeiko Drive, for a Drive payment). */
function thanks(q) {
  thanked = true;
  clearTimeout(payTimer);
  const until = Date.now() + THANKS_MS;
  const back = driveBack(q);
  draw(view.qrisThanks(o, { ...q, driveBack: back }, THANKS_MS / 1000));
  const tick = () => {
    const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    const at = document.getElementById('qris-countdown');
    if (at) at.textContent = String(left);
    if (left === 0) return location.assign(back || '/account');
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
      const r = await ask('POST', '/signup', { email: f.email || '', username: f.username || '', password: f.password || '', city: f.city || '', postalCode: f.postalCode || '', referral: f.referral || '' });
      if (r.status === 200) return location.assign(safeNext(f.next) || '/account?m=welcome');
      return publicPage({ error: problem(r), email: f.email, username: f.username, city: f.city, postalCode: f.postalCode, ref: f.referral || '' });
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
      remember(null);
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
      if (!Number.isFinite(amountUsd) || amountUsd <= 0) return back(L('Pick an amount, or type one in whole dollars.', 'Pilih jumlah, atau ketik jumlah dalam dolar bulat.'));
      const method = f.method === 'qris' ? 'qris' : 'crypto';
      const r = await ask('POST', '/checkout', { product: 'chat', kind: 'credit', amountUsd, method });
      return paying(r, back);
    }
    case 'qris-sent': {
      if (!PAY_ID.test(f.id || '')) return back(L('That payment was not found.', 'Pembayaran itu tidak ditemukan.'));
      const r = await ask('POST', `/payments/${encodeURIComponent(f.id)}/sent`, {});
      if (r.status === 200 && r.data) return thanks(r.data);
      return payPage(view.flash('err', problem(r)));
    }
    case 'subscribe': {
      const product = f.product === 'chat' ? 'chat' : 'pranata';
      const r = await ask('POST', '/subscribe', { product, plan: f.plan || '' });
      if (r.status === 200) return back(L('We emailed you a link for this plan. A new one arrives before every renewal.', 'Kami mengirim link untuk paket ini lewat email. Link baru datang sebelum setiap perpanjangan.'), 'ok');
      return back(problem(r));
    }
    case 'key-reveal': {
      const r = await ask('GET', '/key');
      if (r.status === 200 && r.data && r.data.key) return accountPage({ shown: r.data.key });
      return back(problem(r));
    }
    case 'key-rotate': {
      if (f.sure !== '1') return back(L('Tick the box to confirm.', 'Centang kotaknya untuk mengonfirmasi.'));
      const r = await ask('POST', '/key/rotate', {});
      if (r.status === 200 && r.data && r.data.key) return accountPage({ shown: r.data.key, flash: view.flash(...FLASH.rotated) });
      return back(problem(r));
    }
    case 'password': {
      const r = await ask('POST', '/password', { current: f.current || '', password: f.password || '' });
      return r.status === 200 ? back(FLASH.password[1], 'ok') : back(problem(r));
    }
    case 'location': {
      const r = await ask('POST', '/location', { city: f.city || '', postalCode: f.postalCode || '' });
      return r.status === 200 ? back(FLASH.location[1], 'ok') : back(problem(r));
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
  btn.setAttribute('aria-label', show ? L('Hide password', 'Sembunyikan kata sandi') : L('Show password', 'Tampilkan kata sandi'));
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

/** The page around the account pages, in the visitor's language. The file
 * is written in English; for Indonesian, each marked part takes its
 * `data-id` text, `data-id-label` label and `data-id-href` link (the site's
 * /id/ pages). The EN | ID switch leads to this same page in the other
 * language: main.js keeps the choice when it is pressed. */
function shellLang() {
  const id = getLang() === 'id';
  document.documentElement.lang = getLang();
  if (id) {
    for (const el of document.querySelectorAll('[data-id]')) el.textContent = el.dataset.id;
    for (const el of document.querySelectorAll('[data-id-label]')) el.setAttribute('aria-label', el.dataset.idLabel);
    for (const el of document.querySelectorAll('[data-id-href]')) el.setAttribute('href', el.dataset.idHref);
  }
  const sw = document.getElementById('langSwitch');
  if (sw) {
    const other = id ? 'en' : 'id';
    sw.textContent = other.toUpperCase();
    sw.setAttribute('href', location.pathname + location.search + location.hash);
    sw.setAttribute('hreflang', other);
    sw.setAttribute('lang', other);
    sw.dataset.lang = other;
    // The link is this very page, which a browser may only scroll to: draw it
    // again. main.js's own click handler, added first, has kept the choice.
    sw.addEventListener('click', (e) => {
      e.preventDefault();
      location.reload();
    });
  }
}

async function start() {
  shellLang();
  rememberRef();
  if (!DOOR) {
    draw(view.message({ heading: L('Accounts open soon', 'Akun segera dibuka'), text: L('Signing in is not available yet. Check back shortly.', 'Masuk belum tersedia. Kembali lagi sebentar lagi.'), link: '/', label: L('Back to the site', 'Kembali ke situs') }));
    return;
  }
  // A confirmation link works without being signed in.
  if (path === '/account/verify') {
    const r = await ask('POST', '/verify', { token: params.get('token') || '' });
    const status = await loadSession();
    if (status === 200) setNav(session.account);
    else if (navEl) navEl.innerHTML = view.nav(null);
    if (r.status === 200) {
      if (session.account) return location.replace('/account?m=verified');
      return draw(view.message({ heading: L('Email confirmed', 'Email dikonfirmasi'), text: L('Thanks — your email is confirmed. Sign in to carry on.', 'Terima kasih — email-mu sudah dikonfirmasi. Masuk untuk melanjutkan.'), link: '/account/signin', label: L('Sign in', 'Masuk') }));
    }
    return draw(view.message({ heading: status ? L('That link did not work', 'Link itu tidak berhasil') : L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account', label: L('Go to your account', 'Buka akunmu') }));
  }
  const status = await loadSession();
  if (status !== 200) {
    // The door did not answer: who this is stays unknown, not signed out.
    if (navEl) navEl.innerHTML = view.nav(null);
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: L('Signing in is not available right now. Try again in a minute.', 'Masuk sedang tidak tersedia. Coba lagi semenit lagi.'), link: path, label: L('Try again', 'Coba lagi') }));
    return;
  }
  const signedIn = Boolean(session.account);
  setNav(session.account);
  if (SIGNED_OUT_PAGES.has(path)) {
    if (signedIn && path !== '/account/reset') return location.replace(safeNext(params.get('next') || '') || '/account');
    return publicPage();
  }
  if (!signedIn) return location.replace(`/account/signin?next=${encodeURIComponent(path + here.hash)}`);
  return accountPage();
}

start();
