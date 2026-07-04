# Image Optimization Pipeline — Tasks

- [x] Install sharp as devDependency
- [x] Add `optimizeImages()` to `scripts/assemble.mjs` — WebP (q=85) + AVIF (q=65, effort=4)
- [x] Update `src/partials/nav.html` logo to `<picture>` with AVIF→WebP→PNG fallback
- [x] Update `src/partials/footer.html` logo to `<picture>` with AVIF→WebP→PNG fallback
- [x] Add `picture { display: block }` and `picture img` rules to `assets/css/core.css`
- [x] Add `Cache-Control: public, max-age=31536000, immutable` for `/assets/img/*` in `netlify.toml`
- [x] Update `features/features.json` UI-006 status
- [x] Build and validate — 0 errors
