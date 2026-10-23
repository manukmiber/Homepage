// Every public page: the top bar says who is signed in. The page is a plain
// file and goes out the same to everybody, with "Sign in"; this script asks
// the account door (the page's <meta name="zeiko-accounts">) and, when the
// visitor is signed in, puts their name where "Sign in" was, hides what is
// only for people without an account (`data-signed-out`) and shows what is
// only for people with one (`data-signed-in`). Without JavaScript, or when
// the door does not answer, the page stays as it was written.

import { displayName, hinted, meLink, remember } from './me.js';

const DOOR = (document.querySelector('meta[name="zeiko-accounts"]') || {}).content?.replace(/\/+$/, '') || '';
const signIn = document.querySelector('#nav .nav-account');
const TITLE = document.documentElement.lang === 'id' ? 'Akunmu' : 'Your account';
let me = null;

function paint(name) {
  if (signIn) {
    if (name) {
      const box = document.createElement('template');
      box.innerHTML = meLink(name, { title: TITLE });
      const link = box.content.firstElementChild;
      (me || signIn).replaceWith(link);
      me = link;
    } else if (me) {
      me.replaceWith(signIn);
      me = null;
    }
  }
  for (const el of document.querySelectorAll('[data-signed-out]')) el.hidden = Boolean(name);
  for (const el of document.querySelectorAll('[data-signed-in]')) el.hidden = !name;
}

async function check() {
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 10_000);
  try {
    const res = await fetch(`${DOOR}/v1/session`, { credentials: 'include', signal: stop.signal });
    if (res.status !== 200) return;
    const data = await res.json();
    const account = data && data.account ? data.account : null;
    remember(account);
    paint(displayName(account));
  } catch {
    /* the door did not answer: the page keeps what it shows */
  } finally {
    clearTimeout(timer);
  }
}

// Asked again when the visitor comes back to the tab (they may have signed
// in or out in another one), or back to the page from the browser's history
// — but not more than every 15 seconds.
let asked = 0;
function askAgain() {
  if (Date.now() - asked < 15_000) return;
  asked = Date.now();
  check();
}

if (DOOR) {
  // The name this tab saw last, at once; the door's answer replaces it.
  const name = hinted();
  if (name) paint(name);
  askAgain();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') askAgain();
  });
  addEventListener('pageshow', (e) => {
    if (e.persisted) askAgain();
  });
}
