// The account area's pages, drawn in the visitor's browser by app.js from
// what the account door answers. Every value that came from a visitor or
// from the door goes through `esc`; nothing else is put into a page. Every
// action is a form with `data-act`, which app.js sends to the door.

import { PAY_GUIDE } from './payguide.js';

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const num = (n) => Number(n || 0).toLocaleString('en-US');

function usd(n) {
  const v = Number(n || 0);
  if (Number.isInteger(v)) return `$${v}`;
  // Small rates keep their digits: $0.003 is not $0.00.
  const text = v >= 0.01 ? v.toFixed(2) : String(+v.toPrecision(3));
  return `$${text}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function day(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
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

/** The top bar's links, signed in or not. */
export function nav(signedIn) {
  return signedIn
    ? `<a href="/#decision">Pranata V1</a>
      <a href="/models">Models</a>
      <a href="/docs/">Docs</a>
      <a href="/account" aria-current="page">Account</a>
      <form data-act="signout" class="nav-form"><button class="btn btn-sm btn-ghost" type="submit">Sign out</button></form>`
    : `<a href="/#decision">Pranata V1</a>
      <a href="/#pricing">Pricing</a>
      <a href="/models">Models</a>
      <a href="/docs/">Docs</a>
      <a class="nav-account" href="/account/signin">Sign in</a>
      <a class="btn btn-sm btn-primary" href="/account/signup">Create account</a>`;
}

export function loading() {
  return `<section class="auth"><div class="auth-card card auth-loading"><span class="spinner" aria-hidden="true"></span><p class="auth-sub">Loading your account…</p></div></section>`;
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
  if (opts.google) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="${esc(`${door}/oauth/google${tail}`)}">${GOOGLE_ICON}<span>Continue with Google</span></a>`);
  if (opts.github) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="${esc(`${door}/oauth/github${tail}`)}">${GITHUB_ICON}<span>Continue with GitHub</span></a>`);
  if (!buttons.length) return '';
  return `<div class="auth-oneclick">${buttons.join('')}</div><p class="auth-or"><span>or with your email</span></p>`;
}

/** A password box with a show/hide button and a Caps Lock note (app.js). */
function password({ id, label, name = 'password', autocomplete, hint = '', side = '', min = 0 }) {
  return `<div class="field">
      <div class="label-row"><label for="${id}">${label}${hint ? ` <small>${hint}</small>` : ''}</label>${side}</div>
      <div class="pw">
        <input id="${id}" type="password" name="${name}" autocomplete="${autocomplete}" required${min ? ` minlength="${min}"` : ''} maxlength="200">
        <button class="pw-toggle" type="button" data-reveal="${id}" aria-controls="${id}" aria-pressed="false" aria-label="Show password">${icon(I.eye, 'i-show')}${icon(I.eyeOff, 'i-hide')}</button>
      </div>
      <p class="field-note caps-note" hidden>Caps Lock is on.</p>
    </div>`;
}

// What one Zeiko Account gives, beside the sign-in and sign-up forms.
const AUTH_ASIDE = `<aside class="auth-aside" aria-label="About Zeiko Accounts">
    <p class="auth-kicker">${LOGO}<span>Zeiko Account</span></p>
    <p class="auth-pitch">One sign-in for ZeikoAI and Zeiko Chat.</p>
    <ul class="auth-points">
      <li>${icon(I.layers)}<span><strong>Both products, one login.</strong> Email and password, Google or GitHub — it works in Zeiko Chat too.</span></li>
      <li>${icon(I.wallet)}<span><strong>One balance.</strong> Add funds once; they pay for Pranata V1 calls and Zeiko Chat replies.</span></li>
      <li>${icon(I.key)}<span><strong>Your key, kept here.</strong> Plans, usage and your Pranata V1 key on one page.</span></li>
    </ul>
  </aside>`;

function authShell(heading, sub, inner, { aside = false } = {}) {
  return `<section class="auth${aside ? ' auth-split' : ''}">
  <div class="auth-grid">
    ${aside ? AUTH_ASIDE : ''}
    <div class="auth-card card">
      <p class="auth-logo">${LOGO}</p>
      <h1>${heading}</h1>
      ${sub ? `<p class="auth-sub">${sub}</p>` : ''}
      ${inner}
    </div>
  </div>
