// The account area's pages, drawn in the visitor's browser by app.js from
// what the account door answers, in English or Indonesian (lang.js). Every value that came from a visitor or
// from the door goes through `esc`; nothing else is put into a page. Every
// action is a form with `data-act`, which app.js sends to the door.

import { PAY_GUIDE } from './payguide.js';
import { PAY_GUIDE_ID } from './payguide.id.js';
import { displayName, esc, meLink } from './me.js';
import { L, day, getLang, num } from './lang.js';

export { esc };

function usd(n) {
  const v = Number(n || 0);
  if (Number.isInteger(v)) return `$${v}`;
  // Small rates keep their digits: $0.003 is not $0.00.
  const text = v >= 0.01 ? v.toFixed(2) : String(+v.toPrecision(3));
  return `$${text}`;
}

function when(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${day(ms)}, ${hh}:${mm} UTC`;
}

/* ----------------------------------------------------------------- icons */
// Line icons, 24×24, drawn in the text colour. Decorative: always aria-hidden.

const icon = (body, cls = '') => `<svg class="ico${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const I = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.5"/><path d="M14.1 14.2a3 3 0 0 1-4.3-4.3M2 2l20 20"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2"/>',
  wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 11h-5a2 2 0 0 0 0 4h5Z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};

const LOGO = `<img class="logo-night" src="/img/logo.svg" alt="" width="40" height="40"><img class="logo-day" src="/img/logo-day.svg" alt="" width="40" height="40">`;

/** The top bar's links: signed in (`account`, as the door answers it), the
 * person's name where "Sign in" is on every other page; signed out, as the
 * page is written. */
export function nav(account) {
  // The site's pages in the same language: /id/… for Indonesian.
  const site = L('', '/id');
  return account
    ? `<a href="${site}/#decision">Pranata V1</a>
      <a href="${site}/drive">Drive</a>
      <a href="${site}/models">${L('Models', 'Model')}</a>
      <a href="${site}/docs/">${L('Docs', 'Dokumentasi')}</a>
      ${meLink(displayName(account), { current: true, title: L('Your account', 'Akunmu') })}
      <form data-act="signout" class="nav-form"><button class="btn btn-sm btn-ghost" type="submit">${L('Sign out', 'Keluar')}</button></form>`
    : `<a href="${site}/#decision">Pranata V1</a>
      <a href="${site}/#pricing">${L('Pricing', 'Harga')}</a>
      <a href="${site}/models">${L('Models', 'Model')}</a>
      <a href="${site}/docs/">${L('Docs', 'Dokumentasi')}</a>
      <a class="nav-account" href="/account/signin">${L('Sign in', 'Masuk')}</a>
      <a class="btn btn-sm btn-primary" href="/account/signup">${L('Create account', 'Buat akun')}</a>`;
}

export function loading() {
  return `<section class="auth"><div class="auth-card card auth-loading"><span class="spinner" aria-hidden="true"></span><p class="auth-sub">${L('Loading your account…', 'Memuat akunmu…')}</p></div></section>`;
}

function alert(kind, text) {
  if (!text) return '';
  return `<div class="alert alert-${kind}" role="${kind === 'err' ? 'alert' : 'status'}"><p>${esc(text)}</p></div>`;
}

const GOOGLE_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z"/></svg>`;
const GITHUB_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>`;

/** Google and GitHub, when the door has them on. `door` is its address. */
function oneClick(opts, next, door, ref) {
  const q = new URLSearchParams();
  if (next) q.set('next', next);
  if (ref) q.set('ref', ref);
  const tail = q.toString() ? `?${q}` : '';
  const buttons = [];
  if (opts.google) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="${esc(`${door}/oauth/google${tail}`)}">${GOOGLE_ICON}<span>${L('Continue with Google', 'Lanjut dengan Google')}</span></a>`);
  if (opts.github) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="${esc(`${door}/oauth/github${tail}`)}">${GITHUB_ICON}<span>${L('Continue with GitHub', 'Lanjut dengan GitHub')}</span></a>`);
  if (!buttons.length) return '';
  return `<div class="auth-oneclick">${buttons.join('')}</div><p class="auth-or"><span>${L('or with your email', 'atau dengan email')}</span></p>`;
}

/** A password box with a show/hide button and a Caps Lock note (app.js). */
function password({ id, label, name = 'password', autocomplete, hint = '', side = '', min = 0 }) {
  return `<div class="field">
      <div class="label-row"><label for="${id}">${label}${hint ? ` <small>${hint}</small>` : ''}</label>${side}</div>
      <div class="pw">
        <input id="${id}" type="password" name="${name}" autocomplete="${autocomplete}" required${min ? ` minlength="${min}"` : ''} maxlength="200">
        <button class="pw-toggle" type="button" data-reveal="${id}" aria-controls="${id}" aria-pressed="false" aria-label="${L('Show password', 'Tampilkan kata sandi')}">${icon(I.eye, 'i-show')}${icon(I.eyeOff, 'i-hide')}</button>
      </div>
      <p class="field-note caps-note" hidden>${L('Caps Lock is on.', 'Caps Lock menyala.')}</p>
    </div>`;
}

// What one Zeiko Account gives, beside the sign-in and sign-up forms.
const authAside = () => `<aside class="auth-aside" aria-label="${L('About Zeiko Accounts', 'Tentang Akun Zeiko')}">
    <p class="auth-kicker">${LOGO}<span>${L('Zeiko Account', 'Akun Zeiko')}</span></p>
    <p class="auth-pitch">${L('One sign-in for ZeikoAI, Zeiko Chat and Zeiko Drive.', 'Satu kali masuk untuk ZeikoAI, Zeiko Chat, dan Zeiko Drive.')}</p>
    <ul class="auth-points">
      <li>${icon(I.layers)}<span>${L('<strong>Every product, one login.</strong> Email and password, Google or GitHub — it works in Zeiko Chat and Zeiko Drive too.', '<strong>Semua produk, satu login.</strong> Email dan kata sandi, Google, atau GitHub — juga berlaku di Zeiko Chat dan Zeiko Drive.')}</span></li>
      <li>${icon(I.wallet)}<span>${L('<strong>One balance.</strong> Add funds once; they pay for Pranata V1 calls and Zeiko Chat replies.', '<strong>Satu saldo.</strong> Isi sekali; saldonya membayar panggilan Pranata V1 dan balasan Zeiko Chat.')}</span></li>
      <li>${icon(I.key)}<span>${L('<strong>Your key, kept here.</strong> Plans, usage and your Pranata V1 key on one page.', '<strong>Kuncimu ada di sini.</strong> Paket, pemakaian, dan kunci Pranata V1-mu di satu halaman.')}</span></li>
    </ul>
  </aside>`;

function authShell(heading, sub, inner, { aside = false } = {}) {
  return `<section class="auth${aside ? ' auth-split' : ''}">
  <div class="auth-grid">
    ${aside ? authAside() : ''}
    <div class="auth-card card">
      <p class="auth-logo">${LOGO}</p>
      <h1>${heading}</h1>
      ${sub ? `<p class="auth-sub">${sub}</p>` : ''}
      ${inner}
    </div>
  </div>
