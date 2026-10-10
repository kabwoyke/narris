/**
 * Service worker: makes the site installable and readable offline.
 * - HTML and JSON: network first, falling back to the cache (content stays fresh when online).
 * - CSS, JS, images, fonts: stale-while-revalidate.
 * - Non-GET requests (form posts) and cross-origin requests (stock photos, form endpoint) are never touched.
 * Bump VERSION on each deploy that changes the precache list.
 */
const VERSION = 'narris-v1';
const PRECACHE = [
  './', 'index.html', 'services.html', 'about.html', 'contact.html', 'privacy.html', 'team.html', 'testimonials.html',
  'faqs.html', 'careers.html', 'case-studies.html', 'case-study.html', 'gen-z-research.html',
  'css/styles.css', 'js/main.js', 'js/components.js', 'js/config.js', 'js/forms.js', 'js/hero.js', 'js/network.js', 'js/case-studies.js',
  'assets/logo/narris-logo-bg.png', 'assets/icons/icon-192.png',
];

self.addEventListener('install', (e) => {
  // addAll would fail the whole install on one 404, so cache each file independently.
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  const fresh = req.mode === 'navigate' || /\.(html|json|webmanifest)$/.test(url.pathname);
  if (fresh) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
