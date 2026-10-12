/**
 * FAQs accordion (data/faqs.json) and Careers open roles (data/careers.json), phase 8.
 * Accordion: one button per question with aria-expanded / aria-controls; Enter and Space work natively,
 * Up/Down/Home/End move between questions. Entries render only when `published` is true.
 * Roles: `sample` entries render only when config.flags.showSamples is true; empty state is a calm note.
 */
import { config } from './config.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[narris] could not load ${path}:`, err.message);
    return [];
  }
}

const CHEVRON = '<svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="faq-chevron shrink-0 transition-transform duration-300"><path d="M3 6l5 5 5-5"/></svg>';

export async function initFaqs() {
  const page = document.querySelector('[data-faq-page]');
  if (!page) return;
  const items = (await loadJSON('data/faqs.json')).filter((f) => f.published === true && f.question && f.answer);
  const list = page.querySelector('[data-list]');
  if (!items.length) { list.hidden = true; return; }
  list.innerHTML = items.map((f, i) => `
    <div>
      <h3>
        <button type="button" id="faq-q-${i}" class="faq-btn flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${esc(f.question)}</span>${CHEVRON}
        </button>
      </h3>
      <div id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
        <p class="pb-6 text-lg leading-relaxed text-azure/85">${esc(f.answer)}</p>
      </div>
    </div>`).join('');

  const buttons = [...list.querySelectorAll('.faq-btn')];
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.querySelector('.faq-chevron').style.transform = open ? '' : 'rotate(180deg)';
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
    btn.addEventListener('keydown', (e) => {
      const to = { ArrowDown: (i + 1) % buttons.length, ArrowUp: (i - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      buttons[to].focus();
    });
  });
}

export async function initCareers() {
  const page = document.querySelector('[data-careers-page]');
  if (!page) return;
  const roles = (await loadJSON('data/careers.json')).filter((r) => r.published === true && r.title && !(r.sample && !config.flags.showSamples));
  if (!roles.length) { page.querySelector('[data-roles-empty]').hidden = false; return; }
  page.querySelector('[data-roles]').innerHTML = roles.map((r) => `
    <li class="border border-azure/15 bg-white p-6">
      <p class="eyebrow">${esc([r.type, r.location].filter(Boolean).join(' · '))}${r.sample ? ' · Sample' : ''}</p>
      <h3 class="mt-2 font-serif text-2xl">${esc(r.title)}</h3>
      ${r.summary ? `<p class="mt-3 text-azure/80">${esc(r.summary)}</p>` : ''}
    </li>`).join('');
}
