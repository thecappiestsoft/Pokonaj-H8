/* UIManager – fasada na komponenty interfejsu (toast, modal, potwierdzenia, paski postępu) */
(function (PH8) {
  'use strict';
  const C = PH8.components;
  PH8.core.UIManager = {
    toast(message, type, timeout) { C.Toast.show(message, type, timeout); },
    modal(opts) { return C.Modal.open(opts); },
    confirm(opts) { return C.Modal.confirm(opts); },
    progress(value, max, label) { return C.ProgressBar.html(value, max, label); }
  };
})(window.PH8);
