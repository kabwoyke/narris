/**
 * Our Team and Testimonials pages (phase 7), rendered from /data/team.json and /data/testimonials.json.
 *
 * Publishing rules (CLAUDE.md sections 5 and 13):
 *  - Nothing renders unless `published` is true.
 *  - Entries flagged `sample` render only when config.flags.showSamples is true.
 *  - Testimonials also need a `consentRef` (documented consent), enforced by isPublishableTestimonial.
 *  - Empty states are calm and never say "coming soon".
 */
import { config } from './config.js';
import { isPublishableTestimonial } from './case-studies.js';

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

const reveal = (root) => root.querySelectorAll('.reveal').forEach((el) => requestAnimationFrame(() => el.classList.add('is-visible')));
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const para = (t) => esc(t).split(/\n+/).map((p) => `<p class="mt-3 text-azure/80">${p}</p>`).join('');

export function isPublishableMember(m) {
  if (!m || m.published !== true || !m.name || !m.role) return false;
  return !(m.sample && !config.flags.showSamples);
}

function memberCard(m) {
  // Photo is optional; a monogram keeps cards consistent without one.
  const media = m.photo
    ? `<img src="${esc(m.photo)}" alt="${esc(m.photoAlt || `Portrait of ${m.name}`)}" width="400" height="480" loading="lazy" class="aspect-[5/6] w-full object-cover">`
    : `<div class="flex aspect-[5/6] w-full items-center justify-center bg-warm font-serif text-5xl text-azure/60" aria-hidden="true">${esc(initials(m.name))}</div>`;
  return `
    <li class="reveal">
      <article class="card-lift h-full overflow-hidden border border-azure/15 bg-white">
        ${media}
        <div class="p-6">
          <h2 class="font-serif text-2xl">${esc(m.name)}${m.sample ? ' <span class="text-sm text-azure/60">(sample)</span>' : ''}</h2>
          <p class="eyebrow mt-2">${esc(m.role)}</p>
          ${m.bio ? para(m.bio) : ''}
        </div>
      </article>
    </li>`;
}

export async function initTeam() {
  const page = document.querySelector('[data-team-page]');
  if (!page) return;
  const members = (await loadJSON('data/team.json')).filter(isPublishableMember).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (!members.length) { page.querySelector('[data-empty]').hidden = false; return; }
  const list = page.querySelector('[data-list]');
  list.innerHTML = members.map(memberCard).join('');
  reveal(list);
}

export async function initTestimonials() {
  const page = document.querySelector('[data-testimonials-page]');
  if (!page) return;
  const quotes = (await loadJSON('data/testimonials.json')).filter(isPublishableTestimonial);
  if (!quotes.length) { page.querySelector('[data-empty]').hidden = false; return; }
  const list = page.querySelector('[data-list]');
  list.innerHTML = quotes.map((t) => `
    <li class="reveal">
      <figure class="h-full border-l-2 border-azure pl-6">
        <blockquote class="font-serif text-2xl leading-relaxed">&ldquo;${esc(t.quote)}&rdquo;</blockquote>
        <figcaption class="mt-4 text-sm text-azure/70">${esc(t.name)}${t.role ? `, ${esc(t.role)}` : ''}${t.organisation ? `, ${esc(t.organisation)}` : ''}${t.sample ? ' (sample)' : ''}</figcaption>
      </figure>
    </li>`).join('');
  reveal(list);
}
