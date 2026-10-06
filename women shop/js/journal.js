/* Journal index, article page and home teaser. */
(function (V) {
'use strict';
const { articles, getArticle, ARTICLE_CATEGORIES, getProduct, imgTag, imageUrl, $, $$, getParam, formatDate, toFa, icon, setMeta, setJsonLd, SITE_URL, formatPrice } = V;

const articleUrl = (a) => `article.html?slug=${a.slug}`;
const sorted = () => [...articles].sort((a, b) => b.date.localeCompare(a.date));

function articleCard(article, { size = 'default', index = 0 } = {}) {
  return `
  <article class="article-card article-card--${size}" style="--i:${index}">
    <a class="article-card__media media" href="${articleUrl(article)}" tabindex="-1" aria-hidden="true">
      ${imgTag(article.hero, { ratio: size === 'feature' ? 0.75 : 5 / 4, sizes: size === 'feature' ? '(max-width: 767px) 100vw, 60vw' : '(max-width: 767px) 100vw, 33vw' })}
    </a>
    <div class="article-card__body">
      <p class="article-card__meta"><span lang="en">${ARTICLE_CATEGORIES[article.category]}</span><span aria-hidden="true">—</span><time datetime="${article.date}">${formatDate(article.date)}</time></p>
      <h3 class="article-card__title"><a href="${articleUrl(article)}">${article.title}</a></h3>
      ${size !== 'compact' ? `<p class="article-card__excerpt">${article.excerpt}</p>` : ''}
      <p class="article-card__time">${toFa(article.readingTime)} دقیقه مطالعه</p>
    </div>
  </article>`;
}

/* ---------- journal.html ---------- */
function renderJournal() {
  const root = $('[data-journal]');
  if (!root) return;
  const tabs = $('[data-journal-tabs]');
  const list = $('[data-journal-list]');
  const all = sorted();
  let active = getParam('category') && ARTICLE_CATEGORIES[getParam('category')] ? getParam('category') : 'all';

  tabs.innerHTML = `<ul class="category-tabs__list">${[['all', 'All'], ...Object.entries(ARTICLE_CATEGORIES)].map(([key, label]) => `
    <li><button type="button" class="category-tab" data-journal-cat="${key}" aria-pressed="${key === active}"><span lang="en">${label}</span>
      <span class="category-tab__count">${toFa(key === 'all' ? all.length : all.filter((a) => a.category === key).length)}</span></button></li>`).join('')}</ul>`;

  const render = () => {
    const items = active === 'all' ? all : all.filter((a) => a.category === active);
    const [feature, ...rest] = items;
    list.innerHTML = feature ? `
      <div class="journal-feature">${articleCard(feature, { size: 'feature' })}</div>
      <div class="journal-grid">${rest.map((a, i) => articleCard(a, { index: i })).join('')}</div>` : '';
    $$('[data-journal-cat]', tabs).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.journalCat === active)));
    const url = new URL(window.location.href);
    if (active === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', active);
    history.replaceState(null, '', url);
  };

  tabs.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-journal-cat]');
    if (!btn) return;
    active = btn.dataset.journalCat;
    list.classList.add('is-updating');
    setTimeout(() => { render(); list.classList.remove('is-updating'); }, 160);
  });
  render();
}

