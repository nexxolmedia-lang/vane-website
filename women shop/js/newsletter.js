/* Newsletter forms — client-side validation and success state (no backend). */
(function (V) {
'use strict';
const { $$, storage, announce, nextFrameClass } = V;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function initNewsletter() {
  $$('[data-newsletter]:not([data-bound])').forEach((form) => {
    form.dataset.bound = 'true';
    const input = form.querySelector('input[type="email"]');
    const error = form.querySelector('[data-newsletter-error]');
    if (error && !error.id) error.id = `${input.id}-error`;
    input.setAttribute('aria-describedby', error.id);

    const setError = (message) => {
      error.textContent = message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      form.classList.toggle('has-error', Boolean(message));
    };

    input.addEventListener('input', () => { if (form.classList.contains('has-error')) setError(''); });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = input.value.trim();
      if (!email) return setError('لطفاً ایمیل خود را وارد کنید.') || input.focus();
      if (!EMAIL_PATTERN.test(email)) return setError('نشانی ایمیل معتبر نیست. نمونه: name@example.com') || input.focus();

      setError('');
      const list = storage.get('vane:newsletter', []);
      if (!list.includes(email)) storage.set('vane:newsletter', [...list, email]);

      const success = document.createElement('div');
      success.className = 'newsletter-success';
      success.setAttribute('tabindex', '-1');
      success.innerHTML = `
        <p class="newsletter-success__title" lang="en">Thank you.</p>
        <p>از این پس، کالکشن‌های تازه و یادداشت‌های آتلیه را در <span dir="ltr">${email.replace(/[<>&"]/g, '')}</span> دریافت می‌کنید.</p>`;
      form.classList.add('is-leaving');
      setTimeout(() => {
        form.replaceWith(success);
        nextFrameClass(success, 'is-visible');
        success.focus({ preventScroll: true });
      }, 320);
      announce('عضویت در خبرنامه انجام شد', { toast: false });
    });
  });
}

Object.assign(V, { initNewsletter, EMAIL_PATTERN });
})(window.VANE = window.VANE || {});
