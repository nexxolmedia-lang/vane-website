/* Wishlist state (localStorage), heart toggles and wishlist page. */
(function (V) {
'use strict';
const { products, getProduct, $, $$, storage, emit, toFa, announce, productCard } = V;

const KEY = 'vane:wishlist';

const getWishlist = () => storage.get(KEY, []).filter((slug) => getProduct(slug));
const isWishlisted = (slug) => getWishlist().includes(slug);

function toggleWishlist(slug) {
  const list = getWishlist();
  const active = !list.includes(slug);
  const next = active ? [...list, slug] : list.filter((s) => s !== slug);
  storage.set(KEY, next);
  emit('wishlist:change', { slug, active, list: next });
  return active;
}

function syncButtons() {
  const list = getWishlist();
  $$('[data-wishlist-toggle]').forEach((btn) => {
    const active = list.includes(btn.dataset.wishlistToggle);
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('is-active', active);
  });
  $$('[data-wishlist-count]').forEach((el) => {
    el.textContent = toFa(list.length);
    el.classList.toggle('is-empty', list.length === 0);
  });
  $$('[data-wishlist-count-sr]').forEach((el) => { el.textContent = toFa(list.length); });
}

function renderWishlistPage() {
  const root = $('[data-wishlist-page]');
  if (!root) return;
  const list = getWishlist();
  const count = $('[data-wishlist-total]');
  if (count) count.textContent = toFa(list.length);
  if (!list.length) {
    const picks = products.filter((p) => p.featured).slice(0, 4);
    root.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title" lang="en">Nothing saved yet.</p>
        <p>با لمس نماد قلب روی هر محصول، آن را برای بعد نگه دارید. فهرست شما روی همین دستگاه ذخیره می‌شود.</p>
        <a class="button" href="shop.html"><span lang="en">Explore clothing</span></a>
      </div>
      <h2 class="section-label" lang="en">Selected for you</h2>
      <ul class="product-grid">${picks.map((p) => `<li>${productCard(p)}</li>`).join('')}</ul>`;
  } else {
    root.innerHTML = `<ul class="product-grid">${list.map((slug) => `<li>${productCard(getProduct(slug), { removable: true })}</li>`).join('')}</ul>`;
  }
  syncButtons();
}

function initWishlist() {
  syncButtons();
  renderWishlistPage();

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-wishlist-toggle]');
    if (!btn) return;
    event.preventDefault();
    const slug = btn.dataset.wishlistToggle;
    const active = toggleWishlist(slug);
    btn.classList.remove('is-popping');
    void btn.offsetWidth;
    if (active) btn.classList.add('is-popping');
    const name = getProduct(slug)?.name ?? '';
    announce(active ? `${name} به علاقه‌مندی‌ها اضافه شد` : `${name} از علاقه‌مندی‌ها حذف شد`);
  });

  document.addEventListener('wishlist:change', (event) => {
    syncButtons();
    // On the wishlist page, removing an item re-renders the grid
    if ($('[data-wishlist-page]') && !event.detail.active) renderWishlistPage();
  });
  document.addEventListener('products:rendered', syncButtons);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { syncButtons(); renderWishlistPage(); }
  });
}

Object.assign(V, { toggleWishlist, initWishlist, getWishlist, isWishlisted });
})(window.VANE = window.VANE || {});
