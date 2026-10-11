// The account area's pages, as finished HTML. Every value that came from a
// visitor or from the accounts service goes through `esc`; nothing else is
// put into a page. The pages work with JavaScript off: every action is a form.

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

const FAVICON = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234f46e5'/><path d='M21 9H11l6 6-6 8h10' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`;

const THEME_BUTTON = `<button class="icon-btn" id="theme" type="button" aria-label="Toggle light and dark theme">
        <svg class="i-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </button>`;

const MENU_BUTTON = `<button class="icon-btn nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>`;

/** The whole page around `body`. */
export function page({ title, body, signedIn = false, bare = false }) {
  const nav = signedIn
    ? `<a href="/#decision">Pranata V1</a>
      <a href="/models">Models</a>
      <a href="/account" aria-current="page">Account</a>
      <form method="post" action="/account/signout" class="nav-form"><input type="hidden" name="csrf" value="__CSRF__"><button class="btn btn-sm btn-ghost" type="submit">Sign out</button></form>`
    : `<a href="/#decision">Pranata V1</a>
      <a href="/#pricing">Pricing</a>
      <a href="/models">Models</a>
      <a class="nav-account" href="/account">Sign in</a>
      <a class="btn btn-sm btn-primary" href="/account/signup">Create account</a>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} — ZeikoAI</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="/css/style.css">
</head>
<body class="acct-body">

<a class="skip" href="#main">Skip to content</a>

<header class="topbar">
  <div class="wrap topbar-in">
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true">Z</span>
      <span class="brand-name">ZeikoAI</span>
    </a>
    ${bare ? '' : `<nav class="nav" id="nav" aria-label="Main navigation">
      ${nav}
    </nav>`}
    <div class="topbar-tools">
      ${THEME_BUTTON}
      ${bare ? '' : MENU_BUTTON}
    </div>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="footer">
  <div class="wrap footer-in">
    <p>© ${new Date().getUTCFullYear()} ZeikoAI</p>
    <nav aria-label="Footer links">
      <a href="/">Home</a>
      <a href="/#decision">Pranata V1</a>
      <a href="/models">Models</a>
      <a href="/#contact">Contact</a>
    </nav>
  </div>
</footer>

<script src="/js/main.js"></script>
</body>
</html>`;
}

function alert(kind, text) {
  if (!text) return '';
  return `<div class="alert alert-${kind}" role="${kind === 'err' ? 'alert' : 'status'}"><p>${esc(text)}</p></div>`;
}

const GOOGLE_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z"/></svg>`;
const GITHUB_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>`;

function providers(opts, next) {
  const q = next ? `?next=${encodeURIComponent(next)}` : '';
  const buttons = [];
  if (opts.google) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="/account/oauth/google${q}">${GOOGLE_ICON}<span>Continue with Google</span></a>`);
  if (opts.github) buttons.push(`<a class="btn btn-ghost btn-block btn-signin-with" href="/account/oauth/github${q}">${GITHUB_ICON}<span>Continue with GitHub</span></a>`);
  if (!buttons.length) return '';
  return `<div class="auth-oneclick">${buttons.join('')}</div><p class="auth-or"><span>or with your email</span></p>`;
}

function authShell(heading, sub, inner) {
  return `<section class="auth">
  <div class="auth-card card">
    <h1>${heading}</h1>
    ${sub ? `<p class="auth-sub">${sub}</p>` : ''}
    ${inner}
  </div>
</section>`;
}

export function signIn({ csrf, error, notice, email = '', next = '', opts }) {
  const hidden = `<input type="hidden" name="csrf" value="${esc(csrf)}"><input type="hidden" name="next" value="${esc(next)}">`;
  return authShell('Sign in', 'One Zeiko Account for ZeikoAI and Zeiko Chat.', `
    ${alert('err', error)}${alert('ok', notice)}
    ${providers(opts, next)}
    <form method="post" action="/account/signin" class="form">
      ${hidden}
      <label>Email<input type="email" name="email" autocomplete="email" required maxlength="254" value="${esc(email)}"></label>
      <label><span class="label-row">Password<a href="/account/forgot">Forgot it?</a></span>
        <input type="password" name="password" autocomplete="current-password" required maxlength="200"></label>
      <button class="btn btn-primary btn-block" type="submit">Sign in</button>
    </form>
    <p class="auth-foot">New here? <a href="/account/signup${next ? `?next=${encodeURIComponent(next)}` : ''}">Create an account</a></p>`);
}

