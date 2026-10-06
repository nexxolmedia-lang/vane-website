/* Cart state (localStorage), cart drawer and cart page. */
(function (V) {
'use strict';
const { getProduct, COLORS, CATEGORIES, imgTag, $, $$, storage, emit, formatPrice, toFa, announce, icon, lockScroll, trapFocus, escapeHTML, nextFrameClass } = V;

const KEY = 'vane:cart';
const FREE_SHIPPING_FROM = 15000000;
const SHIPPING_RATES = { standard: 350000, express: 650000 };

const itemKey = (slug, color, size) => `${slug}|${color}|${size}`;

function getCart() {
  // Drop any items whose product no longer exists in the catalogue
  return storage.get(KEY, []).filter((item) => getProduct(item.slug));
}

function save(items) {
  storage.set(KEY, items);
  emit('cart:change', { items });
}

function addToCart({ slug, color, size, qty = 1 }) {
  const items = getCart();
  const key = itemKey(slug, color, size);
  const existing = items.find((item) => item.key === key);
  const max = maxQty(slug, size);
  if (existing) existing.qty = Math.min(existing.qty + qty, max);
  else items.push({ key, slug, color, size, qty: Math.min(qty, max) });
  save(items);
}

function removeFromCart(key) {
  save(getCart().filter((item) => item.key !== key));
}

function setQty(key, qty) {
  const items = getCart();
  const item = items.find((i) => i.key === key);
  if (!item) return;
  if (qty <= 0) return removeFromCart(key);
  item.qty = Math.min(qty, maxQty(item.slug, item.size));
  save(items);
}

/** Changing size may merge into an existing line with the same product/colour/size. */
function setSize(key, size) {
  const items = getCart();
  const item = items.find((i) => i.key === key);
  if (!item) return;
  const nextKey = itemKey(item.slug, item.color, size);
  const twin = items.find((i) => i.key === nextKey);
  if (twin && twin !== item) {
    twin.qty = Math.min(twin.qty + item.qty, maxQty(item.slug, size));
    items.splice(items.indexOf(item), 1);
  } else {
    Object.assign(item, { size, key: nextKey, qty: Math.min(item.qty, maxQty(item.slug, size)) });
  }
  save(items);
}

function clearCart() {
  save([]);
}

function maxQty(slug, size) {
  const stock = getProduct(slug)?.stock?.[size] ?? 0;
  return Math.max(1, Math.min(stock, 5));
}

function cartDetails(items = getCart()) {
  const lines = items.map((item) => {
    const product = getProduct(item.slug);
    return { ...item, product, lineTotal: product.price * item.qty };
  });
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return { lines, count, subtotal };
}

function shippingCost(subtotal, method = 'standard') {
  if (!subtotal) return 0;
  if (method === 'standard' && subtotal >= FREE_SHIPPING_FROM) return 0;
  return SHIPPING_RATES[method] ?? SHIPPING_RATES.standard;
}

/* ---------- Rendering ---------- */

function sizeOptions(line) {
  return line.product.sizes.map((s) => {
    const out = (line.product.stock[s] ?? 0) === 0;
    return `<option value="${s}"${s === line.size ? ' selected' : ''}${out && s !== line.size ? ' disabled' : ''}>${s}${out ? ' — ناموجود' : ''}</option>`;
  }).join('');
}

function lineTemplate(line, { compact = false } = {}) {
  const { product } = line;
  const color = COLORS[line.color];
  const url = `product.html?product=${product.slug}`;
  const id = line.key.replace(/[^a-z0-9]/gi, '-');
  return `
  <li class="cart-line${compact ? ' cart-line--compact' : ''}" data-line="${escapeHTML(line.key)}">
    <a class="cart-line__media media" href="${url}" tabindex="-1" aria-hidden="true">
      ${imgTag(product.images[0], { ratio: 4 / 3, sizes: compact ? '96px' : '(max-width: 767px) 30vw, 160px' })}
    </a>
    <div class="cart-line__info">
      <div class="cart-line__head">
        <h3 class="cart-line__name"><a href="${url}" lang="en">${product.name}</a></h3>
        <p class="cart-line__price">${formatPrice(line.lineTotal)}</p>
      </div>
      <p class="cart-line__meta"><span lang="en">${color.name}</span> · ${color.fa} · ${CATEGORIES[product.category].fa}</p>
      <div class="cart-line__controls">
        <label class="cart-line__size">
          <span class="visually-hidden">سایز ${product.name}</span>
          <span aria-hidden="true">سایز</span>
          <select data-line-size="${escapeHTML(line.key)}" id="size-${id}${compact ? '-d' : ''}">${sizeOptions(line)}</select>
        </label>
        <div class="stepper" role="group" aria-label="تعداد ${product.name}">
          <button type="button" class="stepper__btn" data-line-dec="${escapeHTML(line.key)}" aria-label="کاهش تعداد">${icon('minus')}</button>
          <output class="stepper__value" aria-live="polite">${toFa(line.qty)}</output>
          <button type="button" class="stepper__btn" data-line-inc="${escapeHTML(line.key)}" aria-label="افزایش تعداد"${line.qty >= maxQty(line.slug, line.size) ? ' disabled' : ''}>${icon('plus')}</button>
        </div>
        <button type="button" class="link-button cart-line__remove" data-line-remove="${escapeHTML(line.key)}">حذف<span class="visually-hidden"> ${product.name}</span></button>
      </div>
    </div>
  </li>`;
}

const emptyTemplate = (compact) => `
  <div class="cart-empty">
    <p class="cart-empty__title" lang="en">Your bag is empty.</p>
    <p>سبد خرید شما خالی است. شاید از تازه‌های FORM / 01 شروع کنید.</p>
    <a class="button ${compact ? 'button--block' : ''}" href="shop.html"><span lang="en">Explore clothing</span></a>
  </div>`;

function freeShippingNote(subtotal) {
  if (!subtotal) return '';
  const remaining = FREE_SHIPPING_FROM - subtotal;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));
  return `
    <div class="ship-progress">
      <p>${remaining > 0 ? `${formatPrice(remaining)} تا ارسال رایگان` : 'ارسال سفارش شما رایگان است.'}</p>
      <span class="ship-progress__bar" aria-hidden="true"><span style="width:${progress}%"></span></span>
    </div>`;
}