</section>`;
}

/** Where the sign-in pages say the visitor is headed, when an app sent them. */
const GOING_TO = { drive: 'Zeiko Drive' };

export function signIn({ error, notice, email = '', next = '', app = '', opts, door }) {
  const sub = GOING_TO[app]
    ? L(`Sign in to your Zeiko Account to open ${GOING_TO[app]}.`, `Masuk ke Akun Zeiko-mu untuk membuka ${GOING_TO[app]}.`)
    : L('Sign in to your Zeiko Account.', 'Masuk ke Akun Zeiko-mu.');
  return authShell(L('Welcome back', 'Selamat datang kembali'), sub, `
    ${alert('err', error)}${alert('ok', notice)}
    ${oneClick(opts, next, door, '')}
    <form data-act="signin" class="form">
      <input type="hidden" name="next" value="${esc(next)}">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254" value="${esc(email)}"></label>
      ${password({ id: 'signin-password', label: L('Password', 'Kata sandi'), autocomplete: 'current-password', side: `<a href="/account/forgot">${L('Forgot it?', 'Lupa?')}</a>` })}
      <button class="btn btn-primary btn-block" type="submit" data-busy="${L('Signing in…', 'Sedang masuk…')}">${L('Sign in', 'Masuk')}</button>
    </form>
    <p class="auth-foot">${L('New here?', 'Baru di sini?')} <a href="/account/signup${next ? `?next=${encodeURIComponent(next)}` : ''}">${L('Create an account', 'Buat akun')}</a></p>`, { aside: true });
}

export function signUp({ error, email = '', username = '', next = '', app = '', ref = '', opts, door }) {
  const sub = GOING_TO[app]
    ? L(`Free to make. One account for ${GOING_TO[app]}, Pranata V1 and Zeiko Chat.`, `Gratis dibuat. Satu akun untuk ${GOING_TO[app]}, Pranata V1, dan Zeiko Chat.`)
    : L('Free to make. Buy a plan or add balance when you are ready.', 'Gratis dibuat. Beli paket atau isi saldo kapan pun kamu siap.');
  return authShell(L('Create your Zeiko Account', 'Buat Akun Zeiko-mu'), sub, `
    ${alert('err', error)}
    ${oneClick(opts, next, door, ref)}
    <form data-act="signup" class="form">
      <input type="hidden" name="next" value="${esc(next)}">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254" value="${esc(email)}"></label>
      <label>${L('Username <small>3–24 letters, numbers or _</small>', 'Nama pengguna <small>3–24 huruf, angka, atau _</small>')}<input type="text" name="username" autocomplete="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocapitalize="off" spellcheck="false" value="${esc(username)}"></label>
      ${password({ id: 'signup-password', label: L('Password', 'Kata sandi'), autocomplete: 'new-password', hint: L('8 characters or more', '8 karakter atau lebih'), min: 8 })}
      <details class="ref-field"${ref ? ' open' : ''}>
        <summary>${L('Have a referral code?', 'Punya kode referral?')}</summary>
        <label>${L('Referral code <small>optional</small>', 'Kode referral <small>opsional</small>')}<input type="text" name="referral" maxlength="32" autocapitalize="characters" spellcheck="false" value="${esc(ref)}"></label>
      </details>
      <button class="btn btn-primary btn-block" type="submit" data-busy="${L('Creating your account…', 'Membuat akunmu…')}">${L('Create account', 'Buat akun')}</button>
    </form>
    <p class="auth-foot">${L('Already have one?', 'Sudah punya?')} <a href="/account/signin${next ? `?next=${encodeURIComponent(next)}` : ''}">${L('Sign in', 'Masuk')}</a></p>`, { aside: true });
}

export function forgot({ error, sent }) {
  if (sent) {
    return authShell(L('Check your inbox', 'Cek kotak masukmu'), '', `<div class="auth-done">${icon(I.mail)}</div>
      <p class="auth-sub">${L('If that email has an account, a link to choose a new password is on its way. It works for 30 minutes, here, in Zeiko Chat and in Zeiko Drive.', 'Kalau email itu punya akun, link untuk membuat kata sandi baru sedang dikirim. Berlaku 30 menit, di sini, di Zeiko Chat, dan di Zeiko Drive.')}</p>
      <a class="btn btn-ghost btn-block" href="/account/signin">${L('Back to sign in', 'Kembali ke halaman masuk')}</a>`);
  }
  return authShell(L('Forgot your password?', 'Lupa kata sandi?'), L('Type your email and we will send you a link to choose a new one.', 'Ketik email-mu dan kami kirim link untuk membuat yang baru.'), `
    ${alert('err', error)}
    <form data-act="forgot" class="form">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254"></label>
      <button class="btn btn-primary btn-block" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L('Send the link', 'Kirim link')}</button>
    </form>
    <p class="auth-foot"><a href="/account/signin">${L('Back to sign in', 'Kembali ke halaman masuk')}</a></p>`);
}

/** The page the reset email links to: the token is in the address. */
export function reset({ error, token }) {
  return authShell(L('Choose a new password', 'Buat kata sandi baru'), L('It works here, in Zeiko Chat and in Zeiko Drive.', 'Berlaku di sini, di Zeiko Chat, dan di Zeiko Drive.'), `
    ${alert('err', error)}
    <form data-act="reset" class="form">
      <input type="hidden" name="token" value="${esc(token)}">
      ${password({ id: 'reset-password', label: L('New password', 'Kata sandi baru'), autocomplete: 'new-password', hint: L('8 characters or more', '8 karakter atau lebih'), min: 8 })}
      <button class="btn btn-primary btn-block" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Save and sign in', 'Simpan dan masuk')}</button>
    </form>`);
}

export function message({ heading, text, link = '/account', label = L('Go to your account', 'Buka akunmu') }) {
  return authShell(esc(heading), '', `<p class="auth-sub">${esc(text)}</p><a class="btn btn-primary btn-block" href="${esc(link)}">${esc(label)}</a>`);
}

/* ---------------------------------------------------------------- account */

const tabs = () => [
  ['overview', '/account', L('Overview', 'Ringkasan')],
  ['plans', '/account/plans', L('Plans & balance', 'Paket & saldo')],
  ['key', '/account/key', L('API key', 'Kunci API')],
  ['settings', '/account/settings', L('Settings', 'Pengaturan')],
];
// Account pages that are not tabs: reached by a link, titled here.
const pages = () => ({ howtobuy: L('How to pay', 'Cara membayar'), pay: L('Pay by QRIS', 'Bayar dengan QRIS') });

function verifyBanner(a) {
  return `<div class="verify" role="status">
      <span class="verify-icon">${icon(I.mail)}</span>
      <div class="verify-text">
        <p class="verify-title">${L('Confirm your email', 'Konfirmasi email-mu')}</p>
        <p>${L(`We sent a 6-digit code to <strong>${esc(a.email)}</strong>. Renewal links for plans go there too.`, `Kami mengirim kode 6 digit ke <strong>${esc(a.email)}</strong>. Link perpanjangan paket juga dikirim ke sana.`)}</p>
      </div>
      <div class="verify-actions">
        <form data-act="verify-code" class="verify-form">
          <label class="sr" for="verify-code">${L('Confirmation code', 'Kode konfirmasi')}</label>
          <input id="verify-code" class="otp" type="text" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required>
          <button class="btn btn-sm btn-primary" type="submit" data-busy="${L('Checking…', 'Memeriksa…')}">${L('Confirm', 'Konfirmasi')}</button>
        </form>
        <form data-act="verify-send"><button class="btn-link" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L('Send a new code', 'Kirim kode baru')}</button></form>
      </div>
    </div>`;
}

function shell(tab, o, inner, flash) {
  const a = o.account;
  const name = displayName(a) || L('there', 'kamu');
  const tabbed = tabs().find((t) => t[0] === tab);
  const title = tab === 'overview' ? L(`Hi, ${esc(name)}`, `Hai, ${esc(name)}`) : esc(tabbed ? tabbed[2] : pages()[tab]);
  return `<section class="acct">
  <div class="wrap">
    <header class="acct-head">
      <div class="acct-title">
        <p class="crumbs">${L('Zeiko Account', 'Akun Zeiko')}</p>
        <h1>${title}</h1>
      </div>
      <div class="acct-who"><span class="avatar" aria-hidden="true">${esc((name[0] || 'Z').toUpperCase())}</span><span class="acct-who-text"><strong>${esc(a.username ? '@' + a.username : name)}</strong><span>${esc(a.email || '')}</span></span></div>
    </header>
    <nav class="acct-tabs" aria-label="${L('Account sections', 'Bagian akun')}">
      ${tabs().map(([id, href, label]) => `<a href="${href}"${id === tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    ${flash || ''}
    ${!a.emailVerified && a.email && o.mail ? verifyBanner(a) : ''}
    ${inner}
  </div>
</section>`;
}

/** A thin progress bar, drawn as SVG so the page needs no inline styles. */
function bar(share) {
  const w = Math.max(0, Math.min(1, share)) * 100;
  const tone = share >= 0.9 ? 'bad' : share >= 0.75 ? 'warn' : 'ok';
  return `<svg class="meter meter-${tone}" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><rect class="meter-track" x="0" y="0" width="100" height="8" rx="4"/><rect class="meter-fill" x="0" y="0" width="${w.toFixed(2)}" height="8" rx="4"/></svg>`;
}

function planCard(o) {
  const p = o.plan;
  const u = o.usage;
  if (u) {
    const left = Math.max(0, u.amount - u.used);
    const share = u.amount ? u.used / u.amount : 0;
    return `<article class="card stat-card">
      <p class="stat-label">${icon(I.layers)}${L('Plan', 'Paket')}</p>
      <p class="stat-value">${esc(p.name)}</p>
      <p class="stat-sub">${L(`<strong>${num(left)}</strong> of ${num(u.amount)} requests left`, `Sisa <strong>${num(left)}</strong> dari ${num(u.amount)} permintaan`)}</p>
      ${bar(share)}
      <p class="stat-foot">${L(`${Math.round(share * 100)}% used · resets ${esc(day(u.resetsAt))}`, `${Math.round(share * 100)}% terpakai · direset ${esc(day(u.resetsAt))}`)}${p.expiresAt ? L(` · ends ${esc(day(p.expiresAt))}`, ` · berakhir ${esc(day(p.expiresAt))}`) : ''}</p>
      <a class="btn btn-ghost btn-sm" href="/account/plans">${L('Change plan', 'Ganti paket')}</a>
    </article>`;
  }
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.layers)}${L('Plan', 'Paket')}</p>
    <p class="stat-value">${p.paygo ? L('Per token', 'Per token') : L('No plan yet', 'Belum ada paket')}</p>
    <p class="stat-sub">${p.paygo ? L('Every call is paid from your balance.', 'Setiap panggilan dibayar dari saldomu.') : L('Buy a plan, or add balance, to start calling Pranata V1.', 'Beli paket, atau isi saldo, untuk mulai memanggil Pranata V1.')}</p>
    <p class="stat-foot">${L('A plan gives you a set number of requests for 30 days.', 'Paket memberimu sejumlah permintaan untuk 30 hari.')}</p>
    <a class="btn btn-primary btn-sm" href="/account/plans">${L('See plans', 'Lihat paket')}</a>
  </article>`;
}

function balanceCard(o) {
  const low = Number(o.balance.micro) <= 0;
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.wallet)}${L('Balance', 'Saldo')}</p>
    <p class="stat-value">${esc(o.balance.text)}</p>
    <p class="stat-sub">${L('Pays for Pranata V1 calls past your plan and Zeiko Chat replies past your chat plan.', 'Membayar panggilan Pranata V1 di luar paketmu dan balasan Zeiko Chat di luar paket chat-mu.')}</p>
    <p class="stat-foot">${o.balance.shared ? L('The same balance in Zeiko Chat.', 'Saldo yang sama di Zeiko Chat.') : ''}</p>
    ${o.owed && Number(o.owed.micro) > 0 && o.owed.text ? `<p class="stat-owed">${icon(I.alert)}<span>${L(`You owe <strong>${esc(o.owed.text)}</strong> for playground tries past your plan. It comes off the next balance you add.`, `Kamu berutang <strong>${esc(o.owed.text)}</strong> untuk percobaan playground di luar paketmu. Dipotong dari saldo berikutnya yang kamu isi.`)}</span></p>` : ''}
    <a class="btn ${low ? 'btn-primary' : 'btn-ghost'} btn-sm" href="/account/plans#topup">${L('Add balance', 'Isi saldo')}</a>
  </article>`;
}

