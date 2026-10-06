/* Header behaviour + fullscreen mobile menu. */
(function (V) {
'use strict';
const { $, $$, lockScroll, trapFocus, nextFrameClass } = V;

function initNavigation() {
  const header = $('[data-site-header]');
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const label = $('[data-menu-label]');
  if (!header || !toggle || !menu) return;

  /* Transparent over hero until scrolled */
  const overlayMode = document.body.dataset.header === 'overlay';
  header.classList.toggle('is-overlay', overlayMode);

  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 40 || !overlayMode);
    // Hide on fast downward scroll, reveal on upward intent
    header.classList.toggle('is-hidden', y > 480 && y > lastY + 4 && !document.documentElement.classList.contains('is-locked'));
    if (y < lastY - 4 || y < 480) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* Mobile menu */
  let release = null;
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'بستن منو' : 'باز کردن منو';
    header.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      nextFrameClass(menu, 'is-open');
      lockScroll(true);
      release = trapFocus(menu);
      $('a', menu)?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      lockScroll(false);
      release?.();
      const hide = () => { if (!menu.classList.contains('is-open')) menu.hidden = true; };
      menu.addEventListener('transitionend', hide, { once: true });
      setTimeout(hide, 600);
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((link) => link.addEventListener('click', () => setOpen(false)));
  $('[data-search-open]', menu)?.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
  });

  // Keep the menu trap's toggle reachable: the toggle sits in the header above the menu
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && event.shiftKey && document.activeElement === $('a', menu)) {
      event.preventDefault();
      toggle.focus();
    }
  });
}

Object.assign(V, { initNavigation });
})(window.VANE = window.VANE || {});
