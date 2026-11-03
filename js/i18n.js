/* SERE PIXEL — többnyelvűség (HU / SK / EN)
   A felület magyar forrásszövegből épül; a megjelenített szövegeket egy szótár cseréli a választott nyelvre.
   A kézikönyv fejezetei nyelvenként külön fájlban vannak (content.en.js, content.sk.js). */
(function () {
  const LANGS = { hu: { n: 'Magyar', flag: 'HU', tts: 'hu-HU', loc: 'hu-HU' }, sk: { n: 'Slovenčina', flag: 'SK', tts: 'sk-SK', loc: 'sk-SK' }, en: { n: 'English', flag: 'EN', tts: 'en-GB', loc: 'en-GB' } };
  let lang = 'hu';
  try { lang = JSON.parse(localStorage.getItem('sp:lang')) || ''; } catch (e) { lang = ''; }
  if (!LANGS[lang]) lang = '';
  const chosen = !!lang;
  if (!lang) { const nl = (navigator.language || 'hu').slice(0, 2).toLowerCase(); lang = LANGS[nl] ? nl : 'hu'; }
  document.documentElement.lang = lang;

  let depth = 0;
  const D = () => (window.SERE_I18N && window.SERE_I18N[lang]) || null;
  const PAT = () => (window.SERE_I18N_PAT && window.SERE_I18N_PAT[lang]) || [];
  let known = null;
  function isKnown(k) {
    if (!known) { known = new Set(Object.values(D() || {})); const C = window['SERE_CONTENT_' + lang.toUpperCase()]; if (C) C.forEach(c => { known.add(c.title); known.add(c.sub); c.sections.forEach(x => { known.add(x.title); x.blocks.forEach(b => (b.items || [b.x]).forEach(v => known.add(String(v).replace(/\*\*/g, '')))); }); }); }
    return known.has(k);
  }
  function T(s) {
    if (lang === 'hu' || s == null) return s;
    const d = D(); if (!d) return s;
    const str = String(s), key = str.trim(); if (!key) return str;
    if (d[key] == null && isKnown(key)) return str;
    let tr = d[key];
    if (tr == null) {
      // számozott sor („3. szöveg”), zárójeles vagy kettőspontos folytatás
      let m = key.match(/^((?:[A-Za-z]+ )?\d+[.)]\s+)([\s\S]+)$/);
      if (m && d[m[2]] != null) tr = m[1] + d[m[2]];
      if (tr == null) { m = key.match(/^([\s\S]+?)([.:!?])$/); if (m && d[m[1]] != null) tr = d[m[1]] + m[2]; }
      if (tr == null) for (const [re, fn] of PAT()) { const mm = key.match(re); if (mm) { tr = typeof fn === 'function' ? fn(mm, T) : fn; break; } }
      // összetett szöveg: „ · ” vagy „, ” mentén darabolva, ha minden darab ismert
      if (tr == null && !depth) for (const sep of [' · ', ' › ', ', ']) {
        if (!key.includes(sep)) continue;
        const parts = key.split(sep); depth++;
        const out = parts.map(p => { const q = p.trim(); if (!q || !/[A-Za-zÀ-ž]/.test(q)) return { t: p, ok: true }; const t = T(q); return { t: p.replace(q, t), ok: t !== q }; });
        depth--;
        if (out.every(o => o.ok) || (sep === ' · ' && out.some(o => o.ok))) { tr = out.map(o => o.t).join(sep); break; }
      }
      // „Címke: érték”
      if (tr == null) { const mm = key.match(/^([^:]{2,40}): (.+)$/); if (mm && d[mm[1]] != null) { const r = /[A-Za-zÀ-ž]{2}/.test(mm[2]) ? T(mm[2]) : mm[2]; tr = d[mm[1]] + ': ' + r; } }
    }
    if (tr == null) { if (window.__i18nMiss && !depth && !/^[\d\s.,:;\/%°±+–—·›‹→()-]*$/.test(key)) window.__i18nMiss.add(key); return str; }
    return str.replace(key, tr);
  }
  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  let busy = false;
  function translate(root) {
    if (lang === 'hu' || !D() || !root) return;
    busy = true;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentNode && n.parentNode.closest && n.parentNode.closest('[data-notr],script,style,textarea')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = w.nextNode())) { const v = n.nodeValue; if (/[A-Za-zÀ-ž]/.test(v)) { const t = T(v); if (t !== v) n.nodeValue = t; } }
    if (root.querySelectorAll) root.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(el => ATTRS.forEach(a => { const v = el.getAttribute(a); if (v && /[A-Za-zÀ-ž]/.test(v)) { const t = T(v); if (t !== v) el.setAttribute(a, t); } }));
    busy = false;
  }
  function watch() {
    if (lang === 'hu') return;
    translate(document.body);
    new MutationObserver(ms => {
      if (busy) return;
      for (const m of ms) {
        if (m.type === 'characterData') { const v = m.target.nodeValue, t = T(v); if (t !== v) { busy = true; m.target.nodeValue = t; busy = false; } }
        else m.addedNodes.forEach(nd => { if (nd.nodeType === 1) translate(nd); else if (nd.nodeType === 3) { const v = nd.nodeValue, t = T(v); if (t !== v) { busy = true; nd.nodeValue = t; busy = false; } } });
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    // a <title> is
    document.title = T(document.title);
  }
  function set(l) { if (!LANGS[l]) return; try { localStorage.setItem('sp:lang', JSON.stringify(l)); } catch (e) { } }
  window.I18N = { get lang() { return lang; }, LANGS, T, translate, watch, set, chosen, get tts() { return LANGS[lang].tts; }, get loc() { return LANGS[lang].loc; } };
  window.T = T;
})();
