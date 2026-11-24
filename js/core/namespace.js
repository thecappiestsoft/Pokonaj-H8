/* Pokonaj H8 – jedna przestrzeń nazw aplikacji (bez modułów ES, aby działało z file://) */
(function () {
  'use strict';
  const PH8 = (window.PH8 = window.PH8 || {});
  PH8.version = '1.0.0';
  PH8.data = PH8.data || {};
  PH8.core = PH8.core || {};
  PH8.components = PH8.components || {};
  PH8.gameDefs = PH8.gameDefs || [];

  /** Rejestracja modułu gry (kontrakt opisany w dokumentacji, rozdz. 3.4). */
  PH8.registerGame = function (def) {
    if (!def || !def.id || typeof def.create !== 'function') {
      console.warn('[PH8] Niepoprawna definicja gry');
      return;
    }
    PH8.gameDefs.push(def);
  };

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  PH8.util = {
    esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]); },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
    uid(prefix) { return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
    fmtTime(ms) {
      const s = Math.max(0, Math.ceil(ms / 1000));
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    },
    clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); },
    sameSet(a, b) {
      const A = new Set(a), B = new Set(b);
      if (A.size !== B.size) return false;
      for (const x of A) if (!B.has(x)) return false;
      return true;
    }
  };
})();
