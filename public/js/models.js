/* ZeikoAI /models — every model at a glance, and each one in full.
 *
 * The data is one JSON document, /data/models.json, published once an hour
 * (see src/worker.js). It carries, per model: its public listing (name,
 * window, prices, thinking controls), the words written for this page, and
 * figures measured on real traffic — over 24 hours, 7 days and 30 days, each
 * beside the period before it, plus hourly and daily series to chart.
 *
 * Every string from that document reaches the page through textContent,
 * never innerHTML: it is data, and data does not get to be markup.
 *
 * No framework and no chart library — the page is two static files and this
 * one. The charts are hand-drawn SVG.
 */
(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  var SVG = 'http://www.w3.org/2000/svg';
  var HOUR = 3600000;
  var DAY = 24 * HOUR;
  var WINDOWS = [
    { id: '24h', label: '24 hours', prev: 'the 24 hours before' },
    { id: '7d', label: '7 days', prev: 'the 7 days before' },
    { id: '30d', label: '30 days', prev: 'the 30 days before' }
  ];

  /* ------------------------------------------------------------ helpers */

  function h(tag, props) {
    var parts = tag.split('.');
    var el = document.createElement(parts[0]);
    if (parts.length > 1) el.className = parts.slice(1).join(' ');
    var p = props || {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v == null || v === false) return;
      if (k === 'text') el.textContent = v;
      else if (k === 'class') el.className = (el.className + ' ' + v).trim();
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(el, k); }); return; }
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }

  function s(tag, attrs) {
    var el = document.createElementNS(SVG, tag);
    var a = attrs || {};
    Object.keys(a).forEach(function (k) { if (a[k] != null) el.setAttribute(k, a[k]); });
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.append(arguments[i]);
    return el;
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  function copyText(text, btn) {
    var done = function () {
      var before = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = before; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  }

  /* --------------------------------------------------------- formatting */

  function num(n) {
    if (n == null || !isFinite(n)) return '—';
    var a = Math.abs(n);
    if (a >= 1e9) return trim(n / 1e9, 2) + 'B';
    if (a >= 1e6) return trim(n / 1e6, 2) + 'M';
    if (a >= 1e4) return trim(n / 1e3, 1) + 'K';
    return Math.round(n).toLocaleString('en-US');
  }

  function trim(n, digits) {
    return String(Number(n.toFixed(digits)));
  }

  /** A token count as a window size: 256000 → 256K, 8192 → 8K, 1048576 → 1M. */
  function tokens(n) {
    if (!n) return '—';
    if (n >= 1e6) return (n % 1048576 === 0 ? n / 1048576 : trim(n / 1e6, 1)) + 'M';
    // Decimal first: 128000 is "128K", even though it is also 125 × 1024.
    if (n % 1000 === 0) return n / 1000 + 'K';
    if (n >= 1024 && n % 1024 === 0) return n / 1024 + 'K';
    if (n >= 1000) return Math.round(n / 1000) + 'K';
    return String(n);
  }

  function ms(v) {
    if (v == null || !isFinite(v)) return '—';
    if (v < 1000) return Math.round(v) + ' ms';
    return trim(v / 1000, v < 10000 ? 2 : 1) + ' s';
  }

  function tps(v) { return v == null || !isFinite(v) ? '—' : trim(v, 1) + ' tok/s'; }

  function pct(v, digits) {
    if (v == null || !isFinite(v)) return '—';
    return trim(v * 100, digits == null ? 1 : digits) + '%';
  }

  /** A published per-token price as dollars per million tokens. */
  function perM(str) {
    if (!str) return null;
    var n = parseFloat(str) * 1e6;
    return isFinite(n) ? Math.round(n * 1e4) / 1e4 : null;
  }

  function usd(n) {
    if (n == null) return '—';
    var t = n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    var dec = (t.split('.')[1] || '').length;
    return '$' + (dec < 2 ? n.toFixed(2) : t);
  }

  function longDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''));
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  }

  function stamp(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /* ------------------------------------------------------- model facts */

  function name(m) { return m.display_name || m.name || m.id; }

  function price(m) {
    var p = m.pricing || {};
    return { input: perM(p.prompt), output: perM(p.completion), cache: perM(p.input_cache_read) };
  }

  function thinking(m) {
    var r = m.reasoning || {};
    if (r.mandatory) return 'Always on';
    if (r.default_enabled) return 'On by default';
    return 'Off unless asked';
  }

  var MODALITY = { text: 'text', image: 'images', audio: 'audio', video: 'video', file: 'files' };

  function modalities(m) {
    var a = m.architecture || {};
    var list = function (xs) {
      var words = (xs && xs.length ? xs : ['text']).map(function (x) { return MODALITY[x] || x; });
      return words.length > 1 ? words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1] : words[0];
    };
    var input = list(a.input_modalities);
    return input.charAt(0).toUpperCase() + input.slice(1) + ' → ' + list(a.output_modalities);
  }

  var STATUS = {
    latest: ['Latest', 'ok'],
    active: ['Active', 'info'],
    preview: ['Preview', 'info'],
    legacy: ['Legacy', 'warn'],
    deprecated: ['Deprecated', 'err']
  };

  function statusPill(m) {
    var st = STATUS[(m.page || {}).status] || STATUS.active;
    return h('span.badge.badge-' + st[1], { text: st[0] });
  }

  function badge(m) {
    var p = m.page || {};
    if (!p.badge) return null;
    return h('span.badge.badge-' + (p.badge_tone || 'plain'), { text: p.badge });
  }

  function stats(m, win, which) {
    var w = (m.stats || {})[win] || {};
    return w[which || 'current'] || {};
  }

  /* ------------------------------------------------------------- series */

  /** The columns of a published series, as one object per bucket. */
  function rows(col) {
    if (!col || !col.requests) return [];
    return col.requests.map(function (_, i) {
      return {
        t: col.start + i * col.step_ms,
        step: col.step_ms,
        requests: col.requests[i],
        errors: col.errors[i],
        input: col.input_tokens[i],
        output: col.output_tokens[i],
        cached: col.cached_tokens[i],
        fresh: Math.max(0, col.input_tokens[i] - col.cached_tokens[i]),
        ttft: col.ttft_ms[i],
        latency: col.latency_ms[i],
        tps: col.tps[i]
      };
    });
  }

  function seriesFor(m, win) {
    if (win === '30d') return rows(m.daily);
    var hourly = rows(m.hourly);
    return win === '24h' ? hourly.slice(-24) : hourly;
  }

  /** Counts summed into wider buckets, so 168 hourly columns become 28. */
  function widen(points, n) {
    var out = [];
    for (var i = 0; i < points.length; i += n) {
      var group = points.slice(i, i + n);
      var b = { t: group[0].t, step: group[0].step * group.length };
      ['requests', 'errors', 'input', 'output', 'cached', 'fresh'].forEach(function (k) {
        b[k] = group.reduce(function (a, p) { return a + (p[k] || 0); }, 0);
      });
      out.push(b);
    }
    return out;
  }

  /* -------------------------------------------------------------- charts */

  /** Round a maximum up to a clean axis top, and the ticks under it. */
  function ticks(max) {
    if (!(max > 0)) return { top: 1, step: 0.25 };
    var raw = max / 4;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (f) { return f * mag; }).filter(function (v) { return v >= raw; })[0];
    return { top: Math.ceil(max / step) * step, step: step };
  }

  function timeLabel(t, span) {
    var d = new Date(t);
    if (span <= 2 * DAY) return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (span <= 8 * DAY) return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function bucketLabel(p) {
    var d = new Date(p.t);
    if (p.step >= DAY) return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    var end = new Date(p.t + p.step);
    var o = { hour: '2-digit', minute: '2-digit' };
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' +
      d.toLocaleTimeString(undefined, o) + '–' + end.toLocaleTimeString(undefined, o);
  }

  var charts = [];
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { charts.forEach(function (draw) { draw(); }); }, 150);
  });

  /**
   * A chart card: title, optional legend, and a plot that redraws at the
   * width it is given. `spec.kind` is 'line' or 'columns'.
   */
  function chartCard(spec) {
    var plot = h('div.chart-plot');
    var tip = h('div.chart-tip', { role: 'status' });
    tip.hidden = true;
    var legend = spec.stacks && spec.stacks.length > 1
      ? h('ul.chart-legend', {}, spec.stacks.map(function (st) {
        return h('li', {}, h('span.chart-key', { style: '--key:' + st.color }), st.label);
      }))
      : null;
    var card = h('figure.chart-card', {},
      h('figcaption', {}, h('span.chart-title', { text: spec.title }), spec.sub ? h('span.chart-sub', { text: spec.sub }) : null),
      legend,
      h('div.chart-wrap', {}, plot, tip));
    var draw = function () {
      clear(plot);
      if (!card.isConnected) return;
      (spec.kind === 'line' ? drawLine : drawColumns)(plot, tip, spec);
    };
    charts.push(draw);
    requestAnimationFrame(draw);
    return card;
  }

  function frame(plot, height) {
    var width = Math.max(260, Math.floor(plot.clientWidth || plot.parentNode.clientWidth || 520));
    return { w: width, h: height || 190, l: 46, r: 10, t: 10, b: 24 };
  }

  function axes(svg, f, y, top, step, fmt, x0, x1, xs) {
    for (var v = 0; v <= top + step / 2; v += step) {
      var yy = y(v);
      svg.append(s('line', { x1: f.l, x2: f.w - f.r, y1: yy, y2: yy, class: v === 0 ? 'axis-base' : 'axis-grid' }));
      svg.append(s('text', { x: f.l - 8, y: yy + 4, 'text-anchor': 'end', class: 'axis-text' }, document.createTextNode(fmt(v))));
    }
    xs.forEach(function (tick) {
      svg.append(s('text', { x: tick.x, y: f.h - 6, 'text-anchor': 'middle', class: 'axis-text' }, document.createTextNode(tick.label)));
    });
  }

  function xTicks(points, x, n) {
    if (!points.length) return [];
    var span = points[points.length - 1].t + points[0].step - points[0].t;
    var every = Math.max(1, Math.round(points.length / n));
    var out = [];
    for (var i = Math.floor(every / 2); i < points.length; i += every) {
      out.push({ x: x(i), label: timeLabel(points[i].t, span) });
    }
    return out;
  }

  function showTip(tip, plot, px, title, lines) {
    clear(tip);
    tip.append(h('div.chart-tip-title', { text: title }));
    lines.forEach(function (l) {
      tip.append(h('div.chart-tip-row', {},
        l.color ? h('span.chart-tip-key', { style: '--key:' + l.color }) : null,
        h('strong', { text: l.value }),
        h('span', { text: l.label })));
    });
    tip.hidden = false;
    var w = tip.offsetWidth;
    var left = Math.min(Math.max(px - w / 2, 0), plot.clientWidth - w);
    tip.style.left = left + 'px';
  }

  function drawLine(plot, tip, spec) {
    var f = frame(plot, spec.height);
    var pts = spec.points;
    var vals = pts.map(function (p) { return p[spec.key]; });
    var real = vals.filter(function (v) { return v != null; });
    if (!real.length) { plot.append(h('p.chart-empty', { text: 'No traffic in this window yet.' })); return; }
    var t = ticks(Math.max.apply(null, real));
    var n = pts.length;
    var x = function (i) { return f.l + (n === 1 ? (f.w - f.l - f.r) / 2 : i * (f.w - f.l - f.r) / (n - 1)); };
    var y = function (v) { return f.t + (1 - v / t.top) * (f.h - f.t - f.b); };

    var svg = s('svg', { width: f.w, height: f.h, viewBox: '0 0 ' + f.w + ' ' + f.h, role: 'img', 'aria-label': spec.title, tabindex: 0, class: 'chart-svg' });
    axes(svg, f, y, t.top, t.step, spec.axis || spec.fmt, 0, n - 1, xTicks(pts, x, 5));

    // Break the line wherever a bucket had nothing to measure: a gap is the
    // truth, and a line drawn through it is not.
    var line = '';
    var area = '';
    var run = [];
    var flush = function () {
      if (!run.length) return;
      line += 'M' + run.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L');
      area += 'M' + run[0][0].toFixed(1) + ',' + y(0) + 'L' + run.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L') +
        'L' + run[run.length - 1][0].toFixed(1) + ',' + y(0) + 'Z';
      run = [];
    };
    vals.forEach(function (v, i) { if (v == null) flush(); else run.push([x(i), y(v)]); });
    flush();
    svg.append(s('path', { d: area, class: 'series-area', style: '--c:' + spec.color }));
    svg.append(s('path', { d: line, class: 'series-line', style: '--c:' + spec.color }));

    var last = -1;
    for (var k = n - 1; k >= 0; k--) if (vals[k] != null) { last = k; break; }
    if (last >= 0) svg.append(s('circle', { cx: x(last), cy: y(vals[last]), r: 4, class: 'series-dot', style: '--c:' + spec.color }));

    var cross = s('line', { y1: f.t, y2: f.h - f.b, class: 'crosshair', visibility: 'hidden' });
    var dot = s('circle', { r: 4, class: 'series-dot', style: '--c:' + spec.color, visibility: 'hidden' });
    svg.append(cross, dot);
    var hit = s('rect', { x: f.l, y: 0, width: f.w - f.l - f.r, height: f.h, fill: 'transparent' });
    svg.append(hit);

    var at = last;
    var show = function (i) {
      at = Math.max(0, Math.min(n - 1, i));
      var v = vals[at];
      cross.setAttribute('x1', x(at)); cross.setAttribute('x2', x(at));
      cross.setAttribute('visibility', 'visible');
      if (v != null) { dot.setAttribute('cx', x(at)); dot.setAttribute('cy', y(v)); dot.setAttribute('visibility', 'visible'); }
      else dot.setAttribute('visibility', 'hidden');
      showTip(tip, plot, x(at), bucketLabel(pts[at]), [{ color: spec.color, value: v == null ? 'no traffic' : spec.fmt(v), label: spec.unit || '' }]);
    };
    var hide = function () { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tip.hidden = true; };
    svg.addEventListener('pointermove', function (e) {
      var box = svg.getBoundingClientRect();
      var px = (e.clientX - box.left) * (f.w / box.width);
      show(Math.round((px - f.l) / ((f.w - f.l - f.r) / Math.max(1, n - 1))));
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focus', function () { show(at < 0 ? n - 1 : at); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); }
    });
    plot.append(svg);
  }

  /** A column with its top corners rounded and its foot square. */
  function column(x, y, w, hgt, r) {
    r = Math.min(r, w / 2, hgt);
    return 'M' + x + ',' + (y + hgt) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
      'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + hgt) + 'Z';
  }

  function drawColumns(plot, tip, spec) {
    var f = frame(plot, spec.height);
    var pts = spec.points;
    var stacks = spec.stacks;
    var totals = pts.map(function (p) { return stacks.reduce(function (a, st) { return a + (p[st.key] || 0); }, 0); });
    var max = Math.max.apply(null, totals.concat([0]));
    if (!(max > 0)) { plot.append(h('p.chart-empty', { text: 'No traffic in this window yet.' })); return; }
    var t = ticks(max);
    var n = pts.length;
    var slot = (f.w - f.l - f.r) / n;
    var bw = Math.max(2, Math.min(24, slot - 2));
    var x = function (i) { return f.l + i * slot + slot / 2; };
    var y = function (v) { return f.t + (1 - v / t.top) * (f.h - f.t - f.b); };

    var svg = s('svg', { width: f.w, height: f.h, viewBox: '0 0 ' + f.w + ' ' + f.h, role: 'img', 'aria-label': spec.title, tabindex: 0, class: 'chart-svg' });
    axes(svg, f, y, t.top, t.step, spec.axis || spec.fmt, 0, n - 1, xTicks(pts, x, 5));

    var bars = [];
    pts.forEach(function (p, i) {
      var g = s('g', { class: 'bar' });
      var base = 0;
      var drawn = stacks.filter(function (st) { return (p[st.key] || 0) > 0; });
      drawn.forEach(function (st, j) {
        var v = p[st.key];
        var y0 = y(base);
        var y1 = y(base + v);
        base += v;
        var top = j === drawn.length - 1;
        // The 2px surface gap between stacked segments.
        var hgt = Math.max(0, y0 - y1 - (top ? 0 : 2));
        if (hgt <= 0) return;
        var x0 = x(i) - bw / 2;
        g.append(s('path', {
          d: top ? column(x0, y1, bw, hgt, 4) : 'M' + x0 + ',' + (y1 + 2) + 'h' + bw + 'v' + hgt + 'h' + (-bw) + 'Z',
          class: 'series-fill', style: '--c:' + st.color
        }));
      });
      // A hit area as wide as the slot, not the painted pixels.
      g.append(s('rect', { x: f.l + i * slot, y: f.t, width: slot, height: f.h - f.t - f.b, fill: 'transparent' }));
      svg.append(g);
      bars.push(g);
    });

    var at = n - 1;
    var show = function (i) {
      at = Math.max(0, Math.min(n - 1, i));
      bars.forEach(function (b, k) { b.classList.toggle('is-on', k === at); });
      var p = pts[at];
      var lines = stacks.map(function (st) { return { color: st.color, value: spec.fmt(p[st.key] || 0), label: st.label }; });
      if (stacks.length > 1) lines.push({ value: spec.fmt(totals[at]), label: 'total' });
      showTip(tip, plot, x(at), bucketLabel(p), lines);
    };
    var hide = function () { bars.forEach(function (b) { b.classList.remove('is-on'); }); tip.hidden = true; };
    svg.addEventListener('pointermove', function (e) {
      var box = svg.getBoundingClientRect();
      var px = (e.clientX - box.left) * (f.w / box.width);
      show(Math.floor((px - f.l) / slot));
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focus', function () { show(at); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); }
    });
    plot.append(svg);
  }

  /** The sparkline on a model card: requests over the last week, no axes. */
  function sparkline(points) {
    var vals = points.map(function (p) { return p.requests; });
    var max = Math.max.apply(null, vals.concat([1]));
    var w = 120;
    var ht = 28;
    var step = vals.length > 1 ? w / (vals.length - 1) : w;
    var d = vals.map(function (v, i) { return (i ? 'L' : 'M') + (i * step).toFixed(1) + ',' + (ht - 2 - (v / max) * (ht - 4)).toFixed(1); }).join('');
    return s('svg', { width: w, height: ht, viewBox: '0 0 ' + w + ' ' + ht, class: 'spark', 'aria-hidden': 'true' },
      s('path', { d: d, class: 'spark-line' }));
  }

  /* ------------------------------------------------------------ pieces */

  function copyRow(id) {
    var btn = h('button.copy-chip', { type: 'button', 'aria-label': 'Copy the model id' }, 'Copy');
    btn.addEventListener('click', function () { copyText(id, btn); });
    return h('span.id-row', {}, h('code', { text: id }), btn);
  }

  /** How one figure moved against the period before, and whether that is good. */
  function delta(cur, prev, betterWhenUp, label) {
    if (cur == null || prev == null || !isFinite(cur) || !isFinite(prev) || prev === 0) return null;
    var change = (cur - prev) / prev;
    if (Math.abs(change) < 0.005) return h('span.delta.delta-flat', { text: '±0% vs ' + label });
    var up = change > 0;
    var tone = betterWhenUp == null ? 'flat' : (up === betterWhenUp ? 'good' : 'bad');
    return h('span.delta.delta-' + tone, { text: (up ? '▲ +' : '▼ ') + trim(change * 100, Math.abs(change) < 0.1 ? 1 : 0) + '% vs ' + label });
  }

  function tile(label, value, sub, d) {
    return h('div.tile', {},
      h('div.tile-label', { text: label }),
      h('div.tile-value', { text: value }),
      sub ? h('div.tile-sub', { text: sub }) : null,
      d);
  }

  function section(id, title, lede) {
    var el = h('section.mp-section', { id: id },
      h('h2', { text: title }),
      lede ? h('p.sec-lede', { text: lede }) : null);
    return el;
  }

  function specTable(caption, rowsIn) {
    return h('div.spec', {},
      h('h3', { text: caption }),
      h('div.table-scroll', {},
        h('table.table.spec-table', {},
          h('tbody', {}, rowsIn.filter(Boolean).map(function (r) {
            return h('tr', {}, h('th', { scope: 'row', text: r[0] }), h('td', {}, r[1]));
          })))));
  }

  function paragraphs(text) {
    return String(text || '').split(/\n\s*\n/).map(function (p) { return p.trim(); })
      .filter(Boolean).map(function (p) { return h('p', { text: p }); });
  }

  /* --------------------------------------------------- how it is measured */

  function method() {
    var steps = [
      ['Every request', 'Timed as it is served: time to the first token, time to the last, tokens in and out, and how many came from the cache.'],
      ['Numbers only', 'Only the timings and counts are kept for this page — never a prompt, an answer, or who sent it.'],
      ['Every hour', 'Averages, medians and 95th percentiles per model, over 24 hours, 7 days and 30 days, each beside the period before it.'],
      ['Published', 'One snapshot is published to storage at the edge. This page reads that snapshot, never the service answering your requests.'],
      ['This page', 'Each model gets its figures, its trend against the period before, and a week of hours and a month of days to chart.']
    ];
    var flow = h('ol.flow', { 'aria-label': 'How the figures on this page are produced' },
      steps.map(function (st, i) {
        return h('li.flow-step', {},
          h('div.flow-head', {},
            h('span.flow-n', { text: String(i + 1) }),
            // The one edge the diagram is about: from recorded to computed.
            i === 2 ? h('span.flow-edge', { text: '⟳ every hour' }) : null),
          h('h3', { text: st[0] }),
          h('p', { text: st[1] }));
      }));
    var el = section('how-we-measure', 'How these numbers are made',
      'Nothing on this page is a claim typed in by hand. The figures come from real traffic, recomputed once an hour.');
    el.append(flow, h('dl.defs', {},
      h('dt', { text: 'Time to first token' }), h('dd', { text: 'From the moment your request starts being served to the first token of the answer. Queueing before that is not included.' }),
      h('dt', { text: 'Latency' }), h('dd', { text: 'From the same moment to the last token: the whole answer.' }),
      h('dt', { text: 'Output speed' }), h('dd', { text: 'Output tokens divided by the time spent generating them.' }),
      h('dt', { text: 'Cache rate' }), h('dd', { text: 'Of all input tokens, the share read back from the prompt cache — billed at the cache-read rate.' }),
      h('dt', { text: 'Availability' }), h('dd', { text: 'The share of requests that did not end in a server error. A request turned away because it was over a limit is not counted against it.' })));
    return el;
  }

  /* ---------------------------------------------------------- the index */

  function compareTable(doc, current) {
    var head = ['Model', 'Context', 'Max output', 'Price / MTok', 'Thinking', 'Default effort', 'Median TTFT', 'Output speed', 'Availability'];
    return h('div.table-scroll', {},
      h('table.table.compare', {},
        h('thead', {}, h('tr', {}, head.map(function (c) { return h('th', { scope: 'col', text: c }); }))),
        h('tbody', {}, doc.models.map(function (m) {
          var p = price(m);
          var st = stats(m, '7d');
          var here = m.id === current;
          return h('tr' + (here ? '.is-here' : ''), {},
            h('th', { scope: 'row' },
              here ? h('strong', { text: name(m) }) : h('a', { href: '/models/' + encodeURIComponent(m.id), text: name(m) }),
              here ? h('span.muted', { text: ' (this model)' }) : null),
            h('td', { text: tokens(m.context_length) }),
            h('td', { text: tokens(m.max_completion_tokens) }),
            h('td', { text: usd(p.input) + ' / ' + usd(p.output) }),
            h('td', { text: thinking(m) }),
            h('td', {}, h('code', { text: (m.reasoning || {}).default_effort || '—' })),
            h('td', { text: ms((st.ttft_ms || {}).p50) }),
            h('td', { text: tps((st.tps || {}).p50) }),
            h('td', { text: pct(st.availability, 2) }));
        }))));
  }

  function compareNotes() {
    return h('ul.fine', {},
      h('li', { text: 'Price / MTok: input / output, US dollars per million tokens, standard thinking band. Cache reads, the no-thinking and max-thinking bands are on each model’s page.' }),
      h('li', { text: 'Median TTFT, output speed and availability are measured over the last 7 days of real traffic.' }),
      h('li', { text: 'Thinking: whether a request that says nothing about reasoning gets it. Every model takes reasoning_effort, and the effort picks the price band.' }));
  }

  function renderIndex(doc) {
    document.title = 'Models — ZeikoAI';
    clear(app);

    app.append(h('section.mp-hero', {},
      h('p.eyebrow', { text: 'Models' }),
      h('h1', {}, 'Every model, ', h('em', { text: 'measured' }), '.'),
      h('p.lede', { text: 'What each model is for, what it costs, and how fast it has actually been answering — first token, full reply and tokens per second, from real traffic.' }),
      h('p.asof', {}, h('span.live-dot', { 'aria-hidden': 'true' }),
        'Figures as of ' + stamp(doc.as_of) + ', refreshed every hour.')));

    var grid = h('div.grid.model-grid');
    doc.models.forEach(function (m) {
      var p = price(m);
      var st = stats(m, '7d');
      var week = widen(rows(m.hourly), 6);
      grid.append(h('a.card.model-card', { href: '/models/' + encodeURIComponent(m.id) },
        h('div.model-card-top', {}, badge(m), statusPill(m)),
        h('h2', { text: name(m) }),
        h('p.model-id', {}, h('code', { text: m.id })),
        h('p.tagline', { text: (m.page || {}).tagline || m.description || '' }),
        h('dl.facts', {},
          h('div', {}, h('dt', { text: 'Context' }), h('dd', { text: tokens(m.context_length) })),
          h('div', {}, h('dt', { text: 'Max output' }), h('dd', { text: tokens(m.max_completion_tokens) })),
          h('div', {}, h('dt', { text: 'Input' }), h('dd', { text: usd(p.input) })),
          h('div', {}, h('dt', { text: 'Output' }), h('dd', { text: usd(p.output) }))),
        h('div.card-live', {},
          h('div.card-live-figs', {},
            h('span', {}, h('strong', { text: ms((st.ttft_ms || {}).p50) }), ' first token'),
            h('span', {}, h('strong', { text: tps((st.tps || {}).p50) })),
            h('span', {}, h('strong', { text: pct(st.availability, 2) }), ' up')),
          h('div.card-spark', {}, sparkline(week), h('span', { text: 'requests, 7 days' }))),
        h('span.card-more', { text: 'Specs, pricing and live charts →' })));
    });
    app.append(grid);

    var cmp = section('compare', 'How they compare');
    cmp.append(compareTable(doc, null), compareNotes());
    app.append(cmp);
    app.append(method());
  }

  /* --------------------------------------------------------- one model */

  function performance(m, win) {
    var box = h('div.perf');
    var draw = function (w) {
      charts = [];
      clear(box);
      var win2 = WINDOWS.filter(function (x) { return x.id === w; })[0];
      var cur = stats(m, w);
      var prev = stats(m, w, 'previous');
      var g = function (o, k) { return (o[k] || {}).p50; };

      box.append(h('div.filters', { role: 'group', 'aria-label': 'Time window' },
        WINDOWS.map(function (x) {
          return h('button.tab' + (x.id === w ? '.is-on' : ''), {
            type: 'button', 'aria-pressed': x.id === w ? 'true' : 'false', text: 'Last ' + x.label,
            onclick: function () { draw(x.id); }
          });
        })));

      box.append(h('div.tiles', {},
        tile('Time to first token', ms(g(cur, 'ttft_ms')), 'median · p95 ' + ms((cur.ttft_ms || {}).p95),
          delta(g(cur, 'ttft_ms'), g(prev, 'ttft_ms'), false, win2.prev)),
        tile('Output speed', tps(g(cur, 'tps')), 'median · avg ' + tps((cur.tps || {}).avg),
          delta(g(cur, 'tps'), g(prev, 'tps'), true, win2.prev)),
        tile('Latency', ms(g(cur, 'latency_ms')), 'median full reply · p95 ' + ms((cur.latency_ms || {}).p95),
          delta(g(cur, 'latency_ms'), g(prev, 'latency_ms'), false, win2.prev)),
        tile('Availability', pct(cur.availability, 2), num(cur.errors || 0) + ' server errors',
          delta(cur.availability, prev.availability, true, win2.prev)),
        tile('Requests', num(cur.requests), num(cur.served) + ' answered',
          delta(cur.requests, prev.requests, null, win2.prev)),
        tile('Input tokens', num(cur.input_tokens), cur.avg_input_tokens != null ? num(cur.avg_input_tokens) + ' per request' : '',
          delta(cur.input_tokens, prev.input_tokens, null, win2.prev)),
        tile('Output tokens', num(cur.output_tokens), cur.avg_output_tokens != null ? num(cur.avg_output_tokens) + ' per request' : '',
          delta(cur.output_tokens, prev.output_tokens, null, win2.prev)),
        tile('Cache rate', pct(cur.cache_rate), num(cur.cached_tokens) + ' tokens from cache',
          delta(cur.cache_rate, prev.cache_rate, true, win2.prev))));

      var pts = seriesFor(m, w);
      var cols = w === '7d' ? widen(pts, 6) : pts;
      var unit = w === '30d' ? 'per day' : w === '7d' ? 'per 6 hours' : 'per hour';
      var avgUnit = w === '30d' ? 'daily average' : 'hourly average';
      var blue = 'var(--series-1)';
      var orange = 'var(--series-2)';

      box.append(h('div.chart-grid', {},
        chartCard({ kind: 'columns', title: 'Requests', sub: unit, points: cols, fmt: num, stacks: [{ key: 'requests', label: 'requests', color: blue }] }),
        chartCard({ kind: 'line', title: 'Time to first token', sub: avgUnit, points: pts, key: 'ttft', fmt: ms, color: blue }),
        chartCard({ kind: 'line', title: 'Output speed', sub: avgUnit + ', tokens per second', points: pts, key: 'tps', fmt: tps, axis: function (v) { return trim(v, 1); }, color: blue }),
        chartCard({ kind: 'line', title: 'Latency', sub: avgUnit + ', full reply', points: pts, key: 'latency', fmt: ms, color: blue }),
        chartCard({ kind: 'columns', title: 'Input tokens', sub: unit, points: cols, fmt: num,
          stacks: [{ key: 'fresh', label: 'fresh input', color: blue }, { key: 'cached', label: 'read from cache', color: orange }] }),
        chartCard({ kind: 'columns', title: 'Output tokens', sub: unit, points: cols, fmt: num, stacks: [{ key: 'output', label: 'output tokens', color: blue }] })));

      box.append(dataTable(pts, w));
    };
    draw(win);
    return box;
  }

  function dataTable(pts, w) {
    var head = ['Period', 'Requests', 'Errors', 'TTFT', 'Latency', 'Speed', 'Input', 'From cache', 'Output'];
    return h('details.data-view', {},
      h('summary', { text: 'Show these figures as a table' }),
      h('div.table-scroll', {},
        h('table.table.data-table', {},
          h('thead', {}, h('tr', {}, head.map(function (c) { return h('th', { scope: 'col', text: c }); }))),
          h('tbody', {}, pts.slice().reverse().map(function (p) {
            return h('tr', {},
              h('th', { scope: 'row', text: bucketLabel(p) }),
              h('td', { text: num(p.requests) }),
              h('td', { text: num(p.errors) }),
              h('td', { text: ms(p.ttft) }),
              h('td', { text: ms(p.latency) }),
              h('td', { text: tps(p.tps) }),
              h('td', { text: num(p.input) }),
              h('td', { text: num(p.cached) }),
              h('td', { text: num(p.output) }));
          })))),
      h('p.fine', { text: w === '30d' ? 'One row per UTC day.' : 'One row per hour.' }));
  }

  function bandsTable(m) {
    var bands = (m.pricing || {}).bands;
    if (!bands) return null;
    var order = ['non_thinking', 'default', 'max'];
    var def = (m.pricing || {}).default_band;
    return h('div.spec', {},
      h('h3', { text: 'Thinking bands' }),
      h('p.fine', { text: 'The band is picked by the reasoning_effort on your request. Reasoning tokens are billed as output tokens at the band’s output rate.' }),
      h('div.table-scroll', {},
        h('table.table.bands', {},
          h('thead', {}, h('tr', {}, ['Band', 'reasoning_effort', 'Input', 'Cache read', 'Output'].map(function (c) { return h('th', { scope: 'col', text: c }); }))),
          h('tbody', {}, order.filter(function (k) { return bands[k]; }).map(function (k) {
            var b = bands[k];
            return h('tr', {},
              h('th', { scope: 'row' }, b.name || k, k === def ? h('span.muted', { text: ' (default)' }) : null),
              h('td', {}, (b.efforts || []).map(function (e, i) { return [i ? ' ' : null, h('code', { text: e })]; })),
              h('td', { text: usd(perM(b.prompt)) }),
              h('td', { text: usd(perM(b.input_cache_read)) }),
              h('td', { text: usd(perM(b.completion)) }));
          })))));
  }

  var DAYS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

  function hhmm(v) { var t = String(v).padStart(4, '0'); return t.slice(0, 2) + ':' + t.slice(2); }

  /** The hours the price moves in, leaving out any window that only restates it. */
  function windowsList(m) {
    var p = m.pricing || {};
    var moved = (p.overrides || []).filter(function (o) {
      return o.prompt !== p.prompt || o.completion !== p.completion || o.input_cache_read !== p.input_cache_read;
    });
    if (!moved.length) return null;
    return h('div.spec', {},
      h('h3', { text: 'Price by hour (UTC)' }),
      h('ul.windows', {}, moved.map(function (o) {
        var days = (o.utc_days || []).map(function (d) { return DAYS[d] || d; }).join(', ') || 'Every day';
        var hours = o.utc_start != null && o.utc_end != null ? hhmm(o.utc_start) + '–' + hhmm(o.utc_end) + ' UTC' : 'all day';
        return h('li', {},
          h('strong', { text: days + ', ' + hours }), ': ',
          usd(perM(o.prompt)) + ' input · ' + usd(perM(o.completion)) + ' output · ' + usd(perM(o.input_cache_read)) + ' cache read, per MTok');
      })));
  }

  function yesNo(v) { return v ? 'Yes' : 'No'; }

  function renderModel(doc, m) {
    document.title = name(m) + ' — ZeikoAI models';
    clear(app);
    var pg = m.page || {};
    var p = price(m);
    var r = m.reasoning || {};
    var feat = pg.features || {};
    var st7 = stats(m, '7d');
    var st30 = stats(m, '30d');

    app.append(h('nav.crumbs', { 'aria-label': 'Breadcrumb' },
      h('a', { href: '/models', text: 'Models' }), h('span', { 'aria-hidden': 'true', text: '/' }), h('span', { text: name(m) })));

    app.append(h('header.mp-hero.model-head', {},
      h('div.head-badges', {}, statusPill(m), badge(m),
        pg.released ? h('span.muted', { text: 'Released ' + longDate(pg.released) }) : null),
      h('h1', { text: name(m) }),
      pg.tagline ? h('p.lede', { text: pg.tagline }) : null,
      h('p.id-line', {}, h('span.muted', { text: 'Model ID ' }), copyRow(m.id)),
      h('dl.keyfacts', {},
        h('div', {}, h('dt', { text: 'Context window' }), h('dd', { text: tokens(m.context_length) + ' tokens' })),
        h('div', {}, h('dt', { text: 'Max output' }), h('dd', { text: tokens(m.max_completion_tokens) + ' tokens' })),
        h('div', {}, h('dt', { text: 'Input' }), h('dd', { text: usd(p.input) + ' / MTok' })),
        h('div', {}, h('dt', { text: 'Output' }), h('dd', { text: usd(p.output) + ' / MTok' }))),
      h('p.head-links', {},
        h('a.btn.btn-primary.btn-sm', { href: '/#contact', text: 'Request a key' }),
        h('a.btn.btn-ghost.btn-sm', { href: '/#start', text: 'Get started' }),
        h('a.btn.btn-ghost.btn-sm', { href: '#performance', text: 'Live performance' }))));

    var ov = section('overview', 'Overview');
    ov.append(h('div.overview', {},
      h('div.overview-text', {}, paragraphs(pg.overview || m.description)),
      pg.best_for && pg.best_for.length
        ? h('div.best', {}, h('h3', { text: 'Best for' }), h('ul.ticks', {}, pg.best_for.map(function (b) { return h('li', { text: b }); })))
        : null));
    app.append(ov);

    var perf = section('performance', 'Live performance',
      'Measured on real traffic to this model. Figures as of ' + stamp(doc.as_of) + ', refreshed every hour.');
    perf.append(performance(m, '24h'));
    app.append(perf);

    var cmp = section('compare', 'How it compares');
    cmp.append(compareTable(doc, m.id), compareNotes());
    app.append(cmp);

    var spec = section('specifications', 'Specifications');
    spec.append(h('div.spec-grid', {},
      specTable('Model ID and endpoints', [
        ['Model ID', copyRow(m.id)],
        ['Chat Completions', h('code', { text: 'POST /v1/chat/completions' })],
        ['Completions', h('code', { text: 'POST /v1/completions' })],
        ['Model list', h('code', { text: 'GET /v1/models' })],
        ['Owned by', m.owned_by || '—']
      ]),
      specTable('Pricing', [
        ['Input', usd(p.input) + ' / MTok'],
        ['Output', usd(p.output) + ' / MTok'],
        p.cache != null ? ['Cache read', usd(p.cache) + ' / MTok'] : null,
        ['Reasoning tokens', 'billed as output'],
        pg.refusal_usd ? ['Refused request', usd(pg.refusal_usd) + ' flat, instead of tokens'] : null,
        (m.pricing || {}).request ? ['Per-request fee', usd(parseFloat(m.pricing.request))] : null,
        ['Paid in', 'USDT (TRC20), invoiced per billing period']
      ]),
      specTable('Capabilities', [
        ['Context window', tokens(m.context_length) + ' tokens'],
        ['Max output', tokens(m.max_completion_tokens) + ' tokens'],
        ['Input → output', modalities(m)],
        ['Thinking', thinking(m)],
        ['Default effort', h('code', { text: r.default_effort || '—' })],
        ['Efforts', h('span', {}, (r.supported_efforts || []).map(function (e, i) { return [i ? ' ' : null, h('code', { text: e })]; }))],
        ['Streaming (SSE)', yesNo(feat.streaming !== false)],
        ['Tool calling', yesNo(feat.tools)],
        ['Structured outputs', yesNo(feat.structured_outputs)],
        ['Reasoning trace returned', yesNo(feat.reasoning_trace)]
      ]),
      specTable('Availability', [
        ['Status', statusPill(m)],
        pg.released ? ['Released', longDate(pg.released)] : null,
        ['Availability, 7 days', pct(st7.availability, 2)],
        ['Availability, 30 days', pct(st30.availability, 2)],
        ['Requests answered, 30 days', num(st30.served)]
      ])));
    spec.append(bandsTable(m), windowsList(m));
    app.append(spec);

    if (pg.notes && pg.notes.length) {
      var gtk = section('good-to-know', 'Good to know');
      gtk.append(h('ul.notes-list', {}, pg.notes.map(function (n) { return h('li', { text: n }); })));
      app.append(gtk);
    }

    app.append(method());

    var res = section('resources', 'Resources');
    res.append(h('div.grid.res-grid', {},
      [['Get started', 'Your base URL and key, then an ordinary OpenAI-SDK call.', '/#start'],
        ['Pricing', 'Every model and band side by side, and how refusals are billed.', '/#pricing'],
        ['FAQ', 'Company and private keys, what is stored, how cost is worked out.', '/#faq'],
        ['All models', 'Every model, compared, with its live figures.', '/models']].map(function (c) {
        return h('a.card.res-card', { href: c[2] }, h('h3', { text: c[0] }), h('p', { text: c[1] }));
      })));
    app.append(res);
  }

  /* ------------------------------------------------------------ routing */

  function unavailable(title, body) {
    clear(app);
    app.append(h('section.mp-hero', {},
      h('p.eyebrow', { text: 'Models' }),
      h('h1', { text: title }),
      h('p.lede', { text: body }),
      h('p.head-links', {},
        h('a.btn.btn-primary.btn-sm', { href: '/#models', text: 'See the models' }),
        h('a.btn.btn-ghost.btn-sm', { href: '/#pricing', text: 'Pricing' }))));
  }

  function route(doc) {
    var id = decodeURIComponent(location.pathname.replace(/^\/models\/?/, '').replace(/\/$/, ''));
    if (!id) return renderIndex(doc);
    var m = doc.models.filter(function (x) { return x.id === id || x.id.toLowerCase() === id.toLowerCase(); })[0];
    if (!m) {
      unavailable('No model called “' + id + '”', 'It may have been renamed or retired. Every current model is listed on the models page.');
      app.querySelector('.head-links a').setAttribute('href', '/models');
      app.querySelector('.head-links a').textContent = 'All models';
      return;
    }
    renderModel(doc, m);
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  fetch('/data/models.json', { headers: { accept: 'application/json' } })
    .then(function (res) {
      if (res.status === 404) throw new Error('unpublished');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (doc) {
      if (!doc || !Array.isArray(doc.models) || doc.version !== 1) throw new Error('unreadable');
      route(doc);
    })
    .catch(function (err) {
      if (err && err.message === 'unpublished') {
        unavailable('Live figures are on their way', 'The first hourly snapshot has not been published yet. The models, and their prices, are on the home page in the meantime.');
      } else {
        unavailable('The live figures could not be loaded', 'Try again in a moment. The models and their prices are also on the home page.');
      }
    });
})();
