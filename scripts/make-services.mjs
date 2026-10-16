/**
 * `npm run services`: builds the Services index (services.html) and one detail page per service
 * (service-<id>.html) from data/services.json. Edit the JSON, run this, then `npm run seo` and `npm run build`.
 * Layout follows the client's reference (siegelgale.com/about): a large statement, then a stacked,
 * divider-separated list of practice areas, each opening its own page.
 * The "How we engage" block on the index is kept as written (names only, no prices).
 * TODO(client): approve the detail-page copy in data/services.json before launch.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// TODO(client): "sCharge" in the Strategy summary is a placeholder for the banned word "supercharge"; confirm replacement wording.
const services = JSON.parse(await readFile(path.join(root, 'data/services.json'), 'utf8'));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (i) => String(i + 1).padStart(2, '0');
const hasCopy = (s) => !!(s.lead || s.deliverables.length);
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const file = (s) => `service-${s.id}.html`;

const arrow = '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const bigArrow = '<svg aria-hidden="true" viewBox="0 0 16 16" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

// Shared head and chrome (header and footer are injected by js/components.js).
const head = (title, desc, noindex = false) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | Narris International</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#162b3a">
  ${noindex ? '<meta name="robots" content="noindex">' : ''}
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- Fonts load without blocking first paint (display=swap) -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"></noscript>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="modulepreload" href="js/main.js">
  <link rel="modulepreload" href="js/components.js">
  <link rel="modulepreload" href="js/config.js">
  <script>document.documentElement.classList.add('js');</script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <div id="site-header">
    <noscript>
      <nav aria-label="Primary" class="bg-azure px-5 py-4 text-sm text-white">
        <a href="./" class="font-semibold uppercase tracking-widest2">Narris International</a>
        <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <li><a href="services.html">What we do</a></li><li><a href="about.html#approach">How we do it</a></li>
          <li><a href="about.html">About Us</a></li><li><a href="team.html">Our Team</a></li><li><a href="testimonials.html">Testimonials</a></li>
          <li><a href="careers.html">Careers</a></li><li><a href="case-studies.html">Insights</a></li><li><a href="gen-z-research.html">Gen Z Research</a></li>
          <li><a href="faqs.html">FAQs</a></li><li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
    </noscript>
  </div>
`;
const foot = `
  <div id="site-footer"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
`;

/* ---------- index: services.html ---------- */
const engage = `
    <!-- HOW WE ENGAGE (names only, no prices) -->
    <section id="engage" class="section scroll-mt-32 bg-azure text-white" aria-labelledby="engage-h">
      <div class="container-x">
        <div class="reveal max-w-2xl"><p class="eyebrow !text-azure-200">How we engage</p><h2 id="engage-h" class="h-section mt-4 !text-white">Our engagements are shaped around the client&rsquo;s business questions.</h2>
        <p class="mt-5 text-lg text-azure-100">Quotations are provided on request, once we understand how success looks like for you.</p></div>
        <ul class="mt-12 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-5" data-stagger>
          ${['Retained executive advisory', 'Fixed-fee strategic projects', 'Strategic reports and analysis', 'Workshops and executive sessions', 'Long-term institutional partnerships']
            .map((t) => `<li class="reveal group bg-azure p-6"><span aria-hidden="true" class="block h-px w-8 bg-azure-200 transition-all duration-500 group-hover:w-16"></span><p class="mt-6 font-serif text-xl leading-snug">${t}</p></li>`).join('\n          ')}
        </ul>
        <div class="reveal mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a class="btn bg-warm text-azure hover:opacity-90" href="contact.html">Start a conversation</a>
        </div>
        <p class="reveal mt-8 text-azure-200">Work can be delivered remotely, with clients worldwide.</p>
      </div>
    </section>`;

