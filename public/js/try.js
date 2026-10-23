/* Zeiko homepage — the playground (#try): one real question to Pranata V1.
 *
 * The one script outside the account area allowed to ask anything, and it
 * asks one place only: the address in <meta name="zeiko-accounts">. Every
 * value that comes back is put on the page as text (textContent), never as
 * markup. Without JavaScript the section says so and the form stays hidden. */

(function () {
  'use strict';

  var meta = document.querySelector('meta[name="zeiko-accounts"]');
  var DOOR = meta ? String(meta.content || '').replace(/\/+$/, '') : '';
  var box = document.getElementById('tryBox');
  var form = document.getElementById('tryForm');
  if (!DOOR || !box || !form) return;
  box.hidden = false;

  var result = document.getElementById('tryResult');
  var left = document.getElementById('tryLeft');
  var askBtn = document.getElementById('tryAsk');
  var tabs = Array.prototype.slice.call(form.querySelectorAll('.try-tab'));

  // Everything this file writes, in the page's own language (<html lang>):
  // /id/ is Indonesian. Messages the door sends back are shown as written.
  var W = document.documentElement.lang === 'id' ? {
    // A ready example for each kind, so the first press shows something.
    examples: {
      noul: {
        state: 'Halo, pesanan #4821 saya datang dengan layar retak. Saya butuh penggantinya sebelum Jumat — acaranya hari itu. Tolong telepon saya hari ini.',
        instructions: 'Apakah pesan ini perlu dibalas hari ini?',
        yes: 'Penulisnya butuh jawaban dalam sehari',
        no: ''
      },
      choice: {
        state: 'Paketnya telat dua hari dan kardusnya penyok, tapi headphone di dalamnya berfungsi baik.',
        instructions: 'Tim mana yang harus menangani ini?',
        options: 'Pengiriman\nKualitas produk\nRetur\nTidak perlu tindakan'
      },
      score: {
        state: 'Pelayanannya lumayan. Makanannya agak lama, tapi stafnya ramah dan pencuci mulutnya enak sekali.',
        instructions: 'Seberapa puas pelanggan ini?',
        levels: 'Sangat tidak puas\nTidak puas\nBiasa saja\nPuas\nSangat puas'
      }
    },
    kinds: { noul: 'Ya atau tidak', choice: 'Pilih satu', score: 'Beri skor' },
    yes: 'Ya',
    no: 'Tidak',
    left: function (n, of) { return 'Sisa ' + n + ' dari ' + of + ' percobaan gratis'; },
    next: function (m) { return ' · satu lagi dalam ' + m + ' menit'; },
    usedUp: 'Percobaan gratis habis · kamu bisa lanjut selama masuk',
    answered: function (ms) { return 'Dijawab dalam ' + ms + ' ms'; },
    unreadable: 'Jawaban itu tidak bisa dibaca. Coba lagi.',
    likely: function (p) { return 'kemungkinan ' + p; },
    confidence: function (p) { return 'Keyakinan ' + p; },
    level: function (n) { return 'Tingkat ' + n; },
    score: function (s, n, c) { return 'Skor ' + s.replace('.', ',') + ' dari ' + n + ' · keyakinan ' + c; },
    needText: 'Tulis dulu teks yang dinilai.',
    needQuestion: 'Tulis dulu pertanyaannya.',
    asking: 'Bertanya…',
    askingLong: 'Bertanya ke Pranata V1…',
    down: 'Sedang tidak tersedia. Coba lagi semenit lagi.',
    shut: 'Playground sedang tutup. Kembali lagi nanti.'
  } : {
    examples: {
      noul: {
        state: 'Hi, my order #4821 arrived with a cracked screen. I need a replacement before Friday — that is when the event is. Please call me back today.',
        instructions: 'Does this message need a reply today?',
        yes: 'The writer needs an answer within a day',
        no: ''
      },
      choice: {
        state: 'The package came two days late and the box was crushed, but the headphones inside work fine.',
        instructions: 'Which team should handle this?',
        options: 'Shipping\nProduct quality\nReturns\nNo action needed'
      },
      score: {
        state: 'The service was okay. The food took a while, but the staff were friendly and the dessert was great.',
        instructions: 'How happy is this customer?',
        levels: 'Very unhappy\nUnhappy\nNeutral\nHappy\nVery happy'
      }
    },
    kinds: { noul: 'Yes or no', choice: 'Pick one', score: 'Score it' },
    yes: 'Yes',
    no: 'No',
    left: function (n, of) { return n + ' of ' + of + ' free tries left'; },
    next: function (m) { return ' · one more in ' + m + ' min'; },
    usedUp: 'Free tries used · you can keep going while signed in',
    answered: function (ms) { return 'Answered in ' + ms + ' ms'; },
    unreadable: 'That answer could not be read. Try again.',
    likely: function (p) { return p + ' likely'; },
    confidence: function (p) { return 'Confidence ' + p; },
    level: function (n) { return 'Level ' + n; },
    score: function (s, n, c) { return 'Score ' + s + ' of ' + n + ' · confidence ' + c; },
    needText: 'Write the text to judge first.',
    needQuestion: 'Write the question first.',
    asking: 'Asking…',
    askingLong: 'Asking Pranata V1…',
    down: 'Not available right now. Try again in a minute.',
    shut: 'The playground is not open right now. Come back soon.'
  };
  var EXAMPLES = W.examples;
  var KIND_NAME = W.kinds;
  var kind = 'noul';
  var drafts = {};
  var open = true;

  function field(name) { return form.elements.namedItem(name); }

  function read() {
    var d = { state: field('state').value, instructions: field('instructions').value };
    if (kind === 'noul') { d.yes = field('yes').value; d.no = field('no').value; }
    if (kind === 'choice') d.options = field('options').value;
    if (kind === 'score') d.levels = field('levels').value;
    return d;
  }

  function write(d) {
    field('state').value = d.state || '';
    field('instructions').value = d.instructions || '';
    if (kind === 'noul') { field('yes').value = d.yes || ''; field('no').value = d.no || ''; }
    if (kind === 'choice') field('options').value = d.options || '';
    if (kind === 'score') field('levels').value = d.levels || '';
  }

  function show(next, focus) {
    drafts[kind] = read();
    kind = next;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-kind') === kind;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    form.querySelectorAll('[data-for]').forEach(function (el) {
      el.hidden = el.getAttribute('data-for') !== kind;
    });
    write(drafts[kind] || EXAMPLES[kind]);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('data-kind'), false); });
    // Arrow keys move between the tabs, as a tab list should.
    t.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = tabs[(i + step + tabs.length) % tabs.length];
      show(next.getAttribute('data-kind'), true);
    });
  });

  /* -------------------------------------------------------------- asking */

  function ask(method, body) {
    var stop = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = stop ? setTimeout(function () { stop.abort(); }, 30000) : 0;
    var opts = { method: method, credentials: 'include', headers: {} };
    if (stop) opts.signal = stop.signal;
    if (body) {
      opts.headers['content-type'] = 'application/json';
      opts.headers['x-zeiko'] = '1';
      opts.body = JSON.stringify(body);
    }
    return fetch(DOOR + '/v1/try', opts).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        return { status: res.status, data: data };
      });
    }, function () {
      return { status: 0, data: null };
    }).then(function (r) { clearTimeout(timer); return r; });
  }

  function minutes(at) {
    return Math.max(1, Math.ceil((at - Date.now()) / 60000));
  }

  function counter(t, signedIn) {
    if (!t || typeof t.left !== 'number') { left.textContent = ''; return; }
    var text = W.left(t.left, t.of);
    if (t.left < t.of && t.resetsAt) text += W.next(minutes(t.resetsAt));
    if (t.left === 0 && signedIn) text = W.usedUp;
    left.textContent = text;
  }

  function closed(message) {
    open = false;
    askBtn.disabled = true;
    say('err', message);
  }

  /* ------------------------------------------------------------ the answer */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function pct(p) {
    var v = Math.round(Number(p) * 100);
    return (isFinite(v) ? v : 0) + '%';
  }

  function say(kindOf, text) {
    result.textContent = '';
    result.appendChild(el('p', kindOf === 'err' ? 'try-err' : 'try-wait', text));
  }

  function headline(kindLabel, big, small) {
    var h = el('div', 'try-head');
    h.appendChild(el('p', 'ask-kind', kindLabel));
    h.appendChild(el('p', 'try-big', big));
    if (small) h.appendChild(el('p', 'try-small', small));
    return h;
  }

  // One row per option: its name, a bar as long as its probability, the figure.
  function odds(rows, top) {
    var list = el('ul', 'odds');
    rows.forEach(function (r) {
      var li = el('li', r.name === top ? 'is-top' : '');
      li.appendChild(el('span', 'odds-label', r.name));
      var barOut = el('span', 'odds-bar');
      barOut.setAttribute('aria-hidden', 'true');
      var bar = el('span');
      bar.style.setProperty('--p', pct(r.p));
      barOut.appendChild(bar);
      li.appendChild(barOut);
      li.appendChild(el('span', 'odds-val', pct(r.p)));
      list.appendChild(li);
    });
    return list;
  }

  function render(a, sent, ms) {
    result.textContent = '';
    var foot = W.answered(ms);
    if (!a || typeof a !== 'object') { say('err', W.unreadable); return; }

    if (a.type === 'noul') {
      var p = Number(a.noul) || 0;
      var yes = p >= 0.5;
      result.appendChild(headline(KIND_NAME.noul, yes ? W.yes : W.no, W.likely(pct(yes ? p : 1 - p))));
      result.appendChild(odds([{ name: W.yes, p: p }, { name: W.no, p: 1 - p }], yes ? W.yes : W.no));
    } else if (a.type === 'choice') {
      var probs = a.probabilities || {};
      var rows = Object.keys(probs).map(function (k) { return { name: k, p: probs[k] }; });
      result.appendChild(headline(KIND_NAME.choice, String(a.choice || ''), W.confidence(pct(a.confidence))));
      result.appendChild(odds(rows, String(a.choice || '')));
    } else if (a.type === 'score') {
      var legend = a.legend || {};
      var pr = a.probabilities || {};
      var keys = Object.keys(pr).sort(function (x, y) { return Number(x) - Number(y); });
      var n = keys.length;
      var best = keys.reduce(function (b, k) { return Number(pr[k]) > Number(pr[b]) ? k : b; }, keys[0]);
      var score = Number(a.score) || 0;
      var label = function (k) { var v = legend[k]; return typeof v === 'string' ? v : W.level(Number(k) + 1); };
      result.appendChild(headline(KIND_NAME.score, label(best), W.score((score + 1).toFixed(1), n, pct(a.confidence))));
      var hist = el('ol', 'hist');
      hist.style.gridTemplateColumns = 'repeat(' + n + ', minmax(0, 1fr))';
      keys.forEach(function (k) {
        var li = el('li', k === best ? 'is-top' : '');
        li.title = label(k);
        li.appendChild(el('span', 'hist-val', pct(pr[k])));
        var col = el('span', 'hist-col');
        col.setAttribute('aria-hidden', 'true');
        col.style.setProperty('--p', pct(pr[k]));
        li.appendChild(col);
        li.appendChild(el('span', 'hist-x', String(Number(k) + 1)));
        hist.appendChild(li);
      });
      result.appendChild(hist);
      var key = el('ol', 'try-legend');
      keys.forEach(function (k) {
        var li = el('li');
        li.appendChild(el('b', '', String(Number(k) + 1)));
        li.appendChild(document.createTextNode(' ' + label(k)));
        key.appendChild(li);
      });
      result.appendChild(key);
    } else {
      say('err', W.unreadable);
      return;
    }
    result.appendChild(el('p', 'try-foot', foot));
  }

  /* -------------------------------------------------------------- sending */

  function lines(text) {
    return String(text || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!open) return;
    var d = read();
    var body = { kind: kind, state: d.state, instructions: d.instructions };
    if (kind === 'noul') { body.yes = d.yes; body.no = d.no; }
    if (kind === 'choice') body.options = lines(d.options);
    if (kind === 'score') body.levels = lines(d.levels);
    if (!body.state.trim()) { say('err', W.needText); field('state').focus(); return; }
    if (!body.instructions.trim()) { say('err', W.needQuestion); field('instructions').focus(); return; }

    var before = askBtn.textContent;
    askBtn.disabled = true;
    askBtn.textContent = W.asking;
    form.setAttribute('aria-busy', 'true');
    say('wait', W.askingLong);
    var started = Date.now();
    ask('POST', body).then(function (r) {
      var ms = Date.now() - started;
      if (r.status === 200 && r.data) {
        render(r.data.answer, body, ms);
        counter(r.data.tries, r.data.signedIn);
      } else if (r.status >= 400 && r.status < 500 && r.data && r.data.error && typeof r.data.error.message === 'string') {
        // The answer's own words, written for visitors.
        say('err', r.data.error.message);
        if (r.status === 409) closed(r.data.error.message);
      } else {
        say('err', W.down);
      }
    }).then(function () {
      askBtn.disabled = !open;
      askBtn.textContent = before;
      form.removeAttribute('aria-busy');
    });
  });

  /* ---------------------------------------------------------------- start */

  write(EXAMPLES[kind]);
  ask('GET').then(function (r) {
    if (r.status !== 200 || !r.data) { closed(W.down); return; }
    if (!r.data.open) { closed(W.shut); return; }
    counter(r.data.tries, r.data.signedIn);
  });
})();
