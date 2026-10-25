/* Zeiko site — only what the pages need: theme, menu, topbar, copy, plan
 * value, cost estimator, chart hover.
 * Every page still reads fine if this file never loads. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* The few words this file writes, in the page's own language — read when
     they are written, since the account pages set theirs after this file
     runs. Prices stay in US dollars, written the same way on both. */
  var WORDS_ID = {
    locale: 'id-ID',
    copied: 'Tersalin',
    selected: 'Terpilih',
    perDollar: function (n) { return n + ' permintaan per dolar'; },
    forRequests: function (n) { return 'Untuk ' + n + ' permintaan'; }
  };
  var WORDS_EN = {
    locale: 'en-US',
    copied: 'Copied',
    selected: 'Selected',
    perDollar: function (n) { return n + ' requests per dollar'; },
    forRequests: function (n) { return 'For ' + n + ' requests'; }
  };
  function words() { return root.lang === 'id' ? WORDS_ID : WORDS_EN; }

  /* --------------------------------------------------------- theme */
  /* localStorage can throw (private window, blocked site data), so every
     access is wrapped — the page follows the system theme instead. */

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

  /* ------------------------------------------------------------ topbar */
  /* A shadow under the bar once the page has moved, and the nav link of
     the section in view marked. */

  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var onScroll = function () { topbar.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (nav && 'IntersectionObserver' in window) {
    var byId = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) byId[el.id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (a) a.classList.toggle('is-here', e.isIntersecting);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) { spy.observe(document.getElementById(id)); });
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

  /* ------------------------------------------------------------ prices */
  /* Every price on the page is written into the HTML with a data-price
     key; nothing is fetched. The script only ever reads them back. */

  function dollars(text) {
    var n = parseFloat(String(text).replace(/[^0-9.]/g, ''));
    return isFinite(n) ? n : 0;
  }

  function money(v) {
    if (v === 0) return '$0.00';
    if (v < 0.0001) return '< $0.0001';
    if (v < 0.01) return '$' + v.toPrecision(3);
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* Hero bars: widths follow the prices beside them, so a rate change
     never leaves a bar the wrong length. */
  document.querySelectorAll('.bars').forEach(function (list) {
    var rows = [].slice.call(list.querySelectorAll('li'));
    var values = rows.map(function (li) {
      var p = li.querySelector('[data-price]');
      return p ? dollars(p.textContent) : 0;
    });
    var max = Math.max.apply(null, values);
    if (!(max > 0)) return;
    rows.forEach(function (li, i) {
      var fill = li.querySelector('.bar > span');
      if (fill) fill.style.width = Math.round(values[i] / max * 100) + '%';
    });
  });

  /* Plan value: requests per dollar for each Decision plan, worked out from
     the plan's own price and request count, with a meter scaled to the best
     one, which gets the "Best value" tag. Without JavaScript the line stays
     hidden; the price and the requests already say it all. */
  /* An opening offer with an end date takes itself down once it has passed
     (the operator still removes the words from the page afterwards). */
  [].slice.call(document.querySelectorAll('[data-offer-until]')).forEach(function (el) {
    var until = Date.parse(el.getAttribute('data-offer-until'));
    if (until && Date.now() >= until) el.hidden = true;
  });

  var plans = [].slice.call(document.querySelectorAll('.plan[data-requests]'));
  var perDollar = plans.map(function (plan) {
    var price = plan.querySelector('.plan-price[data-price]');
    var usd = price ? dollars(price.textContent) : 0;
    var reqs = Number(plan.getAttribute('data-requests'));
    return usd > 0 && reqs > 0 ? reqs / usd : 0;
  });
  var bestValue = Math.max.apply(null, perDollar.concat(0));
  if (bestValue > 0) {
    plans.forEach(function (plan, i) {
      var v = perDollar[i];
      var value = plan.querySelector('.plan-value');
      if (!v || !value) return;
      value.querySelector('.plan-per').textContent =
        words().perDollar(Math.round(v).toLocaleString(words().locale));
      value.querySelector('.plan-meter > span').style.setProperty('--w', Math.max(6, Math.round(v / bestValue * 100)) + '%');
      value.hidden = false;
      if (v === bestValue && plans.length > 1) {
        plan.classList.add('is-best');
        var tag = plan.querySelector('.plan-best');
        if (tag) tag.hidden = false;
      }
    });
  }

  /* ------------------------------------------------------ cost estimator */
  /* Reads its rates from the pricing table, so the table stays the only
     place the landing page states them. */

  var calc = document.getElementById('calc');
  var table = document.getElementById('rateTable');
  if (calc && table) {
    var f = calc.elements;
    var rates = {};

    table.querySelectorAll('tr[data-model]').forEach(function (row) {
      var id = row.getAttribute('data-model');
      var r = {};
      row.querySelectorAll('[data-price]').forEach(function (cell) {
        r[cell.getAttribute('data-price').split(':')[1]] = dollars(cell.textContent);
      });
      rates[id] = r;

      var opt = document.createElement('option');
      opt.value = id;
      opt.textContent = id;
      f.model.appendChild(opt);
    });

    var outOne = calc.querySelector('[data-out="one"]');
    var outAll = calc.querySelector('[data-out="all"]');
    var allLabel = outAll && outAll.previousElementSibling;

    var count = function (name) {
      var v = Math.floor(Number(f[name].value));
      return isFinite(v) && v > 0 ? v : 0;
    };

    var update = function () {
      var r = rates[f.model.value];
      if (!r) return;
      var input = count('input');
      var cached = Math.min(count('cached'), input);
      var output = count('output');
      var n = count('requests');
      var one = ((input - cached) * r.input + cached * r.cache + output * r[f.effort.value]) / 1e6;
      outOne.textContent = money(one);
      outAll.textContent = money(one * n);
      if (allLabel) allLabel.textContent = words().forRequests(n.toLocaleString(words().locale));
    };

    calc.addEventListener('input', update);
    calc.addEventListener('change', update);
    calc.addEventListener('submit', function (e) { e.preventDefault(); });
    calc.hidden = false;
    update();
  }

  /* ------------------------------------------------------ chart hover */
  /* The charts on /models arrive as finished SVG. This adds the crosshair
     and the readout: pointer or arrow keys pick a period. Every value is
     also in the table under each set of charts. */

  document.querySelectorAll('.chart-plot svg[data-x]').forEach(function (svg) {
    var plot = svg.parentNode;
    var labels = svg.getAttribute('data-x').split('|');
    var names = (svg.getAttribute('data-names') || '').split('|');
    var series = ['data-v1', 'data-v2']
      .map(function (a) { return svg.getAttribute(a); })
      .filter(Boolean)
      .map(function (v) { return v.split('|'); });
    var g = svg.getAttribute('data-geom').split(' ').map(Number); // left, plot width, width, top, plot height
    var n = labels.length;
    var at = -1;

    var cross = document.createElement('div');
    cross.className = 'chart-cross';
    cross.hidden = true;
    var tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    plot.appendChild(cross);
    plot.appendChild(tip);

    function show(i) {
      at = Math.max(0, Math.min(n - 1, i));
      var scale = svg.getBoundingClientRect().width / g[2];
      var x = (g[0] + (at + 0.5) * (g[1] / n)) * scale;
      cross.style.left = x + 'px';
      cross.style.top = g[3] * scale + 'px';
      cross.style.height = g[4] * scale + 'px';
      cross.hidden = false;

      tip.textContent = '';
      var title = document.createElement('div');
      title.className = 'chart-tip-title';
      title.textContent = labels[at];
      tip.appendChild(title);
      series.forEach(function (vals, j) {
        var row = document.createElement('div');
        row.className = 'chart-tip-row';
        var key = document.createElement('i');
        key.className = 's' + (j + 1);
        var value = document.createElement('strong');
        value.textContent = vals[at];
        var name = document.createElement('span');
        name.textContent = names[j] || '';
        row.appendChild(key);
        row.appendChild(value);
        row.appendChild(name);
        tip.appendChild(row);
      });
      tip.hidden = false;
      var w = tip.offsetWidth;
      var left = x + 12;
      if (left + w > plot.clientWidth) left = Math.max(0, x - w - 12);
      tip.style.left = left + 'px';
    }

    function hide() {
      cross.hidden = true;
      tip.hidden = true;
    }

    svg.addEventListener('pointermove', function (e) {
      var rect = svg.getBoundingClientRect();
      var px = (e.clientX - rect.left) / (rect.width / g[2]);
      show(Math.floor((px - g[0]) / (g[1] / n)));
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focus', function () { show(at < 0 ? n - 1 : at); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        show((at < 0 ? n - 1 : at) + (e.key === 'ArrowLeft' ? -1 : 1));
      } else if (e.key === 'Escape') {
        hide();
      }
    });
  });

  /* ------------------------------------------------------------ language */

  // EN | ID is a plain link to the same page in the other language. The
  // choice is kept for the whole site in the zk_lang cookie, which Zeiko
  // Drive reads too: it is on a subdomain of this site, so on zeiko.biz.id
  // the cookie is the whole domain's (anywhere else, a preview, it stays on
  // the page's own host). An Indonesian page sets it once if nothing is kept
  // yet.
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
  if (document.documentElement.lang === 'id' && !/(?:^|; )zk_lang=/.test(document.cookie)) keepLang('id');

  /* -------------------------------------------------------- footer year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------ desktop */
  /* The homepage is a desktop. Each window marked data-win gets its
     caption buttons and a button on the taskbar; the one in view is the
     active one. Without this file every window simply stays open. */

  if (!document.body.classList.contains('desk')) return;

  var DESK_ID = {
    minimize: function (n) { return 'Perkecil ' + n; },
    maximize: function (n) { return 'Perbesar ' + n; },
    restore: function (n) { return 'Kembalikan ukuran ' + n; },
    close: function (n) { return 'Tutup ' + n; }
  };
  var DESK_EN = {
    minimize: function (n) { return 'Minimize ' + n; },
    maximize: function (n) { return 'Maximize ' + n; },
    restore: function (n) { return 'Restore ' + n; },
    close: function (n) { return 'Close ' + n; }
  };
  var dw = root.lang === 'id' ? DESK_ID : DESK_EN;
  var tasks = document.getElementById('tasks');
  // A window still hidden (Zeiko S3 before it opens) gets no caption buttons or taskbar button.
  var wins = [].slice.call(document.querySelectorAll('.win[data-win]')).filter(function (w) { return !w.hidden; });

  function capButton(cls, label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cap ' + cls;
    b.setAttribute('aria-label', label);
    return b;
  }

  wins.forEach(function (win) {
    var name = win.getAttribute('data-win');
    var bar = win.querySelector('.win-title');
    var icon = bar && bar.querySelector('img');
    var caps = document.createElement('span');
    caps.className = 'caps';
    var min = capButton('cap-min', dw.minimize(name));
    var max = capButton('cap-max', dw.maximize(name));
    var close = capButton('cap-close', dw.close(name));
    caps.appendChild(min); caps.appendChild(max); caps.appendChild(close);
    bar.appendChild(caps);

    var task = null;
    if (tasks) {
      task = document.createElement('a');
      task.className = 'task';
      task.href = '#' + win.id;
      if (icon) {
        var img = document.createElement('img');
        img.src = icon.getAttribute('src');
        img.alt = '';
        img.width = 16; img.height = 16;
        task.appendChild(img);
      }
      var label = document.createElement('span');
      label.textContent = name;
      task.appendChild(label);
      tasks.appendChild(task);
    }
    win._task = task;

    min.addEventListener('click', function () { setMax(win, false); win.hidden = true; });
    close.addEventListener('click', function () { setMax(win, false); win.hidden = true; if (task) task.hidden = true; });
    max.addEventListener('click', function () { setMax(win, !win.classList.contains('is-max')); });

    function setMax(w, on) {
      w.classList.toggle('is-max', on);
      max.classList.toggle('cap-restore', on);
      max.setAttribute('aria-label', on ? dw.restore(name) : dw.maximize(name));
      document.body.classList.toggle('has-max', Boolean(document.querySelector('.win.is-max')));
    }
  });

  // A link to a window that was minimised or closed opens it again.
  function reopen(id) {
    var win = id && document.getElementById(id);
    if (!win || !win.classList.contains('win')) return;
    win.hidden = false;
    if (win._task) win._task.hidden = false;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) reopen(a.getAttribute('href').slice(1));
  });
  window.addEventListener('hashchange', function () { reopen(location.hash.slice(1)); });

  // The window in view is the active one: navy title, pressed task button.
  if ('IntersectionObserver' in window) {
    var seen = new Map();
    var activate = function () {
      var best = null, most = 0;
      seen.forEach(function (ratio, w) { if (ratio > most) { most = ratio; best = w; } });
      wins.forEach(function (w) {
        var on = w === best;
        w.classList.toggle('is-off', !on && Boolean(best));
        if (w._task) w._task.classList.toggle('is-on', on);
      });
    };
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen.set(en.target, en.intersectionRatio); });
      activate();
    }, { threshold: [0, .15, .3, .5, .7, .9] });
    wins.forEach(function (w) { watch.observe(w); });
  }

  // The Start menu closes on a choice, on Escape and on a click elsewhere.
  var start = document.getElementById('start');
  if (start) {
    start.addEventListener('click', function (e) {
      if (e.target.closest('a')) start.open = false;
    });
    document.addEventListener('click', function (e) {
      if (start.open && !start.contains(e.target)) start.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && start.open) {
        start.open = false;
        start.querySelector('summary').focus();
      }
    });
  }

  // The clock in the tray, in the page's language.
  var clock = document.getElementById('clock');
  if (clock) {
    var tick = function () {
      clock.textContent = new Date().toLocaleTimeString(words().locale, { hour: 'numeric', minute: '2-digit' });
    };
    clock.hidden = false;
    tick();
    setInterval(tick, 20000);
  }
})();