const indexPage = () => `${head('What we do', 'Narris International services: strategy, design, brand communication and brand-led change.')}  <!-- Generated by scripts/make-services.mjs from data/services.json. Edit the data, not this file. -->
  <main id="main">
    <section class="relative overflow-hidden bg-azure pb-16 pt-40 text-white sm:pb-24">
      <figure class="section-img svc-hero-img absolute inset-0" data-section-img="philosophy"></figure>
      <div class="container-x relative">
        <h1 class="h-display max-w-4xl !text-white">${'By untangling complexity, we reveal the core of who you are.'.split(' ').map((w, n) => `<span class="svc-w"><span style="--w:${n}">${w}</span></span>`).join(' ')}</h1>
      </div>
    </section>

    <!-- Stacked service list: each row opens its own page. Row ids keep older #anchor links working. -->
    <section class="section" aria-labelledby="list-h">
      <div class="container-x">
        <p class="reveal eyebrow">What we do</p>
        <h2 id="list-h" class="reveal h-section mt-4 max-w-3xl">We clear the way for you to show up bold, confident and authentically you.</h2>
        <ul class="mt-12 border-t border-azure/25" data-stagger>
${services.map((s) => `          <li id="${s.id}" class="reveal group/row relative scroll-mt-32 border-b border-azure/25">
            <a href="${file(s)}" class="svc-row-link group grid items-center gap-x-8 gap-y-3 py-8 sm:grid-cols-[1fr_auto] sm:py-10">
              <span>
                <span class="block font-serif text-2xl font-extrabold leading-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">${esc(s.name)}</span>
                ${s.summary ? `<span class="mt-2 block max-w-2xl text-azure/80">${esc(s.summary)}</span>` : ''}
              </span>
              <span class="svc-go hidden h-14 w-14 items-center justify-center rounded-full border border-azure/30 text-azure transition duration-300 sm:flex">${arrow}</span>
              <span class="link-arrow mt-2 sm:hidden">Read more ${arrow}</span>
            </a>
            <!-- Hover/focus menu: links straight to each specific service on the detail page -->
            <ul class="invisible absolute left-0 top-full z-20 -mt-2 min-w-[18rem] translate-y-1 rounded-xl border border-azure/10 bg-white py-2 opacity-0 shadow-xl transition duration-200 group-hover/row:visible group-hover/row:translate-y-0 group-hover/row:opacity-100 group-focus-within/row:visible group-focus-within/row:translate-y-0 group-focus-within/row:opacity-100" aria-label="${esc(s.name)} services">
              ${s.deliverables.map((d) => `<li><a class="block px-5 py-2.5 text-sm font-semibold text-azure transition hover:bg-warm" href="${file(s)}#${slug(d.name)}">${esc(d.name)}</a></li>`).join('\n              ')}
            </ul>
          </li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="bg-warm section" aria-labelledby="statement-h">
      <div class="container-x">
        <h2 id="statement-h" class="reveal h-section max-w-4xl">We are a bunch of sharp thinkers and creative makers on a mission to do the best work of our lives, and always enjoy the ride.</h2>
        <div class="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a class="btn btn-primary" href="contact.html">Let&rsquo;s talk</a>
        </div>
      </div>
    </section>
${engage}
  </main>
${foot}`;

/* Animated line motifs for the hero (CSS keyframes in css/input.css, static under reduced motion). One per category via "motif". */
const motifs = {
  grid: [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => `<rect class="svc-cell" style="--k:${r * 3 + c};--dx:${(c - 1) * 22}px;--dy:${(r - 1) * -18 + (c % 2 ? 14 : -10)}px" x="${70 + c * 90}" y="${70 + r * 90}" width="70" height="70"/>`)).join(''),
  network: `<path class="svc-flow" d="M70 300 L150 150 L260 210 L330 90 M150 150 L120 60 M260 210 L310 320"/><g fill="currentColor" stroke="none"><circle class="svc-node" style="--k:0" cx="70" cy="300" r="7"/><circle class="svc-node" style="--k:1" cx="150" cy="150" r="9"/><circle class="svc-node" style="--k:2" cx="260" cy="210" r="8"/><circle class="svc-node" style="--k:3" cx="330" cy="90" r="7"/><circle class="svc-node" style="--k:4" cx="120" cy="60" r="6"/><circle class="svc-node" style="--k:5" cx="310" cy="320" r="6"/></g>`,
  shift: [0, 1, 2, 3, 4].map((k) => `<rect class="svc-bar" style="--k:${k};--dx:${[40, -50, 30, -35, 55][k]}px" x="90" y="${70 + k * 50}" width="${[220, 160, 200, 140, 180][k]}" height="26"/>`).join('') + `<path class="svc-flow" d="M60 50 V350"/>`,
};
const motif = (s, cls = '', sw = 1.5) => (motifs[s.motif] ? `<svg class="svc-motif ${cls}" viewBox="0 0 400 400" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="${sw}"><g class="svc-tilt">${motifs[s.motif]}</g></svg>` : '');

// Photo keys come from config.images.sections (rendered by js/main.js). Each text block gets its own image;
// the pool excludes the hero image and rotates per page so neighbouring pages do not repeat the same sequence.
const IMAGE_KEYS = ['services', 'positioning', 'how', 'serve', 'values', 'gap', 'philosophy', 'contact'];
const pool = (s, i) => { const p = IMAGE_KEYS.filter((k) => k !== s.image); return (n) => p[(n + i * 2) % p.length]; };

/* ---------- detail: service-<id>.html ---------- */
const detail = (s, i) => {
  const prev = services[(i + services.length - 1) % services.length];
  const next = services[(i + 1) % services.length];
  const others = services.filter((o) => o.id !== s.id);
  const q = `contact.html?service=${s.id}`;
  const img = pool(s, i);
  return `${head(s.name, s.metaDescription, !hasCopy(s))}  <!-- Generated by scripts/make-services.mjs from data/services.json. Edit the data, not this file. TODO(client): approve the service copy to data/services.json; pages stay noindex until then. -->
  <main id="main">
    <section class="relative overflow-hidden bg-azure pb-16 pt-40 text-white sm:pb-24" data-tilt>
      <figure class="section-img svc-hero-img absolute inset-0"${s.imagePos ? ` style="--pos:${s.imagePos}"` : ''} data-section-img="${s.image}"></figure>
      ${motif(s, 'absolute -right-10 top-1/2 hidden h-[30rem] w-[30rem] -translate-y-1/2 opacity-60 lg:block')}
      <div class="container-x relative">
        <h1 class="h-display max-w-4xl !text-white">${s.name.split(' ').map((w, n) => `<span class="svc-w"><span style="--w:${n}">${esc(w)}</span></span>`).join(' ')}</h1>
        ${s.lead ? `<p style="--i:2" data-type class="svc-in lead mt-6 max-w-2xl !text-azure-100">${esc(s.lead)}</p>` : ''}
      </div>
    </section>