function keyCard(o) {
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.key)}${L('API key', 'Kunci API')}</p>
    <p class="stat-value stat-mono">${o.key ? esc(o.key.shown) : L('Not ready yet', 'Belum siap')}</p>
    <p class="stat-sub">${L('Works with every model on your plan or balance.', 'Berlaku untuk setiap model di paket atau saldomu.')}</p>
    <p class="stat-foot">${o.models.map((m) => `<code>${esc(m.id)}</code>`).join(' ')}</p>
    <a class="btn btn-ghost btn-sm" href="/account/key">${L('Show and copy', 'Tampilkan dan salin')}</a>
  </article>`;
}

function compact(v) {
  if (v >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
  return String(Math.round(v));
}

/** Calls per day, the last 30 days: thin bars, a hairline grid, a table under.
 *  The bars stretch to any width; the labels are plain text beside them, so
 *  they stay readable on a phone and on a wide screen alike. */
function usageChart(daily) {
  const DAY = 86_400_000;
  const today = Date.now() - (Date.now() % DAY);
  const byDay = new Map((daily || []).map((d) => [d.day, d]));
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const t = today - i * DAY;
    days.push(byDay.get(t) || { day: t, calls: 0, units: 0, inputTokens: 0 });
  }
  const total = days.reduce((s, d) => s + d.calls, 0);
  if (!total) {
    return `<div class="empty">${icon(I.layers)}<p>${L('<strong>No calls in the last 30 days yet.</strong> Once your key is in use, each day shows up here.', '<strong>Belum ada panggilan dalam 30 hari terakhir.</strong> Begitu kuncimu dipakai, setiap harinya tampil di sini.')}</p><a class="btn btn-ghost btn-sm" href="/account/key">${L('Get your key', 'Ambil kuncimu')}</a></div>`;
  }
  const units = days.reduce((s, d) => s + d.units, 0);
  const tokens = days.reduce((s, d) => s + d.inputTokens, 0);
  const max = Math.max(...days.map((d) => d.calls), 1);
  const nice = (v) => {
    const p = 10 ** Math.floor(Math.log10(v));
    const n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  };
  const top = nice(max);
  const W = 300, H = 100, step = W / days.length;
  const grid = [0, 0.5, 1].map((f) => `<line class="grid" x1="0" x2="${W}" y1="${(H - f * H).toFixed(2)}" y2="${(H - f * H).toFixed(2)}"/>`).join('');
  const bars = days.map((d, i) => {
    const h = (d.calls / top) * H;
    return `<rect x="${(i * step + step * 0.18).toFixed(2)}" y="${(H - h).toFixed(2)}" width="${(step * 0.64).toFixed(2)}" height="${Math.max(h, d.calls ? 0.8 : 0).toFixed(2)}"><title>${esc(day(d.day))}: ${num(d.calls)} ${L('calls', 'panggilan')}</title></rect>`;
  }).join('');
  const short = (d) => esc(day(d.day).replace(/ \d{4}$/, ''));
  const rows = days.filter((d) => d.calls).reverse().map((d) => `<tr><th scope="row">${esc(day(d.day))}</th><td>${num(d.calls)}</td><td>${num(d.units)}</td><td>${num(d.inputTokens)}</td></tr>`).join('');
  return `<dl class="usage-sums">
      <div><dt>${L('Calls', 'Panggilan')}</dt><dd>${num(total)}</dd></div>
      <div><dt>${L('Plan requests', 'Permintaan paket')}</dt><dd>${num(units)}</dd></div>
      <div><dt>${L('Input tokens', 'Token input')}</dt><dd>${esc(compact(tokens))}</dd></div>
    </dl>
    <figure class="uchart">
      <figcaption class="sr">${L('Calls per day over the last 30 days, UTC', 'Panggilan per hari selama 30 hari terakhir, UTC')}</figcaption>
      <div class="uchart-y" aria-hidden="true"><span>${esc(compact(top))}</span><span>${esc(compact(top / 2))}</span><span>0</span></div>
      <div class="uchart-plot"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${L('Calls per day over the last 30 days', 'Panggilan per hari selama 30 hari terakhir')}"><g>${grid}</g><g class="bars">${bars}</g></svg></div>
      <div class="uchart-x" aria-hidden="true"><span>${short(days[0])}</span><span>${short(days[15])}</span><span>${L('Today', 'Hari ini')}</span></div>
    </figure>
    <details class="perf-table"><summary>${L('Show as a table', 'Tampilkan sebagai tabel')}</summary>
      <div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">${L('Day', 'Hari')}</th><th scope="col">${L('Calls', 'Panggilan')}</th><th scope="col">${L('Plan requests', 'Permintaan paket')}</th><th scope="col">${L('Input tokens', 'Token input')}</th></tr></thead><tbody>${rows}</tbody></table></div>
    </details>`;
}

const status = () => ({
  waiting: [L('Waiting for payment', 'Menunggu pembayaran'), 'warn'],
  new: [L('Waiting for payment', 'Menunggu pembayaran'), 'warn'],
  confirming: [L('Confirming', 'Mengonfirmasi'), 'warn'],
  confirmed: [L('Confirming', 'Mengonfirmasi'), 'warn'],
  sending: [L('Confirming', 'Mengonfirmasi'), 'warn'],
  partially_paid: [L('Partly paid', 'Dibayar sebagian'), 'warn'],
  finished: [L('Paid', 'Lunas'), 'ok'],
  failed: [L('Failed', 'Gagal'), 'err'],
  refunded: [L('Refunded', 'Dikembalikan'), ''],
  expired: [L('Expired', 'Kedaluwarsa'), ''],
});

function payments(list) {
  if (!list.length) return `<div class="empty">${icon(I.wallet)}<p>${L('<strong>No payments yet.</strong> Plans and balance you buy show up here.', '<strong>Belum ada pembayaran.</strong> Paket dan saldo yang kamu beli tampil di sini.')}</p></div>`;
  const rows = list.map((p) => {
    const [label, tone] = p.paid ? [L('Paid', 'Lunas'), 'ok'] : status()[p.status] || [p.status, ''];
    const qris = p.method === 'qris';
    const open = qris
      ? (!p.paid && ['waiting', 'confirming'].includes(p.status) ? `<a class="btn btn-ghost btn-xs" href="/account/pay?id=${encodeURIComponent(p.id)}">${p.status === 'waiting' ? L('Open QR', 'Buka QR') : L('See status', 'Lihat status')}</a>` : '')
      : p.invoiceUrl && !p.paid ? `<a class="btn btn-ghost btn-xs" href="${esc(p.invoiceUrl)}" rel="noopener">${L('Finish paying', 'Selesaikan pembayaran')}</a>` : '';
    return `<tr><th scope="row">${esc(p.what)}</th><td data-label="${L('Amount', 'Jumlah')}">${esc(p.amountText)}${qris && p.localText ? `<small class="ledger-local">${esc(p.localText)} · QRIS</small>` : ''}</td><td data-label="${L('Status', 'Status')}"><span class="tag tag-${tone}">${esc(label)}</span></td><td data-label="${L('Date', 'Tanggal')}">${esc(day(p.createdAt))}</td><td class="ledger-act">${open}</td></tr>`;
  }).join('');
  return `<div class="table-scroll"><table class="table acct-table ledger"><thead><tr><th scope="col">${L('What', 'Apa')}</th><th scope="col">${L('Amount', 'Jumlah')}</th><th scope="col">Status</th><th scope="col">${L('Date', 'Tanggal')}</th><th scope="col"><span class="sr">${L('Action', 'Aksi')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function chatStrip(o) {
  const c = o.chat || {};
  if (!c.planName) return '';
  const link = c.url ? `<a class="btn btn-ghost btn-sm" href="${esc(c.url)}" rel="noopener">${L('Open Zeiko Chat', 'Buka Zeiko Chat')}${icon(I.out)}</a>` : '';
  return `<section class="card acct-strip">
    <span class="strip-icon">${icon(I.chat)}</span>
    <div class="strip-text"><p class="stat-label">Zeiko Chat</p><p class="strip-main">${L(`<strong>${esc(c.planName)}</strong> plan`, `Paket <strong>${esc(c.planName)}</strong>`)}${c.expiresAt ? L(` · until ${esc(day(c.expiresAt))}`, ` · sampai ${esc(day(c.expiresAt))}`) : ''}</p>
    <p class="muted-note">${L('The same account signs in there', 'Akun yang sama dipakai untuk masuk di sana')}${o.balance.shared ? L(', and the same balance pays for replies past your chat plan', ', dan saldo yang sama membayar balasan di luar paket chat-mu') : ''}.</p></div>
    ${link}
  </section>`;
}

export function overview(o, flash) {
  const body = `
    <div class="stat-grid">${planCard(o)}${balanceCard(o)}${keyCard(o)}</div>
    ${chatStrip(o)}
    <section class="card acct-section">
      <div class="section-row"><h2>${L('Usage', 'Pemakaian')}</h2><p class="muted-note">${L('Last 30 days, UTC', '30 hari terakhir, UTC')}</p></div>
      ${usageChart(o.daily)}
    </section>
    <section class="card acct-section">
      <div class="section-row"><h2>${L('Payments', 'Pembayaran')}</h2><span class="row-links"><a class="btn-link" href="/account/how-to-buy">${L('How to pay', 'Cara membayar')}</a><a class="btn btn-ghost btn-sm" href="/account/plans">${L('Buy a plan or add balance', 'Beli paket atau isi saldo')}</a></span></div>
      ${payments(o.payments)}
    </section>`;
  return shell('overview', o, body, flash);
}

export function plans(o, { flash, pick }) {
  const crypto = Boolean(o.paymentsActive);
  const qris = Boolean(o.qris && o.qris.active);
  const buying = crypto || qris;
  // One card for a Pranata V1 plan or a Zeiko Chat one; `product` tells the
  // checkout which. Crypto and QRIS are two buttons of one form.
  const card = (p, product, current) => {
    const mine = p.id === current;
    const picked = product === 'pranata' && p.id === pick;
    const offer = p.promo || null;
    const days = offer ? offer.days : p.days;
    const which = `<input type="hidden" name="product" value="${product}"><input type="hidden" name="plan" value="${esc(p.id)}">`;
    const label = mine ? L(`Add ${num(days)} days`, `Tambah ${num(days)} hari`) : L(`Buy for ${num(days)} days`, `Beli untuk ${num(days)} hari`);
    const by = L('with', 'dengan');
    const first = picked || mine || offer ? 'btn-primary' : 'btn-ghost';
    // Both ways to pay: one line saying what the press buys, then a button
    // for each way side by side (each still says it in full to a reader).
    const buttons = crypto && qris
      ? `<p class="plan-ways-label">${label} ${by}</p>
        <div class="plan-ways">
          <button class="btn ${first} btn-sm" type="submit" name="method" value="crypto" data-busy="${L('Opening…', 'Membuka…')}"><span class="sr">${label} ${by} </span>${L('Crypto', 'Kripto')}</button>
          <button class="btn btn-ghost btn-sm" type="submit" name="method" value="qris" data-busy="${L('Opening…', 'Membuka…')}"><span class="sr">${label} ${by} </span>QRIS</button>
        </div>`
      : [
        crypto ? `<button class="btn ${first} btn-block" type="submit" name="method" value="crypto" data-busy="${L('Opening…', 'Membuka…')}">${label}</button>` : '',
        qris ? `<button class="btn ${first} btn-block" type="submit" name="method" value="qris" data-busy="${L('Opening…', 'Membuka…')}">${label} · QRIS</button>` : '',
      ].join('');
    const forms = buying
      ? `<form data-act="buy">${which}${buttons}</form>
        ${crypto && p.subscription && o.subscriptionsActive ? `<form data-act="subscribe">${which}<button class="btn-link" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L(`Or renew every ${num(p.days)} days by email`, `Atau perpanjang setiap ${num(p.days)} hari lewat email`)}</button></form>` : ''}`
      : '';
    const what = p.requests
      ? L(`<strong>${num(p.requests)}</strong> requests`, `<strong>${num(p.requests)}</strong> permintaan`) + (offer ? L(` every ${num(p.days)} days`, ` setiap ${num(p.days)} hari`) : '')
      : esc(p.tagline || L('Zeiko Chat plan', 'Paket Zeiko Chat'));
    const offerNote = offer
      ? `<p class="acct-plan-offer">${icon(I.gift)}<span>${L(`<strong>Opening offer:</strong> ${num(offer.days)} days for the price of ${num(p.days)}`, `<strong>Penawaran pembuka:</strong> ${num(offer.days)} hari dengan harga ${num(p.days)} hari`)}${offer.until ? L(`, until ${esc(day(offer.until - 1))}`, `, sampai ${esc(day(offer.until - 1))}`) : ''}${offer.left != null ? L(` · ${num(offer.left)} place${offer.left === 1 ? '' : 's'} left`, ` · sisa ${num(offer.left)} tempat`) : ''}.</span></p>`
      : '';
    return `<article class="acct-plan${picked ? ' is-picked' : ''}${mine ? ' is-mine' : ''}${offer ? ' has-offer' : ''}" id="${product === 'chat' ? 'chat-' : ''}plan-${esc(p.id)}">
      <div class="acct-plan-top"><h3>${esc(p.name)}</h3>${mine ? `<span class="tag tag-ok">${icon(I.check)}${L('Your plan', 'Paketmu')}</span>` : ''}</div>
      <p class="acct-plan-price">${esc(usd(p.priceUsd))}<span> / ${num(days)} ${L('days', 'hari')}</span></p>
      <p class="acct-plan-what">${what}</p>
      ${offerNote}
      <div class="plan-actions">${forms}</div>
    </article>`;
  };
  const cards = o.plans.map((p) => card(p, 'pranata', o.plan.id)).join('');
  const chat = o.chat || {};
  const chatCards = (chat.plans || []).map((p) => card(p, 'chat', chat.plan)).join('');
  const chips = (o.topUps || []).map((n) => `<button class="chip-btn" type="submit" name="amount" value="${esc(n)}" data-busy="…">${esc(usd(n))}</button>`).join('');
  const subs = (o.subscriptions || []).filter((s) => s.status && !['EXPIRED', 'CANCELED', 'CANCELLED'].includes(s.status));
  const method = crypto && qris
    ? `<fieldset class="funds-way"><legend>${L('Pay with', 'Bayar dengan')}</legend>
        <label><input type="radio" name="method" value="crypto" checked> ${L('Crypto', 'Kripto')}</label>
        <label><input type="radio" name="method" value="qris"> QRIS (rupiah)</label>
      </fieldset>`
    : `<input type="hidden" name="method" value="${qris ? 'qris' : 'crypto'}">`;
  const ways = [
    crypto ? L('in crypto on the NOWPayments page, and come back here. Network and exchange fees are yours', 'dengan kripto di halaman NOWPayments, lalu kembali ke sini. Biaya jaringan dan exchange kamu tanggung') : '',
    qris ? L('by QRIS in rupiah from any Indonesian bank or e-wallet app (and apps in Malaysia, Singapore and Thailand that pay QRIS abroad); we check each one by hand, usually within 10 minutes', 'dengan QRIS dalam rupiah dari aplikasi bank atau e-wallet Indonesia mana pun (dan aplikasi di Malaysia, Singapura, dan Thailand yang bisa membayar QRIS dari luar negeri); kami memeriksa satu per satu secara manual, biasanya dalam 10 menit') : '',
  ].filter(Boolean);
  const body = `
    ${!buying ? alert('warn', L('Buying online is not open yet. Please try again later.', 'Pembelian online belum dibuka. Coba lagi nanti.')) : ''}
    <section class="acct-section-plain">
      <div class="section-row"><h2>${L('Pranata V1 plans', 'Paket Pranata V1')}</h2><p class="muted-note">${L('A call over 1,024 tokens counts as two requests', 'Panggilan lebih dari 1.024 token dihitung dua permintaan')}</p></div>
      <div class="acct-plans">${cards}</div>
      <p class="fineprint">${L('Buying the plan you are on adds its days to it. Buying another starts it now, and what is left of the current one comes back to your balance.', 'Membeli paket yang sedang kamu pakai menambah harinya. Membeli paket lain langsung memulainya, dan sisa paket sekarang kembali ke saldomu.')}${subs.length ? L(` Renewing: ${subs.map((s) => esc(s.planName)).join(', ')} — the next link arrives by email.`, ` Diperpanjang: ${subs.map((s) => esc(s.planName)).join(', ')} — link berikutnya datang lewat email.`) : ''}</p>
    </section>
    ${chatCards ? `<section class="acct-section-plain" id="chat">
      <div class="section-row"><h2>${L('Zeiko Chat plans', 'Paket Zeiko Chat')}</h2><p class="muted-note">${L('The same account signs in to Zeiko Chat', 'Akun yang sama dipakai untuk masuk ke Zeiko Chat')}</p></div>
      <div class="acct-plans">${chatCards}</div>
    </section>` : ''}
    <section class="card acct-section" id="topup">
      <div class="section-row"><h2>${L('Balance', 'Saldo')}</h2><p class="balance-now">${esc(o.balance.text)}</p></div>
      <p class="muted-note">${L('Your balance pays for Pranata V1 calls past your plan and for Zeiko Chat replies past your chat plan. It is the same balance in Zeiko Chat.', 'Saldomu membayar panggilan Pranata V1 di luar paketmu dan balasan Zeiko Chat di luar paket chat-mu. Saldonya sama dengan di Zeiko Chat.')}</p>
      ${buying ? `<form data-act="topup" class="funds">
        ${method}
        <div class="chips-row" role="group" aria-label="${L('Add this amount', 'Tambah jumlah ini')}">${chips}</div>
        <div class="funds-custom">
          <label>${L('Other amount, USD', 'Jumlah lain, USD')}<input type="number" name="custom" min="${esc(o.minTopUpUsd)}" max="${esc(o.maxTopUpUsd)}" step="1" inputmode="numeric" placeholder="${esc(o.minTopUpUsd)}–${esc(o.maxTopUpUsd)}"></label>
          <button class="btn btn-primary" type="submit" name="amount" value="custom" data-busy="${L('Opening…', 'Membuka…')}">${L('Add balance', 'Isi saldo')}</button>
        </div>
      </form>` : ''}
      ${ways.length ? `<p class="fineprint">${L('You pay', 'Kamu membayar')} ${ways.join(L('; or ', '; atau '))}. <a href="/account/how-to-buy">${L('How to pay, step by step', 'Cara membayar, langkah demi langkah')}</a></p>` : ''}
    </section>`;
  return shell('plans', o, body, flash);
}

