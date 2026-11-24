/* ProgressBar – pasek postępu z atrybutami ARIA */
(function (PH8) {
  'use strict';
  PH8.components.ProgressBar = {
    html(value, max, label) {
      const m = Math.max(1, max || 1);
      const v = Math.max(0, Math.min(m, value || 0));
      const pct = Math.round((v / m) * 100);
      return '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + m + '" aria-valuenow="' + v + '"' +
        (label ? ' aria-label="' + PH8.util.esc(label) + '"' : '') + '><div class="progress__bar" style="width:' + pct + '%"></div></div>';
    }
  };
})(window.PH8);
