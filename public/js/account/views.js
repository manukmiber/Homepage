// The account area's pages, drawn in the visitor's browser by app.js from
// what the account door answers, in English or Indonesian (lang.js). Every value that came from a visitor or
// from the door goes through `esc`; nothing else is put into a page. Every
// action is a form with `data-act`, which app.js sends to the door.

import { PAY_GUIDE } from './payguide.js';
import { PAY_GUIDE_ID } from './payguide.id.js';
import { displayName, esc, meLink } from './me.js';
import { L, day, getLang, num } from './lang.js';
import { CITIES } from './cities.js';
import { FIELD_LABEL, TEMPLATES } from './templates.js';

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
// The site's own 16×16 pixel icons (public/img/icons), shown at 16 or 32 px
// and never another size. Decorative: the alt text is always empty.

const icon = (name, cls = '') => `<img class="ico px${cls ? ` ${cls}` : ''}" src="/img/icons/${name}.svg" alt="" width="16" height="16">`;
const I = {
  check: 'ok',
  copy: 'copy',
  eye: 'eye',
  eyeOff: 'eye-off',
  mail: 'contact',
  key: 'account',
  wallet: 'wallet',
  layers: 'layers',
  chat: 'roleplay',
  alert: 'warn',
  out: 'out',
  gift: 'gift',
  clock: 'clock',
  pin: 'pin',
};

const LOGO = `<img class="px" src="/img/mark-16.svg" alt="" width="16" height="16">`;

/** The top bar's links: signed in (`account`, as the door answers it), the
 * person's name where "Sign in" is on every other page; signed out, as the
 * page is written. */
