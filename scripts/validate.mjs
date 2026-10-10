/**
 * `npm run validate`: content and link checks. Exits 1 on any violation.
 * Phase 0/1 checks: every internal link in the HTML files and config nav resolves to a file (and anchor,
 * when the target page is built); all JSON data files parse; banned words are absent from page copy;
 * the "never publish" guard terms are absent.
 * TODO(phase 5): add case-study schema + consent checks (client-approved needs consentRef/approvedBy).
 */
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

const htmlFiles = (await readdir(root)).filter((f) => f.endsWith('.html'));
const pages = new Map();
for (const f of htmlFiles) pages.set(f, await readFile(path.join(root, f), 'utf8'));

/* 1. JSON data */
for (const f of await readdir(path.join(root, 'data'))) {
  try { JSON.parse(await readFile(path.join(root, 'data', f), 'utf8')); } catch (e) { fail(`data/${f}: invalid JSON (${e.message})`); }
}

/* 2. Links (HTML + config nav/hero CTAs) */
const { config } = await import(pathToFileURL(path.join(root, 'js/config.js')).href);
const hrefs = new Set();
for (const [pageName, html] of pages) for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
  // In-page anchors are checked against the page that contains them; everything else is checked below.
  if (m[1].startsWith('#') && m[1].length > 1) { if (!html.includes(`id="${m[1].slice(1)}"`)) fail(`${pageName}: missing anchor ${m[1]}`); }
  else hrefs.add(m[1]);
}
const collect = (items) => items.forEach((i) => { hrefs.add(i.href); if (i.children) collect(i.children); });
collect(config.nav); collect(config.footerLinks);
config.hero.slides.forEach((s) => hrefs.add(s.cta.href));
hrefs.add(config.quoteCta.href);

for (const href of hrefs) {
  if (/^(https?:|mailto:|tel:|#$|css\/|js\/|assets\/)/.test(href)) continue;
  const clean = href.replace(/^\//, '');
  const [file, hash] = clean.split('#');
  const target = (file.split('?')[0] || 'index.html').replace(/^\.\/$/, 'index.html') || 'index.html';
  const name = target === '' || target === './' ? 'index.html' : target;
  if (!pages.has(name)) { fail(`broken link: ${href}`); continue; }
  const built = !pages.get(name).includes('data-stub');
  if (hash && built && !pages.get(name).includes(`id="${hash}"`)) fail(`missing anchor "${hash}" in ${name} (linked as ${href})`);
}

/* 2b. Pre-rendered hero slide 1 in index.html must match config */
{
  const s0 = config.hero.slides[0];
  const strip = (t) => t.replace(/\s+/g, ' ');
  if (!strip(pages.get('index.html')).includes(strip(s0.headline))) fail('index.html pre-rendered hero headline is out of sync with config.hero.slides[0]');
  for (const q of s0.support) if (!pages.get('index.html').includes(q)) fail(`index.html pre-rendered hero line is out of sync: "${q}"`);
}

/* 3. Banned words and never-publish guard in visible copy (HTML + config) */
const banned = ['cutting-edge', 'world-class', 'synergy', 'game-changing', 'supercharge', 'unlock'];
const guard = ['guarantee', 'guaranteed', 'revenue model', 'competitor'];
const copy = [...pages.values(), await readFile(path.join(root, 'js/config.js'), 'utf8')].join('\n').toLowerCase();
for (const w of banned) if (copy.includes(w)) fail(`banned word in copy: "${w}"`);
for (const w of guard) if (copy.includes(w)) fail(`never-publish term in copy: "${w}"`);

if (errors.length) {
  console.error(`\nvalidate: ${errors.length} problem(s)\n` + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`validate: OK (${pages.size} pages, ${hrefs.size} unique links checked)`);
