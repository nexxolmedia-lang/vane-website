/* Scroll reveals, split-text, image fallbacks. All motion is opt-out via prefers-reduced-motion. */
(function (V) {
'use strict';
const { $$, prefersReducedMotion } = V;

/** Wrap each word in [data-split] so CSS can reveal them in sequence. */
function splitWords(scope = document) {
  $$('[data-split]:not([data-split-done])', scope).forEach((el) => {
    el.dataset.splitDone = 'true';
    let index = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const outer = document.createElement('span');
            outer.className = 'word';
            const inner = document.createElement('span');
            inner.style.setProperty('--w', index++);
            inner.textContent = part;
            outer.append(inner);
            frag.append(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
  });
}

let observer;

function observe(scope = document) {
  splitWords(scope);
  const targets = $$('[data-reveal]:not(.is-visible), [data-split]:not(.is-visible)', scope);
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  targets.forEach((el) => observer.observe(el));
}

function initAnimations() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  observe();

  // Content rendered later by page modules is picked up automatically
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) observe(node.parentElement || node);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  document.documentElement.classList.add('is-ready');
}

/** If a remote photograph fails, show a quiet branded placeholder instead of a broken icon. */
function initMediaFallback() {
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const holder = img.closest('.media') || img.parentElement;
    holder?.classList.add('is-broken');
    img.classList.add('is-broken');
  }, true);

  document.addEventListener('load', (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement) img.classList.add('is-loaded');
  }, true);
}

Object.assign(V, { initAnimations, initMediaFallback });
})(window.VANE = window.VANE || {});
