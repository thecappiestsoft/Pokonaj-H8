/* ScoreManager – punkty rundy, XP i poziomy. Każdy klucz punktów naliczany jest tylko raz w sesji. */
(function (PH8) {
  'use strict';
  const DEFAULTS = { totalXp: 0, gamesCompleted: 0, committed: [] };
  let stats = PH8.util.clone(DEFAULTS);
  let session = null;

  function save() { PH8.core.StorageManager.write('stats', stats); }

  const ScoreManager = {
    load() {
      stats = PH8.core.StorageManager.read('stats', DEFAULTS);
      if (!Array.isArray(stats.committed)) stats.committed = [];
      stats.totalXp = Math.max(0, Number(stats.totalXp) || 0);
    },
    startSession(gameId) {
      session = { id: PH8.util.uid('s'), gameId: gameId, points: 0, keys: new Set() };
      return session;
    },
    sessionId() { return session ? session.id : null; },
    /** Nalicza punkty za dany klucz (np. id pytania). Zwraca false, jeśli klucz już naliczono. */
    award(key, points) {
      if (!session) return false;
      if (session.keys.has(key)) return false;
      session.keys.add(key);
      session.points += Math.max(0, Math.round(Number(points) || 0)); // bez ujemnych punktów
      return true;
    },
    getPoints() { return session ? session.points : 0; },
    /** Zapisuje XP z zakończonej gry – tylko raz dla danej sesji. */
    commit(xp, opts) {
      const key = (opts && opts.key) || (session && session.id);
      if (!key || stats.committed.includes(key)) return 0;
      const gained = Math.max(0, Math.round(Number(xp) || 0));
      stats.totalXp += gained;
      if (!opts || opts.countGame !== false) stats.gamesCompleted += 1;
      stats.committed.push(key);
      stats.committed = stats.committed.slice(-300);
      save();
      return gained;
    },
    /** XP przyznawane w trakcie gry (np. za misję kampanii). */
    addXp(key, xp) { return this.commit(xp, { key: key, countGame: false }); },
    getTotalXp() { return stats.totalXp; },
    getStats() { return Object.assign({}, stats); },
    getLevel(xp) {
      const levels = PH8.data.levels;
      let cur = levels[0];
      levels.forEach((l) => { if (xp >= l.min) cur = l; });
      const idx = levels.indexOf(cur);
      const next = levels[idx + 1] ? levels[idx + 1].min : null;
      return { level: cur.level, name: cur.name, min: cur.min, next: next };
    },
    reset() {
      stats = PH8.util.clone(DEFAULTS);
      save();
    }
  };

  PH8.core.ScoreManager = ScoreManager;
})(window.PH8);
