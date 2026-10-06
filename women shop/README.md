# VĀNE — وانه

**Premium Contemporary Womenswear · Tabriz, Iran**

> **This is a fictional portfolio project.** VĀNE is not a real brand. No products are sold, no payments are processed and no data leaves the browser.

*Quiet confidence. Carefully made.*
*برای دیده شدن ساخته نشده. برای ماندن ساخته شده.*

---

## Project overview

VĀNE is a complete, multi-page e-commerce website for an invented Iranian womenswear label. It is built with **HTML5, CSS3 and vanilla JavaScript** only: no frameworks, no CSS libraries, no build step.

The goal was to show the full range of front-end craft in one piece: brand and art direction, an editorial design system, a working product catalogue with cart, wishlist, search, filters and checkout, full Persian RTL support, SEO, and accessibility.

| | |
|---|---|
| Pages | 17 required pages + `404.html` |
| Products | 22, across 7 categories and 3 collections |
| Journal | 6 Persian long-form articles, 4 categories |
| Dependencies | Google Fonts only. Photography is hot-linked from Unsplash through a single registry. |

## Brand strategy

**Who she is.** A woman aged 20–32 who lives in the city, studied at university and is independent. She notices architecture, photography and contemporary art. She buys fewer things and keeps them longer. She would rather have a precise shoulder line than a visible logo.

**Positioning.** Premium contemporary womenswear. VĀNE is not fast fashion, couture, traditional dress or a generic online boutique. It sits where the contemporary Iranian woman, European editorial fashion, quiet luxury, architecture and minimalism meet.

**Personality.** Quiet, intelligent, refined, architectural, confident, restrained and slightly mysterious.

**Price architecture (Toman).** Tops from 3.8M · shirts 5.4M–6.4M · trousers 7.9M–10.4M · blazers 10.8M–14.2M · dresses 12.6M–18.9M · coats 18.5M–24.5M · signature pieces 26.5M–32M.

## Design philosophy

- **Editorial before commercial.** The home page is laid out like a campaign: a two-page photographic spread, large type, asymmetric grids and a running statement (*WEAR LESS. MEAN MORE.*). The shop only takes over once the mood is set.
- **Architecture as a grid.** Layouts use a 12-column grid with deliberate offsets: images span 6–7 columns and copy sits in 4, with columns left empty on purpose.
- **Restraint as a rule.** One accent colour, hairline rules instead of boxes, no shadows, no rounded corners, no gradients beyond a soft photo scrim.
- **Motion as punctuation.** Curtain image reveals, word-by-word headline reveals and slow cross-fades. Nothing bounces, and every animation turns off under `prefers-reduced-motion`.

## Visual identity

### Logo system
The wordmark is drawn from geometric strokes with **high stroke contrast**: thick and thin diagonals, and an **Ā without a crossbar**, whose macron floats like a lintel. There are no hangers, crowns or shopping bags.

| Asset | File |
|---|---|
| Full wordmark (obsidian / ivory) | `assets/icons/logo-wordmark-*.svg` |
| Compact V mark (obsidian / ivory) | `assets/icons/logo-mark-*.svg` |
| Favicon | `assets/icons/favicon.svg` |

The header uses the wordmark inline with `currentColor`, so it works on ivory, on obsidian (footer) and over photography (transparent hero header). The About page shows all three uses.

### Colour palette

| Token | Hex | Role |
|---|---|---|
| `--color-bg` Warm Ivory | `#F3F0E9` | Dominant background |
| `--color-text` Obsidian | `#171716` | Type, footer, buttons |
| `--color-stone` | `#C9C2B8` | Placeholders, large numerals |
| `--color-taupe` | `#9B9185` | Secondary numerals |
| `--color-olive` Muted Olive | `#626357` | "Added" state |
| `--color-burgundy` Deep Burgundy | `#4A2024` | Accent only: button hover wash, active wishlist heart, errors, one italic word |
| `--color-white` | `#FAF9F6` | Raised surfaces |

Muted body text uses `#6B655D`, a darkened taupe that meets WCAG AA on ivory.

### Typography

| Use | Family |
|---|---|
| English display | **Cormorant Garamond** 300 / italic, uppercase, tight leading (0.82–0.86) |
| English UI | **Inter** 400, 11px, tracked `0.14em`, uppercase |
| Persian | **Estedad → Peyda → Vazirmatn** (Vazirmatn is served from Google Fonts. Estedad and Peyda are used automatically if installed or self-hosted.) |

The body stack starts with Inter and falls back to the Persian face, so mixed Persian/English lines render each script in its own typeface without extra markup.

## UX decisions