export function nav(account) {
  // The site's pages in the same language: /id/… for Indonesian.
  const site = L('', '/id');
  return account
    ? `<a href="${site}/#decision">Pranata V1</a>
      <a href="${site}/drive">Drive</a>
      <a href="${site}/hosting">Hosting</a>
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

/**
 * Where the person lives: the city (required at sign-up — Zeiko Drive's local ads go by it) and an
 * optional postal code. The list only suggests; any city may be typed.
 */
function locationFields({ city = '', postalCode = '' } = {}) {
  return `<label>${L('City <small>where you live: Zeiko Drive shows local ads for it</small>', 'Kota <small>tempat tinggalmu: Zeiko Drive menampilkan iklan lokal untuk kota ini</small>')}<input type="text" name="city" autocomplete="address-level2" required minlength="2" maxlength="60" list="city-list" value="${esc(city)}"></label>
      <label>${L('Postal code <small>optional</small>', 'Kode pos <small>opsional</small>')}<input type="text" name="postalCode" autocomplete="postal-code" inputmode="numeric" maxlength="10" pattern="[A-Za-z0-9 \-]{3,10}" value="${esc(postalCode)}"></label>
      <datalist id="city-list">${CITIES.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>`;
}

/** An account made before the city was asked, or with Google or GitHub, is asked once here. */
function locationBanner() {
  return `<div class="verify" role="status">
      <span class="verify-icon">${icon(I.pin)}</span>
      <div class="verify-text">
        <p class="verify-title">${L('Which city do you live in?', 'Kamu tinggal di kota mana?')}</p>
        <p>${L('Zeiko Drive shows local ads for the city on your account. Add it once in Settings.', 'Zeiko Drive menampilkan iklan lokal untuk kota di akunmu. Isi sekali di Pengaturan.')}</p>
      </div>
      <div class="verify-actions"><a class="btn btn-sm btn-primary" href="/account/settings#location">${L('Add my city', 'Isi kotaku')}</a></div>
    </div>`;
}

export function signUp({ error, email = '', username = '', city = '', postalCode = '', next = '', app = '', ref = '', opts, door }) {
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
      ${locationFields({ city, postalCode })}
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
  ['hosting', '/account/hosting', 'Hosting'],
  ['vps', '/account/vps', 'VPS'],
  ['sites', '/account/sites', L('Sites', 'Situs')],
  ['s3', '/account/s3', 'S3'],
  ['key', '/account/key', L('API key', 'Kunci API')],
  ['settings', '/account/settings', L('Settings', 'Pengaturan')],
];
// Account pages that are not tabs: reached by a link, titled here.
const pages = () => ({
  howtobuy: L('How to pay', 'Cara membayar'),
  pay: L('Pay by QRIS', 'Bayar dengan QRIS'),
  receipts: L('Receipts', 'Kuitansi'),
  sitefiles: L('Website files', 'File situs'),
  siteedit: L('Edit your website', 'Edit situsmu'),
});

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
        <h1>${title}</h1>
      </div>
      <div class="acct-who"><span class="avatar" aria-hidden="true">${esc((name[0] || 'Z').toUpperCase())}</span><span class="acct-who-text"><strong>${esc(a.username ? '@' + a.username : name)}</strong><span>${esc(a.email || '')}</span></span></div>
    </header>
    <nav class="acct-tabs" aria-label="${L('Account sections', 'Bagian akun')}">
      ${tabs().map(([id, href, label]) => `<a href="${href}"${id === tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <div class="acct-panel">
    ${flash || ''}
    ${!a.emailVerified && a.email && o.mail ? verifyBanner(a) : ''}
    ${!a.city && tab !== 'settings' ? locationBanner() : ''}
    ${inner}
    </div>
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
      <div class="section-row"><h2>${L('Payments', 'Pembayaran')}</h2><span class="row-links"><a class="btn-link" href="/account/receipts">${L('Receipts', 'Kuitansi')}</a><a class="btn-link" href="/account/how-to-buy">${L('How to pay', 'Cara membayar')}</a><a class="btn btn-ghost btn-sm" href="/account/plans">${L('Buy a plan or add balance', 'Beli paket atau isi saldo')}</a></span></div>
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

// hosting:start
/* ------------------------------------------------------------- hosting */
// Zeiko Hosting: the person's hosting and the order form. Prices are rupiah
// from the door (`GET /v1/hosting`); the page names what a plan comes with,
// so its markup is a hosting block for scripts/check-site.mjs. Every hosting
// has an address: a free one the door makes (six random characters, its
// `label`, under `address.base`), a name of the person's own straight under
// the base, their own domain, or — with six months or more — a free domain;
// a name or a domain goes by three months, in the same QRIS as the hosting,
// and a running one moves at one flat price.

/** `17000` → `Rp17.000`, in both languages, as on the Hosting page. */
const rp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`;
const size = (mb) => (mb >= 1024 ? `${String(+(mb / 1024).toFixed(1)).replace('.', L('.', ','))} GB` : `${num(mb)} MB`);
const gb = (n) => `${String(+Number(n || 0).toFixed(1)).replace('.', L('.', ','))} GB`;

const hostingStatus = () => ({
  ordered: [L('Waiting for payment', 'Menunggu pembayaran'), 'warn'],
  paid: [L('Being made', 'Sedang dibuat'), 'status'],
  active: [L('Active', 'Aktif'), 'ok'],
  suspended: [L('Suspended', 'Di-suspend'), 'err'],
  deleted: [L('Deleted', 'Dihapus'), ''],
  cancelled: [L('Cancelled', 'Dibatalkan'), ''],
});

const addressKind = () => ({
  free: L('Free address', 'Alamat gratis'),
  name: L('Your name', 'Nama pilihanmu'),
  own: L('Your own domain', 'Domain sendiri'),
  gift: L('Free domain', 'Domain gratis'),
});

/** `months` (3, 6, 12…) as words. */
const monthsText = (n) => L(`${num(n)} month${n === 1 ? '' : 's'}`, `${num(n)} bulan`);

/** What a renewal carries besides the plan, in words: "includes 3 months of the address Rp3.000". */
function renewExtras(q, domain = false) {
  if (!q) return '';
  const parts = [];
  if (q.addressBlocks > 0 && q.addressIdr > 0) {
    parts.push(domain
      ? `${L(`${monthsText(q.addressMonths)} of the domain`, `domain ${monthsText(q.addressMonths)}`)} ${esc(rp(q.addressIdr))}`
      : `${L(`${monthsText(q.addressMonths)} of the address`, `alamat ${monthsText(q.addressMonths)}`)} ${esc(rp(q.addressIdr))}`);
  }
  if (q.egressGb > 0) parts.push(`egress ${num(q.egressGb)} GB ${esc(rp(q.egressIdr))}`);
  return parts.length ? `${L('includes', 'termasuk')} ${parts.join(', ')}` : '';
}

/** Egress as the page says it: "Rp5.000 per 500 GB, by the GB". */
const egressRate = (eg) => L(`${esc(rp(eg.blockIdr))} per ${num(eg.blockGb || 0)} GB, by the GB`, `${esc(rp(eg.blockIdr))} per ${num(eg.blockGb || 0)} GB, dihitung per GB`);

/** The fields that choose an address: a name straight under the base or a
 * domain of their own, and, when ordering, the free one first and the free
 * domain last (only shown with 6 months or more). `once` prices a move of a
 * running hosting (one flat price); otherwise they are per 3 months. */
function addressFields(a, { free, nameIdr, domainIdr, months, once = false, label = '', address = '', name = '', domain = '' }) {
  const pick = address || (free ? 'free' : 'name');
  const base = esc(a.base || '');
  const six = label ? esc(label) : 'k3x9qa';
  const gift = (!once && a.gift) || {};
  const tlds = (Array.isArray(gift.tlds) ? gift.tlds : []).map((t) => `.${esc(t)}`).join(', ');
  const giftOn = gift.months > 0 && tlds;
  const option = (value, title, price, note) => `<label class="host-option">
      <input type="radio" name="address" value="${value}"${pick === value ? ' checked' : ''}>
      <span class="host-option-body"><strong>${title}</strong>${price ? `<span class="host-option-price">${price}</span>` : ''}<span class="muted-note">${note}</span></span>
    </label>`;
  const per = once ? L('once', 'sekali') : `/ ${esc(monthsText(months))}`;
  return `<fieldset class="host-choose host-address"><legend>${L('Address', 'Alamat')}</legend>
      ${free ? option('free', L('Free address', 'Alamat gratis'), L('Free', 'Gratis'), L(`Six random letters and digits, like <code>${six}.${base}</code>.`, `Enam huruf dan angka acak, misalnya <code>${six}.${base}</code>.`)) : ''}
      ${option('name', L('A name of your own', 'Nama pilihanmu'), `${esc(rp(nameIdr))} ${per}`, L(`Like <code>toko-bunga.${base}</code>: nothing to connect.`, `Misalnya <code>toko-bunga.${base}</code>: tanpa perlu menyambungkan apa pun.`))}
      ${option('own', L('Your own domain', 'Domain sendiri'), `${esc(rp(domainIdr))} ${per}`, L('A domain you bought, like <code>example.com</code>. You point it at us with nameservers.', 'Domain yang kamu beli, misalnya <code>contoh.com</code>. Kamu sambungkan lewat nameserver.'))}
      ${giftOn ? `<span class="host-gift host-gift-opt">${option('gift', L('Free domain', 'Domain gratis'), L('Free for its first year', 'Gratis tahun pertama'), L(`With ${num(gift.months)} months or more: one ${tlds} domain, registered and connected for you. After its first year it comes with your renewals at ${esc(rp(domainIdr))} per 3 months.`, `Dengan ${num(gift.months)} bulan atau lebih: satu domain ${tlds}, kami daftarkan dan sambungkan. Setelah tahun pertamanya ikut perpanjanganmu ${esc(rp(domainIdr))} per 3 bulan.`))}</span>` : ''}
      <label class="field host-addr-field host-addr-name">${L('Your name', 'Nama pilihanmu')}<span class="host-addr-in"><input type="text" name="name" value="${esc(name)}" placeholder="toko-bunga" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="40"><span>.${base}</span></span></label>
      <label class="field host-addr-field host-addr-own">${L('Your domain', 'Domainmu')}<input type="text" name="domain" value="${esc(address === 'gift' ? '' : domain)}" placeholder="${L('example.com', 'contoh.com')}" autocomplete="off" autocapitalize="none" spellcheck="false"></label>
      ${giftOn ? `<label class="field host-addr-field host-addr-gift host-gift">${L('Free domain', 'Domain gratis')}<input type="text" name="giftDomain" value="${esc(address === 'gift' ? domain : '')}" placeholder="toko-bunga.${esc(gift.tlds[0])}" autocomplete="off" autocapitalize="none" spellcheck="false"></label>` : ''}
    </fieldset>`;
}

/** A paid hosting or VPS can be ended (a hosting has no downgrade: end it
 * and order the plan you want; a VPS may take a smaller plan at its next
 * renewal, `downgradeBlock`). The door works out the refund for the days
 * left; it is sent by hand within 3 working days to where the person says.
 * `act` is the form's action. */
function endBlock(x, act) {
  const end = x.end;
  if (!end || x.refundAskedAt) return '';
  const refund = Number(end.refundIdr) || 0;
  return `<details class="host-move"><summary>${L('End this plan', 'Hentikan paket ini')}</summary>
      <form data-act="${esc(act)}" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <p>${refund > 0
    ? L(`We delete it with everything on it and send you <strong>${esc(rp(refund))}</strong> for the days left, within 3 working days.`, `Kami hapus beserta semua isinya dan mengirim <strong>${esc(rp(refund))}</strong> untuk sisa harinya, dalam 3 hari kerja.`)
    : L('We delete it with everything on it. No paid time is left to give back.', 'Kami hapus beserta semua isinya. Tidak ada sisa masa aktif yang bisa dikembalikan.')}</p>
        ${refund > 0 ? `<label class="field">${L('Send the refund to', 'Kirim refund ke')}<input type="text" name="refundTo" maxlength="200" placeholder="${L('Bank or e-wallet, number, name on it', 'Bank atau e-wallet, nomor, atas nama')}" autocomplete="off" required></label>` : ''}
        <label class="check"><input type="checkbox" name="sure" value="1" required> ${L('I understand it is deleted and cannot be brought back.', 'Saya paham ini dihapus dan tidak bisa dikembalikan.')}</label>
        ${x.downgrade ? '' : `<p class="fineprint">${L('Want a smaller plan? End this one, then order the plan you want.', 'Mau paket yang lebih kecil? Hentikan yang ini, lalu pesan paket yang kamu mau.')}</p>`}
        <button class="btn btn-sm" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L('End this plan', 'Hentikan paket ini')}</button>
      </form>
    </details>`;
}

/** What an ended or ending plan says about its refund. */
function endedLine(x) {
  const refund = Number(x.refundIdr) || 0;
  if (x.refundedAt) {
    return refund > 0
      ? L(`Ended on ${esc(day(x.refundedAt))}; your refund of <strong>${esc(rp(refund))}</strong> is sent.`, `Dihentikan ${esc(day(x.refundedAt))}; refund <strong>${esc(rp(refund))}</strong> sudah kami kirim.`)
      : L(`Ended on ${esc(day(x.refundedAt))}.`, `Dihentikan ${esc(day(x.refundedAt))}.`);
  }
  return refund > 0
    ? L(`Ending: we delete it and send <strong>${esc(rp(refund))}</strong> to ${esc(x.refundTo)} within 3 working days.`, `Sedang dihentikan: kami hapus lalu mengirim <strong>${esc(rp(refund))}</strong> ke ${esc(x.refundTo)} dalam 3 hari kerja.`)
    : L('Ending: we delete it shortly and email you.', 'Sedang dihentikan: segera kami hapus lalu kirim email.');
}

/** A running hosting or VPS: the dearer plans it can move to now, each
 * with what the days left cost (the door works it out), or the upgrade it
 * has paid for. `act` is the form's action. */
function upgradeBlock(x, act) {
  if (x.nextPlan) {
    return `<p>${L(`Moving to <strong>${esc(x.nextPlanName || x.nextPlan)}</strong>: paid. We give it the new plan within 1–2 hours and email you.`, `Pindah ke <strong>${esc(x.nextPlanName || x.nextPlan)}</strong>: sudah dibayar. Paket barunya kami pasang dalam 1–2 jam lalu kami kirim email.`)}</p>`;
  }
  const ups = Array.isArray(x.upgrade) ? x.upgrade : [];
  if (x.status !== 'active' || !ups.length) return '';
  const options = ups.map((u, i) => `<label class="host-option">
      <input type="radio" name="plan" value="${esc(u.id)}"${i === 0 ? ' checked' : ''} required>
      <span class="host-option-body"><strong>${esc(u.name)}</strong><span class="host-option-price">${esc(rp(u.priceIdr))} ${L('now, then', 'sekarang, lalu')} ${esc(rp(u.monthIdr))}/${L('month', 'bulan')}</span></span>
    </label>`).join('');
  return `<details class="host-move"><summary>${L('Upgrade the plan', 'Naikkan paket')}</summary>
      <form data-act="${esc(act)}" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <fieldset class="host-choose"><legend>${L('New plan', 'Paket baru')}</legend>${options}</fieldset>
        <p class="fineprint">${L('You pay the difference for the days left of what you paid; it still ends on the same day. Everything on it stays as it is.', 'Kamu membayar selisihnya untuk sisa hari yang sudah dibayar; tanggal habisnya tetap sama. Semua isinya tetap seperti sekarang.')}</p>
        <button class="btn btn-primary btn-sm" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Upgrade and pay by QRIS', 'Naikkan dan bayar dengan QRIS')}</button>
      </form>
    </details>`;
}

function hostingCard(x, h) {
  const [label, tone] = hostingStatus()[x.status] || [x.status, ''];
  const cycle = (c) => CYCLES()[c] || L('a month', 'per bulan');
  const a = (h && h.address) || {};
  const eg = (h && h.egress) || {};
  let line = '';
  let act = '';
  let more = '';
  if (x.refundAskedAt) {
    line = endedLine(x);
  } else if (x.status === 'ordered') {
    line = L('Pay its QRIS to start. An unpaid order is dropped after a few days.', 'Bayar QRIS-nya untuk mulai. Pesanan yang tidak dibayar dihapus setelah beberapa hari.');
    act = `${x.payment ? `<a class="btn btn-primary btn-sm" href="/account/pay?id=${encodeURIComponent(x.payment)}">${L('Open QR', 'Buka QR')}</a>` : ''}
      <form data-act="hosting-cancel"><input type="hidden" name="id" value="${esc(x.id)}"><button class="btn-link" type="submit" data-busy="…">${L('Cancel order', 'Batalkan pesanan')}</button></form>`;
  } else if (x.status === 'paid') {
    line = L('Paid — we are making it now, usually within 1–2 hours. Your cPanel details come by email.', 'Sudah dibayar — sedang kami buat, biasanya dalam 1–2 jam. Detail cPanel-mu dikirim lewat email.');
    more += endBlock(x, 'hosting-end');
  } else if (x.status === 'active' || x.status === 'suspended') {
    line = x.status === 'active'
      ? L(`Active until <strong>${esc(day(x.paidUntil))}</strong>. Renew before then; a day after it ends it is suspended, and a week after it is deleted.`, `Aktif sampai <strong>${esc(day(x.paidUntil))}</strong>. Perpanjang sebelum itu; sehari setelah habis di-suspend, dan seminggu setelahnya dihapus.`)
      : L(`Suspended since it ended on ${esc(day(x.paidUntil))}. Renew before <strong>${esc(day(x.deleteAt))}</strong> or it is deleted with its files.`, `Di-suspend karena habis ${esc(day(x.paidUntil))}. Perpanjang sebelum <strong>${esc(day(x.deleteAt))}</strong> atau dihapus beserta file-nya.`);
    const r = x.renew || {};
    const extras = [['month', L('A month', 'Sebulan')], ['half', L('6 months', '6 bulan')], ['year', L('A year', 'Setahun')]]
      .map(([k, name]) => [name, renewExtras(r[k])])
      .filter(([, t]) => t)
      .map(([name, t]) => `${name} ${t}`);
    act = r.monthIdr ? `<form data-act="hosting-renew" class="host-renew">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <button class="btn btn-primary btn-sm" type="submit" name="cycle" value="month" data-busy="${L('Opening…', 'Membuka…')}">${L('Renew a month', 'Perpanjang sebulan')} · ${esc(rp(r.monthIdr))}</button>
        ${r.halfIdr ? `<button class="btn btn-ghost btn-sm" type="submit" name="cycle" value="half" data-busy="${L('Opening…', 'Membuka…')}">${L('Renew 6 months', 'Perpanjang 6 bulan')} · ${esc(rp(r.halfIdr))}</button>` : ''}
        ${r.yearIdr ? `<button class="btn btn-ghost btn-sm" type="submit" name="cycle" value="year" data-busy="${L('Opening…', 'Membuka…')}">${L('Renew a year', 'Perpanjang setahun')} · ${esc(rp(r.yearIdr))}</button>` : ''}
      </form>${extras.length ? `<p class="muted-note">${extras.join('. ')}.</p>` : ''}` : '';
    const e = x.egressMonth;
    if (e && e.measured) {
      more += `<p class="muted-note">${L(`Egress this month: <strong>${esc(gb(e.usedGb))}</strong> of the free ${num(eg.freeGb || 0)} GB.`, `Egress bulan ini: <strong>${esc(gb(e.usedGb))}</strong> dari ${num(eg.freeGb || 0)} GB gratis.`)}</p>`;
    }
    if (x.egressGb > 0) {
      const owed = Math.ceil((x.egressGb * (eg.blockIdr || 0)) / Math.max(1, eg.blockGb || 1));
      more += `<p>${L(`Egress past the free ${num(eg.freeGb || 0)} GB a month: <strong>${num(x.egressGb)} GB</strong>, ${esc(rp(owed))}, added to your next renewal.`, `Egress di atas ${num(eg.freeGb || 0)} GB gratis per bulan: <strong>${num(x.egressGb)} GB</strong>, ${esc(rp(owed))}, ditambahkan ke perpanjangan berikutnya.`)}</p>`;
    }
    more += upgradeBlock(x, 'hosting-upgrade');
    if (x.nextDomain) {
      more += `<p>${L(`Moving to <strong>${esc(x.nextDomain)}</strong>: paid. We move it within 1–2 hours and email you.`, `Pindah ke <strong>${esc(x.nextDomain)}</strong>: sudah dibayar. Kami pindahkan dalam 1–2 jam lalu kirim email.`)}</p>`;
    } else if (x.status === 'active' && x.move) {
      const m = x.move;
      more += `<details class="host-move"><summary>${L('Change the address', 'Ganti alamat')}</summary>
        <form data-act="hosting-address" class="host-order">
          <input type="hidden" name="id" value="${esc(x.id)}">
          ${addressFields(a, { free: false, nameIdr: m.nameIdr, domainIdr: m.domainIdr, once: true, label: x.label || '', address: x.domainKind === 'name' ? 'own' : 'name' })}
          <p class="fineprint">${L('Paid once, it covers the new address to the end of your paid time; after that it goes with your renewals. Your files stay as they are.', 'Dibayar sekali, alamat barunya berlaku sampai akhir masa aktifmu; setelah itu ikut perpanjangan. File-mu tetap seperti sekarang.')}</p>
          <button class="btn btn-primary btn-sm" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Change and pay by QRIS', 'Ganti dan bayar dengan QRIS')}</button>
        </form>
      </details>`;
    }
    more += endBlock(x, 'hosting-end');
  }
  const kind = addressKind()[x.domainKind];
  return `<article class="card host-item">
    <div class="section-row"><h3>${esc(x.domain)}</h3><span class="tag tag-${esc(tone)}">${esc(label)}</span></div>
    <p class="muted-note">${esc(x.planName)} · ${esc(cycle(x.cycle))}${kind ? ` · ${esc(kind)}` : ''}${x.panelUser ? ` · cPanel <code>${esc(x.panelUser)}</code>` : ''}</p>
    ${line ? `<p>${line}</p>` : ''}
    ${act ? `<div class="row-links">${act}</div>` : ''}
    ${more}
  </article>`;
}

export function hosting(o, h, { flash, pick = '', domain = '', address = '', name = '', cycle = '' }) {
  const plans = (h && h.plans) || [];
  const open = Boolean(h && h.open);
  const mine = (h && h.services) || [];
  const chosen = plans.some((p) => p.id === pick) ? pick : (plans[0] || {}).id;
  const options = plans.map((p) => {
    const first = p.firstMonthIdr > 0;
    const facts = [
      L(`${num(p.websites)} website${p.websites === 1 ? '' : 's'}`, `${num(p.websites)} situs`),
      `RAM ${size(p.ramMb)}`,
      `NVMe ${size(p.diskMb)}`,
      p.objectGb > 0 ? `${gb(p.objectGb)} object storage` : '',
    ].filter(Boolean).join(' · ');
    return `<label class="host-option">
      <input type="radio" name="plan" value="${esc(p.id)}"${p.id === chosen ? ' checked' : ''} required>
      <span class="host-option-body">
        <strong>${esc(p.name)}</strong>
        <span class="host-option-price">${first ? `<s>${esc(rp(p.monthIdr))}</s> ${esc(rp(p.firstMonthIdr))} ${L('first month, then', 'bulan pertama, lalu')} ${esc(rp(p.monthIdr))}/${L('month', 'bulan')}` : `${esc(rp(p.monthIdr))}/${L('month', 'bulan')}`}${p.halfIdr ? ` · ${L('6 months', '6 bulan')} ${esc(rp(p.halfIdr))}` : ''}${p.yearIdr ? ` · ${esc(rp(p.yearIdr))}/${L('year', 'tahun')}` : ''}</span>
        <span class="muted-note">${esc(facts)}</span>
      </span>
    </label>`;
  }).join('');
  const verified = Boolean(h && h.emailVerified);
  const a = (h && h.address) || {};
  const eg = (h && h.egress) || {};
  const per = cycle === 'half' || cycle === 'year' ? cycle : 'month';
  const form = !open
    ? alert('warn', L('Hosting orders are not open yet. Please try again later.', 'Pemesanan hosting belum dibuka. Coba lagi nanti.'))
    : !verified
      ? alert('warn', L('Confirm your email address first: your hosting details are sent there.', 'Konfirmasi alamat email-mu dulu: detail hosting-mu dikirim ke sana.'))
      : `<form data-act="hosting-order" class="host-order">
        <fieldset class="host-choose"><legend>${L('Plan', 'Paket')}</legend>${options}</fieldset>
        <fieldset class="funds-way"><legend>${L('Pay', 'Bayar')}</legend>
          <label><input type="radio" name="cycle" value="month"${per === 'month' ? ' checked' : ''}> ${L('Monthly', 'Bulanan')}</label>
          <label><input type="radio" name="cycle" value="half"${per === 'half' ? ' checked' : ''}> ${L('6 months', '6 bulan')}</label>
          <label><input type="radio" name="cycle" value="year"${per === 'year' ? ' checked' : ''}> ${L('Yearly (10 months’ price)', 'Tahunan (harga 10 bulan)')}</label>
        </fieldset>
        ${addressFields(a, { free: true, nameIdr: a.nameIdr, domainIdr: a.domainIdr, months: a.months || 3, address, name, domain })}
        <button class="btn btn-primary" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Order and pay by QRIS', 'Pesan dan bayar dengan QRIS')}</button>
        ${h.setupIdr > 0 ? `<p class="fineprint">${L(`The first payment includes ${esc(rp(h.setupIdr))} to set it up, once: renewals never carry it.`, `Pembayaran pertama sudah termasuk ${esc(rp(h.setupIdr))} biaya pembuatan, sekali saja: perpanjangan tidak pernah memuatnya.`)}</p>` : ''}
        <p class="fineprint">${L(h && h.firstOffer ? 'The first-month price is for your first hosting, by the month. ' : '', h && h.firstOffer ? 'Harga bulan pertama berlaku untuk hosting pertamamu, bulanan. ' : '')}${L(`A name or a domain is paid ${monthsText(a.months || 3)} at a time: the first come with this order, the next with the renewal that needs them. ${num(eg.freeGb || 0)} GB of egress a month is free; past it, ${egressRate(eg)}, added to your next renewal.`, `Nama atau domain dibayar per ${monthsText(a.months || 3)}: yang pertama ikut pesanan ini, berikutnya ikut perpanjangan yang memerlukannya. Egress ${num(eg.freeGb || 0)} GB per bulan gratis; lebih dari itu ${egressRate(eg)}, ditambahkan ke perpanjangan berikutnya.`)}</p>
        <p class="fineprint">${L('We check your QRIS payment by hand in 1–5 minutes, make your hosting within 1–2 hours, and email you your cPanel address, username and password.', 'Kami memeriksa pembayaran QRIS-mu secara manual dalam 1–5 menit, membuat hosting-mu dalam 1–2 jam, lalu mengirim alamat cPanel, username dan password lewat email.')} <a href="${L('/docs/hosting', '/id/docs/hosting')}">${L('How hosting works', 'Cara kerja hosting')}</a></p>
      </form>`;
  const body = `<!-- hosting:start -->
    ${mine.length ? `<section class="acct-section-plain">
      <div class="section-row"><h2>${L('Your hosting', 'Hosting-mu')}</h2><p class="muted-note">${L('We email you 7, 3 and 1 day before each one ends', 'Kami kirim email 7, 3 dan 1 hari sebelum masing-masing habis')} · <a href="/account/receipts">${L('Receipts', 'Kuitansi')}</a></p></div>
      <div class="host-list">${mine.map((x) => hostingCard(x, h)).join('')}</div>
    </section>` : ''}
    <section class="card acct-section" id="order">
      <div class="section-row"><h2>${L('Order WordPress hosting', 'Pesan hosting WordPress')}</h2><a class="btn-link" href="${L('/hosting', '/id/hosting')}">${L('Compare the plans', 'Bandingkan paket')}</a></div>
      ${form}
    </section>
<!-- hosting:end -->`;
  return shell('hosting', o, body, flash);
}
// hosting:end

// hosting:start
/* ----------------------------------------------------------------- VPS */
// Zeiko VPS: the person's servers and the order form, from the door
// (`GET /v1/vps`). Like hosting it is made by hand and paid by QRIS in
// rupiah, so its markup is a hosting block too. The password typed here goes
// to the door once and is never drawn back into the page.

const CYCLES = () => ({ month: L('a month', 'per bulan'), half: L('6 months', '6 bulan'), year: L('a year', 'per tahun') });

function vpsFacts(p) {
  return [
    `${num(p.vcpu)} vCPU`,
    `RAM ${gb(p.ramGb)}`,
    `NVMe ${gb(p.diskGb)}`,
    p.objectGb > 0 ? `${gb(p.objectGb)} object storage` : '',
  ].filter(Boolean).join(' · ');
}

/** A running VPS: a smaller plan from the next renewal (the owner's,
 * 2026-10-29). Nothing changes or is charged now, and the days already paid
 * are not given back; the door prices the renewal at the smaller plan. */
function downgradeBlock(x) {
  if (x.lowerPlan) {
    return `<div class="host-move"><p>${L(`From your next renewal this VPS moves to <strong>${esc(x.lowerPlanName || x.lowerPlan)}</strong>, and the renewal below is priced at it. Until then nothing changes.`, `Mulai perpanjangan berikutnya VPS ini pindah ke <strong>${esc(x.lowerPlanName || x.lowerPlan)}</strong>, dan harga perpanjangan di atas memakai paket itu. Sampai saat itu tidak ada yang berubah.`)}</p>
      <form data-act="vps-downgrade" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <input type="hidden" name="plan" value="">
        <button class="btn btn-ghost btn-sm" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Keep my current plan', 'Tetap di paket sekarang')}</button>
      </form></div>`;
  }
  const lower = Array.isArray(x.downgrade) ? x.downgrade : [];
  if (x.status !== 'active' || x.nextPlan || !lower.length) return '';
  const options = lower.map((p, i) => `<label class="host-option">
      <input type="radio" name="plan" value="${esc(p.id)}"${i === 0 ? ' checked' : ''} required>
      <span class="host-option-body"><strong>${esc(p.name)}</strong><span class="host-option-price">${esc(rp(p.monthIdr))}/${L('month', 'bulan')}</span><span class="muted-note">${esc(vpsFacts(p))}</span></span>
    </label>`).join('');
  return `<details class="host-move"><summary>${L('Choose a smaller plan', 'Pilih paket yang lebih kecil')}</summary>
      <form data-act="vps-downgrade" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <fieldset class="host-choose"><legend>${L('Smaller plan', 'Paket lebih kecil')}</legend>${options}</fieldset>
        <p class="fineprint">${L('It starts at your next renewal, which is then priced at the smaller plan. Nothing changes or is charged now, and the days you already paid for stay as they are (no refund of the difference). Make sure what is on it fits the smaller disk: we cannot shrink it below what it holds.', 'Berlaku mulai perpanjangan berikutnya, yang harganya memakai paket yang lebih kecil. Sekarang tidak ada yang berubah atau ditagih, dan hari yang sudah kamu bayar tetap (selisihnya tidak dikembalikan). Pastikan isinya muat di disk yang lebih kecil: kami tidak bisa mengecilkannya di bawah isinya.')}</p>
        <button class="btn btn-sm" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Use it from the next renewal', 'Pakai mulai perpanjangan berikutnya')}</button>
      </form>
    </details>`;
}

const ASKED = () => ({
  start: L('Start', 'Nyalakan'),
  stop: L('Stop', 'Matikan'),
  reboot: L('Reboot', 'Reboot'),
  reinstall: L('Reinstall', 'Instal ulang'),
  password: L('New password', 'Password baru'),
  console: L('Emergency console', 'Konsol darurat'),
});

/** What the person asked of this VPS, newest first: waiting ones can be
 * withdrawn, answered ones show our answer. */
function requestsList(x) {
  const list = Array.isArray(x.requests) ? x.requests.slice(0, 6) : [];
  if (!list.length) return '';
  const state = { open: L('Waiting', 'Menunggu'), done: L('Done', 'Selesai'), cancelled: L('Not done', 'Tidak dikerjakan') };
  const rows = list.map((r) => `<li>
      <strong>${esc(ASKED()[r.kind] || r.kind)}</strong> · ${esc(state[r.status] || r.status)}${r.doneAt ? ` · ${esc(day(r.doneAt))}` : ''}
      ${r.answer ? `<br><span class="muted-note">${esc(r.answer)}</span>` : ''}
      ${r.status === 'open' ? `<form data-act="vps-request-cancel" class="host-order"><input type="hidden" name="id" value="${esc(x.id)}"><input type="hidden" name="rid" value="${esc(r.id)}"><button class="btn-link" type="submit" data-busy="…">${L('Withdraw', 'Batalkan')}</button></form>` : ''}
    </li>`).join('');
  return `<ul class="host-requests">${rows}</ul>`;
}

/** A running VPS's controls. Each one is a request we do by hand and answer
 * here; a new password or a reinstall's password goes to the door once and is
 * never drawn back into the page. */
function controlsBlock(x, systems) {
  if (x.status !== 'active' || x.refundAskedAt) return requestsList(x);
  const asked = ASKED();
  const quick = ['start', 'stop', 'reboot', 'console']
    .map((k) => `<button class="btn btn-ghost btn-sm" type="submit" name="kind" value="${k}" data-busy="${L('Sending…', 'Mengirim…')}">${esc(asked[k])}</button>`).join('');
  const systemOptions = systems.map((t) => `<option value="${esc(t.id)}"${t.id === x.template ? ' selected' : ''}>${esc(t.name)}${t.extraIdr > 0 ? ` (+${esc(rp(t.extraIdr))})` : ''}</option>`).join('');
  const windows = x.template === 'windows';
  return `<details class="host-move"><summary>${L('Control this VPS', 'Kendalikan VPS ini')}</summary>
      <form data-act="vps-request" class="host-renew">
        <input type="hidden" name="id" value="${esc(x.id)}">
        ${quick}
      </form>
      <p class="fineprint">${L('We do each one by hand and answer under it here. The emergency console answer carries how to open it.', 'Kami kerjakan satu per satu dan menjawab di bawahnya. Jawaban konsol darurat berisi cara membukanya.')}</p>
      <form data-act="vps-request" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}"><input type="hidden" name="kind" value="password">
        <label class="field">${L('New password', 'Password baru')}<input type="password" name="password" autocomplete="new-password" minlength="10" maxlength="64" required><small>${L('10 to 64 characters with a lowercase letter, a capital and a digit, no spaces or quotes. We set it on your VPS; we do not email it.', '10 sampai 64 karakter dengan huruf kecil, huruf besar dan angka, tanpa spasi atau tanda kutip. Kami pasang di VPS-mu; tidak dikirim lewat email.')}</small></label>
        <button class="btn btn-sm" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L('Ask for a new password', 'Minta password baru')}</button>
      </form>
      ${systems.length ? `<details class="host-move"><summary>${L('Reinstall', 'Instal ulang')}</summary>
        <form data-act="vps-request" class="host-order">
          <input type="hidden" name="id" value="${esc(x.id)}"><input type="hidden" name="kind" value="reinstall">
          <label class="field">${L('System', 'Sistem')}<select name="template" required>${systemOptions}</select></label>
          <label class="field">${L('Password', 'Password')}<input type="password" name="password" autocomplete="new-password" minlength="10" maxlength="64" required></label>
          ${windows ? '' : `<label class="field">${L('SSH public key (optional)', 'Kunci publik SSH (opsional)')}<input type="text" name="sshKey" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="ssh-ed25519 AAAA… you@laptop"></label>`}
          <label class="check"><input type="checkbox" name="sure" value="1" required> ${L('I understand everything on the disk is erased. We save a copy of the disk first.', 'Saya paham semua isi disk dihapus. Kami simpan salinan disknya dulu.')}</label>
          <button class="btn btn-sm" type="submit" data-busy="${L('Sending…', 'Mengirim…')}">${L('Reinstall', 'Instal ulang')}</button>
        </form>
      </details>` : ''}
    </details>
    ${requestsList(x)}`;
}

function vpsCard(x, systems = []) {
  const [label, tone] = hostingStatus()[x.status] || [x.status, ''];
  let line = '';
  let act = '';
  let more = '';
  if (x.refundAskedAt) {
    line = endedLine(x);
  } else if (x.status === 'ordered') {
    line = L('Pay its QRIS to start. An unpaid order is dropped after a few days.', 'Bayar QRIS-nya untuk mulai. Pesanan yang tidak dibayar dihapus setelah beberapa hari.');
    act = `${x.payment ? `<a class="btn btn-primary btn-sm" href="/account/pay?id=${encodeURIComponent(x.payment)}">${L('Open QR', 'Buka QR')}</a>` : ''}
      <form data-act="vps-cancel"><input type="hidden" name="id" value="${esc(x.id)}"><button class="btn-link" type="submit" data-busy="…">${L('Cancel order', 'Batalkan pesanan')}</button></form>`;
  } else if (x.status === 'paid') {
    line = L('Paid — we are making it now, usually within 1–2 hours. How to sign in comes by email.', 'Sudah dibayar — sedang kami buat, biasanya dalam 1–2 jam. Cara masuknya dikirim lewat email.');
    more += endBlock(x, 'vps-end');
  } else if (x.status === 'active' || x.status === 'suspended') {
    line = x.status === 'active'
      ? L(`Running until <strong>${esc(day(x.paidUntil))}</strong>. Renew before then; a day after it ends it is turned off, and a week after it is deleted.`, `Aktif sampai <strong>${esc(day(x.paidUntil))}</strong>. Perpanjang sebelum itu; sehari setelah habis dimatikan, dan seminggu setelahnya dihapus.`)
      : L(`Turned off since it ended on ${esc(day(x.paidUntil))}. Renew before <strong>${esc(day(x.deleteAt))}</strong> or it is deleted with everything on it.`, `Dimatikan karena habis ${esc(day(x.paidUntil))}. Perpanjang sebelum <strong>${esc(day(x.deleteAt))}</strong> atau dihapus beserta semua isinya.`);
    const r = x.renew || {};
    const btn = (cycle, text, idr, primary) => (idr ? `<button class="btn ${primary ? 'btn-primary' : 'btn-ghost'} btn-sm" type="submit" name="cycle" value="${cycle}" data-busy="${L('Opening…', 'Membuka…')}">${text} · ${esc(rp(idr))}</button>` : '');
    act = r.monthIdr ? `<form data-act="vps-renew" class="host-renew">
        <input type="hidden" name="id" value="${esc(x.id)}">
        ${btn('month', L('Renew a month', 'Perpanjang sebulan'), r.monthIdr, true)}
        ${btn('half', L('Renew 6 months', 'Perpanjang 6 bulan'), r.halfYearIdr, false)}
        ${btn('year', L('Renew a year', 'Perpanjang setahun'), r.yearIdr, false)}
      </form>` : '';
    const extras = [['month', L('A month', 'Sebulan')], ['half', L('6 months', '6 bulan')], ['year', L('A year', 'Setahun')]]
      .map(([k, name]) => [name, renewExtras(r[k], true)])
      .filter(([, t]) => t)
      .map(([name, t]) => `${name} ${t}`);
    if (extras.length) act += `<p class="muted-note">${extras.join('. ')}.</p>`;
    more += upgradeBlock(x, 'vps-upgrade');
    more += downgradeBlock(x);
    more += controlsBlock(x, systems);
    more += endBlock(x, 'vps-end');
  }
  const facts = [
    `${esc(x.planName)} · ${esc(CYCLES()[x.cycle] || x.cycle)}`,
    esc(x.templateName || x.template),
    x.domainKind === 'gift' && x.domain ? esc(x.domain) : '',
    x.panelUser ? `${L('sign in', 'masuk')} <code>${esc(x.panelUser)}</code>` : '',
  ].filter(Boolean).join(' · ');
  return `<article class="card host-item">
    <div class="section-row"><h3>${esc(x.vpsName)}</h3><span class="tag tag-${esc(tone)}">${esc(label)}</span></div>
    <p class="muted-note">${facts}</p>
    ${x.spec ? `<p class="muted-note">${esc(vpsFacts(x.spec))}</p>` : ''}
    ${line ? `<p>${line}</p>` : ''}
    ${act ? `<div class="row-links">${act}</div>` : ''}
    ${more}
  </article>`;
}

export function vps(o, v, { flash, pick = '', cycle = '', template = '', name = '', domain = '', sshKey = '' }) {
  const plans = (v && v.plans) || [];
  const systems = (v && v.templates) || [];
  const open = Boolean(v && v.open);
  const mine = (v && v.services) || [];
  const gift = (v && v.gift) || {};
  const tlds = (Array.isArray(gift.tlds) ? gift.tlds : []).map((t) => `.${esc(t)}`).join(', ');
  const giftOn = gift.months > 0 && tlds;
  const chosen = plans.some((p) => p.id === pick) ? pick : (plans[0] || {}).id;
  const system = systems.some((t) => t.id === template) ? template : (systems[0] || {}).id;
  const per = cycle === 'half' || cycle === 'year' ? cycle : 'month';
  const options = plans.map((p) => `<label class="host-option">
      <input type="radio" name="plan" value="${esc(p.id)}"${p.id === chosen ? ' checked' : ''} required>
      <span class="host-option-body">
        <strong>${esc(p.name)}</strong>
        <span class="host-option-price">${esc(rp(p.monthIdr))}/${L('month', 'bulan')}${p.halfYearIdr ? ` · ${L('6 months', '6 bulan')} ${esc(rp(p.halfYearIdr))}` : ''}${p.yearIdr ? ` · ${esc(rp(p.yearIdr))}/${L('year', 'tahun')}` : ''}</span>
        <span class="muted-note">${esc(vpsFacts(p))}</span>
      </span>
    </label>`).join('');
  const systemOptions = systems.map((t) => `<label><input type="radio" name="template" value="${esc(t.id)}"${t.id === system ? ' checked' : ''} required> ${esc(t.name)}${t.extraIdr > 0 ? ` (+${esc(rp(t.extraIdr))} ${L('licence, once', 'lisensi, sekali')})` : ''}</label>`).join('');
  const verified = Boolean(v && v.emailVerified);
  const form = !open
    ? alert('warn', L('VPS orders are not open yet. Please try again later.', 'Pemesanan VPS belum dibuka. Coba lagi nanti.'))
    : !verified
      ? alert('warn', L('Confirm your email address first: your VPS details are sent there.', 'Konfirmasi alamat email-mu dulu: detail VPS-mu dikirim ke sana.'))
      : `<form data-act="vps-order" class="host-order">
        <fieldset class="host-choose"><legend>${L('Plan', 'Paket')}</legend>${options}</fieldset>
        <fieldset class="funds-way"><legend>${L('Pay', 'Bayar')}</legend>
          <label><input type="radio" name="cycle" value="month"${per === 'month' ? ' checked' : ''}> ${L('Monthly', 'Bulanan')}</label>
          <label><input type="radio" name="cycle" value="half"${per === 'half' ? ' checked' : ''}> ${L('6 months', '6 bulan')}</label>
          <label><input type="radio" name="cycle" value="year"${per === 'year' ? ' checked' : ''}> ${L('Yearly', 'Tahunan')}</label>
        </fieldset>
        <fieldset class="funds-way vps-systems"><legend>${L('System', 'Sistem')}</legend>${systemOptions}</fieldset>
        <label class="field">${L('VPS name', 'Nama VPS')}<input type="text" name="name" value="${esc(name)}" placeholder="web1" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="30" pattern="[A-Za-z0-9][A-Za-z0-9-]{0,28}[A-Za-z0-9]|[A-Za-z0-9]" required><small>${L('Letters, digits and -, up to 30.', 'Huruf, angka dan -, maksimal 30.')}</small></label>
        <label class="field">${L('Password', 'Password')}<input type="password" name="password" autocomplete="new-password" minlength="10" maxlength="64" required><small>${L('10 to 64 characters with a lowercase letter, a capital and a digit, no spaces or quotes. Your VPS is made with it; we do not email it.', '10 sampai 64 karakter dengan huruf kecil, huruf besar dan angka, tanpa spasi atau tanda kutip. VPS-mu dibuat dengan password ini; kami tidak mengirimnya lewat email.')}</small></label>
        <label class="field">${L('SSH public key (optional)', 'Kunci SSH publik (opsional)')}<textarea name="sshKey" rows="3" placeholder="ssh-ed25519 AAAA… ${L('you@laptop', 'kamu@laptop')}" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="4096">${esc(sshKey)}</textarea><small>${L('Paste the one line from your .pub file to sign in with your key as well as the password. Never paste a private key. Not for Windows.', 'Tempel satu baris dari file .pub-mu supaya bisa masuk dengan kunci selain password. Jangan pernah menempel kunci privat. Tidak untuk Windows.')}</small></label>
        ${giftOn ? `<label class="field host-gift">${L('Free domain', 'Domain gratis')}<input type="text" name="domain" value="${esc(domain)}" placeholder="toko.${esc(gift.tlds[0])}" autocomplete="off" autocapitalize="none" spellcheck="false"><small>${L(`With ${num(gift.months)} months or more: one ${tlds} domain, free for its first year; after that it comes with your renewals at ${esc(rp(gift.domainIdr))} per 3 months. Leave it empty for none.`, `Dengan ${num(gift.months)} bulan atau lebih: satu domain ${tlds}, gratis untuk tahun pertamanya; setelah itu ikut perpanjanganmu ${esc(rp(gift.domainIdr))} per 3 bulan. Kosongkan kalau tidak perlu.`)}</small></label>` : ''}
        <button class="btn btn-primary" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Order and pay by QRIS', 'Pesan dan bayar dengan QRIS')}</button>
        ${v.setupIdr > 0 ? `<p class="fineprint">${L(`The first payment includes ${esc(rp(v.setupIdr))} to set it up, once, and a system’s licence where it has one: renewals never carry them.`, `Pembayaran pertama sudah termasuk ${esc(rp(v.setupIdr))} biaya pembuatan, sekali saja, dan lisensi sistem kalau ada: perpanjangan tidak pernah memuatnya.`)}</p>` : ''}
        <p class="fineprint">${L('We check your QRIS payment by hand in 1–5 minutes, make your VPS within 1–2 hours, and email you its IP address and how to sign in.', 'Kami memeriksa pembayaran QRIS-mu secara manual dalam 1–5 menit, membuat VPS-mu dalam 1–2 jam, lalu mengirim alamat IP dan cara masuknya lewat email.')}</p>
      </form>`;
  const body = `<!-- hosting:start -->
    ${mine.length ? `<section class="acct-section-plain">
      <div class="section-row"><h2>${L('Your VPS', 'VPS-mu')}</h2><p class="muted-note">${L('We email you 7, 3 and 1 day before each one ends', 'Kami kirim email 7, 3 dan 1 hari sebelum masing-masing habis')} · <a href="/account/receipts">${L('Receipts', 'Kuitansi')}</a></p></div>
      <div class="host-list">${mine.map((x) => vpsCard(x, systems)).join('')}</div>
    </section>` : ''}
    <section class="card acct-section" id="order">
      <div class="section-row"><h2>${L('Order a VPS', 'Pesan VPS')}</h2></div>
      ${form}
    </section>
