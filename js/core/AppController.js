/* AppController – inicjalizacja, routing widoków, nagłówek z przełącznikami PL|EN i jasno|ciemno */
(function (PH8) {
  'use strict';
  const { esc } = PH8.util;
  const C = PH8.core;
  const t = (k, p) => PH8.t(k, p);
  const L = (v) => PH8.L(v);
  const icon = (n) => PH8.icon(n);

  const NAV = [
    { view: 'help', icon: 'lifebuoy', key: 'nav.help', cls: ' nav-btn--help' },
    { view: 'teacher', icon: 'presentation', key: 'nav.teacher', cls: '' },
    { view: 'achievements', icon: 'trophy', key: 'nav.achievements', cls: '' },
    { view: 'settings', icon: 'sliders', key: 'nav.settings', cls: '' }
  ];

  const SKINS = [
    { id: 'desktop', icon: 'monitor' },
    { id: 'phone', icon: 'phone' },
    { id: 'retro', icon: 'window' }
  ];

  const AC = {
    state: { view: null, params: null },
    main: null,

    init() {
      C.SettingsManager.load();
      C.I18n.set(C.SettingsManager.get('lang'));
      C.ScoreManager.load();
      C.ProgressManager.load();
      this.main = document.getElementById('main');
      this.renderHeader();

      C.StorageManager.onError(() => C.UIManager.toast(t('storage.writeError'), 'warn', 6000));
      document.addEventListener('click', (e) => this.onDocClick(e));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.view === 'game' && !document.querySelector('.modal-backdrop')) C.GameManager.pause();
      });
      document.addEventListener('visibilitychange', () => { if (document.hidden) C.GameManager.onHidden(); });

      if (!C.StorageManager.isAvailable()) {
        setTimeout(() => C.UIManager.toast(t('storage.unavailable'), 'warn', 7000), 700);
      }
      const last = C.ProgressManager.getLastSession();
      if (last && last.gameId && PH8.data.games[last.gameId]) {
        C.ProgressManager.clearLastSession();
        setTimeout(() => C.UIManager.toast(t('session.interrupted', { name: L(PH8.data.games[last.gameId].name) }), 'info', 8000), 900);
      }
      this.go('splash', null, { force: true });
    },

    onDocClick(e) {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        e.preventDefault();
        this.go(nav.dataset.nav, nav.dataset.navId ? { id: nav.dataset.navId } : null);
        return;
      }
      const lang = e.target.closest('[data-lang]');
      if (lang) { this.setLang(lang.dataset.lang); return; }
      const skin = e.target.closest('[data-skin-set]');
      if (skin) { this.setSkin(skin.dataset.skinSet); return; }
      const theme = e.target.closest('[data-theme-set]');
      if (theme) this.setTheme(theme.dataset.themeSet);
    },

    async go(view, params, opts) {
      opts = opts || {};
      if (C.GameManager.hasCurrent()) {
        if (C.GameManager.isActive() && !opts.force) {
          const ok = await C.UIManager.confirm({
            title: t('leave.title'),
            message: t('leave.body'),
            okLabel: t('leave.ok'),
            cancelLabel: t('leave.cancel'),
            danger: true
          });
          if (!ok) return;
        }
        C.GameManager.destroy();
      }
      this.state = { view: view, params: params || null };
      this.render();
    },

    render() {
      const v = this.state.view;
      if (v === 'game') return;
      const el = this.mountView(v);
      if (v === 'teacher') C.TeacherMode.render(el);
      else (C.Views[v] || C.Views.menu)(el, this.state.params || {});
      const h = this.main.querySelector('h1');
      if (h && v !== 'splash') h.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    },

    mountView(name, params) {
      this.main.innerHTML = '';
      const el = document.createElement('div');
      el.className = 'view view--' + name + ' view-enter';
      this.main.appendChild(el);
      if (name === 'game') this.state = { view: 'game', params: params || null };
      this.renderChats();
      this.updateHeader();
      return el;
    },

    renderHeader() {
      const h = document.getElementById('app-header');
      h.innerHTML =
        '<div class="app-header__inner">' +
          '<button type="button" class="brand" data-nav="menu" aria-label="' + esc(t('nav.home')) + '">' + PH8.logo() +
            '<span><span class="brand__name">POKONAJ <em>H8</em></span><span class="brand__tag">' + esc(t('app.tagline')) + '</span></span></button>' +
          '<nav class="app-nav" aria-label="' + esc(t('nav.label')) + '">' +
            NAV.map((n) => '<button type="button" class="nav-btn' + n.cls + '" data-nav="' + n.view + '" aria-label="' + esc(t(n.key)) + '" title="' + esc(t(n.key)) + '">' + icon(n.icon) + '<span>' + esc(t(n.key)) + '</span></button>').join('') +
          '</nav>' +
          '<div class="app-toggles">' +
            '<div class="seg" role="group" aria-label="' + esc(t('toggle.lang')) + '">' +
              '<button type="button" class="seg__btn" data-lang="pl" lang="pl" aria-label="Polski" title="Polski">PL</button>' +
              '<span class="seg__sep" aria-hidden="true">|</span>' +
              '<button type="button" class="seg__btn" data-lang="en" lang="en" aria-label="English" title="English">EN</button>' +
            '</div>' +
            '<div class="seg seg--icons seg--skin" role="group" aria-label="' + esc(t('skin.label')) + '">' +
              SKINS.map((k, i) => (i ? '<span class="seg__sep" aria-hidden="true">|</span>' : '') +
                '<button type="button" class="seg__btn" data-skin-set="' + k.id + '" aria-label="' + esc(t('skin.' + k.id)) + '" title="' + esc(t('skin.' + k.id)) + '">' + icon(k.icon) + '</button>').join('') +
            '</div>' +
            '<div class="seg seg--icons" role="group" aria-label="' + esc(t('toggle.theme')) + '">' +
              '<button type="button" class="seg__btn" data-theme-set="light" aria-label="' + esc(t('toggle.light')) + '" title="' + esc(t('toggle.light')) + '">' + icon('sun') + '</button>' +
              '<span class="seg__sep" aria-hidden="true">|</span>' +
              '<button type="button" class="seg__btn" data-theme-set="dark" aria-label="' + esc(t('toggle.dark')) + '" title="' + esc(t('toggle.dark')) + '">' + icon('moon') + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.querySelector('.skip-link').textContent = t('nav.skip');
      this.renderChats();
      this.updateHeader();
    },

    updateHeader() {
      const S = C.SettingsManager;
      document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === S.get('lang'))));
      document.querySelectorAll('[data-skin-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.skinSet === S.get('skin'))));
      const v = this.state.view;
      const gid = this.state.params && this.state.params.id;
      document.querySelectorAll('.chats [data-nav]').forEach((b) => {
        const on = b.dataset.navId ? ((v === 'instructions' || v === 'game') && b.dataset.navId === gid) : b.dataset.nav === v;
        b.classList.toggle('is-active', on);
        if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
      document.querySelectorAll('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === S.get('theme'))));
      document.querySelectorAll('.app-nav [data-nav]').forEach((b) => {
        if (b.dataset.nav === this.state.view) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
    },

    setLang(lang) {
      if (lang === C.SettingsManager.get('lang')) return;
      C.SettingsManager.set('lang', lang);
      C.I18n.set(lang);
      this.renderHeader();
      if (this.state.view === 'game') C.GameManager.rerender();
      else this.render();
      const btn = document.querySelector('[data-lang="' + lang + '"]');
      if (btn) btn.focus();
    },

    /* Lista rozmów (gry jako czaty) – widoczna w wyglądzie komputerowym i retro */
    renderChats() {
      const box = document.getElementById('app-chats');
      if (!box) return;
      const initials = (name) => name.replace(/[–:-]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
      const games = C.GameManager.list().map((g, i) => {
        const m = C.GameManager.meta(g.id);
        const st = C.ProgressManager.getStatus(g.id);
        return '<li><button type="button" class="chat" data-nav="instructions" data-nav-id="' + g.id + '">' +
          '<span class="chat__avatar chat__avatar--' + (i % 7) + '" aria-hidden="true">' + esc(initials(L(m.name))) + '</span>' +
          '<span class="chat__body"><span class="chat__name">' + esc(L(m.name)) + '</span>' +
          '<span class="chat__last">' + esc(L(m.desc)) + '</span>' +
          '<span class="chat__status chat__status--' + st + '">' + esc(t('status.' + st)) + '</span></span>' +
          '<span class="chat__dot chat__dot--' + st + '" aria-hidden="true"></span></button></li>';
      }).join('');
      const tool = (view, ic, key) => '<li><button type="button" class="chat chat--tool" data-nav="' + view + '">' +
        '<span class="chat__avatar chat__avatar--tool" aria-hidden="true">' + icon(ic) + '</span>' +
        '<span class="chat__body"><span class="chat__name">' + esc(t(key)) + '</span></span></button></li>';
      box.setAttribute('aria-label', t('chats.label'));
      box.innerHTML =
        '<p class="chats__me"><span class="chat__dot chat__dot--completed" aria-hidden="true"></span>' + esc(t('chats.status')) + ' · ' + esc(t('level.label', { n: C.ScoreManager.getLevel(C.ScoreManager.getTotalXp()).level })) + '</p>' +
        '<ul class="chats__list">' + tool('menu', 'home', 'chats.home') + '</ul>' +
        '<p class="chats__head">' + esc(t('chats.games')) + '</p>' +
        '<ul class="chats__list">' + games + '</ul>' +
        '<p class="chats__head">' + esc(t('chats.tools')) + '</p>' +
        '<ul class="chats__list">' + tool('teacher', 'presentation', 'nav.teacher') + tool('achievements', 'trophy', 'nav.achievements') +
          tool('settings', 'sliders', 'nav.settings') + tool('help', 'lifebuoy', 'nav.help') + '</ul>';
    },

    setSkin(skin) {
      C.SettingsManager.set('skin', ['desktop', 'phone', 'retro'].includes(skin) ? skin : 'desktop');
      this.updateHeader();
    },

    setTheme(theme) {
      C.SettingsManager.set('theme', theme === 'light' ? 'light' : 'dark');
      this.updateHeader();
    }
  };

  C.AppController = AC;
})(window.PH8);