function renderDrawer() {
  const body = $('[data-cart-drawer-items]');
  const foot = $('[data-cart-drawer-foot]');
  if (!body || !foot) return;
  const { lines, count, subtotal } = cartDetails();
  $('[data-cart-count-label]').textContent = count ? `(${toFa(count)})` : '';
  if (!lines.length) {
    body.innerHTML = emptyTemplate(true);
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = `${freeShippingNote(subtotal)}<ul class="cart-lines">${lines.map((l) => lineTemplate(l, { compact: true })).join('')}</ul>`;
  foot.innerHTML = `
    <div class="summary-row summary-row--total"><span>جمع جزء</span><span>${formatPrice(subtotal)}</span></div>
    <p class="cart-drawer__note">هزینه‌ی ارسال در مرحله‌ی پرداخت محاسبه می‌شود.</p>
    <a class="button button--block" href="checkout.html"><span lang="en">Checkout</span></a>
    <a class="button button--ghost button--block" href="cart.html"><span lang="en">View bag</span></a>`;
}

function renderCounts() {
  const { count } = cartDetails();
  $$('[data-cart-count]').forEach((el) => {
    el.textContent = toFa(count);
    el.classList.toggle('is-empty', count === 0);
    el.classList.remove('is-bumped');
    void el.offsetWidth; // restart animation
    el.classList.add('is-bumped');
  });
  $$('[data-cart-count-sr]').forEach((el) => { el.textContent = toFa(count); });
}

function renderCartPage() {
  const root = $('[data-cart-page]');
  if (!root) return;
  const { lines, count, subtotal } = cartDetails();
  const shipping = shippingCost(subtotal);
  if (!lines.length) {
    root.innerHTML = emptyTemplate(false);
    return;
  }
  root.innerHTML = `
    <div class="cart-page">
      <section class="cart-page__lines" aria-labelledby="cart-lines-title">
        <h2 class="visually-hidden" id="cart-lines-title">کالاهای سبد</h2>
        <ul class="cart-lines cart-lines--page">${lines.map((l) => lineTemplate(l)).join('')}</ul>
      </section>
      <aside class="order-summary" aria-labelledby="summary-title">
        <h2 class="order-summary__title" id="summary-title" lang="en">Summary</h2>
        ${freeShippingNote(subtotal)}
        <div class="summary-row"><span>جمع جزء (${toFa(count)} کالا)</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>ارسال استاندارد</span><span>${shipping ? formatPrice(shipping) : 'رایگان'}</span></div>
        <div class="summary-row summary-row--total"><span>مجموع</span><span>${formatPrice(subtotal + shipping)}</span></div>
        <a class="button button--block" href="checkout.html"><span lang="en">Proceed to checkout</span></a>
        <ul class="order-summary__notes">
          <li>بسته‌بندی بدون پلاستیک، با کاغذ بازیافتی</li>
          <li>بازگرداندن کالا تا ۱۴ روز</li>
          <li>پرداخت امن (نسخه‌ی نمایشی)</li>
        </ul>
      </aside>
    </div>`;
}

function renderAll() {
  renderCounts();
  renderDrawer();
  renderCartPage();
}

/* ---------- Drawer open/close ---------- */

let releaseTrap = null;
let lastFocus = null;

function openCart() {
  const drawer = $('[data-cart-drawer]');
  const backdrop = $('[data-drawer-backdrop]');
  if (!drawer || drawer.classList.contains('is-open')) return;
  lastFocus = document.activeElement;
  drawer.hidden = false;
  backdrop.hidden = false;
  nextFrameClass(drawer, 'is-open');
  nextFrameClass(backdrop, 'is-visible');
  lockScroll(true);
  releaseTrap = trapFocus(drawer);
  $('[data-cart-close]', drawer).focus();
}

function closeCart() {
  const drawer = $('[data-cart-drawer]');
  const backdrop = $('[data-drawer-backdrop]');
  if (!drawer?.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-visible');
  lockScroll(false);
  releaseTrap?.();
  setTimeout(() => {
    if (!drawer.classList.contains('is-open')) {
      drawer.hidden = true;
      backdrop.hidden = true;
    }
  }, 500);
  lastFocus?.focus?.();
}

function initCart() {
  renderAll();
  document.addEventListener('cart:change', renderAll);
  // Sync between tabs
  window.addEventListener('storage', (e) => { if (e.key === KEY) renderAll(); });

  document.addEventListener('click', (event) => {
    const t = event.target;
    if (t.closest('[data-cart-open]')) { event.preventDefault(); openCart(); return; }
    if (t.closest('[data-cart-close]') || t.closest('[data-drawer-backdrop]')) { closeCart(); return; }

    const inc = t.closest('[data-line-inc]');
    const dec = t.closest('[data-line-dec]');
    const rem = t.closest('[data-line-remove]');
    if (inc || dec) {
      const key = (inc || dec).dataset.lineInc || (inc || dec).dataset.lineDec;
      const inDrawer = Boolean(t.closest('[data-cart-drawer]'));
      const line = getCart().find((i) => i.key === key);
      if (line) setQty(key, line.qty + (inc ? 1 : -1));
      refocus(inc ? `[data-line-inc="${CSS.escape(key)}"]` : `[data-line-dec="${CSS.escape(key)}"]`, inDrawer);
    }
    if (rem) {
      const key = rem.dataset.lineRemove;
      const name = getProduct(getCart().find((i) => i.key === key)?.slug)?.name ?? '';
      const lineEl = rem.closest('.cart-line');
      lineEl?.classList.add('is-removing');
      setTimeout(() => {
        removeFromCart(key);
        announce(`${name} از سبد حذف شد`);
      }, lineEl ? 260 : 0);
    }
  });

  document.addEventListener('change', (event) => {
    const select = event.target.closest('[data-line-size]');
    if (select) {
      setSize(select.dataset.lineSize, select.value);
      announce(`سایز به ${select.value} تغییر کرد`, { toast: false });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCart();
  });
}

/** After a re-render, return focus to the equivalent control so keyboard users keep their place. */
function refocus(selector, inDrawer) {
  setTimeout(() => {
    const scope = inDrawer ? $('[data-cart-drawer]') : ($('[data-cart-page]') || document);
    const el = $(selector, scope);
    if (el && !el.disabled) el.focus();
    else el?.closest('.stepper')?.querySelector('button:not(:disabled)')?.focus();
  }, 0);
}

Object.assign(V, { getCart, addToCart, removeFromCart, setQty, setSize, clearCart, cartDetails, shippingCost, openCart, closeCart, initCart, FREE_SHIPPING_FROM, SHIPPING_RATES });
})(window.VANE = window.VANE || {});
