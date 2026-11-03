/* SERE PIXEL — gépi felolvasás (a telefon saját beszédmotorja, magyar hang) */
(function () {
  const synth = window.speechSynthesis;
  let voice = null, onEnd = null;
  function pick() {
    if (!synth) return;
    const vs = synth.getVoices();
    voice = vs.find(v => /^hu/i.test(v.lang) && v.localService) || vs.find(v => /^hu/i.test(v.lang)) || null;
  }
  if (synth) { pick(); synth.onvoiceschanged = pick; }
  function clean(t) { return String(t).replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/[•▸›‹→✓★]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function speak(texts, opts = {}) {
    if (!synth) return false;
    stop();
    const list = (Array.isArray(texts) ? texts : [texts]).map(clean).filter(Boolean);
    list.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'hu-HU'; if (voice) u.voice = voice;
      u.rate = opts.rate || 0.95; u.pitch = opts.pitch || 1;
      if (i === list.length - 1) u.onend = () => { onEnd && onEnd(); };
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
