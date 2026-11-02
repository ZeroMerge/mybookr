const CACHE_NAME = 'bookr-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bookr-favicon.svg',
  '/bookr-logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
];

// Install: Cache core app shell safely and skip waiting immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`[SW] Precache skipped for ${url}:`, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Claim clients and remove legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Stale-While-Revalidate with full offline fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available while updating in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline and request is for a web page, fallback to cached index.html
          if (event.request.headers.get('accept')?.includes('text/html')) {
            const fallback = await caches.match('/index.html') || await caches.match('/');
            if (fallback) return fallback;
          }
          return new Response('Offline: Content unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });

      return cachedResponse || fetchPromise;
    })
  );
});