export function signUp({ csrf, error, email = '', username = '', next = '', opts }) {
  return authShell('Create your Zeiko Account', 'One account for ZeikoAI and Zeiko Chat: plans, one balance and your key in one place.', `
    ${alert('err', error)}
    ${providers(opts, next)}
    <form method="post" action="/account/signup" class="form">
      <input type="hidden" name="csrf" value="${esc(csrf)}"><input type="hidden" name="next" value="${esc(next)}">
      <label>Email<input type="email" name="email" autocomplete="email" required maxlength="254" value="${esc(email)}"></label>
      <label>Username <small>3–24 letters, numbers or _</small><input type="text" name="username" autocomplete="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocapitalize="off" spellcheck="false" value="${esc(username)}"></label>
      <label>Password <small>8 characters or more</small><input type="password" name="password" autocomplete="new-password" required minlength="8" maxlength="200"></label>
      <button class="btn btn-primary btn-block" type="submit">Create account</button>
    </form>
    <p class="auth-foot">Already have one? <a href="/account/signin${next ? `?next=${encodeURIComponent(next)}` : ''}">Sign in</a></p>`);
}

export function forgot({ csrf, error, sent }) {
  if (sent) {
    return authShell('Check your inbox', '', `${alert('ok', 'If that email has an account, a link to choose a new password is on its way. The new password works here and in Zeiko Chat.')}
      <p class="auth-foot"><a href="/account/signin">Back to sign in</a></p>`);
  }
  return authShell('Forgot your password?', 'We will email you a link to choose a new one.', `
    ${alert('err', error)}
    <form method="post" action="/account/forgot" class="form">
      <input type="hidden" name="csrf" value="${esc(csrf)}">
      <label>Email<input type="email" name="email" autocomplete="email" required maxlength="254"></label>
      <button class="btn btn-primary btn-block" type="submit">Send the link</button>
    </form>
    <p class="auth-foot"><a href="/account/signin">Back to sign in</a></p>`);
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

function shell(tab, o, inner, flash) {
  const a = o.account;
  const name = a.name || a.username || a.email || 'there';
  return `<section class="acct">
  <div class="wrap">
    <header class="acct-head">
      <div>
        <p class="crumbs">Account</p>
        <h1>${tab === 'overview' ? `Hi, ${esc(name)}` : esc(TABS.find((t) => t[0] === tab)[2])}</h1>
      </div>
      <div class="acct-who"><span class="avatar" aria-hidden="true">${esc((name[0] || 'Z').toUpperCase())}</span><span>${esc(a.email || name)}</span></div>
    </header>
    <nav class="acct-tabs" aria-label="Account sections">
      ${TABS.map(([id, href, label]) => `<a href="${href}"${id === tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    ${flash || ''}
    ${!a.emailVerified && a.email && o.mail ? `<div class="alert alert-warn" role="status"><p><strong>Confirm your email.</strong> We sent a code to ${esc(a.email)}; renewal links for subscriptions go there too.</p><form method="post" action="/account/verify/send"><input type="hidden" name="csrf" value="__CSRF__"><button class="btn btn-sm btn-ghost" type="submit">Send it again</button></form></div>` : ''}
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
    return `<article class="card stat-card">
      <p class="stat-label">Plan</p>
      <p class="stat-value">${esc(p.name)}</p>
      <p class="stat-sub"><strong>${num(left)}</strong> of ${num(u.amount)} requests left</p>
      ${bar(u.amount ? u.used / u.amount : 0)}
      <p class="stat-foot">Resets ${esc(day(u.resetsAt))}${p.expiresAt ? ` · ends ${esc(day(p.expiresAt))}` : ''}</p>
      <a class="btn btn-ghost btn-sm" href="/account/plans">Change plan</a>
    </article>`;
  }
  return `<article class="card stat-card">
    <p class="stat-label">Plan</p>
    <p class="stat-value">${p.paygo ? 'Per token' : 'No plan'}</p>
    <p class="stat-sub">${p.paygo ? 'Calls are priced per token.' : 'Buy a plan to start calling Pranata V1.'}</p>
    <p class="stat-foot">A plan gives you a set number of requests for 30 days.</p>
    <a class="btn btn-primary btn-sm" href="/account/plans">See plans</a>
  </article>`;
}

function balanceCard(o) {
  const low = Number(o.balance.micro) <= 0;
  return `<article class="card stat-card">
    <p class="stat-label">Balance</p>
    <p class="stat-value">${esc(o.balance.text)}</p>
    <p class="stat-sub">Pays for Zeiko Chat replies past your chat plan.${o.balance.shared ? ' The same balance in Zeiko Chat.' : ''}</p>
    <a class="btn ${low ? 'btn-primary' : 'btn-ghost'} btn-sm" href="/account/plans#topup">Add balance</a>
  </article>`;
}

function keyCard(o) {
  return `<article class="card stat-card">
    <p class="stat-label">API key</p>
    <p class="stat-value stat-mono">${o.key ? esc(o.key.masked) : 'Not ready yet'}</p>
    <p class="stat-sub">Works with every Pranata V1 model on your plan or balance.</p>
    <p class="stat-foot">${o.models.map((m) => `<code>${esc(m.id)}</code>`).join(' ')}</p>
    <a class="btn btn-ghost btn-sm" href="/account/key">Show key</a>
  </article>`;
}

/** Calls per day, the last 30 days: thin bars, a hairline grid, a table beside. */
function usageChart(daily) {
  const DAY = 86_400_000;
  const today = Date.now() - (Date.now() % DAY);
  const byDay = new Map((daily || []).map((d) => [d.day, d]));
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const t = today - i * DAY;
    const d = byDay.get(t) || { day: t, calls: 0, units: 0, inputTokens: 0 };
    days.push(d);
  }
  const total = days.reduce((s, d) => s + d.calls, 0);
  if (!total) {
    return `<p class="muted-note">No calls in the last 30 days yet. Once your key is in use, each day shows up here.</p>`;
  }
  const max = Math.max(...days.map((d) => d.calls), 1);
  const W = 600, H = 160, L = 36, T = 8, B = 22, PW = W - L - 4, PH = H - T - B;
  const step = PW / days.length;
  const nice = (v) => {
    const p = 10 ** Math.floor(Math.log10(v));
    const n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  };
  const top = nice(max);
  const grid = [0, 0.5, 1].map((f) => {
    const y = T + PH - f * PH;
    return `<line class="grid" x1="${L}" x2="${W - 4}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="axis" x="${L - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${esc(compact(top * f))}</text>`;
  }).join('');
  const bars = days.map((d, i) => {
    const h = (d.calls / top) * PH;
    const x = L + i * step + step * 0.18;
    return `<rect x="${x.toFixed(1)}" y="${(T + PH - h).toFixed(1)}" width="${(step * 0.64).toFixed(1)}" height="${Math.max(h, d.calls ? 1 : 0).toFixed(1)}" rx="1.5"><title>${esc(day(d.day))}: ${num(d.calls)} calls</title></rect>`;
  }).join('');
  const labels = [0, 14, 29].map((i) => `<text class="axis" x="${(L + i * step + step / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${esc(day(days[i].day).replace(/ \d{4}$/, ''))}</text>`).join('');
  const rows = days.filter((d) => d.calls).reverse().map((d) => `<tr><th scope="row">${esc(day(d.day))}</th><td>${num(d.calls)}</td><td>${num(d.units)}</td><td>${num(d.inputTokens)}</td></tr>`).join('');
  return `<figure class="chart acct-chart">
    <figcaption><span class="chart-title">Calls per day</span><span class="chart-sub">Last 30 days, UTC · ${num(total)} calls</span></figcaption>
    <div class="chart-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Calls per day over the last 30 days"><g>${grid}</g><g class="bars">${bars}</g>${labels}</svg></div>
    <details class="perf-table"><summary>Show as a table</summary>
      <div class="table-scroll"><table class="table"><thead><tr><th scope="col">Day</th><th scope="col">Calls</th><th scope="col">Plan requests</th><th scope="col">Input tokens</th></tr></thead><tbody>${rows}</tbody></table></div>
    </details>
  </figure>`;
}