- **Persian-first, English-branded.** Documents are `lang="fa" dir="rtl"`. Brand language (navigation labels, product names, display headlines) stays English and LTR, which matches how Iranian premium labels present themselves.
- **Header follows the brief literally.** NEW / COLLECTIONS / CLOTHING / JOURNAL sit on the left, VĀNE in the centre and SEARCH / WISHLIST / BAG on the right. The header row is explicitly `dir="ltr"`, while all content below it is RTL.
- **Product page: gallery left, information right.** In RTL this places the Persian copy on the reading side. On mobile the gallery becomes a swipeable, snap-scrolling carousel with a counter, and a sticky *Add to bag* bar appears once the main button scrolls out of view.
- **Size before bag.** Adding to the bag without a size shows an inline error, focuses the size group and scrolls to it. Sizes that are out of stock are struck through and disabled. When two or fewer pieces remain, a stock note appears.
- **Filters stay in the URL.** `shop.html?category=coats&color=black&sort=price-asc` can be shared and bookmarked.
- **The cart drawer is a confirmation, not a detour.** After adding, the drawer slides in with a free-shipping progress line. Quantity, size and removal all work inside the drawer.
- **Checkout is honest.** A *DEMO* notice, no card fields, and a demo payment button.

## Tech stack

- HTML5 with semantic landmarks
- CSS3: custom properties, grid, `:has()`, `:dir()`, logical properties, `clip-path`, `aspect-ratio`, `inert`, and `prefers-reduced-motion`
- Vanilla JavaScript (ES2020+): one file per responsibility, each wrapped in an IIFE that reads from and writes to a shared `window.VANE` namespace, loaded as ordered `defer` scripts. ES modules were deliberately avoided because browsers block them on `file://`, and the site should open by double-clicking `index.html`.
- `localStorage` for cart, wishlist, newsletter emails and the last order
- `IntersectionObserver` and `MutationObserver` for reveals
- External: Google Fonts and Unsplash image CDN. Nothing else.

## File architecture

```
├── index.html … order-confirmation.html   17 pages + 404.html
├── css/
│   ├── reset.css          modern reset
│   ├── variables.css      design tokens (colour, type scale, spacing, motion, z-index)
│   ├── typography.css     type system, prose, Persian/English handling
│   ├── global.css         base, focus, media frames, reveal + loader motion
│   ├── layout.css         header, mobile menu, footer, grids, page heads
│   ├── components.css     buttons, cards, drawer, search, accordions, forms, toasts…
│   ├── pages.css          page compositions
│   └── responsive.css     tablet (≤1199) and mobile (≤767) overrides
├── js/
│   ├── main.js            entry: global features + page initialisers (loads last)
│   ├── layout.js          header / menu / search / drawer / footer templates
│   ├── navigation.js      sticky header states, fullscreen mobile menu
│   ├── products.js        product card + data-driven grids
│   ├── product-page.js    product detail, options, structured data
│   ├── filters.js         shop filters, sorting, URL state
│   ├── search.js          live search (overlay + search.html)
│   ├── cart.js            cart state, drawer, cart page
│   ├── wishlist.js        wishlist state + page
│   ├── checkout.js        demo checkout + confirmation
│   ├── collections.js     collections, collection detail, lookbook
│   ├── journal.js         journal index + article pages
│   ├── animations.js      reveals, split text, image fallbacks
│   ├── newsletter.js      validation + success state
│   ├── forms.js           shared validation, contact form
│   ├── accordion.js       accessible accordions
│   ├── size-table.js      size chart (cm / inch)
│   └── utils.js           helpers (formatting, storage, focus trap, meta)
├── data/
│   ├── products.js        22 products
│   ├── collections.js     FORM / 01, STILLNESS / 02, NORTH / 03 + lookbook
│   ├── articles.js        6 journal articles
│   └── media.js           the only place image URLs live
├── assets/{icons,images,fonts}   logos + favicon (icon sprite is inlined by layout.js)
├── tools/serve.ps1        zero-dependency local server (Windows)
├── sitemap.xml · robots.txt
└── README.md
```

**One source for the site chrome.** The header, menu, search overlay, cart drawer and footer are rendered once from `js/layout.js`, so the 18 pages can't drift apart. Page-level content and metadata stay as static HTML for SEO.

**Centralised imagery.** Products, collections, articles and page templates refer to images by key (`data-media="coatBlackWall"` or `media.blazerPearl`). `imgTag()` builds a responsive `srcset` with `width` and `height` attributes. To swap in your own photography, change one line in `data/media.js`.

## Features

### Cart system
- Each line is keyed by `slug | colour | size`. Adding the same combination increases its quantity instead.
- Quantity is capped by stock for that size (and at most 5).
- Changing a line's size merges it into an existing identical line when there is one.
- Subtotal and shipping: free standard shipping from 15,000,000 Toman, otherwise 350,000. Express costs 650,000.
- The cart persists in `localStorage` (`vane:cart`) and syncs across tabs through the `storage` event.
- The drawer traps focus, closes with ESC or a backdrop click, and returns focus to the button that opened it.
- A full `cart.html` page has a sticky order summary.

### Wishlist system
- Heart toggles anywhere (cards, product page) use `aria-pressed`. The active heart fills with burgundy and plays a short pop-and-ring animation.
- The header count updates live, and the list persists in `localStorage` (`vane:wishlist`).
- `wishlist.html` lists saved pieces with remove actions. When the list is empty it shows suggestions instead.

