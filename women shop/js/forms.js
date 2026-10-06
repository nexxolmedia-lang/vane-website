/* Form validation helpers + contact form. */
(function (V) {
'use strict';
const { $, $$, announce, nextFrameClass, EMAIL_PATTERN } = V;

/** Convert Persian/Arabic digits to Latin so validation accepts both keyboards. */
const latinDigits = (value) => value
  .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const RULES = {
  email: { test: (v) => EMAIL_PATTERN.test(v), message: 'نشانی ایمیل معتبر نیست.' },
  phone: { test: (v) => /^(\+98|0098|0)?9\d{9}$/.test(latinDigits(v).replace(/[\s-]/g, '')), message: 'شماره‌ی موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹' },
  postal: { test: (v) => /^\d{10}$/.test(latinDigits(v).replace(/[\s-]/g, '')), message: 'کد پستی باید ۱۰ رقم باشد.' },
  name: { test: (v) => v.trim().length >= 2, message: 'لطفاً نام کامل را وارد کنید.' }
};

function fieldError(field) {
  const value = field.value.trim();
  if (field.type === 'checkbox') return field.required && !field.checked ? (field.dataset.required || 'این گزینه الزامی است.') : '';
  if (field.required && !value) return field.dataset.required || 'این فیلد الزامی است.';
  if (!value) return '';
  const rule = RULES[field.dataset.validate] || (field.type === 'email' ? RULES.email : null);
  if (rule && !rule.test(value)) return rule.message;
  if (field.minLength > 0 && value.length < field.minLength) return `دست‌کم ${field.minLength} نویسه وارد کنید.`;
  return '';
}

function showError(field, message) {
  const wrap = field.closest('.field') || field.parentElement;
  let error = $('.field__error', wrap);
  if (!error) {
    error = document.createElement('p');
    error.className = 'field__error';
    wrap.append(error);
  }
  if (!error.id) error.id = `${field.id || field.name}-error`;
  error.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  describedBy.add(error.id);
  field.setAttribute('aria-describedby', [...describedBy].join(' '));
  wrap.classList.toggle('has-error', Boolean(message));
}

/** Validate every field in a form; returns true when valid and focuses the first error otherwise. */
function validateForm(form) {
  const fields = $$('input, select, textarea', form).filter((f) => !f.disabled && f.type !== 'hidden' && f.type !== 'radio');
  let firstInvalid = null;
  fields.forEach((field) => {
    const message = fieldError(field);
    showError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    announce('لطفاً خطاهای فرم را بررسی کنید.', { toast: false });
  }
  return !firstInvalid;
}

/** Re-validate a field once the user leaves it (only after it has been touched). */
function liveValidate(form) {
  form.addEventListener('focusout', (event) => {
    const field = event.target;
    if (!field.matches('input, select, textarea') || field.type === 'radio') return;
    if (field.value || field.getAttribute('aria-invalid') === 'true') showError(field, fieldError(field));
  });
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field.getAttribute('aria-invalid') === 'true') showError(field, fieldError(field));
  });
}

/* contact.html */
function initContact() {
  const form = $('[data-contact-form]');
  if (!form) return;
  form.noValidate = true;
  liveValidate(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const success = $('[data-contact-success]');
    form.classList.add('is-leaving');
    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
      nextFrameClass(success, 'is-visible');
      success.focus();
    }, 300);
  });
}

Object.assign(V, { initContact, validateForm, liveValidate, latinDigits });
})(window.VANE = window.VANE || {});
