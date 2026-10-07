/**
 * Home hero carousel (CLAUDE.md section 8).
 * Five slides from config.hero.slides, client wording used verbatim.
 * - Auto-advance ~7s with a thin progress bar; pauses on focus, off-screen, hidden tab.
 * - Cross-fade + slide-up text, swipe (pointer events), arrow keys, prev/next, numbered tabs, pause button.
 * - Slide 1 shows an inline-SVG "alignment" motif driven by the Web Animations API.
 * - Emits `hero:change` ({detail:{index, id}}) so network.js can hide itself on slide 1.
 */
import { config } from './config.js';
import { rel } from './components.js';
import { initNetwork } from './network.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- images ---------- */

const isUnsplash = (src) => src.includes('images.unsplash.com');
const WIDTHS = [640, 1024, 1600, 2200];
const unsplashSet = (src, fmt) =>
  WIDTHS.map((w) => `${src}?auto=format&fit=crop&q=68&w=${w}${fmt ? `&fm=${fmt}` : ''} ${w}w`).join(', ');

function pictureHTML(img, { eager }) {
  const sizes = '100vw';
  const base = `alt="${esc(img.alt)}" width="${img.width}" height="${img.height}" decoding="async" ${
    eager ? 'fetchpriority="high"' : 'loading="lazy"'
  }`;
  if (!isUnsplash(img.src)) return `<picture><img src="${img.src}" ${base}></picture>`;
  return `<picture>
    <source type="image/webp" srcset="${unsplashSet(img.src, 'webp')}" sizes="${sizes}">
    <img src="${img.src}?auto=format&fit=crop&q=68&w=1600" srcset="${unsplashSet(img.src)}" sizes="${sizes}" ${base}>
  </picture>`;
}

/* ---------- slide 1: alignment motif ---------- */

const SVGNS = 'http://www.w3.org/2000/svg';
const MOTIF = { w: 640, h: 520, cards: 6, cy: 260, rayH: 3 };

/** Builds the stack of translucent cards with grids of holes. Returns {svg, cards, ray, glow}. */
function buildMotif() {
  const { w, h, cards: n, cy } = MOTIF;
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('class', 'h-auto w-full');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  svg.innerHTML = `
    <defs>
      <linearGradient id="ray-grad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#ebe6e4" stop-opacity="0"/>
        <stop offset=".12" stop-color="#f1eeec" stop-opacity=".95"/>
        <stop offset="1" stop-color="#ebe6e4" stop-opacity="1"/>
      </linearGradient>
      <filter id="ray-blur" x="-5%" y="-300%" width="110%" height="700%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <g id="motif-ray">
      <rect class="glow" x="0" y="${cy - 5}" width="${w}" height="10" fill="#ebe6e4" opacity=".55" filter="url(#ray-blur)"/>
      <rect class="core" x="0" y="${cy - MOTIF.rayH / 2}" width="${w}" height="${MOTIF.rayH}" fill="url(#ray-grad)"/>
    </g>
    <g id="motif-cards"></g>`;

  const g = svg.querySelector('#motif-cards');
  const cardEls = [];
  for (let i = 0; i < n; i++) {
    const s = 0.8 + i * 0.07; // perspective: later cards are a touch larger
    const cw = 84 * s, ch = 330 * s;
    const x = 22 + i * 100 + (i * (s - 0.8) * 20);
    const y = cy - ch / 2;
    // Hole grid: 3 columns x 5 rows. The middle row sits exactly on the light ray.
    const holes = [];
    for (let r = -2; r <= 2; r++) {
      for (let c = -1; c <= 1; c++) {
        const hx = x + cw / 2 + c * 22 * s;
        const hy = cy + r * 56 * s;
        const rx = 6.5 * s, ry = 12 * s;
        // Evenodd ellipse sub-path (two arcs) punches a hole through the card.
        holes.push(`M${hx - rx} ${hy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`);
      }
    }
    const gEl = document.createElementNS(SVGNS, 'g');
    gEl.dataset.card = String(i);
    gEl.dataset.x = String(x);
    gEl.innerHTML = `<path fill-rule="evenodd" fill="#ebe6e4" fill-opacity="${0.07 + i * 0.012}" stroke="#ebe6e4" stroke-opacity="${0.28 + i * 0.04}" stroke-width="1"
      d="M${x + 6} ${y}h${cw - 12}a6 6 0 0 1 6 6v${ch - 12}a6 6 0 0 1-6 6h${-(cw - 12)}a6 6 0 0 1-6-6v${-(ch - 12)}a6 6 0 0 1 6-6z ${holes.join(' ')}"/>`;
    g.append(gEl);
    cardEls.push(gEl);
  }
  return { svg, cards: cardEls, ray: svg.querySelector('#motif-ray') };
}

