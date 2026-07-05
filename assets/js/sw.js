/* OptiFlow OS — Service Worker
   ponytail: native SW API, no workbox. Cache-first for assets, network-first for pages. */

const VERSION = '{{SW_VERSION}}';
const CACHE_ASSETS = 'optiflow-assets-v' + VERSION;
const CACHE_PAGES = 'optiflow-pages-v' + VERSION;
const CACHE_IMAGES = 'optiflow-images-v' + VERSION;

const ASSET_EXTS = /\.(css|js|woff2?|ttf|json|xml|txt|ico|svg)$/;
const IMAGE_EXTS = /\.(png|jpe?g|gif|webp|avif)$/;

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_ASSETS).then(function(cache) {
      return cache.addAll([
        '/assets/css/core.css',
        '/assets/js/core.js',
        '/assets/js/sw.js',
        '/offline/',
      ]);
    })
  );
  e.waitUntil(
    caches.open(CACHE_PAGES).then(function(cache) {
      return cache.addAll(['/offline/']);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('optiflow-') && !k.endsWith(VERSION);
        }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  if (IMAGE_EXTS.test(url.pathname)) {
    e.respondWith(cacheFirst(e.request, CACHE_IMAGES));
    return;
  }

  if (ASSET_EXTS.test(url.pathname)) {
    e.respondWith(cacheFirst(e.request, CACHE_ASSETS));
    return;
  }

  e.respondWith(networkFirst(e.request, CACHE_PAGES));
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      var clone = response.clone();
      caches.open(cacheName).then(function(cache) { cache.put(request, clone); });
      return response;
    }).catch(function() {
      if (request.destination === 'image') {
        return new Response('', { status: 204, statusText: 'Offline' });
      }
      return caches.match('/offline/');
    });
  });
}

function networkFirst(request, cacheName) {
  return fetch(request).then(function(response) {
    if (!response || response.status !== 200 || response.type !== 'basic') return response;
    var clone = response.clone();
    caches.open(cacheName).then(function(cache) { cache.put(request, clone); });
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || caches.match('/offline/');
    });
  });
}
