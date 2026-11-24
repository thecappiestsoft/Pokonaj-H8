/* SettingsManager – ustawienia interfejsu, dźwięku, motywu i języka */
(function (PH8) {
  'use strict';
  const DEFAULTS = {
    soundEnabled: true,
    soundVolume: 0.35,
    animationsEnabled: true,
    highContrast: false,
    largeText: false,
    timerEnabled: true,
    theme: 'light',
    skin: 'desktop',
    lang: 'pl',
    questionCount: 10,
    difficulty: 'normal',
    freeMode: false,
    playMode: 'class',
    helpContacts: ''
  };

  let settings = Object.assign({}, DEFAULTS);
  const listeners = [];

  function save() { PH8.core.StorageManager.write('settings', settings); }

  const SettingsManager = {
    defaults: DEFAULTS,
    load() {
      settings = PH8.core.StorageManager.read('settings', DEFAULTS);
      if (!['dark', 'light'].includes(settings.theme)) settings.theme = 'light';
      if (!['desktop', 'phone', 'retro'].includes(settings.skin)) settings.skin = 'desktop';
      if (!['pl', 'en'].includes(settings.lang)) settings.lang = 'pl';
      this.apply();
      return settings;
    },
    get(key) { return settings[key]; },
    all() { return Object.assign({}, settings); },
    set(key, value) {
      settings[key] = value;
      save();
      this.apply();
      listeners.forEach((fn) => fn(key, value));
    },
    /** Reset ustawień (język i motyw zostają, aby interfejs nie „przeskoczył”). */
    reset() {
      settings = Object.assign({}, DEFAULTS, { lang: settings.lang, theme: settings.theme, skin: settings.skin });
      save();
      this.apply();
      listeners.forEach((fn) => fn('*'));
    },
    onChange(fn) { listeners.push(fn); },
    apply() {
      const r = document.documentElement;
      r.dataset.theme = settings.theme;
      r.dataset.skin = settings.skin;
      r.dataset.contrast = settings.highContrast ? 'high' : 'normal';
      r.dataset.textSize = settings.largeText ? 'large' : 'normal';
      r.dataset.anim = settings.animationsEnabled ? 'on' : 'off';
    }
  };

  PH8.core.SettingsManager = SettingsManager;
})(window.PH8);
