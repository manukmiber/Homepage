/* ZeikoAI site — only what the pages need: theme, menu, copy, cost estimator,
 * chart hover.
 * Every page still reads fine if this file never loads. */

(function () {
  'use strict';

  var root = document.documentElement;

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
        navigator.clipboard.writeText(text).then(done, function () { copyViaTextarea(text, done); });
      } else {
        copyViaTextarea(text, done);
      }
    });
  });

  function copyViaTextarea(text, done) {
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
      if (allLabel) allLabel.textContent = 'For ' + n.toLocaleString('en-US') + ' requests';
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

  /* -------------------------------------------------------- footer year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