/* ---------- article.html?slug= ---------- */
function block(b) {
  switch (b.type) {
    case 'h2': return `<h2>${b.text}</h2>`;
    case 'quote': return `<blockquote class="pull-quote"><p>${b.text}</p></blockquote>`;
    case 'list': return `<ul class="dash-list">${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    case 'image': return `<figure class="article-figure"><div class="media">${imgTag(b.image, { ratio: 0.66, sizes: '(max-width: 767px) 100vw, 900px' })}</div><figcaption>${b.caption}</figcaption></figure>`;
    case 'products': return `
      <aside class="shop-the-story" aria-label="محصولات این مقاله">
        <p class="eyebrow" lang="en">Shop the story</p>
        <ul>${b.items.map(getProduct).filter(Boolean).map((p) => `
          <li><a href="product.html?product=${p.slug}">
            <span class="media">${imgTag(p.images[0], { sizes: '160px' })}</span>
            <span lang="en">${p.name}</span><span class="shop-the-story__price">${formatPrice(p.price)}</span>
          </a></li>`).join('')}</ul>
      </aside>`;
    default: return `<p>${b.text}</p>`;
  }
}

function renderArticle() {
  const root = $('[data-article-root]');
  if (!root) return;
  const article = getArticle(getParam('slug') || articles[0].slug);
  if (!article) {
    document.title = 'مقاله پیدا نشد — VĀNE';
    root.innerHTML = `
      <section class="container empty-state empty-state--page">
        <p class="eyebrow" lang="en">404 — Journal</p>
        <h1 class="display-m" lang="en">Story not found.</h1>
        <p>مقاله‌ای با این نشانی پیدا نشد.</p>
        <a class="button" href="journal.html"><span lang="en">Back to journal</span></a>
      </section>`;
    return;
  }

  const url = articleUrl(article);
  setMeta({ title: `${article.title} | ژورنال VĀNE`, description: article.excerpt, path: url, image: imageUrl(article.hero, 1200, 0.66) });

  const related = sorted()
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  root.innerHTML = `
  <article class="article">
    <header class="article-hero container">
      <nav class="breadcrumbs" aria-label="مسیر صفحه">
        <ol>
          <li><a href="index.html">خانه</a></li>
          <li><a href="journal.html">ژورنال</a></li>
          <li><a href="journal.html?category=${article.category}" lang="en">${ARTICLE_CATEGORIES[article.category]}</a></li>
        </ol>
      </nav>
      <p class="article-hero__meta">
        <a class="article-hero__cat" href="journal.html?category=${article.category}" lang="en">${ARTICLE_CATEGORIES[article.category]}</a>
        <time datetime="${article.date}">${formatDate(article.date)}</time>
        <span>${toFa(article.readingTime)} دقیقه مطالعه</span>
      </p>
      <h1 class="article-hero__title" data-split>${article.title}</h1>
      <p class="article-hero__excerpt">${article.excerpt}</p>
    </header>
    <div class="article-hero__media media">${imgTag(article.hero, { ratio: 0.56, sizes: '100vw', eager: true })}</div>
    <div class="article-body container">
      <aside class="article-body__aside">
        <p class="eyebrow" lang="en">Words</p>
        <p>${article.author}</p>
      </aside>
      <div class="article-body__content prose">${article.content.map(block).join('')}</div>
    </div>
  </article>

  <section class="section container related-articles" aria-labelledby="related-articles-title">
    <div class="section-head">
      <h2 class="section-head__title" id="related-articles-title"><span lang="en">Continue reading</span></h2>
      <a class="text-link" href="journal.html"><span lang="en">All stories</span>${icon('arrow', 'icon--dir')}</a>
    </div>
    <div class="journal-grid journal-grid--three">${related.map((a, i) => articleCard(a, { index: i })).join('')}</div>
  </section>`;

  setJsonLd('ld-article', {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl(article.hero, 1200, 0.66)],
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'fa-IR',
    articleSection: ARTICLE_CATEGORIES[article.category],
    author: { '@type': 'Organization', name: 'VĀNE' },
    publisher: { '@type': 'Organization', name: 'VĀNE', logo: { '@type': 'ImageObject', url: `${SITE_URL}assets/icons/logo-mark-obsidian.svg` } },
    mainEntityOfPage: SITE_URL + url
  });
  setJsonLd('ld-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'ژورنال', item: `${SITE_URL}journal.html` },
      { '@type': 'ListItem', position: 3, name: article.title, item: SITE_URL + url }
    ]
  });
}

/* ---------- Home teaser ---------- */
function renderTeaser() {
  const root = $('[data-journal-teaser]');
  if (!root) return;
  const [first, second, third] = sorted();
  root.innerHTML = `
    <div class="journal-teaser__lead">${articleCard(first, { size: 'feature' })}</div>
    <div class="journal-teaser__side">${articleCard(second, { size: 'compact' })}${articleCard(third, { size: 'compact', index: 1 })}</div>`;
}

function initJournal() {
  renderJournal();
  renderArticle();
  renderTeaser();
}

Object.assign(V, { initJournal, articleCard });
})(window.VANE = window.VANE || {});
