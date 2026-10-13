const CACHE_NAME = 'asd-workshop-v6';
const PRECACHE_URLS = [
  '/',
  '/toolkit.html',
  '/toolkit.json',
  '/icons/logo.png',
  '/icons/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Only handle requests for this site's own files. Anything cross-origin
// (Google Sheets API, fonts, etc.) is left completely untouched so it
// always hits the network fresh, never cached, never stale.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isHtml = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  const isToolkitData = url.pathname === '/toolkit.json';

  // Network-first for HTML and toolkit.json (so new versions show up quickly,
  // with the cached copy as the offline fallback).
  if (isHtml || isToolkitData) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('/')))
    );
    return;
  }

  // Cache-first for everything else (images, icons, etc.)
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