/** Wires the looping drift-out / slide-back timeline (about 10s). Returns a play/pause controller. */
function animateMotif({ cards, ray }) {
  if (reduceMotion.matches) return { play() {}, pause() {} }; // aligned static state
  const D = 10000;
  const ease = 'cubic-bezier(.45,0,.2,1)';
  const opts = { duration: D, iterations: Infinity };
  // Card 2 drifts down, card 4 drifts up; the ray stops at the first card that is out of line.
  const blockedAt = Number(cards[2].dataset.x) / MOTIF.w;
  const anims = [
    cards[2].animate([
      { transform: 'translateY(0)', offset: 0.2, easing: ease },
      { transform: 'translateY(34px)', offset: 0.33 },
      { transform: 'translateY(34px)', offset: 0.58, easing: ease },
      { transform: 'translateY(0)', offset: 0.74 },
      { transform: 'translateY(0)', offset: 1 },
    ], opts),
    cards[4].animate([
      { transform: 'translateY(0)', offset: 0.23, easing: ease },
      { transform: 'translateY(-26px)', offset: 0.36 },
      { transform: 'translateY(-26px)', offset: 0.6, easing: ease },
      { transform: 'translateY(0)', offset: 0.76 },
      { transform: 'translateY(0)', offset: 1 },
    ], opts),
  ];
  ray.style.transformOrigin = '0 0';
  anims.push(ray.animate([
    { transform: 'scaleX(1)', offset: 0.2, easing: ease },
    { transform: `scaleX(${blockedAt})`, offset: 0.33 },
    { transform: `scaleX(${blockedAt})`, offset: 0.58, easing: ease },
    { transform: 'scaleX(1)', offset: 0.78 },
    { transform: 'scaleX(1)', offset: 1 },
  ], opts));
  anims.forEach((a) => a.pause());
  return {
    play: () => anims.forEach((a) => a.play()),
    pause: () => anims.forEach((a) => a.pause()),
  };
}

/* ---------- slide 4: concentric insight rings ---------- */

const ringsSVG = () => `
  <svg class="rings h-auto w-full" viewBox="0 0 600 600" aria-hidden="true" focusable="false" fill="none" stroke="#ebe6e4">
    ${[56, 112, 168, 224, 280].map((r, k) => `<circle style="--k:${k}" cx="300" cy="300" r="${r}" stroke-opacity="${0.5 - k * 0.07}" stroke-width="${k === 0 ? 1.6 : 1}"/>`).join('')}
    <circle cx="300" cy="300" r="5" fill="#ebe6e4" stroke="none"/>
  </svg>`;

/* ---------- build ---------- */

const ARROW = '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const CHEV = (d) => `<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

/** Resolve the tagline slide, which takes its text from config.brand.tagline. */
function resolveSlides() {
  return config.hero.slides.map((s) => ({
    ...s,
    tab: s.tab ?? config.brand.tagline.replace(/[.…]+$/, ''),
    headline: s.headline ?? config.brand.tagline,
  }));
}

