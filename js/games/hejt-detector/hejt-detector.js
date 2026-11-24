/* 6.1 Hejt Detector – moduł referencyjny */
(function (PH8) {
  'use strict';
  const QUESTION_TIME = 30000;

  PH8.registerGame({
    id: 'hejt-detector',
    icon: 'shield',
    accent: 'primary',
    modes: ['individual', 'team', 'class'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null;
      let state = null;
      let timer = null;

      function cat(id) { return data.categories.find((c) => c.id === id); }
      function currentQ() { return state.queue[state.index]; }
      function teamList() { return ctx.config.mode === 'team' ? ctx.teams.list() : null; }
      function currentTeam() {
        const tl = teamList();
        return tl && tl.length ? tl[state.turn % tl.length] : null;
      }

      function newState() {
        const pool = data.questions;
        const n = Math.max(1, Math.min(ctx.config.questionCount || 10, pool.length));
        return {
          queue: PH8.util.shuffle(pool).slice(0, n),
          total: n, index: 0, answered: 0, correct: 0, dropped: 0, turn: 0,
          phase: 'question', skippedOnce: new Set(), last: null, hint: false,
          perCat: {}, teamPoints: {}
        };
      }

      function progress() {
        const total = state.total - state.dropped;
        ctx.onProgress(state.answered, total, t('hd.progress', { cur: Math.min(state.answered + 1, total), total: total }));
      }

      function startTimer() {
        if (timer) timer.stop();
        timer = null;
        if (!ctx.config.timerEnabled) { ctx.hideTimer(); return; }
        timer = ctx.createTimer({ duration: QUESTION_TIME, onEnd: () => answer(null, true) });
        timer.start();
      }

      function answer(choice, timedOut) {
        if (state.phase !== 'question') return; // blokada wielokrotnego kliknięcia
        const q = currentQ();
        const remaining = timer ? timer.getRemaining() : 0;
        if (timer) timer.stop();
        const correct = !timedOut && choice === q.correctOption;
        let pts = 0;
        if (correct) {
          pts = 100;
          if (ctx.config.timerEnabled) pts += Math.round(20 * remaining / QUESTION_TIME);
        }
        const awarded = ctx.onScore('q:' + q.id, pts);
        const pc = state.perCat[q.correctOption] || (state.perCat[q.correctOption] = { seen: 0, correct: 0 });
        pc.seen++;
        if (correct) { pc.correct++; state.correct++; }
        const team = currentTeam();
        if (team && awarded && pts > 0) {
          state.teamPoints[team] = (state.teamPoints[team] || 0) + pts;
          ctx.teams.addPoints(team, pts);
        }
        state.last = { choice: choice, correct: correct, timedOut: !!timedOut, pts: awarded ? pts : 0, team: team };
        state.answered++;
        state.phase = 'feedback';
        ctx.audio.play(correct ? 'correct' : 'wrong');
        progress();
        render();
        ctx.focus('[data-action="next"]');
      }

      function next() {
        if (state.phase !== 'feedback') return;
        state.index++;
        state.turn++;
        state.hint = false;
        if (state.index >= state.queue.length) return finish();
        state.phase = 'question';
        render();
        startTimer();
        ctx.focus('.message-card__quote');
      }

      function skip() {
        if (state.phase !== 'question') return;
        const q = currentQ();
        if (timer) timer.stop();
        if (!state.skippedOnce.has(q.id)) {
          state.skippedOnce.add(q.id);
          state.queue.push(q); // wraca na koniec kolejki
        } else {
          state.dropped++; // drugie pominięcie – pytanie wypada z sesji bez utraty postępu
        }
        state.index++;
        state.hint = false;
        if (state.index >= state.queue.length) return finish();
        progress();
        render();
        startTimer();
        ctx.toast(t('hd.skipped'), 'info');
      }

      function finish() {
        state.phase = 'done';
        if (timer) timer.stop();
        const strengths = Object.keys(state.perCat)
          .filter((k) => state.perCat[k].correct > 0 && state.perCat[k].correct === state.perCat[k].seen)
          .map((k) => ({ pl: PH8.data.strings.pl['hd.strength'].replace('{cat}', cat(k).label.pl), en: PH8.data.strings.en['hd.strength'].replace('{cat}', cat(k).label.en) }));
        const answeredTotal = state.answered;
        const snapshot = { perCat: JSON.parse(JSON.stringify(state.perCat)), teamPoints: Object.assign({}, state.teamPoints) };
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: answeredTotal * (ctx.config.timerEnabled ? 120 : 100),
          summary: data.summary,
          stats: [{ label: { pl: 'Poprawne odpowiedzi', en: 'Correct answers' }, value: state.correct + ' / ' + answeredTotal }],
          strengths: strengths,
          discussion: data.discussion,
          extra: () => breakdown(snapshot)
        });
      }

      function breakdown(snap) {
        const rows = data.categories.filter((c) => snap.perCat[c.id]).map((c) => {
          const v = snap.perCat[c.id];
          return '<tr><td><strong>' + esc(L(c.label)) + '</strong><div class="muted">' + esc(L(c.short)) + '</div></td><td>' + v.correct + ' / ' + v.seen + '</td></tr>';
        }).join('');
        const teams = Object.entries(snap.teamPoints).sort((a, b) => b[1] - a[1]);
        return '<div class="grid-2">' +
          '<div class="panel"><h2>' + icon('target') + esc(t('hd.byCategory')) + '</h2><div class="table-wrap"><table class="table"><thead><tr><th>' + esc(t('hd.category')) + '</th><th>' + esc(t('hd.result')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
          (teams.length ? '<div class="panel"><h2>' + icon('users') + esc(t('hd.teamScores')) + '</h2><ol class="scoreboard">' + teams.map((x, i) => '<li><span class="scoreboard__pos">' + (i + 1) + '</span>' + esc(x[0]) + '<strong>' + x[1] + '</strong></li>').join('') + '</ol></div>'
            : '<div class="panel"><h2>' + icon('book') + esc(t('hd.legend')) + '</h2><div class="cat-legend">' + data.categories.map((c) => '<div><strong>' + esc(L(c.label)) + '</strong><span class="muted">' + esc(L(c.short)) + '</span></div>').join('') + '</div></div>') +
        '</div>';
      }

      function render() {
        if (!state || state.phase === 'done') return;
        const q = currentQ();
        const team = currentTeam();
        const fb = state.phase === 'feedback' ? state.last : null;

        const buttons = data.categories.map((c, i) => {
          let cls = 'choice' + (c.id === 'context' ? ' choice--context' : '');
          let mark = '';
          if (fb) {
            if (c.id === q.correctOption) { cls += ' is-correct'; mark = '<span class="choice__mark">' + icon('check') + esc(t('hd.correctMark')) + '</span>'; }
            else if (c.id === fb.choice) { cls += ' is-wrong'; mark = '<span class="choice__mark">' + icon('x') + esc(t('hd.yourMark')) + '</span>'; }
          }
          return '<button type="button" class="' + cls + '" data-action="answer" data-value="' + c.id + '"' + (fb ? ' disabled' : '') + '>' +
            '<span class="choice__icon">' + icon(c.icon) + '</span><span class="choice__label">' + esc(L(c.label)) + '</span>' + mark + '</button>';
        }).join('');

        let feedback = '';
        if (fb) {
          const type = fb.correct ? 'ok' : (fb.timedOut ? 'warn' : 'bad');
          const head = fb.correct ? t('hd.fbCorrect') : (fb.timedOut ? t('hd.fbTimeout') : t('hd.fbWrong'));
          feedback =
            '<div class="feedback feedback--' + type + '" role="status">' +
              '<div class="feedback__head">' + icon(fb.correct ? 'check' : (fb.timedOut ? 'hourglass' : 'info')) + '<strong>' + esc(head) + '</strong>' +
                '<span class="feedback__pts">+' + fb.pts + ' ' + esc(t('common.pts')) + '</span></div>' +
              '<p><strong>' + esc(t('hd.correctIs')) + ':</strong> ' + esc(L(cat(q.correctOption).label)) + '</p>' +
              '<p>' + esc(L(q.explanation)) + '</p>' +
              '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="next">' + esc(state.index + 1 >= state.queue.length ? t('common.seeResults') : t('common.next')) + icon('arrowRight') + '</button></div>' +
            '</div>';
        }

        ctx.root.innerHTML =
          '<div class="hd">' +
            (team ? '<div class="turn-banner">' + icon('users') + '<span>' + esc(t('hd.teamTurn')) + ' <strong>' + esc(team) + '</strong></span></div>' : '') +
            '<article class="card message-card">' +
              '<div class="message-card__head">' +
                '<span class="chip">' + icon(q.online ? 'wifi' : 'school') + esc(q.online ? t('hd.online') : t('hd.offline')) + '</span>' +
                '<span class="chip chip--muted">' + esc(t('difficulty.' + (q.difficulty === 'medium' ? 'normal' : q.difficulty))) + '</span>' +
                '<span class="chip chip--muted">' + icon('fileText') + esc(t('hd.fictional')) + '</span>' +
              '</div>' +
              '<blockquote class="message-card__quote" tabindex="-1">' + esc(L(q.prompt)) + '</blockquote>' +
              '<p class="message-card__ctx"><strong>' + esc(t('hd.context')) + ':</strong> ' + esc(L(q.context)) + '</p>' +
              (q.relation ? '<p class="message-card__ctx"><strong>' + esc(t('hd.relation')) + ':</strong> ' + esc(L(q.relation)) + '</p>' : '') +
              (state.hint && q.hint && !fb ? '<p class="hint">' + icon('bulb') + '<span>' + esc(L(q.hint)) + '</span></p>' : '') +
            '</article>' +
            '<h2 class="h-sm">' + esc(t('hd.choose')) + '</h2>' +
            '<div class="choice-grid" role="group" aria-label="' + esc(t('hd.choose')) + '">' + buttons + '</div>' +
            feedback +
            (!fb ? '<div class="row row--between">' +
              '<button type="button" class="btn btn--ghost" data-action="hint"' + (!q.hint || state.hint ? ' disabled' : '') + '>' + icon('bulb') + esc(t('hd.hint')) + '</button>' +
              '<button type="button" class="btn btn--ghost" data-action="skip">' + icon('skip') + esc(t('hd.skip')) + '</button>' +
            '</div>' : '') +
          '</div>';
      }

      return {
        id: 'hejt-detector',
        init() {
          data = ctx.content.get('hejtDetector');
          ctx.content.requireFields(data.questions, ['id', 'prompt', 'correctOption', 'explanation', 'difficulty'], 'hejt-detector');
          data.questions.forEach((q) => { if (!data.categories.some((c) => c.id === q.correctOption)) throw new Error('Nieznana kategoria w ' + q.id); });
        },
        start() { state = newState(); progress(); render(); startTimer(); },
        pause() {},
        resume() {},
        restart() { state = newState(); progress(); render(); startTimer(); },
        handleAction(a) {
          if (a.type === 'answer') answer(a.value, false);
          else if (a.type === 'next') next();
          else if (a.type === 'skip') skip();
          else if (a.type === 'hint') { state.hint = true; render(); }
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() { if (timer) timer.stop(); }
      };
    }
  });
})(window.PH8);
