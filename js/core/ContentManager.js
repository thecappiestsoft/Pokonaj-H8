/* ContentManager – dostęp do lokalnych treści gier i ich podstawowa walidacja */
(function (PH8) {
  'use strict';
  PH8.core.ContentManager = {
    /** Zwraca zestaw treści; rzuca błąd, gdy go brak (GameManager pokaże komunikat). */
    get(key) {
      const d = PH8.data[key];
      if (!d || typeof d !== 'object') throw new Error('Brak treści: ' + key);
      return d;
    },
    /** Sprawdza, czy każdy rekord ma wymagane pola (rozdz. 15.5). */
    requireFields(list, fields, label) {
      if (!Array.isArray(list) || !list.length) throw new Error('Pusta lista treści: ' + label);
      list.forEach((item, i) => {
        fields.forEach((f) => {
          if (item[f] === undefined || item[f] === null) {
            throw new Error('Niepoprawny rekord ' + label + ' #' + (item.id || i) + ': brak pola ' + f);
          }
        });
      });
      return list;
    }
  };
})(window.PH8);
