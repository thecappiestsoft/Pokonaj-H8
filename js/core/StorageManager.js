/* StorageManager – jedyne miejsce zapisu do LocalStorage (z obsługą błędów i wersją schematu) */
(function (PH8) {
  'use strict';
  const PREFIX = 'pokonajH8.';
  const SCHEMA_VERSION = 1;
  const memory = Object.create(null); // pamięć tymczasowa, gdy LocalStorage jest niedostępny
  const errorListeners = [];
  let writeFailed = false;

  const available = (function () {
    try {
      const k = PREFIX + '__test';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }

  /** Migracja rekordu do bieżącej wersji schematu; nieznana wersja → bezpieczny reset. */
  function migrate(record, defaults) {
    if (!record || typeof record !== 'object' || typeof record.version !== 'number') return clone(defaults);
    if (record.version !== SCHEMA_VERSION) {
      // Miejsce na przyszłe migracje (np. 1 → 2). Na razie: bezpieczny reset.
      return clone(defaults);
    }
    if (defaults === null || typeof defaults !== 'object' || Array.isArray(defaults)) {
      return record.data !== undefined ? record.data : clone(defaults);
    }
    return Object.assign(clone(defaults), record.data || {});
  }

  PH8.core.StorageManager = {
    isAvailable() { return available; },
    hasWriteFailed() { return writeFailed; },
    onError(fn) { errorListeners.push(fn); },

    read(key, defaults) {
      let raw = null;
      try {
        raw = available ? window.localStorage.getItem(PREFIX + key) : (memory[key] || null);
      } catch (e) {
        raw = memory[key] || null;
      }
      if (raw == null) return clone(defaults);
      try {
        return migrate(JSON.parse(raw), defaults);
      } catch (e) {
        console.warn('[Storage] Nie udało się odczytać klucza', key);
        return clone(defaults);
      }
    },

    write(key, data) {
      const raw = JSON.stringify({ version: SCHEMA_VERSION, data: data });
      memory[key] = raw;
      if (!available) return false;
      try {
        window.localStorage.setItem(PREFIX + key, raw);
        return true;
      } catch (e) {
        if (!writeFailed) {
          writeFailed = true;
          errorListeners.forEach((fn) => { try { fn(e); } catch (_) { /* noop */ } });
        }
        return false;
      }
    },

    remove(key) {
      delete memory[key];
      if (!available) return;
      try { window.localStorage.removeItem(PREFIX + key); } catch (e) { /* noop */ }
    }
  };
})(window.PH8);
