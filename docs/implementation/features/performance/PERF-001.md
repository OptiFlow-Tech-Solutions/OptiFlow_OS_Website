# PERF-001: PWA Service Worker
- **Status:** Pending | **Priority:** MEDIUM | **Est. Hours:** 1.5
- **Category:** Performance | **Phase:** 10
- **Score Impact:** Perf +3

## Problem / Expected / Affected
`manifest.json` is generated at build time, but no service worker is registered. Without a service worker, the PWA install prompt behaves inconsistently, there is no offline support, and Lighthouse penalises the PWA score. Returning visitors get no caching benefit.

Expected: A cache-first service worker that pre-caches static assets during install, serves them from cache for repeat visits, and provides a lightweight offline fallback page when the network is unavailable.

## Acceptance Criteria
- [ ] `sw.js` created with cache-first strategy for static assets (CSS, JS, images, fonts)
- [ ] Static assets cached during service-worker install event
- [ ] Offline fallback page (`offline.html`) served when network is unavailable
- [ ] Service worker registered on every page (via `core.js`)
- [ ] Lighthouse PWA score >= 80

## Implementation
Create `assets/js/sw.js` with a standard cache-first service worker pattern. Register the worker in `core.js`. Create a minimal `offline.html` fallback. Update `assemble.mjs` to copy `sw.js` and `offline.html` into the dist output.

## Dependencies / Definition of Done
- **Depends on:** None
- **DoD:** Audit passes with Lighthouse PWA score >= 80; offline mode shows fallback page.