<!-- hosting:end -->`;
  return shell('vps', o, body, flash);
}

/** Zeiko S3 lives in Zeiko Drive, on the same account: this tab says so and
 * opens it there, where it is bought, changed and renewed. */
export function s3(o, flash) {
  const body = `<!-- hosting:start -->
    <section class="card acct-section">
      <div class="section-row"><h2>Zeiko S3</h2></div>
      <p>${L('Object storage that speaks S3, on this same Zeiko Account. Buy the space you need with 1 or 3 copies, move to a bigger plan for the days left, renew, and make your keys — all in Zeiko S3, paid by QRIS.', 'Object storage yang bisa dipakai lewat S3, di Akun Zeiko yang sama. Beli ruang yang kamu perlu dengan 1 atau 3 salinan, naikkan paket untuk sisa harinya, perpanjang, dan buat kuncimu — semuanya di Zeiko S3, dibayar dengan QRIS.')}</p>
      <p class="muted-note">${L('The object storage that comes with a hosting or VPS plan shows there too.', 'Object storage yang ikut paket hosting atau VPS juga tampil di sana.')}</p>
      <div class="row-links"><a class="btn btn-primary" href="https://drive.zeiko.biz.id/s3">${L('Open Zeiko S3', 'Buka Zeiko S3')}</a></div>
    </section>
