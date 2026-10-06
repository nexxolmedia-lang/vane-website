/* Checkout (demo, no payment gateway) + order confirmation. */
(function (V) {
'use strict';
const { COLORS, imgTag, $, formatPrice, toFa, storage, formatDate, cartDetails, shippingCost, clearCart, validateForm, liveValidate } = V;

const ORDER_KEY = 'vane:last-order';
const COUNTER_KEY = 'vane:order-counter';

const SHIPPING_LABELS = {
  standard: 'ارسال استاندارد — ۳ تا ۵ روز کاری',
  express: 'ارسال سریع — ۱ تا ۲ روز کاری'
};

function reviewTemplate(method) {
  const { lines, count, subtotal } = cartDetails();
  const shipping = shippingCost(subtotal, method);
  return `
    <ul class="review-lines">
      ${lines.map((l) => `
        <li class="review-line">
          <span class="review-line__media media">${imgTag(l.product.images[0], { sizes: '72px' })}<span class="review-line__qty">${toFa(l.qty)}</span></span>
          <span class="review-line__info">
            <span class="review-line__name" lang="en">${l.product.name}</span>
            <span class="review-line__meta">${COLORS[l.color].fa} · <span lang="en">${l.size}</span></span>
          </span>
          <span class="review-line__price">${formatPrice(l.lineTotal)}</span>
        </li>`).join('')}
    </ul>
    <div class="summary-row"><span>جمع جزء (${toFa(count)} کالا)</span><span>${formatPrice(subtotal)}</span></div>
    <div class="summary-row"><span>ارسال</span><span>${shipping ? formatPrice(shipping) : 'رایگان'}</span></div>
    <div class="summary-row summary-row--total"><span>مجموع</span><span>${formatPrice(subtotal + shipping)}</span></div>`;
}

function initCheckout() {
  const form = $('[data-checkout-form]');
  if (!form) return;
  const review = $('[data-order-review]');
  const empty = $('[data-checkout-empty]');
  const layout = $('[data-checkout-layout]');

  if (!cartDetails().lines.length) {
    layout.hidden = true;
    empty.hidden = false;
    return;
  }

  const method = () => $('input[name="shipping"]:checked', form)?.value || 'standard';
  const renderReview = () => { review.innerHTML = reviewTemplate(method()); };
  renderReview();

  // Free standard shipping label reflects the threshold
  const { subtotal } = cartDetails();
  const standardPrice = $('[data-ship-price="standard"]');
  if (standardPrice) standardPrice.textContent = shippingCost(subtotal, 'standard') ? formatPrice(shippingCost(subtotal, 'standard')) : 'رایگان';
  const expressPrice = $('[data-ship-price="express"]');
  if (expressPrice) expressPrice.textContent = formatPrice(shippingCost(subtotal, 'express'));

  form.addEventListener('change', (event) => { if (event.target.name === 'shipping') renderReview(); });
  document.addEventListener('cart:change', () => {
    if (!cartDetails().lines.length) { layout.hidden = true; empty.hidden = false; } else renderReview();
  });

  liveValidate(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;

    const submit = $('[data-pay]', form);
    submit.disabled = true;
    submit.classList.add('is-loading');
    $('[data-pay-label]', submit).textContent = 'در حال پردازش…';

    const data = new FormData(form);
    const details = cartDetails();
    const ship = shippingCost(details.subtotal, method());
    const counter = storage.get(COUNTER_KEY, 10283) + 1;
    storage.set(COUNTER_KEY, counter);

    storage.set(ORDER_KEY, {
      number: `VN-${counter}`,
      date: new Date().toISOString(),
      name: data.get('fullName'),
      email: data.get('email'),
      city: data.get('city'),
      province: data.get('province'),
      shipping: method(),
      payment: data.get('payment'),
      lines: details.lines.map(({ slug, color, size, qty, lineTotal, product }) => ({ slug, color, size, qty, lineTotal, name: product.name, image: product.images[0] })),
      subtotal: details.subtotal,
      shippingCost: ship,
      total: details.subtotal + ship
    });

    // Simulated gateway round-trip
    setTimeout(() => {
      clearCart();
      window.location.href = 'order-confirmation.html';
    }, 1100);
  });
}

function initConfirmation() {
  const root = $('[data-confirmation]');
  if (!root) return;
  const order = storage.get(ORDER_KEY, null);
  const numberEl = $('[data-order-number]');
  if (!order) {
    numberEl.textContent = 'VN-10284';
    $('[data-order-details]').innerHTML = `<p class="confirmation__note">این صفحه پس از ثبت سفارش، جزئیات سفارش شما را نمایش می‌دهد. <a href="shop.html">مشاهده‌ی پوشاک</a></p>`;
    return;
  }
  numberEl.textContent = order.number;
  $('[data-order-name]').textContent = order.name ? `${order.name}، ` : '';
  $('[data-order-details]').innerHTML = `
    <dl class="confirmation__facts">
      <div><dt>تاریخ</dt><dd>${formatDate(order.date)}</dd></div>
      <div><dt>ارسال به</dt><dd>${order.city || ''}${order.province ? `، ${order.province}` : ''}</dd></div>
      <div><dt>روش ارسال</dt><dd>${SHIPPING_LABELS[order.shipping]}</dd></div>
      <div><dt>تأییدیه به</dt><dd dir="ltr">${(order.email || '').replace(/[<>&"]/g, '')}</dd></div>
    </dl>
    <ul class="review-lines">
      ${order.lines.map((l) => `
        <li class="review-line">
          <span class="review-line__media media">${imgTag(l.image, { sizes: '72px' })}<span class="review-line__qty">${toFa(l.qty)}</span></span>
          <span class="review-line__info"><span class="review-line__name" lang="en">${l.name}</span><span class="review-line__meta">${COLORS[l.color]?.fa ?? ''} · <span lang="en">${l.size}</span></span></span>
          <span class="review-line__price">${formatPrice(l.lineTotal)}</span>
        </li>`).join('')}
    </ul>
    <div class="summary-row"><span>جمع جزء</span><span>${formatPrice(order.subtotal)}</span></div>
    <div class="summary-row"><span>ارسال</span><span>${order.shippingCost ? formatPrice(order.shippingCost) : 'رایگان'}</span></div>
    <div class="summary-row summary-row--total"><span>مجموع پرداخت‌شده (نمایشی)</span><span>${formatPrice(order.total)}</span></div>`;
}

function initCheckoutPages() {
  initCheckout();
  initConfirmation();
}

Object.assign(V, { initCheckoutPages });
})(window.VANE = window.VANE || {});
