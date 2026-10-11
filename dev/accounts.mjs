#!/usr/bin/env node
// A stand-in for the accounts service, for working on /account locally. It
// answers the calls src/account/service.js makes, keeps its accounts in
// .wrangler/dev-accounts.json, and starts with the made-up accounts in
// dev/accounts-seed.json (their passwords are written there).
//
//   npm run accounts:dev      then, in a second terminal: npx wrangler dev
//
// The first run adds ACCOUNTS_URL, ACCOUNTS_TOKEN and SESSION_SECRET to
// .dev.vars when they are missing. Buying is simulated: a checkout counts as
// paid the moment it is opened. No mail is sent. Never point a deployed site
// at this.

import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VARS = join(ROOT, '.dev.vars');
const SEED = join(ROOT, 'dev', 'accounts-seed.json');
const STATE_DIR = join(ROOT, '.wrangler');
const STATE = join(STATE_DIR, 'dev-accounts.json');
const DEFAULT_URL = 'http://127.0.0.1:8788';
const DAY = 86_400_000;
const MAX_BODY = 64 * 1024;

// The same plans and price the pages show (index.html, models.html).
const PLANS = [
  { id: 'welcome', name: 'Welcome', priceUsd: 1, requests: 10_000 },
  { id: 'expand', name: 'Expand', priceUsd: 5, requests: 100_000 },
  { id: 'huh', name: 'Huh?', priceUsd: 10, requests: 250_000 },
  { id: 'question', name: 'Question about decision?', priceUsd: 25, requests: 750_000 },
  { id: 'enough', name: 'Is this even enough for you?', priceUsd: 50, requests: 2_000_000 },
].map((p) => ({ ...p, days: 30, subscription: false }));
const MODELS = [{ id: 'pranata-v1', unit: 'mtok', usd: 0.003, window: 2000 }];
// Zeiko Chat's paid plans, as the accounts service ships them. The balance
// is Zeiko Chat credit.
const CHAT_PLANS = [
  { id: 'lite', name: 'Lite', priceUsd: 5, tagline: 'For casual roleplayers' },
  { id: 'medium', name: 'Medium', priceUsd: 10, tagline: 'For daily storytellers' },
  { id: 'high', name: 'High', priceUsd: 25, tagline: 'For power users' },
].map((p) => ({ ...p, days: 30, requests: 0, subscription: false }));
const TOP_UPS = [5, 10, 25, 50];
const MIN_TOP_UP = 5;
const MAX_TOP_UP = 500;

/* -------------------------------------------------------------- .dev.vars */

