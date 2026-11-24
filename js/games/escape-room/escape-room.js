/* 6.5 Escape Room – Kod do Szacunku */
(function (PH8) {
  'use strict';
  const FULL = 100, HINT_COST = 30;

  PH8.registerGame({
    id: 'escape-room',
    icon: 'lock',
    accent: 'accent',
    modes: ['team', 'class', 'individual'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null, state = null, timer = null;

      function newState() {
        return {
          view: 'room', stage: null,
          solved: data.stages.map(() => false),
          skipped: data.stages.map(() => false),
          hint: data.stages.map(() => false),
          sel: data.stages.map((s) => (s.type === 'multi-choice' || s.type === 'build') ? [] : (s.type === 'single-choice' ? null : {})),
          attempt: data.stages.map(() => null), // null | {ok, partial}
          code: '', codeError: false, timeUp: false, emergencyFinal: false
        };
      }

      const solvedCount = () => state.solved.filter(Boolean).length;
      const isOpen = (i) => i === 0 || state.solved[i - 1];
      const code = () => data.stages.map((s) => s.reward).join('');

      function progress() {
        ctx.onProgress(solvedCount(), data.stages.length, state.view === 'final' ? t('esc.doorOpen') : t('esc.progress', { n: solvedCount(), total: data.stages.length }));
      }

      function startTimer() {
        if (timer) timer.stop();
        timer = null;
        if (!ctx.config.timerEnabled) { ctx.hideTimer(); return; }
        timer = ctx.createTimer({
          duration: (data.timeLimitMin || 30) * 60000,
          onEnd: () => { state.timeUp = true; ctx.toast(t('esc.timeUp'), 'info'); render(); }
        });
        timer.start();
      }

      function evaluate(i) {
        const s = data.stages[i], sel = state.sel[i];
        switch (s.type) {
          case 'single-choice': return { ok: sel === s.solution };
          case 'multi-choice':
          case 'build': {
            const good = sel.filter((x) => s.solution.includes(x)).length;
            return { ok: PH8.util.sameSet(sel, s.solution), partial: { n: good, total: s.solution.length } };
          }
          case 'true-false': {
            const n = s.statements.filter((st, k) => sel[k] === st.answer).length;
            return { ok: n === s.statements.length, partial: { n: n, total: s.statements.length } };
          }
          case 'match': {
            const n = s.pairs.filter((p, k) => Number(sel[k]) === p.answer).length;
            return { ok: n === s.pairs.length, partial: { n: n, total: s.pairs.length } };
          }
        }
        return { ok: false };
      }

      function checkStage() {
        const i = state.stage;
        if (i == null || state.solved[i]) return;
        const r = evaluate(i);
        state.attempt[i] = r;
        if (r.ok) {
          state.solved[i] = true;
          ctx.onScore('stage:' + data.stages[i].id, state.hint[i] ? FULL - HINT_COST : FULL);
          ctx.audio.play('unlock');
          progress();
        } else {
          ctx.audio.play('wrong');
        }
        render();
        ctx.focus('.feedback');
      }

      async function emergencyStage() {
        const i = state.stage;
        if (i == null || state.solved[i]) return;
        const ok = await ctx.confirm({ title: t('esc.emergencyTitle'), message: t('esc.emergencyStage'), okLabel: t('esc.emergencyOk') });
        if (!ok || !state || state.solved[i]) return;
        state.solved[i] = true;
        state.skipped[i] = true;
        state.attempt[i] = { ok: true, skipped: true };
        progress();
        render();
      }

      function submitCode() {
        if (solvedCount() < data.stages.length) return;
        const input = ctx.root.querySelector('#code-input');
        const v = (input ? input.value : state.code).replace(/[\s\-·.]/g, '').toUpperCase();
        state.code = input ? input.value : state.code;
        if (v === code()) {
          state.view = 'final';
          state.codeError = false;
          if (timer) timer.stop();
          ctx.hideTimer();
          ctx.audio.play('success');
          progress();
          render();
          ctx.focus('h2[tabindex]');
        } else {
          state.codeError = true; // postęp etapów nie jest resetowany
          ctx.audio.play('wrong');
          render();
          ctx.focus('#code-input');
        }
      }

      async function emergencyFinal() {
        const ok = await ctx.confirm({ title: t('esc.emergencyTitle'), message: t('esc.emergencyFinal'), okLabel: t('esc.emergencyOk') });
        if (!ok || !state) return;
        data.stages.forEach((s, i) => { if (!state.solved[i]) { state.solved[i] = true; state.skipped[i] = true; } });
        state.emergencyFinal = true;
        state.view = 'final';
        if (timer) timer.stop();
        ctx.hideTimer();
        progress();
        render();
      }

      function finish() {
        const hints = state.hint.filter(Boolean).length;
        const skipped = state.skipped.filter(Boolean).length;
        const strengths = [];
        data.stages.forEach((s, i) => { if (state.solved[i] && !state.skipped[i] && !state.hint[i]) strengths.push({ pl: 'Bez podpowiedzi: ' + s.title.pl, en: 'No hint needed: ' + s.title.en }); });
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: data.stages.length * FULL,
          summary: data.summary,
          stats: [
            { label: { pl: 'Użyte podpowiedzi', en: 'Hints used' }, value: String(hints) },
            { label: { pl: 'Awaryjne przejścia', en: 'Emergency passes' }, value: String(skipped) }
          ],
          strengths: strengths,
          discussion: data.discussion
        });
      }

      // --- widoki ---
      function lockHtml(s, i) {
        const status = state.solved[i] ? 'solved' : (isOpen(i) ? 'open' : 'locked');
        const stateText = status === 'solved'
          ? icon('check') + esc(t('esc.solved')) + ' · ' + esc(state.skipped[i] ? '—' : s.reward)
          : (status === 'open' ? icon('play') + esc(t('esc.openLock')) : icon('lock') + esc(t('esc.locked')));
        return '<button type="button" class="lock lock--' + status + '" data-action="openStage" data-value="' + i + '"' + (status === 'locked' ? ' aria-disabled="true"' : '') + '>' +
          '<span class="lock__icon">' + icon(status === 'solved' ? 'unlock' : 'lock') + '</span>' +
          '<span class="lock__num">' + esc(t('esc.stage', { n: i + 1 })) + '</span>' +
          '<strong>' + esc(L(s.title)) + '</strong>' +
          '<span class="lock__state">' + stateText + '</span></button>';
      }

      function renderRoom() {
        const all = solvedCount() === data.stages.length;
        ctx.root.innerHTML =
          '<div class="escape">' +
            '<section class="card"><h2 tabindex="-1">' + icon('key') + esc(t('esc.hq')) + '</h2><p class="muted">' + esc(L(data.intro)) + '</p>' +
              (state.timeUp ? '<div class="callout callout--info mt">' + icon('hourglass') + '<div><p>' + esc(t('esc.timeUpNote')) + '</p></div></div>' : '') +
              '<div class="locks">' + data.stages.map(lockHtml).join('') + '</div></section>' +
            '<section class="card"><h2 class="h-sm">' + icon('puzzle') + esc(t('esc.collected')) + '</h2>' +
              '<div class="code-slots" aria-label="' + esc(t('esc.collected')) + '">' + data.stages.map((s, i) => '<span class="code-slot' + (state.solved[i] ? ' is-filled' : '') + '">' + (state.solved[i] ? esc(s.reward) : '?') + '</span>').join('') + '</div>' +
              (all
                ? '<div class="stack"><label class="field" for="code-input"><span>' + esc(t('esc.enterCode')) + '</span>' +
                    '<input id="code-input" class="input input--code" type="text" inputmode="numeric" autocomplete="off" maxlength="12" value="' + esc(state.code) + '"></label>' +
                    '<div class="row"><button type="button" class="btn btn--primary btn--lg" data-action="submitCode">' + icon('unlock') + esc(t('esc.open')) + '</button></div>' +
                    (state.codeError ? '<div class="feedback feedback--warn" role="alert"><div class="feedback__head">' + icon('info') + '<strong>' + esc(t('esc.wrongCode')) + '</strong></div><p>' + esc(t('esc.wrongCodeHint')) + '</p></div>' : '') +
                  '</div>'
                : '<p class="muted">' + esc(t('esc.codeLocked')) + '</p>') +
              '<hr style="border:0;border-top:1px solid var(--c-border);margin:1rem 0">' +
              '<button type="button" class="btn btn--ghost btn--sm" data-action="emergencyFinal">' + icon('key') + esc(t('esc.emergencyFinalBtn')) + '</button>' +
            '</section>' +
          '</div>';
        const inp = ctx.root.querySelector('#code-input');
        if (inp) {
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !ctx.isPaused()) submitCode(); });
          inp.addEventListener('input', () => { state.code = inp.value; });
        }
      }

      function stageBody(i) {
        const s = data.stages[i], sel = state.sel[i], done = state.solved[i];
        const dis = done ? ' disabled' : '';
        if (s.type === 'single-choice' || s.type === 'multi-choice' || s.type === 'build') {
          const multi = s.type !== 'single-choice';
          return '<div class="stack" role="group" aria-label="' + esc(L(s.question)) + '">' + s.options.map((o, k) => {
            const on = multi ? sel.includes(k) : sel === k;
            return '<button type="button" class="choice" data-action="pick" data-value="' + k + '" aria-pressed="' + on + '"' + dis + '>' +
              '<span class="choice__key">' + (multi ? (on ? '✓' : '') : String.fromCharCode(65 + k)) + '</span><span class="choice__label">' + esc(L(o)) + '</span></button>';
          }).join('') + '</div>';
        }
        if (s.type === 'true-false') {
          return '<ul class="tf-list">' + s.statements.map((st, k) => '<li class="tf-item"><p>' + esc(L(st.text)) + '</p>' +
            '<div class="row" role="group" aria-label="' + esc(L(st.text)) + '">' +
              '<button type="button" class="btn btn--ghost" data-action="tf" data-value="' + k + ':1" aria-pressed="' + (sel[k] === true) + '"' + dis + '>' + icon('check') + esc(t('esc.true')) + '</button>' +
              '<button type="button" class="btn btn--ghost" data-action="tf" data-value="' + k + ':0" aria-pressed="' + (sel[k] === false) + '"' + dis + '>' + icon('x') + esc(t('esc.false')) + '</button>' +
            '</div></li>').join('') + '</ul>';
        }
        if (s.type === 'match') {
          return '<div class="match-list">' + s.pairs.map((p, k) => '<div class="match-item"><label for="m-' + k + '"><strong>' + esc(L(p.situation)) + '</strong></label>' +
            '<select class="select" id="m-' + k + '" data-change="match" data-value="' + k + '"' + dis + '><option value="">' + esc(t('esc.choose')) + '</option>' +
            s.options.map((o, oi) => '<option value="' + oi + '"' + (String(sel[k]) === String(oi) ? ' selected' : '') + '>' + esc(L(o)) + '</option>').join('') + '</select></div>').join('') + '</div>';
        }
        return '';
      }

      function renderStage() {
        const i = state.stage, s = data.stages[i], done = state.solved[i], att = state.attempt[i];
        let fb = '';
        if (done && att) {
          fb = '<div class="feedback feedback--ok" role="status"><div class="feedback__head">' + icon('unlock') + '<strong>' + esc(att.skipped ? t('esc.skippedStage') : t('esc.stageSolved', { digit: s.reward })) + '</strong>' +
            (!att.skipped ? '<span class="feedback__pts">+' + (state.hint[i] ? FULL - HINT_COST : FULL) + ' ' + esc(t('common.pts')) + '</span>' : '') + '</div>' +
            '<p>' + esc(L(s.explanation)) + '</p>' +
            '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="back">' + icon('key') + esc(t('esc.backToHq')) + '</button></div></div>';
        } else if (att && !att.ok) {
          fb = '<div class="feedback feedback--warn" role="status"><div class="feedback__head">' + icon('info') + '<strong>' + esc(t('esc.notYet')) + '</strong></div>' +
            '<p>' + esc(att.partial ? t('esc.partial', { n: att.partial.n, total: att.partial.total }) : t('esc.tryAgain')) + '</p></div>';
        }
        ctx.root.innerHTML =
          '<div class="mission-task">' +
            '<div class="row row--between"><button type="button" class="btn btn--ghost" data-action="back">' + icon('arrowLeft') + esc(t('esc.backToHq')) + '</button>' +
              '<span class="chip">' + icon('lock') + esc(t('esc.stage', { n: i + 1 })) + '</span></div>' +
            '<article class="card"><p class="kicker">' + icon('puzzle') + esc(L(s.title)) + '</p><h2 tabindex="-1" style="font-size:1.4rem;margin-top:.3rem">' + esc(L(s.question)) + '</h2>' +
              (state.hint[i] ? '<p class="hint">' + icon('bulb') + '<span>' + esc(L(s.hint)) + '</span></p>' : '') + '</article>' +
            stageBody(i) +
            fb +
            (!done ? '<div class="row row--between">' +
              '<div class="row"><button type="button" class="btn btn--ghost" data-action="hint"' + (state.hint[i] ? ' disabled' : '') + '>' + icon('bulb') + esc(t('esc.hint', { cost: HINT_COST })) + '</button>' +
              '<button type="button" class="btn btn--ghost btn--sm" data-action="emergencyStage">' + icon('key') + esc(t('esc.emergencyBtn')) + '</button></div>' +
              '<button type="button" class="btn btn--primary btn--lg" data-action="check">' + icon('check') + esc(t('esc.check')) + '</button></div>' : '') +
          '</div>';
      }

      function renderFinal() {
        ctx.root.innerHTML =
          '<div class="final-door">' +
            '<span class="final-door__icon">' + icon('door') + '</span>' +
            '<h2 tabindex="-1" style="font-size:2rem">' + esc(t('esc.doorOpen')) + '</h2>' +
            '<p class="lead">' + esc(state.emergencyFinal ? t('esc.doorEmergency') : t('esc.doorLead')) + '</p>' +
            '<div class="rule-cards">' + data.finalRules.map((r) => '<div class="rule-card">' + icon('shieldCheck') + '<span>' + esc(L(r)) + '</span></div>').join('') + '</div>' +
            '<button type="button" class="btn btn--primary btn--lg" data-action="finish">' + esc(t('common.seeResults')) + icon('arrowRight') + '</button>' +
          '</div>';
      }

      function render() {
        if (!state) return;
        if (state.view === 'final') renderFinal();
        else if (state.view === 'stage') renderStage();
        else renderRoom();
      }

      return {
        id: 'escape-room',
        init() {
          data = ctx.content.get('escapeRoom');
          ctx.content.requireFields(data.stages, ['id', 'title', 'type', 'question', 'hint', 'explanation', 'reward'], 'escape-room');
          if (data.stages.length !== 5) console.warn('[Escape Room] Oczekiwano 5 etapów');
        },
        start() { state = newState(); progress(); render(); startTimer(); },
        pause() {}, resume() {},
        restart() { state = newState(); progress(); render(); startTimer(); },
        handleAction(a) {
          const i = state.stage;
          switch (a.type) {
            case 'openStage': {
              const k = Number(a.value);
              if (!isOpen(k)) return;
              state.stage = k; state.view = 'stage';
              render(); ctx.focus('h2[tabindex]');
              break;
            }
            case 'back': state.view = 'room'; state.stage = null; render(); ctx.focus('h2[tabindex]'); break;
            case 'pick': {
              if (i == null || state.solved[i]) return;
              const s = data.stages[i], k = Number(a.value);
              if (s.type === 'single-choice') state.sel[i] = k;
              else { const arr = state.sel[i]; const at = arr.indexOf(k); if (at >= 0) arr.splice(at, 1); else arr.push(k); }
              state.attempt[i] = null;
              render(); ctx.focus('[data-action="pick"][data-value="' + k + '"]');
              break;
            }
            case 'tf': {
              if (i == null || state.solved[i]) return;
              const parts = String(a.value).split(':');
              state.sel[i][Number(parts[0])] = parts[1] === '1';
              state.attempt[i] = null;
              render(); ctx.focus('[data-action="tf"][data-value="' + a.value + '"]');
              break;
            }
            case 'match':
              if (i == null || state.solved[i]) return;
              state.sel[i][Number(a.key)] = a.value === '' ? undefined : Number(a.value);
              state.attempt[i] = null;
              break;
            case 'hint': if (i != null && !state.hint[i]) { state.hint[i] = true; render(); } break;
            case 'check': checkStage(); break;
            case 'emergencyStage': emergencyStage(); break;
            case 'submitCode': submitCode(); break;
            case 'emergencyFinal': emergencyFinal(); break;
            case 'finish': if (state.view === 'final') finish(); break;
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
