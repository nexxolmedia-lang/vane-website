/* Shop catalogue: category tabs, filters, sorting, URL state. */
(function (V) {
'use strict';
const { products, CATEGORIES, COLORS, SIZES, collections, $, $$, toFa, icon, lockScroll, trapFocus, prefersReducedMotion, nextFrameClass, renderGrid } = V;

const PRICE_RANGES = [
  { key: 'u6', label: 'تا ۶ میلیون', min: 0, max: 6000000 },
  { key: '6-10', label: '۶ تا ۱۰ میلیون', min: 6000000, max: 10000000 },
  { key: '10-15', label: '۱۰ تا ۱۵ میلیون', min: 10000000, max: 15000000 },
  { key: '15-25', label: '۱۵ تا ۲۵ میلیون', min: 15000000, max: 25000000 },
  { key: '25', label: 'بیش از ۲۵ میلیون', min: 25000000, max: Infinity }
];

const SORTS = {
  featured: { label: 'Featured', fa: 'منتخب', fn: (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id },
  newest: { label: 'Newest', fa: 'جدیدترین', fn: (a, b) => b.date.localeCompare(a.date) || a.id - b.id },
  'price-asc': { label: 'Price low to high', fa: 'قیمت: کم به زیاد', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price high to low', fa: 'قیمت: زیاد به کم', fn: (a, b) => b.price - a.price }
};

const MULTI = ['collection', 'size', 'color', 'price'];

function readState() {
  const params = new URLSearchParams(window.location.search);
  const list = (key) => (params.get(key) || '').split(',').filter(Boolean);
  return {
    category: CATEGORIES[params.get('category')] ? params.get('category') : 'all',
    collection: list('collection'),
    size: list('size'),
    color: list('color'),
    price: list('price'),
    newOnly: params.get('filter') === 'new',
    sort: SORTS[params.get('sort')] ? params.get('sort') : (params.get('filter') === 'new' ? 'newest' : 'featured')
  };
}

function writeState(state) {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  MULTI.forEach((key) => { if (state[key].length) params.set(key, state[key].join(',')); });
  if (state.newOnly) params.set('filter', 'new');
  if (state.sort !== 'featured') params.set('sort', state.sort);
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
}

function applyFilters(state) {
  return products
    .filter((p) => state.category === 'all' || p.category === state.category)
    .filter((p) => !state.collection.length || state.collection.includes(p.collection))
    .filter((p) => !state.size.length || state.size.some((s) => (p.stock[s] ?? 0) > 0))
    .filter((p) => !state.color.length || state.color.some((c) => p.colors.includes(c)))
    .filter((p) => !state.price.length || state.price.some((key) => {
      const range = PRICE_RANGES.find((r) => r.key === key);
      return range && p.price >= range.min && p.price < range.max;
    }))
    .filter((p) => !state.newOnly || p.newArrival)
    .sort(SORTS[state.sort].fn);
}

const checkbox = (name, value, label, checked, extra = '') => `
  <label class="check">
    <input type="checkbox" name="${name}" value="${value}"${checked ? ' checked' : ''}>
    <span class="check__box" aria-hidden="true">${icon('check')}</span>
    ${extra}<span class="check__label">${label}</span>
  </label>`;

function panelTemplate(state) {
  return `
    <div class="filter-panel__head">
      <h2 class="filter-panel__title" lang="en">Filter</h2>
      <button type="button" class="icon-button filter-panel__close" data-filter-close>${icon('close')}<span class="visually-hidden">بستن فیلترها</span></button>
    </div>
    <div class="filter-panel__groups">
      <fieldset class="filter-group">
        <legend lang="en">Collection</legend>
        ${collections.map((c) => checkbox('collection', c.slug, `<span lang="en">${c.title} / ${c.number}</span>`, state.collection.includes(c.slug))).join('')}
        ${checkbox('new', '1', '<span lang="en">New arrivals</span>', state.newOnly)}
      </fieldset>
      <fieldset class="filter-group">
        <legend lang="en">Size</legend>
        <div class="size-checks">
          ${SIZES.map((s) => `
            <label class="size-check"><input type="checkbox" name="size" value="${s}"${state.size.includes(s) ? ' checked' : ''}><span lang="en">${s}</span></label>`).join('')}
        </div>
      </fieldset>
      <fieldset class="filter-group">
        <legend lang="en">Color</legend>
        <div class="color-checks">
          ${Object.entries(COLORS).map(([key, c]) => checkbox('color', key, `${c.fa}`, state.color.includes(key), `<span class="swatch" style="--swatch:${c.hex}" aria-hidden="true"></span>`)).join('')}
        </div>
      </fieldset>
      <fieldset class="filter-group">
        <legend lang="en">Price</legend>
        ${PRICE_RANGES.map((r) => checkbox('price', r.key, r.label, state.price.includes(r.key))).join('')}
      </fieldset>
    </div>
    <div class="filter-panel__foot">
      <button type="button" class="button button--ghost" data-filter-clear><span lang="en">Clear all</span></button>
      <button type="button" class="button" data-filter-apply>نمایش <span data-filter-result-count></span> نتیجه</button>
    </div>`;
}

function initShop() {
  const root = $('[data-shop]');
  if (!root) return;

  const state = readState();
  const grid = $('[data-shop-grid]', root);
  const tabs = $('[data-category-tabs]', root);
  const panel = $('[data-filter-panel]', root);
  const toggle = $('[data-filter-toggle]', root);
  const sortSelect = $('[data-sort]', root);
  const chips = $('[data-active-filters]', root);
  const count = $('[data-results-count]', root);
  const empty = $('[data-shop-empty]', root);
  const title = $('[data-shop-title]');
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  /* Category tabs */
  const cats = [['all', 'All', 'همه'], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.name, c.fa])];
  tabs.innerHTML = `<ul class="category-tabs__list">${cats.map(([key, name, fa]) => `
    <li><button type="button" class="category-tab" data-category="${key}" aria-pressed="${state.category === key}">
      <span lang="en">${name}</span><span class="category-tab__fa">${fa}</span>
      <span class="category-tab__count">${toFa(key === 'all' ? products.length : products.filter((p) => p.category === key).length)}</span>
    </button></li>`).join('')}</ul>`;

  /* Sort */
  sortSelect.innerHTML = Object.entries(SORTS).map(([key, s]) => `<option value="${key}"${key === state.sort ? ' selected' : ''}>${s.fa}</option>`).join('');

  /* Panel */
  panel.innerHTML = panelTemplate(state);

  const activeCount = () => state.collection.length + state.size.length + state.color.length + state.price.length + (state.newOnly ? 1 : 0);

  const renderChips = () => {
    const items = [];
    state.collection.forEach((v) => items.push(['collection', v, `${collections.find((c) => c.slug === v)?.title}`]));
    if (state.newOnly) items.push(['new', '1', 'New']);
    state.size.forEach((v) => items.push(['size', v, v]));
    state.color.forEach((v) => items.push(['color', v, COLORS[v]?.fa]));
    state.price.forEach((v) => items.push(['price', v, PRICE_RANGES.find((r) => r.key === v)?.label]));
    chips.innerHTML = items.length ? `
      <ul class="chip-list">${items.map(([k, v, label]) => `
        <li><button type="button" class="chip chip--removable" data-remove-filter="${k}:${v}">
          <span>${label}</span>${icon('close')}<span class="visually-hidden">حذف فیلتر</span>
        </button></li>`).join('')}
        <li><button type="button" class="link-button" data-filter-clear>پاک کردن همه</button></li>
      </ul>` : '';
    const n = activeCount();
    $('[data-filter-count]', root).textContent = n ? `(${toFa(n)})` : '';
  };

  let first = true;
  const update = () => {
    const list = applyFilters(state);
    const draw = () => {
      renderGrid(grid, list, { eager: first });
      grid.classList.remove('is-updating');
      empty.hidden = list.length > 0;
      count.textContent = `${toFa(list.length)} محصول`;
      $('[data-filter-result-count]', root).textContent = toFa(list.length);
      first = false;
    };
    renderChips();
    $$('[data-category]', tabs).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.category === state.category)));
    if (title) {
      title.textContent = state.newOnly ? 'New Arrivals' : state.category === 'all' ? 'Clothing' : CATEGORIES[state.category].name;
    }
    writeState(state);
    if (first || prefersReducedMotion()) draw();
    else {
      grid.classList.add('is-updating');
      setTimeout(draw, 180);
    }
  };

  /* Filter panel open/close (inline on desktop, sheet on mobile) */
  let release = null;
  const setPanel = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      nextFrameClass(panel, 'is-open');
      if (mobileQuery.matches) {
        lockScroll(true);
        release = trapFocus(panel);
        $('input', panel)?.focus();
      }
    } else {
      panel.classList.remove('is-open');
      if (release) { lockScroll(false); release(); release = null; }
      setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 400);
    }
  };

  toggle.addEventListener('click', () => setPanel(toggle.getAttribute('aria-expanded') !== 'true'));

  panel.addEventListener('change', (event) => {
    const input = event.target;
    if (input.name === 'new') state.newOnly = input.checked;
    else if (MULTI.includes(input.name)) {
      state[input.name] = $$(`input[name="${input.name}"]:checked`, panel).map((i) => i.value);
    }
    update();
  });

  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-category]');
    if (tab) { state.category = tab.dataset.category; update(); }

    const remove = event.target.closest('[data-remove-filter]');
    if (remove) {
      const [key, value] = remove.dataset.removeFilter.split(':');
      if (key === 'new') state.newOnly = false;
      else state[key] = state[key].filter((v) => v !== value);
      panel.innerHTML = panelTemplate(state);
      update();
      toggle.focus();
    }

    if (event.target.closest('[data-filter-clear]')) {
      MULTI.forEach((k) => { state[k] = []; });
      state.newOnly = false;
      panel.innerHTML = panelTemplate(state);
      update();
    }
    if (event.target.closest('[data-filter-close]') || event.target.closest('[data-filter-apply]')) {
      setPanel(false);
      toggle.focus();
    }
  });

  sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; update(); });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setPanel(false);
      toggle.focus();
    }
  });

  if (activeCount() && !mobileQuery.matches) setPanel(true);
  update();
}

Object.assign(V, { initShop });
})(window.VANE = window.VANE || {});
