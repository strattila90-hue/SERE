/* SERE PIXEL — offline túlélési kézikönyv (PWA) */
(function () {
  'use strict';
  const C = window.SERE_CONTENT, D = window.SERE_DATA, PX = window.PX;
  const $ = (s, el = document) => el.querySelector(s);
  const main = $('#main');
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('sp:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sp:' + k, JSON.stringify(v)); } catch (e) { /* tárhely nem elérhető */ } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const ic = (n, s = 32) => PX.svg(n, s);
  const CH_ICON = { '1': 'book', '2': 'fire', '3': 'shelter', '4': 'water', '5': 'eye', '6': 'compass', '7': 'heli', '8': 'signal' };
  let cleanup = null;

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }

  /* ---------------- nappal / éjszaka ---------------- */
  function isNight() {
    const m = LS.get('mode', 'auto');
    if (m === 'night') return true; if (m === 'day') return false;
    const h = new Date().getHours(); return h < 6 || h >= 19;
  }
  function applyMode() {
    const n = isNight();
    document.body.classList.toggle('night', n);
    $('#modeBtn').innerHTML = ic(n ? 'moon' : 'sun', 26);
    $('#modeBtn').title = n ? 'Éjszakai mód (koppints: nappal)' : 'Nappali mód (koppints: éjszaka)';
    const meta = $('meta[name=theme-color]'); if (meta) meta.content = n ? '#070a07' : '#142414';
    if (typeof drawCover === 'function' && $('#cover')) drawCover();
  }
  $('#modeBtn').onclick = () => { LS.set('mode', isNight() ? 'day' : 'night'); applyMode(); };

  /* ---------------- borító jelenet ---------------- */
  function drawCover() {
    const cv = $('#cover'); if (!cv) return;
    const W = 160, H = 90; cv.width = W; cv.height = H;
    const g = cv.getContext('2d'), night = isNight();
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const P = night
      ? { sky: '#070b08', far: '#0f1a10', mid: '#152316', near: '#1c2e1b', lite: '#2a3d22', clear: '#3a2a1c', clear2: '#4a3423', hull: '#8a8f86', hull2: '#5d625a', acc: '#ff4a2a' }
      : { sky: '#16240f', far: '#203619', mid: '#2c4a22', near: '#3b5f2b', lite: '#5d7f39', clear: '#8a7a4a', clear2: '#a99560', hull: '#e4e2d6', hull2: '#9a9c92', acc: '#ff9500' };
    g.fillStyle = P.sky; g.fillRect(0, 0, W, H);
    if (night) { for (let i = 0; i < 40; i++) { g.fillStyle = rnd() > .7 ? '#d4a07c' : '#6e5a4a'; g.fillRect((rnd() * W) | 0, (rnd() * 26) | 0, 1, 1); } g.fillStyle = '#d4a07c'; g.fillRect(132, 6, 6, 6); g.fillStyle = P.sky; g.fillRect(134, 5, 6, 6); }
    const tree = (x, y, h, c, c2) => {
      for (let i = 0; i < h; i++) { const w = Math.max(1, ((i / h) * h * .42) | 0); g.fillStyle = (i % 4 === 1) ? c2 : c; g.fillRect(x - w, y - h + i, w * 2 + 1, 1); }
      g.fillStyle = '#2a1c10'; g.fillRect(x, y, 1, 3);
    };
    for (let x = -4; x < W + 6; x += 6) tree(x + ((rnd() * 4) | 0), 34 + ((rnd() * 4) | 0), 18 + ((rnd() * 8) | 0), P.far, P.mid);
    g.fillStyle = P.far; g.fillRect(0, 34, W, H);
    // tisztás
    for (let y = 40; y < 84; y++) {
      const t = (y - 62) / 22, half = Math.sqrt(Math.max(0, 1 - t * t)) * 62;
      for (let x = (80 - half) | 0; x < 80 + half; x++) { g.fillStyle = rnd() > .82 ? P.clear2 : (rnd() > .9 ? P.lite : P.clear); g.fillRect(x, y, 1, 1); }
    }
    for (let i = 0; i < 90; i++) { g.fillStyle = rnd() > .5 ? P.mid : P.near; g.fillRect((rnd() * W) | 0, 36 + ((rnd() * 54) | 0), 1, 1); }
    // roncs (törzs, szárny, darabok)
    g.save(); g.translate(78, 60); g.rotate(-0.42);
    g.fillStyle = P.hull2; g.fillRect(-30, -4, 58, 9);
    g.fillStyle = P.hull; g.fillRect(-30, -5, 58, 7);
    g.fillStyle = P.hull; g.fillRect(24, -12, 6, 10);
    g.fillStyle = P.hull2; g.fillRect(-8, 2, 14, 14); g.fillRect(-6, -18, 12, 14);
    g.fillStyle = '#2a2d2a'; for (let i = -24; i < 20; i += 5) g.fillRect(i, -3, 2, 2);
    g.fillStyle = P.acc; g.fillRect(4, -4, 3, 3);
    g.restore();
    g.fillStyle = P.hull2; [[40, 70], [46, 74], [110, 52], [118, 58], [104, 72], [52, 50]].forEach(([x, y]) => g.fillRect(x, y, 3, 2));
    // X jelölés
    g.fillStyle = P.acc; for (let i = 0; i < 7; i++) { g.fillRect(118 + i, 64 + i, 2, 1); g.fillRect(124 - i, 64 + i, 2, 1); }
    // előtér fák
    for (let x = -2; x < W; x += 9) { if (x > 30 && x < 130) continue; tree(x + ((rnd() * 3) | 0), 92, 30 + ((rnd() * 10) | 0), P.near, P.lite); }
    // iránytű jelvény
    const cx = 22, cy = 66;
    g.fillStyle = '#141810'; g.fillRect(cx - 13, cy - 13, 27, 27);
    g.fillStyle = night ? '#6e4a33' : '#c4a574'; g.fillRect(cx - 12, cy - 12, 25, 25);
    g.fillStyle = '#141810'; g.fillRect(cx - 10, cy - 10, 21, 21);
    g.fillStyle = P.acc; for (let i = -8; i <= 8; i++) { if (Math.abs(i) > 6) { g.fillRect(cx + i, cy, 1, 1); g.fillRect(cx, cy + i, 1, 1); } }
    g.fillStyle = night ? '#d4a07c' : '#e6d3a3'; for (let i = 1; i < 7; i++) { g.fillRect(cx - i + 3, cy + i - 3, 1, 1); }
    g.fillStyle = P.acc; for (let i = 1; i < 7; i++) { g.fillRect(cx + i - 3, cy - i + 3, 1, 1); g.fillRect(cx + i - 2, cy - i + 3, 1, 1); }
    // vignette
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, 2); g.fillRect(0, H - 2, W, 2);
  }

  /* ---------------- státuszsávok ---------------- */
  const STATS = [
    { id: 'viz', n: 'Víz', icon: 'water', c: 'var(--blue)', g: 'viz' },
    { id: 'eh', n: 'Éhség', icon: 'meat', c: 'var(--acc)', g: 'viz' },
    { id: 'en', n: 'Energia', icon: 'fire', c: 'var(--yel)', g: 'menedek' },
    { id: 'mor', n: 'Morál', icon: 'star', c: 'var(--ok)', g: 'elsosegely' }
  ];
  function statsHTML() {
    const v = LS.get('stats', { viz: 8, eh: 7, en: 6, mor: 9 });
    return STATS.map(s => `<div class="stat" data-s="${s.id}"><div class="ic">${ic(s.icon, 26)}</div><div class="lbl">${s.n} ${v[s.id]}/10</div>
      <div class="bar" style="--c:${s.c}" data-bar="${s.id}">${Array.from({ length: 10 }, (_, i) => `<i class="${i < v[s.id] ? 'f' : ''}"></i>`).join('')}</div></div>`).join('');
  }
  function statAdvice() {
    const v = LS.get('stats', { viz: 8, eh: 7, en: 6, mor: 9 });
    const low = STATS.slice().sort((a, b) => v[a.id] - v[b.id])[0];
    const tips = {
      viz: 'Víz az első: keress forrást, tisztítsd, igyál mértékkel (0,5–0,8 l/óra).',
      eh: 'Élelem: 3 hétig kibírható, de az energia fogy. Előbb víz, aztán étel.',
      en: 'Pihenj: menedék, szigetelés, tűz. A fáradtság rossz döntésekhez vezet.',
      mor: 'Morál: S-T-O-P, rutin, apró célok. A túlélési akarat a legfontosabb.'
    };
    return { low, txt: tips[low.id] };
  }

  /* ---------------- nézetek ---------------- */
  const V = {};

  V.home = () => {
    const a = statAdvice();
    main.innerHTML = `
      <section class="card cover frame"><canvas id="cover" width="160" height="90" aria-label="SERE PIXEL borító: lezuhant roncs egy erdei tisztáson"></canvas>
        <div class="title"><div class="big">SERE<br><b>PIXEL</b></div>
        <div class="sub">SURVIVAL GUIDE</div><div class="dash">▪▪▪▪▪▪ ★ ▪▪▪▪▪▪</div>
        <div class="mt"><span class="stamp">FIELD MANUAL · SERE „A”</span></div></div></section>

      <section class="card">
        <div class="statusline"><span>STATUS</span><span class="muted" style="font-family:Pixelify;font-size:13px">koppints a sávokra</span></div>
        <div class="rule"></div>
        <div class="stats">${statsHTML()}</div>
        <div class="callout ok mt" style="margin-bottom:0">${ic(a.low.icon, 26)}<div>${esc(a.txt)} <a href="#/guide/${a.low.g}">Útmutató ›</a></div></div>
      </section>

      <section class="card">
        <h2>Főmenü</h2><div class="rule star"></div>
        <div class="menu">
          ${tile('#/toc', 'book', 'Kézikönyv', 'tartalomjegyzék')}
          ${tile('#/guides', 'fire', 'Gyors útmutatók', 'safety card')}
          ${tile('#/prio', 'signal', 'SERE prioritások', 'S·P·H·T·S')}
          ${tile('#/stop', 'stop', 'S-T-O-P', 'első lépések')}
          ${tile('#/kit', 'pack', 'Kit-builder', 'inventory')}
          ${tile('#/check', 'check', 'Checklisták', 'pipálható')}
          ${tile('#/compass', 'compass', 'Iránytű', 'pixel compass')}
          ${tile('#/map', 'map', 'Térkép-jelölő', 'offline pontok')}
          ${tile('#/about', 'star', 'Telepítés', 'QR · offline')}
        </div>
      </section>
      <div class="motto">${ic('warn', 24)}<span>STAY PREPARED. STAY ALIVE. — Készülj fel. Maradj életben.</span></div>
      <p class="foot">Offline működik · minden adat csak ezen az eszközön tárolódik</p>`;
    drawCover();
    main.querySelectorAll('.bar').forEach(bar => {
      bar.addEventListener('click', e => {
        const r = bar.getBoundingClientRect(); const val = Math.max(0, Math.min(10, Math.ceil(((e.clientX - r.left) / r.width) * 10)));
        const v = LS.get('stats', { viz: 8, eh: 7, en: 6, mor: 9 }); v[bar.dataset.bar] = val; LS.set('stats', v); V.home();
      });
    });
  };
  const tile = (href, icon, t, s) => `<a class="tile" href="${href}">${ic(icon, 44)}<span>${t}</span><small>${s}</small></a>`;

  /* --- kézikönyv: tartalomjegyzék --- */
  const seenAll = () => LS.get('seen', {});
  V.toc = (q) => {
    const seen = seenAll(), open = LS.get('tocOpen', ['1']);
    const query = (q || '').trim().toLowerCase();
    const match = s => !query || (s.title + ' ' + JSON.stringify(s.blocks)).toLowerCase().includes(query);
    main.innerHTML = `
      <section class="card frame">
        <div class="ch-head">${ic('book', 48)}<div><h1>Kézikönyv</h1><div class="stencil" style="font-size:13px">SERE LEVEL "A" · FIELD MANUAL</div></div></div>
        <div class="rule"></div>
        <input type="text" id="q" placeholder="Keresés a kézikönyvben…" value="${esc(q || '')}" aria-label="Keresés">
        <p class="muted" style="font-size:18px;margin:8px 0 0"><span class="badge src">TANANYAG</span> a feltöltött diák alapján · <span class="badge web">KIEGÉSZÍTVE</span> nyilvános forrásokból, a tananyag tartalomjegyzéke szerint</p>
      </section>
      ${C.map(ch => {
        const secs = ch.sections.filter(match); if (!secs.length) return '';
        const done = ch.sections.filter(s => seen[s.id]).length;
        const isOpen = query || open.includes(ch.id);
        return `<div class="toc-ch"><button data-ch="${ch.id}" aria-expanded="${isOpen}">${ic(CH_ICON[ch.id] || 'book', 32)}<span class="num">${ch.id}</span><span class="tt">${esc(ch.title)}<br><small class="muted" style="font-family:VT323;font-size:16px">${esc(ch.sub)}</small></span><span class="pr">${done}/${ch.sections.length}</span></button>
          <ul class="toc-list ${isOpen ? '' : 'hidden'}">${secs.map(s => `<li><button data-go="${ch.id}/${s.id}"><span class="sid">${s.id}</span><span class="sn">${esc(s.title)} ${s.web ? '<span class="badge web" title="Nyilvános forrásból kiegészítve">+</span>' : ''}</span><span class="seen">${seen[s.id] ? '✓' : ''}</span></button></li>`).join('')}</ul></div>`;
      }).join('')}`;
    const qi = $('#q');
    qi.addEventListener('input', () => { const p = qi.selectionStart; V.toc(qi.value); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); });
    main.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => {
      const id = b.dataset.ch; let o = LS.get('tocOpen', ['1']);
      o = o.includes(id) ? o.filter(x => x !== id) : o.concat(id); LS.set('tocOpen', o);
      b.nextElementSibling.classList.toggle('hidden'); b.setAttribute('aria-expanded', o.includes(id));
    });
    main.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { location.hash = '#/ch/' + b.dataset.go; });
  };

  /* --- fejezet olvasó --- */
  V.ch = (id, sec) => {
    const i = C.findIndex(c => c.id === id); const ch = C[i];
    if (!ch) return V.toc();
    const block = b => {
      switch (b.t) {
        case 'p': return `<p>${fmt(b.x)}</p>`;
        case 'li': return `<ul>${b.items.map(x => `<li>${fmt(x)}</li>`).join('')}</ul>`;
        case 'ol': return `<ol>${b.items.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>`;
        case 'warn': return `<div class="callout warn">${ic('warn', 26)}<div>${fmt(b.x)}</div></div>`;
        case 'ok': return `<div class="callout ok">${ic('check', 26)}<div>${fmt(b.x)}</div></div>`;
        case 'quote': return `<div class="callout quote">${ic('star', 26)}<div>${fmt(b.x)}</div></div>`;
      }
      return '';
    };
    main.innerHTML = `
      <section class="card frame"><div class="ch-head">${ic(CH_ICON[ch.id] || 'book', 52)}<div class="num">${ch.id}</div><div><h1>${esc(ch.title)}</h1><div class="muted" style="font-size:18px">${esc(ch.sub)}</div></div></div></section>
      ${ch.sections.map(s => `<section class="card sec" id="s-${s.id}" data-sid="${s.id}">
        <h2><span class="sid">${s.id}</span>${esc(s.title)}</h2>
        ${s.web ? '<div class="webnote"><span class="badge web">KIEGÉSZÍTVE</span> nyilvános forrásokból — ellenőrizd a hatályos szakutasítással</div><div class="rule"></div>' : '<div class="rule"></div>'}
        ${s.blocks.map(block).join('')}</section>`).join('')}
      <div class="pager">
        ${i > 0 ? `<a class="btn ghost" href="#/ch/${C[i - 1].id}">‹ ${C[i - 1].id}. fejezet</a>` : '<span></span>'}
        <a class="btn ghost" href="#/toc">Tartalom</a>
        ${i < C.length - 1 ? `<a class="btn" href="#/ch/${C[i + 1].id}">${C[i + 1].id}. fejezet ›</a>` : '<span></span>'}
      </div>`;
    const seen = seenAll();
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { seen[e.target.dataset.sid] = 1; LS.set('seen', seen); } });
    }, { threshold: .55 });
    main.querySelectorAll('.sec').forEach(s => io.observe(s));
    cleanup = () => io.disconnect();
    if (sec) { const el = document.getElementById('s-' + sec); if (el) setTimeout(() => el.scrollIntoView(), 30); } else window.scrollTo(0, 0);
  };

  /* --- gyors útmutatók --- */
  V.guides = () => {
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('fire', 48)}<div><h1>Gyors útmutatók</h1><div class="stencil" style="font-size:13px">SAFETY CARDS</div></div></div></section>
      <div class="menu">${D.guides.map(g => tile('#/guide/' + g.id, g.icon, g.title, g.en)).join('')}</div>`;
  };
  V.guide = (id) => {
    const g = D.guides.find(x => x.id === id); if (!g) return V.guides();
    main.innerHTML = `<section class="card frame">
      <div class="sc-head">${ic(g.icon, 52)}<div class="ttl">${esc(g.title)}<small>${g.en} · SERE PIXEL</small></div><span class="sp" style="flex:1"></span><span class="stamp">SERE · FM</span></div>
      <div class="steps">${g.steps.map((s, i) => `<div class="step"><div class="sh"><span class="no">${i + 1}</span>${esc(s.t)}</div>
        <div class="art">${ic(s.icon, 64)}</div><ul>${s.x.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="tag ${s.tag[0]}">${ic(s.tag[0] === 'warn' ? 'warn' : s.tag[0] === 'ok' ? 'check' : 'star', 18)}${esc(s.tag[1])}</div>${i < 3 ? '<span class="arrow">▶</span>' : ''}</div>`).join('')}</div>
      <div class="safety"><span class="sf-h">! BIZTONSÁG ELŐSZÖR</span><ul>${g.safety.map(x => `<li>${ic('warn', 20)}<span>${esc(x)}</span></li>`).join('')}</ul></div>
      <div class="motto">${ic('pack', 24)}<span>SERE MINDSET: FELKÉSZÜLÉS · ALKALMAZKODÁS · <span style="color:var(--warn)">TÚLÉLÉS</span></span></div>
      </section>
      <div class="pager"><a class="btn ghost" href="#/guides">‹ Útmutatók</a><a class="btn" href="#/ch/${g.ch}">Részletesen: ${g.ch}. fejezet ›</a></div>`;
    window.scrollTo(0, 0);
  };

  /* --- SERE prioritások --- */
  V.prio = () => {
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('signal', 48)}<div><h1>SERE prioritások</h1><div class="stencil" style="font-size:13px">SIGNAL › PROTECT › HEALTH › TRAVEL › SUSTAIN</div></div></div></section>
      <section class="card"><div class="chain">${D.priorities.map((p, i) => `${i ? '<div class="down">▼</div>' : ''}<a class="link" href="#/guide/${p.g}" style="text-decoration:none;color:inherit"><div class="L">${p.k}</div><div><h3 style="display:flex;gap:8px;align-items:center">${ic(p.icon, 24)}${esc(p.t)}</h3><div>${esc(p.x)}</div></div></a>`).join('')}</div>
      <div class="callout quote mt">${ic('star', 26)}<div>A SERE „A” tananyag (8.1) sorrendje: személyes védelem → ellátmány (víz, élelem) → egészség → helyváltoztatás. A jelzés mindegyikkel párhuzamosan fut – ha a mentés elérhető, a jelentés az első.</div></div>
      <div class="callout ok">${ic('check', 26)}<div><b>3-as szabály:</b> 3 perc levegő · 3 óra védelem nélkül szélsőséges időben · 3 nap víz · 3 hét élelem nélkül.</div></div></section>`;
  };

  /* --- S-T-O-P --- */
  V.stop = () => {
    const st = LS.get('stop', {});
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('stop', 52)}<div><h1>S-T-O-P</h1><div class="muted" style="font-size:18px">Az első percek – mielőtt bármit tennél.</div></div></div></section>
      ${D.stop.map((s, i) => `<section class="stop-card ${st[i] ? 'done' : ''}" data-i="${i}"><div class="L">${s.k}</div><div><h3>${esc(s.t)}</h3>
        ${s.x.map((x, j) => `<button class="chk ${st[i + '-' + j] ? 'on' : ''}" data-k="${i}-${j}"><span class="box"></span><span>${esc(x)}</span></button>`).join('')}</div></section>`).join('')}
      <div class="row"><button class="btn ghost" id="stopReset">Újrakezdés</button><a class="btn" href="#/prio">Tovább: prioritások ›</a></div>`;
    main.querySelectorAll('.chk').forEach(b => b.onclick = () => {
      const s = LS.get('stop', {}); s[b.dataset.k] = !s[b.dataset.k];
      const i = b.dataset.k.split('-')[0]; s[i] = D.stop[i].x.every((_, j) => s[i + '-' + j]); LS.set('stop', s); V.stop();
    });
    $('#stopReset').onclick = () => { LS.set('stop', {}); V.stop(); };
  };

  /* --- kit builder --- */
  const RAR = { rare: ['RITKA', 'var(--acc)'], imp: ['FONTOS', 'var(--ok)'], com: ['ALAP', 'var(--yel)'] };
  const CAT = { sus: ['ELLÁTÁS', 'var(--blue)'], nav: ['NAVIGÁCIÓ', 'var(--purple)'], util: ['ESZKÖZ', 'var(--yel)'], sig: ['JELZÉS', 'var(--acc)'], med: ['EGÉSZSÉG', 'var(--warn)'] };
  V.kit = () => {
    const have = LS.get('kit', {});
    const packed = D.kit.filter(k => have[k.id]);
    const grams = packed.reduce((a, k) => a + k.g, 0);
    const miss = D.kitEssential.filter(id => !have[id]);
    const ready = miss.length === 0;
    main.innerHTML = `<section class="card frame">
      <div class="ch-head">${ic('pack', 52)}<div><h1>Túlélőkészlet</h1><div class="stencil" style="font-size:13px">ESSENTIALS FOR THE UNKNOWN</div></div></div>
      <div class="rule"></div>
      <div class="statusline"><span>STATUS: <span class="st ${ready ? 'ok' : ''}">${ready ? 'PREPARED ✓' : 'NOT READY'}</span></span><span>${packed.length}/${D.kit.length} · ${(grams / 1000).toFixed(2)} KG</span></div>
      <div class="rule"></div>
      <div class="inv">${D.kit.map(k => `<button class="slot ${have[k.id] ? 'on' : ''} ${D.kitEssential.includes(k.id) ? 'ess' : ''}" data-id="${k.id}" title="${esc(k.n)} – ${k.g} g">
        ${ic(k.icon, 40)}<span class="nm">${esc(k.n)}</span>
        <span class="rr" style="color:${RAR[k.r][1]}"><i class="dot" style="--c:${RAR[k.r][1]}"></i>${RAR[k.r][0]}</span>
        <span class="rr" style="color:${CAT[k.c][1]}"><i class="dot" style="--c:${CAT[k.c][1]}"></i>${CAT[k.c][0]}</span></button>`).join('')}</div>
      ${miss.length ? `<div class="callout warn mt">${ic('warn', 26)}<div><b>Hiányzó alapelemek:</b> ${miss.map(id => esc(D.kit.find(k => k.id === id).n)).join(', ')}</div></div>` : `<div class="callout ok mt">${ic('check', 26)}<div>Minden alapelem a csomagban. A túlélőkészlet a <b>testen</b> legyen, ne a hátizsákban!</div></div>`}
      <div class="legend mt"><div><i class="dot" style="--c:var(--acc)"></i>RITKA – nehéz pótolni</div><div><i class="dot" style="--c:var(--blue)"></i>ELLÁTÁS – víz, étel</div>
        <div><i class="dot" style="--c:var(--ok)"></i>FONTOS – megbízható</div><div><i class="dot" style="--c:var(--purple)"></i>NAVIGÁCIÓ</div>
        <div><i class="dot" style="--c:var(--yel)"></i>ALAP – egyszerű, kell</div><div><span style="color:var(--warn);font-family:Silkscreen">!</span>&nbsp;kötelező alapelem</div></div>
      </section><div class="row"><button class="btn ghost" id="kitReset">Ürítés</button></div>`;
    main.querySelectorAll('.slot').forEach(b => b.onclick = () => { const h = LS.get('kit', {}); h[b.dataset.id] = !h[b.dataset.id]; LS.set('kit', h); V.kit(); });
    $('#kitReset').onclick = () => { LS.set('kit', {}); V.kit(); };
  };

  /* --- checklisták --- */
  V.check = (id) => {
    if (!id) {
      const st = LS.get('chk', {});
      main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('check', 48)}<div><h1>Checklisták</h1></div></div></section>
        <div class="menu">${D.checklists.map(c => { const d = c.items.filter((_, i) => st[c.id + i]).length; return tile('#/check/' + c.id, c.icon, c.t, `${d}/${c.items.length}`); }).join('')}</div>`;
      return;
    }
    const c = D.checklists.find(x => x.id === id); if (!c) return V.check();
    const st = LS.get('chk', {}); const d = c.items.filter((_, i) => st[c.id + i]).length;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic(c.icon, 48)}<div><h1>${esc(c.t)}</h1><div class="muted">${d}/${c.items.length} kész</div></div></div>
      <div class="progress">${c.items.map((_, i) => `<i class="${i < d ? 'f' : ''}"></i>`).join('')}</div>
      ${c.items.map((x, i) => `<button class="chk ${st[c.id + i] ? 'on' : ''}" data-i="${i}"><span class="box"></span><span>${esc(x)}</span></button>`).join('')}
      </section><div class="row"><a class="btn ghost" href="#/check">‹ Checklisták</a><button class="btn ghost" id="chkReset">Nullázás</button></div>`;
    main.querySelectorAll('.chk').forEach(b => b.onclick = () => { const s = LS.get('chk', {}); s[c.id + b.dataset.i] = !s[c.id + b.dataset.i]; LS.set('chk', s); V.check(id); });
    $('#chkReset').onclick = () => { const s = LS.get('chk', {}); c.items.forEach((_, i) => delete s[c.id + i]); LS.set('chk', s); V.check(id); };
  };

  /* --- iránytű --- */
  V.compass = () => {
    let heading = null, target = LS.get('target', null), manual = false, raf = 0;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('compass', 48)}<div><h1>Iránytű</h1><div class="muted" style="font-size:18px">Telefon szenzor · tartsd vízszintesen</div></div></div>
      <div class="compass-wrap"><canvas id="compass" width="96" height="96"></canvas></div>
      <div class="hdg" id="hdg">---°<small id="hdgSub">szenzor indítása szükséges</small></div>
      <div class="row center mt" style="justify-content:center"><button class="btn" id="startC">${ic('compass', 20)}Szenzor indítása</button><button class="btn ghost" id="manBtn">Kézi mód</button></div>
      <div id="manRow" class="hidden mt"><input type="range" id="manRange" min="0" max="359" value="0" style="width:100%"></div>
      <div class="rule"></div>
      <h3>Menetirány (azimut)</h3>
      <div class="row"><input type="number" id="tgt" min="0" max="359" placeholder="pl. 135" value="${target ?? ''}"><button class="btn ghost" id="setT">Beállít</button><button class="btn ghost" id="takeT">Jelenlegi</button><button class="btn ghost" id="clrT">Törlés</button></div>
      <p id="tgtInfo" class="muted" style="margin:8px 0 0"></p>
      <div class="callout warn mt">${ic('warn', 26)}<div>A telefon iránytűje fém, jármű, elektronika mellett téved, és kalibrálást igényelhet (nyolcas mozdulat). Navigációhoz a Cammenga tájoló az elsődleges.</div></div>
      </section>`;
    const cv = $('#compass'), g = cv.getContext('2d'), night = isNight();
    function draw() {
      const W = 96, c = 48; g.clearRect(0, 0, W, W);
      const h = heading || 0;
      const K = night ? { ring: '#6e4a33', face: '#141a12', tick: '#b3825e', n: '#ff5a3c', txt: '#d4a07c' } : { ring: '#8a7149', face: '#e6d3a3', tick: '#3b3220', n: '#ff3b30', txt: '#141810' };
      // pixel kör
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
        const d = Math.hypot(x - c + .5, y - c + .5);
        if (d < 46 && d >= 42) { g.fillStyle = K.ring; g.fillRect(x, y, 1, 1); }
        else if (d < 42) { g.fillStyle = K.face; g.fillRect(x, y, 1, 1); }
        if (d < 47 && d >= 46) { g.fillStyle = '#141810'; g.fillRect(x, y, 1, 1); }
      }
      // fokbeosztás forgatva
      for (let a = 0; a < 360; a += 15) {
        const r = (a - h) * Math.PI / 180, len = a % 90 === 0 ? 7 : a % 45 === 0 ? 5 : 3;
        for (let t = 0; t < len; t++) { const rr = 41 - t; g.fillStyle = a === 0 ? K.n : K.tick; g.fillRect(Math.round(c + Math.sin(r) * rr) - 1, Math.round(c - Math.cos(r) * rr) - 1, 2, 2); }
      }
      g.font = '9px Silkscreen, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([l, a]) => { const r = (a - h) * Math.PI / 180; g.fillStyle = l === 'N' ? K.n : K.txt; g.fillText(l, c + Math.sin(r) * 29, c - Math.cos(r) * 29 + 1); });
      // célirány jel
      if (target != null) { const r = (target - h) * Math.PI / 180; g.fillStyle = '#34c759'; for (let t = 0; t < 4; t++) g.fillRect(Math.round(c + Math.sin(r) * (44 - t)) - 2, Math.round(c - Math.cos(r) * (44 - t)) - 2, 4, 4); }
      // fix menetirány-jelző
      g.fillStyle = K.n; for (let i = 0; i < 9; i++) g.fillRect(c - Math.floor(i / 2) - 1, 10 + i, Math.floor(i / 2) * 2 + 2, 1);
      g.fillStyle = '#141810'; g.fillRect(c - 2, c - 2, 4, 4);
      if (heading != null) {
        $('#hdg').firstChild.nodeValue = String(Math.round(heading)).padStart(3, '0') + '°';
        const mils = Math.round(heading / 360 * 6400);
        $('#hdgSub').textContent = `${mils} vonás · ${Math.round(heading / 3)} kattanás (Cammenga) · ${dirName(heading)}`;
        if (target != null) {
          let diff = ((target - heading + 540) % 360) - 180;
          $('#tgtInfo').innerHTML = Math.abs(diff) < 4 ? `<span style="color:var(--ok)">✓ Irányban vagy (${target}°)</span>` : `${diff > 0 ? 'Fordulj JOBBRA' : 'Fordulj BALRA'} ${Math.abs(Math.round(diff))}°-ot → cél ${target}° · hátrairány ${(target + 180) % 360}°`;
        }
      }
      if (target != null && heading == null) $('#tgtInfo').textContent = `Cél: ${target}° · hátrairány ${(target + 180) % 360}° · ${Math.round(target / 3)} kattanás`;
    }
    const dirName = h => ['É', 'ÉK', 'K', 'DK', 'D', 'DNy', 'Ny', 'ÉNy'][Math.round(h / 45) % 8];
    function onOri(e) {
      if (manual) return;
      let h = null;
      if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = 360 - e.alpha;
      else if (e.alpha != null && e.type === 'deviceorientationabsolute') h = 360 - e.alpha;
      if (h == null) return;
      const so = (screen.orientation && screen.orientation.angle) || 0; h = (h + so + 360) % 360;
      heading = heading == null ? h : smooth(heading, h); schedule();
    }
    const smooth = (a, b) => { const d = ((b - a + 540) % 360) - 180; return (a + d * 0.25 + 360) % 360; };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    $('#startC').onclick = async () => {
      try {
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') { toast('Szenzor engedély megtagadva'); return; }
        }
        if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', onOri);
        else window.addEventListener('deviceorientation', onOri);
        manual = false; $('#manRow').classList.add('hidden'); toast('Szenzor fut');
        setTimeout(() => { if (heading == null) toast('Nincs iránytű szenzor – használd a kézi módot'); }, 2500);
      } catch (err) { toast('Szenzor nem elérhető'); }
    };
    $('#manBtn').onclick = () => { manual = true; $('#manRow').classList.remove('hidden'); heading = +$('#manRange').value; draw(); };
    $('#manRange').oninput = e => { heading = +e.target.value; draw(); };
    $('#setT').onclick = () => { const v = parseInt($('#tgt').value, 10); if (isNaN(v)) return; target = ((v % 360) + 360) % 360; LS.set('target', target); draw(); };
    $('#takeT').onclick = () => { if (heading == null) return toast('Nincs aktuális irány'); target = Math.round(heading); $('#tgt').value = target; LS.set('target', target); draw(); };
    $('#clrT').onclick = () => { target = null; LS.set('target', null); $('#tgt').value = ''; $('#tgtInfo').textContent = ''; draw(); };
    draw();
    cleanup = () => { window.removeEventListener('deviceorientationabsolute', onOri); window.removeEventListener('deviceorientation', onOri); };
  };

  /* --- koordináta segédek: UTM / MGRS (WGS84) --- */
  function toMGRS(lat, lon) {
    if (lat < -80 || lat > 84) return '—';
    const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996, e2 = f * (2 - f), ep2 = e2 / (1 - e2);
    let zone = Math.floor((lon + 180) / 6) + 1;
    if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) zone = 32;
    if (lat >= 72) { if (lon >= 0 && lon < 9) zone = 31; else if (lon >= 9 && lon < 21) zone = 33; else if (lon >= 21 && lon < 33) zone = 35; else if (lon >= 33 && lon < 42) zone = 37; }
    const lon0 = (zone - 1) * 6 - 180 + 3, φ = lat * Math.PI / 180, λ = (lon - lon0) * Math.PI / 180;
    const N = a / Math.sqrt(1 - e2 * Math.sin(φ) ** 2), T = Math.tan(φ) ** 2, Cc = ep2 * Math.cos(φ) ** 2, A = Math.cos(φ) * λ;
    const M = a * ((1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * φ - (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * φ) + (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * φ) - (35 * e2 ** 3 / 3072) * Math.sin(6 * φ));
    const E = k0 * N * (A + (1 - T + Cc) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * Cc - 58 * ep2) * A ** 5 / 120) + 500000;
    let Nn = k0 * (M + N * Math.tan(φ) * (A * A / 2 + (5 - T + 9 * Cc + 4 * Cc * Cc) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * Cc - 330 * ep2) * A ** 6 / 720));
    if (lat < 0) Nn += 10000000;
    const band = 'CDEFGHJKLMNPQRSTUVWXX'[Math.floor((lat + 80) / 8)];
    const set = ((zone - 1) % 6) + 1;
    const colL = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'][(set - 1) % 3][Math.floor(E / 100000) - 1];
    const rows = 'ABCDEFGHJKLMNPQRSTUV';
    const rowL = rows[(Math.floor(Nn / 100000) + (set % 2 === 0 ? 5 : 0)) % 20];
    const e5 = String(Math.floor(E % 100000)).padStart(5, '0'), n5 = String(Math.floor(Nn % 100000)).padStart(5, '0');
    return `${zone}${band} ${colL}${rowL} ${e5} ${n5}`;
  }
  const R = 6371000, rad = x => x * Math.PI / 180;
  function distBear(a, b) {
    const φ1 = rad(a.lat), φ2 = rad(b.lat), dφ = rad(b.lat - a.lat), dλ = rad(b.lon - a.lon);
    const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(h));
    const y = Math.sin(dλ) * Math.cos(φ2), x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
    return { d, b: (Math.atan2(y, x) * 180 / Math.PI + 360) % 360 };
  }
  const fmtD = d => d < 1000 ? Math.round(d) + ' m' : (d / 1000).toFixed(d < 10000 ? 2 : 1) + ' km';

  /* --- térkép-jelölő (offline radar) --- */
  V.map = () => {
    let pos = null, type = 'menedek', watch = null;
    const marks = () => LS.get('marks', []);
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('map', 48)}<div><h1>Térkép-jelölő</h1><div class="muted" style="font-size:18px">GPS-alapú, internet nélkül · pontok a készüléken</div></div></div>
      <canvas id="radar" width="200" height="200" aria-label="Pontok elhelyezkedése hozzád képest"></canvas>
      <div class="mt coord" id="here">Pozíció: —</div>
      <div class="row mt"><button class="btn" id="gps">${ic('pin', 20)}GPS indítása</button></div>
      <div class="rule"></div>
      <h3>Új pont a jelenlegi helyen</h3>
      <div class="types" id="types">${D.markTypes.map(t => `<button data-t="${t.id}" class="${t.id === type ? 'on' : ''}">${ic(t.icon, 18)}${t.n}</button>`).join('')}</div>
      <div class="row mt"><input type="text" id="mName" placeholder="Megnevezés (pl. forrás a patakparton)" maxlength="40"></div>
      <div class="row mt"><button class="btn green" id="addM">+ Jelölés itt</button><button class="btn ghost" id="addMan">Koordinátával…</button></div>
      <div id="manBox" class="hidden mt row"><input type="number" step="any" id="mLat" placeholder="szélesség (47.68)"><input type="number" step="any" id="mLon" placeholder="hosszúság (18.33)"><button class="btn ghost" id="addMan2">Hozzáad</button></div>
      <div class="rule"></div>
      <ul class="marks" id="marks"></ul>
      <div class="callout warn mt">${ic('warn', 26)}<div>Ellenséges környezetben a telefon jele, kijelzője és GPS-használata felderíthető. Fény- és elektronikai fegyelem!</div></div>
      </section>`;
    const cv = $('#radar'), g = cv.getContext('2d');
    function center() { if (pos) return pos; const m = marks(); if (!m.length) return null; return { lat: m.reduce((a, x) => a + x.lat, 0) / m.length, lon: m.reduce((a, x) => a + x.lon, 0) / m.length }; }
    function draw() {
      const W = 200, c = 100, night = isNight();
      g.fillStyle = night ? '#070a07' : '#10190f'; g.fillRect(0, 0, W, W);
      const ctr = center(), m = marks();
      let maxD = 200; if (ctr) m.forEach(p => { maxD = Math.max(maxD, distBear(ctr, p).d * 1.15); });
      const scale = 90 / maxD;
      g.fillStyle = night ? '#2a1a12' : '#1f3320';
      for (let x = 0; x < W; x += 20) g.fillRect(x, 0, 1, W); for (let y = 0; y < W; y += 20) g.fillRect(0, y, W, 1);
      g.strokeStyle = night ? '#6e4a33' : '#5d7f39'; g.lineWidth = 1;
      [.33, .66, 1].forEach(k => { g.beginPath(); g.arc(c, c, 90 * k, 0, Math.PI * 2); g.stroke(); });
      g.fillStyle = night ? '#d4a07c' : '#c4a574'; g.font = '8px Silkscreen, monospace'; g.textAlign = 'left';
      g.fillText(fmtD(maxD).toUpperCase(), c + 3, c - 90 + 9); g.fillText(fmtD(maxD * .33).toUpperCase(), c + 3, c - 30 + 9);
      g.fillStyle = '#ff3b30'; g.textAlign = 'center'; g.fillText('N', c, 8);
      const drawSprite = (name, x, y) => { const img = new Image(); img.onload = () => g.drawImage(img, Math.round(x - 8), Math.round(y - 8), 16, 16); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PX.svg(name).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')); };
      if (ctr) m.forEach(p => { const db = distBear(ctr, p), r = rad(db.b); drawSprite((D.markTypes.find(t => t.id === p.type) || D.markTypes[5]).icon, c + Math.sin(r) * db.d * scale, c - Math.cos(r) * db.d * scale); });
      if (pos) { g.fillStyle = '#ffd60a'; g.fillRect(c - 3, c - 3, 6, 6); g.fillStyle = '#141810'; g.fillRect(c - 1, c - 1, 2, 2); }
      else { g.fillStyle = night ? '#8e7262' : '#a99a74'; g.textAlign = 'center'; g.font = '8px Silkscreen, monospace'; g.fillText(ctr ? 'NO GPS - KOZEPPONT' : 'NO GPS', c, W - 8); }
      $('#here').innerHTML = pos ? `Pozíció: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)} ${pos.acc ? '±' + Math.round(pos.acc) + ' m' : ''}<br>MGRS: <b>${toMGRS(pos.lat, pos.lon)}</b>` : 'Pozíció: — (indítsd a GPS-t)';
      $('#marks').innerHTML = m.length ? m.map((p, i) => {
        const t = D.markTypes.find(x => x.id === p.type) || D.markTypes[5];
        const db = pos ? distBear(pos, p) : null;
        return `<li>${ic(t.icon, 28)}<div><b>${esc(p.name || t.n)}</b><br><span class="muted" style="font-size:17px">${toMGRS(p.lat, p.lon)}</span></div>
          <div class="d">${db ? fmtD(db.d) + '<br>' + Math.round(db.b) + '° ' + '' : ''}<button class="iconbtn" data-del="${i}" title="Törlés" style="margin-top:4px">${ic('skull', 16)}</button></div></li>`;
      }).join('') : '<li class="muted" style="display:block">Még nincs jelölt pont.</li>';
      main.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { if (!confirmDel(b)) return; const mm = marks(); mm.splice(+b.dataset.del, 1); LS.set('marks', mm); draw(); });
    }
    const confirmDel = b => { if (b.dataset.armed) return true; b.dataset.armed = 1; b.style.borderColor = 'var(--warn)'; toast('Koppints újra a törléshez'); setTimeout(() => { delete b.dataset.armed; b.style.borderColor = ''; }, 2500); return false; };
    function addAt(lat, lon) { const mm = marks(); mm.push({ type, name: $('#mName').value.trim(), lat, lon, t: Date.now() }); LS.set('marks', mm); $('#mName').value = ''; toast('Pont mentve'); draw(); }
    $('#types').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; type = b.dataset.t; main.querySelectorAll('#types button').forEach(x => x.classList.toggle('on', x === b)); };
    $('#gps').onclick = () => {
      if (!navigator.geolocation) return toast('Nincs helymeghatározás');
      if (watch != null) return;
      watch = navigator.geolocation.watchPosition(p => { pos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }; LS.set('lastPos', { lat: pos.lat, lon: pos.lon }); draw(); },
        err => toast(err.code === 1 ? 'Helyhozzáférés megtagadva' : 'GPS jel nem elérhető'), { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 });
      toast('GPS keresés…');
    };
    $('#addM').onclick = () => { if (!pos) return toast('Előbb indítsd a GPS-t'); addAt(pos.lat, pos.lon); };
    $('#addMan').onclick = () => $('#manBox').classList.toggle('hidden');
    $('#addMan2').onclick = () => { const la = parseFloat($('#mLat').value), lo = parseFloat($('#mLon').value); if (isNaN(la) || isNaN(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) return toast('Hibás koordináta'); addAt(la, lo); };
    draw();
    cleanup = () => { if (watch != null) navigator.geolocation.clearWatch(watch); };
  };

  /* --- telepítés / névjegy --- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; const b = $('#instBtn'); if (b) b.classList.remove('hidden'); });
  V.about = () => {
    const url = location.origin + location.pathname;
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('star', 48)}<div><h1>Telepítés</h1><div class="stencil" style="font-size:13px">OFFLINE · NO SIGNAL NEEDED</div></div></div>
      <div class="center mt"><img src="qr.svg" alt="QR-kód az app címéhez" width="220" height="220" style="image-rendering:pixelated;background:#f4f1e6;padding:8px;border:3px solid var(--khaki-d)"></div>
      <p class="center coord" style="word-break:break-all">${esc(url)}</p>
      <div class="row" style="justify-content:center"><button class="btn green ${deferred && !standalone ? '' : 'hidden'}" id="instBtn">${ic('pack', 20)}Telepítés most</button><button class="btn ghost" id="shareBtn">Link megosztása</button></div>
      ${standalone ? `<div class="callout ok mt">${ic('check', 26)}<div>Telepítve fut – a teljes tartalom offline is elérhető.</div></div>` : ''}
      <div class="rule"></div>
      <h3>Android (Chrome)</h3><ol class="sec" style="padding:0;list-style:none"><li>Olvasd be a QR-kódot vagy nyisd meg a linket.</li><li>Koppints a „Telepítés most” gombra, vagy ⋮ menü → „Alkalmazás telepítése”.</li></ol>
      <h3>iPhone (Safari)</h3><ol class="sec" style="padding:0;list-style:none"><li>Nyisd meg a linket <b>Safariban</b>.</li><li>Megosztás ⬆ → „Főképernyőhöz adás”.</li></ol>
      <div class="callout ok">${ic('check', 26)}<div>Az első megnyitás után minden fájl a telefonon tárolódik – utána repülő módban is működik.</div></div>
      <div class="rule"></div>
      <h3>Forrás és felelősség</h3>
      <p>A „TANANYAG” jelölésű részek a SERE „A” szintű e-learning tananyag alapján, összefoglalva készültek. A <span class="badge web">KIEGÉSZÍTVE</span> részek a tananyag tartalomjegyzéke szerint, nyilvános forrásokból (NATO/US PR doktrína, katonai kézikönyvek) készültek.</p>
      <p class="muted">Gyakorló segédlet – nem helyettesíti a hivatalos kiképzést és a hatályos HVKF szakutasítást.</p>
      <p class="muted" style="font-size:17px">Betűk: VT323, Pixelify Sans, Silkscreen (SIL OFL). Verzió: ${window.SERE_VERSION}</p></section>`;
    const ib = $('#instBtn'); if (ib) ib.onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; ib.classList.add('hidden'); };
    $('#shareBtn').onclick = async () => {
      try { if (navigator.share) await navigator.share({ title: 'SERE PIXEL', text: 'Offline túlélési kézikönyv', url }); else { await navigator.clipboard.writeText(url); toast('Link a vágólapon'); } } catch (e) { /* megszakítva */ }
    };
  };

  /* ---------------- router ---------------- */
  const NAV = { home: '', toc: 'toc', ch: 'toc', guides: 'guides', guide: 'guides', prio: 'home', stop: 'home', kit: 'kit', check: 'home', compass: 'map', map: 'map', about: 'home' };
  const CRUMB = { home: 'Főmenü', toc: 'Kézikönyv', ch: 'Kézikönyv', guides: 'Útmutatók', guide: 'Útmutató', prio: 'Prioritások', stop: 'S-T-O-P', kit: 'Kit-builder', check: 'Checklisták', compass: 'Iránytű', map: 'Térkép-jelölő', about: 'Telepítés' };
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const v = V[parts[0]] ? parts[0] : 'home';
    $('#crumb').textContent = CRUMB[v];
    document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.nav === (NAV[v] || 'home')));
    V[v](...parts.slice(1));
    if (v !== 'ch') window.scrollTo(0, 0);
  }
  document.querySelectorAll('.nav button').forEach(b => {
    b.innerHTML = ic(b.dataset.icon, 24) + `<span>${b.dataset.label}</span>`;
    b.onclick = () => { location.hash = '#/' + (b.dataset.nav === 'home' ? '' : b.dataset.nav); };
  });
  window.addEventListener('hashchange', route);
  applyMode();
  route();
  setInterval(() => { if (LS.get('mode', 'auto') === 'auto') applyMode(); }, 60000);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('Új verzió – újraindításkor frissül'); }); });
    }).catch(() => { }));
  }
})();