<!-- hosting:end -->`;
  return shell('s3', o, body, flash);
}

// hosting:start
/* --------------------------------------------------------------- sites */
// Zeiko Sites: static websites and the school and business packages, from
// the door (`GET /v1/sites`). A paid static site is live at once at its
// address; its files go straight from this browser to its folder (app.js),
// and a package's site can be made from a template (templates.js) instead.

const siteStatus = () => ({
  ordered: [L('Waiting for payment', 'Menunggu pembayaran'), 'warn'],
  paid: [L('Being made', 'Sedang dibuat'), 'status'],
  active: [L('Online', 'Online'), 'ok'],
  suspended: [L('Offline: ended', 'Offline: habis'), 'err'],
  deleted: [L('Deleted', 'Dihapus'), ''],
  cancelled: [L('Cancelled', 'Dibatalkan'), ''],
});

/** Bytes as the page says them: "1,5 GB", "320 MB". */
const bytesText = (n) => {
  const v = Number(n) || 0;
  if (v >= 1024 ** 3) return gb(v / 1024 ** 3);
  if (v >= 1024 ** 2) return `${num(Math.ceil(v / 1024 ** 2))} MB`;
  return `${num(Math.ceil(v / 1024))} KB`;
};

/** What a package costs, on one line. */
function packagePrices(p) {
  return [
    p.yearIdr ? `${esc(rp(p.yearIdr))}/${L('year', 'tahun')}` : '',
    p.yearDomainIdr ? `${L('with a free domain', 'dengan domain gratis')} ${esc(rp(p.yearDomainIdr))}/${L('year', 'tahun')}` : '',
    p.eventIdr ? `${L('per event', 'per acara')} ${esc(rp(p.eventIdr))}` : '',
  ].filter(Boolean).join(' · ');
}

function siteCard(x, s) {
  const [label, tone] = x.blocked ? [L('Taken down', 'Diturunkan'), 'err'] : siteStatus()[x.status] || [x.status, ''];
  const tpl = TEMPLATES()[x.template];
  const pkg = (s.packages || []).find((p) => p.id === x.package);
  const isStatic = x.engine !== 'cpanel';
  let line = '';
  let act = '';
  let more = '';
  if (x.blocked) {
    line = L('This website was taken down after a report. Chat WhatsApp +62 819-3241-6096 about it.', 'Situs ini diturunkan setelah ada laporan. Hubungi WhatsApp +62 819-3241-6096 soal ini.');
  } else if (x.status === 'ordered') {
    line = L('Pay its QRIS to put it online. An unpaid order is dropped after a few days.', 'Bayar QRIS-nya supaya situsnya online. Pesanan yang tidak dibayar dihapus setelah beberapa hari.');
    act = `${x.payment ? `<a class="btn btn-primary btn-sm" href="/account/pay?id=${encodeURIComponent(x.payment)}">${L('Open QR', 'Buka QR')}</a>` : ''}
      <form data-act="sites-cancel"><input type="hidden" name="id" value="${esc(x.id)}"><button class="btn-link" type="submit" data-busy="…">${L('Cancel order', 'Batalkan pesanan')}</button></form>`;
  } else if (x.status === 'paid') {
    line = L('Paid — we are making it on the hosting panel, usually within 1–2 hours. How to sign in comes by email.', 'Sudah dibayar — sedang kami buat di panel hosting, biasanya dalam 1–2 jam. Cara masuknya dikirim lewat email.');
  } else if (x.status === 'active' || x.status === 'suspended') {
    const until = x.cycle === 'event'
      ? L(`Online until the end of <strong>${esc(day(x.paidUntil))}</strong>.`, `Online sampai akhir <strong>${esc(day(x.paidUntil))}</strong>.`)
      : L(`Online until <strong>${esc(day(x.paidUntil))}</strong>. Renew before then; a day after it ends it goes offline, and a week after its files are deleted.`, `Online sampai <strong>${esc(day(x.paidUntil))}</strong>. Perpanjang sebelum itu; sehari setelah habis situsnya offline, dan seminggu setelahnya file-nya dihapus.`);
    line = x.status === 'active' ? until : L(`Offline since it ended on ${esc(day(x.paidUntil))}. Renew soon or its files are deleted.`, `Offline karena habis ${esc(day(x.paidUntil))}. Segera perpanjang atau file-nya dihapus.`);
    if (isStatic && x.status === 'active') {
      act = `<a class="btn btn-primary btn-sm" href="${esc(x.url)}" rel="noopener">${L('Open the website', 'Buka situsnya')}</a>
        ${tpl ? `<a class="btn btn-sm" href="/account/sites/edit?id=${encodeURIComponent(x.id)}">${L('Edit the page', 'Edit halaman')}</a>` : ''}
        <a class="btn btn-ghost btn-sm" href="/account/sites/files?id=${encodeURIComponent(x.id)}">${L('Files', 'File')}</a>`;
    } else if (x.panelUser) {
      act = `<span class="muted-note">cPanel <code>${esc(x.panelUser)}</code></span>`;
    }
    // Renewing: a package by the year (with its free domain, if it has one) or
    // to a later day; a static site by GB and months.
    const renew = [];
    if (x.package === 'static') {
      const gbNow = Math.max(s.static ? s.static.minGb : 1, Math.round(((x.quotaBytes || 0) / 1024 ** 3) * 2) / 2);
      renew.push(`<form data-act="sites-renew" class="host-renew">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <label class="field site-gb">GB<input type="number" name="gb" value="${esc(gbNow)}" min="${esc(s.static ? s.static.minGb : 1)}" max="${esc(s.static ? s.static.maxGb : 50)}" step="0.5" required></label>
        <button class="btn btn-primary btn-sm" type="submit" name="cycle" value="month" data-busy="${L('Opening…', 'Membuka…')}">${L('Renew a month', 'Perpanjang sebulan')}</button>
        <button class="btn btn-ghost btn-sm" type="submit" name="cycle" value="half" data-busy="${L('Opening…', 'Membuka…')}">${L('6 months', '6 bulan')}</button>
        <button class="btn btn-ghost btn-sm" type="submit" name="cycle" value="year" data-busy="${L('Opening…', 'Membuka…')}">${L('A year', 'Setahun')}</button>
      </form>`);
    } else if (pkg) {
      const yearIdr = x.domainKind === 'gift' ? pkg.yearDomainIdr : pkg.yearIdr;
      if (yearIdr && x.cycle !== 'event') {
        renew.push(`<form data-act="sites-renew" class="host-renew"><input type="hidden" name="id" value="${esc(x.id)}"><button class="btn btn-primary btn-sm" type="submit" name="cycle" value="year" data-busy="${L('Opening…', 'Membuka…')}">${L('Renew a year', 'Perpanjang setahun')} · ${esc(rp(yearIdr))}</button></form>`);
      }
      if (pkg.eventIdr && x.cycle === 'event') {
        renew.push(`<form data-act="sites-renew" class="host-renew"><input type="hidden" name="id" value="${esc(x.id)}"><input type="hidden" name="cycle" value="event">
          <label class="field">${L('Keep it online until', 'Tetap online sampai')}<input type="date" name="until" required></label>
          <button class="btn btn-primary btn-sm" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Extend', 'Perpanjang')} · ${esc(rp(pkg.eventIdr))}</button></form>`);
      }
    }
    if (renew.length) more += renew.join('');
  }
  if (x.domainKind === 'gift' && x.domain && !x.domainReady && x.status !== 'ordered') {
    more += `<p class="muted-note">${L(`Your free domain <strong>${esc(x.domain)}</strong> is being registered; until then the website is at ${esc(x.host)}. We email you when it is ready.`, `Domain gratismu <strong>${esc(x.domain)}</strong> sedang didaftarkan; sampai saat itu situsnya ada di ${esc(x.host)}. Kami kirim email kalau sudah siap.`)}</p>`;
  }
  if (x.domainKind === 'own' && x.status === 'active') {
    more += `<p class="muted-note">${L(`Point <strong>${esc(x.domain)}</strong> at it with a CNAME record to <code>${esc(x.label)}.${esc(s.base || '')}</code> at your domain’s DNS.`, `Arahkan <strong>${esc(x.domain)}</strong> ke situs ini dengan record CNAME ke <code>${esc(x.label)}.${esc(s.base || '')}</code> di DNS domainmu.`)} <a href="${L('/docs/hosting-sites', '/id/docs/hosting-sites')}">${L('How', 'Caranya')}</a></p>`;
  }
  const space = isStatic && x.quotaBytes && (x.status === 'active' || x.status === 'suspended') ? `<p class="muted-note">${L(`${esc(bytesText(x.usedBytes))} of ${esc(bytesText(x.quotaBytes))} used`, `${esc(bytesText(x.usedBytes))} dari ${esc(bytesText(x.quotaBytes))} terpakai`)}</p>${bar((x.usedBytes || 0) / x.quotaBytes)}` : '';
  return `<article class="card host-item">
    <div class="section-row"><h3>${esc(x.domainKind === 'gift' && x.domainReady ? x.domain : x.host)}</h3><span class="tag tag-${esc(tone)}">${esc(label)}</span></div>
    <p class="muted-note">${esc(x.packageName)}${tpl ? ` · ${esc(tpl.name)}` : ''}</p>
    ${line ? `<p>${line}</p>` : ''}
    ${space}
    ${act ? `<div class="row-links">${act}</div>` : ''}
    ${more}
  </article>`;
}

