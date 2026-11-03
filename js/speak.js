/* SERE PIXEL — gépi felolvasás (a telefon saját beszédmotorja, magyar hang) */
(function () {
  const synth = window.speechSynthesis;
  let voice = null, onEnd = null;
  function pick() {
    if (!synth) return;
    const vs = synth.getVoices();
    const L = (window.I18N && I18N.lang) || 'hu'; const re = new RegExp('^' + L, 'i');
    voice = vs.find(v => re.test(v.lang) && v.localService) || vs.find(v => re.test(v.lang)) || null;
  }
  if (synth) { pick(); synth.onvoiceschanged = pick; }
  function clean(t) { return String(t).replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/[•▸›‹→✓★]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function speak(texts, opts = {}) {
    if (!synth) return false;
    stop();
    const tr = window.T || (x => x);
    const list = (Array.isArray(texts) ? texts : [texts]).map(x => clean(tr(x))).filter(Boolean);
    list.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = (window.I18N && I18N.tts) || 'hu-HU'; if (voice) u.voice = voice;
      u.rate = opts.rate || 0.95; u.pitch = opts.pitch || 1;
      if (opts.onItem) u.onstart = () => opts.onItem(i);
      if (i === list.length - 1) u.onend = () => { onEnd && onEnd(); opts.onDone && opts.onDone(); };
      synth.speak(u);
    });
    return true;
  }
  function stop() { if (synth) synth.cancel(); }
  window.SERESpeak = {
    speak, stop,
    get ok() { return !!synth; },
    get hasHu() { return !!voice; },
    get speaking() { return !!synth && synth.speaking; },
    set onEnd(f) { onEnd = f; }
  };
})();
