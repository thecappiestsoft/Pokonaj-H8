/* Modal – dostępne okna dialogowe z pułapką fokusu i obsługą Escape */
(function (PH8) {
  'use strict';
  const { esc, uid } = PH8.util;
  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function open(opts) {
    const title = opts.title || '';
    const actions = opts.actions || [{ label: PH8.t('common.close'), variant: 'primary' }];
    const dismissible = opts.dismissible !== false;
    const root = document.getElementById('modal-root');
    const prevFocus = document.activeElement;
    const id = uid('modal');

    const back = document.createElement('div');
    back.className = 'modal-backdrop';
    back.innerHTML =
      '<div class="modal' + (opts.wide ? ' modal--wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '">' +
        '<div class="modal__head">' +
          (opts.icon ? '<span class="modal__icon">' + PH8.icon(opts.icon) + '</span>' : '') +
          '<h2 class="modal__title" id="' + id + '">' + esc(title) + '</h2>' +
          (dismissible ? '<button type="button" class="btn btn--icon btn--ghost" data-close aria-label="' + esc(PH8.t('common.close')) + '">' + PH8.icon('x') + '</button>' : '') +
        '</div>' +
        '<div class="modal__body"></div>' +
        '<div class="modal__actions"></div>' +
      '</div>';

    const bodyEl = back.querySelector('.modal__body');
    if (typeof opts.body === 'string') bodyEl.innerHTML = opts.body;
    else if (opts.body) bodyEl.appendChild(opts.body);

    let closed = false;
    function close(silent) {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      back.remove();
      if (prevFocus && typeof prevFocus.focus === 'function' && document.contains(prevFocus)) prevFocus.focus();
      if (silent !== true && typeof opts.onClose === 'function') opts.onClose();
    }

    const actEl = back.querySelector('.modal__actions');
    actions.forEach((a) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn--' + (a.variant || 'secondary');
      b.innerHTML = (a.icon ? PH8.icon(a.icon) : '') + '<span>' + esc(a.label) + '</span>';
      b.addEventListener('click', () => {
        const r = typeof a.onClick === 'function' ? a.onClick(back) : undefined;
        if (r !== false) close();
      });
      actEl.appendChild(b);
    });

    back.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { close(); return; }
      if (e.target === back && dismissible) close();
    });

    function onKey(e) {
      if (root.lastElementChild !== back) return; // tylko najwyższy modal
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (dismissible) close();
        return;
      }
      if (e.key === 'Tab') {
        const items = Array.from(back.querySelectorAll(FOCUSABLE));
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!back.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);

    root.appendChild(back);
    const firstAction = actEl.querySelector('button');
    (firstAction || back.querySelector(FOCUSABLE) || back).focus();
    return { close: close, el: back };
  }

  function confirm(o) {
    return new Promise((resolve) => {
      let ok = false;
      open({
        title: o.title,
        icon: o.icon || (o.danger ? 'alert' : 'help'),
        body: '<p>' + esc(o.message) + '</p>',
        actions: [
          { label: o.cancelLabel || PH8.t('common.cancel'), variant: 'secondary' },
          { label: o.okLabel || PH8.t('common.ok'), variant: o.danger ? 'danger' : 'primary', onClick: () => { ok = true; } }
        ],
        onClose: () => resolve(ok)
      });
    });
  }

  PH8.components.Modal = { open: open, confirm: confirm };
})(window.PH8);
