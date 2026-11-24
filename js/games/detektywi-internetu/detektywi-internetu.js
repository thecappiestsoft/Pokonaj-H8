/* 6.4 Detektywi Internetu – tablica dowodów, klasyfikacja (drag & drop + kliknięcia), pytania, raport */
(function (PH8) {
  'use strict';
  const TYPE_ICON = { chat: 'message', witness: 'user', timeline: 'clock' };
  const CARD_PTS = 30, Q_PTS = 50, STEP_PTS = 25;

  PH8.registerGame({
    id: 'detektywi-internetu',
    icon: 'search',
    accent: 'warn',
    modes: ['team', 'individual', 'class'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null, cs = null, state = null;

      function newState() {
        const sequential = ctx.config.difficulty !== 'easy';
        return {
          phase: 'intro', sequential: sequential,
          revealed: sequential ? 1 : cs.cards.length,
          assign: {}, selected: null, cardCorrect: 0,
          qIndex: 0, qAnswer: null, qCorrect: 0,
          steps: new Set(), reportDone: false
        };
      }

      function catById(id) { return data.categories.find((c) => c.id === id); }
      function revealedCards() { return cs.cards.slice(0, state.revealed); }
      function allAssigned() { return state.revealed >= cs.cards.length && cs.cards.every((c) => state.assign[c.id]); }

      function progress() {
        const totalSteps = cs.cards.length + cs.questions.length + 1;
        let done = 0, label = '';
        if (state.phase === 'intro') { label = t('det.phase.intro'); }
        else if (state.phase === 'board') { done = Object.keys(state.assign).length; label = t('det.phase.board', { n: done, total: cs.cards.length }); }
        else if (state.phase === 'checked') { done = cs.cards.length; label = t('det.phase.checked'); }
        else if (state.phase === 'questions') { done = cs.cards.length + state.qIndex; label = t('det.phase.questions', { n: state.qIndex + 1, total: cs.cards.length ? cs.questions.length : 0 }); }
        else { done = state.reportDone ? totalSteps : totalSteps - 1; label = t('det.phase.report'); }
        ctx.onProgress(done, totalSteps, label);
      }

      function assign(cardId, catId) {
        if (state.phase !== 'board') return;
        if (!cs.cards.some((c) => c.id === cardId) || !catById(catId)) return;
        if (cs.cards.findIndex((c) => c.id === cardId) >= state.revealed) return;
        state.assign[cardId] = catId;
        state.selected = null;
        ctx.audio.play('click');
        progress();
        render();
        const target = ctx.root.querySelector('[data-bucket="' + catId + '"] .bucket__target');
        if (target) target.focus();
      }

      function check() {
        if (!allAssigned()) return;
        state.cardCorrect = 0;
        cs.cards.forEach((c) => {
          if (state.assign[c.id] === c.category) {
            state.cardCorrect++;
            ctx.onScore('card:' + c.id, CARD_PTS);
          }
        });
        state.phase = 'checked';
        ctx.audio.play(state.cardCorrect >= cs.cards.length * 0.7 ? 'correct' : 'click');
        progress();
        render();
        ctx.focus('h2[tabindex]');
      }

      function answerQ(idx) {
        if (state.phase !== 'questions' || state.qAnswer !== null) return;
        const q = cs.questions[state.qIndex];
        state.qAnswer = Number(idx);
        if (state.qAnswer === q.correctOption) { state.qCorrect++; ctx.onScore('q:' + q.id, Q_PTS); ctx.audio.play('correct'); }
        else ctx.audio.play('wrong');
        render();
        ctx.focus('[data-action="nextQ"]');
      }

      function submitReport() {
        if (state.phase !== 'report' || state.reportDone) return;
        cs.steps.forEach((s) => { if (s.safe && state.steps.has(s.id)) ctx.onScore('step:' + s.id, STEP_PTS); });
        state.reportDone = true;
        ctx.audio.play('success');
        progress();
        render();
        ctx.focus('h2[tabindex]');
      }

      function finish() {
        const safeChosen = cs.steps.filter((s) => s.safe && state.steps.has(s.id)).length;
        const unsafeChosen = cs.steps.filter((s) => !s.safe && state.steps.has(s.id)).length;
        const strengths = [];
        if (state.cardCorrect >= 8) strengths.push({ pl: 'Trafnie odróżniasz fakty od opinii i domysłów.', en: 'You accurately tell facts from opinions and guesses.' });
        if (state.qCorrect === cs.questions.length) strengths.push({ pl: 'Rozumiesz mechanizm rozprzestrzeniania się treści.', en: 'You understand how content spreads.' });
        if (safeChosen === 4 && unsafeChosen === 0) strengths.push({ pl: 'Twój raport wskazuje wyłącznie bezpieczne kroki.', en: 'Your report lists only safe steps.' });
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: cs.cards.length * CARD_PTS + cs.questions.length * Q_PTS + 4 * STEP_PTS,
          summary: data.summary,
          stats: [
            { label: { pl: 'Karty sklasyfikowane trafnie', en: 'Cards classified correctly' }, value: state.cardCorrect + ' / ' + cs.cards.length },
            { label: { pl: 'Pytania', en: 'Questions' }, value: state.qCorrect + ' / ' + cs.questions.length }
          ],
          strengths: strengths,
          discussion: data.discussion,
          flags: { supporter: safeChosen >= 3 && unsafeChosen === 0 }
        });
      }

      // --- widoki ---
      function cardHtml(c) {
        const assigned = state.assign[c.id];
        const sel = state.selected === c.id;
        const checked = state.phase === 'checked';
        const ok = checked && assigned === c.category;
        let cls = 'evidence';
        if (sel) cls += ' is-selected';
        if (assigned) cls += ' is-assigned';
        if (checked) cls += ok ? ' is-correct' : ' is-wrong';
        const head = '<span class="evidence__type">' + icon(TYPE_ICON[c.type] || 'fileText') + esc(L(c.title)) + '</span>' +
          '<span class="evidence__text">' + esc(L(c.description)) + '</span>';
        if (checked) {
          return '<div class="' + cls + '">' + head +
            '<div class="evidence__result"><strong>' + icon(ok ? 'check' : 'x') + esc(ok ? t('det.correct') : t('det.wrong')) + ' · ' + esc(L(catById(c.category).label)) + '</strong>' +
            (!ok ? '<span class="muted">' + esc(t('det.yourChoice')) + ': ' + esc(L(catById(assigned).label)) + '</span>' : '') +
            '<span>' + esc(L(c.explanation)) + '</span></div></div>';
        }
        return '<button type="button" class="' + cls + '" draggable="true" data-card-id="' + c.id + '" data-action="select" data-value="' + c.id + '" aria-pressed="' + sel + '">' + head +
          (assigned ? '<span class="chip chip--muted evidence__tag">' + icon('arrowRight') + esc(L(catById(assigned).label)) + '</span>' : '') + '</button>';
      }

      function renderIntro() {
        ctx.root.innerHTML =
          '<div class="case-intro stack stack--lg">' +
            '<article class="card case-file"><p class="kicker">' + icon('fileText') + esc(t('det.caseFile')) + '</p>' +
              '<h2 tabindex="-1" style="font-size:1.6rem;margin:.3rem 0 .7rem">' + esc(L(cs.title)) + '</h2>' +
              '<p class="story__text">' + esc(L(cs.intro)) + '</p><p class="mt muted">' + esc(L(cs.task)) + '</p></article>' +
            '<div class="callout callout--safe">' + icon('shield') + '<div><strong>' + esc(t('det.rulesTitle')) + '</strong><p>' + esc(t('det.rulesBody')) + '</p></div></div>' +
            '<div class="row row--end"><button type="button" class="btn btn--primary btn--lg" data-action="begin">' + icon('search') + esc(t('det.begin')) + '</button></div>' +
          '</div>';
      }

      function renderBoard() {
        const checked = state.phase === 'checked';
        const cards = cs.cards.map((c, i) => {
          if (i < state.revealed) return cardHtml(c);
          if (i === state.revealed && !checked) return '<button type="button" class="evidence evidence--hidden" data-action="reveal">' + icon('eye') + esc(t('det.reveal')) + '</button>';
          return '<div class="evidence evidence--locked" aria-hidden="true">?</div>';
        }).join('');
        const assignedCount = Object.keys(state.assign).length;
        const selCard = state.selected ? cs.cards.find((c) => c.id === state.selected) : null;

        const buckets = data.categories.map((cat) => {
          const items = cs.cards.filter((c) => state.assign[c.id] === cat.id);
          return '<div class="bucket" data-bucket="' + cat.id + '">' +
            '<button type="button" class="bucket__target" data-action="bucket" data-value="' + cat.id + '"' + (selCard && !checked ? '' : ' aria-disabled="true"') + '>' +
              icon(cat.icon) + '<span><strong>' + esc(L(cat.label)) + '</strong><small>' + esc(L(cat.desc)) + '</small></span><span class="bucket__count">' + items.length + '</span></button>' +
            '<div class="bucket__items">' + items.map((c) => checked
              ? '<span class="chip chip--muted">' + esc(L(c.title)) + '</span>'
              : '<button type="button" class="chip chip--card" data-action="select" data-value="' + c.id + '" title="' + esc(t('det.move')) + '">' + esc(L(c.title)) + ' · ' + esc(c.id.toUpperCase()) + '</button>').join('') + '</div>' +
          '</div>';
        }).join('');

        ctx.root.innerHTML =
          '<div class="det">' +
            '<div class="det__main">' +
              '<section class="card"><div class="row row--between"><h2 class="h-sm" tabindex="-1">' + icon('search') + esc(checked ? t('det.checkedTitle') : t('det.board')) + '</h2>' +
                '<span class="chip chip--muted">' + esc(t('det.assigned', { n: assignedCount, total: cs.cards.length })) + '</span></div>' +
                (checked ? '<div class="feedback feedback--info mt" role="status"><div class="feedback__head">' + icon('target') + '<strong>' + esc(t('det.score', { n: state.cardCorrect, total: cs.cards.length })) + '</strong><span class="feedback__pts">+' + (state.cardCorrect * CARD_PTS) + ' ' + esc(t('common.pts')) + '</span></div><p>' + esc(t('det.checkedLead')) + '</p></div>'
                  : '<p class="muted">' + esc(t('det.howto')) + '</p>') +
                '<div class="evidence-grid">' + cards + '</div>' +
              '</section>' +
              '<section class="card"><h2 class="h-sm">' + icon('clock') + esc(t('det.timeline')) + '</h2><ol class="timeline mt">' +
                cs.timeline.map((e) => '<li><span class="timeline__time">' + esc(L(e.time)) + '</span>' + esc(L(e.text)) + '</li>').join('') + '</ol></section>' +
            '</div>' +
            '<aside class="det__buckets" aria-label="' + esc(t('det.categories')) + '">' +
              '<h2 class="h-sm">' + icon('fileText') + esc(t('det.categories')) + '</h2>' +
              (!checked ? '<p class="select-hint" role="status">' + (selCard ? esc(t('det.selected', { name: L(selCard.title) + ' · ' + selCard.id.toUpperCase() })) : esc(t('det.selectFirst'))) + '</p>' : '') +
              buckets +
              (checked
                ? '<button type="button" class="btn btn--primary btn--lg" data-action="toQuestions">' + esc(t('det.toQuestions')) + icon('arrowRight') + '</button>'
                : '<button type="button" class="btn btn--primary btn--lg" data-action="check"' + (allAssigned() ? '' : ' disabled') + '>' + icon('check') + esc(t('det.check')) + '</button>' +
                  (!allAssigned() ? '<p class="note">' + icon('info') + '<span>' + esc(t('det.checkHint')) + '</span></p>' : '')) +
            '</aside>' +
          '</div>';
      }

      function renderQuestion() {
        const q = cs.questions[state.qIndex];
        const answered = state.qAnswer !== null;
        ctx.root.innerHTML =
          '<div class="case-intro stack stack--lg">' +
            '<article class="card"><p class="kicker">' + icon('help') + esc(t('det.question', { n: state.qIndex + 1, total: cs.questions.length })) + '</p>' +
              '<h2 tabindex="-1" style="font-size:1.45rem;margin-top:.35rem">' + esc(L(q.question)) + '</h2></article>' +
            '<div class="stack">' + q.options.map((o, i) => {
              let cls = 'choice', mark = '';
              if (answered) {
                if (i === q.correctOption) { cls += ' is-correct'; mark = '<span class="choice__mark">' + icon('check') + esc(t('hd.correctMark')) + '</span>'; }
                else if (i === state.qAnswer) { cls += ' is-wrong'; mark = '<span class="choice__mark">' + icon('x') + esc(t('hd.yourMark')) + '</span>'; }
              }
              return '<button type="button" class="' + cls + '" data-action="answerQ" data-value="' + i + '"' + (answered ? ' disabled' : '') + '><span class="choice__key">' + String.fromCharCode(65 + i) + '</span><span class="choice__label">' + esc(L(o)) + '</span>' + mark + '</button>';
            }).join('') + '</div>' +
            (answered ? '<div class="feedback feedback--' + (state.qAnswer === q.correctOption ? 'ok' : 'bad') + '" role="status"><div class="feedback__head">' + icon(state.qAnswer === q.correctOption ? 'check' : 'info') + '<strong>' + esc(state.qAnswer === q.correctOption ? t('hd.fbCorrect') : t('hd.fbWrong')) + '</strong>' +
              '<span class="feedback__pts">+' + (state.qAnswer === q.correctOption ? Q_PTS : 0) + ' ' + esc(t('common.pts')) + '</span></div><p>' + esc(L(q.explanation)) + '</p>' +
              '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="nextQ">' + esc(t('common.next')) + icon('arrowRight') + '</button></div></div>' : '') +
          '</div>';
      }

      function renderReport() {
        const facts = cs.cards.filter((c) => c.category === 'fact');
        const unknown = cs.cards.filter((c) => c.category === 'assumption');
        const list = (arr) => '<ul class="list-check">' + arr.map((c) => '<li>' + icon('fileText') + '<span>' + esc(L(c.description)) + '</span></li>').join('') + '</ul>';
        const steps = cs.steps.map((s) => {
          const on = state.steps.has(s.id);
          let cls = 'choice', mark = '';
          if (state.reportDone) {
            if (s.safe) { cls += on ? ' is-correct' : ''; mark = '<span class="choice__mark">' + icon(on ? 'check' : 'info') + esc(on ? t('det.stepGood') : t('det.stepMissed')) + '</span>'; }
            else if (on) { cls += ' is-wrong'; mark = '<span class="choice__mark">' + icon('x') + esc(t('det.stepBad')) + '</span>'; }
          }
          return '<div><button type="button" class="' + cls + '" data-action="toggleStep" data-value="' + s.id + '" aria-pressed="' + on + '"' + (state.reportDone ? ' disabled' : '') + '>' +
            '<span class="choice__key">' + (on ? '✓' : '') + '</span><span class="choice__label">' + esc(L(s.label)) + '</span>' + mark + '</button>' +
            (state.reportDone && (on || s.safe) ? '<p class="muted" style="margin:.35rem .4rem 0">' + esc(L(s.explanation)) + '</p>' : '') + '</div>';
        }).join('');
        ctx.root.innerHTML =
          '<div class="stack stack--lg">' +
            '<header><p class="kicker">' + icon('fileText') + esc(t('det.reportKicker')) + '</p><h2 tabindex="-1" style="font-size:1.6rem">' + esc(state.reportDone ? t('det.reportDone') : t('det.reportTitle')) + '</h2>' +
              '<p class="muted">' + esc(t('det.reportLead')) + '</p></header>' +
            '<div class="report-grid">' +
              '<section class="card"><h2 class="h-sm">' + icon('check') + esc(t('det.know')) + '</h2>' + list(facts) + '</section>' +
              '<section class="card"><h2 class="h-sm">' + icon('help') + esc(t('det.dontKnow')) + '</h2>' + list(unknown) + '<p class="note mt">' + icon('info') + '<span>' + esc(t('det.dontKnowNote')) + '</span></p></section>' +
              '<section class="card"><h2 class="h-sm">' + icon('shieldCheck') + esc(t('det.whatToDo')) + '</h2><p class="muted">' + esc(t('det.whatToDoLead')) + '</p><div class="stack mt">' + steps + '</div></section>' +
            '</div>' +
            '<div class="row row--end">' + (state.reportDone
              ? '<button type="button" class="btn btn--primary btn--lg" data-action="finish">' + esc(t('common.seeResults')) + icon('arrowRight') + '</button>'
              : '<button type="button" class="btn btn--primary btn--lg" data-action="submitReport">' + icon('fileText') + esc(t('det.submit')) + '</button>') + '</div>' +
          '</div>';
      }

      function render() {
        if (!state) return;
        if (state.phase === 'intro') renderIntro();
        else if (state.phase === 'board' || state.phase === 'checked') renderBoard();
        else if (state.phase === 'questions') renderQuestion();
        else renderReport();
      }

      // drag & drop (alternatywa: kliknięcie karty, a potem kategorii)
      function onDragStart(e) {
        const c = e.target.closest('[data-card-id]');
        if (!c || !state || state.phase !== 'board') return;
        e.dataTransfer.setData('text/plain', c.dataset.cardId);
        e.dataTransfer.effectAllowed = 'move';
      }
      function onDragOver(e) {
        const b = e.target.closest('[data-bucket]');
        if (b && state && state.phase === 'board') { e.preventDefault(); b.classList.add('is-over'); }
      }
      function onDragLeave(e) {
        const b = e.target.closest('[data-bucket]');
        if (b && !b.contains(e.relatedTarget)) b.classList.remove('is-over');
      }
      function onDrop(e) {
        const b = e.target.closest('[data-bucket]');
        if (!b) return;
        e.preventDefault();
        b.classList.remove('is-over');
        if (ctx.isPaused()) return;
        assign(e.dataTransfer.getData('text/plain'), b.dataset.bucket);
      }

      return {
        id: 'detektywi-internetu',
        init() {
          data = ctx.content.get('detectiveCases');
          cs = data.cases[0];
          ctx.content.requireFields(cs.cards, ['id', 'title', 'description', 'category', 'explanation'], 'detective-card');
          cs.cards.forEach((c) => { if (!catById(c.category)) throw new Error('Nieznana kategoria karty ' + c.id); });
          const root = ctx.root;
          root.addEventListener('dragstart', onDragStart);
          root.addEventListener('dragover', onDragOver);
          root.addEventListener('dragleave', onDragLeave);
          root.addEventListener('drop', onDrop);
        },
        start() { state = newState(); progress(); render(); },
        pause() {}, resume() {},
        restart() { state = newState(); progress(); render(); },
        handleAction(a) {
          switch (a.type) {
            case 'begin': state.phase = 'board'; progress(); render(); ctx.focus('h2[tabindex]'); break;
            case 'reveal':
              if (state.phase === 'board' && state.revealed < cs.cards.length) { state.revealed++; render(); ctx.focus('[data-card-id="' + cs.cards[state.revealed - 1].id + '"]'); }
              break;
            case 'select':
              if (state.phase !== 'board') return;
              state.selected = state.selected === a.value ? null : a.value;
              render();
              ctx.focus(state.selected ? '[data-bucket] .bucket__target' : '[data-card-id="' + a.value + '"]');
              break;
            case 'bucket': if (state.selected) assign(state.selected, a.value); break;
            case 'check': check(); break;
            case 'toQuestions': state.phase = 'questions'; state.qIndex = 0; state.qAnswer = null; progress(); render(); ctx.focus('h2[tabindex]'); break;
            case 'answerQ': answerQ(a.value); break;
            case 'nextQ':
              if (state.qAnswer === null) return;
              state.qIndex++; state.qAnswer = null;
              if (state.qIndex >= cs.questions.length) state.phase = 'report';
              progress(); render(); ctx.focus('h2[tabindex]');
              break;
            case 'toggleStep':
              if (state.reportDone) return;
              if (state.steps.has(a.value)) state.steps.delete(a.value); else state.steps.add(a.value);
              render(); ctx.focus('[data-value="' + a.value + '"]');
              break;
            case 'submitReport': submitReport(); break;
            case 'finish': if (state.reportDone) finish(); break;
          }
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() {}
      };
    }
  });
})(window.PH8);
