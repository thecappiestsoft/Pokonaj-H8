/* TeacherMode – narzędzia prowadzącego: szybki start, ustawienia lekcji, drużyny, kontakty pomocowe.
   Nazwy drużyn i punktacja drużyn są przechowywane wyłącznie w pamięci bieżącej sesji. */
(function (PH8) {
  'use strict';
  const { esc } = PH8.util;
  const C = PH8.core;
  const t = (k, p) => PH8.t(k, p);
  const L = (v) => PH8.L(v);
  const icon = (n) => PH8.icon(n);
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  const session = { count: 2, names: ['', '', '', '', ''], scores: {} };

  function defaultName(i) { return t('teams.default', { x: LETTERS[i] }); }

  function toggle(key, label, desc) {
    const S = C.SettingsManager;
    return '<label class="switch"><input type="checkbox" role="switch" data-setting="' + key + '"' + (S.get(key) ? ' checked' : '') + '>' +
      '<span class="switch__track" aria-hidden="true"></span>' +
      '<span class="switch__label">' + esc(label) + (desc ? '<br><small class="muted">' + esc(desc) + '</small>' : '') + '</span>' +
      '<span class="switch__state" data-on="' + esc(t('common.on')) + '" data-off="' + esc(t('common.off')) + '" aria-hidden="true"></span></label>';
  }

  function select(key, options, value) {
    return '<select class="select" id="tm-' + key + '" data-setting="' + key + '">' +
      options.map((o) => '<option value="' + esc(o.value) + '"' + (String(o.value) === String(value) ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('') +
      '</select>';
  }

  const TeacherMode = {
    /** Lista nazw drużyn (neutralnych). */
    list(max) {
      const n = Math.min(session.count, max || 5);
      const out = [];
      for (let i = 0; i < n; i++) {
        const v = (session.names[i] || '').trim().slice(0, 30);
        out.push(v || defaultName(i));
      }
      return out;
    },
    count() { return session.count; },
    rawNames() { return session.names.slice(); },
    setNames(names) {
      names.forEach((n, i) => { session.names[i] = String(n || '').slice(0, 30); });
    },
    setCount(n) { session.count = Math.max(2, Math.min(5, Number(n) || 2)); },
    addPoints(name, pts) { session.scores[name] = (session.scores[name] || 0) + Math.max(0, pts || 0); },
    scores() { return Object.assign({}, session.scores); },
    resetScores() { session.scores = {}; },
    clearTeams() { session.names = ['', '', '', '', '']; session.scores = {}; },

    render(el) {
      const S = C.SettingsManager;
      const games = C.GameManager.list();
      const missions = PH8.data.campaign.missions;
      const scores = Object.entries(session.scores).sort((a, b) => b[1] - a[1]);

      el.innerHTML =
        '<header class="view-head"><p class="kicker">' + icon('presentation') + esc(t('teacher.kicker')) + '</p>' +
          '<h1 tabindex="-1">' + esc(t('teacher.title')) + '</h1><p class="lead">' + esc(t('teacher.lead')) + '</p></header>' +

        '<div class="callout callout--safe">' + icon('shieldCheck') + '<div><strong>' + esc(t('teacher.safeTitle')) + '</strong>' +
          '<p>' + esc(t('teacher.safeBody')) + '</p></div></div>' +

        '<div class="grid-2 mt">' +
          '<section class="panel"><h2>' + icon('play') + esc(t('teacher.quick')) + '</h2>' +
            '<div class="quick-list">' + games.map((g) => {
              const m = C.GameManager.meta(g.id);
              return '<button type="button" class="quick-item" data-quick="' + g.id + '">' + icon(g.icon) + '<span>' + m.num + '. ' + esc(L(m.name)) + '</span><small>' + esc(m.time) + ' min</small></button>';
            }).join('') + '</div>' +
            '<h3 class="h-sm mt">' + icon('map') + esc(t('teacher.missions')) + '</h3>' +
            '<p class="muted">' + esc(t('teacher.missionsLead')) + '</p>' +
            '<div class="quick-list mt">' + missions.map((m, i) => '<button type="button" class="quick-item" data-mission="' + m.id + '">' + icon('flag') + '<span>' + (i + 1) + '. ' + esc(L(m.title)) + '</span></button>').join('') + '</div>' +
          '</section>' +

          '<section class="panel"><h2>' + icon('sliders') + esc(t('teacher.lesson')) + '</h2>' +
            '<div class="stack">' +
              '<label class="field" for="tm-playMode"><span>' + esc(t('teacher.playMode')) + '</span>' +
                select('playMode', ['class', 'team', 'individual'].map((v) => ({ value: v, label: t('mode.' + v) })), S.get('playMode')) + '</label>' +
              toggle('timerEnabled', t('set.timer'), t('set.timerDesc')) +
              '<label class="field" for="tm-questionCount"><span>' + esc(t('teacher.questionCount')) + '</span>' +
                select('questionCount', [5, 8, 10, 12, 15].map((v) => ({ value: v, label: String(v) })), S.get('questionCount')) + '</label>' +
              '<label class="field" for="tm-difficulty"><span>' + esc(t('teacher.difficulty')) + '</span>' +
                select('difficulty', ['easy', 'normal', 'hard'].map((v) => ({ value: v, label: t('difficulty.' + v) })), S.get('difficulty')) +
                '<small>' + esc(t('teacher.difficultyDesc')) + '</small></label>' +
              toggle('freeMode', t('teacher.freeMode'), t('teacher.freeModeDesc')) +
            '</div>' +
          '</section>' +

          '<section class="panel"><h2>' + icon('users') + esc(t('teacher.teams')) + '</h2>' +
            '<div class="stack">' +
              '<label class="field" for="tm-teamCount"><span>' + esc(t('teacher.teamCount')) + '</span>' +
                '<select class="select" id="tm-teamCount" data-team-count>' + [2, 3, 4, 5].map((n) => '<option value="' + n + '"' + (n === session.count ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label>' +
              '<div class="team-names">' + Array.from({ length: session.count }, (_, i) =>
                '<label class="field"><span>' + esc(t('teacher.teamName', { n: i + 1 })) + '</span>' +
                '<input class="input" type="text" maxlength="30" autocomplete="off" spellcheck="false" data-team-name="' + i + '" value="' + esc(session.names[i] || '') + '" placeholder="' + esc(defaultName(i)) + '"></label>').join('') + '</div>' +
              '<p class="note">' + icon('shield') + '<span>' + esc(t('teacher.teamsNote')) + '</span></p>' +
              '<h3 class="h-sm">' + icon('trophy') + esc(t('teacher.sessionScores')) + '</h3>' +
              (scores.length
                ? '<ol class="scoreboard">' + scores.map((s, i) => '<li><span class="scoreboard__pos">' + (i + 1) + '</span>' + esc(s[0]) + '<strong>' + s[1] + '</strong></li>').join('') + '</ol>'
                : '<p class="muted">' + esc(t('teacher.noScores')) + '</p>') +
              '<div class="row"><button type="button" class="btn btn--secondary" data-reset-scores>' + icon('restart') + esc(t('teacher.resetScores')) + '</button></div>' +
            '</div>' +
          '</section>' +

          '<section class="panel"><h2>' + icon('lifebuoy') + esc(t('teacher.contacts')) + '</h2>' +
            '<label class="field" for="tm-contacts"><span>' + esc(t('teacher.contactsLabel')) + '</span>' +
              '<textarea class="textarea" id="tm-contacts" maxlength="600" placeholder="' + esc(t('teacher.contactsPlaceholder')) + '">' + esc(S.get('helpContacts') || '') + '</textarea>' +
              '<small>' + esc(t('teacher.contactsNote')) + '</small></label>' +
            '<div class="row mt"><button type="button" class="btn btn--primary" data-save-contacts>' + icon('check') + esc(t('common.save')) + '</button>' +
              '<button type="button" class="btn btn--ghost" data-nav="help">' + icon('eye') + esc(t('teacher.previewHelp')) + '</button></div>' +
          '</section>' +

          '<section class="panel span-2"><h2>' + icon('clock') + esc(t('teacher.plan')) + '</h2>' +
            '<div class="table-wrap"><table class="table"><thead><tr><th scope="col">' + esc(t('teacher.planTime')) + '</th><th scope="col">' + esc(t('teacher.planActivity')) + '</th></tr></thead><tbody>' +
              PH8.tl('teacher.planRows').map((r) => '<tr><td><strong>' + esc(r[0]) + '</strong></td><td>' + esc(r[1]) + '</td></tr>').join('') +
            '</tbody></table></div>' +
            '<p class="note mt">' + icon('info') + '<span>' + esc(t('teacher.planNote')) + '</span></p>' +
          '</section>' +
        '</div>';

      el.addEventListener('change', (e) => {
        const s = e.target.closest('[data-setting]');
        if (s) {
          const key = s.dataset.setting;
          let v = s.type === 'checkbox' ? s.checked : s.value;
          if (key === 'questionCount') v = Number(v);
          S.set(key, v);
          C.UIManager.toast(t('common.saved'), 'success', 1800);
          return;
        }
        if (e.target.matches('[data-team-count]')) {
          TeacherMode.setCount(e.target.value);
          TeacherMode.render(el);
          const sel = document.querySelector('[data-team-count]');
          if (sel) sel.focus();
        }
      });
      el.addEventListener('input', (e) => {
        const n = e.target.closest('[data-team-name]');
        if (n) session.names[Number(n.dataset.teamName)] = n.value.slice(0, 30);
      });
      el.addEventListener('click', (e) => {
        const q = e.target.closest('[data-quick]');
        if (q) { C.AppController.go('instructions', { id: q.dataset.quick }); return; }
        const m = e.target.closest('[data-mission]');
        if (m) { C.GameManager.start('misja-stop-hate', { missionId: m.dataset.mission }); return; }
        if (e.target.closest('[data-reset-scores]')) {
          C.UIManager.confirm({ title: t('teacher.resetScores'), message: t('teacher.resetScoresConfirm'), danger: true, okLabel: t('common.reset') }).then((ok) => {
            if (!ok) return;
            TeacherMode.resetScores();
            TeacherMode.render(el);
            C.UIManager.toast(t('teacher.scoresCleared'), 'success');
          });
          return;
        }
        if (e.target.closest('[data-save-contacts]')) {
          const ta = el.querySelector('#tm-contacts');
          S.set('helpContacts', (ta.value || '').slice(0, 600));
          C.UIManager.toast(t('common.saved'), 'success');
        }
      });
    }
  };

  // re-render listenera nie dublujemy: każde render() dostaje świeży element widoku od AppController,
  // a przy zmianie liczby drużyn podmieniamy tylko jego zawartość – stąd klonowanie węzła:
  const originalRender = TeacherMode.render;
  TeacherMode.render = function (el) {
    const fresh = el.cloneNode(false);
    el.replaceWith(fresh);
    originalRender.call(TeacherMode, fresh);
  };

  C.TeacherMode = TeacherMode;
})(window.PH8);