### Search
- A fullscreen overlay opens with **SEARCH VĀNE**. It also opens from anywhere with the `/` key and closes with **ESC**.
- Results update live as you type and match name, Persian name, category (EN/FA), colour (EN/FA), collection, season and tags.
- Every word must match, plurals are handled (*blazers* → *blazer*), and Persian ی/ك variants are normalised.
- Suggestions: Blazer · Black dress · FORM · Autumn · Trouser.
- `search.html?q=` is the full results page.

### Filtering and sorting
- Category tabs show counts.
- Filters: collection, new arrivals, size (only in-stock sizes match), colour and price band.
- Active filters appear as removable chips, with *Clear all*.
- Sorting: Featured, Newest, Price low → high, Price high → low.
- On desktop the filter panel is inline. On mobile it is a full-height sheet with a *Show N results* button.

### Checkout
Contact, Address, Shipping, Payment (demo gateway or cash on delivery in Tabriz) and Order Review. Validation accepts Persian or Latin digits for phone and postal code, shows inline errors with `aria-invalid` and `aria-describedby`, and moves focus to the first error. A successful order saves `VN-10284` (counting up after that), clears the bag and redirects to `order-confirmation.html`.

### Also included
- Collections index plus a data-driven collection page (`form.html`, `form.html?collection=stillness|north`)
- A magazine-style lookbook with six distinct layouts and a running `01 / 06` counter
- Journal category filter and article pages with *Shop the story* and related reading
- About page with the identity showcase, and an Atelier page with six process stages
- Size guide with a cm/inch toggle and a measurement diagram
- Contact page with a validated form and client-care accordions (`#shipping`, `#returns` and `#faq` deep-link open)
- Newsletter with validation and an elegant success state

## SEO

- Every page has a unique `<title>`, meta description, canonical URL, Open Graph and Twitter tags, and a logical heading outline.
- Data-driven pages (product, article, collection) rewrite their title, description, canonical and OG tags at runtime.
- JSON-LD:
  - **Organization** and **WebSite** (with SearchAction) on the home page
  - **BreadcrumbList** on inner pages
  - **Product** with Offer on product pages
  - **Article** on articles
- `sitemap.xml` lists 40 URLs, including every product and article. `robots.txt` excludes cart, checkout, wishlist and search, which also carry `noindex`.
- Persian keywords appear naturally in titles and copy: خرید لباس زنانه، لباس زنانه شیک، لباس زنانه پریمیوم، خرید کت زنانه، خرید شلوار زنانه، لباس زنانه مینیمال، برند لباس زنانه ایرانی، پوشاک زنانه تبریز، لباس زنانه باکیفیت.
- `https://vane.example/` is a placeholder domain (the `.example` TLD is reserved for documentation). Replace it in the pages, `sitemap.xml`, `robots.txt` and `js/utils.js` (`SITE_URL`) before deploying.

## Accessibility

- Skip link, landmarks, and `aria-current` for navigation and breadcrumbs
- Real `<button>` elements everywhere. Dialogs (menu, search, drawer, filter sheet) trap focus, close with ESC and restore focus.
- Native radio inputs for colour and size, so arrow-key selection works
- Accordions use `aria-expanded` and `aria-controls`, with collapsed panels marked `inert`
- A polite live region announces cart, wishlist and form changes
- 1px high-contrast `:focus-visible` outlines throughout
- Alt text written in Persian for every photograph. Decorative duplicates (hover images) use empty `alt`.
- Full `prefers-reduced-motion` support: no curtain, no reveals, no zooms
- Muted text colour adjusted to meet AA contrast on ivory

## Responsive design

| Range | Behaviour |
|---|---|
| ≥ 1200 | 4-column catalogue, full header navigation, asymmetric 12-column compositions |
| 1024–1199 | Tablet compositions, full header |
| 768–1023 | Hamburger header, 3-column catalogue, simplified offsets |
| < 768 | Purpose-built mobile layout: single-image hero, the four-line *WEAR / LESS. / MEAN / MORE.* statement, 2-column catalogue, swipeable product gallery, sticky add-to-bag bar, filter sheet and fullscreen menu |

## Installation

No install step and no build. **Double-click `index.html`**: the site works straight from disk (`file://`). Photography and fonts load from Unsplash and Google Fonts, so you need an internet connection for them; offline, images fall back to quiet VĀNE placeholders.

## Local development

A local server is optional, but it gives you real URLs and keeps `localStorage` separate per site. Pick any one:

```bash
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

```bash
npx serve .
```

```bash
python -m http.server 5500
```

Then open `http://localhost:5500/`. The VS Code *Live Server* extension also works.

To reset demo state, clear the site's `localStorage` (keys starting with `vane:`).

## Future improvements

- Self-hosted, art-directed photography with AVIF/WebP `<picture>` sources
- Self-hosted Estedad or Peyda WOFF2 with `font-display: optional`
- Per-colour product imagery and a zoomable gallery lightbox
- A pre-rendering step that writes header and footer into the static HTML for zero-JS navigation
- A headless commerce backend (real inventory, accounts, payment gateway)
- An English locale with `hreflang` alternates
- Automated tests (Playwright for flows, axe for accessibility)

---

© 2026 VĀNE. A fictional brand created as a portfolio project. Photography via [Unsplash](https://unsplash.com) under the Unsplash License.