</section>`;
}

export function signIn({ error, notice, email = '', next = '', opts, door }) {
  return authShell('Welcome back', 'Sign in to your Zeiko Account.', `
    ${alert('err', error)}${alert('ok', notice)}
    ${oneClick(opts, next, door, '')}
    <form data-act="signin" class="form">
      <input type="hidden" name="next" value="${esc(next)}">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254" value="${esc(email)}"></label>
      ${password({ id: 'signin-password', label: 'Password', autocomplete: 'current-password', side: '<a href="/account/forgot">Forgot it?</a>' })}
      <button class="btn btn-primary btn-block" type="submit" data-busy="Signing in…">Sign in</button>
    </form>
    <p class="auth-foot">New here? <a href="/account/signup${next ? `?next=${encodeURIComponent(next)}` : ''}">Create an account</a></p>`, { aside: true });
}

export function signUp({ error, email = '', username = '', next = '', ref = '', opts, door }) {
  return authShell('Create your Zeiko Account', 'Free to make. Buy a plan or add balance when you are ready.', `
    ${alert('err', error)}
    ${oneClick(opts, next, door, ref)}
    <form data-act="signup" class="form">
      <input type="hidden" name="next" value="${esc(next)}">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254" value="${esc(email)}"></label>
      <label>Username <small>3–24 letters, numbers or _</small><input type="text" name="username" autocomplete="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocapitalize="off" spellcheck="false" value="${esc(username)}"></label>
      ${password({ id: 'signup-password', label: 'Password', autocomplete: 'new-password', hint: '8 characters or more', min: 8 })}
      <details class="ref-field"${ref ? ' open' : ''}>
        <summary>Have a referral code?</summary>
        <label>Referral code <small>optional</small><input type="text" name="referral" maxlength="32" autocapitalize="characters" spellcheck="false" value="${esc(ref)}"></label>
      </details>
      <button class="btn btn-primary btn-block" type="submit" data-busy="Creating your account…">Create account</button>
    </form>
    <p class="auth-foot">Already have one? <a href="/account/signin${next ? `?next=${encodeURIComponent(next)}` : ''}">Sign in</a></p>`, { aside: true });
}

export function forgot({ error, sent }) {
  if (sent) {
    return authShell('Check your inbox', '', `<div class="auth-done">${icon(I.mail)}</div>
      <p class="auth-sub">If that email has an account, a link to choose a new password is on its way. It works for 30 minutes, here and in Zeiko Chat.</p>
      <a class="btn btn-ghost btn-block" href="/account/signin">Back to sign in</a>`);
  }
  return authShell('Forgot your password?', 'Type your email and we will send you a link to choose a new one.', `
    ${alert('err', error)}
    <form data-act="forgot" class="form">
      <label>Email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254"></label>
      <button class="btn btn-primary btn-block" type="submit" data-busy="Sending…">Send the link</button>
    </form>
    <p class="auth-foot"><a href="/account/signin">Back to sign in</a></p>`);
}

/** The page the reset email links to: the token is in the address. */
export function reset({ error, token }) {
  return authShell('Choose a new password', 'It works here and in Zeiko Chat.', `
    ${alert('err', error)}
    <form data-act="reset" class="form">
      <input type="hidden" name="token" value="${esc(token)}">
      ${password({ id: 'reset-password', label: 'New password', autocomplete: 'new-password', hint: '8 characters or more', min: 8 })}
      <button class="btn btn-primary btn-block" type="submit" data-busy="Saving…">Save and sign in</button>
    </form>`);
}

export function message({ heading, text, link = '/account', label = 'Go to your account' }) {
  return authShell(esc(heading), '', `<p class="auth-sub">${esc(text)}</p><a class="btn btn-primary btn-block" href="${esc(link)}">${esc(label)}</a>`);
}

/* ---------------------------------------------------------------- account */

const TABS = [
  ['overview', '/account', 'Overview'],
  ['plans', '/account/plans', 'Plans & balance'],
  ['key', '/account/key', 'API key'],
  ['settings', '/account/settings', 'Settings'],
];
// Account pages that are not tabs: reached by a link, titled here.
const PAGES = { howtobuy: 'How to pay', pay: 'Pay by QRIS' };

function verifyBanner(a) {
  return `<div class="verify" role="status">
      <span class="verify-icon">${icon(I.mail)}</span>
      <div class="verify-text">
        <p class="verify-title">Confirm your email</p>
        <p>We sent a 6-digit code to <strong>${esc(a.email)}</strong>. Renewal links for plans go there too.</p>
      </div>
      <div class="verify-actions">
        <form data-act="verify-code" class="verify-form">
          <label class="sr" for="verify-code">Confirmation code</label>
          <input id="verify-code" class="otp" type="text" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required>
          <button class="btn btn-sm btn-primary" type="submit" data-busy="Checking…">Confirm</button>
        </form>
        <form data-act="verify-send"><button class="btn-link" type="submit" data-busy="Sending…">Send a new code</button></form>
      </div>
    </div>`;
}

function shell(tab, o, inner, flash) {
  const a = o.account;
  const name = a.name || a.username || a.email || 'there';
  const tabbed = TABS.find((t) => t[0] === tab);
  const title = tab === 'overview' ? `Hi, ${esc(name)}` : esc(tabbed ? tabbed[2] : PAGES[tab]);
  return `<section class="acct">
  <div class="wrap">
    <header class="acct-head">
      <div class="acct-title">
        <p class="crumbs">Zeiko Account</p>
        <h1>${title}</h1>
      </div>
      <div class="acct-who"><span class="avatar" aria-hidden="true">${esc((name[0] || 'Z').toUpperCase())}</span><span class="acct-who-text"><strong>${esc(a.username ? '@' + a.username : name)}</strong><span>${esc(a.email || '')}</span></span></div>
    </header>
    <nav class="acct-tabs" aria-label="Account sections">
      ${TABS.map(([id, href, label]) => `<a href="${href}"${id === tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
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
      <p class="stat-label">${icon(I.layers)}Plan</p>
      <p class="stat-value">${esc(p.name)}</p>
      <p class="stat-sub"><strong>${num(left)}</strong> of ${num(u.amount)} requests left</p>
      ${bar(share)}
      <p class="stat-foot">${Math.round(share * 100)}% used · resets ${esc(day(u.resetsAt))}${p.expiresAt ? ` · ends ${esc(day(p.expiresAt))}` : ''}</p>
      <a class="btn btn-ghost btn-sm" href="/account/plans">Change plan</a>
    </article>`;
  }
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.layers)}Plan</p>
    <p class="stat-value">${p.paygo ? 'Per token' : 'No plan yet'}</p>
    <p class="stat-sub">${p.paygo ? 'Every call is paid from your balance.' : 'Buy a plan, or add balance, to start calling Pranata V1.'}</p>
    <p class="stat-foot">A plan gives you a set number of requests for 30 days.</p>
    <a class="btn btn-primary btn-sm" href="/account/plans">See plans</a>
  </article>`;
}

function balanceCard(o) {
  const low = Number(o.balance.micro) <= 0;
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.wallet)}Balance</p>
    <p class="stat-value">${esc(o.balance.text)}</p>
    <p class="stat-sub">Pays for Pranata V1 calls past your plan and Zeiko Chat replies past your chat plan.</p>
    <p class="stat-foot">${o.balance.shared ? 'The same balance in Zeiko Chat.' : ''}</p>
    ${o.owed && Number(o.owed.micro) > 0 && o.owed.text ? `<p class="stat-owed">${icon(I.alert)}<span>You owe <strong>${esc(o.owed.text)}</strong> for playground tries past your plan. It comes off the next balance you add.</span></p>` : ''}
    <a class="btn ${low ? 'btn-primary' : 'btn-ghost'} btn-sm" href="/account/plans#topup">Add balance</a>
  </article>`;
}