${s.deliverables.length ? `    <!-- Service areas: bold, underlined heading with a short description -->
    <section class="section" aria-labelledby="areas-h">
      <div class="container-x">
        <h2 id="areas-h" class="sr-only">${esc(s.name)} services</h2>
        <!-- Each area is anchored by its own photograph; a rule down the left fills as you scroll (js/main.js) -->
        <ol class="svc-rail relative mt-14 space-y-28 pl-7 sm:pl-10 lg:space-y-44" data-rail>
          ${s.deliverables.map((d, k) => `<li id="${slug(d.name)}" class="svc-area reveal scroll-mt-32 grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <figure class="section-img svc-img svc-par reveal aspect-[4/3] lg:col-span-6 ${k % 2 ? 'lg:order-2' : ''}" data-parallax data-section-img="${img(k)}"></figure>
            <div class="lg:col-span-6 ${k % 2 ? 'lg:order-1' : ''}">
              <h3 class="svc-u inline font-serif text-2xl font-extrabold sm:text-3xl">${esc(d.name)}</h3>
              <p class="mt-5 max-w-lg text-lg text-azure/80">${esc(d.text)}</p>
            </div>
          </li>`).join('\n          ')}
        </ol>
      </div>
    </section>

    ` : ''}

    <!-- Selected work: filled from data/case-studies.json by js/case-studies.js; hidden when nothing is publishable -->
    <section class="section bg-warm" data-service-work data-service="${s.id}" aria-labelledby="work-h" hidden>
      <div class="container-x">
        <h2 id="work-h" class="reveal h-section">Selected work</h2>
        <ul class="mt-10 grid gap-5 md:grid-cols-3" data-service-list data-stagger></ul>
        <p class="reveal mt-10"><a class="link-arrow" href="case-studies.html">See more work ${arrow}</a></p>
      </div>
    </section>

    ${hasCopy(s) ? '' : `<!-- No copy yet: shown until the client's service text is added to data/services.json -->
    <section class="section" aria-labelledby="pending-h">
      <div class="container-x max-w-3xl">
        <h2 id="pending-h" class="h-section">Tell us what you are working on.</h2>
        <p class="lead mt-6">Detailed information on this service is being prepared. In the meantime, start with the question you are facing and we will take it from there.</p>
      </div>
    </section>`}

    <!-- Get in touch, then featured articles (placeholder title per service; TODO(client): replace with real articles) -->
    <section class="section bg-warm" aria-labelledby="touch-h">
      <div class="container-x">
        <h2 id="touch-h" class="sr-only">Get in touch</h2>
        <p class="reveal"><a class="btn btn-primary" href="${q}">Get in touch</a></p>
      </div>
    </section>

    ${s.perspective ? `<section class="section" aria-labelledby="persp-h">
      <div class="container-x">
        <h2 id="persp-h" class="reveal h-section">Our perspectives</h2>
        <ul class="mt-10 grid gap-5 md:grid-cols-3" data-stagger>
          <li class="reveal border border-azure/20 p-6">
            <p class="eyebrow">Featured article</p>
            <p class="mt-4 font-serif text-2xl font-extrabold leading-snug">${esc(s.perspective)}</p>
            <p class="mt-4 text-sm text-azure/70">Coming soon.</p>
          </li>
        </ul>
      </div>
    </section>` : ''}

    <section class="section bg-azure text-white" aria-label="More services">
      <div class="container-x">
        <p class="reveal flex flex-wrap justify-between gap-4 text-sm font-bold">
          <a class="link-arrow text-white" href="${file(prev)}">Previous: ${esc(prev.short)}</a>
          <a class="link-arrow text-white" href="services.html">All services</a>
          <a class="link-arrow text-white" href="${file(next)}">Next: ${esc(next.short)} ${arrow}</a>
        </p>
      </div>
    </section>
  </main>
${foot}`;
};

await writeFile(path.join(root, 'services.html'), indexPage());
for (const [i, s] of services.entries()) await writeFile(path.join(root, file(s)), detail(s, i));
console.log(`services: wrote services.html and ${services.length} detail pages`);
