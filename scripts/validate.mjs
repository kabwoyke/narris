/**
 * `npm run validate`: content and link checks. Exits 1 on any violation.
 * Phase 0/1 checks: every internal link in the HTML files and config nav resolves to a file (and anchor,
 * when the target page is built); all JSON data files parse; banned words are absent from page copy;
 * the "never publish" guard terms are absent.
 * Phase 5: case-study schema and consent checks (client-approved needs consentRef/approvedBy; anonymous entries
 * may carry no identifying fields; live entries may not be placeholders or contain guarantee wording).
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

/* 1b. Case studies: schema, consent and disclosure rules (CLAUDE.md sections 5 and 13) */
{
  const { config: cfg } = await import(pathToFileURL(path.join(root, 'js/config.js')).href);
  const entries = JSON.parse(await readFile(path.join(root, 'data/case-studies.json'), 'utf8'));
  const serviceIds = new Set(cfg.services.map((x) => x.id));
  const required = ['title', 'slug', 'sector', 'serviceTags', 'summary', 'challenge', 'approach', 'outcome', 'date', 'disclosure', 'published', 'sample'];
  const identifying = ['client', 'clientName', 'clientLogo', 'logo', 'logoUrl', 'clientUrl', 'website'];
  const slugs = new Set();
  if (!Array.isArray(entries)) fail('data/case-studies.json: must be an array');
  else entries.forEach((e, i) => {
    const id = `data/case-studies.json[${i}] (${e.slug || 'no slug'})`;
    for (const k of required) if (e[k] === undefined || e[k] === '') fail(`${id}: missing "${k}"`);
    if (e.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug)) fail(`${id}: slug must be lowercase kebab-case`);
    if (slugs.has(e.slug)) fail(`${id}: duplicate slug`); slugs.add(e.slug);
    if (!['anonymous', 'client-approved', 'redacted'].includes(e.disclosure)) fail(`${id}: disclosure must be anonymous | client-approved | redacted`);
    if (!Array.isArray(e.serviceTags) || !e.serviceTags.length) fail(`${id}: serviceTags must be a non-empty array`);
    else for (const t of e.serviceTags) if (!serviceIds.has(t)) fail(`${id}: unknown service tag "${t}"`);
    if (typeof e.published !== 'boolean' || typeof e.sample !== 'boolean') fail(`${id}: published and sample must be true or false`);
    if (isNaN(Date.parse(e.date))) fail(`${id}: date must be YYYY-MM-DD`);
    if (e.disclosure === 'client-approved' && !(e.consentRef && e.approvedBy)) fail(`${id}: client-approved needs consentRef and approvedBy`);
    if (e.disclosure !== 'client-approved') for (const k of identifying) if (e[k]) fail(`${id}: "${k}" must not be set unless disclosure is client-approved`);
    if (e.published && !e.sample && /^(TEMPLATE|SAMPLE)/i.test(`${e.title} ${e.summary}`.trim())) fail(`${id}: placeholder text in a live entry`);
    if (e.published && e.sample && !/^SAMPLE\./.test(e.summary || '')) fail(`${id}: sample entries must start their summary with "SAMPLE."`);
  });
  if (cfg.flags.showSamples) console.warn('validate: note: flags.showSamples is true. Set it to false before publishing.');
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
  if (/^(https?:|mailto:|tel:|#$|css\/|js\/|assets\/|manifest\.webmanifest$)/.test(href)) continue;
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

/* 2c. Gen Z page opening statement must match hero slide 5 (client's exact wording) */
{
  const gz = config.hero.slides.find((x) => x.id === 'gen-z');
  const flat = (t) => t.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  if (gz && !flat(pages.get('gen-z-research.html')).includes(flat(gz.headline))) fail('gen-z-research.html opening statement is out of sync with the gen-z hero slide');
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
