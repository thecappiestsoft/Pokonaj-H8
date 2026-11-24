/* Views – ekrany aplikacji poza rozgrywką: start, menu, instrukcja, ustawienia, pomoc, osiągnięcia */
(function (PH8) {
  'use strict';
  const { esc } = PH8.util;
  const C = PH8.core;
  const t = (k, p) => PH8.t(k, p);
  const L = (v) => PH8.L(v);
  const icon = (n) => PH8.icon(n);

  function instructionsBody(id) {
    const def = C.GameManager.get(id);
    const m = C.GameManager.meta(id);
    return '' +
      '<div class="grid-2">' +
        '<div class="panel"><h2>' + icon('target') + esc(t('instr.goal')) + '</h2><p>' + esc(L(m.goal)) + '</p></div>' +
        '<div class="panel"><h2>' + icon('book') + esc(t('instr.rules')) + '</h2><ul>' + m.rules.map((r) => '<li>' + esc(L(r)) + '</li>').join('') + '</ul></div>' +
        '<div class="panel"><h2>' + icon('hand') + esc(t('instr.controls')) + '</h2><p>' + esc(L(m.controls)) + '</p></div>' +
        '<div class="panel"><h2>' + icon('clock') + esc(t('instr.timeAndMode')) + '</h2>' +
          '<ul class="list-plain stack">' +
            '<li><strong>' + esc(t('instr.time')) + ':</strong> ' + esc(t('game.minutes', { time: m.time })) + '</li>' +
            '<li><strong>' + esc(t('instr.modes')) + ':</strong> ' + esc(def.modes.map((x) => t('mode.' + x)).join(' · ')) + '</li>' +
            '<li><strong>' + esc(t('instr.timer')) + ':</strong> ' + esc(C.SettingsManager.get('timerEnabled') ? t('common.on') : t('common.off')) + (m.timerNote ? ' – ' + esc(L(m.timerNote)) : '') + '</li>' +
          '</ul></div>' +
      '</div>';
  }

  const Views = {
    splash(el) {
      el.innerHTML =
        '<section class="splash">' +
          PH8.logo() +
          '<h1 class="splash__title" tabindex="-1">POKONAJ <span>H8</span></h1>' +
          '<p class="splash__tagline">' + esc(t('app.tagline')) + '</p>' +
          '<p class="splash__desc">' + esc(t('splash.desc')) + '</p>' +
          '<div class="splash__chips">' +
            '<span class="chip">' + icon('puzzle') + esc(t('splash.chip1')) + '</span>' +
            '<span class="chip">' + icon('wifi') + esc(t('splash.chip2')) + '</span>' +
            '<span class="chip">' + icon('shield') + esc(t('splash.chip3')) + '</span>' +
          '</div>' +
          '<button type="button" class="btn btn--primary btn--lg" data-nav="menu">' + icon('play') + esc(t('splash.start')) + '</button>' +
        '</section>';
    },

    menu(el) {
      const games = C.GameManager.list();
      const total = C.ScoreManager.getTotalXp();
      const lvl = C.ScoreManager.getLevel(total);
      const ach = C.ProgressManager.achievements().length;
      const achTotal = PH8.data.achievements.list.length;
      el.innerHTML =
        '<div class="menu-hero"><div>' +
          '<p class="kicker">' + icon('sparkle') + esc(t('menu.kicker')) + '</p>' +
          '<h1 class="menu-hero__title" tabindex="-1">' + esc(t('menu.title')) + '</h1>' +
          '<p class="lead">' + esc(t('menu.lead')) + '</p>' +
        '</div></div>' +
        '<div class="grid-games">' + games.map((g) => PH8.components.GameCard.html(g, C.GameManager.meta(g.id), C.ProgressManager.getStatus(g.id))).join('') + '</div>' +
        '<div class="menu-footer">' +
          '<div class="panel level-panel">' +
            '<div class="level-panel__badge" aria-hidden="true">' + lvl.level + '</div>' +
            '<div class="level-panel__body">' +
              '<p class="kicker">' + esc(t('level.label', { n: lvl.level })) + '</p>' +
              '<h2>' + esc(L(lvl.name)) + '</h2>' +
              (lvl.next ? C.UIManager.progress(total - lvl.min, lvl.next - lvl.min, t('level.progress')) : C.UIManager.progress(1, 1, t('level.progress'))) +
              '<p class="muted">' + total + ' XP · ' + esc(lvl.next ? t('level.toNext', { xp: lvl.next - total }) : t('level.max')) + '</p>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="panel panel--button ach-panel" data-nav="achievements">' + icon('trophy') +
            '<span><strong>' + ach + ' / ' + achTotal + '</strong><span class="muted">' + esc(t('menu.badges')) + '</span></span></button>' +
          '<button type="button" class="btn btn--secondary btn--lg" data-howto>' + icon('help') + esc(t('menu.howto')) + '</button>' +
        '</div>';

      el.addEventListener('click', (e) => {
        const p = e.target.closest('[data-play]');
        if (p) { C.AppController.go('instructions', { id: p.dataset.play }); return; }
        const i = e.target.closest('[data-instr]');
        if (i) { Views.instructionsModal(i.dataset.instr); return; }
        if (e.target.closest('[data-howto]')) Views.howto();
      });
    },

    instructionsModal(id) {
      const m = C.GameManager.meta(id);
      C.UIManager.modal({
        title: L(m.name),
        icon: 'book',
        wide: true,
        body: instructionsBody(id),
        actions: [
          { label: t('common.close'), variant: 'secondary' },
          { label: t('game.play'), variant: 'primary', icon: 'play', onClick: () => { C.AppController.go('instructions', { id: id }); } }
        ]
      });
    },

    instructions(el, params) {
      const id = params && params.id;
      const def = C.GameManager.get(id);
      if (!def) { C.AppController.go('menu', null, { force: true }); return; }
      const m = C.GameManager.meta(id);
      const mode = C.GameManager.defaultMode(def);
      const teamsInfo = def.modes.includes('team')
        ? '<p class="note">' + icon('users') + '<span>' + esc(t('instr.teamsInfo', { teams: C.TeacherMode.list().join(', ') })) + '</span></p>'
        : '';
      el.innerHTML =
        '<button type="button" class="btn btn--ghost" data-nav="menu">' + icon('arrowLeft') + esc(t('common.backToMenu')) + '</button>' +
        '<header class="instr-head">' +
          '<span class="game-card__icon">' + icon(def.icon) + '</span>' +
          '<div><p class="kicker">' + esc(t('game.modeN', { n: m.num })) + ' · ' + esc(t('instr.kicker')) + '</p>' +
          '<h1 tabindex="-1">' + esc(L(m.name)) + '</h1>' +
          '<div class="instr-meta"><span class="chip">' + icon('clock') + esc(t('game.minutes', { time: m.time })) + '</span>' +
            def.modes.map((x) => '<span class="chip chip--muted">' + icon('users') + esc(t('mode.' + x)) + '</span>').join('') + '</div></div>' +
        '</header>' +
        instructionsBody(id) +
        '<div class="instr-start panel mt">' +
          '<div class="stack">' +
            '<label class="field" for="mode-select"><span>' + esc(t('instr.modeSelect')) + '</span>' +
              '<select class="select" id="mode-select">' + def.modes.map((x) => '<option value="' + x + '"' + (x === mode ? ' selected' : '') + '>' + esc(t('mode.' + x)) + '</option>').join('') + '</select></label>' +
            teamsInfo +
          '</div>' +
          '<button type="button" class="btn btn--primary btn--lg" data-start>' + icon('play') + esc(t('instr.start')) + '</button>' +
        '</div>';
      el.querySelector('[data-start]').addEventListener('click', () => {
        const sel = el.querySelector('#mode-select');
        C.GameManager.start(id, { mode: sel ? sel.value : mode });
      });
    },

    settings(el) {
      const S = C.SettingsManager;
      const toggle = (key, label, desc) =>
        '<label class="switch"><input type="checkbox" role="switch" data-setting="' + key + '"' + (S.get(key) ? ' checked' : '') + '>' +
        '<span class="switch__track" aria-hidden="true"></span>' +
        '<span class="switch__label">' + esc(label) + (desc ? '<br><small class="muted">' + esc(desc) + '</small>' : '') + '</span>' +
        '<span class="switch__state" data-on="' + esc(t('common.on')) + '" data-off="' + esc(t('common.off')) + '" aria-hidden="true"></span></label>';
      const vol = Math.round((Number(S.get('soundVolume')) || 0) * 100);
      const storageInfo = C.StorageManager.isAvailable()
        ? (C.StorageManager.hasWriteFailed() ? t('storage.writeError') : t('storage.ok'))
        : t('storage.unavailable');

      el.innerHTML =
        '<header class="view-head"><p class="kicker">' + icon('sliders') + esc(t('nav.settings')) + '</p>' +
          '<h1 tabindex="-1">' + esc(t('set.title')) + '</h1><p class="lead">' + esc(t('set.lead')) + '</p></header>' +
        '<div class="grid-2">' +
          '<section class="panel"><h2>' + icon('volume') + esc(t('set.sound')) + '</h2><div class="stack">' +
            toggle('soundEnabled', t('set.soundEnabled'), t('set.soundDesc')) +
            '<label class="field" for="vol"><span>' + esc(t('set.volume')) + ': <output id="vol-out">' + vol + '%</output></span>' +
              '<input id="vol" type="range" min="0" max="1" step="0.05" value="' + S.get('soundVolume') + '" data-setting="soundVolume"></label>' +
            '<div><button type="button" class="btn btn--ghost" data-test-sound>' + icon('play') + esc(t('set.testSound')) + '</button></div>' +
          '</div></section>' +
          '<section class="panel"><h2>' + icon('eye') + esc(t('set.a11y')) + '</h2><div class="stack">' +
            toggle('animationsEnabled', t('set.animations'), t('set.animationsDesc')) +
            toggle('highContrast', t('set.contrast'), t('set.contrastDesc')) +
            toggle('largeText', t('set.largeText'), t('set.largeTextDesc')) +
            '<p class="note">' + icon('info') + '<span>' + esc(t('set.themeNote')) + '</span></p>' +
            '<div class="field"><span>' + esc(t('skin.label')) + '</span><div class="row">' +
              ['desktop', 'phone', 'retro'].map((k) => '<button type="button" class="btn btn--ghost" data-skin-set="' + k + '" aria-pressed="' + (S.get('skin') === k) + '">' +
                icon(k === 'desktop' ? 'monitor' : (k === 'phone' ? 'phone' : 'window')) + esc(t('skin.' + k)) + '</button>').join('') +
            '</div></div>' +
          '</div></section>' +
          '<section class="panel"><h2>' + icon('clock') + esc(t('set.gameplay')) + '</h2><div class="stack">' +
            toggle('timerEnabled', t('set.timer'), t('set.timerDesc')) +
            '<p class="note">' + icon('presentation') + '<span>' + esc(t('set.teacherNote')) + '</span></p>' +
          '</div></section>' +
          '<section class="panel panel--danger"><h2>' + icon('trash') + esc(t('set.data')) + '</h2><div class="stack">' +
            '<p class="note">' + icon('shield') + '<span>' + esc(storageInfo) + ' ' + esc(t('set.privacy')) + '</span></p>' +
            '<div class="row">' +
              '<button type="button" class="btn btn--secondary" data-reset="progress">' + icon('restart') + esc(t('set.resetProgress')) + '</button>' +
              '<button type="button" class="btn btn--secondary" data-reset="settings">' + icon('sliders') + esc(t('set.resetSettings')) + '</button>' +
              '<button type="button" class="btn btn--danger" data-reset="all">' + icon('trash') + esc(t('set.resetAll')) + '</button>' +
            '</div>' +
          '</div></section>' +
        '</div>';

      el.addEventListener('change', (e) => {
        const s = e.target.closest('[data-setting]');
        if (!s) return;
        const v = s.type === 'checkbox' ? s.checked : Number(s.value);
        S.set(s.dataset.setting, v);
      });
      el.addEventListener('input', (e) => {
        if (e.target.id === 'vol') el.querySelector('#vol-out').textContent = Math.round(Number(e.target.value) * 100) + '%';
      });
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-test-sound]')) { C.AudioManager.play('success'); return; }
        const r = e.target.closest('[data-reset]');
        if (!r) return;
        const what = r.dataset.reset;
        C.UIManager.confirm({
          title: t('set.resetTitle'),
          message: t('set.resetConfirm.' + what),
          okLabel: t('common.reset'),
          danger: true
        }).then((ok) => {
          if (!ok) return;
          if (what === 'progress' || what === 'all') { C.ProgressManager.reset(); C.ScoreManager.reset(); C.TeacherMode.clearTeams(); }
          if (what === 'settings' || what === 'all') S.reset();
          C.UIManager.toast(t('set.resetDone'), 'success');
          C.AppController.render();
        });
      });
    },

    help(el) {
      const contacts = (C.SettingsManager.get('helpContacts') || '').trim();
      el.innerHTML =
        '<header class="view-head help-hero">' +
          '<span class="help-hero__icon">' + icon('lifebuoy') + '</span>' +
          '<div><p class="kicker">' + esc(t('help.kicker')) + '</p><h1 tabindex="-1">' + esc(t('help.title')) + '</h1>' +
          '<p class="lead">' + esc(t('help.lead')) + '</p></div>' +
        '</header>' +
        '<div class="grid-2">' +
          '<section class="panel"><h2>' + icon('users') + esc(t('help.whoTitle')) + '</h2><ul class="list-check">' +
            PH8.tl('help.who').map((x) => '<li>' + icon('check') + '<span>' + esc(x) + '</span></li>').join('') + '</ul></section>' +
          '<section class="panel"><h2>' + icon('school') + esc(t('help.contactsTitle')) + '</h2>' +
            (contacts ? '<div class="contacts">' + esc(contacts) + '</div>' : '<p class="muted">' + esc(t('help.noContacts')) + '</p>') +
          '</section>' +
          '<section class="panel"><h2>' + icon('shieldCheck') + esc(t('help.stepsTitle')) + '</h2><ul class="list-check">' +
            PH8.tl('help.steps').map((x) => '<li>' + icon('check') + '<span>' + esc(x) + '</span></li>').join('') + '</ul></section>' +
          '<section class="panel"><h2>' + icon('heart') + esc(t('help.feelTitle')) + '</h2><ul class="list-check">' +
            PH8.tl('help.feel').map((x) => '<li>' + icon('check') + '<span>' + esc(x) + '</span></li>').join('') + '</ul></section>' +
        '</div>' +
        '<div class="callout callout--warn mt">' + icon('alert') + '<div><strong>' + esc(t('help.urgentTitle')) + '</strong><p>' + esc(t('help.urgent')) + '</p></div></div>' +
        '<div class="callout callout--info mt">' + icon('info') + '<div><p>' + esc(t('help.disclaimer')) + '</p></div></div>' +
        '<div class="row mt"><button type="button" class="btn btn--primary" data-nav="menu">' + icon('home') + esc(t('common.backToMenu')) + '</button></div>';
    },

    achievements(el) {
      const total = C.ScoreManager.getTotalXp();
      const lvl = C.ScoreManager.getLevel(total);
      const st = C.ScoreManager.getStats();
      el.innerHTML =
        '<header class="view-head"><p class="kicker">' + icon('trophy') + esc(t('nav.achievements')) + '</p>' +
          '<h1 tabindex="-1">' + esc(t('ach.title')) + '</h1><p class="lead">' + esc(t('ach.lead')) + '</p></header>' +
        '<div class="stats">' +
          '<div class="stat"><span class="stat__label">' + esc(t('level.label', { n: lvl.level })) + '</span><strong class="stat__value">' + esc(L(lvl.name)) + '</strong></div>' +
          '<div class="stat"><span class="stat__label">XP</span><strong class="stat__value">' + total + '</strong></div>' +
          '<div class="stat"><span class="stat__label">' + esc(t('ach.games')) + '</span><strong class="stat__value">' + C.ProgressManager.completedGames().length + ' / 7</strong></div>' +
          '<div class="stat"><span class="stat__label">' + esc(t('ach.sessions')) + '</span><strong class="stat__value">' + (st.gamesCompleted || 0) + '</strong></div>' +
        '</div>' +
        '<h2 class="h-sm mt-lg">' + icon('award') + esc(t('ach.badges')) + '</h2>' +
        '<div class="ach-grid mt">' + PH8.data.achievements.list.map((a) => {
          const has = C.ProgressManager.hasAchievement(a.id);
          return '<div class="ach' + (has ? ' is-unlocked' : '') + '"><span class="ach__icon">' + icon(has ? a.icon : 'lock') + '</span>' +
            '<div><strong>' + esc(L(a.name)) + '</strong><div class="muted">' + esc(L(a.desc)) + '</div>' +
            '<span class="ach__state">' + icon(has ? 'check' : 'lock') + esc(has ? t('ach.unlockedState') : t('ach.lockedState')) + '</span></div></div>';
        }).join('') + '</div>' +
        '<h2 class="h-sm mt-lg">' + icon('trendUp') + esc(t('ach.levels')) + '</h2>' +
        '<div class="panel mt"><div class="table-wrap"><table class="table"><thead><tr><th scope="col">' + esc(t('ach.level')) + '</th><th scope="col">XP</th><th scope="col">' + esc(t('ach.levelName')) + '</th></tr></thead><tbody>' +
          PH8.data.levels.map((l, i, arr) => '<tr' + (l.level === lvl.level ? ' style="font-weight:800"' : '') + '><td>' + l.level + (l.level === lvl.level ? ' ◀' : '') + '</td><td>' + l.min + (arr[i + 1] ? '–' + (arr[i + 1].min - 1) : '+') + '</td><td>' + esc(L(l.name)) + '</td></tr>').join('') +
        '</tbody></table></div></div>' +
        '<p class="note mt">' + icon('info') + '<span>' + esc(t('results.note')) + '</span></p>';
    },

    howto() {
      C.UIManager.modal({
        title: t('menu.howto'),
        icon: 'help',
        wide: true,
        body: '<ol class="list-num">' + PH8.tl('howto.steps').map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>' +
          '<div class="callout callout--info mt">' + icon('wifi') + '<div><p>' + esc(t('howto.offline')) + '</p></div></div>',
        actions: [{ label: t('common.understood'), variant: 'primary', icon: 'check' }]
      });
    }
  };

  C.Views = Views;
})(window.PH8);
