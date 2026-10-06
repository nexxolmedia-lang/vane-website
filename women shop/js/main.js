/**
 * VĀNE — entry point for every page.
 *
 * Scripts are classic deferred scripts sharing one namespace (window.VANE) rather
 * than ES modules, so the site also runs when index.html is opened straight from
 * disk (file://), where browsers block module scripts.
 * Load order is declared in each page's <head>; this file always runs last.
 */
(function (V) {
'use strict';
const {
  renderLayout, initNavigation, initCart, initWishlist, initSearch,
  initAnimations, initMediaFallback, initNewsletter, initProductGrids,
  initAccordions, imgTag, $$
} = V;

/* Page-specific initialisers, keyed by <body data-page="…"> */
const PAGE_INITS = {
  home: ['initCollections', 'initJournal'],
  collections: ['initCollections'],
  collection: ['initCollections'],
  lookbook: ['initCollections'],
  shop: ['initShop'],
  product: ['initProductPage'],
  journal: ['initJournal'],
  article: ['initJournal'],
  checkout: ['initCheckoutPages'],
  confirmation: ['initCheckoutPages'],
  contact: ['initContact'],
  'size-guide': ['initSizeGuide']
};

/** Fill <div data-media="registryKey"> placeholders with responsive images. */
function hydrateMedia(scope = document) {
  $$('[data-media]:not([data-media-done])', scope).forEach((el) => {
    const [h, w] = (el.dataset.ratio || '4/3').split('/').map(Number);
    el.insertAdjacentHTML('afterbegin', imgTag(el.dataset.media, {
      ratio: h / w,
      sizes: el.dataset.sizes || '100vw',
      eager: el.hasAttribute('data-eager')
    }));
    el.dataset.mediaDone = 'true';
    el.classList.add('media');
  });
}

function boot() {
  initMediaFallback();
  renderLayout();
  initNavigation();
  initCart();
  initWishlist();
  initSearch();
  initNewsletter();
  hydrateMedia();
  initProductGrids();
  initAccordions();

  const page = document.body.dataset.page;
  (PAGE_INITS[page] || []).forEach((name) => {
    try {
      V[name](page);
    } catch (error) {
      console.error(`[VĀNE] ${name} failed`, error);
    }
  });

  hydrateMedia();
  initNewsletter();
  initAccordions();
  initAnimations();
}

V.hydrateMedia = hydrateMedia;
boot();
})(window.VANE = window.VANE || {});
