/**
 * Insights (case studies) and credibility (testimonials) rendering from /data.
 * Phase 1 only needs the Home strips; Phase 5 adds the listing and detail pages on top of this.
 *
 * Publishing rules (CLAUDE.md sections 5 and 13):
 *  - Nothing renders unless `published` is true.
 *  - Entries flagged `sample` render only when config.flags.showSamples is true.
 *  - `client-approved` entries need `consentRef` and `approvedBy`, otherwise they are refused (warning logged).
 *  - Default disclosure is anonymous: no client names, logos or identifying details are ever rendered.
 */
import { config } from './config.js';
import { rel } from './components.js';

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

export function isPublishableCaseStudy(e) {
  if (!e || e.published !== true) return false;
  if (e.sample && !config.flags.showSamples) return false;
  if (e.disclosure === 'client-approved' && !(e.consentRef && e.approvedBy)) {
    console.warn(`[narris] case study "${e.slug}" refused: client-approved needs consentRef and approvedBy.`);
    return false;
  }
  return ['anonymous', 'client-approved', 'redacted'].includes(e.disclosure);
}

export function isPublishableTestimonial(t) {
  if (!t || t.published !== true || !t.quote) return false;
  if (t.sample && !config.flags.showSamples) return false;
  if (!t.sample && !t.consentRef) {
    console.warn('[narris] testimonial refused: missing consentRef.');
    return false;
  }
  return true;
}

function renderInsights(section, entries) {
  const list = section.querySelector('[data-insights-list]');
  list.innerHTML = entries.slice(0, 3).map((e) => `
    <li class="reveal">
      <a href="${rel('/case-study.html')}?slug=${encodeURIComponent(e.slug)}" class="card-lift group flex h-full flex-col border border-azure/15 bg-white p-7">
        <p class="eyebrow">${esc(e.sector)}${e.sample ? ' &middot; Sample' : ''}</p>
        <h3 class="mt-3 font-serif text-2xl leading-snug">${esc(e.title)}</h3>
        <p class="mt-3 text-azure/75">${esc(e.summary)}</p>
        <span class="link-arrow mt-6 self-start">Read more <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>
      </a>
    </li>`).join('');
  section.hidden = false;
}

function renderTestimonials(section, items) {
  const list = section.querySelector('[data-testimonials-list]');
  list.innerHTML = items.slice(0, 3).map((t) => `
    <li class="reveal">
      <figure class="h-full border-l-2 border-azure pl-6">
        <blockquote class="font-serif text-xl leading-relaxed">&ldquo;${esc(t.quote)}&rdquo;</blockquote>
        <figcaption class="mt-4 text-sm text-azure/70">${esc(t.name)}${t.role ? `, ${esc(t.role)}` : ''}${t.organisation ? `, ${esc(t.organisation)}` : ''}${t.sample ? ' (sample)' : ''}</figcaption>
      </figure>
    </li>`).join('');
  list.parentElement.hidden = false;
}

function renderCredentials(box, items) {
  box.querySelector('[data-credentials-list]').innerHTML = items.map((c) => `<li class="border border-azure/15 px-4 py-2 text-sm">${esc(c)}</li>`).join('');
  box.hidden = false;
}

/** Home page: fills Insights and Credibility, hiding each section when it has nothing publishable. */
export async function initHomeCredibility() {
  const insights = document.getElementById('insights');
  const cred = document.getElementById('credibility');

  if (insights) {
    const studies = (await loadJSON('data/case-studies.json')).filter(isPublishableCaseStudy);
    if (studies.length) renderInsights(insights, studies);
  }
  if (cred) {
    const quotes = (await loadJSON('data/testimonials.json')).filter(isPublishableTestimonial);
    const creds = config.credentials || [];
    if (quotes.length) renderTestimonials(cred.querySelector('[data-testimonials]'), quotes);
    if (creds.length) renderCredentials(cred.querySelector('[data-credentials]'), creds);
    if (quotes.length || creds.length) cred.hidden = false;
  }
  // Reveals for freshly inserted items.
  document.querySelectorAll('#insights .reveal, #credibility .reveal').forEach((el) => {
    requestAnimationFrame(() => el.classList.add('is-visible'));
  });
}
