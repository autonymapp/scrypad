const CACHE_NAME = 'scrypad-v4';
// Paths are relative to this file, so the same worker works at the site root and on itch.io
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  'logo.svg',
  'assets/wisp-dusk.svg',
  'assets/fonts/chakra-petch-latin-500-normal.woff2',
  'assets/fonts/chakra-petch-latin-600-normal.woff2',
  'assets/fonts/chakra-petch-latin-700-normal.woff2',
  'assets/fonts/figtree-latin-400-normal.woff2',
  'assets/fonts/figtree-latin-500-normal.woff2',
  'assets/fonts/figtree-latin-600-normal.woff2',
  'assets/fonts/fira-code-latin-400-normal.woff2',
  'assets/fonts/fira-code-latin-500-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  const save = (response) => {
    if (response.status === 200) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
    }
    return response;
  };

  // Pages: network first, so every update shows up right away (cache is only the offline fallback)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).then(save).catch(() => caches.match(event.request).then((c) => c || caches.match('index.html')))
    );
    return;
  }

  // Built files have a new name each build, fonts never change: cache first is safe there.
  // Everything else (icons, svg art): network first with the cache as fallback.
  const immutable = url.pathname.includes('/assets/index-') || url.pathname.includes('/assets/fonts/');
  if (immutable) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then(save)));
  } else {
    event.respondWith(fetch(event.request).then(save).catch(() => caches.match(event.request)));
  }
});