export function initHero() {
  const root = document.getElementById('hero');
  const slides = resolveSlides();
  const total = slides.length;
  const pad = (n) => String(n + 1).padStart(2, '0');
  const prerendered = !!root.querySelector('[data-prerender]'); // slide 1 text is already painted
  const motifSlideIdx = slides.findIndex((s) => s.visual === 'motif');
  let motif = null;

  /* Slide markup */
  const slideHTML = (s, i) => {
    const photo = s.visual === 'photo' || s.visual === 'rings';
    const img = photo && config.images[s.image];
    const hasVisual = s.visual === 'motif' || s.visual === 'rings';
    const long = s.headline.length > 90;
    const short = s.headline.length < 40;
    const size = short ? 'text-5xl sm:text-6xl lg:text-7xl' : long ? 'text-[1.9rem] sm:text-4xl lg:text-5xl' : 'text-4xl sm:text-5xl lg:text-[3.4rem]';
    const support = s.support.length > 1
      ? `<ul class="hero-anim mt-6 space-y-2 text-base text-azure-200 sm:text-lg" style="--i:2">${s.support.map((q) => `<li class="flex gap-3"><span aria-hidden="true" class="mt-[0.7em] h-px w-5 shrink-0 bg-azure-300"></span>${esc(q)}</li>`).join('')}</ul>`
      : s.support.length === 1
        ? `<p class="hero-anim mt-6 max-w-xl text-lg text-azure-200 sm:text-xl" style="--i:2">${esc(s.support[0])}</p>`
        : '';
    const bgClass = img ? '' : 'is-plain';
    const tag = i === 0 ? 'h1' : 'h2'; // first headline is the page h1
    return `
      <div class="hero-slide${i === 0 && prerendered ? ' no-intro' : ''}" id="hero-slide-${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${total}: ${esc(s.tab)}" data-id="${s.id}">
        <div class="hero-bg ${bgClass}">${img ? pictureHTML(img, { eager: i === 0 }) : ''}</div>
        ${hasVisual ? `<div class="pointer-events-none absolute inset-y-0 right-0 flex w-full items-center justify-end pr-0 opacity-25 sm:opacity-45 lg:w-[46%] lg:pr-6 lg:opacity-100" aria-hidden="true"><div class="w-[min(40rem,125%)] shrink-0 translate-x-[18%] lg:w-full lg:translate-x-0" data-visual="${s.visual}"></div></div>` : ''}
        <div class="container-x relative flex h-full items-center pb-36 pt-24 sm:pb-32">
          <div class="${hasVisual ? 'max-w-[40rem]' : 'max-w-3xl'}">
            <p class="eyebrow hero-anim" style="--i:0">${pad(i)} <span aria-hidden="true" class="mx-1.5 inline-block h-px w-6 translate-y-[-3px] bg-azure-300"></span> ${esc(s.tab)}</p>
            <${tag} class="hero-anim mt-5 font-serif font-normal leading-[1.12] !text-white ${size}" style="--i:1">${esc(s.headline)}</${tag}>
            ${support}
            <a class="btn btn-primary hero-anim mt-9" style="--i:3" href="${rel(s.cta.href)}" data-hero-cta>${esc(s.cta.label)} ${ARROW}</a>
          </div>
        </div>
      </div>`;
  };

  root.innerHTML = `
    <p class="sr-only">${esc(config.brand.name)}: ${esc(config.brand.metaDescriptor)}</p>
    <div id="hero-slides" class="absolute inset-0">${slides.map(slideHTML).join('')}</div>
    <canvas class="hero-canvas" aria-hidden="true"></canvas>
    <div class="absolute inset-x-0 bottom-0 z-10 pb-[4.75rem] md:pb-6">
      <div class="container-x flex items-end justify-between gap-6">
        <ol class="grid flex-1 grid-cols-5 gap-3 sm:gap-5 lg:max-w-[60rem]" aria-label="Slides">
          ${slides.map((s, i) => `<li><button type="button" class="hero-tab w-full" data-tab="${i}" aria-label="${pad(i)} ${esc(s.tab)}"><span class="bar" aria-hidden="true"><i></i></span><span aria-hidden="true">${pad(i)}</span><span aria-hidden="true" class="hidden truncate lg:inline">${esc(s.tab)}</span></button></li>`).join('')}
        </ol>
        <div class="flex shrink-0 items-center gap-1 text-white">
          <button type="button" class="p-2.5 transition hover:text-azure-200" data-prev aria-label="Previous slide">${CHEV('M12 4 6 10l6 6')}</button>
          <button type="button" class="p-2.5 transition hover:text-azure-200" data-toggle aria-label="Pause automatic slide rotation" aria-pressed="false"></button>
          <button type="button" class="p-2.5 transition hover:text-azure-200" data-next aria-label="Next slide">${CHEV('m8 4 6 6-6 6')}</button>
        </div>
      </div>
    </div>
    <a href="#positioning" class="scroll-cue absolute bottom-24 right-10 z-10 hidden flex-col items-center gap-3 text-[0.65rem] uppercase tracking-widest2 text-white/70 transition hover:text-white lg:flex" aria-label="Scroll to content"><span class="[writing-mode:vertical-rl]">Scroll</span><i></i></a>
    <p class="sr-only" id="hero-live" aria-live="polite" aria-atomic="true"></p>`;

  const slideEls = [...root.querySelectorAll('.hero-slide')];
  const tabEls = [...root.querySelectorAll('[data-tab]')];
  const toggleBtn = root.querySelector('[data-toggle]');
  const live = root.querySelector('#hero-live');
  const canvas = root.querySelector('.hero-canvas');

  /* Visuals: alignment motif (or supplied footage) and rings */
  root.querySelectorAll('[data-visual]').forEach((holder) => {
    if (holder.dataset.visual === 'rings') { holder.innerHTML = ringsSVG(); return; }
    const v = config.hero.heroVideo;
    if (v) {
      holder.innerHTML = `<video class="h-auto w-full" muted loop playsinline preload="metadata" poster="${v.poster || ''}" aria-hidden="true">
        ${v.webm ? `<source src="${v.webm}" type="video/webm">` : ''}${v.mp4 ? `<source src="${v.mp4}" type="video/mp4">` : ''}</video>`;
      return;
    }
    const m = buildMotif();
    holder.append(m.svg);
    motif = animateMotif(m);
  });
  const heroVideo = root.querySelector('video');

  /* State */
  let index = 0;
  let elapsed = 0;
  let last = performance.now();
  const hold = { user: reduceMotion.matches, focus: false, view: true };
  const interval = config.hero.intervalMs;
  const running = () => !hold.user && !hold.focus && hold.view && !document.hidden;

  const syncToggle = () => {
    const paused = hold.user;
    toggleBtn.setAttribute('aria-pressed', String(paused));
    toggleBtn.setAttribute('aria-label', paused ? 'Start automatic slide rotation' : 'Pause automatic slide rotation');
    toggleBtn.innerHTML = paused ? CHEV('M7 4.500v11l9-5.500z') : CHEV('M7 4v12M13 4v12');
  };

  const syncVisuals = () => {
    const onMotif = index === motifSlideIdx;
    const playing = onMotif && hold.view && !document.hidden;
    if (motif) (playing ? motif.play : motif.pause)();
    if (heroVideo) (playing && !reduceMotion.matches ? heroVideo.play().catch(() => {}) : heroVideo.pause());
  };

  function goTo(i, { user = false } = {}) {
    index = (i + total) % total;
    elapsed = 0;
    slideEls.forEach((el, k) => {
      const on = k === index;
      el.classList.toggle('is-active', on);
      el.inert = !on; // only the active slide is focusable
      el.setAttribute('aria-hidden', String(!on));
    });
    tabEls.forEach((t, k) => {
      if (k === index) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      t.style.setProperty('--p', '0');
    });
    if (user) live.textContent = `Slide ${index + 1} of ${total}: ${slides[index].tab}`;
    syncVisuals();
    root.dispatchEvent(new CustomEvent('hero:change', { detail: { index, id: slides[index].id } }));
  }

  /* Progress loop */
  function tick(now) {
    const dt = Math.min(now - last, 100);
    last = now;
    if (running()) {
      elapsed += dt;
      if (elapsed >= interval) goTo(index + 1);
      else tabEls[index].style.setProperty('--p', (elapsed / interval).toFixed(4));
    }
    requestAnimationFrame(tick);
  }

  /* Controls */
  root.querySelector('[data-prev]').addEventListener('click', () => goTo(index - 1, { user: true }));
  root.querySelector('[data-next]').addEventListener('click', () => goTo(index + 1, { user: true }));
  tabEls.forEach((t) => t.addEventListener('click', () => goTo(Number(t.dataset.tab), { user: true })));
  toggleBtn.addEventListener('click', () => { hold.user = !hold.user; syncToggle(); });

  // Pause-on-hover removed at the client's request. Focus still pauses; the pause button remains.
  root.addEventListener('focusin', () => { hold.focus = true; });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) hold.focus = false; });

  root.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, { user: true }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1, { user: true }); }
  });

  /* Touch / pen / mouse swipe via pointer events */
  const stage = root.querySelector('#hero-slides');
  stage.style.touchAction = 'pan-y';
  let sx = 0, sy = 0, tracking = false;
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; tracking = true; sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointercancel', () => { tracking = false; });
  stage.addEventListener('pointerup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(index + (dx < 0 ? 1 : -1), { user: true });
  });

  /* Off-screen / hidden tab pause */
  new IntersectionObserver(([en]) => { hold.view = en.isIntersecting; syncVisuals(); }, { threshold: 0.25 }).observe(root);
  document.addEventListener('visibilitychange', syncVisuals);
  reduceMotion.addEventListener('change', (m) => { if (m.matches) { hold.user = true; syncToggle(); } });

  /* Network canvas (hidden on the motif slide, off for reduced motion / low power) */
  // Deferred to idle time so it never competes with first paint.
  if (config.flags.showNetwork) {
    const start = () => initNetwork({ canvas, hero: root, hiddenOnSlide: motifSlideIdx });
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2000 }); else setTimeout(start, 1200);
  }

  syncToggle();
  goTo(0);
  // Swap prerendered slide 1 for the live one without a visible fade, then restore transitions.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-booting')));
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
}
