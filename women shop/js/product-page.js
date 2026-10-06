/* product.html?product=<slug> — gallery, options, add to bag, accordions, structured data. */
(function (V) {
'use strict';
const { getProduct, COLORS, CATEGORIES, SHIPPING_NOTE, totalStock, getCollection, imgTag, imageUrl, $, $$, getParam, formatPrice, toFa, icon, announce, setMeta, setJsonLd, SITE_URL, addToCart, openCart, isWishlisted, initProductGrids, accordion, initAccordions, sizeTable } = V;

function notFound(root) {
  document.title = 'محصول پیدا نشد — VĀNE';
  root.innerHTML = `
    <section class="container empty-state empty-state--page">
      <p class="eyebrow" lang="en">404 — Product</p>
      <h1 class="display-m" lang="en">This piece is no longer here.</h1>
      <p>محصولی با این نشانی پیدا نشد. ممکن است فروخته شده یا نشانی اشتباه باشد.</p>
      <a class="button" href="shop.html"><span lang="en">Back to clothing</span></a>
    </section>`;
}

function initProductPage() {
  const root = $('[data-product-root]');
  if (!root) return;
  const product = getProduct(getParam('product') || 'form-01-blazer');
  if (!product) return notFound(root);

  const category = CATEGORIES[product.category];
  const collection = getCollection(product.collection);
  const soldOut = totalStock(product) === 0;
  const state = { color: product.colors[0], size: null };
  const pageUrl = `product.html?product=${product.slug}`;

  setMeta({
    title: `${product.name} — ${product.nameFa} | خرید ${category.fa} زنانه | VĀNE`,
    description: `${product.nameFa}؛ ${product.description.slice(0, 120)}…`,
    path: pageUrl,
    image: imageUrl(product.images[0], 1200, 1.25)
  });

  root.innerHTML = `
  <div class="container">
    <nav class="breadcrumbs" aria-label="مسیر صفحه">
      <ol>
        <li><a href="index.html">خانه</a></li>
        <li><a href="shop.html">پوشاک</a></li>
        <li><a href="shop.html?category=${product.category}">${category.fa}</a></li>
        <li><span aria-current="page" lang="en">${product.name}</span></li>
      </ol>
    </nav>
  </div>

  <div class="product container">
    <section class="product__gallery gallery" aria-label="تصاویر محصول">
      <ul class="gallery__track" data-gallery-track>
        ${product.images.map((img, i) => `
          <li class="gallery__item media${i === 0 ? ' gallery__item--lead' : ''}" data-gallery-item>
            ${imgTag(img, { ratio: 4 / 3, sizes: '(max-width: 767px) 100vw, (max-width: 1199px) 55vw, 45vw', eager: i === 0 })}
          </li>`).join('')}
      </ul>
      <p class="gallery__counter" aria-hidden="true" lang="en"><span data-gallery-current>01</span> / ${String(product.images.length).padStart(2, '0')}</p>
    </section>

    <section class="product__info" aria-labelledby="product-title">
      <div class="product__sticky">
        <p class="eyebrow product__eyebrow"><a href="form.html?collection=${collection.slug}" lang="en">${collection.title} / ${collection.number}</a> <span aria-hidden="true">—</span> <span lang="en">${category.name}</span></p>
        <h1 class="product__title" id="product-title"><span lang="en">${product.name}</span></h1>
        <p class="product__name-fa">${product.nameFa}</p>
        <p class="product__price">${formatPrice(product.price)}</p>

        <form class="product-form" data-product-form novalidate>
          <fieldset class="option-group">
            <legend class="option-group__legend"><span lang="en">Color</span> <span class="option-group__value" data-color-label lang="en">${COLORS[state.color].name}</span></legend>
            <div class="swatch-options">
              ${product.colors.map((c, i) => `
                <label class="swatch-option" title="${COLORS[c].name}">
                  <input type="radio" name="color" value="${c}"${i === 0 ? ' checked' : ''}>
                  <span class="swatch swatch--large" style="--swatch:${COLORS[c].hex}"></span>
                  <span class="visually-hidden">${COLORS[c].fa}</span>
                </label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="option-group" data-size-group aria-describedby="size-error">
            <legend class="option-group__legend"><span lang="en">Size</span> <span class="option-group__value" data-size-label></span></legend>
            <div class="size-options">
              ${product.sizes.map((s) => {
                const out = (product.stock[s] ?? 0) === 0;
                return `<label class="size-option${out ? ' is-out' : ''}">
                  <input type="radio" name="size" value="${s}"${out ? ' disabled' : ''}>
                  <span lang="en">${s}</span>${out ? '<span class="visually-hidden">ناموجود</span>' : ''}
                </label>`;
              }).join('')}
            </div>
            <p class="form-error" id="size-error" data-size-error role="alert"></p>
            <p class="product__stock" data-stock-note aria-live="polite"></p>
          </fieldset>

          <button type="button" class="link-button product__size-guide" data-size-guide-open>${icon('ruler')}<span lang="en">Size guide</span></button>

          <div class="product__actions" data-main-actions>
            <button type="submit" class="button button--block button--add" data-add-to-bag${soldOut ? ' disabled' : ''}>
              <span class="button__label" data-add-label lang="en">${soldOut ? 'Sold out' : 'Add to bag'}</span>
            </button>
            <button type="button" class="wish-btn wish-btn--outlined${isWishlisted(product.slug) ? ' is-active' : ''}" data-wishlist-toggle="${product.slug}" aria-pressed="${isWishlisted(product.slug)}">
              ${icon('heart')}<span class="visually-hidden">ذخیره در علاقه‌مندی‌ها</span>
            </button>
          </div>
        </form>

        <p class="product__description">${product.description}</p>

        <div class="accordions">
          ${accordion('details', 'Details', 'جزئیات', `<ul class="dash-list">${product.details.map((d) => `<li>${d}</li>`).join('')}</ul>`, true)}
          ${accordion('material', 'Material', 'جنس', `<p>${product.materials}</p>`)}
          ${accordion('fit', 'Fit', 'فرم', `<p>${product.fit}</p><p><a href="size-guide.html">راهنمای کامل سایز</a></p>`)}
          ${accordion('care', 'Care', 'نگهداری', `<p>${product.care}</p>`)}
          ${accordion('shipping', 'Shipping & Returns', 'ارسال و بازگشت', `<p>${SHIPPING_NOTE}</p>`)}
        </div>
      </div>
    </section>
  </div>

  <section class="section container related" aria-labelledby="related-title">
    <div class="section-head">
      <h2 class="section-head__title" id="related-title"><span lang="en">Complete the form</span></h2>
      <a class="text-link" href="shop.html"><span lang="en">View all</span>${icon('arrow', 'icon--dir')}</a>
    </div>
    <ul class="product-grid" data-product-grid="related:${product.slug}" data-limit="4"></ul>
  </section>

  <div class="sticky-cta" data-sticky-cta aria-hidden="true">
    <div class="sticky-cta__info">
      <span class="sticky-cta__name" lang="en">${product.name}</span>
      <span class="sticky-cta__price">${formatPrice(product.price)}</span>
    </div>
    <button type="button" class="button" data-sticky-add tabindex="-1"${soldOut ? ' disabled' : ''}><span lang="en">${soldOut ? 'Sold out' : 'Add to bag'}</span></button>
  </div>

  <dialog class="size-dialog" data-size-dialog aria-labelledby="size-dialog-title">
    <div class="size-dialog__inner">
      <div class="size-dialog__head">
        <h2 id="size-dialog-title" lang="en">Size guide</h2>
        <button type="button" class="icon-button" data-size-guide-close>${icon('close')}<span class="visually-hidden">بستن</span></button>
      </div>
      <p class="size-dialog__fit">${product.fit}</p>
      ${sizeTable()}
      <a class="text-link" href="size-guide.html"><span>راهنمای کامل و نحوه‌ی اندازه‌گیری</span>${icon('arrow', 'icon--dir')}</a>
    </div>
  </dialog>`;

  initAccordions(root);
  initProductGrids();
  bindGallery();
  bindOptions(product, state);
  bindSizeDialog();
  bindStickyCta();

  /* Structured data */
  setJsonLd('ld-product', {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    alternateName: product.nameFa,
    description: product.description,
    sku: `VN-${String(product.id).padStart(4, '0')}`,
    image: product.images.map((img) => imageUrl(img, 1200, 1.25)),
    brand: { '@type': 'Brand', name: 'VĀNE' },
    category: category.name,
    material: product.materials,
    color: product.colors.map((c) => COLORS[c].name).join(', '),
    offers: {
      '@type': 'Offer',
      url: SITE_URL + pageUrl,
      priceCurrency: 'IRR',
      price: product.price * 10,
      availability: soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  });
  setJsonLd('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'پوشاک', item: `${SITE_URL}shop.html` },
      { '@type': 'ListItem', position: 3, name: category.fa, item: `${SITE_URL}shop.html?category=${product.category}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: SITE_URL + pageUrl }
    ]
  });
}

