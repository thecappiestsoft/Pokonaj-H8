/* 6.6 Misja: STOP HATE – kampania pięciu misji z różnymi mechanikami */
(function (PH8) {
  'use strict';

  PH8.registerGame({
    id: 'misja-stop-hate',
    icon: 'flag',
    accent: 'error',
    modes: ['individual', 'team', 'class'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null, cats = null, state = null;

      function newState(missionId) {
        return {
          view: 'map', missionId: null, m: null,
          freeMode: ctx.config.freeMode || !!missionId,
          sessionDone: new Set(), xpCommitted: 0, sessionPoints: 0, results: {}
        };
      }

      const missions = () => data.missions;
      const idx = (id) => missions().findIndex((m) => m.id === id);
      const isDone = (id) => state.sessionDone.has(id) || ctx.progress.isMissionCompleted(id);
      const isUnlocked = (i) => state.freeMode || i === 0 || isDone(missions()[i - 1].id);
      const allDone = () => missions().every((m) => isDone(m.id));
      const mission = () => missions()[idx(state.missionId)];
      const per = (m, n) => Math.round(m.maxXp / n);

      function progress() {
        const done = missions().filter((m) => isDone(m.id)).length;
        let label = t('msh.progress', { n: done, total: missions().length });
        if (state.view === 'task' || state.view === 'brief' || state.view === 'done') label = t('msh.missionN', { n: idx(state.missionId) + 1 }) + ' · ' + L(mission().title);
        ctx.onProgress(done, missions().length, label);
      }

      // --- stan misji wg typu ---
      function newMissionState(m) {
        switch (m.gameType) {
          case 'classify': return { i: 0, answer: null, correct: 0 };
          case 'traces': return { marks: {}, checked: false, correct: 0 };
          case 'bystander': return { sel: new Set(), checked: false, correct: 0 };
          case 'branch': return { node: m.content.start, last: null, path: [], safe: 0, ended: false };
          case 'rules': return { sel: new Set(), checked: false, correct: 0 };
        }
        return {};
      }

      function openMission(id) {
        const i = idx(id);
        if (i < 0 || !isUnlocked(i)) return; // odporne na błędną kolejność kliknięć
        state.missionId = id;
        state.view = 'brief';
        progress();
        render();
        ctx.focus('h2[tabindex]');
      }

      function startMission() {
        const m = mission();
        state.m = newMissionState(m);
        state.mPoints = 0;
        state.view = 'task';
        progress();
        render();
        ctx.focus('h2[tabindex]');
      }

      function award(key, pts) {
        if (ctx.onScore(state.missionId + ':' + key, pts)) state.mPoints += pts;
      }

      function completeMission() {
        const m = mission();
        const xp = Math.min(m.maxXp, state.mPoints);
        const firstInSession = !state.sessionDone.has(m.id);
        state.sessionDone.add(m.id);
        if (firstInSession) state.xpCommitted += ctx.onMissionComplete(m.id, xp);
        state.results[m.id] = xp;
        state.view = 'done';
        ctx.audio.play('success');
        progress();
        render();
        ctx.focus('h2[tabindex]');
      }

      function finishCampaign() {
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: missions().reduce((a, m) => a + m.maxXp, 0),
          xp: 0,
          xpCommitted: state.xpCommitted,
          title: data.finale.title,
          summary: data.summary,
          stats: [{ label: { pl: 'Ukończone misje', en: 'Missions completed' }, value: missions().filter((m) => isDone(m.id)).length + ' / ' + missions().length }],
          strengths: missions().filter((m) => state.results[m.id] >= m.maxXp * 0.75).map((m) => m.takeaway),
          discussion: data.discussion,
          flags: { supporter: (state.results['mission-03'] || 0) >= 150 }
        });
      }

      // --- widoki ---
      function renderMap() {
        const nodes = missions().map((m, i) => {
          const done = isDone(m.id), open = isUnlocked(i);
          const status = done ? 'done' : (open ? 'open' : 'locked');
          const st = done ? icon('check') + esc(t('msh.done')) : (open ? icon('play') + esc(t('msh.available')) : icon('lock') + esc(t('msh.locked')));
          return '<li><button type="button" class="mission-node mission-node--' + status + '" data-action="openMission" data-value="' + m.id + '"' + (open ? '' : ' aria-disabled="true"') + '>' +
            '<span class="mission-node__num">' + (i + 1) + '</span><span class="mission-node__body"><strong>' + esc(L(m.title)) + '</strong>' +
            '<span class="muted">' + esc(L(m.description)) + '</span><span class="mission-node__status">' + st + '</span></span></button></li>';
        }).join('');
        ctx.root.innerHTML =
          '<div class="campaign">' +
            '<div class="row row--between"><div><h2 tabindex="-1">' + icon('map') + ' ' + esc(t('msh.map')) + '</h2><p class="muted">' + esc(L(data.intro)) + '</p></div>' +
              '<label class="switch" style="min-width:240px"><input type="checkbox" role="switch" data-change="freeMode"' + (state.freeMode ? ' checked' : '') + '>' +
              '<span class="switch__track" aria-hidden="true"></span><span class="switch__label">' + esc(t('msh.freeMode')) + '</span>' +
              '<span class="switch__state" data-on="' + esc(t('common.on')) + '" data-off="' + esc(t('common.off')) + '" aria-hidden="true"></span></label></div>' +
            '<ol class="mission-map">' + nodes + '</ol>' +
            '<section class="card"><h3 class="h-sm">' + icon('sparkle') + esc(t('msh.slogan')) + '</h3><div class="slogan__words">' +
              missions().map((m) => isDone(m.id) ? '<span class="word">' + esc(L(m.reward)) + '</span>' : '<span class="word word--empty">?</span>').join('') + '</div></section>' +
            (allDone() ? '<div class="row row--end"><button type="button" class="btn btn--primary btn--lg" data-action="finale">' + icon('award') + esc(t('msh.toFinale')) + '</button></div>' : '') +
          '</div>';
      }

      function renderBrief() {
        const m = mission(), i = idx(m.id);
        ctx.root.innerHTML =
          '<div class="mission-task">' +
            '<div><button type="button" class="btn btn--ghost" data-action="map">' + icon('arrowLeft') + esc(t('msh.backToMap')) + '</button></div>' +
            '<article class="card"><p class="kicker">' + icon('flag') + esc(t('msh.missionN', { n: i + 1 })) + '</p>' +
              '<h2 tabindex="-1" style="font-size:1.7rem;margin:.3rem 0 .8rem">' + esc(L(m.title)) + '</h2>' +
              '<div class="grid-2">' +
                '<div><h3 class="h-sm">' + icon('target') + esc(t('msh.goal')) + '</h3><p>' + esc(L(m.description)) + '</p></div>' +
                '<div><h3 class="h-sm">' + icon('book') + esc(t('instr.rules')) + '</h3><p>' + esc(L(m.rules)) + '</p></div>' +
                '<div><h3 class="h-sm">' + icon('clock') + esc(t('instr.time')) + '</h3><p>' + esc(t('game.minutes', { time: m.time })) + '</p></div>' +
                '<div><h3 class="h-sm">' + icon('award') + esc(t('msh.reward')) + '</h3><p>' + esc(t('msh.rewardText', { xp: m.maxXp })) + '</p></div>' +
              '</div></article>' +
            '<div class="row row--end"><button type="button" class="btn btn--primary btn--lg" data-action="startMission">' + icon('play') + esc(t('msh.start')) + '</button></div>' +
          '</div>';
      }

      function catLabel(id) { const c = cats.find((x) => x.id === id); return c ? L(c.label) : id; }

      function taskHtml(m) {
        const s = state.m, c = m.content;
        if (m.gameType === 'classify') {
          const it = c.items[s.i], answered = s.answer !== null;
          return '<article class="card message-card"><p class="kicker">' + esc(t('msh.item', { n: s.i + 1, total: c.items.length })) + '</p>' +
              '<blockquote class="message-card__quote" style="margin-top:.6rem">' + esc(L(it.prompt)) + '</blockquote></article>' +
            '<div class="choice-grid">' + c.options.map((o) => {
              let cls = 'choice', mark = '';
              if (answered) {
                if (o === it.correct) { cls += ' is-correct'; mark = '<span class="choice__mark">' + icon('check') + '</span>'; }
                else if (o === s.answer) { cls += ' is-wrong'; mark = '<span class="choice__mark">' + icon('x') + '</span>'; }
              }
              return '<button type="button" class="' + cls + '" data-action="classify" data-value="' + o + '"' + (answered ? ' disabled' : '') + '><span class="choice__label">' + esc(catLabel(o)) + '</span>' + mark + '</button>';
            }).join('') + '</div>' +
            (answered ? '<div class="feedback feedback--' + (s.answer === it.correct ? 'ok' : 'bad') + '" role="status"><div class="feedback__head">' + icon(s.answer === it.correct ? 'check' : 'info') +
              '<strong>' + esc(s.answer === it.correct ? t('hd.fbCorrect') : t('hd.fbWrong')) + '</strong><span class="feedback__pts">+' + (s.answer === it.correct ? per(m, c.items.length) : 0) + ' XP</span></div>' +
              '<p><strong>' + esc(t('hd.correctIs')) + ':</strong> ' + esc(catLabel(it.correct)) + '. ' + esc(L(it.explanation)) + '</p>' +
              '<div class="row row--end mt"><button type="button" class="btn btn--primary" data-action="classifyNext">' + esc(t('common.next')) + icon('arrowRight') + '</button></div></div>' : '');
        }
        if (m.gameType === 'traces') {
          return '<article class="post"><div class="avatar avatar--warn" aria-hidden="true">' + esc(c.post.initials) + '</div><div class="post__body"><header class="post__head"><strong>' + esc(c.post.author) + '</strong><span class="chip chip--muted">' + esc(t('smc.fictional')) + '</span></header><p>' + esc(L(c.post.text)) + '</p></div></article>' +
            '<ul class="mark-list">' + c.comments.map((cm) => {
              const v = s.marks[cm.id];
              const res = s.checked ? (v === cm.effect ? ' is-correct' : ' is-wrong') : '';
              return '<li class="mark-item' + res + '"><div class="avatar avatar--muted" aria-hidden="true">' + esc(cm.author.slice(0, 2).toUpperCase()) + '</div><div class="post__body"><strong>' + esc(cm.author) + '</strong><p>' + esc(L(cm.text)) + '</p></div>' +
                '<div class="row" role="group" aria-label="' + esc(L(cm.text)) + '">' +
                  '<button type="button" class="btn btn--ghost btn--sm" data-action="mark" data-value="' + cm.id + ':helps" aria-pressed="' + (v === 'helps') + '"' + (s.checked ? ' disabled' : '') + '>' + icon('heart') + esc(t('msh.helps')) + '</button>' +
                  '<button type="button" class="btn btn--ghost btn--sm" data-action="mark" data-value="' + cm.id + ':harms" aria-pressed="' + (v === 'harms') + '"' + (s.checked ? ' disabled' : '') + '>' + icon('flame') + esc(t('msh.harms')) + '</button></div>' +
                (s.checked ? '<div class="mark-item__fb">' + icon(v === cm.effect ? 'check' : 'x') + '<span>' + esc(L(cm.explanation)) + '</span></div>' : '') + '</li>';
            }).join('') + '</ul>' +
            checkRow(s.checked, Object.keys(s.marks).length === c.comments.length, m, s.correct, c.comments.length);
        }
        if (m.gameType === 'bystander' || m.gameType === 'rules') {
          const list = m.gameType === 'bystander' ? c.actions : c.rules;
          return (m.gameType === 'bystander' ? '<div class="callout callout--info">' + icon('eye') + '<div><p>' + esc(L(c.situation)) + '</p></div></div>' : '') +
            '<div class="stack">' + list.map((a) => {
              const on = s.sel.has(a.id);
              let cls = 'choice', mark = '';
              if (s.checked) {
                if (a.good && on) { cls += ' is-correct'; mark = '<span class="choice__mark">' + icon('check') + '</span>'; }
                else if (!a.good && on) { cls += ' is-wrong'; mark = '<span class="choice__mark">' + icon('x') + '</span>'; }
                else if (a.good && !on) { mark = '<span class="choice__mark">' + icon('info') + esc(t('det.stepMissed')) + '</span>'; }
              }
              return '<div><button type="button" class="' + cls + '" data-action="toggle" data-value="' + a.id + '" aria-pressed="' + on + '"' + (s.checked ? ' disabled' : '') + '>' +
                '<span class="choice__key">' + (on ? '✓' : '') + '</span><span class="choice__label">' + esc(L(a.label)) + '</span>' + mark + '</button>' +
                (s.checked && a.explanation ? '<p class="muted" style="margin:.3rem .4rem 0">' + esc(L(a.explanation)) + '</p>' : '') + '</div>';
            }).join('') + '</div>' +
            (s.checked && m.gameType === 'rules' && s.sel.size
              ? '<div class="charter"><h3>' + icon('fileText') + ' ' + esc(t('msh.charter')) + '</h3><ul class="list-check">' +
                  list.filter((r) => r.good && s.sel.has(r.id)).map((r) => '<li>' + icon('check') + '<span>' + esc(L(r.label)) + '</span></li>').join('') + '</ul></div>'
              : '') +
            checkRow(s.checked, s.sel.size > 0, m, s.correct, list.length);
        }
        if (m.gameType === 'branch') {
          if (s.ended) {
            return '<div class="feedback feedback--' + (s.safe === 2 ? 'ok' : 'info') + '"><div class="feedback__head">' + icon('flag') + '<strong>' + esc(t('msh.branchEnd', { n: s.safe, total: 2 })) + '</strong></div>' +
              '<ul class="outcome-list mt">' + s.path.map((p) => '<li class="outcome--' + (p.safe ? 'good' : 'bad') + '">' + icon(p.safe ? 'check' : 'x') + '<span>' + esc(L(p.label)) + '<span class="alt">' + esc(L(p.feedback)) + '</span></span></li>').join('') + '</ul>' +
              '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="complete">' + esc(t('msh.completeMission')) + icon('arrowRight') + '</button></div></div>';
          }
          const n = c.nodes[s.node];
          return '<article class="card"><p class="story__text">' + esc(L(n.text)) + '</p></article>' +
            (s.last
              ? '<div class="feedback feedback--' + (s.last.safe ? 'ok' : 'bad') + '" role="status"><div class="feedback__head">' + icon(s.last.safe ? 'shieldCheck' : 'alert') + '<strong>' + esc(s.last.safe ? t('td.q.safe') : t('td.q.risky')) + '</strong><span class="feedback__pts">+' + (s.last.safe ? 100 : 0) + ' XP</span></div><p>' + esc(L(s.last.feedback)) + '</p>' +
                '<div class="row row--end mt"><button type="button" class="btn btn--primary" data-action="branchNext">' + esc(t('common.next')) + icon('arrowRight') + '</button></div></div>'
              : '<div class="stack">' + n.choices.map((ch, k) => '<button type="button" class="choice" data-action="branch" data-value="' + k + '"><span class="choice__label">' + esc(L(ch.label)) + '</span>' + icon('arrowRight') + '</button>').join('') + '</div>');
        }
        return '';
      }

      function checkRow(checked, ready, m, correct, total) {
        if (checked) {
          return '<div class="feedback feedback--info" role="status"><div class="feedback__head">' + icon('target') + '<strong>' + esc(t('msh.checkResult', { n: correct, total: total })) + '</strong><span class="feedback__pts">+' + state.mPoints + ' XP</span></div>' +
            '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="complete">' + esc(t('msh.completeMission')) + icon('arrowRight') + '</button></div></div>';
        }
        return '<div class="row row--end"><button type="button" class="btn btn--primary btn--lg" data-action="check"' + (ready ? '' : ' disabled') + '>' + icon('check') + esc(t('esc.check')) + '</button></div>';
      }

      function renderTask() {
        const m = mission();
        ctx.root.innerHTML =
          '<div class="mission-task">' +
            '<div class="row row--between"><button type="button" class="btn btn--ghost" data-action="map">' + icon('arrowLeft') + esc(t('msh.backToMap')) + '</button>' +
              '<span class="chip">' + icon('flag') + esc(t('msh.missionN', { n: idx(m.id) + 1 })) + '</span></div>' +
            '<header><h2 tabindex="-1" style="font-size:1.5rem">' + esc(L(m.title)) + '</h2><p class="muted">' + esc(L(m.rules)) + '</p></header>' +
            taskHtml(m) +
          '</div>';
      }

      function renderDone() {
        const m = mission(), i = idx(m.id);
        const nextM = missions()[i + 1];
        ctx.root.innerHTML =
          '<div class="final-door">' +
            '<span class="final-door__icon">' + icon('check') + '</span>' +
            '<p class="kicker">' + esc(t('msh.missionN', { n: i + 1 })) + '</p>' +
            '<h2 tabindex="-1" style="font-size:1.9rem">' + esc(t('msh.missionDone')) + '</h2>' +
            '<div class="stats" style="width:100%"><div class="stat"><span class="stat__label">XP</span><strong class="stat__value">+' + (state.results[m.id] || 0) + '</strong></div>' +
              '<div class="stat"><span class="stat__label">' + esc(t('msh.word')) + '</span><strong class="stat__value">' + esc(L(m.reward)) + '</strong></div></div>' +
            '<div class="callout callout--safe" style="text-align:left;width:100%">' + icon('bulb') + '<div><strong>' + esc(t('msh.remember')) + '</strong><p>' + esc(L(m.takeaway)) + '</p></div></div>' +
            '<div class="row row--center">' +
              '<button type="button" class="btn btn--secondary btn--lg" data-action="map">' + icon('map') + esc(t('msh.backToMap')) + '</button>' +
              (allDone() ? '<button type="button" class="btn btn--primary btn--lg" data-action="finale">' + icon('award') + esc(t('msh.toFinale')) + '</button>'
                : (nextM && isUnlocked(i + 1) ? '<button type="button" class="btn btn--primary btn--lg" data-action="openMission" data-value="' + nextM.id + '">' + esc(t('msh.nextMission')) + icon('arrowRight') + '</button>' : '')) +
            '</div>' +
          '</div>';
      }

      function renderFinale() {
        ctx.root.innerHTML =
          '<div class="final-door">' +
            '<span class="campaign-badge"><span>' + icon('award') + '</span></span>' +
            '<h2 tabindex="-1" style="font-size:2rem">' + esc(L(data.finale.title)) + '</h2>' +
            '<p class="lead">' + esc(L(data.finale.text)) + '</p>' +
            '<div class="slogan__words" style="justify-content:center">' + missions().map((m) => '<span class="word">' + esc(L(m.reward)) + '</span>').join('') + '</div>' +
            '<section class="card" style="width:100%;text-align:left"><h3 class="h-sm">' + icon('messages') + esc(t('results.discussion')) + '</h3><ol class="list-num mt">' +
              data.discussion.map((d) => '<li>' + esc(L(d)) + '</li>').join('') + '</ol></section>' +
            '<button type="button" class="btn btn--primary btn--lg" data-action="finishCampaign">' + esc(t('msh.finishCampaign')) + icon('arrowRight') + '</button>' +
          '</div>';
      }

      function render() {
        if (!state) return;
        switch (state.view) {
          case 'brief': return renderBrief();
          case 'task': return renderTask();
          case 'done': return renderDone();
          case 'finale': return renderFinale();
          default: return renderMap();
        }
      }

      function handleTask(a) {
        const m = mission(), s = state.m, c = m.content;
        switch (a.type) {
          case 'classify': {
            if (s.answer !== null) return;
            s.answer = a.value;
            const it = c.items[s.i];
            if (a.value === it.correct) { s.correct++; award(it.id, per(m, c.items.length)); ctx.audio.play('correct'); } else ctx.audio.play('wrong');
            render(); ctx.focus('[data-action="classifyNext"]');
            break;
          }
          case 'classifyNext':
            if (s.answer === null) return;
            s.i++; s.answer = null;
            if (s.i >= c.items.length) return completeMission();
            render(); ctx.focus('h2[tabindex]');
            break;
          case 'mark': {
            if (s.checked) return;
            const [id, v] = String(a.value).split(':');
            s.marks[id] = v;
            render(); ctx.focus('[data-value="' + a.value + '"]');
            break;
          }
          case 'toggle':
            if (s.checked) return;
            if (s.sel.has(a.value)) s.sel.delete(a.value); else s.sel.add(a.value);
            render(); ctx.focus('[data-action="toggle"][data-value="' + a.value + '"]');
            break;
          case 'check': {
            if (s.checked) return;
            if (m.gameType === 'traces') {
              c.comments.forEach((cm) => { if (s.marks[cm.id] === cm.effect) { s.correct++; award(cm.id, per(m, c.comments.length)); } });
            } else {
              const list = m.gameType === 'bystander' ? c.actions : c.rules;
              list.forEach((x) => { if (x.good === s.sel.has(x.id)) { s.correct++; award(x.id, per(m, list.length)); } });
            }
            s.checked = true;
            ctx.audio.play('correct');
            render(); ctx.focus('[data-action="complete"]');
            break;
          }
          case 'branch': {
            if (s.last || s.ended) return;
            const ch = c.nodes[s.node].choices[Number(a.value)];
            if (!ch) return;
            s.last = ch;
            s.path.push(ch);
            if (ch.safe) { s.safe++; award(s.node, 100); ctx.audio.play('correct'); } else ctx.audio.play('wrong');
            render(); ctx.focus('[data-action="branchNext"]');
            break;
          }
          case 'branchNext': {
            if (!s.last) return;
            const nxt = s.last.next;
            s.last = null;
            if (nxt === 'END' || !c.nodes[nxt] || s.path.length > 10) s.ended = true; else s.node = nxt;
            render(); ctx.focus(s.ended ? '[data-action="complete"]' : '.story__text');
            break;
          }
          case 'complete': completeMission(); break;
        }
      }

      return {
        id: 'misja-stop-hate',
        init() {
          data = ctx.content.get('campaign');
          cats = ctx.content.get('hejtDetector').categories;
          ctx.content.requireFields(data.missions, ['id', 'title', 'description', 'gameType', 'completionRule'], 'campaign-missions');
        },
        start() {
          state = newState(ctx.config.missionId);
          if (ctx.config.missionId && idx(ctx.config.missionId) >= 0) { state.missionId = ctx.config.missionId; state.view = 'brief'; }
          progress(); render();
        },
        pause() {}, resume() {},
        restart() { state = newState(ctx.config.missionId); progress(); render(); },
        handleAction(a) {
          switch (a.type) {
            case 'freeMode': state.freeMode = !!a.value; render(); ctx.focus('[data-change="freeMode"]'); return;
            case 'openMission': openMission(a.value); return;
            case 'map': state.view = 'map'; state.missionId = null; progress(); render(); ctx.focus('h2[tabindex]'); return;
            case 'startMission': if (state.view === 'brief') startMission(); return;
            case 'finale': if (allDone()) { state.view = 'finale'; render(); ctx.focus('h2[tabindex]'); } return;
            case 'finishCampaign': if (allDone()) finishCampaign(); return;
          }
          if (state.view === 'task') handleTask(a);
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() {}
      };
    }
  });
})(window.PH8);
