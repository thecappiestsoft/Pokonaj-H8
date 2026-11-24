/* Punkt wejścia aplikacji */
(function (PH8) {
  'use strict';
  function boot() {
    try {
      PH8.core.AppController.init();
    } catch (err) {
      console.error('[PH8] Błąd uruchomienia:', err && err.message);
      const main = document.getElementById('main');
      if (main) main.innerHTML = '<section class="panel error-view" role="alert"><h1>Pokonaj H8</h1><p>Nie udało się uruchomić aplikacji. Odśwież stronę. / The app could not start. Please reload.</p></section>';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.PH8);