function readVars() {
  const vars = {};
  if (!existsSync(VARS)) return vars;
  for (const line of readFileSync(VARS, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^(["'])(.*)\1$/, '$2');
  }
  return vars;
}

/** .dev.vars with the three settings /account needs, adding the missing ones. */
function ensureVars() {
  const vars = readVars();
  const add = {};
  if (!vars.ACCOUNTS_URL) add.ACCOUNTS_URL = DEFAULT_URL;
  if (!vars.ACCOUNTS_TOKEN) add.ACCOUNTS_TOKEN = randomBytes(24).toString('base64url');
  if (!vars.SESSION_SECRET) add.SESSION_SECRET = randomBytes(32).toString('base64url');
  if (Object.keys(add).length) {
    const before = existsSync(VARS) ? readFileSync(VARS, 'utf8') : '';
    const lead = before && !before.endsWith('\n') ? '\n' : '';
    appendFileSync(VARS, lead + Object.entries(add).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
    console.log(`.dev.vars: added ${Object.keys(add).join(', ')}. Restart wrangler dev if it is running.`);
  }
  const all = { ...vars, ...add };
  if (all.SESSION_SECRET.length < 32) console.warn('.dev.vars: SESSION_SECRET is shorter than 32 characters; /account will say accounts open soon.');
  return all;
}

/* ------------------------------------------------------------------ store */

let db = { accounts: [] };

function load() {
  if (existsSync(STATE)) db = JSON.parse(readFileSync(STATE, 'utf8'));
}

function save() {
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(`${STATE}.tmp`, JSON.stringify(db, null, 2));
  renameSync(`${STATE}.tmp`, STATE);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  return { salt, hash: scryptSync(password, salt, 32).toString('base64url') };
}

function passwordOk(a, password) {
  if (!a.hash || typeof password !== 'string') return false;
  const want = Buffer.from(a.hash, 'base64url');
  const got = scryptSync(password, a.salt, 32);
  return got.length === want.length && timingSafeEqual(got, want);
}

const newKey = () => randomBytes(24).toString('base64url');
const byEmail = (email) => db.accounts.find((a) => a.email && a.email.toLowerCase() === String(email).trim().toLowerCase());
const byUsername = (name) => db.accounts.find((a) => a.username.toLowerCase() === String(name).toLowerCase());

function create({ email = '', username, name = '', password, emailVerified = false }) {
  const a = {
    id: randomUUID(),
    email: email.trim(),
    username,
    name,
    salt: null,
    hash: null,
    emailVerified,
    google: null,
    github: null,
    createdAt: Date.now(),
    plan: null,
    // Zeiko Chat: its plan ({id, expiresAt}), and the balance (its credit).
    chatPlan: null,
    creditMicro: 0,
    key: newKey(),
    payments: [],
  };
  if (password) Object.assign(a, hashPassword(password));
  db.accounts.push(a);
  return a;
}

/** The made-up accounts in dev/accounts-seed.json that are not here yet. */
function seed() {
  if (!existsSync(SEED)) return;
  const { accounts = [] } = JSON.parse(readFileSync(SEED, 'utf8'));
  for (const s of accounts) {
    if (byEmail(s.email)) continue;
    const a = create({ email: s.email, username: s.username, name: s.name || '', password: s.password, emailVerified: s.emailVerified !== false });
    const plan = PLANS.find((p) => p.id === s.plan);
    if (plan) a.plan = { id: plan.id, startedAt: Date.now(), expiresAt: Date.now() + plan.days * DAY };
    a.creditMicro = Math.round(Number(s.creditUsd || 0) * 1e6);
    console.log(`seeded ${s.email} (@${s.username})`);
  }
  save();
}

/* ---------------------------------------------------------------- answers */

const err = (code, message) => ({ error: { code, message } });
const NOT_FOUND = [404, err('not_found', 'not found')];
const usdText = (micro) => `$${(micro / 1e6).toFixed(2)}`;

function publicAccount(a) {
  return {
    id: a.id,
    username: a.username,
    name: a.name,
    email: a.email,
    emailVerified: a.emailVerified,
    hasPassword: Boolean(a.hash),
    google: Boolean(a.google),
    github: Boolean(a.github),
    createdAt: a.createdAt,
  };
}

function overview(a) {
  const plan = a.plan && a.plan.expiresAt > Date.now() ? PLANS.find((p) => p.id === a.plan.id) : null;
  const chat = a.chatPlan && a.chatPlan.expiresAt > Date.now() ? CHAT_PLANS.find((p) => p.id === a.chatPlan.id) : null;
  return {
    account: publicAccount(a),
    mail: false,
    plan: plan
      ? { id: plan.id, name: plan.name, paygo: false, requests: plan.requests, days: plan.days, expiresAt: a.plan.expiresAt }
      : { id: 'none', name: 'No plan', paygo: false },
    chat: {
      plan: chat ? chat.id : 'free',
      planName: chat ? chat.name : 'Free',
      expiresAt: chat ? a.chatPlan.expiresAt : null,
      plans: CHAT_PLANS,
    },
    usage: plan ? { used: 0, amount: plan.requests, periodStart: a.plan.startedAt, resetsAt: a.plan.expiresAt } : null,
    balance: { micro: a.creditMicro, text: usdText(a.creditMicro), shared: true },
    prepaid: false,
    plans: PLANS,
    topUps: TOP_UPS,
    minTopUpUsd: MIN_TOP_UP,
    maxTopUpUsd: MAX_TOP_UP,
    paymentsActive: true,
    subscriptionsActive: false,
    key: { id: 'k1', masked: `${a.key.slice(0, 4)}…${a.key.slice(-4)}`, enabled: true },
    models: MODELS,
    payments: a.payments.slice().reverse(),
    subscriptions: [],
    daily: [],
  };
}

/* ---------------------------------------------------------------- sign in */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/;
const passwordProblem = (p) => (typeof p !== 'string' || p.length < 8 || p.length > 200 ? 'A password is 8 characters or more.' : '');

// Wrong passwords per address: five in ten minutes, then a wait.
const tries = new Map();
const TRY_WINDOW = 10 * 60_000;
const MAX_TRIES = 5;

function throttled(ip) {
  const t = tries.get(ip);
  return Boolean(t && t.until > Date.now() && t.count >= MAX_TRIES);
}

function missed(ip) {
  const t = tries.get(ip);
  if (!t || t.until <= Date.now()) tries.set(ip, { count: 1, until: Date.now() + TRY_WINDOW });
  else t.count += 1;
}

function signup({ email = '', username = '', password = '' }) {
  if (!EMAIL_RE.test(email.trim()) || email.length > 254) return [400, err('bad_email', 'Type a valid email address.')];
  if (!USERNAME_RE.test(username)) return [400, err('bad_username', 'A username is 3–24 letters, numbers or _.')];
  const weak = passwordProblem(password);
  if (weak) return [400, err('bad_password', weak)];
  if (byEmail(email)) return [409, err('email_taken', 'That email already has an account. Sign in instead.')];
  if (byUsername(username)) return [409, err('username_taken', 'That username is taken. Try another.')];
  const a = create({ email, username, password });
  save();
  return [200, { account: publicAccount(a) }];
}

function login({ email = '', password = '' }, ip) {
  if (throttled(ip)) return [429, err('too_many', 'Too many tries. Wait a few minutes and try again.')];
  const a = byEmail(email);
  if (!a || !passwordOk(a, password)) {
    missed(ip);
    return [401, err('bad_login', 'That email and password do not match.')];
  }
  tries.delete(ip);
  return [200, { account: publicAccount(a) }];
}

function oauth({ provider, subject, email = '', emailVerified = false, name = '', linkTo = '' }) {
  if (provider !== 'google' && provider !== 'github') return [400, err('bad_provider', 'That sign-in method is not supported.')];
  const holder = db.accounts.find((a) => a[provider] === subject);
  if (linkTo) {
    const a = db.accounts.find((x) => x.id === linkTo);
    if (!a) return [404, err('no_account', 'That account no longer exists.')];
    if (holder && holder !== a) return [409, err('linked_elsewhere', 'That account is already connected to another Zeiko Account.')];
    a[provider] = subject;
    save();
    return [200, { account: publicAccount(a), created: false }];
  }
  if (holder) return [200, { account: publicAccount(holder), created: false }];
  if (email && byEmail(email)) return [409, err('email_taken', 'That email already has an account.')];
  let base = (name || email.split('@')[0] || 'user').replace(/[^A-Za-z0-9_]/g, '').slice(0, 18);
  if (base.length < 3) base = `user${base}`;
  let username = base;
  while (byUsername(username)) username = `${base}${Math.floor(Math.random() * 10_000)}`;
  const a = create({ email, username, name, emailVerified });
  a[provider] = subject;
  save();
  return [200, { account: publicAccount(a), created: true }];
}

function reset({ email = '' }) {
  console.log(`  password reset asked for ${byEmail(email) ? 'a known' : 'an unknown'} email; the stand-in sends no mail`);
  return [200, { sent: true }];
}

/* ---------------------------------------------------------------- account */

function password(a, { current = '', password: next = '' }) {
  if (a.hash && !passwordOk(a, current)) return [400, err('bad_password', 'Your current password is not right.')];
  const weak = passwordProblem(next);
  if (weak) return [400, err('bad_password', weak)];
  Object.assign(a, hashPassword(next));
  save();
  return [200, { ok: true }];
}

function checkout(a, { product, kind, plan: planId, amountUsd, returnUrl }) {
  if (typeof returnUrl !== 'string' || !/^https?:\/\//.test(returnUrl)) return [400, err('bad_return', 'returnUrl is missing.')];
  const now = Date.now();
  const chat = product === 'chat';
  let payment;
  if (kind === 'plan') {
    const plan = (chat ? CHAT_PLANS : PLANS).find((p) => p.id === planId);
    if (!plan) return [400, err('bad_plan', 'Pick one of the paid plans.')];
    // Same plan: 30 more days. Another plan: starts now (the stand-in does
    // not turn what was left of the old one into balance).
    const field = chat ? 'chatPlan' : 'plan';
    const was = a[field];
    const running = was && was.expiresAt > now && was.id === plan.id;
    a[field] = running
      ? { ...was, expiresAt: was.expiresAt + plan.days * DAY }
      : { id: plan.id, startedAt: now, expiresAt: now + plan.days * DAY };
    payment = { kind: 'plan', what: `${plan.name} plan, 30 days`, amountText: usdText(plan.priceUsd * 1e6) };
  } else if (kind === 'credit') {
    if (!chat) return [400, err('bad_kind', 'A decision account buys plans; pay-as-you-go is invoiced on what it used.')];
    const usd = Math.floor(Number(amountUsd));
    if (!Number.isFinite(usd) || usd < MIN_TOP_UP || usd > MAX_TOP_UP) return [400, err('bad_amount', `Pick an amount from $${MIN_TOP_UP} to $${MAX_TOP_UP}.`)];
    a.creditMicro += usd * 1e6;
    payment = { kind: 'credit', what: 'Balance', amountText: usdText(usd * 1e6) };
  } else {
    return [400, err('bad_kind', 'Buy a plan or add a balance.')];
  }
  const id = randomBytes(9).toString('base64url');
  a.payments.push({ id, ...payment, status: 'finished', paid: true, invoiceUrl: '', createdAt: now });
  save();
  return [200, { invoiceUrl: `${returnUrl}?paid=${id}` }];
}

function route(method, path, body, ip) {
  if (method === 'POST' && path === '/signup') return signup(body);
  if (method === 'POST' && path === '/login') return login(body, ip);
  if (method === 'POST' && path === '/oauth') return oauth(body);
  if (method === 'POST' && path === '/reset') return reset(body);

  const m = path.match(/^\/accounts\/([^/]+)(\/.*)?$/);
  if (!m) return NOT_FOUND;
  const a = db.accounts.find((x) => x.id === decodeURIComponent(m[1]));
  if (!a) return [404, err('no_account', 'That account no longer exists.')];
  const rest = m[2] || '';

  if (method === 'GET' && rest === '') return [200, overview(a)];
  if (method === 'GET' && rest === '/key') return [200, { secret: a.key }];
  if (method === 'POST' && rest === '/key/rotate') {
    a.key = newKey();
    save();
    return [200, { secret: a.key }];
  }
  if (method === 'POST' && rest === '/password') return password(a, body);
  if (method === 'POST' && rest === '/resend') return [200, { sent: true }];
  if (method === 'POST' && rest === '/checkout') return checkout(a, body);
  if (method === 'POST' && rest === '/subscribe') return [400, err('not_open', 'Renewing by email is not open yet.')];
  const pay = rest.match(/^\/payments\/([^/]+)\/recheck$/);
  if (method === 'POST' && pay) {
    const p = a.payments.find((x) => x.id === decodeURIComponent(pay[1]));
    return p ? [200, { paid: p.paid }] : [404, err('no_payment', 'That payment was not found.')];
  }
  return NOT_FOUND;
}

/* ----------------------------------------------------------------- server */

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) reject(new Error('body too large'));
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const vars = ensureVars();
const where = new URL(vars.ACCOUNTS_URL);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(where.hostname)) {
  console.error(`.dev.vars points ACCOUNTS_URL at ${where.host}, not this machine. The stand-in only runs when it is ${DEFAULT_URL}.`);
  process.exit(1);
}
const expected = Buffer.from(`Bearer ${vars.ACCOUNTS_TOKEN}`);
const allowed = (header) => {
  const got = Buffer.from(String(header || ''));
  return got.length === expected.length && timingSafeEqual(got, expected);
};

load();
seed();

createServer(async (req, res) => {
  const send = ([status, data]) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(data));
    console.log(`${req.method} ${url.pathname} → ${status}`);
  };
  const url = new URL(req.url, 'http://stand-in');
  if (!url.pathname.startsWith('/site/v1/') || !allowed(req.headers.authorization)) return send(NOT_FOUND);
  let body = {};
  try {
    const text = req.method === 'POST' ? await readBody(req) : '';
    if (text) body = JSON.parse(text);
  } catch {
    return send([400, err('bad_body', 'That request could not be read.')]);
  }
  try {
    send(route(req.method, url.pathname.slice('/site/v1'.length), body || {}, String(req.headers['x-site-client-ip'] || 'local')));
  } catch (e) {
    console.error(e);
    send([500, err('internal', 'The stand-in failed; see its terminal.')]);
  }
}).listen(Number(where.port) || 80, where.hostname.replace(/^\[|\]$/g, ''), () => {
  console.log(`accounts stand-in on ${vars.ACCOUNTS_URL} (${db.accounts.length} account${db.accounts.length === 1 ? '' : 's'}). Ctrl+C to stop.`);
});
