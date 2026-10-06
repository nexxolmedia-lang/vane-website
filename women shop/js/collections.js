/* Collections index, collection detail (form.html), lookbook and home strip. */
(function (V) {
'use strict';
const { collections, getCollection, lookbook, getProduct, products, imgTag, imageUrl, $, $$, getParam, icon, setMeta, setJsonLd, SITE_URL, formatPrice, initProductGrids } = V;

const collectionUrl = (c) => (c.slug === 'form' ? 'form.html' : `form.html?collection=${c.slug}`);

/* ---------- collections.html ---------- */
function renderIndex() {
  const root = $('[data-collections-index]');
  if (!root) return;
  root.innerHTML = collections.map((c, i) => {
    const count = products.filter((p) => p.collection === c.slug).length;
    return `
    <article class="collection-block collection-block--${i % 2 ? 'reverse' : 'default'}">
      <a class="collection-block__media media" href="${collectionUrl(c)}" tabindex="-1" aria-hidden="true" data-reveal="image">
        ${imgTag(c.cover, { ratio: 5 / 4, sizes: '(max-width: 767px) 100vw, 58vw', eager: i === 0 })}
      </a>
      <div class="collection-block__aside media" data-reveal="image" aria-hidden="true">
        ${imgTag(c.hero, { ratio: 4 / 3, sizes: '(max-width: 767px) 45vw, 22vw' })}
      </div>
      <div class="collection-block__text">
        <p class="eyebrow" lang="en">${c.season}</p>
        <h2 class="collection-block__title" lang="en" data-reveal><a href="${collectionUrl(c)}">${c.title}<span class="collection-block__number"> / ${c.number}</span></a></h2>
        <p class="collection-block__concept" lang="en">${c.concept}</p>
        <p class="collection-block__fa">${c.conceptFa}</p>
        <p class="collection-block__meta">${c.seasonFa} — ${new Intl.NumberFormat('fa-IR').format(count)} قطعه</p>
        <a class="text-link" href="${collectionUrl(c)}"><span lang="en">Explore collection</span>${icon('arrow', 'icon--dir')}</a>
      </div>
    </article>`;
  }).join('');
}

/* ---------- form.html (collection detail) ---------- */
function renderCollection() {
  const root = $('[data-collection-root]');
  if (!root) return;
  const collection = getCollection(getParam('collection') || 'form') || getCollection('form');
  const index = collections.indexOf(collection);
  const next = collections[(index + 1) % collections.length];

  if (collection.slug !== 'form') {
    setMeta({
      title: `${collection.title} / ${collection.number} — ${collection.seasonFa} | VĀNE`,
      description: `${collection.conceptFa} ${collection.intro.slice(0, 110)}…`,
      path: collectionUrl(collection),
      image: imageUrl(collection.hero, 1200, 0.66)
    });
  }

  root.innerHTML = `
  <section class="collection-hero" aria-labelledby="collection-title">
    <div class="collection-hero__media media">
      ${imgTag(collection.hero, { ratio: 1.25, sizes: '100vw', eager: true })}
    </div>
    <div class="collection-hero__content container">
      <p class="eyebrow eyebrow--light" lang="en">${collection.season}</p>
      <h1 class="collection-hero__title" id="collection-title" lang="en">
        <span class="line"><span>${collection.title}</span></span>
        <span class="line collection-hero__number"><span>/ ${collection.number}</span></span>
      </h1>
      <p class="collection-hero__concept" lang="en">${collection.concept}</p>
    </div>
  </section>

  <section class="section container collection-intro">
    <p class="collection-intro__label eyebrow" lang="en">The concept</p>
    <div class="collection-intro__text">
      <p class="lead" data-reveal>${collection.conceptFa}</p>
      <p data-reveal>${collection.intro}</p>
    </div>
  </section>

  <section class="chapters" aria-label="فصل‌های کالکشن">
    ${collection.chapters.map((ch, i) => `
    <article class="chapter chapter--${i + 1} container">
      <div class="chapter__media media" data-reveal="image">
        ${imgTag(ch.image, { ratio: i === 1 ? 5 / 4 : 4 / 3, sizes: '(max-width: 767px) 100vw, 50vw' })}
      </div>
      <div class="chapter__text">
        <p class="chapter__index" lang="en">0${i + 1} / 0${collection.chapters.length}</p>
        <h2 class="chapter__title" lang="en" data-reveal>${ch.label}</h2>
        <p class="chapter__fa">${ch.labelFa}</p>
        <p class="chapter__body" data-reveal>${ch.text}</p>
      </div>
    </article>`).join('')}
  </section>

  <section class="section container" aria-labelledby="pieces-title">
    <div class="section-head">
      <h2 class="section-head__title" id="pieces-title"><span lang="en">The pieces</span> <span class="section-head__fa">قطعه‌های ${collection.title}</span></h2>
      <a class="text-link" href="shop.html?collection=${collection.slug}"><span lang="en">Shop collection</span>${icon('arrow', 'icon--dir')}</a>
    </div>
    <ul class="product-grid" data-product-grid="collection:${collection.slug}" data-limit="12"></ul>
  </section>

  ${collection.slug === 'form' ? `
  <section class="lookbook-cta" aria-labelledby="lb-cta-title">
    <div class="lookbook-cta__media media">${imgTag(lookbook.looks[1].image, { ratio: 0.6, sizes: '100vw' })}</div>
    <div class="lookbook-cta__content container">
      <p class="eyebrow eyebrow--light" lang="en">Lookbook — 01 / 06</p>
      <h2 class="lookbook-cta__title" id="lb-cta-title" lang="en">The Shape<br>of Silence</h2>
      <a class="button button--light" href="lookbook.html"><span lang="en">View lookbook</span></a>
    </div>
  </section>` : ''}

  <nav class="next-collection container" aria-label="کالکشن بعدی">
    <a href="${collectionUrl(next)}" class="next-collection__link">
      <span class="eyebrow" lang="en">Next collection</span>
      <span class="next-collection__title" lang="en">${next.title} <span>/ ${next.number}</span></span>
      <span class="next-collection__fa">${next.conceptFa}</span>
      ${icon('arrow', 'icon--dir next-collection__arrow')}
    </a>
  </nav>`;

  initProductGrids();
  setJsonLd('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'کالکشن‌ها', item: `${SITE_URL}collections.html` },
      { '@type': 'ListItem', position: 3, name: `${collection.title} / ${collection.number}`, item: SITE_URL + collectionUrl(collection) }
    ]
  });
}