function keyCard(o) {
  return `<article class="card stat-card">
    <p class="stat-label">${icon(I.key)}API key</p>
    <p class="stat-value stat-mono">${o.key ? esc(o.key.shown) : 'Not ready yet'}</p>
    <p class="stat-sub">Works with every model on your plan or balance.</p>
    <p class="stat-foot">${o.models.map((m) => `<code>${esc(m.id)}</code>`).join(' ')}</p>
    <a class="btn btn-ghost btn-sm" href="/account/key">Show and copy</a>
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
    return `<div class="empty">${icon(I.layers)}<p><strong>No calls in the last 30 days yet.</strong> Once your key is in use, each day shows up here.</p><a class="btn btn-ghost btn-sm" href="/account/key">Get your key</a></div>`;
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
    return `<rect x="${(i * step + step * 0.18).toFixed(2)}" y="${(H - h).toFixed(2)}" width="${(step * 0.64).toFixed(2)}" height="${Math.max(h, d.calls ? 0.8 : 0).toFixed(2)}"><title>${esc(day(d.day))}: ${num(d.calls)} calls</title></rect>`;
  }).join('');
  const short = (d) => esc(day(d.day).replace(/ \d{4}$/, ''));
  const rows = days.filter((d) => d.calls).reverse().map((d) => `<tr><th scope="row">${esc(day(d.day))}</th><td>${num(d.calls)}</td><td>${num(d.units)}</td><td>${num(d.inputTokens)}</td></tr>`).join('');
  return `<dl class="usage-sums">
      <div><dt>Calls</dt><dd>${num(total)}</dd></div>
      <div><dt>Plan requests</dt><dd>${num(units)}</dd></div>
      <div><dt>Input tokens</dt><dd>${esc(compact(tokens))}</dd></div>
    </dl>
    <figure class="uchart">
      <figcaption class="sr">Calls per day over the last 30 days, UTC</figcaption>
      <div class="uchart-y" aria-hidden="true"><span>${esc(compact(top))}</span><span>${esc(compact(top / 2))}</span><span>0</span></div>
      <div class="uchart-plot"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Calls per day over the last 30 days"><g>${grid}</g><g class="bars">${bars}</g></svg></div>
      <div class="uchart-x" aria-hidden="true"><span>${short(days[0])}</span><span>${short(days[15])}</span><span>Today</span></div>
    </figure>
    <details class="perf-table"><summary>Show as a table</summary>
      <div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">Day</th><th scope="col">Calls</th><th scope="col">Plan requests</th><th scope="col">Input tokens</th></tr></thead><tbody>${rows}</tbody></table></div>
    </details>`;
}

const STATUS = {
  waiting: ['Waiting for payment', 'warn'],
  new: ['Waiting for payment', 'warn'],
  confirming: ['Confirming', 'warn'],
  confirmed: ['Confirming', 'warn'],
  sending: ['Confirming', 'warn'],
  partially_paid: ['Partly paid', 'warn'],
  finished: ['Paid', 'ok'],
  failed: ['Failed', 'err'],
  refunded: ['Refunded', ''],
  expired: ['Expired', ''],
};

function payments(list) {
  if (!list.length) return `<div class="empty">${icon(I.wallet)}<p><strong>No payments yet.</strong> Plans and balance you buy show up here.</p></div>`;
  const rows = list.map((p) => {
    const [label, tone] = p.paid ? ['Paid', 'ok'] : STATUS[p.status] || [p.status, ''];
    const qris = p.method === 'qris';
    const open = qris
      ? (!p.paid && ['waiting', 'confirming'].includes(p.status) ? `<a class="btn btn-ghost btn-xs" href="/account/pay?id=${encodeURIComponent(p.id)}">${p.status === 'waiting' ? 'Open QR' : 'See status'}</a>` : '')
      : p.invoiceUrl && !p.paid ? `<a class="btn btn-ghost btn-xs" href="${esc(p.invoiceUrl)}" rel="noopener">Finish paying</a>` : '';
    return `<tr><th scope="row">${esc(p.what)}</th><td data-label="Amount">${esc(p.amountText)}${qris && p.localText ? `<small class="ledger-local">${esc(p.localText)} · QRIS</small>` : ''}</td><td data-label="Status"><span class="tag tag-${tone}">${esc(label)}</span></td><td data-label="Date">${esc(day(p.createdAt))}</td><td class="ledger-act">${open}</td></tr>`;
  }).join('');
  return `<div class="table-scroll"><table class="table acct-table ledger"><thead><tr><th scope="col">What</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Date</th><th scope="col"><span class="sr">Action</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function chatStrip(o) {
  const c = o.chat || {};
  if (!c.planName) return '';
  const link = c.url ? `<a class="btn btn-ghost btn-sm" href="${esc(c.url)}" rel="noopener">Open Zeiko Chat${icon(I.out)}</a>` : '';
  return `<section class="card acct-strip">
    <span class="strip-icon">${icon(I.chat)}</span>
    <div class="strip-text"><p class="stat-label">Zeiko Chat</p><p class="strip-main"><strong>${esc(c.planName)}</strong> plan${c.expiresAt ? ` · until ${esc(day(c.expiresAt))}` : ''}</p>
    <p class="muted-note">The same account signs in there${o.balance.shared ? ', and the same balance pays for replies past your chat plan' : ''}.</p></div>
    ${link}
  </section>`;
}

export function overview(o, flash) {
  const body = `
    <div class="stat-grid">${planCard(o)}${balanceCard(o)}${keyCard(o)}</div>
    ${chatStrip(o)}
    <section class="card acct-section">
      <div class="section-row"><h2>Usage</h2><p class="muted-note">Last 30 days, UTC</p></div>
      ${usageChart(o.daily)}
    </section>
    <section class="card acct-section">
      <div class="section-row"><h2>Payments</h2><span class="row-links"><a class="btn-link" href="/account/how-to-buy">How to pay</a><a class="btn btn-ghost btn-sm" href="/account/plans">Buy a plan or add balance</a></span></div>
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
    const label = mine ? `Add ${num(days)} days` : `Buy for ${num(days)} days`;
    const first = picked || mine || offer ? 'btn-primary' : 'btn-ghost';
    // Both ways to pay: one line saying what the press buys, then a button
    // for each way side by side (each still says it in full to a reader).
    const buttons = crypto && qris
      ? `<p class="plan-ways-label">${label} with</p>
        <div class="plan-ways">
          <button class="btn ${first} btn-sm" type="submit" name="method" value="crypto" data-busy="Opening…"><span class="sr">${label} with </span>Crypto</button>
          <button class="btn btn-ghost btn-sm" type="submit" name="method" value="qris" data-busy="Opening…"><span class="sr">${label} with </span>QRIS</button>
        </div>`
      : [
        crypto ? `<button class="btn ${first} btn-block" type="submit" name="method" value="crypto" data-busy="Opening…">${label}</button>` : '',
        qris ? `<button class="btn ${first} btn-block" type="submit" name="method" value="qris" data-busy="Opening…">${label} · QRIS</button>` : '',
      ].join('');
    const forms = buying
      ? `<form data-act="buy">${which}${buttons}</form>
        ${crypto && p.subscription && o.subscriptionsActive ? `<form data-act="subscribe">${which}<button class="btn-link" type="submit" data-busy="Sending…">Or renew every ${num(p.days)} days by email</button></form>` : ''}`
      : '';
    const what = p.requests
      ? `<strong>${num(p.requests)}</strong> requests${offer ? ` every ${num(p.days)} days` : ''}`
      : esc(p.tagline || 'Zeiko Chat plan');
    const offerNote = offer
      ? `<p class="acct-plan-offer">${icon(I.gift)}<span><strong>Opening offer:</strong> ${num(offer.days)} days for the price of ${num(p.days)}${offer.until ? `, until ${esc(day(offer.until - 1))}` : ''}${offer.left != null ? ` · ${num(offer.left)} place${offer.left === 1 ? '' : 's'} left` : ''}.</span></p>`
      : '';
    return `<article class="acct-plan${picked ? ' is-picked' : ''}${mine ? ' is-mine' : ''}${offer ? ' has-offer' : ''}" id="${product === 'chat' ? 'chat-' : ''}plan-${esc(p.id)}">
      <div class="acct-plan-top"><h3>${esc(p.name)}</h3>${mine ? `<span class="tag tag-ok">${icon(I.check)}Your plan</span>` : ''}</div>
      <p class="acct-plan-price">${esc(usd(p.priceUsd))}<span> / ${num(days)} days</span></p>
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
    ? `<fieldset class="funds-way"><legend>Pay with</legend>
        <label><input type="radio" name="method" value="crypto" checked> Crypto</label>
        <label><input type="radio" name="method" value="qris"> QRIS (rupiah)</label>
      </fieldset>`
    : `<input type="hidden" name="method" value="${qris ? 'qris' : 'crypto'}">`;
  const ways = [
    crypto ? 'in crypto on the NOWPayments page, and come back here. Network and exchange fees are yours' : '',
    qris ? 'by QRIS in rupiah from any Indonesian bank or e-wallet app (and apps in Malaysia, Singapore and Thailand that pay QRIS abroad); we check each one by hand, usually within 10 minutes' : '',
  ].filter(Boolean);
  const body = `
    ${!buying ? alert('warn', 'Buying online is not open yet. Please try again later.') : ''}
    <section class="acct-section-plain">
      <div class="section-row"><h2>Pranata V1 plans</h2><p class="muted-note">A call over 1,024 tokens counts as two requests</p></div>
      <div class="acct-plans">${cards}</div>
      <p class="fineprint">Buying the plan you are on adds its days to it. Buying another starts it now, and what is left of the current one comes back to your balance.${subs.length ? ` Renewing: ${subs.map((s) => esc(s.planName)).join(', ')} — the next link arrives by email.` : ''}</p>
    </section>
    ${chatCards ? `<section class="acct-section-plain" id="chat">
      <div class="section-row"><h2>Zeiko Chat plans</h2><p class="muted-note">The same account signs in to Zeiko Chat</p></div>
      <div class="acct-plans">${chatCards}</div>
    </section>` : ''}
    <section class="card acct-section" id="topup">
      <div class="section-row"><h2>Balance</h2><p class="balance-now">${esc(o.balance.text)}</p></div>
      <p class="muted-note">Your balance pays for Pranata V1 calls past your plan and for Zeiko Chat replies past your chat plan. It is the same balance in Zeiko Chat.</p>
      ${buying ? `<form data-act="topup" class="funds">
        ${method}
        <div class="chips-row" role="group" aria-label="Add this amount">${chips}</div>
        <div class="funds-custom">
          <label>Other amount, USD<input type="number" name="custom" min="${esc(o.minTopUpUsd)}" max="${esc(o.maxTopUpUsd)}" step="1" inputmode="numeric" placeholder="${esc(o.minTopUpUsd)}–${esc(o.maxTopUpUsd)}"></label>
          <button class="btn btn-primary" type="submit" name="amount" value="custom" data-busy="Opening…">Add balance</button>
        </div>
      </form>` : ''}
      ${ways.length ? `<p class="fineprint">You pay ${ways.join('; or ')}. <a href="/account/how-to-buy">How to pay, step by step</a></p>` : ''}
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
  return `<svg class="qris-svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QRIS code to scan"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${d}" fill="#000000"/></svg>`;
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
          <p class="stat-label">Pay exactly</p>
          <p class="qris-amount">${esc(q.rupiahText)}</p>
          <p class="muted-note">${esc(q.what)} · ${esc(q.amountText)}. The last digits are this payment's own code: send the exact amount, so we can match it to you.</p>
          <ol class="qris-steps">
            <li>Open an app that pays QRIS: any Indonesian bank or e-wallet. From Malaysia, Singapore or Thailand, an app that pays QRIS abroad.</li>
            <li>Scan the code. The amount fills in by itself: check it reads <strong>${esc(q.rupiahText)}</strong>.</li>
            <li>Pay, then press <strong>I've paid</strong>.</li>
          </ol>
          <form data-act="qris-sent"><input type="hidden" name="id" value="${esc(q.id)}"><button class="btn btn-primary btn-block" type="submit" data-busy="Sending…">I've paid</button></form>
          <p class="fineprint">${icon(I.clock)} This code closes in ${num(left)} minute${left === 1 ? '' : 's'}. We check every QRIS payment by hand, usually within 10 minutes.</p>
        </div>
      </div>
    </section>`;
  } else {
    const state = {
      confirming: ['Checking your payment', `We are looking for ${q.rupiahText} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : 'Your plan or balance switches on'} by itself, and this page updates on its own: you can leave it.`, 'status'],
      paid: ['Payment received — thank you', `${q.what} is yours.`, 'ok'],
      failed: ['We could not find this payment', `If you did pay ${q.rupiahText}, write to payment@zeiko.biz.id with the amount, the time and your app's receipt.`, 'err'],
      expired: ['This code has closed', `It was not marked as paid in time. If you already paid ${q.rupiahText}, write to payment@zeiko.biz.id with your app's receipt; otherwise start a new payment.`, 'warn'],
    }[q.status] || ['Not available right now', 'Try again in a minute.', 'warn'];
    const [heading, text, tone] = state;
    body = `<section class="card acct-section qris qris-${esc(tone)}">
      <div class="qris-state">
        ${q.status === 'confirming' ? '<span class="spinner" aria-hidden="true"></span>' : icon(q.status === 'paid' ? I.check : I.alert)}
        <div><h2>${esc(heading)}</h2><p>${esc(text)}</p><p class="muted-note">${esc(q.what)} · ${esc(q.rupiahText)} (${esc(q.amountText)})</p></div>
      </div>
      <div class="row-links">
        ${q.status === 'paid' ? (drive ? `<a class="btn btn-primary btn-sm" href="${esc(drive)}">Back to Zeiko Drive</a>` : '<a class="btn btn-primary btn-sm" href="/account">Go to your account</a>') : ''}
        ${q.status === 'failed' || q.status === 'expired' ? `<a class="btn btn-primary btn-sm" href="${esc(back)}">Start a new payment</a>` : ''}
        ${drive ? '' : '<a class="btn btn-ghost btn-sm" href="/account/plans">Plans &amp; balance</a>'}
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
        <div><h2>Thanks, we're gonna check your payment</h2><p>We are looking for ${esc(q.rupiahText)} in our QRIS account, usually within 10 minutes. ${drive ? 'Zeiko Drive updates' : 'Your plan or balance switches on'} by itself.</p><p class="muted-note">Taking you back to ${drive ? 'Zeiko Drive' : 'your account'} in <span id="qris-countdown">${num(seconds)}</span> seconds.</p></div>
      </div>
      <div class="row-links">
        <a class="btn btn-primary btn-sm" href="${esc(drive || '/account')}">${drive ? 'Back to Zeiko Drive now' : 'Go to your account now'}</a>
      </div>
    </section>`;
  return shell('pay', o, body, '');
}

