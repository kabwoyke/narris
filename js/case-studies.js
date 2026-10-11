/**
 * Insights (case studies) and credibility (testimonials) rendering from /data.
 * Home strips (phase 1), plus the Insights listing and single case study pages (phase 5).
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

const ARROW = '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

function card(e) {
  return `
    <li class="reveal">
      <a href="${rel('/case-study.html')}?slug=${encodeURIComponent(e.slug)}" class="card-lift group flex h-full flex-col border border-azure/15 bg-white p-7">
        <p class="eyebrow">${esc(e.sector)}${e.sample ? ' &middot; Sample' : ''}</p>
        <h3 class="mt-3 font-serif text-2xl leading-snug">${esc(e.title)}</h3>
        <p class="mt-3 text-azure/75">${esc(e.summary)}</p>
        <span class="link-arrow mt-6 self-start">Read more ${ARROW}</span>
      </a>
    </li>`;
}

function renderInsights(section, entries) {
  section.querySelector('[data-insights-list]').innerHTML = entries.slice(0, 3).map(card).join('');
  section.hidden = false;
}

const serviceName = (id) => config.services.find((s) => s.id === id)?.name || id;
const revealNew = (root) => root.querySelectorAll('.reveal').forEach((el) => requestAnimationFrame(() => el.classList.add('is-visible')));
const newestFirst = (a, b) => String(b.date).localeCompare(String(a.date));
const loadStudies = async () => (await loadJSON('data/case-studies.json')).filter(isPublishableCaseStudy).sort(newestFirst);

/** Insights listing: cards with sector and service filters. Shows a calm empty state when nothing is publishable. */
export async function initListing() {
  const page = document.querySelector('[data-insights-page]');
  if (!page) return;
  const studies = await loadStudies();
  const list = page.querySelector('[data-list]');
  const empty = page.querySelector('[data-empty]');
  const count = page.querySelector('[data-count]');
  const form = page.querySelector('[data-filters]');
  if (!studies.length) { empty.hidden = false; return; }

  const fill = (sel, values) => sel.insertAdjacentHTML('beforeend', values.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join(''));
  const sectors = [...new Set(studies.map((e) => e.sector))].sort();
  const services = [...new Set(studies.flatMap((e) => e.serviceTags || []))];
  const sectorSel = form.querySelector('[data-filter="sector"]');
  const serviceSel = form.querySelector('[data-filter="service"]');
  fill(sectorSel, sectors.map((x) => [x, x]));
  fill(serviceSel, services.map((x) => [x, serviceName(x)]));
  form.hidden = studies.length < 2; // filters add nothing for a single entry

  const draw = () => {
    const sector = sectorSel.value, service = serviceSel.value;
    const shown = studies.filter((e) => (!sector || e.sector === sector) && (!service || (e.serviceTags || []).includes(service)));
    list.innerHTML = shown.map(card).join('');
    revealNew(list);
    count.hidden = form.hidden;
    count.textContent = shown.length ? `${shown.length} of ${studies.length} shown` : 'Nothing matches those filters. Try widening them.';
  };
  form.addEventListener('change', draw);
  draw();
}

const para = (t) => esc(t).split(/\n+/).map((p) => `<p class="mt-4 text-lg leading-relaxed text-azure/85">${p}</p>`).join('');
const fmtDate = (d) => { const x = new Date(d); return isNaN(x) ? '' : x.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); };

/** Single case study: case-study.html?slug=... Unknown or unpublishable slugs get a plain not-found note. */
export async function initDetail() {
  const host = document.querySelector('[data-insight-page] [data-detail]');
  if (!host) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const studies = await loadStudies();
  const e = studies.find((x) => x.slug === slug);
  if (!e) {
    document.title = 'Insight not found | Narris International';
    host.innerHTML = `
      <section class="bg-azure pb-16 pt-40 text-white sm:pb-20"><div class="container-x"><p class="eyebrow !text-azure-200">Insights</p><h1 class="h-display mt-4 max-w-3xl !text-white">We could not find that insight.</h1></div></section>
      <section class="section"><div class="container-x"><a class="link-arrow" href="${rel('/case-studies.html')}">Back to Insights</a></div></section>`;
    return;
  }
  document.title = `${e.title} | Narris International`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', e.summary);
  const blocks = [['The challenge', e.challenge], ['Our approach', e.approach], ['What changed', e.outcome]];
  const disclosure = { anonymous: 'Anonymised: no client details are shown.', redacted: 'Details redacted to protect the client.', 'client-approved': 'Shared with the client’s approval.' }[e.disclosure];
  host.innerHTML = `
    <section class="bg-azure pb-16 pt-40 text-white sm:pb-20">
      <div class="container-x">
        <p class="eyebrow !text-azure-200">${esc(e.sector)}${e.sample ? ' &middot; Sample' : ''}</p>
        <h1 class="h-display mt-4 max-w-3xl !text-white">${esc(e.title)}</h1>
        <p class="lead mt-6 max-w-2xl !text-azure-100">${esc(e.summary)}</p>
      </div>
    </section>
    <article class="section">
      <div class="container-x max-w-3xl">
        ${e.sample ? '<p class="mb-10 border border-azure/25 bg-warm p-4 text-sm"><strong>Sample entry.</strong> This is an illustration and does not describe a real engagement.</p>' : ''}
        ${blocks.filter(([, t]) => t).map(([h, t]) => `<section class="mb-12"><h2 class="font-serif text-3xl">${h}</h2>${para(t)}</section>`).join('')}
        <ul class="flex flex-wrap gap-2" aria-label="Services involved">${(e.serviceTags || []).map((t) => `<li><a class="block border border-azure/20 px-3 py-1.5 text-sm hover:border-azure" href="${rel('/services.html')}#${encodeURIComponent(t)}">${esc(serviceName(t))}</a></li>`).join('')}</ul>
        <p class="mt-8 text-sm text-azure/65">${[fmtDate(e.date), disclosure].filter(Boolean).join(' &middot; ')}</p>
        <div class="mt-12 flex flex-wrap items-center gap-6"><a class="btn btn-primary" href="${rel('/contact.html')}">Begin with a conversation</a><a class="link-arrow" href="${rel('/case-studies.html')}">All insights</a></div>
      </div>
    </article>`;
  revealNew(host);
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
    const studies = await loadStudies();
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