/* ---------- lookbook.html ---------- */
function wearing(slugs) {
  const items = slugs.map(getProduct).filter(Boolean);
  return `
    <div class="look__wearing">
      <p class="eyebrow" lang="en">Wearing</p>
      <ul>${items.map((p) => `<li><a href="product.html?product=${p.slug}"><span lang="en">${p.name}</span><span class="look__price">${formatPrice(p.price)}</span></a></li>`).join('')}</ul>
    </div>`;
}

function renderLookbook() {
  const root = $('[data-lookbook]');
  if (!root) return;
  const total = String(lookbook.looks.length).padStart(2, '0');

  root.innerHTML = lookbook.looks.map((look, i) => {
    const n = String(i + 1).padStart(2, '0');
    const head = `
      <header class="look__head">
        <p class="look__index" lang="en">${n} / ${total}</p>
        <h2 class="look__title" lang="en" data-reveal>${look.title}</h2>
        <p class="look__caption">${look.caption}</p>
      </header>`;
    const main = (ratio, sizes) => `<div class="look__media media" data-reveal="image">${imgTag(look.image, { ratio, sizes })}</div>`;
    const detail = (ratio, sizes) => look.detail ? `<div class="look__detail media" data-reveal="image">${imgTag(look.detail, { ratio, sizes })}</div>` : '';

    return `
    <article class="look look--${look.layout}" data-look="${n}" aria-label="Look ${n}">
      ${look.layout === 'type' ? `<p class="look__giant" aria-hidden="true" lang="en">${look.title}</p>` : ''}
      ${main(look.layout === 'full' ? 0.62 : look.layout === 'narrow' ? 1.4 : 4 / 3, look.layout === 'full' ? '100vw' : '(max-width: 767px) 100vw, 50vw')}
      ${detail(look.layout === 'pair' ? 4 / 3 : 5 / 4, '(max-width: 767px) 60vw, 30vw')}
      <div class="look__text">${head}${wearing(look.products)}</div>
    </article>`;
  }).join('');

  // Running page counter: "03 / 06"
  const counter = $('[data-look-counter]');
  if (counter) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) counter.textContent = `${entry.target.dataset.look} / ${total}`;
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('[data-look]', root).forEach((el) => observer.observe(el));
  }
}

/* ---------- Home: lookbook strip controls ---------- */
function initStrips() {
  $$('[data-strip]').forEach((strip) => {
    const track = $('[data-strip-track]', strip);
    const prev = $('[data-strip-prev]', strip);
    const next = $('[data-strip-next]', strip);
    if (!track) return;
    const rtl = getComputedStyle(track).direction === 'rtl';
    const step = () => track.clientWidth * 0.8;
    // In RTL, "next" moves toward the inline end (negative scrollLeft)
    next?.addEventListener('click', () => track.scrollBy({ left: rtl ? -step() : step(), behavior: 'smooth' }));
    prev?.addEventListener('click', () => track.scrollBy({ left: rtl ? step() : -step(), behavior: 'smooth' }));
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pos = Math.abs(track.scrollLeft);
      if (prev) prev.disabled = pos < 4;
      if (next) next.disabled = pos > max - 4;
    };
    track.addEventListener('scroll', update, { passive: true });
    update();
  });
}

function initCollections() {
  renderIndex();
  renderCollection();
  renderLookbook();
  initStrips();
}

Object.assign(V, { initCollections });
})(window.VANE = window.VANE || {});