/** A value with its copy button (main.js copies whatever `data-copy` names). */
function copyRow(id, value, label, primary) {
  return `<div class="key-box">
      <code id="${id}">${esc(value)}</code>
      <button class="btn ${primary ? 'btn-primary' : 'btn-ghost'} btn-sm copy-btn" type="button" data-copy="#${id}" aria-label="${label}">${icon(I.copy)}<span class="copy-label">Copy</span></button>
    </div>`;
}

export function key(o, { flash, shown: revealed, apiBase }) {
  const shown = revealed
    ? `${copyRow('the-key', revealed, 'Copy the key', true)}
       <p class="key-note">${icon(I.alert)}<span>Keep it private: anyone with it can spend your plan and balance. Leave this page and it is hidden again.</span></p>`
    : `<div class="key-box">
         <code>${o.key ? esc(o.key.shown) : 'Not ready yet — try again in a minute'}</code>
         ${o.key ? `<form data-act="key-reveal"><button class="btn btn-primary btn-sm" type="submit" data-busy="Showing…">${icon(I.eye)}Show key</button></form>` : ''}
       </div>`;
  const models = o.models.map((m) => `<tr><th scope="row"><code id="m-${esc(m.id)}">${esc(m.id)}</code></th><td>${esc(usd(m.usd))} / ${m.unit === 'request' ? 'call' : '1M input tokens'}</td><td>${num(m.window)} tokens</td></tr>`).join('');
  const body = `
    <section class="card acct-section">
      <h2>Your key</h2>
      ${shown}
      ${apiBase ? `<div class="key-addr"><p class="key-addr-label">Address</p>${copyRow('api-base', apiBase, 'Copy the address', false)}</div>` : ''}
    </section>
    <section class="card acct-section">
      <h2>Models this key can call</h2>
      <div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">Model</th><th scope="col">Price</th><th scope="col">Longest call</th></tr></thead><tbody>${models || '<tr><td colspan="3">None right now.</td></tr>'}</tbody></table></div>
    </section>
    <section class="card acct-section danger-zone">
      <h2>Make a new key</h2>
      <p class="muted-note">The current key stops working at once. Do this if it may have been seen by someone else.</p>
      <form data-act="key-rotate" class="rotate"><label class="check"><input type="checkbox" name="sure" value="1" required> I understand the old key stops working</label><button class="btn btn-danger btn-sm" type="submit" data-busy="Making…">Make a new key</button></form>
    </section>`;
  return shell('key', o, body, flash);
}

