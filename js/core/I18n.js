/* I18n – tłumaczenia interfejsu (PL / EN) */
(function (PH8) {
  'use strict';
  const SUPPORTED = ['pl', 'en'];

  const I18n = {
    lang: 'pl',
    supported: SUPPORTED,
    set(lang) {
      this.lang = SUPPORTED.includes(lang) ? lang : 'pl';
      document.documentElement.lang = this.lang;
      document.title = 'Pokonaj H8 – ' + this.t('app.tagline');
    },
    /** Tekst interfejsu wg klucza; {param} zastępowane wartościami. */
    t(key, params) {
      const dict = PH8.data.strings || {};
      let s = dict[this.lang] && dict[this.lang][key];
      if (s === undefined) s = dict.pl && dict.pl[key];
      if (s === undefined) { console.warn('[I18n] brak klucza:', key); return key; }
      if (typeof s !== 'string') return s;
      if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
      return s;
    },
    /** Lista (tablica) tekstów interfejsu. */
    list(key) {
      const v = this.t(key);
      return Array.isArray(v) ? v : [];
    },
    /** Lokalizacja treści: obiekt {pl, en} → tekst w bieżącym języku. */
    L(v) {
      if (v == null) return '';
      if (typeof v === 'object' && !Array.isArray(v) && ('pl' in v || 'en' in v)) {
        return v[this.lang] !== undefined ? v[this.lang] : v.pl;
      }
      return v;
    }
  };

  PH8.core.I18n = I18n;
  PH8.t = (k, p) => I18n.t(k, p);
  PH8.tl = (k) => I18n.list(k);
  PH8.L = (v) => I18n.L(v);
})(window.PH8);