function bindGallery() {
  const track = $('[data-gallery-track]');
  const current = $('[data-gallery-current]');
  const items = $$('[data-gallery-item]', track);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) current.textContent = String(items.indexOf(entry.target) + 1).padStart(2, '0');
    });
  }, { root: track, threshold: 0.6 });
  items.forEach((item) => observer.observe(item));
}

function bindOptions(product, state) {
  const form = $('[data-product-form]');
  const colorLabel = $('[data-color-label]');
  const sizeLabel = $('[data-size-label]');
  const sizeError = $('[data-size-error]');
  const stockNote = $('[data-stock-note]');
  const addBtn = $('[data-add-to-bag]');
  const addLabel = $('[data-add-label]');

  form.addEventListener('change', (event) => {
    const { name, value } = event.target;
    if (name === 'color') {
      state.color = value;
      colorLabel.textContent = COLORS[value].name;
    }
    if (name === 'size') {
      state.size = value;
      sizeLabel.textContent = value;
      sizeError.textContent = '';
      $('[data-size-group]').classList.remove('has-error');
      const left = product.stock[value] ?? 0;
      stockNote.textContent = left <= 2 ? `فقط ${toFa(left)} عدد در سایز ${value} باقی مانده است.` : '';
    }
  });

  const add = () => {
    if (!state.size) {
      sizeError.textContent = 'لطفاً سایز را انتخاب کنید.';
      const group = $('[data-size-group]');
      group.classList.add('has-error');
      group.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('input[name="size"]:not(:disabled)', form)?.focus({ preventScroll: true });
      return;
    }
    addToCart({ slug: product.slug, color: state.color, size: state.size });
    announce(`${product.name} — سایز ${state.size} به سبد اضافه شد`);
    addBtn.classList.add('is-added');
    addLabel.textContent = 'Added';
    setTimeout(() => {
      addBtn.classList.remove('is-added');
      addLabel.textContent = 'Add to bag';
    }, 1800);
    setTimeout(openCart, 450);
  };

  form.addEventListener('submit', (event) => { event.preventDefault(); add(); });
  $('[data-sticky-add]').addEventListener('click', add);
}

function bindSizeDialog() {
  const dialog = $('[data-size-dialog]');
  $('[data-size-guide-open]').addEventListener('click', () => dialog.showModal());
  $('[data-size-guide-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}

/* Mobile: show a sticky Add to Bag bar once the main button scrolls away. */
function bindStickyCta() {
  const bar = $('[data-sticky-cta]');
  const actions = $('[data-main-actions]');
  const button = $('[data-sticky-add]');
  const observer = new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    button.tabIndex = show ? 0 : -1;
  });
  observer.observe(actions);
}

Object.assign(V, { initProductPage });
})(window.VANE = window.VANE || {});
