# Image Optimization Pipeline — Proposal

**Feature ID:** UI-006
**Priority:** P3
**Complexity:** S
**Status:** completed
**Dependencies:** SYS-004 (complete), PERF-002 (planned)

## Summary

Add automated image optimization to the build pipeline — WebP/AVIF conversion via sharp, responsive `<picture>` elements, cache-control headers, and CSS utilities.

## What Changed

| File | Change |
|------|--------|
| `scripts/assemble.mjs` | Added `optimizeImages()` — converts PNG/JPG to WebP+AVIF using sharp during build |
| `src/partials/nav.html` | Logo uses `<picture>` with AVIF→WebP→PNG fallback + `fetchpriority="high"` |
| `src/partials/footer.html` | Logo uses `<picture>` with AVIF→WebP→PNG fallback + `loading="lazy"` |
| `assets/css/core.css` | Added `picture` display rules and responsive image helpers |
| `netlify.toml` | Added `Cache-Control: public, max-age=31536000, immutable` for `/assets/img/*` |
| `features/features.json` | UI-006 status: planned → in-progress |

## Results

- PNG: 305 KB → WebP: 12.5 KB (24x smaller) → AVIF: 10.9 KB (28x smaller)
- Build: 0 errors, 31 pre-existing warnings
- Pipeline is zero-config for future images — any PNG/JPG added to `assets/img/` auto-converts