export function sites(o, s, { flash, pick = '', cycle = '', gb: gbTyped = '', until = '', domain = '', ownDomain = '' }) {
  const packages = (s && s.packages) || [];
  const open = Boolean(s && s.open);
  const mine = (s && s.sites) || [];
  const st = (s && s.static) || {};
  const ids = [...packages.map((p) => p.id), 'static'];
  const chosen = ids.includes(pick) ? pick : (packages[0] || { id: 'static' }).id;
  const tlds = ((s && s.giftTlds) || []).map((t) => `.${esc(t)}`).join(', ');
  const tpls = TEMPLATES();
  const options = packages.map((p) => `<label class="host-option">
      <input type="radio" name="package" value="${esc(p.id)}"${p.id === chosen ? ' checked' : ''} required>
      <span class="host-option-body">
        <strong>${esc(p.name)}</strong>
        <span class="host-option-price">${packagePrices(p)}</span>
        <span class="muted-note">${p.engine === 'cpanel' ? L('PHP and MySQL in cPanel, made by hand', 'PHP dan MySQL di cPanel, dibuat manual') : esc(tpls[p.template] ? tpls[p.template].name : L('Upload your own files', 'Unggah file sendiri'))} · ${esc(gb(p.quotaGb))}</span>
      </span>
    </label>`).join('');
  const staticOption = `<label class="host-option">
      <input type="radio" name="package" value="static"${chosen === 'static' ? ' checked' : ''} required>
      <span class="host-option-body">
        <strong>${L('Static website by the GB', 'Situs statis per GB')}</strong>
        <span class="host-option-price">${esc(rp(st.perGbMonthIdr))} ${L('per GB a month', 'per GB per bulan')}</span>
        <span class="muted-note">${L(`Your own HTML, CSS, JavaScript and files, ${num(st.minGb || 1)} to ${num(st.maxGb || 50)} GB`, `HTML, CSS, JavaScript dan file milikmu sendiri, ${num(st.minGb || 1)} sampai ${num(st.maxGb || 50)} GB`)}</span>
      </span>
    </label>`;
  const per = ['year', 'domain', 'event', 'month', 'half'].includes(cycle) ? cycle : 'year';
  const verified = Boolean(s && s.emailVerified);
  const form = !open
    ? alert('warn', L('Website orders are not open yet. Please try again later.', 'Pemesanan situs belum dibuka. Coba lagi nanti.'))
    : !verified
      ? alert('warn', L('Confirm your email address first: your website’s details are sent there.', 'Konfirmasi alamat email-mu dulu: detail situsmu dikirim ke sana.'))
      : `<form data-act="sites-order" class="host-order site-order">
        <fieldset class="host-choose"><legend>${L('Package', 'Paket')}</legend>${options}${staticOption}</fieldset>
        <fieldset class="funds-way site-cycle"><legend>${L('How long', 'Berapa lama')}</legend>
          <span class="site-pkg"><label><input type="radio" name="cycle" value="year"${per === 'year' ? ' checked' : ''}> ${L('A year', 'Setahun')}</label>
          <label><input type="radio" name="cycle" value="domain"${per === 'domain' ? ' checked' : ''}> ${L('A year with a free domain', 'Setahun dengan domain gratis')}</label>
          <label><input type="radio" name="cycle" value="event"${per === 'event' ? ' checked' : ''}> ${L('One event or project', 'Satu acara atau proyek')}</label></span>
          <span class="site-static"><label><input type="radio" name="cycle" value="month"${per === 'month' ? ' checked' : ''}> ${L('Monthly', 'Bulanan')}</label>
          <label><input type="radio" name="cycle" value="half"${per === 'half' ? ' checked' : ''}> ${L('6 months', '6 bulan')}</label></span>
        </fieldset>
        <label class="field site-static site-gb">${L('Space, GB', 'Ruang, GB')}<input type="number" name="gb" value="${esc(gbTyped || st.minGb || 1)}" min="${esc(st.minGb || 1)}" max="${esc(st.maxGb || 50)}" step="0.5"><small>${L('By the half GB. A static site’s “A year” is twelve months.', 'Per setengah GB. “Setahun” untuk situs statis adalah dua belas bulan.')}</small></label>
        <label class="field site-until">${L('Online until', 'Online sampai')}<input type="date" name="until" value="${esc(until)}"><small>${L(`The last day it should be online, within ${num(s.eventMaxDays || 180)} days.`, `Hari terakhir situsnya online, paling lama ${num(s.eventMaxDays || 180)} hari.`)}</small></label>
        <label class="field site-gift">${L('Free domain', 'Domain gratis')}<input type="text" name="domain" value="${esc(domain)}" placeholder="namasekolah${tlds ? esc((s.giftTlds || [])[0] ? `.${s.giftTlds[0]}` : '') : ''}" autocomplete="off" autocapitalize="none" spellcheck="false"><small>${L(`One ${tlds} domain, registered for you. Until it is ready, your website is at its free address.`, `Satu domain ${tlds}, kami daftarkan untukmu. Sampai siap, situsmu ada di alamat gratisnya.`)}</small></label>
        <details class="host-move site-own"${ownDomain ? ' open' : ''}><summary>${L('Use a domain you already have (optional)', 'Pakai domain yang sudah kamu punya (opsional)')}</summary>
          <label class="field">${L('Your domain', 'Domainmu')}<input type="text" name="ownDomain" value="${esc(ownDomain)}" placeholder="${L('example.com', 'contoh.com')}" autocomplete="off" autocapitalize="none" spellcheck="false"><small>${L('You point it at your website with one DNS record; the page shows how.', 'Kamu arahkan ke situsmu dengan satu record DNS; caranya tampil di halaman ini.')}</small></label>
        </details>
        <button class="btn btn-primary" type="submit" data-busy="${L('Opening…', 'Membuka…')}">${L('Order and pay by QRIS', 'Pesan dan bayar dengan QRIS')}</button>
        <p class="fineprint">${L(`Every website gets a free address under ${esc(s.base || '')}. We check your QRIS payment by hand in 1–5 minutes; a website goes online as soon as it is checked, and you fill it in from this page.`, `Setiap situs dapat alamat gratis di bawah ${esc(s.base || '')}. Kami memeriksa pembayaran QRIS-mu secara manual dalam 1–5 menit; situsnya online begitu terperiksa, dan kamu mengisinya dari halaman ini.`)} <a href="${L('/sites', '/id/sites')}">${L('Compare the packages', 'Bandingkan paket')}</a></p>
      </form>`;
  const body = `<!-- hosting:start -->
    ${mine.length ? `<section class="acct-section-plain">
      <div class="section-row"><h2>${L('Your websites', 'Situsmu')}</h2><p class="muted-note">${L('We email you 7, 3 and 1 day before each one ends', 'Kami kirim email 7, 3 dan 1 hari sebelum masing-masing habis')} · <a href="/account/receipts">${L('Receipts', 'Kuitansi')}</a></p></div>
      <div class="host-list">${mine.map((x) => siteCard(x, s)).join('')}</div>
    </section>` : ''}
    <section class="card acct-section" id="order">
      <div class="section-row"><h2>${L('Order a website', 'Pesan situs')}</h2></div>
      ${form}
    </section>
<!-- hosting:end -->`;
  return shell('sites', o, body, flash);
}

