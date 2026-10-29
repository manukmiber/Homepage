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
import { FONTS, blankContent, buildSite } from './templates.js';
import { contentFromForm, mountPreview } from './preview.js';

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
  // On a phone the tabs scroll sideways: the one open is brought into the row.
  const strip = root.querySelector('.acct-tabs');
  const current = strip && strip.querySelector('[aria-current="page"]');
  if (current) strip.scrollLeft += current.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - current.offsetWidth) / 2;
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
  '/account/hosting': 'Hosting',
  '/account/vps': 'VPS',
  '/account/s3': 'Zeiko S3',
  '/account/sites': L('Sites', 'Situs'),
  '/account/sites/files': L('Website files', 'File situs'),
  '/account/sites/edit': L('Edit your website', 'Edit situsmu'),
  '/account/receipts': L('Receipts', 'Kuitansi'),
  '/account/settings': L('Settings', 'Pengaturan'),
  '/account/how-to-buy': L('How to pay', 'Cara membayar'),
  '/account/pay': L('Pay by QRIS', 'Bayar dengan QRIS'),
};
const TABS = { '/account': 'overview', '/account/plans': 'plans', '/account/hosting': 'hosting', '/account/vps': 'vps', '/account/sites': 'sites', '/account/sites/files': 'sitefiles', '/account/sites/edit': 'siteedit', '/account/s3': 's3', '/account/key': 'key', '/account/settings': 'settings', '/account/how-to-buy': 'howtobuy', '/account/pay': 'pay', '/account/receipts': 'receipts' };

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
  if (tab === 'hosting') return hostingPage(flash, extra);
  if (tab === 'vps') return vpsPage(flash, extra);
  if (tab === 'sites') return sitesPage(flash, extra);
  if (tab === 'sitefiles') return siteFilesPage(flash);
  if (tab === 'siteedit') return siteEditPage(flash);
  if (tab === 'receipts') return receiptsPage(flash);
  if (tab === 's3') return draw(view.s3(o, flash));
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

/** Zeiko Hosting: the person's hosting and the order form. */
async function hostingPage(flash, extra = {}) {
  const r = await ask('GET', '/hosting');
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/hosting', label: L('Try again', 'Coba lagi') }));
    return;
  }
  draw(view.hosting(o, r.data, { flash, pick: extra.pick || params.get('plan') || '', domain: extra.domain || '', address: extra.address || '', name: extra.name || '' }));
}

/** Zeiko VPS: the person's servers and the order form. A refused order is
 * drawn again with what was typed, the password left out. */
async function vpsPage(flash, extra = {}) {
  const r = await ask('GET', '/vps');
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/vps', label: L('Try again', 'Coba lagi') }));
    return;
  }
  draw(view.vps(o, r.data, { flash, pick: extra.pick || params.get('plan') || '', cycle: extra.cycle || '', template: extra.template || '', name: extra.name || '', domain: extra.domain || '', sshKey: extra.sshKey || '', address: extra.address || '', addressName: extra.addressName || '', ownDomain: extra.ownDomain || '' }));
}

/** Zeiko Sites: the person's websites and the order form. A refused order
 * is drawn again with what was chosen. */
async function sitesPage(flash, extra = {}) {
  const r = await ask('GET', '/sites');
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/sites', label: L('Try again', 'Coba lagi') }));
    return;
  }
  draw(view.sites(o, r.data, { flash, pick: extra.pick || params.get('package') || '', cycle: extra.cycle || params.get('cycle') || '', gb: extra.gb || '', until: extra.until || '', domain: extra.domain || '', ownDomain: extra.ownDomain || '' }));
}

/** One site of the person's and its files, by `?id=`: `{ site, files }`, or
 * null after drawing why not. */
async function siteAndFiles() {
  const id = params.get('id') || '';
  if (!PAY_ID.test(id)) {
    location.replace('/account/sites');
    return null;
  }
  const r = await ask('GET', `/sites/${encodeURIComponent(id)}/files`);
  if (r.status !== 200 || !r.data || !r.data.site) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/sites', label: L('Your websites', 'Situsmu') }));
    return null;
  }
  return r.data;
}

let siteLimits = {};

async function siteFilesPage(flash) {
  const got = await siteAndFiles();
  if (!got) return;
  if (!siteLimits.fileMb) {
    const all = await ask('GET', '/sites');
    if (all.status === 200 && all.data) siteLimits = { fileMb: all.data.maxFileMb, files: all.data.maxFiles };
  }
  draw(view.siteFiles(o, got.site, got.files, { flash, max: siteLimits }));
}

