// Who is signed in, as the top bar shows it: on every public page
// (session.js) and in the account area (views.js, app.js), drawn the same
// way. The account door is the one place that knows; this file only names
// the person and keeps a hint of that name for the tab, so the next page can
// show it before the door has answered again. The door's answer always wins.

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** What to call the person: their name, else their username, else their email's first part. */
export function displayName(account) {
  if (!account) return '';
  const name = String(account.name || '').trim();
  if (name) return name.slice(0, 60);
  const user = String(account.username || '').trim();
  if (user) return user.slice(0, 60);
  return String(account.email || '').split('@')[0].slice(0, 60) || 'Account';
}

/** The first letter of a name, for the round badge. */
export function initial(name) {
  const first = [...String(name || '').trim()][0] || 'Z';
  return first.toUpperCase();
}

/** The top bar's "you": a badge and the name, a link to the account. */
export function meLink(name, { current = false, title = 'Your account' } = {}) {
  return `<a class="nav-account nav-me" href="/account"${current ? ' aria-current="page"' : ''} title="${esc(title)}"><span class="avatar avatar-sm" aria-hidden="true">${esc(initial(name))}</span><span class="nav-me-name">${esc(name)}</span></a>`;
}

/* -------------------------------------------- the tab's hint of the name */

const HINT = 'zeiko.me';

/** The name this tab last saw signed in, or ''. */
export function hinted() {
  try {
    const v = JSON.parse(sessionStorage.getItem(HINT) || 'null');
    return v && typeof v.name === 'string' ? v.name.slice(0, 60) : '';
  } catch {
    return '';
  }
}

/** Keep (or, signed out, drop) the name for the tab's next page. */
export function remember(account) {
  try {
    if (account) sessionStorage.setItem(HINT, JSON.stringify({ name: displayName(account) }));
    else sessionStorage.removeItem(HINT);
  } catch {
    /* private mode: the next page asks the door first */
  }
}
