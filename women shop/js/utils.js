/* Shared helpers — no side effects on import. */
(function (V) {
'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const faNumber = new Intl.NumberFormat('fa-IR');
const faDigits = new Intl.NumberFormat('fa-IR', { useGrouping: false });

const formatPrice = (value) => `${faNumber.format(value)} تومان`;
const toFa = (value) => faDigits.format(value);
/** Two-digit index in Persian numerals: 1 → ۰۱ */
const pad = (value) => String(value).padStart(2, '0').replace(/\d/g, (d) => toFa(d));

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(iso));
  } catch {
    return iso;
  }
}

const getParam = (key) => new URLSearchParams(window.location.search).get(key);

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

/** localStorage wrapper that never throws (private mode, blocked storage). */
const storage = {
  get(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — state lives for this page view only */
    }
  }
};

/** Add a state class on the next style recalculation so CSS transitions run (no rAF dependency). */
function nextFrameClass(el, className) {
  void el.offsetWidth;
  el.classList.add(className);
}

const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

function debounce(fn, wait = 160) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const icon = (name, className = '') =>
  `<svg class="icon icon-${name} ${className}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

/** Polite screen-reader announcement + visual toast. */
function announce(message, { toast = true } = {}) {
  const live = document.getElementById('live-region');
  if (live) {
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 40);
  }
  if (!toast) return;
  const el = document.getElementById('toast');
  if (!el) return;
  el.querySelector('[data-toast-text]').textContent = message;
  el.classList.add('is-visible');
  clearTimeout(announce.timer);
  announce.timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keep keyboard focus inside a dialog. Returns a release function. */
function trapFocus(container) {
  const handler = (event) => {
    if (event.key !== 'Tab') return;
    const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

/** Lock page scroll while overlays are open (reference counted). */
let locks = 0;
function lockScroll(lock) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  document.documentElement.classList.toggle('is-locked', locks > 0);
}

/** Inject or replace a JSON-LD block by id. */
function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.append(script);
  }
  script.textContent = JSON.stringify(data);
}

const SITE_URL = 'https://vane.example/';

/** Update title, description, canonical and Open Graph tags for data-driven pages. */
function setMeta({ title, description, path, image }) {
  if (title) {
    document.title = title;
    $('meta[property="og:title"]')?.setAttribute('content', title);
  }
  if (description) {
    $('meta[name="description"]')?.setAttribute('content', description);
    $('meta[property="og:description"]')?.setAttribute('content', description);
  }
  if (path) {
    const url = SITE_URL + path;
    $('link[rel="canonical"]')?.setAttribute('href', url);
    $('meta[property="og:url"]')?.setAttribute('content', url);
  }
  if (image) $('meta[property="og:image"]')?.setAttribute('content', image);
}

Object.assign(V, { formatDate, escapeHTML, nextFrameClass, debounce, announce, trapFocus, lockScroll, setJsonLd, setMeta, $, $$, formatPrice, toFa, pad, getParam, storage, emit, prefersReducedMotion, icon, SITE_URL });
})(window.VANE = window.VANE || {});
