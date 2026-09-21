/* ZeikoAI landing — only what the page needs: theme, menu, code tabs, copy.
 * The page still reads fine if this file never loads. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* --------------------------------------------------------- theme */
  /* localStorage can throw (private window, blocked site data), so every
     access is wrapped — the page falls back to the system theme. */

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

  /* ----------------------------------------------------- mobile menu */

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

  /* --------------------------------------------------------- code tabs */

  var TITLES = {
    'tab-curl': 'chat completion, streaming',
    'tab-python': 'openai-python, streaming',
    'tab-node': 'openai-node, streaming'
  };

  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var paneTitle = document.getElementById('paneTitle');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        var pane = document.getElementById(t.getAttribute('aria-controls'));
        if (pane) pane.hidden = !on;
      });
      if (paneTitle && TITLES[tab.id]) paneTitle.textContent = TITLES[tab.id];
    });
  });

  /* -------------------------------------------------------- copy button */

  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-copy'));
      if (!target) return;
      var text = target.textContent;
      var done = function () {
        var before = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = before; }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* -------------------------------------------------------- footer year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