/** A static site's files: what it holds, upload more (a folder or files),
 * delete some. The bytes go from this browser to the website (app.js). */
export function siteFiles(o, x, files, { flash, max = {} } = {}) {
  const list = Array.isArray(files) ? files : [];
  const rows = list.map((f, i) => `<li>
      <label class="check"><input type="checkbox" name="path${i}" value="${esc(f.path)}"> <code>${esc(f.path)}</code></label>
      <span class="muted-note">${esc(bytesText(f.size))}</span>
      <a class="btn-link" href="${esc(`${x.url}${f.path.split('/').map(encodeURIComponent).join('/')}`)}" rel="noopener">${L('Open', 'Buka')}</a>
    </li>`).join('');
  const body = `<!-- hosting:start -->
    <section class="card acct-section">
      <div class="section-row"><h2>${esc(x.host)}</h2><span class="row-links"><a class="btn btn-ghost btn-sm" href="${esc(x.url)}" rel="noopener">${L('Open the website', 'Buka situsnya')}</a><a class="btn-link" href="/account/sites">${L('All websites', 'Semua situs')}</a></span></div>
      <p class="muted-note">${L(`${esc(bytesText(x.usedBytes))} of ${esc(bytesText(x.quotaBytes))} used · ${num(list.length)} file${list.length === 1 ? '' : 's'}`, `${esc(bytesText(x.usedBytes))} dari ${esc(bytesText(x.quotaBytes))} terpakai · ${num(list.length)} file`)}</p>
      ${x.quotaBytes ? bar((x.usedBytes || 0) / x.quotaBytes) : ''}
    </section>
    <section class="card acct-section" id="upload">
      <div class="section-row"><h2>${L('Upload', 'Unggah')}</h2></div>
      <form data-act="sites-upload" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <label class="field">${L('A folder', 'Satu folder')}<input type="file" name="folder" webkitdirectory multiple><small>${L('Everything in it, keeping its folders. The folder itself is not part of the address: its index.html becomes the front page.', 'Semua isinya, beserta folder di dalamnya. Folder itu sendiri tidak masuk alamat: index.html di dalamnya menjadi halaman depan.')}</small></label>
        <label class="field">${L('Or files', 'Atau file')}<input type="file" name="files" multiple></label>
        <label class="field">${L('Into the folder (optional)', 'Ke folder (opsional)')}<input type="text" name="into" placeholder="img" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="120"></label>
        <p class="fineprint">${L(`A file of the same name is replaced. At most ${num(max.fileMb || 50)} MB a file and ${num(max.files || 5000)} files.`, `File dengan nama yang sama diganti. Paling besar ${num(max.fileMb || 50)} MB per file dan ${num(max.files || 5000)} file.`)}</p>
        <p class="site-progress" id="site-progress" role="status" aria-live="polite"></p>
        <button class="btn btn-primary" type="submit" data-busy="${L('Uploading…', 'Mengunggah…')}">${L('Upload', 'Unggah')}</button>
      </form>
    </section>
    <section class="card acct-section">
      <div class="section-row"><h2>${L('Files', 'File')}</h2></div>
      ${list.length ? `<form data-act="sites-delete" class="host-order">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <ul class="site-files">${rows}</ul>
        <button class="btn btn-sm" type="submit" data-busy="${L('Deleting…', 'Menghapus…')}">${L('Delete the ticked files', 'Hapus file yang dicentang')}</button>
      </form>` : `<div class="empty">${icon(I.layers)}<p>${L('<strong>No files yet.</strong> Upload a folder with an index.html in it, or edit the page from a template.', '<strong>Belum ada file.</strong> Unggah folder yang berisi index.html, atau edit halamannya dari template.')}</p></div>`}
    </section>
<!-- hosting:end -->`;
  return shell('sitefiles', o, body, flash);
}