async function siteEditPage(flash) {
  const got = await siteAndFiles();
  if (!got) return;
  const c = await ask('GET', `/sites/${encodeURIComponent(got.site.id)}/content`);
  if (c.status !== 200 || !c.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(c), link: '/account/sites', label: L('Your websites', 'Situsmu') }));
    return;
  }
  const content = c.data.content && typeof c.data.content === 'object' ? c.data.content : blankContent(got.site.template, '');
  draw(view.siteEditor(o, got.site, content, got.files, { flash }));
  mountPreview(root.querySelector('[data-site-preview]'), root.querySelector('form[data-act="sites-content"]'), got.site.template, got.site.url);
}

async function receiptsPage(flash) {
  const r = await ask('GET', '/receipts');
  if (r.status !== 200 || !r.data) {
    draw(view.message({ heading: L('Not available right now', 'Sedang tidak tersedia'), text: problem(r), link: '/account/receipts', label: L('Try again', 'Coba lagi') }));
    return;
  }
  draw(view.receipts(o, r.data.receipts, DOOR, flash));
}

/** A file's path inside its site, as the door takes it: no leading slash,
 * no `.` or `..`. Null for a name a website cannot have. */
function sitePath(...parts) {
  const p = parts.filter(Boolean).join('/').replace(/\\/g, '/').split('/').filter((x) => x && x !== '.').join('/');
  return p && !p.split('/').includes('..') && p.length <= 300 ? p : null;
}

/** Sends files to a site: the door grants each at its size and answers a
 * signed address per file, and the bytes go there straight from this
 * browser, four at a time. `progress(done, total)` after each file. */
async function sendFiles(id, entries, progress) {
  let done = 0;
  for (let i = 0; i < entries.length; i += 100) {
    const chunk = entries.slice(i, i + 100);
    const r = await ask('POST', `/sites/${encodeURIComponent(id)}/upload`, { files: chunk.map((e) => ({ path: e.path, size: e.blob.size, type: e.type || e.blob.type || '' })) });
    if (r.status !== 200 || !r.data || !Array.isArray(r.data.uploads)) throw new Error(problem(r));
    const byPath = new Map(chunk.map((e) => [e.path, e]));
    const waiting = [...r.data.uploads];
    const one = async () => {
      while (waiting.length) {
        const u = waiting.shift();
        const e = byPath.get(u.path);
        if (!e || typeof u.url !== 'string' || !u.url.startsWith('https://')) throw new Error(L('An upload could not start. Try again.', 'Unggahan tidak bisa dimulai. Coba lagi.'));
        let res = null;
        try {
          res = await fetch(u.url, { method: 'PUT', headers: u.headers && typeof u.headers === 'object' ? u.headers : {}, body: e.blob });
        } catch {
          res = null;
        }
        if (!res || !res.ok) throw new Error(L(`${e.path} did not upload. Check your connection and try again.`, `${e.path} gagal diunggah. Periksa koneksimu lalu coba lagi.`));
        done += 1;
        progress(done, entries.length);
      }
    };
    await Promise.all([one(), one(), one(), one()]);
  }
}

