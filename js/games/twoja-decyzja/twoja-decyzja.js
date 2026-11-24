/* 6.3 Twoja Decyzja – interaktywna opowieść (graf scen, flagi, wiele zakończeń) */
(function (PH8) {
  'use strict';
  const MAX_STEPS = 30; // zabezpieczenie przed pętlą

  PH8.registerGame({
    id: 'twoja-decyzja',
    icon: 'split',
    accent: 'accent',
    modes: ['individual', 'class', 'team'],

    create(ctx) {
      const { t, L, esc, icon } = ctx;
      let story = null, state = null, valid = true;
      const reached = new Set(); // zakończenia odkryte w tej sesji (także po „spróbuj ponownie”)

      function validate() {
        const ids = new Set(Object.keys(story.scenes));
        if (!ids.has(story.startScene)) return false;
        return Object.keys(story.scenes).every((id) => {
          const s = story.scenes[id];
          return Array.isArray(s.choices) && s.choices.length > 0 &&
            s.choices.every((c) => c.nextScene === 'END' || ids.has(c.nextScene));
        });
      }

      function newState() {
        return { sceneId: story.startScene, phase: 'scene', path: [], flags: new Set(), steps: 0, last: null, ending: null };
      }

      function scene() { return story.scenes[state.sceneId]; }

      function matches(req) {
        if (!req) return true;
        const f = state.flags;
        if (req.all && !req.all.every((x) => f.has(x))) return false;
        if (req.any && !req.any.some((x) => f.has(x))) return false;
        if (req.none && req.none.some((x) => f.has(x))) return false;
        return true;
      }

      function pickEnding() {
        const e = story.endings.find((x) => x.requires && matches(x.requires));
        return e || story.endings.find((x) => x.id === story.defaultEnding) || story.endings[story.endings.length - 1];
      }

      function progress() {
        const n = Math.min(state.path.length, story.expectedLength);
        ctx.onProgress(n, story.expectedLength, state.phase === 'ending' ? t('td.ending') : t('td.scene', { n: Math.min(state.path.length + 1, story.expectedLength) }));
      }

      function goEnding() {
        state.ending = pickEnding();
        reached.add(state.ending.id);
        state.phase = 'ending';
        progress();
        render();
        ctx.focus('.story h2');
      }

      function advance(choice) {
        state.steps++;
        const nxt = choice.nextScene;
        if (nxt === 'END' || !story.scenes[nxt] || state.steps >= MAX_STEPS) return goEnding();
        state.sceneId = nxt;
        state.phase = 'scene';
        progress();
        render();
        ctx.focus('.story__text');
      }

      function choose(id) {
        if (state.phase !== 'scene') return;
        const s = scene();
        const c = s.choices.find((x) => x.id === id);
        if (!c) return;
        state.path.push({ sceneId: state.sceneId, choice: c });
        (c.flags || []).forEach((f) => state.flags.add(f));
        ctx.onScore('scene:' + state.sceneId, (c.points || 0) + 20);
        state.last = c;
        if (c.noFeedback) return advance(c);
        state.phase = 'feedback';
        ctx.audio.play(c.quality === 'safe' ? 'correct' : (c.quality === 'risky' ? 'wrong' : 'click'));
        render();
        ctx.focus('[data-action="next"]');
      }

      function qualityInfo(q) {
        return q === 'safe' ? { cls: 'ok', ic: 'shieldCheck' } : (q === 'risky' ? { cls: 'bad', ic: 'alert' } : { cls: 'warn', ic: 'info' });
      }

      function finish() {
        const supportive = state.flags.has('offeredSupport') || state.flags.has('askedAdult');
        ctx.onComplete({
          points: ctx.getPoints(),
          maxPoints: 500,
          title: state.ending.title,
          summary: story.summary,
          stats: [{ label: { pl: 'Odkryte zakończenia', en: 'Endings discovered' }, value: reached.size + ' / ' + story.endings.length }],
          strengths: state.path.filter((p) => p.choice.quality === 'safe').map((p) => p.choice.label),
          discussion: story.discussion,
          flags: { supporter: supportive }
        });
      }

      function render() {
        if (!state) return;
        const exit = '<div class="story__exit"><button type="button" class="btn btn--ghost" data-action="help">' + icon('lifebuoy') + esc(t('td.needBreak')) + '</button></div>';

        if (state.phase === 'ending') {
          const e = state.ending;
          ctx.root.innerHTML =
            '<div class="story">' +
              (!valid ? '<div class="callout callout--warn">' + icon('alert') + '<div><p>' + esc(t('td.invalid')) + '</p></div></div>' : '') +
              '<article class="card"><p class="kicker">' + icon('flag') + esc(t('td.ending')) + '</p><h2 tabindex="-1" style="font-size:1.6rem;margin:.3rem 0 .6rem">' + esc(L(e.title)) + '</h2>' +
                '<p class="story__text">' + esc(L(e.text)) + '</p></article>' +
              '<section class="card"><h2 class="h-sm">' + icon('map') + esc(t('td.decisionMap')) + '</h2>' +
                '<ol class="decision-map mt">' + state.path.filter((p) => !p.choice.noFeedback).map((p) => {
                  const q = qualityInfo(p.choice.quality);
                  return '<li><div><strong>' + esc(L(story.scenes[p.sceneId].short)) + '</strong><div>' + esc(L(p.choice.label)) + '</div>' +
                    '<span class="outcome--' + (q.cls === 'ok' ? 'good' : (q.cls === 'bad' ? 'bad' : 'mid')) + '" style="display:inline-flex;gap:.3rem;align-items:center;font-weight:700;font-size:.9rem">' + icon(q.ic) + esc(t('td.q.' + p.choice.quality)) + '</span></div></li>';
                }).join('') + '</ol></section>' +
              '<section class="card"><h2 class="h-sm">' + icon('star') + esc(t('td.endingsMap')) + '</h2><div class="ending-map mt">' +
                story.endings.map((x) => {
                  const has = reached.has(x.id);
                  return '<div class="ending-tile' + (has ? ' is-reached' : '') + (x.id === e.id ? ' is-current' : '') + '">' + icon(has ? 'check' : 'lock') +
                    '<strong>' + esc(has ? L(x.title) : t('td.unknownEnding')) + '</strong>' + (x.id === e.id ? '<small>' + esc(t('td.current')) + '</small>' : '') + '</div>';
                }).join('') + '</div>' +
                '<p class="note mt">' + icon('info') + '<span>' + esc(t('td.dependsNote')) + '</span></p></section>' +
              '<div class="row row--end">' +
                '<button type="button" class="btn btn--secondary btn--lg" data-action="replay">' + icon('restart') + esc(t('td.replay')) + '</button>' +
                '<button type="button" class="btn btn--primary btn--lg" data-action="finish">' + esc(t('common.seeResults')) + icon('arrowRight') + '</button>' +
              '</div>' +
            '</div>';
          return;
        }

        const s = scene();
        let lower = '';
        if (state.phase === 'scene') {
          lower = '<h2 class="h-sm">' + esc(t('td.what')) + '</h2><div class="stack">' +
            s.choices.map((c) => '<button type="button" class="choice" data-action="choose" data-value="' + c.id + '"><span class="choice__label">' + esc(L(c.label)) + '</span>' + icon('arrowRight') + '</button>').join('') + '</div>';
        } else {
          const c = state.last, q = qualityInfo(c.quality);
          lower =
            '<div class="feedback feedback--' + q.cls + '" role="status">' +
              '<div class="feedback__head">' + icon(q.ic) + '<strong>' + esc(t('td.q.' + c.quality)) + '</strong><span class="feedback__pts">+' + ((c.points || 0) + 20) + ' ' + esc(t('common.pts')) + '</span></div>' +
              '<p><strong>' + esc(t('td.youChose')) + ':</strong> ' + esc(L(c.label)) + '</p>' +
              '<dl><dt>' + esc(t('td.effect')) + '</dt><dd>' + esc(L(c.feedback.effect)) + '</dd>' +
              '<dt>' + esc(t('td.risk')) + '</dt><dd>' + esc(L(c.feedback.risk)) + '</dd>' +
              '<dt>' + esc(t('td.alternative')) + '</dt><dd>' + esc(L(c.feedback.alternative)) + '</dd></dl>' +
              '<div class="row row--end mt"><button type="button" class="btn btn--primary btn--lg" data-action="next">' + esc(t('td.continue')) + icon('arrowRight') + '</button></div>' +
            '</div>';
        }
        ctx.root.innerHTML =
          '<div class="story">' +
            (state.path.length === 0 && state.phase === 'scene' ? '<div class="callout callout--info">' + icon('book') + '<div><strong>' + esc(L(story.title)) + '</strong><p>' + esc(L(story.intro)) + '</p></div></div>' : '') +
            '<article class="card">' +
              '<div class="story__head"><span class="chip">' + esc(t('td.scene', { n: Math.min(state.path.length + (state.phase === 'scene' ? 1 : 0), story.expectedLength) })) + '</span>' +
                (s.place ? '<span class="chip chip--muted">' + icon('pin') + esc(L(s.place)) + '</span>' : '') + '</div>' +
              (s.speaker ? '<div class="speaker"><div class="avatar avatar--accent" aria-hidden="true">' + esc(s.speaker.initials) + '</div><div><strong>' + esc(L(s.speaker.name)) + '</strong><span class="muted">' + esc(L(s.speaker.role)) + '</span></div></div>' : '') +
              '<p class="story__text" tabindex="-1">' + esc(L(s.text)) + '</p>' +
            '</article>' +
            lower + exit +
          '</div>';
      }

      return {
        id: 'twoja-decyzja',
        init() {
          const data = ctx.content.get('decisionStories');
          story = data.stories[0];
          if (!story || !story.scenes || !story.endings || !story.endings.length) throw new Error('Niekompletna opowieść');
          valid = validate();
          if (!valid) console.warn('[Twoja Decyzja] Graf scen jest niekompletny – użyte zostanie zakończenie domyślne.');
        },
        start() {
          state = newState();
          if (!valid) return goEnding();
          progress(); render();
        },
        pause() {}, resume() {},
        restart() { state = newState(); if (!valid) return goEnding(); progress(); render(); },
        handleAction(a) {
          if (a.type === 'choose') choose(a.value);
          else if (a.type === 'next' && state.phase === 'feedback') advance(state.last);
          else if (a.type === 'replay' && state.phase === 'ending') { state = newState(); progress(); render(); ctx.focus('.story__text'); }
          else if (a.type === 'finish' && state.phase === 'ending') finish();
          else if (a.type === 'help') ctx.openHelp();
        },
        getState() { return state; },
        getResults() { return { points: ctx.getPoints() }; },
        render: render,
        destroy() {}
      };
    }
  });
})(window.PH8);
