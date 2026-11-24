/* 6.7 Bitwa na Argumenty – moderowana debata drużyn z jawną rubryką */
(function (PH8) {
  'use strict';
  const LETTERS = ['A', 'B', 'C', 'D'];

  PH8.registerGame({
    id: 'bitwa-na-argumenty',
    icon: 'scale',
    accent: 'secondary',
    modes: ['team'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null, state = null, timer = null;

      function newState() {
        const count = Math.max(2, Math.min(4, ctx.teams.count()));
        return {
          phase: 'setup', count: count,
          names: ctx.teams.rawNames().slice(0, 4),
          teams: [], topicId: null, used: new Set(), round: 0,
          scores: null, lastRound: null, timerKind: null
        };
      }

      const topic = () => data.topics.find((x) => x.id === state.topicId);
      const defaultName = (i) => t('teams.default', { x: LETTERS[i] });

      function emptyScores() {
        return state.teams.map(() => data.rubric.reduce((o, r) => { o[r.id] = 0; return o; }, {}));
      }
      const sum = (o) => Object.keys(o).reduce((a, k) => a + o[k], 0);

      function progress() {
        const label = state.phase === 'setup' ? t('bit.phase.setup')
          : state.phase === 'topics' ? t('bit.phase.topics', { n: state.round })
          : state.phase === 'summary' ? t('bit.phase.summary', { n: state.round })
          : t('bit.phase.round', { n: state.round + 1 });
        ctx.onProgress(state.used.size, data.topics.length, label);
      }

      function stopTimer() { if (timer) timer.stop(); timer = null; state.timerKind = null; ctx.hideTimer(); }

      function startTimer(kind) {
        if (!ctx.config.timerEnabled) return;
        stopTimer();
        const secs = kind === 'prep' ? data.prepSeconds : data.speechSeconds;
        state.timerKind = kind;
        timer = ctx.createTimer({
          duration: secs * 1000,
          onEnd: () => { ctx.audio.play('unlock'); ctx.toast(t('bit.timeOver'), 'info'); state.timerKind = null; ctx.hideTimer(); render(); }
        });
        timer.start();
        render();
      }

      function begin() {
        const names = [];
        for (let i = 0; i < state.count; i++) {
          const v = (state.names[i] || '').trim().slice(0, 30);
          names.push(v || defaultName(i));
        }
        state.teams = names.map((n) => ({ name: n, score: 0 }));
        state.phase = 'topics';
        progress(); render(); ctx.focus('h2[tabindex]');
      }

      function pickTopic(id) {
        if (!data.topics.some((x) => x.id === id)) return;
        state.topicId = id;
        state.phase = 'round';
        state.scores = emptyScores();
        progress(); render(); ctx.focus('h2[tabindex]');
      }

      function confirmRound() {
        if (state.phase !== 'score') return;
        state.round++;
        state.used.add(state.topicId);
        const roundPts = state.scores.map(sum);
        state.teams.forEach((tm, i) => { tm.score += roundPts[i]; ctx.teams.addPoints(tm.name, roundPts[i]); });
        ctx.onScore('round:' + state.round + ':' + state.topicId, data.xpPerRound);
        state.lastRound = { topicId: state.topicId, scores: state.scores.map((s) => Object.assign({}, s)), pts: roundPts };
        state.phase = 'summary';
        stopTimer();
        ctx.audio.play('success');
        progress(); render(); ctx.focus('h2[tabindex]');
      }

      async function stopRound() {
        const ok = await ctx.confirm({ title: t('bit.stopTitle'), message: t('bit.stopBody'), okLabel: t('bit.stopOk'), danger: true });
        if (!ok || !state) return;
        stopTimer();
        state.phase = 'topics';
        state.topicId = null;
        progress(); render();
        ctx.toast(t('bit.stopped'), 'info');
      }

      function finish() {
        stopTimer();
        const board = state.teams.slice().sort((a, b) => b.score - a.score);
        const rounds = state.round;
        ctx.onComplete({
          points: ctx.getPoints(),
          xp: Math.min(300, ctx.getPoints()),
          summary: data.summary,
          stats: [{ label: { pl: 'Rozegrane rundy', en: 'Rounds played' }, value: String(rounds) }],
          discussion: data.discussion,
          flags: { teamVoice: true },
          extra: () => '<div class="panel"><h2>' + icon('trophy') + esc(t('bit.scoreboard')) + '</h2><ol class="scoreboard">' +
            board.map((tm, i) => '<li><span class="scoreboard__pos">' + (i + 1) + '</span>' + esc(tm.name) + '<strong>' + tm.score + '</strong></li>').join('') + '</ol>' +
            '<p class="note mt">' + icon('info') + '<span>' + esc(t('bit.finalNote')) + '</span></p></div>'
        });
        state.names = ['', '', '', '']; // nazwy drużyn nie są przechowywane
      }

      // --- widoki ---
      function scoreboardHtml() {
        return '<ol class="scoreboard">' + state.teams.slice().sort((a, b) => b.score - a.score)
          .map((tm, i) => '<li><span class="scoreboard__pos">' + (i + 1) + '</span>' + esc(tm.name) + '<strong>' + tm.score + '</strong></li>').join('') + '</ol>';
      }

      function renderSetup() {
        ctx.root.innerHTML =
          '<div class="debate">' +
            '<section class="card"><h2 tabindex="-1">' + icon('users') + esc(t('bit.setupTitle')) + '</h2><p class="muted">' + esc(t('bit.setupLead')) + '</p>' +
              '<div class="stack mt">' +
                '<label class="field" for="bit-count" style="max-width:240px"><span>' + esc(t('teacher.teamCount')) + '</span>' +
                  '<select class="select" id="bit-count" data-change="count">' + [2, 3, 4].map((n) => '<option value="' + n + '"' + (n === state.count ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label>' +
                '<div class="team-setup">' + Array.from({ length: state.count }, (_, i) =>
                  '<label class="field"><span>' + esc(t('teacher.teamName', { n: i + 1 })) + '</span><input class="input" type="text" maxlength="30" autocomplete="off" data-team="' + i + '" value="' + esc(state.names[i] || '') + '" placeholder="' + esc(defaultName(i)) + '"></label>').join('') + '</div>' +
                '<p class="note">' + icon('shield') + '<span>' + esc(t('teacher.teamsNote')) + '</span></p>' +
                '<p class="note">' + icon('eye') + '<span>' + esc(t('bit.observerNote')) + '</span></p>' +
              '</div></section>' +
            '<section class="card"><h2 class="h-sm">' + icon('scale') + esc(t('bit.rubric')) + '</h2><ul class="list-check mt">' +
              data.rubric.map((r) => '<li>' + icon('check') + '<span>' + esc(L(r.label)) + ' (0–5)</span></li>').join('') + '</ul>' +
              '<p class="note mt">' + icon('info') + '<span>' + esc(t('bit.noPoints')) + '</span></p></section>' +
            '<div class="row row--end"><button type="button" class="btn btn--primary btn--lg" data-action="begin">' + icon('play') + esc(t('bit.begin')) + '</button></div>' +
          '</div>';
        ctx.root.querySelectorAll('[data-team]').forEach((inp) => inp.addEventListener('input', () => { state.names[Number(inp.dataset.team)] = inp.value.slice(0, 30); }));
      }

      function renderTopics() {
        const left = data.topics.filter((x) => !state.used.has(x.id));
        ctx.root.innerHTML =
          '<div class="debate">' +
            '<div class="row row--between"><h2 tabindex="-1">' + icon('messages') + ' ' + esc(t('bit.chooseTopic')) + '</h2>' +
              (left.length ? '<button type="button" class="btn btn--secondary" data-action="random">' + icon('sparkle') + esc(t('bit.random')) + '</button>' : '') + '</div>' +
            '<div class="topic-grid">' + data.topics.map((x) => {
              const used = state.used.has(x.id);
              return '<button type="button" class="choice topic-card' + (used ? ' is-used' : '') + '" data-action="pickTopic" data-value="' + x.id + '">' +
                '<span class="chip ' + (used ? 'chip--muted' : '') + '">' + icon(used ? 'check' : 'mic') + esc(used ? t('bit.used') : t('bit.topic')) + '</span>' +
                '<span class="choice__label">' + esc(L(x.statement)) + '</span></button>';
            }).join('') + '</div>' +
            (state.teams.length ? '<section class="card"><h2 class="h-sm">' + icon('trophy') + esc(t('bit.scoreboard')) + '</h2>' + scoreboardHtml() + '</section>' : '') +
            '<div class="row row--end"><button type="button" class="btn btn--ghost btn--lg" data-action="finish">' + icon('flag') + esc(t('bit.endGame')) + '</button></div>' +
          '</div>';
      }

      function renderRound() {
        const tp = topic();
        const timerOn = ctx.config.timerEnabled;
        ctx.root.innerHTML =
          '<div class="debate">' +
            '<div class="statement"><p class="kicker">' + icon('mic') + esc(t('bit.roundN', { n: state.round + 1 })) + '</p>' +
              '<h2 tabindex="-1" class="sr-only">' + esc(t('bit.statement')) + '</h2><q>' + esc(L(tp.statement)) + '</q></div>' +
            '<div class="grid-2">' +
              '<section class="card"><h2 class="h-sm">' + icon('help') + esc(t('bit.prompts')) + '</h2><ul class="list-check mt">' +
                tp.prompts.map((p) => '<li>' + icon('arrowRight') + '<span>' + esc(L(p)) + '</span></li>').join('') + '</ul>' +
                '<p class="note mt">' + icon('book') + '<span>' + esc(t('bit.structure')) + '</span></p></section>' +
              '<section class="card"><h2 class="h-sm">' + icon('clock') + esc(t('bit.timers')) + '</h2>' +
                (timerOn
                  ? '<div class="timer-row mt">' +
                      '<button type="button" class="btn btn--secondary" data-action="timer" data-value="prep"' + (state.timerKind === 'prep' ? ' aria-pressed="true"' : '') + '>' + icon('hourglass') + esc(t('bit.prep', { time: PH8.util.fmtTime(data.prepSeconds * 1000) })) + '</button>' +
                      '<button type="button" class="btn btn--secondary" data-action="timer" data-value="speech"' + (state.timerKind === 'speech' ? ' aria-pressed="true"' : '') + '>' + icon('mic') + esc(t('bit.speech', { time: PH8.util.fmtTime(data.speechSeconds * 1000) })) + '</button>' +
                      (state.timerKind ? '<button type="button" class="btn btn--ghost" data-action="timerStop">' + icon('x') + esc(t('bit.timerStop')) + '</button>' : '') +
                    '</div><p class="muted mt">' + esc(state.timerKind ? t('bit.timerRunning.' + state.timerKind) : t('bit.timerHint')) + '</p>'
                  : '<p class="muted mt">' + esc(t('bit.timerOff')) + '</p>') +
                '<details class="moderator mt"><summary>' + icon('eye') + esc(t('bit.moderatorHint')) + '</summary><p>' + esc(L(tp.moderatorHint)) + '</p></details>' +
              '</section>' +
            '</div>' +
            '<div class="row row--between">' +
              '<div class="row"><button type="button" class="btn btn--ghost" data-action="skipTopic">' + icon('skip') + esc(t('bit.skipTopic')) + '</button>' +
              '<button type="button" class="btn btn--ghost" data-action="stopRound">' + icon('hand') + esc(t('bit.stopRound')) + '</button></div>' +
              '<button type="button" class="btn btn--primary btn--lg" data-action="toScore">' + icon('scale') + esc(t('bit.toScore')) + '</button>' +
            '</div>' +
          '</div>';
      }

      function renderScore() {
        const tp = topic();
        ctx.root.innerHTML =
          '<div class="debate">' +
            '<header><p class="kicker">' + icon('scale') + esc(t('bit.roundN', { n: state.round + 1 })) + '</p><h2 tabindex="-1">' + esc(t('bit.scoreTitle')) + '</h2><p class="muted">„' + esc(L(tp.statement)) + '”</p></header>' +
            '<section class="card"><div class="table-wrap"><table class="table rubric-table"><thead><tr><th scope="col">' + esc(t('bit.criterion')) + '</th>' +
              state.teams.map((tm) => '<th scope="col">' + esc(tm.name) + '</th>').join('') + '</tr></thead><tbody>' +
              data.rubric.map((r) => '<tr><th scope="row">' + esc(L(r.label)) + '</th>' + state.teams.map((tm, ti) => {
                const v = state.scores[ti][r.id];
                const lbl = tm.name + ' – ' + L(r.label);
                return '<td><div class="stepper">' +
                  '<button type="button" class="btn btn--ghost" data-action="dec" data-value="' + ti + ':' + r.id + '" aria-label="' + esc(t('bit.minus', { what: lbl })) + '"' + (v <= 0 ? ' disabled' : '') + '>−</button>' +
                  '<output aria-live="polite" aria-label="' + esc(lbl) + '">' + v + '</output>' +
                  '<button type="button" class="btn btn--ghost" data-action="inc" data-value="' + ti + ':' + r.id + '" aria-label="' + esc(t('bit.plus', { what: lbl })) + '"' + (v >= 5 ? ' disabled' : '') + '>+</button></div></td>';
              }).join('') + '</tr>').join('') +
              '</tbody><tfoot><tr><td>' + esc(t('bit.total')) + '</td>' + state.teams.map((tm, ti) => '<td>' + sum(state.scores[ti]) + ' / 25</td>').join('') + '</tr></tfoot></table></div>' +
              '<p class="note mt">' + icon('info') + '<span>' + esc(t('bit.correctNote')) + '</span></p></section>' +
            '<div class="row row--between"><button type="button" class="btn btn--ghost" data-action="backToRound">' + icon('arrowLeft') + esc(t('bit.backToRound')) + '</button>' +
              '<button type="button" class="btn btn--primary btn--lg" data-action="confirmRound">' + icon('check') + esc(t('bit.confirm')) + '</button></div>' +
          '</div>';
      }

      function renderSummary() {
        const lr = state.lastRound;
        const tp = data.topics.find((x) => x.id === lr.topicId);
        const left = data.topics.filter((x) => !state.used.has(x.id)).length;
        ctx.root.innerHTML =
          '<div class="debate">' +
            '<header><p class="kicker">' + icon('flag') + esc(t('bit.summaryN', { n: state.round })) + '</p><h2 tabindex="-1">„' + esc(L(tp.statement)) + '”</h2></header>' +
            '<div class="grid-2">' + state.teams.map((tm, i) => {
              const sc = lr.scores[i];
              const strong = data.rubric.filter((r) => sc[r.id] >= 4);
              const low = data.rubric.slice().sort((a, b) => sc[a.id] - sc[b.id])[0];
              return '<section class="card"><div class="row row--between"><h3 class="h-sm">' + icon('users') + esc(tm.name) + '</h3><span class="chip">' + lr.pts[i] + ' / 25</span></div>' +
                '<p class="mt"><strong>' + esc(t('bit.strengths')) + ':</strong> ' + esc(strong.length ? strong.map((r) => L(r.strength)).join(' ') : t('bit.noStrengths')) + '</p>' +
                '<p class="mt"><strong>' + esc(t('bit.tip')) + ':</strong> ' + esc(L(low.tip)) + '</p></section>';
            }).join('') + '</div>' +
            '<section class="card"><h2 class="h-sm">' + icon('trophy') + esc(t('bit.scoreboard')) + '</h2>' + scoreboardHtml() +
              '<p class="note mt">' + icon('info') + '<span>' + esc(t('bit.finalNote')) + '</span></p></section>' +
            '<div class="row row--end">' +
              '<button type="button" class="btn btn--secondary btn--lg" data-action="finish">' + icon('flag') + esc(t('bit.endGame')) + '</button>' +
              (left ? '<button type="button" class="btn btn--primary btn--lg" data-action="nextTopic">' + esc(t('bit.nextTopic')) + icon('arrowRight') + '</button>' : '') +
            '</div>' +
          '</div>';
      }

      function render() {
        if (!state) return;
        switch (state.phase) {
          case 'setup': return renderSetup();
          case 'topics': return renderTopics();
          case 'round': return renderRound();
          case 'score': return renderScore();
          case 'summary': return renderSummary();
        }
      }

      function adjust(value, delta) {
        if (state.phase !== 'score') return;
        const [ti, crit] = String(value).split(':');
        const row = state.scores[Number(ti)];
        if (!row || !(crit in row)) return;
        row[crit] = Math.max(0, Math.min(5, row[crit] + delta));
        render();
        const sel = '[data-action="' + (delta > 0 ? 'inc' : 'dec') + '"][data-value="' + value + '"]';
        const el = ctx.root.querySelector(sel);
        if (el && !el.disabled) el.focus();
        else { const other = ctx.root.querySelector('[data-action="' + (delta > 0 ? 'dec' : 'inc') + '"][data-value="' + value + '"]'); if (other) other.focus(); }
      }

      return {
        id: 'bitwa-na-argumenty',
        init() {
          data = ctx.content.get('debate');
          ctx.content.requireFields(data.topics, ['id', 'statement', 'prompts'], 'debate-topics');
          if (!data.rubric || data.rubric.length !== 5) throw new Error('Rubryka musi mieć 5 kryteriów');
        },
        start() { state = newState(); progress(); render(); },
        pause() {}, resume() {},
        restart() { stopTimer(); state = newState(); progress(); render(); },
        handleAction(a) {
          switch (a.type) {
            case 'count': state.count = Math.max(2, Math.min(4, Number(a.value) || 2)); render(); ctx.focus('#bit-count'); break;
            case 'begin': if (state.phase === 'setup') begin(); break;
            case 'random': {
              const left = data.topics.filter((x) => !state.used.has(x.id));
              if (left.length) pickTopic(left[Math.floor(Math.random() * left.length)].id);
              break;
            }
            case 'pickTopic': if (state.phase === 'topics') pickTopic(a.value); break;
            case 'timer': if (state.phase === 'round') startTimer(a.value); break;
            case 'timerStop': stopTimer(); render(); break;
            case 'skipTopic': if (state.phase === 'round') { stopTimer(); state.used.add(state.topicId); state.phase = 'topics'; progress(); render(); } break;
            case 'stopRound': if (state.phase === 'round') stopRound(); break;
            case 'toScore': if (state.phase === 'round') { stopTimer(); state.phase = 'score'; render(); ctx.focus('h2[tabindex]'); } break;
            case 'backToRound': if (state.phase === 'score') { state.phase = 'round'; render(); } break;
            case 'inc': adjust(a.value, 1); break;
            case 'dec': adjust(a.value, -1); break;
            case 'confirmRound': confirmRound(); break;
            case 'nextTopic': state.phase = 'topics'; progress(); render(); ctx.focus('h2[tabindex]'); break;
            case 'finish': if (state.phase === 'topics' || state.phase === 'summary') finish(); break;
          }
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() { if (timer) timer.stop(); }
      };
    }
  });
})(window.PH8);
