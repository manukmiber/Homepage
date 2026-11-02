/* Zeiko site — only what the pages need: the light and dark switch, the
 * language choice, the header's shadow, copy buttons and the footer's year.
 * Every page still reads fine if this file never loads. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* The few words this file writes, in the page's own language — read when
     they are written, since the account pages set theirs after this file
     runs. */
  var WORDS = {
    id: { copied: 'Tersalin', selected: 'Terpilih' },
    en: { copied: 'Copied', selected: 'Selected' }
  };
  function words() { return root.lang === 'id' ? WORDS.id : WORDS.en; }

  /* --------------------------------------------------------- theme */
  /* localStorage can throw (private window, blocked site data), so every
     access is wrapped — the page follows the system setting instead. */

  function readTheme() {
    try { return localStorage.getItem('zeiko-theme'); } catch (e) { return null; }
  }
  function writeTheme(v) {
    try { localStorage.setItem('zeiko-theme', v); } catch (e) { /* ignore */ }
  }

  var saved = readTheme();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark' ||
        (!root.hasAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      writeTheme(next);
    });
  }

  /* ----------------------------------------------- menu (older pages) */
  /* The cloud pages show their products in the header itself. Pages still
     on the older header fold theirs behind a menu button. */

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------ header */
  /* A shadow under the header once the page has moved; the product in the
     scrolling row on a phone brought into view. */

  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var onScroll = function () { topbar.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  var here = nav && nav.querySelector('a[aria-current="page"]');
  if (here && nav.scrollWidth > nav.clientWidth) {
    nav.scrollLeft = Math.max(0, here.offsetLeft - nav.clientWidth / 2 + here.offsetWidth / 2);
  }

  /* -------------------------------------------------------- copy button */
  /* One listener on the document, so buttons drawn after the page loads
     (the account area draws its key box later) copy too. */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('button[data-copy]');
    if (!btn) return;
    var target = document.querySelector(btn.getAttribute('data-copy'));
    if (!target) return;
    var text = target.textContent.trim();
    // A button with an icon keeps it: only its .copy-label text changes.
    var out = btn.querySelector('.copy-label') || btn;
    var label = btn.getAttribute('data-label') || out.textContent;
    btn.setAttribute('data-label', label);
    var say = function (word) {
      out.textContent = word;
      btn.classList.toggle('is-copied', word === words().copied);
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(function () { out.textContent = label; btn.classList.remove('is-copied'); }, 1600);
    };
    var done = function () { say(words().copied); };
    // Nothing worked: select the text so it can be copied by hand.
    var fail = function () { selectText(target); say(words().selected); };

    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { copyViaTextarea(text, done, fail); });
    } else {
      copyViaTextarea(text, done, fail);
    }
  });

  function copyViaTextarea(text, done, fail) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) done(); else fail();
  }

  function selectText(el) {
    var sel = window.getSelection && window.getSelection();
    if (!sel) return;
    var range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ---------------------------------------------------------- language */
  /* EN | ID is a plain link to the same page in the other language. The
     choice is kept for the whole site in the zk_lang cookie, which Zeiko
     Drive reads too: it is on a subdomain of this site, so on zeiko.biz.id
     the cookie is the whole domain's (anywhere else, a preview, it stays on
     the page's own host). An Indonesian page sets it once if nothing is kept
     yet. */

  function keepLang(lang) {
    var host = location.hostname;
    var domain = host === 'zeiko.biz.id' || /\.zeiko\.biz\.id$/.test(host) ? '; Domain=zeiko.biz.id' : '';
    document.cookie = 'zk_lang=' + (lang === 'id' ? 'id' : 'en') + '; Path=/; Max-Age=31536000; SameSite=Lax; Secure' + domain;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (a) {
    a.addEventListener('click', function () {
      keepLang(a.getAttribute('data-lang'));
    });
  });
  if (root.lang === 'id' && !/(?:^|; )zk_lang=/.test(document.cookie)) keepLang('id');

  /* -------------------------------------------------------- footer year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