/** A payment the door answered with: open its QR, or say why not on `page`. */
function toPay(r, page) {
  if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
  return page(view.flash('err', problem(r)));
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
  const receiptUrl = r.data.status === 'paid' ? `${DOOR}/v1/payments/${encodeURIComponent(id)}/receipt?lang=${getLang()}` : '';
  draw(view.qrisPay(o, { ...r.data, driveBack: driveBack(r.data), receiptUrl }, flash || ''));
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
  const back = driveBack(q) || (q.product === 'hosting' ? '/account/hosting' : q.product === 'vps' ? '/account/vps' : q.product === 'sites' ? '/account/sites' : '');
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

async function act(name, f, submitter, form) {
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
    case 'hosting-order': {
      const address = ['free', 'name', 'own', 'gift'].includes(f.address) ? f.address : 'free';
      const cycle = ['month', 'half', 'year'].includes(f.cycle) ? f.cycle : 'month';
      const domain = (address === 'gift' ? f.giftDomain : f.domain) || '';
      const r = await ask('POST', '/hosting/order', { plan: f.plan || '', cycle, address, name: f.name || '', domain, lang: getLang() });
      if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
      return hostingPage(view.flash('err', problem(r)), { pick: f.plan || '', domain, address, name: f.name || '', cycle });
    }
    case 'hosting-address': {
      if (!PAY_ID.test(f.id || '')) return hostingPage(view.flash('err', L('That hosting was not found.', 'Hosting itu tidak ditemukan.')));
      const address = f.address === 'own' ? 'own' : 'name';
      const r = await ask('POST', `/hosting/${encodeURIComponent(f.id)}/address`, { address, name: f.name || '', domain: f.domain || '' });
      if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
      return hostingPage(view.flash('err', problem(r)));
    }
    case 'hosting-renew': {
      if (!PAY_ID.test(f.id || '')) return hostingPage(view.flash('err', L('That hosting was not found.', 'Hosting itu tidak ditemukan.')));
      const value = submitter ? submitter.value : '';
      const cycle = ['month', 'half', 'year'].includes(value) ? value : 'month';
      const r = await ask('POST', `/hosting/${encodeURIComponent(f.id)}/renew`, { cycle });
      if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
      return hostingPage(view.flash('err', problem(r)));
    }
    case 'hosting-upgrade': {
      if (!PAY_ID.test(f.id || '')) return hostingPage(view.flash('err', L('That hosting was not found.', 'Hosting itu tidak ditemukan.')));
      const r = await ask('POST', `/hosting/${encodeURIComponent(f.id)}/upgrade`, { plan: f.plan || '' });
      return toPay(r, hostingPage);
    }
    case 'vps-order': {
      const cycle = ['month', 'half', 'year'].includes(f.cycle) ? f.cycle : 'month';
      const address = ['free', 'name', 'own', 'gift'].includes(f.address) ? f.address : '';
      // Only the chosen address's field goes: a free domain typed and then
      // left for another choice is not ordered.
      const typed = {
        domain: address === 'gift' || !address ? f.domain || '' : '',
        addressName: address === 'name' ? f.addressName || '' : '',
        ownDomain: address === 'own' ? f.ownDomain || '' : '',
      };
      const r = await ask('POST', '/vps/order', { plan: f.plan || '', cycle, template: f.template || '', name: f.name || '', password: f.password || '', sshKey: (f.sshKey || '').trim(), address, ...typed, lang: getLang() });
      if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
      return vpsPage(view.flash('err', problem(r)), { pick: f.plan || '', cycle, template: f.template || '', name: f.name || '', domain: f.domain || '', sshKey: f.sshKey || '', address, addressName: f.addressName || '', ownDomain: f.ownDomain || '' });
    }
    case 'vps-address': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const address = f.address === 'own' ? 'own' : 'name';
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/address`, { address, name: f.name || '', domain: f.domain || '' });
      return toPay(r, vpsPage);
    }
    case 'vps-renew': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const value = submitter ? submitter.value : '';
      const cycle = ['month', 'half', 'year'].includes(value) ? value : 'month';
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/renew`, { cycle });
      return toPay(r, vpsPage);
    }
    case 'vps-upgrade': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/upgrade`, { plan: f.plan || '' });
      return toPay(r, vpsPage);
    }
    case 'vps-downgrade': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/downgrade`, { plan: f.plan || '' });
      if (r.status !== 200) return vpsPage(view.flash('err', problem(r)));
      return vpsPage(view.flash('ok', f.plan
        ? L('Noted. Your next renewal is priced at the smaller plan and the VPS moves to it then.', 'Sudah dicatat. Perpanjangan berikutnya memakai harga paket yang lebih kecil dan VPS pindah ke sana.')
        : L('Noted. You stay on your current plan.', 'Sudah dicatat. Kamu tetap di paket sekarang.')));
    }
    case 'vps-request': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const kind = f.kind || (submitter ? submitter.value : '');
      if (kind === 'reinstall' && f.sure !== '1') return vpsPage(view.flash('err', L('Tick the box to confirm.', 'Centang kotaknya untuk mengonfirmasi.')));
      const body = { kind };
      if (kind === 'password' || kind === 'reinstall') body.password = f.password || '';
      if (kind === 'reinstall') Object.assign(body, { template: f.template || '', sshKey: (f.sshKey || '').trim(), confirm: true });
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/request`, body);
      if (r.status !== 200) return vpsPage(view.flash('err', problem(r)));
      return vpsPage(view.flash('ok', L('Asked. We do it by hand and answer under your VPS here.', 'Sudah diminta. Kami kerjakan manual dan menjawab di bawah VPS-mu di sini.')));
    }
    case 'vps-request-cancel': {
      if (!PAY_ID.test(f.id || '') || !PAY_ID.test(f.rid || '')) return vpsPage(view.flash('err', L('That request was not found.', 'Permintaan itu tidak ditemukan.')));
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/request/${encodeURIComponent(f.rid)}/cancel`, {});
      return vpsPage(r.status === 200 ? view.flash('ok', L('Withdrawn.', 'Dibatalkan.')) : view.flash('err', problem(r)));
    }
    case 'hosting-end':
    case 'vps-end': {
      const vps = name === 'vps-end';
      const page = vps ? vpsPage : hostingPage;
      if (!PAY_ID.test(f.id || '')) return page(view.flash('err', L('That plan was not found.', 'Paket itu tidak ditemukan.')));
      if (f.sure !== '1') return page(view.flash('err', L('Tick the box to confirm.', 'Centang kotaknya untuk mengonfirmasi.')));
      const r = await ask('POST', `/${vps ? 'vps' : 'hosting'}/${encodeURIComponent(f.id)}/end`, { refundTo: f.refundTo || '' });
      if (r.status !== 200) return page(view.flash('err', problem(r)));
      const refund = r.data && r.data.refundIdr > 0;
      return page(view.flash('ok', refund
        ? L('Your plan is ending. We send the refund within 3 working days and email you.', 'Paketmu sedang dihentikan. Refund kami kirim dalam 3 hari kerja lalu kami kirim email.')
        : L('Your plan is ending. We delete it shortly and email you.', 'Paketmu sedang dihentikan. Segera kami hapus lalu kirim email.')));
    }
    case 'vps-cancel': {
      if (!PAY_ID.test(f.id || '')) return vpsPage(view.flash('err', L('That VPS was not found.', 'VPS itu tidak ditemukan.')));
      const r = await ask('POST', `/vps/${encodeURIComponent(f.id)}/cancel`, {});
      return vpsPage(r.status === 200 ? view.flash('ok', L('Order cancelled.', 'Pesanan dibatalkan.')) : view.flash('err', problem(r)));
    }
    case 'hosting-cancel': {
      if (!PAY_ID.test(f.id || '')) return hostingPage(view.flash('err', L('That hosting was not found.', 'Hosting itu tidak ditemukan.')));
      const r = await ask('POST', `/hosting/${encodeURIComponent(f.id)}/cancel`, {});
      return hostingPage(r.status === 200 ? view.flash('ok', L('Order cancelled.', 'Pesanan dibatalkan.')) : view.flash('err', problem(r)));
    }
    case 'sites-order': {
      const cycle = ['year', 'domain', 'event', 'month', 'half'].includes(f.cycle) ? f.cycle : 'year';
      const isStatic = f.package === 'static';
      const body = {
        package: f.package || '',
        cycle: cycle === 'domain' ? 'year' : cycle,
        withDomain: !isStatic && cycle === 'domain',
        domain: !isStatic && cycle === 'domain' ? f.domain || '' : '',
        ownDomain: cycle === 'domain' ? '' : (f.ownDomain || '').trim(),
        gb: isStatic ? Number(f.gb) || 0 : 0,
        until: cycle === 'event' ? f.until || '' : '',
        lang: getLang(),
      };
      const r = await ask('POST', '/sites/order', body);
      if (r.status === 200 && r.data && r.data.payment && PAY_ID.test(r.data.payment.id || '')) return location.assign(`/account/pay?id=${encodeURIComponent(r.data.payment.id)}`);
      return sitesPage(view.flash('err', problem(r)), { pick: f.package || '', cycle, gb: f.gb || '', until: f.until || '', domain: f.domain || '', ownDomain: f.ownDomain || '' });
    }
    case 'sites-renew': {
      if (!PAY_ID.test(f.id || '')) return sitesPage(view.flash('err', L('That website was not found.', 'Situs itu tidak ditemukan.')));
      const value = f.cycle || (submitter ? submitter.value : '');
      const cycle = ['year', 'event', 'month', 'half'].includes(value) ? value : 'year';
      const r = await ask('POST', `/sites/${encodeURIComponent(f.id)}/renew`, { cycle, until: f.until || '', gb: Number(f.gb) || 0 });
      return toPay(r, sitesPage);
    }
    case 'sites-cancel': {
      if (!PAY_ID.test(f.id || '')) return sitesPage(view.flash('err', L('That website was not found.', 'Situs itu tidak ditemukan.')));
      const r = await ask('POST', `/sites/${encodeURIComponent(f.id)}/cancel`, {});
      return sitesPage(r.status === 200 ? view.flash('ok', L('Order cancelled.', 'Pesanan dibatalkan.')) : view.flash('err', problem(r)));
    }
    case 'sites-upload': {
      if (!PAY_ID.test(f.id || '') || !form) return siteFilesPage(view.flash('err', L('That website was not found.', 'Situs itu tidak ditemukan.')));
      const into = (f.into || '').trim();
      const entries = [];
      for (const file of form.elements.folder ? form.elements.folder.files : []) {
        // "mysite/css/a.css" → "css/a.css": the folder picked is the site.
        const rel = String(file.webkitRelativePath || file.name).split('/').slice(1).join('/') || file.name;
        const path = sitePath(into, rel);
        if (path) entries.push({ path, blob: file, type: file.type });
      }
      for (const file of form.elements.files ? form.elements.files.files : []) {
        const path = sitePath(into, file.name);
        if (path) entries.push({ path, blob: file, type: file.type });
      }
      if (!entries.length) return siteFilesPage(view.flash('err', L('Pick a folder or some files first.', 'Pilih folder atau beberapa file dulu.')));
      const note = document.getElementById('site-progress');
      try {
        await sendFiles(f.id, entries, (done, total) => {
          if (note) note.textContent = L(`${done} of ${total} files uploaded…`, `${done} dari ${total} file terunggah…`);
        });
      } catch (err) {
        return siteFilesPage(view.flash('err', err.message));
      }
      return siteFilesPage(view.flash('ok', L(`${entries.length} file${entries.length === 1 ? '' : 's'} uploaded. Your website shows them now.`, `${entries.length} file terunggah. Situsmu sudah menampilkannya.`)));
    }
    case 'sites-delete': {
      if (!PAY_ID.test(f.id || '')) return siteFilesPage(view.flash('err', L('That website was not found.', 'Situs itu tidak ditemukan.')));
      const paths = Object.entries(f).filter(([k]) => /^path\d+$/.test(k)).map(([, v]) => v);
      if (!paths.length) return siteFilesPage(view.flash('err', L('Tick the files to delete first.', 'Centang file yang mau dihapus dulu.')));
      const r = await ask('POST', `/sites/${encodeURIComponent(f.id)}/files/delete`, { paths });
      return siteFilesPage(r.status === 200 ? view.flash('ok', L('Deleted.', 'Dihapus.')) : view.flash('err', problem(r)));
    }
    case 'sites-content': {
      if (!PAY_ID.test(f.id || '')) return siteEditPage(view.flash('err', L('That website was not found.', 'Situs itu tidak ditemukan.')));
      const got = await ask('GET', `/sites/${encodeURIComponent(f.id)}/files`);
      if (got.status !== 200 || !got.data || !got.data.site) return siteEditPage(view.flash('err', problem(got)));
      const template = got.data.site.template;
      const content = contentFromForm(f, template);
      const r = await ask('PUT', `/sites/${encodeURIComponent(f.id)}/content`, content);
      if (r.status !== 200) return siteEditPage(view.flash('err', problem(r)));
      if (!submitter || submitter.value !== '1') return siteEditPage(view.flash('ok', L('Saved. Publish when you are ready.', 'Perubahan sudah dicatat. Terbitkan kalau sudah siap.')));
      // The page's own files, and the fonts it names copied from this site's
      // /fonts/sites/ — skipped when the website already has that file.
      const had = new Map((Array.isArray(got.data.files) ? got.data.files : []).map((x) => [x.path, x.size]));
      const built = [];
      try {
        for (const x of buildSite(template, content, getLang())) {
          if (!x.from) {
            built.push({ path: x.path, type: x.type, blob: new Blob([x.text], { type: x.type }) });
            continue;
          }
          const res = await fetch(x.from);
          if (!res.ok) throw new Error(L('A font could not be read. Try again.', 'Sebuah font tidak bisa dibaca. Coba lagi.'));
          const blob = await res.blob();
          if (had.get(x.path) !== blob.size) built.push({ path: x.path, type: x.type, blob });
        }
        await sendFiles(f.id, built, () => {});
      } catch (err) {
        return siteEditPage(view.flash('err', err.message));
      }
      // Fonts an earlier design used and this one does not.
      const fontFiles = new Set(Object.values(FONTS).flatMap((x) => (x.files || []).map(([file]) => `fonts/${file}`)));
      const used = new Set(buildSite(template, content, getLang()).map((x) => x.path));
      const stale = [...had.keys()].filter((p) => fontFiles.has(p) && !used.has(p));
      if (stale.length) await ask('POST', `/sites/${encodeURIComponent(f.id)}/files/delete`, { paths: stale });
      return siteEditPage(view.flash('ok', L('Published. Open your website to see it.', 'Sudah terbit. Buka situsmu untuk melihatnya.')));
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
    await act(form.dataset.act, fields, e.submitter || null, form);
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
