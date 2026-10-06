/* Live product search — fullscreen overlay and search.html. */
(function (V) {
'use strict';
const { products, CATEGORIES, COLORS, getCollection, imgTag, $, $$, debounce, formatPrice, toFa, lockScroll, trapFocus, getParam, escapeHTML, nextFrameClass, renderGrid } = V;

const normalize = (value) => String(value)
  .toLowerCase()
  .replace(/[يى]/g, 'ی')
  .replace(/ك/g, 'ک')
  .replace(/[ً-ٟ‌]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/** Build one searchable string per product. */
const index = products.map((p) => {
  const collection = getCollection(p.collection);
  const haystack = [
    p.name, p.nameFa, p.description,
    CATEGORIES[p.category].name, CATEGORIES[p.category].fa,
    p.category, collection?.title, collection?.season, collection?.seasonFa,
    ...p.colors.flatMap((c) => [COLORS[c].name, COLORS[c].fa]),
    ...p.tags
  ].join(' ');
  return { product: p, text: normalize(haystack), name: normalize(p.name) };
});

/** Every query word must match (singular forms included: "blazers" → "blazer"). */
function searchProducts(query) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  return index
    .map(({ product, text, name }) => {
      let score = 0;
      for (const word of words) {
        const stem = word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word;
        if (!text.includes(stem)) return null;
        score += name.includes(stem) ? 3 : 1;
      }
      return { product, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || Number(b.product.featured) - Number(a.product.featured))
    .map((r) => r.product);
}

const resultTemplate = (p, i) => `
  <li class="search-result" style="--i:${i}">
    <a href="product.html?product=${p.slug}">
      <span class="search-result__media media">${imgTag(p.images[0], { sizes: '(max-width: 767px) 40vw, 180px' })}</span>
      <span class="search-result__name" lang="en">${p.name}</span>
      <span class="search-result__meta">${CATEGORIES[p.category].fa} · ${formatPrice(p.price)}</span>
    </a>
  </li>`;

function initOverlay() {
  const overlay = $('[data-search-overlay]');
  const input = $('[data-search-input]');
  const results = $('[data-search-results]');
  const status = $('[data-search-status]');
  const suggest = $('[data-search-suggest]');
  if (!overlay || !input) return;

  let release = null;
  let lastFocus = null;

  const render = (query) => {
    const q = query.trim();
    suggest.classList.toggle('is-hidden', q.length > 0);
    if (!q) {
      results.innerHTML = '';
      status.textContent = '';
      return;
    }
    const found = searchProducts(q);
    status.innerHTML = found.length
      ? `${toFa(found.length)} نتیجه برای «<span dir="auto">${escapeHTML(q)}</span>»${found.length > 8 ? ` — <a href="search.html?q=${encodeURIComponent(q)}">نمایش همه</a>` : ''}`
      : `نتیجه‌ای برای «<span dir="auto">${escapeHTML(q)}</span>» پیدا نشد. یکی از پیشنهادها را امتحان کنید.`;
    if (!found.length) suggest.classList.remove('is-hidden');
    results.innerHTML = found.length ? `<ul class="search-results">${found.slice(0, 8).map(resultTemplate).join('')}</ul>` : '';
  };

  const open = () => {
    if (overlay.classList.contains('is-open')) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    nextFrameClass(overlay, 'is-open');
    lockScroll(true);
    release = trapFocus(overlay);
    setTimeout(() => input.focus(), 60);
  };

  const close = () => {
    if (!overlay.classList.contains('is-open')) return;
    overlay.classList.remove('is-open');
    lockScroll(false);
    release?.();
    setTimeout(() => { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 450);
    lastFocus?.focus?.();
  };

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-search-open]')) { event.preventDefault(); open(); }
    if (event.target.closest('[data-search-close]')) close();
    const term = event.target.closest('[data-search-term]');
    if (term && overlay.contains(term)) {
      input.value = term.dataset.searchTerm;
      render(input.value);
      input.focus();
    }
  });

  input.addEventListener('input', debounce(() => render(input.value), 120));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
    // "/" opens search from anywhere outside form fields
    if (event.key === '/' && !event.target.closest('input, textarea, select, [contenteditable]')) {
      event.preventDefault();
      open();
    }
  });

  $('[data-search-form]').addEventListener('submit', (event) => {
    if (!input.value.trim()) event.preventDefault();
  });
}

/* search.html — full results page */
function initSearchPage() {
  const root = $('[data-search-page]');
  if (!root) return;
  const form = $('[data-search-page-form]');
  const input = $('input', form);
  const grid = $('[data-search-page-results]');
  const summary = $('[data-search-page-summary]');

  const run = (query, push = false) => {
    const q = query.trim();
    const found = q ? searchProducts(q) : [];
    renderGrid(grid, found);
    summary.innerHTML = !q
      ? 'عبارتی را جستجو کنید یا از پیشنهادها شروع کنید.'
      : found.length
        ? `${toFa(found.length)} نتیجه برای «<span dir="auto">${escapeHTML(q)}</span>»`
        : `نتیجه‌ای برای «<span dir="auto">${escapeHTML(q)}</span>» پیدا نشد.`;
    $('[data-search-empty]', root).hidden = !(q && !found.length);
    if (push) {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
    document.title = q ? `جستجو: ${q} — VĀNE` : 'جستجو — VĀNE';
  };

  input.value = getParam('q') ?? '';
  run(input.value);
  input.addEventListener('input', debounce(() => run(input.value, true), 160));
  form.addEventListener('submit', (event) => { event.preventDefault(); run(input.value, true); });
  $$('[data-search-term]', root).forEach((chip) => chip.addEventListener('click', () => {
    input.value = chip.dataset.searchTerm;
    run(input.value, true);
  }));
}

function initSearch() {
  initOverlay();
  initSearchPage();
}

Object.assign(V, { searchProducts, initSearch });
})(window.VANE = window.VANE || {});