/** The QR as SVG, from the door's rows of 0 and 1 (dark is 1), with the
 * quiet zone round it. Black on white whatever the theme: that is what a
 * scanner reads. Anything but 0 and 1 draws nothing. */
function qrSvg(rows) {
  if (!Array.isArray(rows) || !rows.length || !rows.every((r) => typeof r === 'string' && /^[01]+$/.test(r) && r.length === rows.length)) return '';
  const quiet = 4;
  const size = rows.length + quiet * 2;
  let d = '';
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x += 1) {
      if (r[x] !== '1') continue;
      let end = x;
      while (end + 1 < r.length && r[end + 1] === '1') end += 1;
      d += `M${x + quiet} ${y + quiet}h${end - x + 1}v1h-${end - x + 1}z`;
      x = end;
    }
  });
  return `<svg class="qris-svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="${L('QRIS code to scan', 'Kode QRIS untuk di-scan')}"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${d}" fill="#000000"/></svg>`;
}

/** A QRIS payment: the code to scan and the exact rupiah while it is open,
 * then where it stands. app.js redraws it every few seconds until it is
 * paid, turned down or closed. */
export function qrisPay(o, q, flash) {
  // A Zeiko Drive payment goes back to Drive (app.js checks the address).
  const drive = q.product === 'drive' && q.driveBack ? String(q.driveBack) : '';
  const back = drive || (q.product === 'chat' ? '/account/plans#chat' : '/account/plans');
  let body;
  if (q.status === 'waiting') {
    const left = Math.max(0, Math.ceil((Number(q.expiresAt) - Date.now()) / 60000));
    body = `<section class="card acct-section qris">
      <div class="qris-grid">
        <div class="qris-code">
          ${qrSvg(q.qr)}
          <p class="qris-merchant"><strong>${esc(q.merchant)}</strong><span>NMID ${esc(q.nmid)}</span></p>
        </div>
        <div class="qris-side">
          <p class="stat-label">${L('Pay exactly', 'Bayar tepat')}</p>
          <p class="qris-amount">${esc(q.rupiahText)}</p>
          <p class="muted-note">${esc(q.what)} · ${esc(q.amountText)}. ${L("The last digits are this payment's own code: send the exact amount, so we can match it to you.", 'Digit terakhir adalah kode khusus pembayaran ini: kirim jumlah yang persis, supaya bisa kami cocokkan denganmu.')}</p>
          <ol class="qris-steps">
            <li>${L('Open an app that pays QRIS: any Indonesian bank or e-wallet. From Malaysia, Singapore or Thailand, an app that pays QRIS abroad.', 'Buka aplikasi yang bisa membayar QRIS: bank atau e-wallet Indonesia mana pun. Dari Malaysia, Singapura, atau Thailand, aplikasi yang bisa membayar QRIS di luar negeri.')}</li>
            <li>${L(`Scan the code. The amount fills in by itself: check it reads <strong>${esc(q.rupiahText)}</strong>.`, `Scan kodenya. Jumlahnya terisi sendiri: pastikan tertulis <strong>${esc(q.rupiahText)}</strong>.`)}</li>
            <li>${L("Pay, then press <strong>I've paid</strong>.", 'Bayar, lalu tekan <strong>Sudah bayar</strong>.')}</li>
          </ol>
          <form data-act="qris-sent"><input type="hidden" name="id" value="${esc(q.id)}"><button class="btn btn-primary btn-block" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L("I've paid", 'Sudah bayar')}</button></form>
          <p class="fineprint">${icon(I.clock)} ${L(`This code closes in ${num(left)} minute${left === 1 ? '' : 's'}. We check every QRIS payment by hand, usually within 10 minutes.`, `Kode ini ditutup dalam ${num(left)} menit. Kami memeriksa setiap pembayaran QRIS secara manual, biasanya dalam 10 menit.`)}</p>
        </div>
      </div>
    </section>`;
  } else {
    const state = {
      confirming: [L('Checking your payment', 'Memeriksa pembayaranmu'), L(`We are looking for ${q.rupiahText} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : 'Your plan or balance switches on'} by itself, and this page updates on its own: you can leave it.`, `Kami sedang mencari ${q.rupiahText} di akun QRIS kami, biasanya dalam 10 menit. ${drive ? 'Zeiko Drive diperbarui' : 'Paket atau saldomu aktif'} dengan sendirinya, dan halaman ini ikut diperbarui: kamu boleh meninggalkannya.`), 'status'],
      paid: [L('Payment received — thank you', 'Pembayaran diterima — terima kasih'), L(`${q.what} is yours.`, `${q.what} sudah jadi milikmu.`), 'ok'],
      failed: [L('We could not find this payment', 'Kami tidak menemukan pembayaran ini'), L(`If you did pay ${q.rupiahText}, write to payment@zeiko.biz.id with the amount, the time and your app's receipt.`, `Kalau kamu memang sudah membayar ${q.rupiahText}, tulis ke payment@zeiko.biz.id beserta jumlah, waktu, dan bukti dari aplikasimu.`), 'err'],
      expired: [L('This code has closed', 'Kode ini sudah ditutup'), L(`It was not marked as paid in time. If you already paid ${q.rupiahText}, write to payment@zeiko.biz.id with your app's receipt; otherwise start a new payment.`, `Kode ini tidak ditandai lunas tepat waktu. Kalau kamu sudah membayar ${q.rupiahText}, tulis ke payment@zeiko.biz.id beserta bukti dari aplikasimu; kalau belum, mulai pembayaran baru.`), 'warn'],
    }[q.status] || [L('Not available right now', 'Sedang tidak tersedia'), L('Try again in a minute.', 'Coba lagi semenit lagi.'), 'warn'];
    const [heading, text, tone] = state;
    body = `<section class="card acct-section qris qris-${esc(tone)}">
      <div class="qris-state">
        ${q.status === 'confirming' ? '<span class="spinner" aria-hidden="true"></span>' : icon(q.status === 'paid' ? I.check : I.alert)}
        <div><h2>${esc(heading)}</h2><p>${esc(text)}</p><p class="muted-note">${esc(q.what)} · ${esc(q.rupiahText)} (${esc(q.amountText)})</p></div>
      </div>
      <div class="row-links">
        ${q.status === 'paid' ? (drive ? `<a class="btn btn-primary btn-sm" href="${esc(drive)}">${L('Back to Zeiko Drive', 'Kembali ke Zeiko Drive')}</a>` : `<a class="btn btn-primary btn-sm" href="/account">${L('Go to your account', 'Buka akunmu')}</a>`) : ''}
        ${q.status === 'failed' || q.status === 'expired' ? `<a class="btn btn-primary btn-sm" href="${esc(back)}">${L('Start a new payment', 'Mulai pembayaran baru')}</a>` : ''}
        ${drive ? '' : `<a class="btn btn-ghost btn-sm" href="/account/plans">${L('Plans &amp; balance', 'Paket &amp; saldo')}</a>`}
      </div>
    </section>`;
  }
  return shell('pay', o, body, flash);
}

