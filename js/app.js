/* SERE PIXEL — offline túlélési kézikönyv (PWA) */
(function () {
  'use strict';
  const C = (window.I18N && I18N.lang !== 'hu' && window['SERE_CONTENT_' + I18N.lang.toUpperCase()]) || window.SERE_CONTENT, D = window.SERE_DATA, PX = window.PX;
  const $ = (s, el = document) => el.querySelector(s);
  const main = $('#main');
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('sp:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sp:' + k, JSON.stringify(v)); } catch (e) { /* tárhely nem elérhető */ } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const ic = (n, s = 32) => PX.img(n, s);
  const CH_ICON = { '1': 'book', '2': 'fire', '3': 'shelter', '4': 'water', '5': 'eye', '6': 'compass', '7': 'heli', '8': 'signal', B1: 'fire', B2: 'water', B3: 'compass', B4: 'eye', C1: 'warn', C2: 'book', C3: 'heart', C4: 'heli' };
  const LVL = { A: { n: 'ALFA', c: 'var(--blue)', risk: 'alacsony kockázat' }, B: { n: 'BRAVO', c: 'var(--acc)', risk: 'közepes kockázat' }, C: { n: 'CHARLIE', c: 'var(--warn)', risk: 'magas kockázat' } };
  const lvlOf = c => /^[BC]/.test(c.id) ? c.id[0] : 'A';
  const chName = id => /^[BC]\d/.test(id) ? (id[0] === 'B' ? 'Bravo ' : 'Charlie ') + id.slice(1) : id;
  const chNum = id => /^[BC]\d/.test(id) ? `<span style="color:${LVL[id[0]].c}">${id[0]}</span>${id.slice(1)}` : id;
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

    const meta = $('meta[name=theme-color]'); if (meta) meta.content = n ? '#070a07' : '#142414';
    if (typeof drawCover === 'function' && $('#cover')) drawCover();
  }

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
    if (night) { for (let i = 0; i < 40; i++) { g.fillStyle = rnd() > .7 ? '#d4a07c' : '#6e5a4a'; g.fillRect((rnd() * W) | 0, (rnd() * 26) | 0, 1, 1); } g.fillStyle = '#d4a07c'; g.fillRect(133, 5, 6, 8); g.fillRect(132, 6, 8, 6); g.fillStyle = P.sky; g.fillRect(136, 5, 5, 7); g.fillRect(135, 6, 6, 5); }
    const tree = (x, y, h, c, c2) => {
      for (let i = 0; i < h; i++) { const w = Math.max(1, ((i / h) * h * .42) | 0); g.fillStyle = (i % 4 === 1) ? c2 : c; g.fillRect(x - w, y - h + i, w * 2 + 1, 1); }
      g.fillStyle = '#2a1c10'; g.fillRect(x, y, 1, 3);
    };
    for (let x = -4; x < W + 6; x += 6) tree(x + ((rnd() * 4) | 0), 34 + ((rnd() * 4) | 0), 18 + ((rnd() * 8) | 0), P.far, P.mid);
    g.fillStyle = P.far; g.fillRect(0, 34, W, H);
    // tisztás
    for (let y = 56; y < 90; y++) {
      const t = (y - 74) / 18, half = Math.sqrt(Math.max(0, 1 - t * t)) * 70;
      for (let x = (80 - half) | 0; x < 80 + half; x++) { g.fillStyle = rnd() > .82 ? P.clear2 : (rnd() > .9 ? P.lite : P.clear); g.fillRect(x, y, 1, 1); }
    }
    for (let i = 0; i < 90; i++) { g.fillStyle = rnd() > .5 ? P.mid : P.near; g.fillRect((rnd() * W) | 0, 36 + ((rnd() * 54) | 0), 1, 1); }
    const Z = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w * 2, h * 2); };
    // ösvény a fák felé
    g.fillStyle = night ? '#2a1e14' : '#7a6a3e'; for (let i = 0; i < 20; i++) g.fillRect(80 + Math.round(Math.sin(i / 3) * 3), 58 - i, 3, 1);
    // ponyvamenedék (A-típus) balra, 2× lépték
    const sh = night ? ['#1c2a17', '#24361e'] : ['#4f6b2e', '#7d9a45'];
    const bx = 40, by = 64;
    for (let i = 0; i < 9; i++) { Z(bx - i * 2, by + i * 2, i + 1, 1, sh[0]); Z(bx + 2, by + i * 2, i + 1, 1, sh[1]); }
    for (let i = 3; i < 9; i++) { const w = Math.floor(i / 3); Z(bx - w * 2, by + i * 2, w * 2 + 1, 1, '#0b0f09'); }
    Z(bx, by - 4, 1, 2, '#2a1c10');
    // tábortűz jobbra + füst, 2× lépték
    const fx = 118, fy = 80;
    Z(fx - 8, fy, 9, 1, '#3a2a1c');
    [[-10, 0], [10, 0], [-8, 2], [8, 2]].forEach(([x, y]) => Z(fx + x, fy + y, 1, 1, '#6b6b60'));
    const fl = night ? ['#ff4a2a', '#ff9500', '#ffd60a'] : ['#ff9500', '#ffd60a', '#fff3b0'];
    Z(fx - 4, fy - 8, 5, 4, fl[0]); Z(fx - 2, fy - 12, 3, 2, fl[0]); Z(fx, fy - 16, 1, 2, fl[0]);
    Z(fx - 2, fy - 6, 3, 3, fl[1]); Z(fx, fy - 10, 1, 2, fl[1]); Z(fx, fy - 4, 1, 2, fl[2]);
    if (night) { g.fillStyle = 'rgba(255,90,40,.09)'; for (let r = 26; r > 6; r -= 5) g.fillRect(fx - r, fy - r / 2, r * 2, r); }
    g.fillStyle = night ? 'rgba(120,100,90,.35)' : 'rgba(210,210,200,.45)';
    [[0, -20], [2, -24], [0, -28], [-2, -32], [-2, -36], [0, -40], [2, -44]].forEach(([x, y], i) => g.fillRect(fx + x, fy + y, 3 + (i > 3 ? 1 : 0), 3));
    // a magányos szárazföldi katona (hátulról, az erdőt figyeli) — fő motívum, 2× lépték
    const SOL = [
      '......KKKK......', '.....KHHHHK.....', '....KHHHHHhK....', '...KHHHHHHHhKR..', '...KhhhhhhhhKR..',
      '....KKSSSSKK.R..', '...KUUKKKKUUKR..', '..KUKPPPPPPKUKR.', '..KUKPPPPPPKUKR.', '..KUKppppppKUKR.',
      '..KUKPPPPPPKUK..', '..KUKPPPPPPKUK..', '..KSKPPPPPPKSK..', '...KKpppppKK....', '....KUUUUUUK....',
      '....KUUuUUUK....', '....KUUKKUUK....', '....KUUKKUUK....', '....KuuKKuuK....', '....KUUKKUUK....',
      '....KBBKKBBK....', '...KBBBKKBBBK...', '...KKKK..KKKK...'];
    const SP = night
      ? { K: '#050705', H: '#2c3a24', h: '#1c2618', S: '#6e4a33', U: '#2a3820', u: '#1d2817', P: '#3a2f22', p: '#2a2118', B: '#120d08', R: '#0a0a0a' }
      : { K: '#141810', H: '#5d6b3a', h: '#43502a', S: '#c99a72', U: '#5d6b3a', u: '#43502a', P: '#6b5a3a', p: '#4f4229', B: '#2a2218', R: '#1c1c1c' };
    const sx = 64, sy = 40;
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(sx + 4, sy + 45, 26, 3);
    SOL.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = row[x]; if (c !== '.') Z(sx + x * 2, sy + y * 2, 1, 1, SP[c]); } });
    // előtér fák
    for (let x = -2; x < W; x += 9) { if (x > 14 && x < 142) continue; tree(x + ((rnd() * 3) | 0), 92, 30 + ((rnd() * 10) | 0), P.near, P.lite); }
    // iránytű jelvény
    const cx = 15, cy = 15;
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
    const p = prof();
    const done = C.filter(c => (cres()[c.id] || {}).best >= 70).length;
    main.innerHTML = `<div class="hm">
      <div class="hm-hero"><canvas id="cover" width="160" height="90" aria-label="Egyedül álló katona az erdőszélen"></canvas>
        <div class="hm-chips">
          ${p ? `<a class="hm-chip" href="#/who/tips">${ic(p.icon, 24)}<span>${esc(p.n)}</span><b>›</b></a>`
              : `<a class="hm-chip cta" href="#/who">${ic('star', 24)}<span>KI VAGY?</span><b>›</b></a>`}
          <button class="hm-chip lang" id="langBtn" aria-label="Nyelv">${flag(I18N.lang)}<span data-notr>${I18N.LANGS[I18N.lang].flag}</span></button>
        </div>
        <div class="hm-tag" data-fit><b>OFFLINE</b> TÚLÉLÉSI KÉZIKÖNYV</div>
      </div>
      <div class="hm-act">
        <a class="hm-sos" href="#/sos">${ic('warn', 40)}<span class="hm-st"><span data-fit>BAJBAN VAGYOK</span><small data-fit>lépésről lépésre</small></span><b>›</b></a>
        <a class="hm-kid" href="#/kid">${ic('heart', 34)}<span data-fit="2">GYEREK<br>MÓD</span></a>
      </div>
      <div class="hm-side">
        <div class="hm-lbl">Mi történt?</div>
        <div class="hm-scen">${scenList().map(x => `<a class="hm-t" href="#/sos/${x.id}" style="--c:${x.c}"><i>${ic(x.icon, 30)}</i><span data-fit="2">${esc(x.t)}</span></a>`).join('')}</div>
        <nav class="hm-dock">
          <a href="#/course">${ic('star', 26)}<span data-fit>Tanfolyam</span>${done ? `<em>${done}/${C.length}</em>` : ''}</a>
          <a href="#/toc">${ic('book', 26)}<span data-fit>Kézikönyv</span></a>
          <a href="#/guides">${ic('fire', 26)}<span data-fit>Kártyák</span></a>
          <a href="#/compass">${ic('compass', 26)}<span data-fit>Iránytű</span></a>
          <a href="#/map">${ic('map', 26)}<span data-fit>Térkép</span></a>
        </nav>
      </div>
    </div>`;
    drawCover();
    const hero = $('.hm-hero');
    const fitHero = () => { if (!hero || !hero.isConnected) return; hero.classList.remove('flat', 'short'); const hh = hero.getBoundingClientRect().height; hero.classList.toggle('flat', hh < 100); hero.classList.toggle('short', hh < 170); };
    requestAnimationFrame(() => { fitHero(); requestAnimationFrame(() => fitText()); }); const onRs = () => { fitHero(); fitText(); }; window.addEventListener('resize', onRs); cleanup = () => window.removeEventListener('resize', onRs);
    $('#langBtn').onclick = () => langModal(null, true);
  };
  V.status = () => {
    const a = statAdvice();
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('heart', 48)}<div><h1>Állapotom</h1><div class="muted">Koppints a sávokra – a tanács ehhez igazodik.</div></div></div>
        <div class="rule"></div><div class="stats">${statsHTML()}</div>
        <div class="callout ok mt" style="margin-bottom:0">${ic(a.low.icon, 26)}<div>${esc(a.txt)} <a href="#/guide/${a.low.g}">Kártya ›</a></div></div></section>`;
    main.querySelectorAll('.bar').forEach(bar => {
      bar.addEventListener('click', e => {
        const r = bar.getBoundingClientRect(); const val = Math.max(0, Math.min(10, Math.ceil(((e.clientX - r.left) / r.width) * 10)));
        const v = LS.get('stats', { viz: 8, eh: 7, en: 6, mor: 9 }); v[bar.dataset.bar] = val; LS.set('stats', v); V.status();
      });
    });
  };
  const row = (href, icon, t, s) => `<a class="brow" href="${href}">${ic(icon, 40)}<span>${t}<small>${s}</small></span><b>›</b></a>`;


  /* ---------------- személyre szabás ---------------- */
  const who = () => LS.get('who', null);
  const prof = () => { const w = who(); return D.profiles.find(p => p.id === (w && w.p)) || null; };
  const isMil = () => { const w = who(), p = prof(); return !p || p.mil || (w && w.lvl === 'katonai'); };
  function scen(id) {
    const base = D.scenarios.find(z => z.id === id); if (!base) return null;
    const civ = !isMil() && D.civil[id];
    const x = Object.assign({}, base, civ ? { t: civ.t, sub: civ.sub, steps: civ.steps, ch: null } : {});
    const p = prof(), w = who() || {};
    x.extra = [].concat((p && p.add[id]) || [], (w.fem && D.female.add[id]) || []);
    return x;
  }
  const scenList = () => D.scenarios.map(z => scen(z.id));
  function kitItems() {
    const p = prof(), w = who() || {};
    const ex = [].concat((p && p.kit) || [], (w.fem && D.female.kit) || []).map(([id, n, icon, c, g]) => ({ id, n, icon, r: 'own', c, g }));
    return D.kit.concat(ex);
  }
  function whoCard() {
    const p = prof(), w = who();
    if (!p) return `<a class="whocta" href="#/who">${ic('star', 44)}<span>KI VAGY?<small>Válaszd ki a helyzeted – a tanácsok hozzád igazodnak (katona, szülő gyerekkel, városi, vidéki…)</small></span><b>›</b></a>`;
    const lv = D.levels.find(l => l.id === w.lvl);
    return `<section class="card whoc"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div class="row" style="flex-wrap:nowrap">${ic(p.icon, 40)}<div><div class="stencil" style="font-size:14px">NEKED SZÓL</div><h3 style="margin:0">${esc(p.n)}</h3><div class="muted" style="font-size:19px">${lv ? esc(lv.n) : ''}${w.fem ? ' · női tippek' : ''}</div></div></div><a class="btn ghost" href="#/who" style="padding:6px 10px">Csere</a></div>
      <div class="rule"></div><ul class="wtips">${p.tips.slice(0, 3).map(t => `<li>${esc(t)}</li>`).join('')}</ul><a href="#/who/tips" style="font-size:20px">Összes tanács ›</a></section>`;
  }
  V.who = (sub, focusK) => {
    const w = who() || { p: null, lvl: 'kezdo', fem: false }, p = prof();
    if (sub === 'tips' && p) {
      main.innerHTML = `<section class="card frame"><div class="ch-head">${ic(p.icon, 52)}<div><h1>${esc(p.n)}</h1><div class="muted">${esc(p.sub)}</div></div></div><div class="rule"></div>
        <div class="callout quote">${ic('star', 26)}<div>${esc(p.intro)}</div></div>
        <ul class="wtips big">${p.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${w.fem ? `<h3 class="mt">Nőknek</h3><ul class="wtips big">${D.female.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${!isMil() ? `<div class="callout warn">${ic('warn', 26)}<div><b>Segélyhívó: 112</b> – ingyenes, térerő nélkül más hálózaton is próbálkozik.</div></div>` : ''}
        </section><div class="row"><a class="btn" href="#/sos">Bajban vagyok ›</a><a class="btn ghost" href="#/kit">Mi legyen nálam ›</a><a class="btn ghost" href="#/who">Csere</a></div>`;
      return;
    }
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('star', 52)}<div><h1>Ki vagy?</h1><div class="muted">A forgatókönyvek, a csomaglista és a tanácsok ehhez igazodnak.</div></div></div></section>
      <h2 class="hh">1. A helyzeted</h2>
      <div class="scen">${D.profiles.map(x => `<button class="sbtn ${w.p === x.id ? 'sel' : ''}" data-p="${x.id}" style="--c:${w.p === x.id ? 'var(--acc)' : 'var(--khaki-d)'}">${ic(x.icon, 40)}<span>${esc(x.n)}<small>${esc(x.sub)}</small></span></button>`).join('')}</div>
      <h2 class="hh">2. Tapasztalat</h2>
      <div class="biglist">${D.levels.map(l => `<button class="brow ${w.lvl === l.id ? 'sel' : ''}" data-l="${l.id}">${ic(l.id === 'katonai' ? 'pack' : l.id === 'halado' ? 'compass' : 'book', 36)}<span>${esc(l.n)}<small>${esc(l.x)}</small></span><b>${w.lvl === l.id ? '✓' : ''}</b></button>`).join('')}</div>
      <h2 class="hh">3. Kiegészítés</h2>
      <button class="chk ${w.fem ? 'on' : ''}" id="fem" style="font-size:24px"><span class="box"></span><span>Női tippek is (menstruáció, higiénia, egyedül utazás)</span></button>
      <div class="row mt"><button class="btn green" id="whoOk" ${w.p ? '' : 'disabled'}>${ic('check', 24)} Kész</button></div>`;
    const save = (k, v) => { const n = Object.assign({ p: null, lvl: 'kezdo', fem: false }, who()); n[k] = v; LS.set('who', n); V.who(null, k); };
    if (focusK === 'p') centerOn(main.querySelectorAll('.hh')[1]);
    else if (focusK === 'lvl' || focusK === 'fem') centerOn($('#whoOk'));
    main.querySelectorAll('[data-p]').forEach(b => b.onclick = () => save('p', b.dataset.p));
    main.querySelectorAll('[data-l]').forEach(b => b.onclick = () => save('lvl', b.dataset.l));
    $('#fem').onclick = () => save('fem', !w.fem);
    $('#whoOk').onclick = () => { location.hash = '#/who/tips'; };
  };



  /* képernyő közepére igazítás: a következő utasítás / kérdés mindig látható legyen */
  // feliratok beférnek a dobozba: ha kilóg (pl. a telefon nagyított betűmérete miatt), a betűméretet csökkenti
  function fitText(root) {
    (root || document).querySelectorAll('[data-fit]').forEach(el => {
      el.style.fontSize = ''; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      const two = el.dataset.fit === '2', over = () => el.scrollWidth > el.clientWidth + 1 || (two && el.scrollHeight > el.clientHeight + 2);
      while (over() && fs > 9 && n++ < 30) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
  }
  function centerOn(el) { if (!el) return; requestAnimationFrame(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' })); }
  const nextOpen = sel => [...main.querySelectorAll(sel)].find(e => !e.classList.contains('on'));

  /* ---------------- felolvasás ---------------- */
  function readBtn(id) { return window.SERESpeak && SERESpeak.ok ? `<button class="btn readbtn" data-read="${id}">${ic('speak', 24)}<span>FELOLVASÁS</span></button>` : ''; }
  function bindRead(getTexts) {
    main.querySelectorAll('[data-read]').forEach(b => b.onclick = () => {
      if (SERESpeak.speaking) { SERESpeak.stop(); b.classList.remove('on'); b.querySelector('span').textContent = 'FELOLVASÁS'; return; }
      const t = getTexts(b.dataset.read); if (!t || !t.length) return;
      if (window.SEREMusic && SEREMusic.on) SEREMusic.stop();
      SERESpeak.onEnd = () => { b.classList.remove('on'); b.querySelector('span').textContent = 'FELOLVASÁS'; };
      SERESpeak.speak(t); b.classList.add('on'); b.querySelector('span').textContent = 'ÁLLJ';
      if (!SERESpeak.hasHu) toast('Nincs magyar hang a telefonon – Beállítások › Szövegfelolvasás');
    });
  }

  /* ---------------- GYEREK MÓD ---------------- */
  function kid112() {
    main.querySelectorAll('.kid112').forEach(a => a.onclick = e => {
      if (!SERESpeak.ok) return;
      e.preventDefault(); SERESpeak.speak('Hívom a száztizenkettőt. Mondd el, hol vagy és mi történt.');
      setTimeout(() => { location.href = 'tel:112'; }, 1800);
    });
  }
  const KIDASK = { eltevedtem: 'Eltévedtél, és nem tudod, hol vagy? Ez a fa és a kérdőjel.', felek: 'Félsz? Ez a szomorú arc.', serult: 'Megsérültél, fáj valamid, vérzel? Ez a ragtapaszos láb.', fazom: 'Fázol? Ez a hópehely.', szomjas: 'Szomjas vagy? Ez a pohár.', nincstelefon: 'Nincs telefonod, vagy nem működik? Ez az áthúzott telefon.', szulo: 'Nem találod anyát vagy apát? Ez a gyerek a kérdőjellel.' };
  V.kid = (id) => {
    document.body.classList.add('kidmode');
    if (!id) {
      main.innerHTML = `<div class="kidfit"><section class="kidhead"><div><div class="kidt" data-fit>SEGÍTEK!</div><div class="kids" data-fit>Koppints arra, ami történt.</div></div>
          <button class="kidtour" id="kTour" aria-label="Mondd el újra">${ic('speak', 40)}<span>MONDD EL!</span></button></section>
        <div class="kidgrid">${D.kid.map(k => `<a class="kidbtn" href="#/kid/${k.id}" data-k="${k.id}" style="--c:${k.c}">${ic(k.icon, 84)}<span data-fit>${esc(k.t)}</span></a>`).join('')}</div>
        <a class="kid112" href="tel:112">${ic('phone', 56)}<span>HÍVD: 112<small>Segítség telefonon</small></span></a>
        <button class="kidexit" id="kidExit">Kilépés a gyerek módból (tartsd nyomva)</button></div>`;
      requestAnimationFrame(() => fitText(main));
      // olvasni nem tudó gyereknek: hangos körbevezetés (minden gombnál kiemelés), és két koppintás – az első csak felolvassa, mi ez
      const btns = [...main.querySelectorAll('.kidbtn')], k112 = main.querySelector('.kid112');
      const mark = el => { main.querySelectorAll('.talk').forEach(x => x.classList.remove('talk')); if (el) { el.classList.add('talk'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } };
      let tourId = 0;
      const tour = () => {
        if (!SERESpeak.ok) return; const my = ++tourId;
        const L = ['Segítek! Mondom, mit tudsz megnyomni.'].concat(D.kid.map(k => KIDASK[k.id] || k.t + '?'), ['Ha nagy a baj, nyomd meg a piros telefont.', 'Mi történt? Nyomd meg a képet!']);
        SERESpeak.speak(L, { rate: 0.9, pitch: 1.1, onItem: i => my === tourId && mark(i >= 1 && i <= btns.length ? btns[i - 1] : i === btns.length + 1 ? k112 : null), onDone: () => my === tourId && mark(null) });
      };
      $('#kTour').onclick = e => { e.stopPropagation(); tour(); };
      // ha baj van, nem kell végighallgatni: bármilyen érintés azonnal leállítja a körbevezetést
      main.querySelector('.kidfit').addEventListener('pointerdown', e => { if (e.target.closest('#kTour')) return; if (tourId && SERESpeak.speaking) { tourId++; SERESpeak.stop(); mark(null); } }, true);
      if (kidSaid) kidSaid = false; else setTimeout(tour, 350);
      let armed = null, armT = null;
      btns.forEach(a => a.addEventListener('click', e => {
        const k = D.kid.find(x => x.id === a.dataset.k);
        if (!k || !SERESpeak.ok) return;
        if (armed !== a) {
          e.preventDefault(); tourId++; armed = a; clearTimeout(armT); armT = setTimeout(() => { armed = null; mark(null); }, 9000);
          mark(a); SERESpeak.speak([k.t + '.', 'Ha ez a baj, nyomd meg még egyszer!'], { rate: 0.9, pitch: 1.1 });
          return;
        }
        armed = null; clearTimeout(armT); kidSaid = true; SERESpeak.speak([k.t + '.', k.say[0]], { rate: 0.88, pitch: 1.1 });
      }));
      const ex = $('#kidExit'); let t = null;
      kid112(); ex.addEventListener('click', () => SERESpeak.ok && SERESpeak.speak('Tartsd nyomva a kilépéshez.'));
      // nyomva tartás: a böngésző saját hosszú-nyomás menüjét (kijelölés, „mentés”, nagyító) letiltjuk
      const start = e => { if (e.cancelable) e.preventDefault(); if (t) return; ex.classList.add('hold'); t = setTimeout(() => { t = null; LS.set('kid', false); document.body.classList.remove('kidmode'); SERESpeak.stop(); location.hash = '#/'; }, 1500); };
      const end = () => { clearTimeout(t); t = null; ex.classList.remove('hold'); };
      ex.addEventListener('touchstart', start, { passive: false });
      ['touchend', 'touchcancel'].forEach(e => ex.addEventListener(e, end));
      ex.addEventListener('mousedown', start); ['mouseup', 'mouseleave'].forEach(e => ex.addEventListener(e, end));
      ex.addEventListener('contextmenu', e => e.preventDefault());
      return;
    }
    const k = D.kid.find(x => x.id === id); if (!k) return V.kid();
    let i = 0;
    const show = () => {
      main.innerHTML = `<section class="kidcard" style="--c:${k.c}">
        <div class="kidtop">${ic(k.icon, 56)}<span>${esc(k.t)}</span></div>
        <div class="kidpic">${ic(k.pics[i % k.pics.length], 150)}</div>
        ${k.breathe ? '<div class="breath"></div>' : ''}
        <div class="kidsay">${esc(k.say[i])}</div>
        <div class="kidsteps">${k.say.map((_, j) => `<button class="${j === i ? 'on' : j < i ? 'done' : ''}" data-j="${j}" data-notr>${j + 1}</button>`).join('')}</div>
        <div class="kidnav"><button class="kidnb" id="kPrev" ${i ? '' : 'disabled'}>‹</button><button class="kidnb big" id="kRep">${ic('speak', 48)}</button><button class="kidnb" id="kNext">${i < k.say.length - 1 ? '›' : '✓'}</button></div>
        </section>
        <a class="kid112" href="tel:112">${ic('phone', 48)}<span>HÍVD: 112</span></a>
        <a class="kidback" href="#/kid">${ic('star', 30)}<span>Másik baj van</span></a>`;
      if (kidSaid) kidSaid = false; else SERESpeak.ok && SERESpeak.speak(k.say[i], { rate: 0.88, pitch: 1.1 });
      $('#kPrev').onclick = () => { if (i) { i--; show(); } else SERESpeak.speak('Ez az első lépés.'); };
      $('#kNext').onclick = () => { if (i < k.say.length - 1) { i++; show(); } else { kidSaid = true; SERESpeak.speak(['Ügyes vagy! Visszamegyünk.', 'Segítek! Koppints arra, ami történt.']); location.hash = '#/kid'; } };
      main.querySelector('.kidback').addEventListener('click', () => { kidSaid = true; SERESpeak.speak(['Vissza.', 'Segítek! Koppints arra, ami történt.']); });
      main.querySelector('.kidpic').onclick = () => SERESpeak.speak(k.say[i], { rate: 0.88, pitch: 1.1 });
      main.querySelector('.kidsay').onclick = () => SERESpeak.speak(k.say[i], { rate: 0.88, pitch: 1.1 });
      kid112();
      $('#kRep').onclick = () => SERESpeak.speak(k.say[i], { rate: 0.88, pitch: 1.1 });
      // ugrás bármelyik lépésre (nem kell végighallgatni), és lapozás húzással
      main.querySelectorAll('.kidsteps button').forEach(b => b.onclick = () => { i = +b.dataset.j; show(); });
      const card = main.querySelector('.kidcard'); let x0 = null;
      card.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      card.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (dx < -60 && i < k.say.length - 1) { i++; show(); } else if (dx > 60 && i > 0) { i--; show(); } }, { passive: true });
    };
    show();
  };


  /* ---------------- TANFOLYAM ---------------- */
  const QZ = window.SERE_QUIZ || {};
  const cres = () => LS.get('course', {});
  function chProgress(ch) { const seen = seenAll(); return Math.round(ch.sections.filter(s => seen[s.id]).length / ch.sections.length * 100); }
  V.course = (lv) => {
    lv = LVL[lv] ? lv : (LS.get('courseLvl', 'A'));
    LS.set('courseLvl', lv);
    const r = cres(), L = LVL[lv], CL = C.filter(c => lvlOf(c) === lv);
    const passedOf = l => C.filter(c => lvlOf(c) === l && r[c.id] && r[c.id].best >= 70).length;
    const passed = passedOf(lv), all = passed === CL.length;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('book', 52)}<div><h1>Tanfolyam</h1><div class="muted">SERE gyakorló kurzus · fejezetenként lecke + vizsga (70%)</div></div></div>
      <div class="lvtabs">${Object.entries(LVL).map(([k, v]) => { const n = C.filter(c => lvlOf(c) === k).length, p = passedOf(k); return `<a class="lvtab ${k === lv ? 'on' : ''}" href="#/course/${k}" style="--c:${v.c}"><b data-notr>${k}</b><span data-notr>${v.n}</span><small>${p}/${n}</small></a>`; }).join('')}</div>
      <div class="muted mt" style="font-size:19px"><b style="color:${L.c}" data-notr>SERE „${lv}”</b> · <span>${L.risk}</span> · <span>${lv === 'A' ? 'a feltöltött tananyag alapján' : 'nyilvános NATO-tagállami kézikönyvek alapján (ATP 3-50.21, AFH 10-644, FM 21-76-1)'}</span></div>
      <div class="progress">${CL.map(c => `<i class="${r[c.id] && r[c.id].best >= 70 ? 'f' : ''}"></i>`).join('')}</div>
      <div class="statusline"><span>TELJESÍTVE: ${passed}/${CL.length}</span><span class="st ${all ? 'ok' : ''}">${all ? 'KÉSZ ✓' : 'FOLYAMATBAN'}</span></div></section>
      ${all ? `<a class="sosbtn" href="#/cert/${lv}" style="background:var(--ok);border-color:#14532d;color:#08140a;margin-bottom:12px;animation:none">${ic('star', 44)}<span>OKLEVÉL<small>a gyakorló kurzus teljesítve</small></span></a>` : ''}
      ${CL.map((c, i) => { const res = r[c.id], pr = chProgress(c), ok = res && res.best >= 70, locked = i > 0 && !(r[CL[i - 1].id] && r[CL[i - 1].id].best >= 70) && !LS.get('courseFree', false);
        return `<section class="card lesson ${ok ? 'ok' : ''} ${locked ? 'lock' : ''}"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${ic(CH_ICON[c.id] || 'book', 40)}<div style="flex:1;min-width:0">
          <h3 style="margin:0"><span class="lvp" style="color:${LVL[lvlOf(c)].c}" data-notr>${chName(c.id)}.</span> ${esc(c.title)}</h3><div class="muted" style="font-size:19px">Olvasva: ${pr}% · ${res ? 'Legjobb: ' + res.best + '%' : 'Vizsga: még nincs'} ${ok ? '· <span style="color:var(--ok)">✓ TELJESÍTVE</span>' : ''}</div>
          <div class="bar mt" style="--c:${L.c};height:10px">${Array.from({ length: 10 }, (_, j) => `<i class="${j < pr / 10 ? 'f' : ''}"></i>`).join('')}</div></div></div>
          ${locked ? `<div class="muted mt" style="font-size:20px">🔒 Előbb teljesítsd a ${chName(CL[i - 1].id)}. fejezet vizsgáját.</div>` : `<div class="row mt"><a class="btn ghost" href="#/ch/${c.id}">${ic('book', 20)}Tanulás</a><a class="btn ghost" href="#/ch/${c.id}" data-autoread="1">${ic('speak', 20)}Hallgatás</a>${QZ[c.id] ? `<a class="btn ${ok ? 'ghost' : ''}" href="#/exam/${c.id}">${ic('check', 20)}Vizsga</a>` : ''}</div>`}</section>`; }).join('')}
      <button class="chk ${LS.get('courseFree', false) ? 'on' : ''}" id="free" style="font-size:21px"><span class="box"></span><span style="text-decoration:none;color:var(--ink)">Szabad sorrend (zárolás nélkül)</span></button>
      <p class="muted" style="font-size:18px">${lv === 'A' ? 'Gyakorló kurzus – nem helyettesíti a hivatalos SERE „A” e-learning vizsgát.' : 'Nem hivatalos NATO SERE képzés: nyilvános források alapján készült elméleti felkészítő. A „B” és „C” szint lényege a gyakorlati kiképzés minősített oktatókkal.'}</p>`;
    main.querySelectorAll('[data-autoread]').forEach(a => a.addEventListener('click', () => { window.__autoRead = true; }));
    $('#free').onclick = () => { LS.set('courseFree', !LS.get('courseFree', false)); V.course(lv); };
  };
  V.exam = (id) => {
    const ch = C.find(c => c.id === id), bank = QZ[id]; if (!ch || !bank) return V.course();
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const qs = shuffle(bank).slice(0, 10).map(q => ({ q: q[0], good: q[1], opts: shuffle(q.slice(1)) }));
    let i = 0, score = 0, picked = null;
    const show = () => {
      if (i >= qs.length) {
        const pct = Math.round(score / qs.length * 100), ok = pct >= 70, r = cres(), prev = r[id] || { best: 0, tries: 0 };
        r[id] = { best: Math.max(prev.best, pct), tries: prev.tries + 1, last: pct }; LS.set('course', r);
        const lv = lvlOf(ch), next = C.filter(c => lvlOf(c) === lv)[C.filter(c => lvlOf(c) === lv).findIndex(c => c.id === id) + 1];
        main.innerHTML = `<section class="card frame center" style="border-color:${ok ? 'var(--ok)' : 'var(--warn)'}">${ic(ok ? 'star' : 'warn', 80)}
          <h1 style="font-size:40px">${pct}%</h1><h2 style="color:${ok ? 'var(--ok)' : 'var(--warn)'}">${ok ? 'SIKERES VIZSGA!' : 'Még nem sikerült'}</h2>
          <p>${score}/${qs.length} jó válasz · a küszöb 70%</p>
          ${ok ? '' : `<p class="muted">Olvasd át újra a fejezetet, és próbáld meg ismét.</p>`}
          <div class="row" style="justify-content:center">${ok && next ? `<a class="btn green" href="#/ch/${next.id}">Következő: ${chName(next.id)}. fejezet ›</a>` : ''}<a class="btn ${ok ? 'ghost' : ''}" href="#/exam/${id}">Újra</a><a class="btn ghost" href="#/course/${lv}">Tanfolyam</a></div></section>`;
        return;
      }
      const q = qs[i];
      main.innerHTML = `<section class="card frame"><div class="statusline"><span>${chName(ch.id)}. FEJEZET · VIZSGA</span><span>${i + 1}/${qs.length}</span></div>
        <div class="progress">${qs.map((_, j) => `<i class="${j < i ? 'f' : ''}"></i>`).join('')}</div>
        <h2 style="font-size:28px;margin:10px 0 14px">${esc(q.q)}</h2>
        <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}"><span class="ol" data-notr>${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
        <div id="fb"></div>${readBtn('q')}</section>`;
      bindRead(() => [q.q].concat(q.opts.map((o, j) => 'ABCD'[j] + ': ' + o)));
      main.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (picked !== null) return; picked = +b.dataset.j; const right = q.opts[picked] === q.good; if (right) score++;
        main.querySelectorAll('.opt').forEach(x => { const o = q.opts[+x.dataset.j]; if (o === q.good) x.classList.add('good'); else if (x === b) x.classList.add('bad'); x.disabled = true; });
        $('#fb').innerHTML = `<div class="callout ${right ? 'ok' : 'warn'} mt">${ic(right ? 'check' : 'warn', 26)}<div><b>${right ? 'Helyes!' : 'Nem jó.'}</b> ${right ? '' : '<span>A helyes válasz:</span> <span>' + esc(q.good) + '</span>'}</div></div>
          <button class="btn ${right ? 'green' : ''}" id="nx" style="width:100%;justify-content:center;font-size:22px">${i < qs.length - 1 ? 'Következő kérdés ›' : 'Eredmény ›'}</button>`;
        $('#nx').onclick = () => { i++; picked = null; show(); window.scrollTo(0, 0); };
        centerOn($('#nx'));
      });
    };
    show();
  };
  V.cert = (lv) => {
    lv = LVL[lv] ? lv : 'A'; const n = C.filter(c => lvlOf(c) === lv).length;
    const w = LS.get('certName', '');
    main.innerHTML = `<section class="card frame center cert">${ic('star', 72)}<div class="stencil" style="font-size:18px">SERE PIXEL · GYAKORLÓ KURZUS</div>
      <h1 style="font-size:34px">OKLEVÉL</h1><p>Igazoljuk, hogy</p>
      <input type="text" id="cn" value="${esc(w)}" placeholder="Írd ide a neved" style="text-align:center;font-size:28px">
      <p>sikeresen teljesítette a <b data-notr>SERE „${lv}”</b> (${LVL[lv].n}) szint ${n} fejezetének gyakorló vizsgáit.</p>
      <p class="muted" style="font-size:19px">${new Date().toLocaleDateString(I18N.loc)} · nem hivatalos igazolás</p></section>
      <div class="row"><a class="btn ghost" href="#/course/${lv}">‹ Tanfolyam</a></div>`;
    $('#cn').oninput = e => LS.set('certName', e.target.value);
  };

  /* --- BAJBAN VAGYOK: forgatókönyvek --- */
  const GLINK = { stop: '#/stop', map: '#/map', compass: '#/compass' };
  V.sos = (id, focus) => {
    if (!id) {
      main.innerHTML = `<div class="fitpg"><section class="card frame sosh" style="border-color:var(--warn)"><div class="ch-head">${ic('warn', 44)}<div><h1>Bajban vagyok</h1><div class="muted">Először: <b>állj meg, lélegezz.</b> Aztán válaszd ki, mi történt.</div></div></div></section>
        <a class="hm-sos" href="#/stop">${ic('stop', 40)}<span class="hm-st"><span data-fit>S-T-O-P</span><small data-fit>Állj meg · Gondolkodj · Figyelj · Tervezz</small></span><b>›</b></a>
        <div class="hm-scen grow">${scenList().map(x => `<a class="hm-t" href="#/sos/${x.id}" style="--c:${x.c}"><i>${ic(x.icon, 30)}</i><span class="tt"><span data-fit="2">${esc(x.t)}</span><small data-fit>${esc(x.sub)}</small></span></a>`).join('')}</div></div>`;
      requestAnimationFrame(() => fitText(main));
      return;
    }
    const x = scen(id); if (!x) return V.sos();
    const st = LS.get('sos', {}); const done = x.steps.filter((_, i) => st[id + i]).length;
    main.innerHTML = `<section class="card frame" style="border-color:${x.c}"><div class="ch-head">${ic(x.icon, 52)}<div><h1>${esc(x.t)}</h1><div class="muted">${done}/${x.steps.length} lépés kész</div></div></div>
      <div class="progress">${x.steps.map((_, i) => `<i class="${st[id + i] ? 'f' : ''}"></i>`).join('')}</div>
      ${readBtn('sos')}
      <ol class="sosl">${x.steps.map(([t, g], i) => `<li class="${st[id + i] ? 'on' : ''}"><button class="sosck" data-i="${i}"><span class="no">${i + 1}</span><span class="tx">${esc(t)}</span><span class="box"></span></button>
        ${g ? `<a class="golink" href="${GLINK[g] || '#/guide/' + g}">${ic(g === 'map' ? 'map' : g === 'compass' ? 'compass' : g === 'stop' ? 'stop' : (D.guides.find(q => q.id === g) || {}).icon || 'book', 22)} ${GLINK[g] ? 'Megnyitás' : 'Kártya'} ›</a>` : ''}</li>`).join('')}</ol>
      ${x.extra.length ? `<h3 class="mt" style="display:flex;gap:8px;align-items:center">${ic((prof() || {}).icon || 'star', 26)} Neked külön${prof() ? ': ' + esc(prof().n) : ''}</h3>
        <ol class="sosl">${x.extra.map((t, i) => `<li class="${st[id + 'p' + i] ? 'on' : ''}"><button class="sosck" data-i="p${i}"><span class="no" style="background:var(--acc)">+</span><span class="tx">${esc(t)}</span><span class="box"></span></button></li>`).join('')}</ol>` : (prof() ? '' : `<a class="golink" href="#/who" style="margin-left:0">${ic('star', 20)} Állítsd be, ki vagy – személyre szabott lépések ›</a>`)}
      ${!isMil() ? `<div class="callout warn mt">${ic('warn', 26)}<div><b>Ha bizonytalan vagy vagy romlik a helyzet: 112.</b></div></div>` : ''}
      ${x.ch ? `<a class="btn ghost mt" href="#/ch/${x.ch}">Részletesen: ${x.ch}. fejezet ›</a>` : ''}
      </section>
      <div class="row"><a class="btn ghost" href="#/sos">‹ Másik helyzet</a><button class="btn ghost" id="sosReset">Újrakezdés</button></div>`;
    bindRead(() => [x.t + '.'].concat(x.steps.map(([t], i) => (i + 1) + '. ' + t), x.extra.length ? ['Neked külön:'].concat(x.extra) : []));
    main.querySelectorAll('.sosck').forEach(b => b.onclick = () => { const s = LS.get('sos', {}); const k = id + b.dataset.i; s[k] = !s[k]; LS.set('sos', s); V.sos(id, s[k] ? 'next' : 'keep:' + b.dataset.i); });
    const nx = nextOpen('.sosl li');
    if (focus === 'next') centerOn(nx || main.querySelector('.callout.warn, .btn.ghost.mt') || main.lastElementChild);
    else if (focus && focus.startsWith('keep:')) centerOn(main.querySelector(`.sosck[data-i="${focus.slice(5)}"]`));
    else if (nx && nx !== main.querySelector('.sosl li')) centerOn(nx);
    $('#sosReset').onclick = () => { const s = LS.get('sos', {}); x.steps.forEach((_, i) => delete s[id + i]); x.extra.forEach((_, i) => delete s[id + 'p' + i]); LS.set('sos', s); V.sos(id); };
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
        <div class="ch-head">${ic('book', 48)}<div><h1>Kézikönyv</h1><div class="stencil" style="font-size:16px" data-notr>SERE LEVEL A · B · C · FIELD MANUAL</div></div></div>
        <div class="rule"></div>
        <input type="text" id="q" placeholder="Keresés a kézikönyvben…" value="${esc(q || '')}" aria-label="Keresés">
        <p class="muted" style="font-size:22px;margin:8px 0 0"><span class="badge src">TANANYAG</span> a feltöltött diák alapján · <span class="badge web">KIEGÉSZÍTVE</span> nyilvános forrásokból, a tananyag tartalomjegyzéke szerint</p>
      </section>
      ${C.map((ch, ci) => {
        const secs = ch.sections.filter(match); if (!secs.length) return '';
        const lv = lvlOf(ch), head = (ci === 0 || lvlOf(C[ci - 1]) !== lv) ? `<div class="lvhead" style="--c:${LVL[lv].c}"><b data-notr>SERE „${lv}” · ${LVL[lv].n}</b><span>${LVL[lv].risk}</span></div>` : '';
        const done = ch.sections.filter(s => seen[s.id]).length;
        const isOpen = query || open.includes(ch.id);
        return head + `<div class="toc-ch"><button data-ch="${ch.id}" aria-expanded="${isOpen}">${ic(CH_ICON[ch.id] || 'book', 32)}<span class="num ${ch.id.length > 1 ? 'two' : ''}" data-notr>${chNum(ch.id)}</span><span class="tt">${esc(ch.title)}<br><small class="muted" style="font-family:VT323;font-size:20px">${esc(ch.sub)}</small></span><span class="pr">${done}/${ch.sections.length}</span></button>
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
      <section class="card frame"><div class="ch-head">${ic(CH_ICON[ch.id] || 'book', 52)}<div class="num ${ch.id.length > 1 ? 'two' : ''}" data-notr>${chNum(ch.id)}</div><div><h1>${esc(ch.title)}</h1><div class="muted" style="font-size:22px">${esc(ch.sub)}</div></div></div>
        ${SERESpeak.ok ? `<button class="btn readall" id="readAll">${ic('speak', 26)}<span>TELJES FEJEZET FELOLVASÁSA</span></button>` : ''}</section>
      ${ch.sections.map(s => `<section class="card sec" id="s-${s.id}" data-sid="${s.id}">
        <h2><span class="sid">${s.id}</span>${esc(s.title)}</h2>${readBtn(s.id)}
        ${s.web ? '<div class="webnote"><span class="badge web">KIEGÉSZÍTVE</span> nyilvános forrásokból — ellenőrizd a hatályos szakutasítással</div><div class="rule"></div>' : '<div class="rule"></div>'}
        ${s.blocks.map(block).join('')}</section>`).join('')}
      <div class="pager">
        ${i > 0 ? `<a class="btn ghost" href="#/ch/${C[i - 1].id}">‹ ${chName(C[i - 1].id)}. fejezet</a>` : '<span></span>'}
        ${QZ[ch.id] ? `<a class="btn green" href="#/exam/${ch.id}">${ic('check', 20)}Vizsga</a>` : `<a class="btn ghost" href="#/toc">Tartalom</a>`}
        ${i < C.length - 1 ? `<a class="btn" href="#/ch/${C[i + 1].id}">${chName(C[i + 1].id)}. fejezet ›</a>` : '<span></span>'}
      </div>`;
    const secText = sc => [sc.id + '. ' + sc.title + '.'].concat(sc.blocks.flatMap(b => b.items || [b.x]));
    bindRead(sid => secText(ch.sections.find(q => q.id === sid)));
    // teljes fejezet: szakaszonként, a hallott rész kiemelve és görgetve, lebegő vezérlővel
    let playing = false, cur = 0;
    const ra = $('#readAll');
    const bar = document.createElement('div'); bar.className = 'readbar hidden';
    bar.innerHTML = `<div class="rbrow"><button id="rbPrev">‹‹</button><span id="rbTxt"></span><button id="rbStop">■ ÁLLJ</button><button id="rbNext">››</button></div><input type="range" id="rbSeek" min="0" max="${ch.sections.length - 1}" value="0" step="1" aria-label="Ugrás">`;
    document.body.appendChild(bar);
    const mark = () => main.querySelectorAll('.sec').forEach((el, k) => el.classList.toggle('reading', playing && k === cur));
    const playSec = () => {
      if (cur >= ch.sections.length) { stopAll(); toast('Fejezet vége'); return; }
      const sc = ch.sections[cur]; playing = true; mark(); bar.classList.remove('hidden');
      $('#rbTxt').textContent = sc.id + ' ' + T(sc.title); $('#rbSeek').value = cur;
      const el = document.getElementById('s-' + sc.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      SERESpeak.onEnd = () => { if (playing) { cur++; playSec(); } };
      SERESpeak.speak((cur === 0 ? [chName(ch.id) + '. fejezet: ' + ch.title + '.'] : []).concat(secText(sc)));
    };
    const stopAll = () => { playing = false; SERESpeak.onEnd = null; SERESpeak.stop(); mark(); bar.classList.add('hidden'); if (ra) ra.querySelector('span').textContent = 'TELJES FEJEZET FELOLVASÁSA'; };
    if (ra) ra.onclick = () => { if (playing) return stopAll(); if (window.SEREMusic && SEREMusic.on) SEREMusic.stop(); cur = 0; ra.querySelector('span').textContent = 'ÁLLJ'; playSec(); if (!SERESpeak.hasHu) toast('Nincs magyar hang – Beállítások › Szövegfelolvasás'); };
    $('#rbStop').onclick = stopAll;
    // bele lehet tekerni: a csúszkával bármelyik szakaszra ugrik, vagy a szakasz címére koppintva
    $('#rbSeek').oninput = e => { const v = +e.target.value; $('#rbTxt').textContent = ch.sections[v].id + ' ' + T(ch.sections[v].title); };
    $('#rbSeek').onchange = e => { SERESpeak.onEnd = null; SERESpeak.stop(); cur = +e.target.value; playSec(); };
    main.querySelectorAll('.sec h2').forEach((h, k) => h.addEventListener('click', () => { if (!playing) return; SERESpeak.onEnd = null; SERESpeak.stop(); cur = k; playSec(); }));
    $('#rbNext').onclick = () => { SERESpeak.onEnd = null; SERESpeak.stop(); cur = Math.min(cur + 1, ch.sections.length); playSec(); };
    $('#rbPrev').onclick = () => { SERESpeak.onEnd = null; SERESpeak.stop(); cur = Math.max(cur - 1, 0); playSec(); };
    // szakasz-gombról is folytatható: a kiválasztottól indul
    main.querySelectorAll('.sec').forEach((el, k) => el.addEventListener('dblclick', () => { cur = k; SERESpeak.stop(); playSec(); }));
    const seen = seenAll();
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { seen[e.target.dataset.sid] = 1; LS.set('seen', seen); } });
    }, { threshold: .55 });
    main.querySelectorAll('.sec').forEach(s => io.observe(s));
    cleanup = () => { io.disconnect(); playing = false; SERESpeak.onEnd = null; bar.remove(); };
    if (window.__autoRead && ra) { window.__autoRead = false; setTimeout(() => ra.click(), 300); }
    if (sec) { const el = document.getElementById('s-' + sec); if (el) setTimeout(() => el.scrollIntoView(), 30); } else window.scrollTo(0, 0);
  };

  /* --- gyors útmutatók --- */
  V.guides = () => {
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('fire', 48)}<div><h1>Gyors útmutatók</h1><div class="stencil" style="font-size:16px">RAJZOS GYORS ÚTMUTATÓK</div></div></div></section>
      <div class="menu">${D.guides.map(g => tile('#/guide/' + g.id, g.icon, g.title, g.steps.length + ' lépés')).join('')}</div>`;
  };
  V.guide = (id) => {
    const g = D.guides.find(x => x.id === id); if (!g) return V.guides();
    main.innerHTML = `<section class="card frame">
      <div class="sc-head">${ic(g.icon, 52)}<div class="ttl">${esc(g.title)}<small>${g.steps.length} LÉPÉS</small></div><span class="sp" style="flex:1"></span><span class="stamp">SERE</span></div>
      ${readBtn('guide')}
      <div class="steps">${g.steps.map((s, i) => `<div class="step"><div class="sh"><span class="no">${i + 1}</span>${esc(s.t)}</div>
        <div class="art">${ic(s.icon, 64)}</div><ul>${s.x.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="tag ${s.tag[0]}">${ic(s.tag[0] === 'warn' ? 'warn' : s.tag[0] === 'ok' ? 'check' : 'star', 18)}${esc(s.tag[1])}</div>${i < 3 ? '<span class="arrow">▶</span>' : ''}</div>`).join('')}</div>
      <div class="safety"><span class="sf-h">! BIZTONSÁG ELŐSZÖR</span><ul>${g.safety.map(x => `<li>${ic('warn', 20)}<span>${esc(x)}</span></li>`).join('')}</ul></div>
      <div class="motto">${ic('pack', 24)}<span>FELKÉSZÜLÉS · ALKALMAZKODÁS · <span style="color:var(--warn)">TÚLÉLÉS</span></span></div>
      </section>
      <div class="pager"><a class="btn ghost" href="#/guides">‹ Kártyák</a><a class="btn" href="#/ch/${g.ch}">Részletesen: ${g.ch}. fejezet ›</a></div>`;
    bindRead(() => [g.title + '.'].concat(g.steps.map((s, i) => (i + 1) + '. ' + s.t + ': ' + s.x.join('. ') + '. ' + s.tag[1]), ['Biztonság: ' + g.safety.join('. ')]));
    window.scrollTo(0, 0);
  };

  /* --- SERE prioritások --- */
  V.prio = () => {
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('signal', 48)}<div><h1>SERE prioritások</h1><div class="stencil" style="font-size:16px">SIGNAL › PROTECT › HEALTH › TRAVEL › SUSTAIN</div></div></div></section>
      <section class="card"><div class="chain">${D.priorities.map((p, i) => `${i ? '<div class="down">▼</div>' : ''}<a class="link" href="#/guide/${p.g}" style="text-decoration:none;color:inherit"><div class="L" data-notr>${p.k}</div><div><h3 style="display:flex;gap:8px;align-items:center">${ic(p.icon, 24)}${esc(p.t)}</h3><div>${esc(p.x)}</div></div></a>`).join('')}</div>
      <div class="callout quote mt">${ic('star', 26)}<div>A SERE „A” tananyag (8.1) sorrendje: személyes védelem → ellátmány (víz, élelem) → egészség → helyváltoztatás. A jelzés mindegyikkel párhuzamosan fut – ha a mentés elérhető, a jelentés az első.</div></div>
      <div class="callout ok">${ic('check', 26)}<div><b>3-as szabály:</b> 3 perc levegő · 3 óra védelem nélkül szélsőséges időben · 3 nap víz · 3 hét élelem nélkül.</div></div></section>`;
  };

  /* --- S-T-O-P --- */
  V.stop = (focus) => {
    const st = LS.get('stop', {});
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('stop', 52)}<div><h1>S-T-O-P</h1><div class="muted" style="font-size:22px">Az első percek – mielőtt bármit tennél.</div></div></div></section>
      ${D.stop.map((s, i) => `<section class="stop-card ${st[i] ? 'done' : ''}" data-i="${i}"><div class="L" data-notr>${s.k}</div><div><h3>${esc(s.t)}</h3>
        ${s.x.map((x, j) => `<button class="chk ${st[i + '-' + j] ? 'on' : ''}" data-k="${i}-${j}"><span class="box"></span><span>${esc(x)}</span></button>`).join('')}</div></section>`).join('')}
      <div class="row"><button class="btn ghost" id="stopReset">Újrakezdés</button><a class="btn" href="#/prio">Tovább: prioritások ›</a></div>`;
    main.querySelectorAll('.chk').forEach(b => b.onclick = () => {
      const s = LS.get('stop', {}); s[b.dataset.k] = !s[b.dataset.k];
      const i = b.dataset.k.split('-')[0]; s[i] = D.stop[i].x.every((_, j) => s[i + '-' + j]); LS.set('stop', s); V.stop(s[b.dataset.k] ? 'next' : b.dataset.k);
    });
    if (focus === 'next') centerOn(nextOpen('.chk') || main.querySelector('.row'));
    else if (focus) centerOn(main.querySelector(`.chk[data-k="${focus}"]`));
    $('#stopReset').onclick = () => { LS.set('stop', {}); V.stop(); };
  };

  /* --- kit builder --- */
  const RAR = { rare: ['RITKA', 'var(--acc)'], imp: ['FONTOS', 'var(--ok)'], com: ['ALAP', 'var(--yel)'], own: ['NEKED', 'var(--blue)'] };
  const CAT = { sus: ['ELLÁTÁS', 'var(--blue)'], nav: ['NAVIGÁCIÓ', 'var(--purple)'], util: ['ESZKÖZ', 'var(--yel)'], sig: ['JELZÉS', 'var(--acc)'], med: ['EGÉSZSÉG', 'var(--warn)'] };
  V.kit = () => {
    const have = LS.get('kit', {}); const KIT = kitItems();
    const packed = KIT.filter(k => have[k.id]);
    const grams = packed.reduce((a, k) => a + k.g, 0);
    const miss = D.kitEssential.filter(id => !have[id]);
    const ready = miss.length === 0;
    main.innerHTML = `<section class="card frame">
      <div class="ch-head">${ic('pack', 52)}<div><h1>Túlélőkészlet</h1><div class="stencil" style="font-size:16px">MI LEGYEN NÁLAD</div></div></div>
      <div class="rule"></div>
      <div class="statusline"><span>ÁLLAPOT: <span class="st ${ready ? 'ok' : ''}">${ready ? 'FELKÉSZÜLVE ✓' : 'HIÁNYOS'}</span></span><span>${packed.length}/${KIT.length} · ${(grams / 1000).toFixed(2)} KG</span></div>
      <div class="rule"></div>
      ${prof() ? `<div class="muted" style="font-size:19px;margin-bottom:8px">${ic(prof().icon, 18)} Kiegészítve: <b>${esc(prof().n)}</b> (kék jelölés)</div>` : ''}<div class="inv">${KIT.map(k => `<button class="slot ${have[k.id] ? 'on' : ''} ${D.kitEssential.includes(k.id) ? 'ess' : ''}" data-id="${k.id}" title="${esc(k.n)} – ${k.g} g">
        ${ic(k.icon, 40)}<span class="nm">${esc(k.n)}</span>
        <span class="rr" style="color:${RAR[k.r][1]}"><i class="dot" style="--c:${RAR[k.r][1]}"></i>${RAR[k.r][0]}</span>
        <span class="rr" style="color:${CAT[k.c][1]}"><i class="dot" style="--c:${CAT[k.c][1]}"></i>${CAT[k.c][0]}</span></button>`).join('')}</div>
      ${miss.length ? `<div class="callout warn mt">${ic('warn', 26)}<div><b>Hiányzó alapelemek:</b> ${miss.map(id => esc(KIT.find(k => k.id === id).n)).join(', ')}</div></div>` : `<div class="callout ok mt">${ic('check', 26)}<div>Minden alapelem a csomagban. A túlélőkészlet a <b>testen</b> legyen, ne a hátizsákban!</div></div>`}
      <div class="legend mt"><div><i class="dot" style="--c:var(--acc)"></i>RITKA – nehéz pótolni</div><div><i class="dot" style="--c:var(--blue)"></i>ELLÁTÁS – víz, étel</div>
        <div><i class="dot" style="--c:var(--ok)"></i>FONTOS – megbízható</div><div><i class="dot" style="--c:var(--purple)"></i>NAVIGÁCIÓ</div>
        <div><i class="dot" style="--c:var(--yel)"></i>ALAP – egyszerű, kell</div><div><span style="color:var(--warn);font-family:Silkscreen">!</span>&nbsp;kötelező alapelem</div></div>
      </section><div class="row"><button class="btn ghost" id="kitReset">Ürítés</button></div>`;
    main.querySelectorAll('.slot').forEach(b => b.onclick = () => { const h = LS.get('kit', {}); h[b.dataset.id] = !h[b.dataset.id]; LS.set('kit', h); const y = scrollY; V.kit(); scrollTo(0, y); });
    $('#kitReset').onclick = () => { LS.set('kit', {}); V.kit(); };
  };

  /* --- checklisták --- */
  V.check = (id, focus) => {
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
    main.querySelectorAll('.chk').forEach(b => b.onclick = () => { const s = LS.get('chk', {}); s[c.id + b.dataset.i] = !s[c.id + b.dataset.i]; LS.set('chk', s); V.check(id, s[c.id + b.dataset.i] ? 'next' : b.dataset.i); });
    if (focus === 'next') centerOn(nextOpen('.chk') || main.querySelector('.row'));
    else if (focus != null) centerOn(main.querySelector(`.chk[data-i="${focus}"]`));
    $('#chkReset').onclick = () => { const s = LS.get('chk', {}); c.items.forEach((_, i) => delete s[c.id + i]); LS.set('chk', s); V.check(id); };
  };

  /* --- iránytű --- */
  V.compass = () => {
    let heading = null, target = LS.get('target', null), manual = false, raf = 0;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('compass', 48)}<div><h1>Iránytű</h1><div class="muted" style="font-size:22px">Telefon szenzor · tartsd vízszintesen</div></div></div>
      <div class="compass-wrap"><canvas id="compass" width="96" height="96"></canvas></div>
      <div class="hdg" id="hdg">---°<small id="hdgSub">koppints a „Szenzor indítása” gombra</small></div>
      <div class="row center mt" style="justify-content:center"><button class="btn" id="startC">${ic('compass', 20)}Szenzor indítása</button><button class="btn ghost" id="manBtn">Kézi beállítás</button></div>
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
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('map', 48)}<div><h1>Térkép-jelölő</h1><div class="muted" style="font-size:22px">GPS-alapú, internet nélkül · pontok a készüléken</div></div></div>
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
      const drawSprite = (name, x, y) => { const img = new Image(); img.onload = () => g.drawImage(img, Math.round(x - 8), Math.round(y - 8), 16, 16); img.src = PX.url(name); };
      if (ctr) m.forEach(p => { const db = distBear(ctr, p), r = rad(db.b); drawSprite((D.markTypes.find(t => t.id === p.type) || D.markTypes[5]).icon, c + Math.sin(r) * db.d * scale, c - Math.cos(r) * db.d * scale); });
      if (pos) { g.fillStyle = '#ffd60a'; g.fillRect(c - 3, c - 3, 6, 6); g.fillStyle = '#141810'; g.fillRect(c - 1, c - 1, 2, 2); }
      else { g.fillStyle = night ? '#8e7262' : '#a99a74'; g.textAlign = 'center'; g.font = '8px Silkscreen, monospace'; g.fillText(ctr ? 'NO GPS - KOZEPPONT' : 'NO GPS', c, W - 8); }
      $('#here').innerHTML = pos ? `Pozíció: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)} ${pos.acc ? '±' + Math.round(pos.acc) + ' m' : ''}<br>MGRS: <b>${toMGRS(pos.lat, pos.lon)}</b>` : 'Pozíció: — (indítsd a GPS-t)';
      $('#marks').innerHTML = m.length ? m.map((p, i) => {
        const t = D.markTypes.find(x => x.id === p.type) || D.markTypes[5];
        const db = pos ? distBear(pos, p) : null;
        return `<li>${ic(t.icon, 28)}<div><b>${esc(p.name || t.n)}</b><br><span class="muted" style="font-size:21px">${toMGRS(p.lat, p.lon)}</span></div>
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
  V.about = () => {
    const url = location.origin + location.pathname;
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    main.innerHTML = `<section class="card frame"><div class="ch-head">${ic('star', 48)}<div><h1>Telepítés</h1><div class="stencil" style="font-size:16px">OFFLINE · TÉRERŐ NÉLKÜL IS</div></div></div>
      <div class="center mt"><img src="qr.svg" alt="QR-kód az app címéhez" width="220" height="220" style="image-rendering:pixelated;background:#f4f1e6;padding:8px;border:3px solid var(--khaki-d)"></div>
      <p class="center coord" style="word-break:break-all">${esc(url)}</p>
      <div class="row" style="justify-content:center"><button class="btn green ${!standalone ? '' : 'hidden'}" id="instBtn">${ic('pack', 20)}Telepítés most</button><button class="btn ghost" id="shareBtn">Link megosztása</button></div>
      ${standalone ? `<div class="callout ok mt">${ic('check', 26)}<div>Telepítve fut – a teljes tartalom offline is elérhető.</div></div>` : ''}
      <div class="rule"></div>
      <h3>Android (Chrome)</h3><ol class="sec" style="padding:0;list-style:none"><li>Olvasd be a QR-kódot vagy nyisd meg a linket.</li><li>Koppints a „Telepítés most” gombra, vagy ⋮ menü → „Alkalmazás telepítése”.</li></ol>
      <h3>iPhone (Safari)</h3><ol class="sec" style="padding:0;list-style:none"><li>Nyisd meg a linket <b>Safariban</b>.</li><li>Megosztás ⬆ → „Főképernyőhöz adás”.</li></ol>
      <div class="callout ok">${ic('check', 26)}<div>Az első megnyitás után minden fájl a telefonon tárolódik – utána repülő módban is működik.</div></div>
      <div class="rule"></div>
      <h3>Forrás és felelősség</h3>
      <p>A „TANANYAG” jelölésű részek a SERE „A” szintű e-learning tananyag alapján, összefoglalva készültek. A <span class="badge web">KIEGÉSZÍTVE</span> részek a tananyag tartalomjegyzéke szerint, nyilvános forrásokból (NATO/US PR doktrína, katonai kézikönyvek) készültek.</p>
      <p class="muted">Gyakorló segédlet – nem helyettesíti a hivatalos kiképzést és a hatályos HVKF szakutasítást.</p>
      <p class="muted" style="font-size:21px">Fonts: VT323, Pixelify Sans, Silkscreen (SIL OFL) · v${window.SERE_VERSION}</p></section>`;
    const ib = $('#instBtn'); if (ib) ib.onclick = () => installPopup(true);
    $('#shareBtn').onclick = doShare;
  };


  /* ---------------- betűméret ---------------- */
  function applyFs() { const f = LS.get('fs', 0); document.body.classList.remove('fs1', 'fs2'); if (f) document.body.classList.add('fs' + f); }
  applyFs();

  /* ---------------- zene ---------------- */
  function musicBtn() { const b = $('#musBtn'); if (!b) return; const on = window.SEREMusic && SEREMusic.on; b.innerHTML = on ? '♪' : '<s>♪</s>'; b.title = T(on ? 'Zene ki' : 'Zene be'); b.classList.toggle('on', !!on); }
  function setMusic(v) { if (!window.SEREMusic) return; v ? SEREMusic.start() : SEREMusic.stop(); LS.set('music', !!v); musicBtn(); }
  $('#musBtn').onclick = () => setMusic(!SEREMusic.on);
  // böngésző szabály: hang csak érintés után indulhat → az első koppintásra indul, ha be van kapcsolva
  document.addEventListener('pointerdown', function first() { if (LS.get('music', true) && !SEREMusic.on) setMusic(true); document.removeEventListener('pointerdown', first); }, { once: true });
  musicBtn();

  /* ---------------- frissítés + megosztás ---------------- */
  let swReg = null;
  async function doUpdate(manual) {
    if (!manual) { try { if (swReg) { await swReg.update(); if (swReg.waiting) swReg.waiting.postMessage('skip'); } } catch (e) { } return; }
    if (!navigator.onLine) return toast('Nincs internet – a mentett verzió fut');
    const m = showModal(`<h2>Frissítés</h2><div class="upbar"><i id="upFill"></i></div><div class="uppct" id="upPct" data-notr>0%</div><p class="muted" id="upMsg">Új verzió keresése…</p>`, null, { noClose: true });
    const set = (pct, msg) => { const f = m.g.querySelector('#upFill'), t = m.g.querySelector('#upPct'); if (f) f.style.width = pct + '%'; if (t) t.textContent = Math.round(pct) + '%'; if (msg) m.g.querySelector('#upMsg').textContent = T(msg); };
    try {
      const sw = await (await fetch('sw.js', { cache: 'no-store' })).text();
      const ver = (sw.match(/VERSION = '([^']+)'/) || [])[1], list = JSON.parse('[' + (sw.match(/ASSETS = \[([\s\S]*?)\];/) || [, ''])[1].replace(/'/g, '"').replace(/,\s*$/, '') + ']');
      if (!ver || !list.length) throw new Error('sw');
      set(2, 'Fájlok letöltése…');
      const c = await caches.open(ver); let done = 0;
      const one = async u => { const r = await fetch(u, { cache: 'reload' }); if (r.ok) await c.put(u, r); done++; set(2 + done / list.length * 93); };
      for (let i = 0; i < list.length; i += 4) await Promise.all(list.slice(i, i + 4).map(one));
      set(96, 'Telepítés…');
      if (swReg) { await swReg.update().catch(() => { }); const w = swReg.waiting || swReg.installing; if (w) { const go = () => { set(100, 'Kész – újraindítás…'); w.postMessage('skip'); }; if (w.state === 'installed') go(); else w.addEventListener('statechange', () => w.state === 'installed' && go()); setTimeout(() => location.reload(), 6000); return; } }
      set(100, 'Kész – újraindítás…');
      const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== ver).map(k => caches.delete(k)));
      setTimeout(() => location.reload(), 400);
    } catch (e) { m.close(); toast('Frissítés nem sikerült – a mentett verzió fut'); }
  }
  const APP_URL = 'https://strattila90-hue.github.io/SERE/?qr=1';
  async function doShare() {
    try { if (navigator.share) { await navigator.share({ title: 'SERE PIXEL', text: 'SERE PIXEL – offline túlélési kézikönyv. Nyisd meg és telepítsd:', url: APP_URL }); return; } } catch (e) { return; }
    showModal(`<h2>Megosztás</h2><img src="qr.svg" alt="QR-kód" width="230" height="230" style="background:#f4f1e6;padding:8px;image-rendering:pixelated"><p class="coord" style="word-break:break-all">${APP_URL}</p>
      <button class="btn" id="cpy">Link másolása</button>`, m => { m.querySelector('#cpy').onclick = async () => { try { await navigator.clipboard.writeText(APP_URL); toast('Link a vágólapon'); } catch (e) { toast('Másold ki kézzel'); } }; });
  }
  function showModal(html, bind, opts = {}) {
    const g = document.createElement('div'); g.className = 'gate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true');
    g.innerHTML = `<div class="gbox">${html}${opts.noClose ? '' : '<button class="esc" data-x>Bezárás</button>'}</div>`;
    document.body.appendChild(g); document.body.style.overflow = 'hidden';
    const close = () => { g.remove(); document.body.style.overflow = ''; };
    g.querySelectorAll('[data-x]').forEach(x => x.onclick = close);
    bind && bind(g, close); return { g, close };
  }

  /* ---------------- telepítő felugró ablak ---------------- */
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  function installPopup(force) {
    if (isStandalone()) { if (force) toast('Már telepítve van ✓'); return; }
    const fromQR = /[?&]qr=1/.test(location.search);
    if (!force && !fromQR) { try { if (sessionStorage.getItem('sp:later')) return; } catch (e) { } }
    const ua = navigator.userAgent;
    const iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const iOSSafari = iOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|Instagram|FBAN|FBAV/.test(ua);
    const inApp = /FBAN|FBAV|FB_IAB|Messenger|Instagram|Line\/|Viber|musical_ly|Bytedance|Snapchat|; wv\)|GSA\//.test(ua);
    const samsung = /SamsungBrowser/.test(ua), android = /Android/.test(ua);
    const chromeIntent = 'intent://' + location.host + location.pathname + '?qr=1#Intent;scheme=https;package=com.android.chrome;end';
    const homeTip = `<p class="muted" style="font-size:19px">Nem látod az ikont? Nézd meg az <b>alkalmazások listájában</b> is (Samsungon: kezdőképernyő beállításai → „Új alkalmazások hozzáadása a kezdőképernyőhöz”).</p>`;
    const head = `<img class="ico" src="icons/icon-v3-192.png" alt=""><div class="big">SERE<br><b>PIXEL</b></div>`;
    const steps = () => iOSSafari ? `<ol><li>Koppints lent a <b>Megosztás ⬆</b> gombra</li><li>Görgess le: <b>„Főképernyőhöz adás”</b></li><li>Jobb fent: <b>Hozzáadás</b></li></ol>`
      : iOS ? `<p style="color:var(--warn)">iPhone-on csak a <b>Safari</b> tud telepíteni.</p><ol><li>Nyisd meg a linket <b>Safariban</b></li><li>Megosztás ⬆ → „Főképernyőhöz adás”</li></ol>`
      : inApp ? `<p style="color:var(--warn)">Ez a beépített böngésző (pl. Messenger, Facebook, Viber) <b>nem tud telepíteni.</b></p>${android ? `<a class="btn green" href="${chromeIntent}">Megnyitás Chrome-ban ›</a>` : ''}<ol><li>Vagy: ⋮ / ··· menü → <b>„Megnyitás böngészőben”</b></li><li>Ott koppints: <b>IGEN, TELEPÍTEM</b></li></ol>`
      : samsung ? `<ol><li>Samsung Internet: lent a <b>≡ menü</b></li><li><b>„Oldal hozzáadása”</b> → <b>„Kezdőképernyő”</b></li><li>Vagy a címsorban a <b>⬇ / + ikon</b></li></ol><p class="muted" style="font-size:19px">Titkos (inkognitó) módban nem lehet telepíteni.</p>${android ? `<a class="btn ghost" href="${chromeIntent}">Inkább Chrome-ban ›</a>` : ''}${homeTip}`
      : `<ol><li>Chrome <b>⋮</b> menü (jobb fent)</li><li><b>„Alkalmazás telepítése”</b> vagy <b>„Hozzáadás a kezdőképernyőhöz”</b> → <b>Telepítés</b></li></ol><p class="muted" style="font-size:19px">Inkognitó lapon nem lehet telepíteni. Ha többször elutasítottad, a Chrome egy ideig nem kérdez rá – ilyenkor a ⋮ menü mindig működik.</p>${homeTip}`;
    const m = showModal('', null, { noClose: true });
    const box = m.g.querySelector('.gbox');
    function render(state) {
      const mus = `<button class="btn ghost" id="gMus" style="font-size:20px;padding:8px 12px">${SEREMusic.on ? '♪ Zene: BE' : '♪ Zene: KI'}</button>`;
      if (state === 'ask') box.innerHTML = head + `<div class="stamp" style="font-size:16px">FIELD MANUAL · OFFLINE</div>
        <h2>Telepíted a SERE PIXEL-t?</h2><p>Kezdőképernyőre kerül, és <b>internet nélkül, terepen is</b> működik.</p>
        <div class="gq">${ic('check', 36)}<span>Offline kézikönyv</span>${ic('compass', 36)}<span>Iránytű + térkép</span>${ic('pack', 36)}<span>Kit-builder</span></div>
        <button class="btn green" id="gYes">${ic('check', 30)} IGEN, TELEPÍTEM</button><button class="btn ghost" id="gNo">Később</button>${mus}`;
      else if (state === 'manual') box.innerHTML = head + `<h2>Még egy lépés!</h2>${steps()}<p class="muted" style="font-size:22px">Utána indítsd a kezdőképernyőn lévő ikonról.</p><button class="btn ghost" id="gNo">Rendben</button>${mus}`;
      else if (state === 'done') box.innerHTML = head + `<h2 style="color:var(--ok)">✓ Telepítve!</h2><p>Indítsd a <b>SERE PIXEL</b> ikonról a kezdőképernyőn.</p><button class="btn ghost" id="gNo">Bezárás</button>`;
      const y = box.querySelector('#gYes'), n = box.querySelector('#gNo'), mu = box.querySelector('#gMus');
      if (y) y.onclick = async () => {
        if (!SEREMusic.on && LS.get('music', true)) setMusic(true);
        if (!deferred && !inApp && !iOS) { y.disabled = true; y.innerHTML = T('Előkészítés…'); for (let i = 0; i < 30 && !deferred; i++) await new Promise(z => setTimeout(z, 100)); }
        if (deferred) { const d = deferred; deferred = null; try { d.prompt(); const r = await d.userChoice; render(r.outcome === 'accepted' ? 'done' : 'manual'); } catch (e) { render('manual'); } }
        else render('manual');
      };
      if (n) n.onclick = () => { try { sessionStorage.setItem('sp:later', '1'); } catch (e) { } m.close(); history.replaceState(null, '', location.pathname + location.hash); };
      if (mu) mu.onclick = () => { setMusic(!SEREMusic.on); render(state); };
    }
    render(inApp ? 'manual' : 'ask');
    window.addEventListener('appinstalled', () => render('done'));
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });


  /* ---------------- nyelvválasztás ---------------- */
  const FLAG = { hu: ['#ce2939', '#ffffff', '#477050'], sk: ['#ffffff', '#0b4ea2', '#ee1c25'], en: ['#012169', '#ffffff', '#c8102e'] };
  const FLAGSVG = {
    hu: '<rect width="30" height="7" fill="#ce2939"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#477050"/>',
    sk: '<rect width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0b4ea2"/><rect y="13" width="30" height="7" fill="#ee1c25"/><path d="M6 4h10v9l-5 4-5-4z" fill="#fff"/><path d="M7 5h8v8l-4 3-4-3z" fill="#ee1c25"/><path d="M10 6h2v8h-2zM8 8h6v1H8zM9 10h4v1H9z" fill="#fff"/><path d="M7 13h8l-4 3z" fill="#0b4ea2"/>',
    en: '<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.6"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.4"/>'
  };
  const flag = l => `<span class="flag" aria-hidden="true"><svg viewBox="0 0 30 20" preserveAspectRatio="none" shape-rendering="crispEdges">${FLAGSVG[l] || ''}</svg></span>`;
  function langModal(onDone, force) {
    const cur = I18N.lang;
    const m = showModal(`<div class="big" style="font-size:40px">SERE <b>PIXEL</b></div>
      <h2 data-notr>Nyelv · Jazyk · Language</h2>
      <div class="langs">${Object.entries(I18N.LANGS).map(([k, v]) => `<button class="langbtn ${k === cur && I18N.chosen ? 'on' : ''}" data-l="${k}" data-notr>${flag(k)}<span>${v.n}</span></button>`).join('')}</div>`, null, { noClose: !force });
    m.g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const l = b.dataset.l; I18N.set(l); try { sessionStorage.setItem('sp:langAsked', '1'); } catch (e) { }
      if (l !== cur || !window.SERE_I18N && l !== 'hu') { location.reload(); return; }
      m.close(); onDone && onDone();
    });
  }
  function startFlow() {
    const fromQR = /[?&]qr=1/.test(location.search);
    let asked = false; try { asked = !!sessionStorage.getItem('sp:langAsked'); } catch (e) { }
    if (!I18N.chosen || (fromQR && !asked)) langModal(() => installPopup(false));
    else installPopup(false);
  }

  /* ---------------- oldalsó menü ---------------- */
  function drawerHTML() {
    const h = location.hash.replace(/^#\/?/, '').split('/')[0] || 'home';
    const it = (href, icon, t, sub) => `<a class="di ${h === href.replace('#/', '').split('/')[0] ? 'on' : ''}" href="${href}">${ic(icon, 30)}<span>${t}${sub ? `<br><small>${sub}</small>` : ''}</span><span>›</span></a>`;
    const fs = LS.get('fs', 0), night = isNight(), mus = window.SEREMusic && SEREMusic.on;
    return `<div class="dhead"><img src="icons/icon-v3-192.png" alt=""><div><div class="brand">SERE <b>PIXEL</b></div><div class="muted" style="font-size:18px">v${window.SERE_VERSION} · offline</div></div></div>
      ${it('#/', 'star', 'Főoldal')}
      ${it('#/sos', 'warn', 'Bajban vagyok')}
      ${it('#/kid', 'heart', 'Gyerek mód')}
      <div class="dsec">TUDÁSTÁR</div>
      ${it('#/course', 'check', 'Tanfolyam', 'leckék + vizsgák')}
      ${it('#/toc', 'book', 'Kézikönyv', '8 fejezet · keresés')}
      ${it('#/guides', 'fire', 'Gyors kártyák', 'tűz · menedék · víz · jelzés…')}
      ${it('#/stop', 'stop', 'S-T-O-P')}
      ${it('#/prio', 'signal', 'SERE prioritások')}
      <div class="dsec">ESZKÖZÖK</div>
      ${it('#/compass', 'compass', 'Iránytű')}
      ${it('#/map', 'map', 'Térkép-jelölő')}
      ${it('#/kit', 'pack', 'Kit-builder')}
      ${it('#/check', 'check', 'Checklisták')}
      ${it('#/status', 'heart', 'Állapotom')}
      <div class="dsec">BEÁLLÍTÁS</div>
      ${it('#/who', 'star', 'Ki vagy?', (prof() || {}).n || 'nincs beállítva')}
      <button class="di" id="dLang">${flag(I18N.lang)}<span data-notr>Nyelv · Jazyk · Language<br><small>${I18N.LANGS[I18N.lang].n}</small></span><span>›</span></button>
      <div class="drow"><button data-fs="0" class="${fs === 0 ? 'on' : ''}">A</button><button data-fs="1" class="${fs === 1 ? 'on' : ''}">A+</button><button data-fs="2" class="${fs === 2 ? 'on' : ''}">A++</button></div>
      <div class="drow" style="grid-template-columns:1fr 1fr"><button id="dNight">${night ? '☾ Éjszaka' : '☀ Nappal'}</button><button id="dMus" class="${mus ? 'on' : ''}">♪ Zene ${mus ? 'BE' : 'KI'}</button></div>
      <div class="dsec">APP</div>
      <button class="di" id="dUpd">${ic('refresh', 30)}<span>Frissítés</span><span>›</span></button>
      <button class="di" id="dShr">${ic('share', 30)}<span>Megosztás</span><span>›</span></button>
      ${isStandalone() ? '' : `<button class="di" id="dIns">${ic('pack', 30)}<span>Telepítés</span><span>›</span></button>`}
      ${it('#/about', 'book', 'Névjegy, QR')}`;
  }
  function openMenu() {
    const d = $('#drawer'); d.innerHTML = drawerHTML(); document.body.classList.add('menu-open'); d.setAttribute('aria-hidden', 'false'); $('#menuBtn').setAttribute('aria-expanded', 'true');
    d.querySelectorAll('a.di').forEach(a => a.addEventListener('click', closeMenu));
    d.querySelectorAll('[data-fs]').forEach(b => b.onclick = () => { LS.set('fs', +b.dataset.fs); applyFs(); openMenu(); });
    $('#dNight').onclick = () => { LS.set('mode', isNight() ? 'day' : 'night'); applyMode(); openMenu(); };
    $('#dMus').onclick = () => { setMusic(!SEREMusic.on); openMenu(); };
    $('#dUpd').onclick = () => { closeMenu(); doUpdate(true); };
    $('#dLang').onclick = () => { closeMenu(); langModal(null, true); };
    $('#dShr').onclick = () => { closeMenu(); doShare(); };
    const di = $('#dIns'); if (di) di.onclick = () => { closeMenu(); installPopup(true); };
  }
  function closeMenu() { document.body.classList.remove('menu-open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#menuBtn').setAttribute('aria-expanded', 'false'); }
  $('#menuBtn').onclick = () => document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
  $('#drawerBg').onclick = closeMenu;
  let navDepth = 0;
  window.addEventListener('hashchange', () => { navDepth++; });
  $('#backBtn').onclick = () => {
    if (document.body.classList.contains('menu-open')) return closeMenu();
    if (document.querySelector('.gate')) { document.querySelector('.gate [data-x], .gate #gNo') ? document.querySelector('.gate [data-x], .gate #gNo').click() : null; return; }
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (navDepth > 0 && history.length > 1) { navDepth -= 2; history.back(); return; }
    const up = { ch: '#/toc', guide: '#/guides', exam: '#/course/' + ((parts[1] || '').match(/^[BC]/) ? parts[1][0] : 'A'), cert: '#/course/' + (parts[1] || 'A'), check: parts[1] ? '#/check' : '#/', sos: parts[1] ? '#/sos' : '#/', who: parts[1] ? '#/who' : '#/', kid: parts[1] ? '#/kid' : '#/kid' };
    location.hash = up[parts[0]] || '#/';
  };
  // húzás balra a menü bezárásához
  (() => { let x0 = null; const d = $('#drawer'); d.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true }); d.addEventListener('touchend', e => { if (x0 != null && x0 - e.changedTouches[0].clientX > 60) closeMenu(); x0 = null; }, { passive: true }); })();

  /* ---------------- router ---------------- */
  const NAV = { course: 'home', exam: 'home', cert: 'home', status: 'home', kid: 'home', who: 'home', sos: 'sos', home: '', toc: 'toc', ch: 'toc', guides: 'guides', guide: 'guides', prio: 'home', stop: 'home', kit: 'home', check: 'home', compass: 'map', map: 'map', about: 'home' };
  const CRUMB = { course: 'Tanfolyam', exam: 'Vizsga', cert: 'Oklevél', status: 'Állapotom', kid: 'Gyerek mód', who: 'Ki vagy?', sos: 'Bajban vagyok', home: 'Főmenü', toc: 'Kézikönyv', ch: 'Kézikönyv', guides: 'Útmutatók', guide: 'Útmutató', prio: 'Prioritások', stop: 'S-T-O-P', kit: 'Kit-builder', check: 'Checklisták', compass: 'Iránytű', map: 'Térkép-jelölő', about: 'Telepítés' };
  let prevRoute = '';
  let kidSaid = false;
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
    if (window.SERESpeak && !kidSaid) { SERESpeak.onEnd = null; SERESpeak.stop(); }
    if (document.body.classList.contains('menu-open')) closeMenu();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    let v = V[parts[0]] ? parts[0] : 'home';
    if (v === 'kid') LS.set('kid', true);
    else if (LS.get('kid', false)) { location.replace('#/kid'); return; }
    document.body.classList.toggle('kidmode', v === 'kid');
    document.body.classList.toggle('is-home', v === 'home');
    $('#backBtn').style.display = v === 'home' || (v === 'kid' && !parts[1]) ? 'none' : '';
    const zf = parseFloat(document.documentElement.style.zoom) || 1;
    document.documentElement.style.setProperty('--toph', $('.top').offsetHeight + 'px');
    document.documentElement.style.setProperty('--apph', (innerHeight / zf) + 'px');
    $('#crumb').textContent = CRUMB[v]; requestAnimationFrame(() => fitText(document.querySelector('.top')));
    document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.nav === (NAV[v] || 'home')));
    main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
    V[v](...parts.slice(1));
    if (v !== 'ch' && !(v === 'sos' && parts[1] && prevRoute === location.hash)) window.scrollTo(0, 0); prevRoute = location.hash;
  }
  document.querySelectorAll('.nav button').forEach(b => {
    b.innerHTML = ic(b.dataset.icon, 24) + `<span>${b.dataset.label}</span>`;
    b.onclick = () => { location.hash = '#/' + (b.dataset.nav === 'home' ? '' : b.dataset.nav); };
  });
  // nincs nagyítás: csippentés (iOS gesture), dupla koppintás és Ctrl+görgő tiltva
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  let lastTap = 0; document.addEventListener('touchend', e => { const n = Date.now(); if (n - lastTap < 300 && !e.target.closest('input,textarea')) e.preventDefault(); lastTap = n; }, { passive: false });
  window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault(); });
  /* ---- natív érzet: irányfüggő oldalváltás, görgetés-emlékezet, élről húzás vissza, finom rezgés ---- */
  const stack = [location.hash || '#/'], scrollMem = {};
  let curHash = location.hash || '#/';
  function navigate() {
    const h = location.hash || '#/'; scrollMem[curHash] = window.scrollY;
    const back = stack.length > 1 && stack[stack.length - 2] === h;
    if (back) stack.pop(); else if (stack[stack.length - 1] !== h) stack.push(h);
    if (stack.length > 60) stack.splice(0, stack.length - 60);
    curHash = h; document.documentElement.dataset.nav = back ? 'back' : 'fwd';
    const run = () => { route(); if (back && scrollMem[h] != null) window.scrollTo(0, scrollMem[h]); };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduce && !document.hidden) { try { const vt = document.startViewTransition(run); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => { })); return; } catch (e) { } }
    run();
  }
  window.addEventListener('hashchange', navigate);
  // a fejléc magassága változhat (betöltődő betűk, notch, elforgatás) – mindig friss érték a képernyőre illesztett oldalakhoz
  if (window.ResizeObserver) new ResizeObserver(() => { document.documentElement.style.setProperty('--toph', $('.top').offsetHeight + 'px'); }).observe($('.top'), { box: 'border-box' });
  // élről húzás jobbra = vissza (mint natív appban)
  let sx = null, sy = 0, st = 0;
  document.addEventListener('touchstart', e => { const t = e.touches[0]; sx = (t.clientX < 28 && $('#backBtn').style.display !== 'none' && !document.querySelector('.gate')) ? t.clientX : null; sy = t.clientY; st = Date.now(); }, { passive: true });
  document.addEventListener('touchend', e => { if (sx == null) return; const t = e.changedTouches[0]; if (t.clientX - sx > 70 && Math.abs(t.clientY - sy) < 60 && Date.now() - st < 600) $('#backBtn').click(); sx = null; }, { passive: true });
  // finom haptikus visszajelzés gombnyomáskor (ha a telefon támogatja)
  document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && navigator.vibrate && LS.get('haptic', true) && e.target.closest('a,button,.chk,.opt')) try { navigator.vibrate(6); } catch (x) { } }, { passive: true });
  window.addEventListener('resize', () => { const zf = parseFloat(document.documentElement.style.zoom) || 1; document.documentElement.style.setProperty('--apph', (innerHeight / zf) + 'px'); });
  applyMode();
  route();
  setTimeout(startFlow, 500);
  I18N.watch();
  setInterval(() => { if (LS.get('mode', 'auto') === 'auto') applyMode(); }, 60000);

  if ('serviceWorker' in navigator) {
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
      swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) reg.waiting.postMessage('skip');
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) { toast('Új verzió – frissítés…'); w.postMessage('skip'); } }); });
      const check = () => { if (navigator.onLine) reg.update().catch(() => { }); };
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
      setInterval(check, 30 * 60 * 1000);
    }).catch(() => { }));
  }
})();
