/**
 * Shared header, footer, sticky mobile bar, floating WhatsApp button and cookie notice scaffold.
 * Injected into #site-header and #site-footer. Pages carry a <noscript> fallback nav so they
 * stay readable without JS. All values come from config.js.
 */
import { config } from './config.js';

/* ---------- helpers ---------- */

/** Pages live in the site root, so root-absolute config hrefs are made relative.
 *  This keeps the site working on sub-path hosts (e.g. GitHub Pages project sites). */
export const rel = (href) => (href === '/' ? './' : href.replace(/^\//, ''));

const here = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const pathOf = (href) => rel(href).split('#')[0].split('?')[0].toLowerCase() || 'index.html';

const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), config);

const icon = {
  phone: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>',
  whatsapp: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.900 11.900 0 0 0 4.600 4c1.700.700 2.400.800 3.200.700a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.5-.3z"/></svg>',
  mail: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.500 7 8.500 6 8.500-6"/></svg>',
  chevron: '<svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m2 4 4 4 4-4"/></svg>',
  menu: '<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
};

/** The logo mark (large square with a notch, plus a small square), traced from the supplied logo. */
const logoMark = (cls = 'h-9 w-auto') =>
  `<svg class="${cls}" viewBox="0 0 1286 1130" aria-hidden="true" focusable="false" fill="currentColor"><path d="M0 82h937v241h197v807H0z"/><rect x="990" width="296" height="269"/></svg>`;

const logo = (extra = '') => `
  <a href="${rel('/')}" class="group inline-flex items-center gap-3 ${extra}" aria-label="${config.brand.name}, home">
    ${logoMark()}
    <span class="flex flex-col font-sans text-[0.68rem] font-semibold uppercase leading-[1.35] tracking-[0.32em]">
      <span>Narris</span><span>International</span>
    </span>
  </a>`;

/** Header logo: the white lockup over the dark hero, the supplied full-colour logo once the bar turns white (CSS swaps them on data-solid). */
const headerLogo = () => `
  <a href="${rel('/')}" class="group relative inline-flex items-center" aria-label="${config.brand.name}, home">
    <span class="logo-light inline-flex items-center gap-3">
      ${logoMark()}
      <span class="flex flex-col font-sans text-[0.68rem] font-bold uppercase leading-[1.35] tracking-[0.32em]"><span>Narris</span><span>International</span></span>
    </span>
    <img class="logo-dark h-14 w-auto" src="${rel('assets/logo/narris-logo-nav.png')}" width="720" height="633" alt="${config.brand.name}, strategy advisory">
  </a>`;

/* ---------- header ---------- */