/** One entry of a template's list in the editor: its fields, numbered. */
function itemFields(tpl, it, i, images) {
  const labels = FIELD_LABEL();
  const imageList = `<datalist id="site-images">${images.map((p) => `<option value="${esc(p)}">`).join('')}</datalist>`;
  const field = (k) => {
    const v = it[k] || '';
    if (k === 'text') return `<label class="field">${labels.text}<textarea name="item-${i}-text" rows="3" maxlength="4000">${esc(v)}</textarea></label>`;
    if (k === 'image') return `<label class="field">${labels.image}<input type="text" name="item-${i}-image" value="${esc(v)}" list="site-images" placeholder="img/foto.jpg" autocomplete="off" autocapitalize="none" spellcheck="false"></label>`;
    return `<label class="field">${labels[k]}<input type="text" name="item-${i}-${k}" value="${esc(v)}" maxlength="400"${k === 'link' ? ' autocapitalize="none" spellcheck="false" placeholder="https://… / file.pdf"' : ''}></label>`;
  };
  return `<fieldset class="site-item"><legend>${esc(tpl.items.one)} ${num(i + 1)}</legend>${tpl.items.fields.map(field).join('')}${i === 0 ? imageList : ''}</fieldset>`;
}

/** A package's page, filled in from its template. Saving keeps what was
 * typed; publishing also makes the page's files and puts them online. */
export function siteEditor(o, x, content, files, { flash } = {}) {
  const tpls = TEMPLATES();
  const tpl = tpls[x.template] || tpls.homepage;
  const c = content || {};
  const contact = c.contact || {};
  const event = c.event || {};
  const images = (Array.isArray(files) ? files : []).map((f) => f.path).filter((p) => /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(p));
  const items = Array.isArray(c.items) ? c.items : [];
  // Room for three more each time; saving drops the empty ones.
  const shown = [...items, {}, {}, {}].slice(0, Math.max(items.length + 3, 3));
  const text = (name, label, value, extra = '') => `<label class="field">${label}<input type="text" name="${name}" value="${esc(value || '')}" maxlength="300"${extra}></label>`;
  const body = `<!-- hosting:start -->
    <section class="card acct-section">
      <div class="section-row"><h2>${esc(tpl.name)} · ${esc(x.host)}</h2><span class="row-links"><a class="btn btn-ghost btn-sm" href="${esc(x.url)}" rel="noopener">${L('Open the website', 'Buka situsnya')}</a><a class="btn-link" href="/account/sites/files?id=${encodeURIComponent(x.id)}">${L('Files and pictures', 'File dan gambar')}</a></span></div>
      <p class="muted-note">${esc(tpl.hint)} ${L('Pictures are files of your website: upload them under Files, then type their name here (like img/photo.jpg).', 'Gambar adalah file situsmu: unggah di menu File, lalu ketik namanya di sini (misalnya img/foto.jpg).')}</p>
    </section>
    <form data-act="sites-content" class="host-order site-editor">
      <input type="hidden" name="id" value="${esc(x.id)}">
      <section class="card acct-section">
        <h2>${L('The page', 'Halamannya')}</h2>
        ${text('title', L('Name', 'Nama'), c.title, ' required')}
        ${text('tagline', L('One line under it', 'Satu kalimat di bawahnya'), c.tagline)}
        <label class="field">${L('About', 'Tentang')}<textarea name="about" rows="5" maxlength="4000">${esc(c.about || '')}</textarea><small>${L('A blank line starts a new paragraph.', 'Baris kosong memulai paragraf baru.')}</small></label>
        ${text('logo', L('Logo or photo', 'Logo atau foto'), c.logo, ' list="site-images" placeholder="img/logo.png" autocapitalize="none" spellcheck="false"')}
        ${tpl.cover ? text('cover', L('Wide picture at the top', 'Gambar lebar di atas'), c.cover, ' list="site-images" placeholder="img/sampul.jpg" autocapitalize="none" spellcheck="false"') : ''}
        <label class="field">${L('Colour', 'Warna')}<input type="color" name="accent" value="${esc(/^#[0-9a-fA-F]{6}$/.test(c.accent || '') ? c.accent : '#1f4e9d')}"></label>
      </section>
      ${tpl.event ? `<section class="card acct-section"><h2>${L('The event', 'Acaranya')}</h2>
        ${text('eventDate', L('Date', 'Tanggal'), event.date, ' placeholder="Sabtu, 14 Desember 2026"')}
        ${text('eventTime', L('Time', 'Waktu'), event.time, ' placeholder="08.00 – 12.00 WIB"')}
        ${text('eventPlace', L('Place', 'Tempat'), event.place)}
        ${text('eventMaps', L('Map link', 'Link peta'), event.maps, ' placeholder="https://…" autocapitalize="none" spellcheck="false"')}
      </section>` : ''}
      <section class="card acct-section"><h2>${esc(tpl.items.label)}</h2>
        ${shown.map((it, i) => itemFields(tpl, it, i, images)).join('')}
        <p class="fineprint">${L('Empty ones are left out. Need more? Save, and three more appear.', 'Yang kosong tidak dipakai. Perlu lebih? Simpan, lalu muncul tiga lagi.')}</p>
      </section>
      <section class="card acct-section"><h2>${L('Contact', 'Kontak')}</h2>
        ${text('whatsapp', 'WhatsApp', contact.whatsapp, ' inputmode="tel" placeholder="0812…"')}
        ${text('phone', L('Phone', 'Telepon'), contact.phone, ' inputmode="tel"')}
        ${text('email', 'Email', contact.email, ' inputmode="email" autocapitalize="none" spellcheck="false"')}
        ${text('address', L('Address', 'Alamat'), contact.address)}
        ${text('maps', L('Map link', 'Link peta'), contact.maps, ' placeholder="https://…" autocapitalize="none" spellcheck="false"')}
        ${['instagram', 'tiktok', 'youtube', 'facebook'].map((k) => text(k, k[0].toUpperCase() + k.slice(1), contact[k], ' placeholder="https://…" autocapitalize="none" spellcheck="false"')).join('')}
      </section>
      <div class="row-links site-editor-act">
        <button class="btn btn-primary" type="submit" name="publish" value="1" data-busy="${L('Publishing…', 'Menerbitkan…')}">${L('Save and publish', 'Simpan dan terbitkan')}</button>
        <button class="btn btn-ghost" type="submit" name="publish" value="0" data-busy="${L('Saving…', 'Menyimpan…')}">${L('Save only', 'Simpan saja')}</button>
      </div>
      <p class="fineprint">${L('Publishing replaces index.html and style.css on your website with the page made from this form. Your other files stay.', 'Menerbitkan mengganti index.html dan style.css di situsmu dengan halaman dari formulir ini. File lainnya tetap.')}</p>
    </form>
<!-- hosting:end -->`;
  return shell('siteedit', o, body, flash);
}

