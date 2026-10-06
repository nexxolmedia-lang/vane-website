/* Product card template + generic grids driven by data attributes. */
(function (V) {
'use strict';
const { products, COLORS, CATEGORIES, getProduct, totalStock, imgTag, $$, formatPrice, icon, storage, emit } = V;

const CARD_SIZES = '(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw';

function productCard(product, { removable = false, eager = false, index = 0 } = {}) {
  const saved = storage.get('vane:wishlist', []).includes(product.slug);
  const url = `product.html?product=${product.slug}`;
  const category = CATEGORIES[product.category];
  const soldOut = totalStock(product) === 0;
  const available = product.sizes.filter((s) => (product.stock[s] ?? 0) > 0);
  const badge = product.collection && product.tags.includes('signature')
    ? 'Signature'
    : product.newArrival ? 'New' : '';

  return `
  <article class="product-card" style="--i:${index % 8}">
    <div class="product-card__media-wrap">
      <a class="product-card__media media" href="${url}" aria-label="${product.name}، ${formatPrice(product.price)}">
        ${imgTag(product.images[0], { sizes: CARD_SIZES, eager, className: 'product-card__img' })}
        ${imgTag(product.hoverImage, { sizes: CARD_SIZES, className: 'product-card__img product-card__img--hover', alt: '' })}
        ${badge ? `<span class="product-card__badge" lang="en">${badge}</span>` : ''}
        <span class="product-card__quick" aria-hidden="true">
          <span lang="en">${soldOut ? 'Sold out' : 'Sizes'}</span>
          <span class="product-card__sizes" lang="en">${product.sizes.map((s) => `<span class="${available.includes(s) ? '' : 'is-out'}">${s}</span>`).join('')}</span>
        </span>
      </a>
      <button class="wish-btn${saved ? ' is-active' : ''}" type="button" data-wishlist-toggle="${product.slug}" aria-pressed="${saved}">
        ${icon('heart')}
        <span class="visually-hidden">ذخیره‌ی ${product.name} در علاقه‌مندی‌ها</span>
      </button>
    </div>
    <div class="product-card__body">
      <p class="product-card__category"><span lang="en">${category.name}</span> <span aria-hidden="true">·</span> ${category.fa}</p>
      <h3 class="product-card__name"><a href="${url}" lang="en" tabindex="-1">${product.name}</a></h3>
      <p class="product-card__price">${formatPrice(product.price)}</p>
      <ul class="swatches swatches--small" aria-label="رنگ‌های موجود">
        ${product.colors.map((c) => `<li class="swatch" style="--swatch:${COLORS[c].hex}" title="${COLORS[c].name}"><span class="visually-hidden">${COLORS[c].fa}</span></li>`).join('')}
      </ul>
      ${removable ? `<button type="button" class="link-button product-card__remove" data-wishlist-toggle="${product.slug}" aria-pressed="true">حذف از فهرست<span class="visually-hidden"> ${product.name}</span></button>` : ''}
    </div>
  </article>`;
}

function renderGrid(container, list, options = {}) {
  container.innerHTML = list.map((p, index) => `<li>${productCard(p, { ...options, index, eager: options.eager && index < 4 })}</li>`).join('');
  emit('products:rendered', { container });
}

/**
 * Any element with data-product-grid gets populated:
 *   featured | new | collection:<slug> | related:<slug> | slugs:a,b,c
 */
function initProductGrids() {
  $$('[data-product-grid]').forEach((container) => {
    const [type, value] = container.dataset.productGrid.split(':');
    const limit = Number(container.dataset.limit) || 8;
    let list = [];
    if (type === 'featured') list = products.filter((p) => p.featured);
    if (type === 'new') list = products.filter((p) => p.newArrival).sort((a, b) => b.date.localeCompare(a.date));
    if (type === 'collection') list = products.filter((p) => p.collection === value);
    if (type === 'slugs') list = value.split(',').map(getProduct).filter(Boolean);
    if (type === 'related') {
      const base = getProduct(value);
      list = base ? products.filter((p) => p.slug !== base.slug && (p.collection === base.collection || p.category === base.category)) : [];
    }
    renderGrid(container, list.slice(0, limit));
  });
}

Object.assign(V, { productCard, renderGrid, initProductGrids });
})(window.VANE = window.VANE || {});