function renderHeader() {
  const current = here();
  const isActive = (href) => pathOf(href) === current && !href.includes('#');

  const desktopItem = (item) => {
    if (!item.children) {
      return `<li><a class="nav-link" href="${rel(item.href)}" ${isActive(item.href) ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
    }
    const childActive = item.children.some((c) => isActive(c.href));
    return `
      <li class="relative" data-dropdown>
        <button type="button" class="nav-link" aria-expanded="false" aria-haspopup="true" aria-controls="dd-${item.label.replace(/\W+/g, '')}" ${childActive ? 'data-active="true"' : ''}>
          ${item.label} ${icon.chevron}
        </button>
        <ul id="dd-${item.label.replace(/\W+/g, '')}" class="invisible absolute left-0 top-full mt-1 min-w-[12rem] translate-y-1 rounded-xl border border-azure/10 bg-white py-2 opacity-0 shadow-xl transition duration-200 data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100" data-menu>
          ${item.children.map((c) => `<li><a class="block px-5 py-2.5 text-sm font-semibold text-azure transition hover:bg-warm" href="${rel(c.href)}" ${isActive(c.href) ? 'aria-current="page"' : ''}>${c.label}</a></li>`).join('')}
        </ul>
      </li>`;
  };

  const mobileItem = (item) => {
    if (!item.children) {
      return `<li><a class="block border-b border-white/10 py-4 font-serif text-2xl" href="${rel(item.href)}">${item.label}</a></li>`;
    }
    return `
      <li class="border-b border-white/10 py-4">
        <p class="font-serif text-2xl">${item.label}</p>
        <ul class="mt-3 space-y-1 pl-1">
          ${item.children.map((c) => `<li><a class="block py-1.5 text-base text-azure-200 hover:text-white" href="${rel(c.href)}">${c.label}</a></li>`).join('')}
        </ul>
      </li>`;
  };

  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <div class="site-header" data-solid="false">
      <div class="container-x flex h-[4.5rem] items-center justify-between gap-6">
        ${headerLogo()}
        <nav aria-label="Primary" class="hidden shrink-0 xl:block">
          <ul class="flex items-center gap-0.5">${config.nav.map(desktopItem).join('')}</ul>
        </nav>
        <div class="flex items-center gap-3">
          <a href="tel:${config.contact.phoneIntl}" class="hidden items-center gap-2 px-2 text-sm text-white/90 transition hover:text-white xl:inline-flex" aria-label="Call ${config.contact.phone}">
            ${icon.phone}
          </a>
          <a href="${rel(config.quoteCta.href)}" class="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">${config.quoteCta.label}</a>
          <button type="button" class="-mr-2 p-2 xl:hidden" id="menu-open" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-panel">${icon.menu}</button>
        </div>
      </div>
    </div>

    <div id="mobile-overlay" class="fixed inset-0 z-[60] bg-azure/60 opacity-0 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
    <div id="mobile-panel" role="dialog" aria-modal="true" aria-label="Menu" inert
         class="fixed inset-y-0 right-0 z-[70] flex w-[min(24rem,100%)] translate-x-full flex-col overflow-y-auto bg-azure px-6 pb-8 pt-5 text-white transition-transform duration-300 ease-calm">
      <div class="flex items-center justify-between">
        <span class="text-xs uppercase tracking-widest2 text-azure-300">Menu</span>
        <button type="button" class="-mr-2 p-2" id="menu-close" aria-label="Close menu">${icon.close}</button>
      </div>
      <nav aria-label="Mobile" class="mt-4">
        <ul>${config.nav.map(mobileItem).join('')}</ul>
      </nav>
      <div class="mt-8 space-y-3">
        <a href="${rel(config.quoteCta.href)}" class="btn btn-primary w-full">${config.quoteCta.label}</a>
        <a href="tel:${config.contact.phoneIntl}" class="btn btn-ghost w-full">${icon.phone} ${config.contact.phone}</a>
        <a href="${config.contact.whatsapp}" class="btn btn-ghost w-full" rel="noopener" target="_blank">${icon.whatsapp} WhatsApp</a>
      </div>
    </div>`;

  initHeaderBehaviour(el);
}

function initHeaderBehaviour(root) {
  const bar = root.querySelector('.site-header');
  // Transparent over the hero on Home, solid elsewhere.
  const transparentTop = document.body.dataset.header === 'transparent';
  const update = () => {
    bar.dataset.solid = !transparentTop || window.scrollY > 40 ? 'true' : 'false';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  /* Desktop dropdown */
  root.querySelectorAll('[data-dropdown]').forEach((dd) => {
    const btn = dd.querySelector('button');
    const menu = dd.querySelector('[data-menu]');
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      menu.dataset.open = String(open);
    };
    let t;
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    dd.addEventListener('mouseenter', () => { clearTimeout(t); set(true); });
    dd.addEventListener('mouseleave', () => { t = setTimeout(() => set(false), 160); });
    dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) set(false); });
    dd.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) set(false); });
  });

  /* Mobile panel: focus trap, Esc to close, scroll lock */
  const panel = root.querySelector('#mobile-panel');
  const overlay = root.querySelector('#mobile-overlay');
  const openBtn = root.querySelector('#menu-open');
  const closeBtn = root.querySelector('#menu-close');
  const focusable = () => [...panel.querySelectorAll('a[href], button')].filter((n) => !n.disabled);

  const open = () => {
    panel.removeAttribute('inert');
    panel.classList.remove('translate-x-full');
    panel.classList.add('shadow-2xl');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('pointer-events-auto');
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = (returnFocus = true) => {
    panel.setAttribute('inert', '');
    panel.classList.add('translate-x-full');
    panel.classList.remove('shadow-2xl');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('pointer-events-auto');
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    if (returnFocus) openBtn.focus();
  };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  overlay.addEventListener('click', () => close());
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close(false)));
  document.addEventListener('keydown', (e) => {
    if (panel.hasAttribute('inert')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = focusable();
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Close if the viewport grows past the mobile breakpoint.
  window.matchMedia('(min-width: 1280px)').addEventListener('change', (m) => { if (m.matches && !panel.hasAttribute('inert')) close(false); });
}

/* ---------- footer, mobile bar, floating button ---------- */

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const c = config.contact;
  const social = Object.entries(c.social).filter(([, v]) => v);
  const year = new Date().getFullYear();
  el.innerHTML = `
    <footer class="border-t border-white/10 bg-azure text-white">
      <div class="container-x grid gap-12 py-16 md:grid-cols-12">
        <div class="md:col-span-5">
          ${logo()}
          <p class="mt-6 max-w-sm text-sm leading-relaxed text-azure-200">${config.brand.metaDescriptor}</p>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-azure-300">Conversations with Narris are treated as confidential.</p>
        </div>
        <nav aria-label="Footer" class="md:col-span-3">
          <h2 class="font-sans text-xs font-medium uppercase tracking-widest2 !text-azure-300">Explore</h2>
          <ul class="mt-5 space-y-2.5 text-sm">
            ${config.footerLinks.map((l) => `<li><a class="text-azure-200 transition hover:text-white" href="${rel(l.href)}">${l.label}</a></li>`).join('')}
          </ul>
        </nav>
        <div class="md:col-span-4">
          <h2 class="font-sans text-xs font-medium uppercase tracking-widest2 !text-azure-300">Contact</h2>
          <ul class="mt-5 space-y-2.5 text-sm text-azure-200">
            <li><a class="transition hover:text-white" href="tel:${c.phoneIntl}">${c.phone}</a></li>
            <li><a class="transition hover:text-white" href="${c.whatsapp}" rel="noopener" target="_blank">WhatsApp</a></li>
            <li><a class="break-all transition hover:text-white" href="mailto:${c.email}">${c.email}</a></li>
            <li>${c.location}</li>
            ${c.address ? `<li>${c.address}</li>` : ''}
            ${c.hours ? `<li>${c.hours}</li>` : ''}
          </ul>
          <p class="mt-4 text-sm text-azure-300">${c.reachLine}</p>
          ${social.length ? `<ul class="mt-5 flex flex-wrap gap-4 text-sm">${social.map(([k, v]) => `<li><a class="capitalize text-azure-200 hover:text-white" href="${v}" rel="noopener" target="_blank">${k}</a></li>`).join('')}</ul>` : ''}
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="container-x flex flex-col gap-2 py-6 text-xs text-azure-300 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; ${year} ${config.brand.name}. All rights reserved.</p>
          <a class="hover:text-white" href="privacy.html">Privacy</a>
        </div>
      </div>
    </footer>`;
}

function renderConversion() {
  const c = config.contact;
  const mobile = document.createElement('div');
  mobile.className = 'fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-azure text-white md:hidden';
  mobile.setAttribute('role', 'navigation');
  mobile.setAttribute('aria-label', 'Quick contact');
  const cell = 'flex flex-col items-center justify-center gap-0.5 py-2.5 text-[0.7rem] font-medium tracking-wide transition active:bg-azure-700';
  mobile.innerHTML = `
    <a class="${cell}" href="tel:${c.phoneIntl}">${icon.phone}<span>Call</span></a>
    <a class="${cell} border-x border-white/10" href="${c.whatsapp}" rel="noopener" target="_blank">${icon.whatsapp}<span>WhatsApp</span></a>
    <a class="${cell}" href="mailto:${c.email}">${icon.mail}<span>Email</span></a>`;
  document.body.append(mobile);
  document.body.classList.add('has-mobile-bar');

  const fab = document.createElement('a');
  fab.href = c.whatsapp;
  fab.target = '_blank';
  fab.rel = 'noopener';
  fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.className = 'fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-azure text-white ring-1 ring-white/40 shadow-[0_10px_30px_-8px_rgba(22,43,58,0.6)] transition duration-300 hover:scale-105 md:flex';
  fab.innerHTML = icon.whatsapp.replace('width="20" height="20"', 'width="26" height="26"');
  document.body.append(fab);
}

/** Cookie notice scaffold. Hidden by flag until Phase 4 ships the privacy policy. */
function renderCookieNotice() {
  if (!config.flags.showCookieNotice) return;
  try { if (localStorage.getItem('narris-cookie-ack')) return; } catch { /* storage blocked */ }
  const n = document.createElement('div');
  n.setAttribute('role', 'region');
  n.setAttribute('aria-label', 'Cookie notice');
  n.className = 'fixed inset-x-4 bottom-20 z-50 mx-auto max-w-xl rounded-2xl bg-white p-5 text-sm text-azure shadow-2xl md:bottom-6 md:left-6 md:right-auto';
  n.innerHTML = `<p>This site uses only essential storage. See our <a class="underline" href="privacy.html">privacy notice</a>.</p>
    <button type="button" class="btn btn-dark mt-4 !py-2">Understood</button>`;
  n.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem('narris-cookie-ack', '1'); } catch { /* ignore */ }
    n.remove();
  });
  document.body.append(n);
}

/* ---------- config bindings ---------- */

/** Fills [data-cfg-*] attributes from config so contact details are defined once. */
export function bindConfig(root = document) {
  root.querySelectorAll('[data-cfg-text]').forEach((n) => { n.textContent = get(n.dataset.cfgText) ?? ''; });
  root.querySelectorAll('[data-cfg-tel]').forEach((n) => { n.href = `tel:${get(n.dataset.cfgTel)}`; });
  root.querySelectorAll('[data-cfg-mailto]').forEach((n) => { n.href = `mailto:${get(n.dataset.cfgMailto)}`; });
  root.querySelectorAll('[data-cfg-href]').forEach((n) => { n.href = get(n.dataset.cfgHref); });
  root.querySelectorAll('[data-cfg-show]').forEach((n) => { if (!get(n.dataset.cfgShow)) n.hidden = true; });
}

export function initComponents() {
  renderHeader();
  renderFooter();
  renderConversion();
  renderCookieNotice();
  bindConfig();
}
