/* 6.2 Social Media Challenge – symulator fikcyjnego kanału społecznościowego */
(function (PH8) {
  'use strict';
  const METRICS = [
    { id: 'safety', icon: 'shield' },
    { id: 'trust', icon: 'heart' },
    { id: 'tension', icon: 'zap' }
  ];
  const REACT = { like: '👍', laugh: '😂', heart: '❤️', sad: '😢' };

  PH8.registerGame({
    id: 'social-media-challenge',
    icon: 'messages',
    accent: 'secondary',
    modes: ['individual', 'class'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let data = null, sc = null, state = null;

      const clamp = (v) => Math.max(0, Math.min(100, v));

      function newState() {
        return {
          metrics: Object.assign({}, sc.initialMetrics),
          turn: 0, phase: 'decide', history: [], flags: new Set(),
          feed: sc.initialPosts.slice(), timeline: [], pendingLater: null, last: null, ending: null
        };
      }

      function applyEffects(eff) {
        const d = {};
        METRICS.forEach((m) => {
          if (eff && typeof eff[m.id] === 'number') {
            const before = state.metrics[m.id];
            state.metrics[m.id] = clamp(before + eff[m.id]);
            d[m.id] = state.metrics[m.id] - before;
          }
        });
        return d;
      }

      function beginTurn() {
        const tr = sc.turns[state.turn];
        if (state.pendingLater) {
          const pl = state.pendingLater;
          state.pendingLater = null;
          const d = applyEffects(pl.effects);
          state.timeline.push({ text: pl.text, delta: d, later: true });
        }
        (tr.conditionalPosts || []).forEach((cp) => { if (state.flags.has(cp.flag)) state.feed.push(cp.post); });
        (tr.posts || []).forEach((p) => state.feed.push(p));
        ctx.onProgress(state.turn, sc.turns.length, t('smc.turn', { n: state.turn + 1, total: sc.turns.length }));
      }

      function choose(id) {
        if (state.phase !== 'decide') return;
        const tr = sc.turns[state.turn];
        const a = tr.actions.find((x) => x.id === id);
        if (!a) return;
        const d = applyEffects(a.effects || {});
        (a.flags || []).forEach((f) => state.flags.add(f));
        ctx.onScore(tr.id, a.points || 0);
        if (a.reply) state.feed.push(a.reply);
        if (a.later) state.pendingLater = a.later;
        state.history.push({ turn: tr, action: a, delta: d });
        state.timeline.push({ text: a.consequence, delta: d });
        state.last = { action: a, delta: d };
        state.phase = 'consequence';
        ctx.audio.play(a.quality === 'safe' ? 'correct' : (a.quality === 'risky' ? 'wrong' : 'click'));
        render();
        ctx.focus('[data-action="next"]');
      }

      function matches(cond) {
        if (!cond) return true;
        if (cond.anyOf) return cond.anyOf.some(matches);
        const m = state.metrics;
        if (cond.safetyMin != null && m.safety < cond.safetyMin) return false;
        if (cond.safetyMax != null && m.safety > cond.safetyMax) return false;
        if (cond.trustMin != null && m.trust < cond.trustMin) return false;
        if (cond.tensionMin != null && m.tension < cond.tensionMin) return false;
        if (cond.tensionMax != null && m.tension > cond.tensionMax) return false;
        if (cond.flag && !state.flags.has(cond.flag)) return false;
        return true;
      }

      function pickEnding() {
        const e = sc.endings.find((x) => x.when && matches(x.when));
        return e || sc.endings.find((x) => x.id === sc.defaultEnding) || sc.endings[sc.endings.length - 1];
      }

      function next() {
        if (state.phase !== 'consequence') return;
        state.turn++;
        if (state.turn >= sc.turns.length) {
          if (state.pendingLater) { const pl = state.pendingLater; state.pendingLater = null; state.timeline.push({ text: pl.text, delta: applyEffects(pl.effects), later: true }); }
          state.phase = 'end';
          state.ending = pickEnding();
          ctx.onProgress(sc.turns.length, sc.turns.length, t('smc.ending'));
          render();
          ctx.focus('.smc-decision h2');
          return;
        }
        state.phase = 'decide';
        beginTurn();
        render();
        ctx.focus('.smc-decision h2');
      }

      function finish() {
        const supporter = state.flags.has('supporter') || state.flags.has('askedAdult');
        const m = Object.assign({}, state.metrics);
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: 500,
          title: state.ending.title,
          summary: data.summary,
          stats: [
            { label: { pl: 'Bezpieczeństwo', en: 'Safety' }, value: String(m.safety) },
            { label: { pl: 'Zaufanie', en: 'Trust' }, value: String(m.trust) },
            { label: { pl: 'Napięcie', en: 'Tension' }, value: String(m.tension) }
          ],
          strengths: state.history.filter((h) => h.action.quality === 'safe').map((h) => h.action.label),
          discussion: data.discussion,
          flags: { supporter: supporter }
        });
      }

      function deltaList(d) {
        return '<ul class="deltas">' + METRICS.filter((m) => d[m.id]).map((m) => {
          const v = d[m.id];
          const good = m.id === 'tension' ? v < 0 : v > 0;
          return '<li class="delta delta--' + (good ? 'good' : 'bad') + '">' + icon(v > 0 ? 'trendUp' : 'trendDown') + (v > 0 ? '+' : '') + v + ' ' + esc(t('smc.m.' + m.id)) + '</li>';
        }).join('') + '</ul>';
      }

      function meter(m) {
        const v = state.metrics[m.id];
        const good = m.id === 'tension' ? v <= 40 : v >= 60;
        const bad = m.id === 'tension' ? v >= 65 : v <= 35;
        const st = good ? 'good' : (bad ? 'bad' : 'mid');
        return '<div class="meter meter--' + st + '"><div class="meter__head"><span>' + icon(m.icon) + esc(t('smc.m.' + m.id)) + '</span><strong>' + v + '</strong></div>' +
          '<div class="meter__track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '" aria-label="' + esc(t('smc.m.' + m.id)) + '"><div class="meter__fill" style="width:' + v + '%"></div></div>' +
          '<span class="meter__state">' + esc(t('smc.state.' + st)) + '</span></div>';
      }

      function post(p) {
        const kind = p.kind || 'post';
        return '<article class="post post--' + kind + '">' +
          (kind === 'system' ? '' : '<div class="avatar avatar--' + (p.color || 'secondary') + '" aria-hidden="true">' + esc(p.initials || '?') + '</div>') +
          '<div class="post__body"><header class="post__head"><strong>' + esc(L(p.author)) + '</strong><span class="muted">' + esc(p.time || '') + '</span>' +
            (kind === 'dm' ? '<span class="chip chip--accent">' + icon('lock') + esc(t('smc.dm')) + '</span>' : '') + '</header>' +
          '<p>' + esc(L(p.text)) + '</p>' +
          (p.reactions ? '<div class="post__reactions">' + Object.keys(p.reactions).map((k) => '<span class="reaction">' + (REACT[k] || '') + ' ' + p.reactions[k] + '</span>').join('') + '</div>' : '') +
          '</div></article>';
      }

      function qualityInfo(q) {
        return q === 'safe' ? { cls: 'ok', ic: 'shieldCheck' } : (q === 'risky' ? { cls: 'bad', ic: 'alert' } : { cls: 'warn', ic: 'info' });
      }

      function decisionPanel() {
        const tr = sc.turns[Math.min(state.turn, sc.turns.length - 1)];
        if (state.phase === 'decide') {
          return '<h2 tabindex="-1">' + icon('target') + esc(t('smc.situation')) + '</h2>' +
            '<p>' + esc(L(tr.situation)) + '</p>' +
            '<p class="muted mt">' + esc(t('smc.whatDo')) + '</p>' +
            '<div class="stack mt">' + tr.actions.map((a) => '<button type="button" class="choice" data-action="choose" data-value="' + a.id + '"><span class="choice__label">' + esc(L(a.label)) + '</span>' + icon('arrowRight') + '</button>').join('') + '</div>';
        }
        if (state.phase === 'consequence') {
          const a = state.last.action, q = qualityInfo(a.quality);
          return '<h2 tabindex="-1">' + icon('flag') + esc(t('smc.consequence')) + '</h2>' +
            '<div class="feedback feedback--' + q.cls + '" role="status"><div class="feedback__head">' + icon(q.ic) + '<strong>' + esc(t('smc.q.' + a.quality)) + '</strong><span class="feedback__pts">+' + (a.points || 0) + ' ' + esc(t('common.pts')) + '</span></div>' +
              '<p>' + esc(L(a.consequence)) + '</p><p class="muted">' + esc(L(a.comment)) + '</p>' + deltaList(state.last.delta) + '</div>' +
            '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="next">' + esc(state.turn + 1 >= sc.turns.length ? t('smc.seeEnding') : t('common.next')) + icon('arrowRight') + '</button></div>';
        }
        // zakończenie
        const e = state.ending;
        const good = state.history.filter((h) => h.action.quality === 'safe');
        const worse = state.history.filter((h) => h.action.quality !== 'safe');
        const best = (tr) => tr.actions.slice().sort((x, y) => (y.points || 0) - (x.points || 0))[0];
        return '<h2 tabindex="-1">' + icon('flag') + esc(L(e.title)) + '</h2><p>' + esc(L(e.text)) + '</p>' +
          (good.length ? '<h3 class="h-sm mt">' + esc(t('smc.improved')) + '</h3><ul class="outcome-list mt">' + good.map((h) => '<li class="outcome--good">' + icon('check') + '<span>' + esc(L(h.action.label)) + '</span></li>').join('') + '</ul>' : '') +
          (worse.length ? '<h3 class="h-sm mt">' + esc(t('smc.worsened')) + '</h3><ul class="outcome-list mt">' + worse.map((h) => {
            const b = best(h.turn);
            return '<li class="outcome--' + (h.action.quality === 'risky' ? 'bad' : 'mid') + '">' + icon(h.action.quality === 'risky' ? 'x' : 'info') + '<span>' + esc(L(h.action.label)) +
              '<span class="alt">' + icon('arrowRight') + ' ' + esc(t('smc.alternative')) + ': ' + esc(L(b.label)) + '</span></span></li>';
          }).join('') + '</ul>' : '') +
          '<div class="callout callout--warn mt">' + icon('lifebuoy') + '<div><p>' + esc(t('smc.safetyNote')) + '</p></div></div>' +
          '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="finish">' + esc(t('common.seeResults')) + icon('arrowRight') + '</button></div>';
      }

      function render() {
        if (!state) return;
        ctx.root.innerHTML =
          '<div class="smc">' +
            '<section class="card feed" aria-label="' + esc(t('smc.feedLabel')) + '">' +
              '<header class="feed__head"><span class="feed__logo">' + icon('messages') + '</span><strong>' + esc(L(data.platform)) + '</strong>' +
                '<span class="chip">#' + esc(L(sc.channel)) + '</span><span class="chip chip--muted">' + esc(t('smc.fictional')) + '</span></header>' +
              '<div class="feed__list">' + state.feed.map(post).join('') + '</div>' +
            '</section>' +
            '<aside class="smc__side">' +
              '<section class="card smc-decision">' + decisionPanel() + '</section>' +
              '<section class="card meters"><h2 class="h-sm">' + icon('trendUp') + esc(t('smc.metrics')) + '</h2>' + METRICS.map(meter).join('') + '</section>' +
              '<section class="card"><h2 class="h-sm">' + icon('clock') + esc(t('smc.timeline')) + '</h2>' +
                (state.timeline.length ? '<ol class="timeline">' + state.timeline.map((e) => '<li>' + (e.later ? '<span class="timeline__later">' + esc(t('smc.later')) + '</span> ' : '') + esc(L(e.text)) + '</li>').join('') + '</ol>'
                  : '<p class="muted">' + esc(t('smc.timelineEmpty')) + '</p>') +
              '</section>' +
            '</aside>' +
          '</div>';
        const list = ctx.root.querySelector('.feed__list');
        if (list) list.scrollTop = list.scrollHeight;
      }

      return {
        id: 'social-media-challenge',
        init() {
          data = ctx.content.get('socialMedia');
          sc = data.scenarios[0];
          if (!sc || !sc.turns || sc.turns.length < 1) throw new Error('Brak scenariusza');
          sc.turns.forEach((tr) => tr.actions.forEach((a) => { if (!a.effects) throw new Error('Brak skutków decyzji ' + a.id); }));
        },
        start() { state = newState(); beginTurn(); render(); },
        pause() {}, resume() {},
        restart() { state = newState(); beginTurn(); render(); },
        handleAction(a) {
          if (a.type === 'choose') choose(a.value);
          else if (a.type === 'next') next();
          else if (a.type === 'finish' && state.phase === 'end') finish();
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() {}
      };
    }
  });
})(window.PH8);