/** The buying guide: fixed text (payguide.js), in the account's frame. */
export function howToBuy(o, flash) {
  return shell('howtobuy', o, `<article class="card acct-section guide prose">${PAY_GUIDE}</article>`, flash);
}

export function settings(o, { flash, door }) {
  const a = o.account;
  const opts = o.signInWith || {};
  const ICONS = { Google: GOOGLE_ICON, GitHub: GITHUB_ICON };
  const linked = (on, name) => `<li><span class="linked-name">${ICONS[name]}${name}</span><span class="tag ${on ? 'tag-ok' : ''}">${on ? 'Connected' : 'Not connected'}</span>${!on && opts[name.toLowerCase()] ? `<a class="btn btn-ghost btn-xs" href="${esc(`${door}/oauth/${name.toLowerCase()}?next=/account/settings`)}">Connect</a>` : ''}</li>`;
  const body = `
    <section class="card acct-section">
      <h2>Profile</h2>
      <dl class="kv">
        <div><dt>Username</dt><dd>${esc(a.username ? '@' + a.username : '—')}</dd></div>
        <div><dt>Name</dt><dd>${esc(a.name || '—')}</dd></div>
        <div><dt>Email</dt><dd>${esc(a.email || '—')} ${a.email ? `<span class="tag ${a.emailVerified ? 'tag-ok' : 'tag-warn'}">${a.emailVerified ? 'Confirmed' : 'Not confirmed'}</span>` : ''}</dd></div>
        <div><dt>Member since</dt><dd>${esc(day(a.createdAt))}</dd></div>
        ${o.referral && o.referral.code ? `<div><dt>Referral code</dt><dd><code>${esc(o.referral.code)}</code>${o.referral.discountPct ? ` · ${esc(o.referral.discountPct)}% off plans` : ''}</dd></div>` : ''}
      </dl>
    </section>
    <section class="card acct-section">
      <h2>Sign-in methods</h2>
      <p class="muted-note">One Zeiko Account: these sign you in here and in Zeiko Chat.</p>
      <ul class="linked">
        <li><span class="linked-name">${icon(I.mail)}Email and password</span><span class="tag ${a.hasPassword ? 'tag-ok' : ''}">${a.hasPassword ? 'Set' : 'Not set'}</span></li>
        ${linked(a.google, 'Google')}
        ${linked(a.github, 'GitHub')}
      </ul>
    </section>
    <div class="settings-pair">
      <section class="card acct-section">
        <h2>${a.hasPassword ? 'Change password' : 'Set a password'}</h2>
        <form data-act="password" class="form">
          ${a.hasPassword ? password({ id: 'pw-current', label: 'Current password', name: 'current', autocomplete: 'current-password' }) : '<p class="muted-note">Add one to sign in with your email as well.</p>'}
          ${password({ id: 'pw-new', label: 'New password', autocomplete: 'new-password', hint: '8 characters or more', min: 8 })}
          <button class="btn btn-primary" type="submit" data-busy="Saving…">Save password</button>
        </form>
      </section>
      ${a.hasPassword ? `<section class="card acct-section">
        <h2>Change email</h2>
        <p class="muted-note">The new address signs you in here and in Zeiko Chat once you confirm it with the code we send there.</p>
        <form data-act="email" class="form">
          <label>New email<input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254"></label>
          ${password({ id: 'email-current', label: 'Password', name: 'current', autocomplete: 'current-password' })}
          <button class="btn btn-primary" type="submit" data-busy="Saving…">Change email</button>
        </form>
      </section>` : ''}
    </div>
    <section class="card acct-section acct-signout">
      <div><h2>Sign out</h2><p class="muted-note">Signs you out on this device.</p></div>
      <form data-act="signout"><button class="btn btn-ghost btn-sm" type="submit" data-busy="Signing out…">Sign out</button></form>
    </section>`;
  return shell('settings', o, body, flash);
}

export function flash(kind, text) {
  return alert(kind, text);
}

export { when };
