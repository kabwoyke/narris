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

/* ---------- Strategic philosophy chain: Clarity -> Outcomes ---------- */
function initChain() {
  const root = document.getElementById('chain');
  if (!root) return;
  const buttons = [...root.querySelectorAll('.chain-btn')];
  const select = (btn) => {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute('aria-expanded', String(on));
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'ArrowDown' && k !== 'ArrowUp') return;
      e.preventDefault();
      const next = buttons[(i + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length];
      next.focus();
      select(next);
    });
  });
  select(buttons[0]);
}

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
