/* Toast – krótkie, nienachalne komunikaty */
(function (PH8) {
  'use strict';
  const ICONS = { info: 'info', success: 'check', warn: 'alert', error: 'alert' };

  PH8.components.Toast = {
    show(message, type, timeout) {
      type = type || 'info';
      const region = document.getElementById('toast-region');
      if (!region) return;
      const el = document.createElement('div');
      el.className = 'toast toast--' + type;
      el.innerHTML = PH8.icon(ICONS[type] || 'info') + '<span>' + PH8.util.esc(message) + '</span>';
      region.appendChild(el);
      while (region.children.length > 4) region.firstElementChild.remove();
      setTimeout(() => {
        el.classList.add('toast--out');
        setTimeout(() => el.remove(), 320);
      }, timeout || 3800);
    }
  };
})(window.PH8);
