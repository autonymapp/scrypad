const CACHE_NAME = 'scrypad-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/assets/fonts/rajdhani-latin-600-normal.woff2',
  '/assets/fonts/rajdhani-latin-700-normal.woff2',
  '/assets/fonts/ibm-plex-sans-latin-400-normal.woff2',
  '/assets/fonts/ibm-plex-sans-latin-500-normal.woff2',
  '/assets/fonts/ibm-plex-mono-latin-400-normal.woff2',
  '/assets/fonts/jetbrains-mono-latin-500-normal.woff2',
  '/assets/lab-mark.svg',
  '/assets/wisp.svg'
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
  // Only cache GET requests originating from same-origin
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
