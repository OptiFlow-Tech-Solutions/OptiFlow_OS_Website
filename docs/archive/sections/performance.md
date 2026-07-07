# Performance — Implementation Documentation
- **Current Score:** 78/100 | **Target Score:** 90/100 | **Gap:** 12 | **Last Updated:** 2026-07-06

## Overview / Current State
Static HTML site served with Brotli and Gzip compression at the nginx layer. CSS and JS are minified at build time via `assemble.mjs`. Asset caching is configured with a 1-year `Cache-Control` header for versioned/hashed static assets. Image optimization pipeline uses `sharp` to generate WebP and AVIF variants at build time. DNS prefetch hints are injected for external domains. Lighthouse CI is configured with a performance threshold of ≥0.8 but is not yet wired into the CI workflow — it runs only manually.

The single CSS file (`core.css`) is approximately 37 KB and is currently render-blocking. No critical CSS is inlined.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| PERF-001 | Service Worker for offline/caching | High | 6 | Not Started |
| PERF-002 | Print stylesheet | Low | 1 | Not Started |
| PERF-003 | Self-host fonts | Medium | 2 | Not Started |
| PERF-004 | Critical CSS inlining | High | 3 | Not Started |

## Implementation Order
1. **PERF-004** — Inline critical CSS in `<head>`; defer full `core.css` load. Highest impact for smallest effort.
2. **PERF-003** — Self-host fonts to eliminate third-party font CDN round-trips.
3. **PERF-001** — Register a service worker for offline support and asset caching. Requires HTTPS; already satisfied.
4. **PERF-002** — Add a lightweight print stylesheet hiding nav/footer, adjusting layout.

## Dependencies
- PERF-004 depends on tooling to extract critical CSS (e.g., `critical` or `penthouse`).
- PERF-001 has no upstream dependencies but requires a cache-busting strategy already in place.
- PERF-002 and PERF-003 are independent.

## Key Files
| File | Purpose |
|---|---|
| `assets/css/core.css` | Single render-blocking stylesheet (~37 KB) |
| `scripts/assemble.mjs` | Build-time CSS/JS minification and asset processing |
| `scripts/optimize-images.mjs` | WebP/AVIF generation via sharp |
| `nginx.conf` | Brotli + Gzip compression, Cache-Control headers |
| `.lighthouserc.json` | Lighthouse CI configuration (threshold 0.8) |
| `.github/workflows/ci.yml` | CI workflow (Lighthouse not yet integrated) |

## Acceptance Criteria
- [ ] Lighthouse performance score ≥ 90 on all 14 pages (mobile)
- [ ] First Contentful Paint < 1.5s on 3G throttling
- [ ] Largest Contentful Paint < 2.5s on 3G throttling
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 200ms
- [ ] All static assets served with `Cache-Control: public, max-age=31536000, immutable`
- [ ] Core CSS is non-render-blocking (critical CSS inlined, full CSS deferred)
- [ ] Lighthouse CI runs automatically on every PR