/** Receipts: every QRIS payment of the person's that was paid out, each a
 * PDF from the account door (`door`), in the page's language. */
export function receipts(o, list, door, flash) {
  const rows = (Array.isArray(list) ? list : []).map((r) => `<tr>
      <th scope="row">${esc(r.what)}</th>
      <td data-label="${L('Amount', 'Jumlah')}">${esc(r.rupiahText)}</td>
      <td data-label="${L('Paid on', 'Lunas')}">${esc(day(r.paidAt))}</td>
      <td class="ledger-act"><a class="btn btn-ghost btn-xs" href="${esc(`${door}/v1/payments/${encodeURIComponent(r.id)}/receipt?lang=${getLang()}`)}">PDF</a></td>
    </tr>`).join('');
  const body = `<section class="card acct-section">
      <div class="section-row"><h2>${L('Receipts', 'Kuitansi')}</h2><p class="muted-note">${L('Every QRIS payment once we have checked it', 'Setiap pembayaran QRIS setelah kami periksa')}</p></div>
      ${rows ? `<div class="table-scroll"><table class="table acct-table ledger"><thead><tr><th scope="col">${L('What', 'Apa')}</th><th scope="col">${L('Amount', 'Jumlah')}</th><th scope="col">${L('Paid on', 'Lunas')}</th><th scope="col"><span class="sr">${L('Download', 'Unduh')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>`
    : `<div class="empty">${icon(I.wallet)}<p>${L('<strong>No receipts yet.</strong> A QRIS payment gets one once we have checked it.', '<strong>Belum ada kuitansi.</strong> Pembayaran QRIS mendapat kuitansi setelah kami periksa.')}</p></div>`}
    </section>`;
  return shell('receipts', o, body, flash);
}
// hosting:end

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
  const host = q.product === 'hosting' || q.product === 'vps' || q.product === 'sites';
  const page = q.product === 'vps' ? '/account/vps' : q.product === 'sites' ? '/account/sites' : '/account/hosting';
  const yours = q.product === 'vps' ? L('your VPS', 'VPS-mu') : q.product === 'sites' ? L('your website', 'situsmu') : L('your hosting', 'hosting-mu');
  const back = drive || (host ? page : q.product === 'chat' ? '/account/plans#chat' : '/account/plans');
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
      confirming: [L('Checking your payment', 'Memeriksa pembayaranmu'), L(`We are looking for ${q.rupiahText} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : host ? `Then we set ${yours} up within 1–2 hours and email you. It` : 'Your plan or balance switches on'} by itself, and this page updates on its own: you can leave it.`, `Kami sedang mencari ${q.rupiahText} di akun QRIS kami, biasanya dalam 10 menit. ${drive ? 'Zeiko Drive diperbarui' : host ? `Setelah itu ${yours} kami siapkan dalam 1–2 jam lalu kami kirim email. Semuanya berjalan` : 'Paket atau saldomu aktif'} dengan sendirinya, dan halaman ini ikut diperbarui: kamu boleh meninggalkannya.`), 'status'],
      paid: [L('Payment received — thank you', 'Pembayaran diterima — terima kasih'), L(`${q.what} is yours.`, `${q.what} sudah jadi milikmu.`), 'ok'],
      failed: [L('We could not find this payment', 'Kami tidak menemukan pembayaran ini'), L(`If you did pay ${q.rupiahText}, chat WhatsApp +62 819-3241-6096 with the amount, the time and your app's receipt.`, `Kalau kamu memang sudah membayar ${q.rupiahText}, chat WhatsApp +62 819-3241-6096 beserta jumlah, waktu, dan bukti dari aplikasimu.`), 'err'],
      expired: [L('This code has closed', 'Kode ini sudah ditutup'), L(`It was not marked as paid in time. If you already paid ${q.rupiahText}, chat WhatsApp +62 819-3241-6096 with your app's receipt; otherwise start a new payment.`, `Kode ini tidak ditandai lunas tepat waktu. Kalau kamu sudah membayar ${q.rupiahText}, chat WhatsApp +62 819-3241-6096 beserta bukti dari aplikasimu; kalau belum, mulai pembayaran baru.`), 'warn'],
    }[q.status] || [L('Not available right now', 'Sedang tidak tersedia'), L('Try again in a minute.', 'Coba lagi semenit lagi.'), 'warn'];
    const [heading, text, tone] = state;
    body = `<section class="card acct-section qris qris-${esc(tone)}">
      <div class="qris-state">
        ${q.status === 'confirming' ? '<span class="spinner" aria-hidden="true"></span>' : icon(q.status === 'paid' ? I.check : I.alert)}
        <div><h2>${esc(heading)}</h2><p>${esc(text)}</p><p class="muted-note">${esc(q.what)} · ${esc(q.rupiahText)} (${esc(q.amountText)})</p></div>
      </div>
      <div class="row-links">
        ${q.status === 'paid' ? (drive ? `<a class="btn btn-primary btn-sm" href="${esc(drive)}">${L('Back to Zeiko Drive', 'Kembali ke Zeiko Drive')}</a>` : `<a class="btn btn-primary btn-sm" href="${host ? page : '/account'}">${host ? (q.product === 'vps' ? L('Your VPS', 'VPS-mu') : q.product === 'sites' ? L('Your website', 'Situsmu') : L('Your hosting', 'Hosting-mu')) : L('Go to your account', 'Buka akunmu')}</a>`) : ''}
        ${q.status === 'paid' && q.receiptUrl ? `<a class="btn btn-ghost btn-sm" href="${esc(q.receiptUrl)}">${L('Download the receipt (PDF)', 'Unduh kuitansi (PDF)')}</a>` : ''}
        ${q.status === 'failed' || q.status === 'expired' ? `<a class="btn btn-primary btn-sm" href="${esc(back)}">${L('Start a new payment', 'Mulai pembayaran baru')}</a>` : ''}
        ${drive ? '' : host ? `<a class="btn btn-ghost btn-sm" href="${page}">${q.product === 'vps' ? 'VPS' : q.product === 'sites' ? L('Sites', 'Situs') : 'Hosting'}</a>` : `<a class="btn btn-ghost btn-sm" href="/account/plans">${L('Plans &amp; balance', 'Paket &amp; saldo')}</a>`}
      </div>
    </section>`;
  }
  return shell('pay', o, body, flash);
}

/** Right after "I've paid": thanks, then app.js takes the buyer back to
 * their account (or to Zeiko Drive) when the countdown runs out. */
export function qrisThanks(o, q, seconds) {
  const drive = q.product === 'drive' && q.driveBack ? String(q.driveBack) : '';
  const host = q.product === 'hosting' || q.product === 'vps' || q.product === 'sites';
  const page = q.product === 'vps' ? '/account/vps' : q.product === 'sites' ? '/account/sites' : '/account/hosting';
  const yours = q.product === 'vps' ? L('your VPS', 'VPS-mu') : q.product === 'sites' ? L('your website', 'situsmu') : L('your hosting', 'hosting-mu');
  const body = `<section class="card acct-section qris qris-ok" role="status">
      <div class="qris-state">
        ${icon(I.check)}
        <div><h2>${L("Thanks, we're gonna check your payment", 'Terima kasih, pembayaranmu akan kami periksa')}</h2><p>${L(`We are looking for ${esc(q.rupiahText)} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : host ? `Then we set ${yours} up within 1–2 hours and email you; the page updates` : 'Your plan or balance switches on'} by itself.`, `Kami sedang mencari ${esc(q.rupiahText)} di akun QRIS kami, biasanya dalam 10 menit. ${drive ? 'Zeiko Drive diperbarui' : host ? `Setelah itu ${yours} kami siapkan dalam 1–2 jam lalu kami kirim email; halamannya diperbarui` : 'Paket atau saldomu aktif'} dengan sendirinya.`)}</p><p class="muted-note">${L(`Taking you back to ${drive ? 'Zeiko Drive' : host ? yours : 'your account'} in <span id="qris-countdown">${num(seconds)}</span> seconds.`, `Kembali ke ${drive ? 'Zeiko Drive' : host ? yours : 'akunmu'} dalam <span id="qris-countdown">${num(seconds)}</span> detik.`)}</p></div>
      </div>
      <div class="row-links">
        <a class="btn btn-primary btn-sm" href="${esc(drive || (host ? page : '/account'))}">${drive ? L('Back to Zeiko Drive now', 'Kembali ke Zeiko Drive sekarang') : L('Go to your account now', 'Buka akunmu sekarang')}</a>
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
        <div><dt>${L('City', 'Kota')}</dt><dd>${esc(a.city || '—')}${a.postalCode ? ` · ${esc(a.postalCode)}` : ''}</dd></div>
        <div><dt>${L('Member since', 'Anggota sejak')}</dt><dd>${esc(day(a.createdAt))}</dd></div>
        ${o.referral && o.referral.code ? `<div><dt>${L('Referral code', 'Kode referral')}</dt><dd><code>${esc(o.referral.code)}</code>${o.referral.discountPct ? L(` · ${esc(o.referral.discountPct)}% off plans`, ` · diskon ${esc(o.referral.discountPct)}% untuk paket`) : ''}</dd></div>` : ''}
      </dl>
    </section>
    <section class="card acct-section" id="location">
      <h2>${L('Where you live', 'Tempat tinggal')}</h2>
      <p class="muted-note">${L('Zeiko Drive shows local ads for this city, from your next visit there. The postal code is optional.', 'Zeiko Drive menampilkan iklan lokal untuk kota ini, mulai kamu membukanya lagi. Kode pos boleh dikosongkan.')}</p>
      <form data-act="location" class="form">
        ${locationFields({ city: a.city || '', postalCode: a.postalCode || '' })}
        <button class="btn btn-primary" type="submit" data-busy="${L('Saving…', 'Menyimpan…')}">${a.city ? L('Change city', 'Ganti kota') : L('Add my city', 'Isi kotaku')}</button>
      </form>
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
