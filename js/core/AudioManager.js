/* AudioManager – krótkie efekty generowane lokalnie (Web Audio), bez plików z sieci.
   Dźwięk nie jest odtwarzany przed pierwszą interakcją użytkownika. */
(function (PH8) {
  'use strict';
  let ctx = null;
  let unlocked = false;

  function unlock() {
    unlocked = true;
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  }
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);

  const TONES = {
    click: [[620, 0.045]],
    correct: [[523, 0.09], [784, 0.15]],
    wrong: [[330, 0.12], [262, 0.18]],
    success: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.22]],
    unlock: [[440, 0.08], [880, 0.14]]
  };

  PH8.core.AudioManager = {
    play(name) {
      const S = PH8.core.SettingsManager;
      if (!unlocked || !S.get('soundEnabled')) return;
      const vol = Number(S.get('soundVolume')) || 0;
      if (vol <= 0) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        let t = ctx.currentTime;
        (TONES[name] || TONES.click).forEach(([freq, dur]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * 0.45), t + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t);
          o.stop(t + dur + 0.02);
          t += dur;
        });
      } catch (e) { /* dźwięk jest opcjonalny */ }
    }
  };
})(window.PH8);
