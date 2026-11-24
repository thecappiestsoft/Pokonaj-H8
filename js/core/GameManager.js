/* GameManager – cykl życia gry: start, pasek rozgrywki, pauza, restart, zakończenie i wyniki.
   Nie zna szczegółów mechaniki – komunikuje się z modułem przez kontrakt (init/start/pause/resume/
   restart/handleAction/getState/getResults/destroy + render). */
(function (PH8) {
  'use strict';
  const { esc } = PH8.util;
  const C = PH8.core;
  const t = (k, p) => PH8.t(k, p);
  const L = (v) => PH8.L(v);
  const icon = (n) => PH8.icon(n);

  let cur = null;

  function defaultMode(def) {
    const pref = C.SettingsManager.get('playMode');
    return def.modes.includes(pref) ? pref : def.modes[0];
  }

  function buildContext(c) {
    const S = C.SettingsManager;
    return {
      t: t, L: L, esc: esc, icon: icon,
      get root() { return c.root; },
      config: {
        mode: c.mode,
        timerEnabled: !!S.get('timerEnabled'),
        questionCount: Number(S.get('questionCount')) || 10,
        difficulty: S.get('difficulty') || 'normal',
        freeMode: !!S.get('freeMode'),
        missionId: c.opts.missionId || null
      },
      teams: C.TeacherMode,
      ui: C.UIManager,
      audio: C.AudioManager,
      content: C.ContentManager,
      progress: C.ProgressManager,
      onProgress(current, total, label) {
        c.progress = { cur: current, total: total, label: label || '' };
        GM.updateBar();
      },
      onScore(key, points) {
        const ok = C.ScoreManager.award(key, points);
        GM.updateBar();
        return ok;
      },
      getPoints() { return C.ScoreManager.getPoints(); },
      createTimer(opts) {
        opts = opts || {};
        const show = opts.show !== false;
        const tm = new PH8.components.Timer({
          duration: opts.duration,
          countUp: opts.countUp,
          onTick(ms) {
            if (show && c.activeTimer === tm) { c.timerMs = ms; GM.updateBar(); }
            if (opts.onTick) opts.onTick(ms);
          },
          onEnd() { if (opts.onEnd) opts.onEnd(); }
        });
        c.timers.push(tm);
        if (show) { c.activeTimer = tm; c.timerMs = opts.duration || 0; }
        return tm;
      },
      hideTimer() { c.activeTimer = null; GM.updateBar(); },
      isPaused() { return c.paused; },
      focus(selector) {
        requestAnimationFrame(() => {
          const el = c.root && c.root.querySelector(selector);
          if (el) el.focus({ preventScroll: false });
        });
      },
      scrollTop() { if (c.view) c.view.scrollIntoView({ block: 'start', behavior: 'auto' }); },
      onComplete(results) { GM.finish(results); },
      onMissionComplete(missionId, xp) { return GM.missionComplete(missionId, xp); },
      openHelp() { C.AppController.go('help'); },
      confirm(o) { return C.UIManager.confirm(o); },
      toast(m, type) { C.UIManager.toast(m, type); }
    };
  }

  function dispatch(action) {
    if (!cur || cur.paused || cur.finished || !cur.module) return;
    try {
      cur.module.handleAction(action);
    } catch (err) {
      console.error('[GameManager] Błąd akcji modułu:', err && err.message);
      GM.showError();
    }
  }

  function bindView(view) {
    view.addEventListener('click', (e) => {
      const gm = e.target.closest('[data-gm]');
      if (gm) {
        const a = gm.dataset.gm;
        if (a === 'pause') GM.pause();
        else if (a === 'menu') C.AppController.go('menu');
        else if (a === 'again' && cur) GM.start(cur.def.id, cur.opts);
        else if (a === 'help') C.AppController.go('help');
        return;
      }
      const el = e.target.closest('[data-action]');
      if (!el || !cur || !cur.root || !cur.root.contains(el)) return;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      C.AudioManager.play('click');
      dispatch({ type: el.dataset.action, value: el.dataset.value, el: el, event: e });
    });
    view.addEventListener('change', (e) => {
      const el = e.target.closest('[data-change]');
      if (!el || !cur || !cur.root || !cur.root.contains(el)) return;
      dispatch({ type: el.dataset.change, value: el.type === 'checkbox' ? el.checked : el.value, key: el.dataset.value, el: el });
    });
  }

  const GM = {
    list() {
      return PH8.gameDefs.slice().sort((a, b) => (PH8.data.games[a.id].num - PH8.data.games[b.id].num));
    },
    get(id) { return PH8.gameDefs.find((g) => g.id === id) || null; },
    meta(id) { return PH8.data.games[id]; },
    defaultMode: defaultMode,
    isActive() { return !!(cur && !cur.finished); },
    hasCurrent() { return !!cur; },
    current() { return cur; },

    start(id, opts) {
      const def = this.get(id);
      if (!def) { C.UIManager.toast(t('error.noGame'), 'error'); return; }
      this.destroy();
      const main = C.AppController.mountView('game', { id: id });
      const view = document.createElement('div');
      view.className = 'game-view';
      main.appendChild(view);
      cur = {
        def: def, meta: this.meta(id), view: view, opts: opts || {},
        timers: [], activeTimer: null, timerMs: 0,
        paused: false, finished: false, errored: false,
        progress: { cur: 0, total: 0, label: '' },
        module: null, results: null, pauseModal: null, root: null
      };
      cur.mode = cur.opts.mode && def.modes.includes(cur.opts.mode) ? cur.opts.mode : defaultMode(def);
      C.ScoreManager.startSession(id);
      C.ProgressManager.markStarted(id);
      C.ProgressManager.setLastSession({ gameId: id, startedAt: Date.now() });
      view.innerHTML = '<div class="game-shell"><div data-bar-host></div><div class="game-area" tabindex="-1"></div></div>';
      cur.root = view.querySelector('.game-area');
      bindView(view);
      this.renderBar();
      cur.ctx = buildContext(cur);
      try {
        cur.module = def.create(cur.ctx);
        if (cur.module.init) cur.module.init(cur.ctx);
        cur.module.start();
      } catch (err) {
        console.error('[GameManager] Nie udało się uruchomić modułu:', err && err.message);
        this.showError();
      }
      window.scrollTo(0, 0);
    },

    renderBar() {
      if (!cur || cur.finished) return;
      const host = cur.view.querySelector('[data-bar-host]');
      if (!host) return;
      const m = cur.meta;
      host.innerHTML =
        '<div class="game-bar">' +
          '<div class="game-bar__title"><span class="game-bar__icon">' + icon(cur.def.icon) + '</span>' +
            '<div><span class="game-bar__kicker">' + esc(t('game.modeN', { n: m.num })) + ' · ' + esc(t('mode.' + cur.mode)) + '</span>' +
            '<h1 class="game-bar__name" tabindex="-1">' + esc(L(m.name)) + '</h1></div></div>' +
          '<div class="game-bar__progress"><span class="game-bar__label" data-bar="label"></span>' +
            '<div class="progress" role="progressbar" aria-valuemin="0" data-bar="pbar"><div class="progress__bar" data-bar="bar"></div></div></div>' +
          '<div class="game-bar__stat"><span class="game-bar__statlabel">' + esc(t('game.score')) + '</span><strong data-bar="score" aria-live="polite">0</strong></div>' +
          '<div class="game-bar__stat game-bar__timer" data-bar="timerWrap" hidden><span class="game-bar__statlabel">' + icon('clock') + esc(t('game.time')) + '</span><strong data-bar="timer">--:--</strong></div>' +
          '<div class="game-bar__actions">' +
            '<button type="button" class="btn btn--icon btn--ghost" data-gm="pause" aria-label="' + esc(t('game.pause')) + '" title="' + esc(t('game.pause')) + '">' + icon('pause') + '</button>' +
            '<button type="button" class="btn btn--icon btn--ghost" data-gm="menu" aria-label="' + esc(t('game.backToMenu')) + '" title="' + esc(t('game.backToMenu')) + '">' + icon('home') + '</button>' +
          '</div>' +
        '</div>';
      this.updateBar();
    },

    updateBar() {
      if (!cur || cur.finished) return;
      const q = (s) => cur.view.querySelector('[data-bar="' + s + '"]');
      const p = cur.progress;
      const label = q('label'), bar = q('bar'), pbar = q('pbar'), score = q('score'), tw = q('timerWrap'), tv = q('timer');
      if (label) label.textContent = p.label || (p.total ? t('game.progress', { cur: p.cur, total: p.total }) : '');
      if (bar) bar.style.width = (p.total ? Math.round((p.cur / p.total) * 100) : 0) + '%';
      if (pbar) { pbar.setAttribute('aria-valuemax', String(p.total || 1)); pbar.setAttribute('aria-valuenow', String(p.cur || 0)); pbar.setAttribute('aria-label', t('game.progressLabel')); }
      if (score) score.textContent = String(C.ScoreManager.getPoints());
      const showTimer = !!(cur.activeTimer && cur.activeTimer.state !== 'stopped' && cur.activeTimer.state !== 'idle');
      if (tw) tw.hidden = !showTimer;
      if (tv && showTimer) tv.textContent = PH8.util.fmtTime(cur.timerMs);
    },

    pause() {
      if (!this.isActive() || cur.paused || cur.pauseModal) return;
      cur.paused = true;
      cur.timers.forEach((tm) => tm.pause());
      if (cur.module && cur.module.pause) cur.module.pause();
      cur.view.classList.add('is-paused');
      let choice = 'resume';
      cur.pauseModal = C.UIManager.modal({
        title: t('pause.title'),
        icon: 'pause',
        body: '<p>' + esc(t('pause.body')) + '</p>',
        actions: [
          { label: t('pause.resume'), variant: 'primary', icon: 'play', onClick: () => { choice = 'resume'; } },
          { label: t('pause.restart'), variant: 'secondary', icon: 'restart', onClick: () => { choice = 'restart'; } },
          { label: t('pause.end'), variant: 'danger', icon: 'x', onClick: () => { choice = 'end'; } }
        ],
        onClose: () => {
          if (cur) cur.pauseModal = null;
          if (choice === 'restart') GM.restart();
          else if (choice === 'end') GM.end();
          else GM.resume();
        }
      });
    },

    resume() {
      if (!cur || !cur.paused) return;
      cur.paused = false;
      cur.view.classList.remove('is-paused');
      cur.timers.forEach((tm) => tm.resume());
      if (cur.module && cur.module.resume) cur.module.resume();
    },

    restart() {
      if (!cur || cur.finished) return;
      cur.paused = false;
      cur.view.classList.remove('is-paused');
      cur.timers.forEach((tm) => tm.stop());
      cur.timers = [];
      cur.activeTimer = null;
      cur.progress = { cur: 0, total: 0, label: '' };
      C.ScoreManager.startSession(cur.def.id); // reset tylko bieżącej gry – postęp aplikacji zostaje
      try { cur.module.restart(); } catch (err) { console.error(err && err.message); this.showError(); return; }
      this.updateBar();
      C.UIManager.toast(t('game.restarted'), 'info');
    },

    end() {
      this.destroy();
      C.AppController.go('menu', null, { force: true });
    },

    missionComplete(missionId, xp) {
      if (!cur) return 0;
      const added = C.ScoreManager.addXp(C.ScoreManager.sessionId() + ':' + missionId, xp);
      C.ProgressManager.completeMission(missionId);
      C.AchievementManager.evaluate({ flags: {} }).forEach((a) => C.UIManager.toast(t('ach.unlocked', { name: L(a.name) }), 'success', 5000));
      return added;
    },

    finish(results) {
      if (!cur || cur.finished) return;
      results = results || {};
      cur.timers.forEach((tm) => tm.stop());
      const points = C.ScoreManager.getPoints();
      const xpBase = results.xp != null ? results.xp : (results.points != null ? results.points : points);
      const gained = C.ScoreManager.commit(xpBase);
      C.ProgressManager.markCompleted(cur.def.id);
      C.ProgressManager.clearLastSession();
      const newAch = C.AchievementManager.evaluate({ flags: results.flags || {} });
      cur.finished = true;
      cur.results = Object.assign({ points: points }, results, { gained: gained + (results.xpCommitted || 0), newAch: newAch });
      C.AudioManager.play('success');
      this.renderResults();
      newAch.forEach((a) => C.UIManager.toast(t('ach.unlocked', { name: L(a.name) }), 'success', 5000));
    },

    renderResults() {
      if (!cur || !cur.results) return;
      const r = cur.results, m = cur.meta;
      const total = C.ScoreManager.getTotalXp();
      const lvl = C.ScoreManager.getLevel(total);
      const li = (arr) => (arr || []).map((x) => '<li>' + icon('check') + '<span>' + esc(L(x)) + '</span></li>').join('');
      const ol = (arr) => (arr || []).map((x) => '<li>' + esc(L(x)) + '</li>').join('');
      const levelProgress = lvl.next ? C.UIManager.progress(total - lvl.min, lvl.next - lvl.min, t('level.progress')) : C.UIManager.progress(1, 1, t('level.progress'));
      cur.view.innerHTML =
        '<section class="results view-enter">' +
          '<header class="results__head">' +
            '<span class="results__icon">' + icon('trophy') + '</span>' +
            '<p class="kicker">' + esc(t('results.kicker')) + ' · ' + esc(L(m.name)) + '</p>' +
            '<h1 tabindex="-1">' + esc(r.title ? L(r.title) : t('results.title')) + '</h1>' +
            (r.summary ? '<p class="lead">' + esc(L(r.summary)) + '</p>' : '') +
          '</header>' +
          '<div class="stats">' +
            '<div class="stat"><span class="stat__label">' + esc(t('results.score')) + '</span><strong class="stat__value">' + r.points + (r.maxPoints ? ' <small>/ ' + r.maxPoints + '</small>' : '') + '</strong></div>' +
            '<div class="stat"><span class="stat__label">' + esc(t('results.xp')) + '</span><strong class="stat__value">+' + r.gained + ' XP</strong></div>' +
            (r.stats || []).map((s) => '<div class="stat"><span class="stat__label">' + esc(L(s.label)) + '</span><strong class="stat__value">' + esc(L(s.value)) + '</strong></div>').join('') +
            '<div class="stat"><span class="stat__label">' + esc(t('level.label', { n: lvl.level })) + '</span><strong class="stat__value" style="font-size:1.15rem">' + esc(L(lvl.name)) + '</strong>' + levelProgress + '<small class="muted">' + total + ' XP</small></div>' +
          '</div>' +
          (r.newAch && r.newAch.length ? '<div class="badge-row">' + r.newAch.map((a) => '<div class="badge-new">' + icon(a.icon) + '<span>' + esc(t('ach.new')) + ': ' + esc(L(a.name)) + '</span></div>').join('') + '</div>' : '') +
          (typeof r.extra === 'function' ? '<div class="results__extra">' + r.extra() + '</div>' : '') +
          '<div class="grid-2">' +
            (r.strengths && r.strengths.length ? '<div class="panel"><h2>' + icon('star') + esc(t('results.strengths')) + '</h2><ul class="list-check">' + li(r.strengths) + '</ul></div>' : '') +
            (r.discussion && r.discussion.length ? '<div class="panel' + (r.strengths && r.strengths.length ? '' : ' span-2') + '"><h2>' + icon('messages') + esc(t('results.discussion')) + '</h2><ol class="list-num">' + ol(r.discussion) + '</ol></div>' : '') +
          '</div>' +
          '<p class="note">' + icon('info') + '<span>' + esc(t('results.note')) + '</span></p>' +
          '<div class="row row--center">' +
            '<button type="button" class="btn btn--primary btn--lg" data-gm="again">' + icon('restart') + esc(t('results.again')) + '</button>' +
            '<button type="button" class="btn btn--secondary btn--lg" data-gm="menu">' + icon('home') + esc(t('results.menu')) + '</button>' +
            '<button type="button" class="btn btn--ghost btn--lg" data-gm="help">' + icon('lifebuoy') + esc(t('nav.help')) + '</button>' +
          '</div>' +
        '</section>';
      window.scrollTo(0, 0);
      const h = cur.view.querySelector('h1');
      if (h) h.focus();
    },

    showError() {
      if (!cur) return;
      cur.timers.forEach((tm) => tm.stop());
      cur.finished = true;
      cur.errored = true;
      C.ProgressManager.clearLastSession();
      cur.view.innerHTML =
        '<section class="panel error-view" role="alert">' + icon('alert') +
          '<h1>' + esc(t('error.title')) + '</h1><p>' + esc(t('error.body')) + '</p>' +
          '<button type="button" class="btn btn--primary" data-gm="menu">' + icon('home') + esc(t('error.back')) + '</button>' +
        '</section>';
    },

    /** Ponowne renderowanie po zmianie języka. */
    rerender() {
      if (!cur) return;
      if (cur.errored) return this.showError();
      if (cur.results) return this.renderResults();
      this.renderBar();
      try { if (cur.module && cur.module.render) cur.module.render(); } catch (err) { console.error(err && err.message); this.showError(); }
    },

    destroy() {
      if (!cur) return;
      cur.timers.forEach((tm) => tm.stop());
      if (cur.pauseModal) { cur.pauseModal.close(true); cur.pauseModal = null; }
      try { if (cur.module && cur.module.destroy) cur.module.destroy(); } catch (e) { /* noop */ }
      if (!cur.finished) C.ProgressManager.clearLastSession();
      cur = null;
    },

    /** Automatyczna pauza po utracie widoczności karty (gdy działa timer). */
    onHidden() {
      if (this.isActive() && cur.timers.some((tm) => tm.isRunning())) this.pause();
    }
  };

  C.GameManager = GM;
})(window.PH8);