/** Right after "I've paid": thanks, then app.js takes the buyer back to
 * their account (or to Zeiko Drive) when the countdown runs out. */
export function qrisThanks(o, q, seconds) {
  const drive = q.product === 'drive' && q.driveBack ? String(q.driveBack) : '';
  const body = `<section class="card acct-section qris qris-ok" role="status">
      <div class="qris-state">
        ${icon(I.check)}
        <div><h2>${L("Thanks, we're gonna check your payment", 'Terima kasih, pembayaranmu akan kami periksa')}</h2><p>${L(`We are looking for ${esc(q.rupiahText)} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : 'Your plan or balance switches on'} by itself.`, `Kami sedang mencari ${esc(q.rupiahText)} di akun QRIS kami, biasanya dalam 10 menit. ${drive ? 'Zeiko Drive diperbarui' : 'Paket atau saldomu aktif'} dengan sendirinya.`)}</p><p class="muted-note">${L(`Taking you back to ${drive ? 'Zeiko Drive' : 'your account'} in <span id="qris-countdown">${num(seconds)}</span> seconds.`, `Kembali ke ${drive ? 'Zeiko Drive' : 'akunmu'} dalam <span id="qris-countdown">${num(seconds)}</span> detik.`)}</p></div>
      </div>
      <div class="row-links">
        <a class="btn btn-primary btn-sm" href="${esc(drive || '/account')}">${drive ? L('Back to Zeiko Drive now', 'Kembali ke Zeiko Drive sekarang') : L('Go to your account now', 'Buka akunmu sekarang')}</a>
      </div>
    </section>`;
  return shell('pay', o, body, '');
}

