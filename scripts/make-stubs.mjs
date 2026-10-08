/**
 * Generates the shared "In progress" stub for every page not yet built, so no nav link is ever dead.
 * Safe to re-run: a file is only (re)written if it does not exist or still carries `data-stub`.
 * When a phase builds a real page, simply replace the file (the marker disappears and it is left alone).
 * Usage: npm run stubs
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// file -> [heading, phase that replaces it]
const STUBS = {
  'about.html': ['About Us', 3],
  'services.html': ['What we do', 2],
  'team.html': ['Our Team', 7],
  'testimonials.html': ['Testimonials', 7],
  'faqs.html': ['FAQs', 8],
  'contact.html': ['Contact', 4],
  'careers.html': ['Careers', 8],
  'case-studies.html': ['Insights', 5],
  'case-study.html': ['Insight', 5],
  'gen-z-research.html': ['Gen Z Research', 6],
  'privacy.html': ['Privacy', 4],
};

const page = (title, phase) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Narris International</title>
  <meta name="description" content="Narris International is a research-informed strategy advisory focused on positioning, stakeholder understanding and strategic communication.">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#162b3a">
  <link rel="icon" type="image/png" href="assets/logo/narris-logo-bg.png">
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

  <!-- STUB: replaced in phase ${phase}. Rendered by js/main.js (renderStub). -->
  <main id="main" data-stub="${title}">
    <noscript>
      <section class="container-x py-16">
        <h1 class="font-serif text-4xl">${title}</h1>
        <p class="mt-4">This page is being prepared. Call <a class="underline" href="tel:+254111429478">0111429478</a> or email <a class="underline" href="mailto:bdu@narrisinternational.com">bdu@narrisinternational.com</a>.</p>
      </section>
    </noscript>
  </main>

  <div id="site-footer"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
`;

for (const [file, [title, phase]] of Object.entries(STUBS)) {
  const target = path.join(root, file);
  let existing = null;
  try { await access(target); existing = await readFile(target, 'utf8'); } catch { /* new file */ }
  if (existing && !existing.includes('data-stub')) {
    console.log(`skip   ${file} (built page)`);
    continue;
  }
  await writeFile(target, page(title, phase));
  console.log(`stub   ${file}`);
}
