/* Accessible accordion: button[aria-expanded] + region, animated with grid rows. */
(function (V) {
'use strict';
const { $$ } = V;

let uid = 0;

function accordion(id, label, labelFa, content, open = false) {
  const key = `acc-${id}-${++uid}`;
  return `
  <div class="accordion${open ? ' is-open' : ''}">
    <h3 class="accordion__heading">
      <button type="button" class="accordion__trigger" id="${key}-btn" aria-expanded="${open}" aria-controls="${key}">
        <span class="accordion__label"><span lang="en">${label}</span>${labelFa ? `<span class="accordion__fa">${labelFa}</span>` : ''}</span>
        <span class="accordion__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="accordion__panel" id="${key}" role="region" aria-labelledby="${key}-btn"${open ? '' : ' inert'}>
      <div class="accordion__content">${content}</div>
    </div>
  </div>`;
}

function initAccordions(scope = document) {
  $$('.accordion__trigger', scope).forEach((trigger) => {
    if (trigger.dataset.bound) return;
    trigger.dataset.bound = 'true';
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion');
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      trigger.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      panel.toggleAttribute('inert', !open);
    });
  });

  // Deep links such as contact.html#returns open the matching accordion
  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = document.getElementById(hash);
    const trigger = target?.querySelector('.accordion__trigger');
    if (trigger && trigger.getAttribute('aria-expanded') !== 'true') trigger.click();
  }
}

Object.assign(V, { accordion, initAccordions });
})(window.VANE = window.VANE || {});