/** A value with its copy button (main.js copies whatever `data-copy` names). */
function copyRow(id, value, label, primary) {
  return `<div class="key-box">
      <code id="${id}">${esc(value)}</code>
      <button class="btn ${primary ? 'btn-primary' : 'btn-ghost'} btn-sm copy-btn" type="button" data-copy="#${id}" aria-label="${label}">${icon(I.copy)}<span class="copy-label">${L('Copy', 'Salin')}</span></button>
    </div>`;
}

export function key(o, { flash, shown: revealed, apiBase }) {
  const shown = revealed
    ? `${copyRow('the-key', revealed, L('Copy the key', 'Salin kunci'), true)}
       <p class="key-note">${icon(I.alert)}<span>${L('Keep it private: anyone with it can spend your plan and balance. Leave this page and it is hidden again.', 'Rahasiakan: siapa pun yang memegangnya bisa memakai paket dan saldomu. Tinggalkan halaman ini dan kuncinya tersembunyi lagi.')}</span></p>`
    : `<div class="key-box">
         <code>${o.key ? esc(o.key.shown) : L('Not ready yet — try again in a minute', 'Belum siap — coba lagi semenit lagi')}</code>
         ${o.key ? `<form data-act="key-reveal"><button class="btn btn-primary btn-sm" type="submit" data-busy="${L('Showing…', 'Menampilkan…')}">${icon(I.eye)}${L('Show key', 'Tampilkan kunci')}</button></form>` : ''}
       </div>`;
  const models = o.models.map((m) => `<tr><th scope="row"><code id="m-${esc(m.id)}">${esc(m.id)}</code></th><td>${esc(usd(m.usd))} / ${m.unit === 'request' ? L('call', 'panggilan') : L('1M input tokens', '1 juta token input')}</td><td>${num(m.window)} ${L('tokens', 'token')}</td></tr>`).join('');
  const body = `
    <section class="card acct-section">
      <h2>${L('Your key', 'Kuncimu')}</h2>
      ${shown}
      ${apiBase ? `<div class="key-addr"><p class="key-addr-label">${L('Address', 'Alamat')}</p>${copyRow('api-base', apiBase, L('Copy the address', 'Salin alamat'), false)}</div>` : ''}
    </section>
    <section class="card acct-section">
      <h2>${L('Models this key can call', 'Model yang bisa dipanggil kunci ini')}</h2>
      <div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">Model</th><th scope="col">${L('Price', 'Harga')}</th><th scope="col">${L('Longest call', 'Panggilan terpanjang')}</th></tr></thead><tbody>${models || `<tr><td colspan="3">${L('None right now.', 'Belum ada saat ini.')}</td></tr>`}</tbody></table></div>
    </section>
    <section class="card acct-section danger-zone">
      <h2>${L('Make a new key', 'Buat kunci baru')}</h2>
      <p class="muted-note">${L('The current key stops working at once. Do this if it may have been seen by someone else.', 'Kunci sekarang langsung tidak berlaku. Lakukan ini kalau kunci itu mungkin sudah dilihat orang lain.')}</p>
      <form data-act="key-rotate" class="rotate"><label class="check"><input type="checkbox" name="sure" value="1" required> ${L('I understand the old key stops working', 'Aku paham kunci lama tidak akan berlaku lagi')}</label><button class="btn btn-danger btn-sm" type="submit" data-busy="${L('Making…', 'Membuat…')}">${L('Make a new key', 'Buat kunci baru')}</button></form>
    </section>`;
  return shell('key', o, body, flash);
}