function compact(v) {
  if (v >= 1e6) return `${+(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${+(v / 1e3).toFixed(1)}K`;
  return String(Math.round(v));
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
  if (!list.length) return `<p class="muted-note">No payments yet.</p>`;
  const rows = list.map((p) => {
    const [label, tone] = p.paid ? ['Paid', 'ok'] : STATUS[p.status] || [p.status, ''];
    const open = p.invoiceUrl && !p.paid ? `<a class="btn btn-ghost btn-xs" href="${esc(p.invoiceUrl)}" rel="noopener">Finish paying</a>` : '';
    return `<tr><th scope="row">${esc(p.what)}</th><td>${esc(p.amountText)}</td><td><span class="tag tag-${tone}">${esc(label)}</span></td><td>${esc(day(p.createdAt))}</td><td>${open}</td></tr>`;
  }).join('');
  return `<div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">What</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Date</th><th scope="col"><span class="sr">Action</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function chatStrip(o) {
  const c = o.chat || {};
  if (!c.planName) return '';
  const link = c.url ? `<a class="btn btn-ghost btn-sm" href="${esc(c.url)}" rel="noopener">Open Zeiko Chat</a>` : '';
  return `<section class="card acct-strip">
    <div><p class="stat-label">Zeiko Chat</p><p class="strip-main"><strong>${esc(c.planName)}</strong> plan${c.expiresAt ? ` · until ${esc(day(c.expiresAt))}` : ''}</p>
    <p class="muted-note">The same account signs in there${o.balance.shared ? ', and the same balance pays for replies past your chat plan' : ''}.</p></div>
    ${link}
  </section>`;
}

export function overview(o, flash) {
  const body = `
    <div class="stat-grid">${planCard(o)}${balanceCard(o)}${keyCard(o)}</div>
    ${chatStrip(o)}
    <section class="card acct-section">
      <h2>Usage</h2>
      ${usageChart(o.daily)}
    </section>
    <section class="card acct-section">
      <div class="section-row"><h2>Payments</h2><a class="btn btn-ghost btn-sm" href="/account/plans">Buy a plan or add balance</a></div>
      ${payments(o.payments)}
    </section>`;
  return shell('overview', o, body, flash);
}

export function plans(o, { csrf, flash, pick }) {
  const buying = o.paymentsActive;
  // One card for a Pranata V1 plan or a Zeiko Chat one; `product` tells the
  // checkout which.
  const card = (p, product, current) => {
    const mine = p.id === current;
    const picked = product === 'pranata' && p.id === pick;
    const which = `<input type="hidden" name="csrf" value="${esc(csrf)}"><input type="hidden" name="product" value="${product}"><input type="hidden" name="plan" value="${esc(p.id)}">`;
    const forms = buying
      ? `<form method="post" action="/account/buy">${which}<button class="btn ${picked ? 'btn-primary' : 'btn-ghost'} btn-block" type="submit">${mine ? `Add ${num(p.days)} days` : `Buy for ${num(p.days)} days`}</button></form>
        ${p.subscription && o.subscriptionsActive ? `<form method="post" action="/account/subscribe">${which}<button class="btn btn-link btn-block" type="submit">Or renew every ${num(p.days)} days by email</button></form>` : ''}`
      : '';
    const what = p.requests ? `<strong>${num(p.requests)}</strong> requests` : esc(p.tagline || 'Zeiko Chat plan');
    return `<article class="plan acct-plan${picked ? ' is-picked' : ''}${mine ? ' is-mine' : ''}" id="${product === 'chat' ? 'chat-' : ''}plan-${esc(p.id)}">
      ${mine ? '<span class="plan-tag">Your plan</span>' : ''}
      <h3>${esc(p.name)}</h3>
      <p class="plan-price">${esc(usd(p.priceUsd))}</p>
      <p class="plan-reqs">${what}<br><span>${num(p.days)} days</span></p>
      <div class="plan-actions">${forms}</div>
    </article>`;
  };
  const cards = o.plans.map((p) => card(p, 'pranata', o.plan.id)).join('');
  const chat = o.chat || {};
  const chatCards = (chat.plans || []).map((p) => card(p, 'chat', chat.plan)).join('');
  const chips = (o.topUps || []).map((n) => `<button class="chip-btn" type="submit" name="amount" value="${esc(n)}">${esc(usd(n))}</button>`).join('');
  const subs = (o.subscriptions || []).filter((s) => s.status && !['EXPIRED', 'CANCELED', 'CANCELLED'].includes(s.status));
  const body = `
    ${!buying ? alert('warn', 'Buying online is not open yet. Please try again later.') : ''}
    <section class="acct-section-plain">
      <div class="section-row"><h2>Plans</h2><p class="muted-note">Pranata V1 only · a call over 1,000 tokens counts as two requests</p></div>
      <div class="plans acct-plans">${cards}</div>
      <p class="fineprint">Buying the plan you are on adds 30 days to it. Buying another starts it now, and what is left of the current one comes back to your balance.${subs.length ? ` Renewing: ${subs.map((s) => esc(s.planName)).join(', ')} — the next link arrives by email.` : ''}</p>
    </section>
    ${chatCards ? `<section class="acct-section-plain" id="chat">
      <div class="section-row"><h2>Zeiko Chat</h2><p class="muted-note">The same account signs in to Zeiko Chat</p></div>
      <div class="plans acct-plans">${chatCards}</div>
    </section>` : ''}
    <section class="card acct-section" id="topup">
      <div class="section-row"><h2>Balance</h2><p class="balance-now">${esc(o.balance.text)}</p></div>
      <p class="muted-note">Your balance pays for Zeiko Chat replies past your chat plan. It is the same balance in Zeiko Chat.</p>
      ${buying ? `<form method="post" action="/account/topup" class="funds">
        <input type="hidden" name="csrf" value="${esc(csrf)}">
        <div class="chips-row" role="group" aria-label="Add this amount">${chips}</div>
        <div class="funds-custom">
          <label>Other amount, USD<input type="number" name="custom" min="${esc(o.minTopUpUsd)}" max="${esc(o.maxTopUpUsd)}" step="1" inputmode="numeric" placeholder="${esc(o.minTopUpUsd)}–${esc(o.maxTopUpUsd)}"></label>
          <button class="btn btn-primary" type="submit" name="amount" value="custom">Add balance</button>
        </div>
      </form>` : ''}
      <p class="fineprint">You finish paying in crypto on the NOWPayments page and come back here. Network and exchange fees are yours.</p>
    </section>`;
  return shell('plans', o, body, flash);
}

export function key(o, { csrf, flash, secret, apiBase }) {
  const shown = secret
    ? `<div class="key-box"><code id="the-key">${esc(secret)}</code><button class="copy" type="button" data-copy="#the-key">Copy</button></div>
       <p class="fineprint">Keep it private: anyone with it can spend your plan and balance. Leave this page and it is hidden again.</p>`
    : `<div class="key-box"><code>${o.key ? esc(o.key.masked) : 'Not ready yet — try again in a minute'}</code>
         <form method="post" action="/account/key/reveal"><input type="hidden" name="csrf" value="${esc(csrf)}"><button class="btn btn-ghost btn-sm" type="submit">Show</button></form></div>`;
  const models = o.models.map((m) => `<tr><th scope="row"><code id="m-${esc(m.id)}">${esc(m.id)}</code></th><td>${esc(usd(m.usd))} / ${m.unit === 'request' ? 'call' : '1M input tokens'}</td><td>${num(m.window)} tokens</td></tr>`).join('');
  const body = `
    <section class="card acct-section">
      <h2>Your key</h2>
      ${shown}
      ${apiBase ? `<dl class="kv"><div><dt>Address</dt><dd><code id="api-base">${esc(apiBase)}</code> <button class="copy" type="button" data-copy="#api-base">Copy</button></dd></div></dl>` : ''}
    </section>
    <section class="card acct-section">
      <h2>Models this key can call</h2>
      <div class="table-scroll"><table class="table acct-table"><thead><tr><th scope="col">Model</th><th scope="col">Price</th><th scope="col">Longest call</th></tr></thead><tbody>${models || '<tr><td colspan="3">None right now.</td></tr>'}</tbody></table></div>
    </section>
    <section class="card acct-section danger-zone">
      <h2>Make a new key</h2>
      <p class="muted-note">The current key stops working at once. Do this if it may have been seen by someone else.</p>
      <form method="post" action="/account/key/rotate"><input type="hidden" name="csrf" value="${esc(csrf)}"><label class="check"><input type="checkbox" name="sure" value="1" required> I understand the old key stops working</label><button class="btn btn-danger btn-sm" type="submit">Make a new key</button></form>
    </section>`;
  return shell('key', o, body, flash);
}

export function settings(o, { csrf, flash, opts }) {
  const a = o.account;
  const linked = (on, name) => `<li><span>${name}</span><span class="tag ${on ? 'tag-ok' : ''}">${on ? 'Connected' : 'Not connected'}</span>${!on && opts[name.toLowerCase()] ? `<a class="btn btn-ghost btn-xs" href="/account/oauth/${name.toLowerCase()}?next=/account/settings">Connect</a>` : ''}</li>`;
  const body = `
    <section class="card acct-section">
      <h2>Profile</h2>
      <dl class="kv">
        <div><dt>Username</dt><dd>${esc(a.username ? '@' + a.username : '—')}</dd></div>
        <div><dt>Name</dt><dd>${esc(a.name || '—')}</dd></div>
        <div><dt>Email</dt><dd>${esc(a.email || '—')} ${a.email ? `<span class="tag ${a.emailVerified ? 'tag-ok' : 'tag-warn'}">${a.emailVerified ? 'Confirmed' : 'Not confirmed'}</span>` : ''}</dd></div>
        <div><dt>Member since</dt><dd>${esc(day(a.createdAt))}</dd></div>
      </dl>
    </section>
    <section class="card acct-section">
      <h2>Sign-in methods</h2>
      <p class="muted-note">One Zeiko Account: these sign you in here and in Zeiko Chat.</p>
      <ul class="linked">
        <li><span>Email and password</span><span class="tag ${a.hasPassword ? 'tag-ok' : ''}">${a.hasPassword ? 'Set' : 'Not set'}</span></li>
        ${linked(a.google, 'Google')}
        ${linked(a.github, 'GitHub')}
      </ul>
    </section>
    <section class="card acct-section">
      <h2>${a.hasPassword ? 'Change password' : 'Set a password'}</h2>
      <form method="post" action="/account/password" class="form form-narrow">
        <input type="hidden" name="csrf" value="${esc(csrf)}">
        ${a.hasPassword ? '<label>Current password<input type="password" name="current" autocomplete="current-password" required maxlength="200"></label>' : '<p class="muted-note">Add one to sign in with your email as well.</p>'}
        <label>New password <small>8 characters or more</small><input type="password" name="password" autocomplete="new-password" required minlength="8" maxlength="200"></label>
        <button class="btn btn-primary" type="submit">Save password</button>
      </form>
    </section>
    <section class="card acct-section">
      <h2>Sign out</h2>
      <p class="muted-note">Signs you out on this device.</p>
      <form method="post" action="/account/signout"><input type="hidden" name="csrf" value="${esc(csrf)}"><button class="btn btn-ghost btn-sm" type="submit">Sign out</button></form>
    </section>`;
  return shell('settings', o, body, flash);
}

export function flash(kind, text) {
  return alert(kind, text);
}

export { when };
