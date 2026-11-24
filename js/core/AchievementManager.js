/* AchievementManager – warunki zdobywania odznak */
(function (PH8) {
  'use strict';
  const ALL_GAMES = ['hejt-detector', 'social-media-challenge', 'twoja-decyzja', 'detektywi-internetu', 'escape-room', 'misja-stop-hate', 'bitwa-na-argumenty'];

  function P() { return PH8.core.ProgressManager; }

  const CONDITIONS = {
    first_game: () => P().completedGames().length >= 1,
    detector_ace: () => P().isCompleted('hejt-detector'),
    supporter: (ctx) => !!(ctx.flags && ctx.flags.supporter),
    puzzle_solver: () => P().isCompleted('escape-room'),
    team_voice: (ctx) => P().isCompleted('bitwa-na-argumenty') || !!(ctx.flags && ctx.flags.teamVoice),
    campaign_complete: () => (PH8.data.campaign.missions || []).every((m) => P().isMissionCompleted(m.id)),
    all_modes: () => ALL_GAMES.every((id) => P().isCompleted(id))
  };

  PH8.core.AchievementManager = {
    list() { return PH8.data.achievements.list; },
    /** Sprawdza warunki i zwraca nowo zdobyte odznaki. */
    evaluate(ctx) {
      ctx = ctx || {};
      const unlocked = [];
      this.list().forEach((def) => {
        const cond = CONDITIONS[def.id];
        if (!P().hasAchievement(def.id) && cond && cond(ctx)) {
          if (P().addAchievement(def.id)) unlocked.push(def);
        }
      });
      return unlocked;
    }
  };
})(window.PH8);
