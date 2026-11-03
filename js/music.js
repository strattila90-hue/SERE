/* SERE PIXEL — saját, generált chiptune „túlélő” zene (Web Audio, offline, nincs hangfájl) */
(function () {
  let ctx = null, NB = null, master = null, timer = null, step = 0, on = false, nextT = 0;
  const BPM = 72, SPB = 60 / BPM / 2; // nyolcadok
  // a-moll pentaton, sötét, lassú dallam (saját szerzemény)
  const N = { A2: 110, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196, A3: 220, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440 };
  const BASS = ['A2', 'A2', 'A2', 'A2', 'G3', 'G3', 'E3', 'E3', 'C3', 'C3', 'D3', 'D3', 'A2', 'A2', 'E3', 'E3'];
  const ARP = [['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['G3', 'D4', 'G4'], ['E3', 'A3', 'E4'], ['C4', 'E4', 'G4'], ['D4', 'G4', 'A4'], ['A3', 'C4', 'E4'], ['E3', 'G3', 'D4']];
  const MEL = [null, null, 'E4', null, 'D4', null, 'C4', null, null, null, 'A3', null, null, 'C4', 'D4', null,
    'E4', null, null, 'G4', 'E4', null, 'D4', null, 'C4', null, null, null, 'A3', null, null, null];

  function tone(f, t, d, type, vol, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(dest || master); o.start(t); o.stop(t + d + 0.05);
  }
  function noise(t, d, vol, f) {
    if (!NB) { const len = ctx.sampleRate * 2; NB = ctx.createBuffer(1, len, ctx.sampleRate); const ch = NB.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = NB; s.loop = true; flt.type = 'bandpass'; flt.frequency.value = f; flt.Q.value = 0.7;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + d * 0.4); g.gain.linearRampToValueAtTime(0, t + d);
    s.connect(flt).connect(g).connect(master); s.start(t); s.stop(t + d + 0.05);
  }
  function sched() {
    while (nextT < ctx.currentTime + 0.25) {
      const bar = Math.floor(step / 8), i = step % 8;
      if (i === 0) tone(N[BASS[bar % 16]] / 2, nextT, SPB * 7.5, 'triangle', 0.22);                 // basszus
      const arp = ARP[bar % 8]; tone(N[arp[i % 3]], nextT, SPB * 0.9, 'square', 0.025);               // pulzáló arpeggio
      const m = MEL[step % 32]; if (m && bar % 4 > 0) tone(N[m], nextT, SPB * 3, 'square', 0.045);    // dallam
      if (i === 0 || i === 5) tone(55, nextT, 0.18, 'sine', 0.25);                                     // távoli dob (szívverés)
      if (step % 64 === 0) noise(nextT, SPB * 32, 0.05, 500);                                          // szél
      if (i === 4 && Math.random() < 0.3) noise(nextT, 0.05, 0.03, 4000);                              // gally roppan
      nextT += SPB; step++;
    }
  }
  function start() {
    if (on) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      master = ctx.createGain(); master.gain.value = 0;
      master.connect(ctx.destination); master.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 2);
      nextT = ctx.currentTime + 0.1; step = 0; on = true; timer = setInterval(sched, 60);
    } catch (e) { on = false; }
  }
  function stop() {
    if (!on) return; on = false; clearInterval(timer);
    const m = master; m.gain.cancelScheduledValues(ctx.currentTime); m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
    m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6); setTimeout(() => m.disconnect(), 800);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden && on) { stop(); window.SEREMusic._resume = true; } else if (!document.hidden && window.SEREMusic._resume) { window.SEREMusic._resume = false; start(); } });
  window.SEREMusic = { start, stop, get on() { return on; }, _resume: false };
})();
