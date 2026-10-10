/**
 * Entry point for every page. Injects shared components, then loads only the
 * modules the current page needs.
 */
import { config } from './config.js';
import { initComponents, bindConfig, rel } from './components.js';

initComponents();

/* ---------- Scroll reveals ---------- */
function initReveals() {
  const items = [...document.querySelectorAll('.reveal')];
  if (!items.length) return;
  // Stagger siblings inside a [data-stagger] group.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 90}ms`));
  });
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

/* ---------- "The gap we close": tap/keyboard also lights a pair ---------- */
function initGap() {
  const rows = document.querySelectorAll('.gap-row');
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      const lit = row.classList.contains('is-lit');
      rows.forEach((r) => r.classList.remove('is-lit'));
      if (!lit) row.classList.add('is-lit');
    });
  });
}

/* ---------- Strategic philosophy chain: Clarity -> Outcomes ----------
   Each step is typed out letter by letter. The sentences cycle automatically (looping) until the visitor
   picks a step themselves; reduced motion shows the full sentence with no typing or cycling. */
function initChain() {
  const root = document.getElementById('chain');
  if (!root) return;
  const buttons = [...root.querySelectorAll('.chain-btn')];
  const panel = root.querySelector('[aria-live]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 38;       // ms per character
  const HOLD = 2600;      // ms the finished sentence stays before the next one
  let timer = 0;
  let auto = !reduce;     // stops for good once the visitor interacts
  let current = 0;

  // Rebuild each sentence as: invisible ghost (reserves height), typed overlay, screen-reader text.
  const paras = buttons.map((b) => {
    const p = document.getElementById(b.getAttribute('aria-controls'));
    const text = p.textContent.trim();
    p.classList.add('relative');
    p.innerHTML = `<span class="invisible" aria-hidden="true">${text}</span><span class="absolute inset-0" aria-hidden="true"><span class="tw"></span></span><span class="sr-only">${text}</span>`;
    return { p, text, out: p.querySelector('.tw') };
  });

  // The panel's left rule is the typewriter cursor: at rest it is the full-height rule; while typing it shrinks to
  // one line and travels along the end of the typed text, then blinks while the finished sentence is held.
  const cursor = document.createElement('span');
  cursor.className = 'chain-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  panel.append(cursor);
  const rest = () => { cursor.dataset.mode = 'rest'; cursor.style.transform = ''; cursor.style.height = ''; };
  const place = (i, n) => {
    const { p, out } = paras[i];
    const pr = panel.getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 40;
    let x; let y;
    const node = out.firstChild;
    if (n > 0 && node) {
      const range = document.createRange();
      range.setStart(node, n - 1); range.setEnd(node, n);
      const rects = range.getClientRects();
      const r = rects[rects.length - 1];
      x = r.right - pr.left + 3;
      y = r.top + r.height / 2 - lh / 2 - pr.top;
    } else {
      const o = out.getBoundingClientRect();
      x = o.left - pr.left - 3;
      y = o.top - pr.top;
    }
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    cursor.style.height = `${lh}px`;
  };

  const type = (i, done) => {
    const { text, out } = paras[i];
    clearTimeout(timer);
    if (reduce) { out.textContent = text; rest(); return; }
    out.textContent = '';
    cursor.dataset.mode = 'typing';
    place(i, 0);
    let n = 0;
    const tick = () => {
      out.textContent = text.slice(0, ++n);
      place(i, n);
      if (n < text.length) timer = setTimeout(tick, SPEED);
      else if (done) { cursor.dataset.mode = 'hold'; done(); }
      else rest(); // visitor-driven: cursor settles back into the left rule
    };
    timer = setTimeout(tick, 250);
  };

  const select = (i, { announce = true } = {}) => {
    current = i;
    panel.setAttribute('aria-live', announce ? 'polite' : 'off'); // no chatter while auto-cycling
    buttons.forEach((b, k) => {
      const on = k === i;
      b.setAttribute('aria-expanded', String(on));
      paras[k].p.hidden = !on;
    });
    type(i, auto ? () => { timer = setTimeout(() => auto && select((i + 1) % buttons.length, { announce: false }), HOLD); } : null);
  };

  buttons.forEach((b, i) => {
    b.addEventListener('click', () => { auto = false; select(i); });
    b.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'ArrowDown' && k !== 'ArrowUp') return;
      e.preventDefault();
      auto = false;
      const n = (i + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length;
      buttons[n].focus();
      select(n);
    });
  });

  // Start typing when the section scrolls into view; pause the cycle while it is off-screen.
  select(0, { announce: false });
  if (auto && 'IntersectionObserver' in window) {
    clearTimeout(timer);
    paras[0].out.textContent = '';
    new IntersectionObserver(([en]) => {
      if (!auto) return;
      if (en.isIntersecting) { select(current, { announce: false }); }
      else clearTimeout(timer);
    }, { threshold: 0.5 }).observe(root);
  }
}