/** The buying guide: fixed text (payguide.js), in the account's frame. */
export function howToBuy(o, flash) {
  return shell('howtobuy', o, `<article class="card acct-section guide prose">${getLang() === 'id' ? PAY_GUIDE_ID : PAY_GUIDE}</article>`, flash);
}

export function settings(o, { flash, door }) {
  const a = o.account;
  const opts = o.signInWith || {};
  const ICONS = { Google: GOOGLE_ICON, GitHub: GITHUB_ICON };
  const linked = (on, name) => `<li><span class="linked-name">${ICONS[name]}${name}</span><span class="tag ${on ? 'tag-ok' : ''}">${on ? L('Connected', 'Tersambung') : L('Not connected', 'Belum tersambung')}</span>${!on && opts[name.toLowerCase()] ? `<a class="btn btn-ghost btn-xs" href="${esc(`${door}/oauth/${name.toLowerCase()}?next=/account/settings`)}">${L('Connect', 'Sambungkan')}</a>` : ''}</li>`;
  const body = `
    <section class="card acct-section">
      <h2>${L('Profile', 'Profil')}</h2>
      <dl class="kv">
        <div><dt>${L('Username', 'Nama pengguna')}</dt><dd>${esc(a.username ? '@' + a.username : '—')}</dd></div>
        <div><dt>${L('Name', 'Nama')}</dt><dd>${esc(a.name || '—')}</dd></div>
        <div><dt>Email</dt><dd>${esc(a.email || '—')} ${a.email ? `<span class="tag ${a.emailVerified ? 'tag-ok' : 'tag-warn'}">${a.emailVerified ? L('Confirmed', 'Terkonfirmasi') : L('Not confirmed', 'Belum dikonfirmasi')}</span>` : ''}</dd></div>
        <div><dt>${L('Member since', 'Anggota sejak')}</dt><dd>${esc(day(a.createdAt))}</dd></div>
        ${o.referral && o.referral.code ? `<div><dt>${L('Referral code', 'Kode referral')}</dt><dd><code>${esc(o.referral.code)}</code>${o.referral.discountPct ? L(` · ${esc(o.referral.discountPct)}% off plans`, ` · diskon ${esc(o.referral.discountPct)}% untuk paket`) : ''}</dd></div>` : ''}
      </dl>
    </section>
    <section class="card acct-section">
      <h2>${L('Sign-in methods', 'Cara masuk')}</h2>
      <p class="muted-note">${L('One Zeiko Account: these sign you in here, in Zeiko Chat and in Zeiko Drive.', 'Satu Akun Zeiko: cara-cara ini memasukkanmu di sini, di Zeiko Chat, dan di Zeiko Drive.')}</p>
      <ul class="linked">
        <li><span class="linked-name">${icon(I.mail)}${L('Email and password', 'Email dan kata sandi')}</span><span class="tag ${a.hasPassword ? 'tag-ok' : ''}">${a.hasPassword ? L('Set', 'Sudah dibuat') : L('Not set', 'Belum dibuat')}</span></li>
        ${linked(a.google, 'Google')}
        ${linked(a.github, 'GitHub')}
      </ul>
    </section>
    <div class="settings-pair">
      <section class="card acct-section">
        <h2>${a.hasPassword ? L('Change password', 'Ganti kata sandi') : L('Set a password', 'Buat kata sandi')}</h2>
        <form data-act="password" class="form">
          ${a.hasPassword ? password({ id: 'pw-current', label: L('Current password', 'Kata sandi sekarang'), name: 'current', autocomplete: 'current-password' }) : `<p class="muted-note">${L('Add one to sign in with your email as well.', 'Tambahkan supaya kamu juga bisa masuk dengan email.')}</p>`}
          ${password({ id: 'pw-new', label: L('New password', 'Kata sandi baru'), autocomplete: 'new-password', hint: L('8 characters or more', '8 karakter atau lebih'), min: 8 })}
          <button class="btn btn-primary" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Save password', 'Simpan kata sandi')}</button>
        </form>
      </section>
      ${a.hasPassword ? `<section class="card acct-section">
        <h2>${L('Change email', 'Ganti email')}</h2>
        <p class="muted-note">${L('The new address signs you in here, in Zeiko Chat and in Zeiko Drive once you confirm it with the code we send there.', 'Alamat baru bisa dipakai untuk masuk di sini, di Zeiko Chat, dan di Zeiko Drive setelah kamu konfirmasi dengan kode yang kami kirim ke sana.')}</p>
        <form data-act="email" class="form">
          <label>${L('New email', 'Email baru')}<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254"></label>
          ${password({ id: 'email-current', label: L('Password', 'Kata sandi'), name: 'current', autocomplete: 'current-password' })}
          <button class="btn btn-primary" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Change email', 'Ganti email')}</button>
        </form>
      </section>` : ''}
    </div>
    <section class="card acct-section acct-signout">
      <div><h2>${L('Sign out', 'Keluar')}</h2><p class="muted-note">${L('Signs you out on this device, here and in Zeiko Drive.', 'Keluar di perangkat ini, di sini dan di Zeiko Drive.')}</p></div>
      <form data-act="signout"><button class="btn btn-ghost btn-sm" type="submit" data-busy="${L('Signing out…', 'Sedang keluar…')}">${L('Sign out', 'Keluar')}</button></form>
    </section>`;
  return shell('settings', o, body, flash);
}

export function flash(kind, text) {
  return alert(kind, text);
}

export { when };
