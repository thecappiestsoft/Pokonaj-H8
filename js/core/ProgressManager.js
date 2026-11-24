/* ProgressManager – ukończone tryby, misje, odznaki i ostatnia sesja */
(function (PH8) {
  'use strict';
  const DEFAULTS = { completedGames: [], startedGames: [], completedMissions: [], achievements: [] };
  let p = PH8.util.clone(DEFAULTS);

  function S() { return PH8.core.StorageManager; }
  function save() { S().write('progress', p); }
  function add(list, id) { if (!list.includes(id)) { list.push(id); return true; } return false; }

  PH8.core.ProgressManager = {
    load() {
      p = S().read('progress', DEFAULTS);
      Object.keys(DEFAULTS).forEach((k) => { if (!Array.isArray(p[k])) p[k] = []; });
    },
    getStatus(id) {
      if (p.completedGames.includes(id)) return 'completed';
      if (p.startedGames.includes(id)) return 'started';
      return 'available';
    },
    isCompleted(id) { return p.completedGames.includes(id); },
    completedGames() { return p.completedGames.slice(); },
    markStarted(id) {
      if (!p.completedGames.includes(id) && add(p.startedGames, id)) save();
    },
    markCompleted(id) {
      p.startedGames = p.startedGames.filter((x) => x !== id);
      add(p.completedGames, id);
      save();
    },
    completeMission(id) { if (add(p.completedMissions, id)) save(); },
    isMissionCompleted(id) { return p.completedMissions.includes(id); },
    completedMissions() { return p.completedMissions.slice(); },
    hasAchievement(id) { return p.achievements.includes(id); },
    addAchievement(id) { const ok = add(p.achievements, id); if (ok) save(); return ok; },
    achievements() { return p.achievements.slice(); },

    setLastSession(obj) { S().write('lastSession', obj); },
    getLastSession() { return S().read('lastSession', null); },
    clearLastSession() { S().remove('lastSession'); },

    reset() {
      p = PH8.util.clone(DEFAULTS);
      save();
      S().remove('lastSession');
    }
  };
})(window.PH8);