/* ---------- Home section images (sources live in config.images.sections) ---------- */
function renderSectionImages() {
  const widths = [480, 800, 1200, 1800];
  const set = (src, fmt) => widths.map((w) => `${src}?auto=format&fit=crop&q=68&w=${w}${fmt ? `&fm=${fmt}` : ''} ${w}w`).join(', ');
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  document.querySelectorAll('[data-section-img]').forEach((fig) => {
    const img = config.images.sections?.[fig.dataset.sectionImg];
    if (!img) { fig.remove(); return; }
    const sizes = '(min-width: 1024px) 76rem, 100vw';
    const web = img.src.includes('images.unsplash.com');
    fig.innerHTML = web
      ? `<picture><source type="image/webp" srcset="${set(img.src, 'webp')}" sizes="${sizes}"><img src="${img.src}?auto=format&fit=crop&q=68&w=1200" srcset="${set(img.src)}" sizes="${sizes}" alt="${esc(img.alt)}" loading="lazy" decoding="async"></picture>`
      : `<picture><img src="${img.src}" alt="${esc(img.alt)}" loading="lazy" decoding="async"></picture>`;
  });
}
renderSectionImages();

/* ---------- "In progress" stub pages (replaced phase by phase) ---------- */
function renderStub() {
  const main = document.querySelector('main[data-stub]');
  if (!main) return;
  const c = config.contact;
  main.innerHTML = `
    <section class="bg-azure pb-20 pt-40 text-white">
      <div class="container-x">
        <p class="eyebrow">In progress</p>
        <h1 class="h-display mt-4 max-w-3xl !text-white">${main.dataset.stub}</h1>
        <p class="lead mt-6 max-w-xl">This page is being prepared. In the meantime, you are welcome to get in touch directly.</p>
      </div>
    </section>
    <section class="section">
      <div class="container-x grid gap-10 md:grid-cols-3">
        <div><h2 class="font-serif text-xl">Call</h2><p class="mt-2"><a class="underline decoration-azure/40 underline-offset-4" href="tel:${c.phoneIntl}">${c.phone}</a></p></div>
        <div><h2 class="font-serif text-xl">WhatsApp</h2><p class="mt-2"><a class="underline decoration-azure/40 underline-offset-4" target="_blank" rel="noopener" href="${c.whatsapp}">Start a chat</a></p></div>
        <div><h2 class="font-serif text-xl">Email</h2><p class="mt-2 break-all"><a class="underline decoration-azure/40 underline-offset-4" href="mailto:${c.email}">${c.email}</a></p></div>
      </div>
      <div class="container-x mt-12"><a class="link-arrow" href="${rel('/')}">Back to home</a></div>
    </section>`;
}

/* ---------- Boot ---------- */
renderStub();
bindConfig();
initReveals();
initGap();
initChain();

// Page-specific modules, loaded only when their anchor exists.
if (document.getElementById('hero')) import('./hero.js').then((m) => m.initHero());
if (document.getElementById('insights') || document.getElementById('credibility')) {
  import('./case-studies.js').then((m) => m.initHomeCredibility());
}
if (document.querySelector('form[data-narris-form]')) import('./forms.js').then((m) => m.initForms());

/* ---------- Services: highlight the anchor-nav link of the section in view ---------- */
function initServiceNav() {
  const links = [...document.querySelectorAll('.svc-link')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      map.get(e.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}
initServiceNav();

/* ---------- Contact: social links, shown only for accounts set in config.contact.social ---------- */
function initSocial() {
  const box = document.querySelector('[data-social]');
  if (!box) return;
  const names = { linkedin: 'LinkedIn', x: 'X', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' };
  const links = Object.entries(config.contact.social || {}).filter(([, url]) => url);
  if (!links.length) return;
  box.querySelector('[data-social-list]').innerHTML = links.map(([k, url]) => `<a class="underline decoration-azure/40 underline-offset-4" target="_blank" rel="noopener" href="${url}">${names[k] || k}</a>`).join('');
  box.hidden = false;
}
initSocial();

/* ---------- PWA: register the service worker (needs https or localhost) ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch((err) => console.warn('[narris] service worker not registered:', err.message)));
}
