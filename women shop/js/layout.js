/**
 * Shared chrome: header, mobile menu, search overlay, cart drawer, footer.
 * Rendered once from a single source so every page stays consistent.
 */
(function (V) {
'use strict';
const { icon } = V;

/* Icon sprite, inlined so <use href="#i-…"> also works from file:// (external sprite refs are blocked there). */
const ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3 21 21"/></g></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.2s-7.6-4.6-8.9-9.7C2.3 7.3 4.3 4.5 7.3 4.5c2 0 3.6 1.2 4.7 2.9 1.1-1.7 2.7-2.9 4.7-2.9 3 0 5 2.8 4.2 6-1.3 5.1-8.9 9.7-8.9 9.7Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></symbol>
  <symbol id="i-bag" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4.5 7.5h15l-1 13h-13Z"/><path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5"/></g></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>
  <symbol id="i-filter" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7h18M3 17h18"/><circle cx="8" cy="7" r="2" fill="#F3F0E9"/><circle cx="16" cy="17" r="2" fill="#F3F0E9"/></g></symbol>
  <symbol id="i-ruler" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2.5 8.5h19v7h-19Z"/><path d="M6.5 8.5v3M10.5 8.5v4M14.5 8.5v3M18.5 8.5v4"/></g></symbol>
</svg>`;

const WORDMARK_PATHS = `<path d="M0 0H9.5L42.5 100H33Z"/><path d="M72.5 0H75L42.5 100H40Z"/><path d="M72.5 100H75L107.5 0H105Z"/><path d="M105.5 0H115L147.5 100H138Z"/><path d="M92 -22H128V-19H92Z"/><path d="M172 0H175V100H172Z"/><path d="M235 0H238V100H235Z"/><path d="M172 0H183L238 100H227Z"/><path d="M268 0H277V100H268Z"/><path d="M268 0H320V2.5H268Z"/><path d="M268 48.75H312V51.25H268Z"/><path d="M268 97.5H322V100H268Z"/>`;

const wordmark = (className = '') =>
  `<svg class="wordmark ${className}" viewBox="0 -26 322 126" aria-hidden="true" focusable="false"><g fill="currentColor">${WORDMARK_PATHS}</g></svg>`;

const vMark = (className = '') =>
  `<svg class="v-mark ${className}" viewBox="-30 -28 135 135" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="M0 0H9.5L42.5 100H33Z"/><path d="M72.5 0H75L42.5 100H40Z"/><path d="M22 -22H53V-19H22Z"/></g></svg>`;

const PRIMARY = [
  { href: 'shop.html?filter=new', label: 'New', fa: 'تازه‌ها', key: 'new' },
  { href: 'collections.html', label: 'Collections', fa: 'کالکشن‌ها', key: 'collections' },
  { href: 'shop.html', label: 'Clothing', fa: 'پوشاک', key: 'shop' },
  { href: 'journal.html', label: 'Journal', fa: 'ژورنال', key: 'journal' }
];

const MOBILE_EXTRA = [
  { href: 'lookbook.html', label: 'Lookbook', fa: 'لوک‌بوک' },
  { href: 'about.html', label: 'About', fa: 'درباره‌ی ما' },
  { href: 'atelier.html', label: 'Atelier', fa: 'آتلیه' },
  { href: 'size-guide.html', label: 'Size Guide', fa: 'راهنمای سایز' },
  { href: 'contact.html', label: 'Contact', fa: 'تماس' }
];

function headerTemplate(pageKey) {
  const page = pageKey === 'shop' && new URLSearchParams(window.location.search).get('filter') === 'new' ? 'new' : pageKey;
  const links = PRIMARY.map((item) => `
    <li><a href="${item.href}" lang="en"${item.key === page ? ' aria-current="page"' : ''}>${item.label}</a></li>`).join('');

  return `
  <a class="skip-link" href="#main">رفتن به محتوای اصلی</a>
  <header class="site-header" data-site-header>
    <div class="site-header__inner" dir="ltr">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="visually-hidden" data-menu-label>باز کردن منو</span>
        <span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span>
      </button>
      <nav class="primary-nav" aria-label="ناوبری اصلی">
        <ul class="primary-nav__list">${links}</ul>
      </nav>
      <a class="site-logo" href="index.html" aria-label="VĀNE — صفحه‌ی اصلی">${wordmark()}</a>
      <div class="header-actions">
        <button class="header-action header-action--search" type="button" data-search-open aria-haspopup="dialog">
          <span class="header-action__label" lang="en">Search</span>${icon('search')}
          <span class="visually-hidden">جستجو</span>
        </button>
        <a class="header-action header-action--wishlist" href="wishlist.html"${page === 'wishlist' ? ' aria-current="page"' : ''}>
          <span class="header-action__label" lang="en">Wishlist</span>${icon('heart')}
          <span class="count" data-wishlist-count aria-hidden="true">0</span>
          <span class="visually-hidden">علاقه‌مندی‌ها، <span data-wishlist-count-sr>۰</span> مورد</span>
        </a>
        <button class="header-action header-action--bag" type="button" data-cart-open aria-haspopup="dialog" aria-controls="cart-drawer">
          <span class="header-action__label" lang="en">Bag</span>${icon('bag')}
          <span class="count count--bag" data-cart-count aria-hidden="true">0</span>
          <span class="visually-hidden">سبد خرید، <span data-cart-count-sr>۰</span> کالا</span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu" data-mobile-menu role="dialog" aria-modal="true" aria-label="منوی اصلی" hidden>
    <div class="mobile-menu__inner">
      <nav aria-label="منوی موبایل">
        <ol class="mobile-menu__primary">
          ${[...PRIMARY, MOBILE_EXTRA[0]].map((item, i) => `
          <li style="--i:${i}">
            <a href="${item.href}">
              <span class="mobile-menu__index" lang="en">0${i + 1}</span>
              <span class="mobile-menu__label" lang="en">${item.label}</span>
              <span class="mobile-menu__fa">${item.fa}</span>
            </a>
          </li>`).join('')}
        </ol>
        <ul class="mobile-menu__secondary">
          ${MOBILE_EXTRA.slice(1).map((item) => `<li><a href="${item.href}">${item.fa}</a></li>`).join('')}
          <li><a href="wishlist.html">علاقه‌مندی‌ها</a></li>
        </ul>
      </nav>
      <button class="mobile-menu__search" type="button" data-search-open>
        ${icon('search')}<span lang="en">Search VĀNE</span>
      </button>
      <p class="mobile-menu__foot" lang="en" dir="ltr">Tabriz, Iran — AW26</p>
    </div>
  </div>

  <div class="search-overlay" id="search-overlay" data-search-overlay role="dialog" aria-modal="true" aria-label="جستجو در VĀNE" hidden>
    <div class="search-overlay__inner">
      <div class="search-overlay__top">
        <form class="search-form" role="search" action="search.html" data-search-form>
          <label for="search-input" class="visually-hidden">جستجو در محصولات</label>
          <input class="search-form__input" id="search-input" name="q" type="search" placeholder="SEARCH VĀNE"
            autocomplete="off" spellcheck="false" data-search-input aria-controls="search-results" aria-describedby="search-status">
          <button class="search-form__submit" type="submit">${icon('arrow', 'icon--dir')}<span class="visually-hidden">نمایش همه‌ی نتایج</span></button>
        </form>
        <button class="icon-button search-overlay__close" type="button" data-search-close>${icon('close')}<span class="visually-hidden">بستن جستجو</span></button>
      </div>
      <div class="search-overlay__suggest" data-search-suggest>
        <p class="eyebrow" lang="en">Suggestions</p>
        <ul class="chip-list">
          ${['Blazer', 'Black dress', 'FORM', 'Autumn', 'Trouser'].map((s) => `<li><button class="chip" type="button" data-search-term="${s}" lang="en">${s}</button></li>`).join('')}
        </ul>
      </div>
      <p class="search-overlay__status" id="search-status" data-search-status aria-live="polite"></p>
      <div class="search-overlay__results" id="search-results" data-search-results></div>
    </div>
  </div>

  <div class="drawer-backdrop" data-drawer-backdrop hidden></div>
  <aside class="cart-drawer" id="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" hidden>
    <div class="cart-drawer__head">
      <h2 class="cart-drawer__title" id="cart-drawer-title"><span lang="en">Bag</span> <span class="cart-drawer__count" data-cart-count-label></span></h2>
      <button class="icon-button" type="button" data-cart-close>${icon('close')}<span class="visually-hidden">بستن سبد خرید</span></button>
    </div>
    <div class="cart-drawer__body" data-cart-drawer-items></div>
    <div class="cart-drawer__foot" data-cart-drawer-foot></div>
  </aside>`;
}

function footerTemplate() {
  const col = (title, links) => `
    <div class="footer-col">
      <h2 class="footer-col__title" lang="en">${title}</h2>
      <ul>${links.map(([href, label, en]) => `<li><a href="${href}"${en ? ' lang="en"' : ''}${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a></li>`).join('')}</ul>
    </div>`;

  return `
  <footer class="site-footer" data-theme="dark">
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <a href="index.html" class="site-footer__logo" aria-label="VĀNE — صفحه‌ی اصلی">${wordmark()}</a>
          <p class="site-footer__statement">برای دیده شدن ساخته نشده.<br>برای ماندن ساخته شده.</p>
          <p class="site-footer__location" lang="en" dir="ltr">Tabriz, Iran</p>
        </div>
        <nav class="site-footer__nav" aria-label="پیوندهای پانویس">
          ${col('Shop', [['shop.html?filter=new', 'تازه‌ها'], ['collections.html', 'کالکشن‌ها'], ['shop.html', 'پوشاک'], ['wishlist.html', 'علاقه‌مندی‌ها']])}
          ${col('About', [['about.html', 'داستان ما'], ['atelier.html', 'آتلیه'], ['journal.html', 'ژورنال'], ['contact.html', 'تماس']])}
          ${col('Client Care', [['size-guide.html', 'راهنمای سایز'], ['contact.html#shipping', 'ارسال'], ['contact.html#returns', 'بازگرداندن کالا'], ['contact.html#faq', 'پرسش‌های متداول']])}
          ${col('Follow', [['https://www.instagram.com/', 'Instagram', true], ['https://www.pinterest.com/', 'Pinterest', true]])}
        </nav>
        <div class="site-footer__newsletter">
          <h2 class="footer-col__title" lang="en">Newsletter</h2>
          <p>کالکشن‌های تازه، یادداشت‌های آتلیه و روایت‌های منتخب.</p>
          <form class="newsletter-form newsletter-form--compact" data-newsletter novalidate>
            <div class="newsletter-form__field">
              <label class="visually-hidden" for="footer-email">ایمیل</label>
              <input id="footer-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="ایمیل شما" required dir="ltr">
              <button type="submit" class="newsletter-form__submit">${icon('arrow', 'icon--dir')}<span class="visually-hidden">عضویت در خبرنامه</span></button>
            </div>
            <p class="form-error" data-newsletter-error role="alert"></p>
          </form>
        </div>
      </div>
      <div class="site-footer__giant" aria-hidden="true">${wordmark()}</div>
      <div class="site-footer__bottom">
        <p>© ۲۰۲۶ VĀNE — این یک پروژه‌ی نمونه‌کار فرضی است.</p>
        <p lang="en" dir="ltr">Quiet confidence. Carefully made.</p>
      </div>
    </div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="off"><span class="toast__dot" aria-hidden="true"></span><span data-toast-text></span></div>
  <div id="live-region" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>`;
}

function renderLayout() {
  const page = document.body.dataset.page || '';
  document.body.insertAdjacentHTML('afterbegin', ICON_SPRITE + headerTemplate(page));
  const main = document.getElementById('main');
  (main || document.body).insertAdjacentHTML('afterend', footerTemplate());
}

Object.assign(V, { renderLayout, wordmark, vMark });
})(window.VANE = window.VANE || {});
