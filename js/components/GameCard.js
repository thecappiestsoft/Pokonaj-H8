/* GameCard – karta gry w menu głównym */
(function (PH8) {
  'use strict';
  const { esc } = PH8.util;
  const STATUS_ICON = { available: 'circle', started: 'circleDot', completed: 'check' };

  PH8.components.GameCard = {
    html(def, meta, status) {
      const t = PH8.t, L = PH8.L, icon = PH8.icon;
      const modes = def.modes.map((m) => t('mode.' + m)).join(' · ');
      return '' +
        '<article class="game-card game-card--' + (def.accent || 'primary') + '">' +
          '<div class="game-card__top">' +
            '<span class="game-card__icon">' + icon(def.icon) + '</span>' +
            '<span class="game-card__num">' + esc(t('game.modeN', { n: meta.num })) + '</span>' +
            '<span class="status status--' + status + '">' + icon(STATUS_ICON[status]) + esc(t('status.' + status)) + '</span>' +
          '</div>' +
          '<h2 class="game-card__title">' + esc(L(meta.name)) + '</h2>' +
          '<p class="game-card__desc">' + esc(L(meta.desc)) + '</p>' +
          '<ul class="game-card__meta">' +
            '<li>' + icon('clock') + esc(t('game.minutes', { time: meta.time })) + '</li>' +
            '<li>' + icon('users') + esc(modes) + '</li>' +
          '</ul>' +
          '<div class="game-card__actions">' +
            '<button type="button" class="btn btn--primary" data-play="' + def.id + '">' + icon('play') + esc(t('game.play')) + '</button>' +
            '<button type="button" class="btn btn--ghost" data-instr="' + def.id + '" aria-label="' + esc(t('game.instructionsFor', { name: L(meta.name) })) + '">' + icon('book') + esc(t('game.instructions')) + '</button>' +
          '</div>' +
        '</article>';
    }
  };
})(window.PH8);
