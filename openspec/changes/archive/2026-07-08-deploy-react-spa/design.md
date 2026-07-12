## Context

The React SPA (completed in `complete-react-scaffold`) produces `frontend/dist/` with a production build including `index.html`, chunked JS, and CSS. The current Dockerfile only runs the static `assemble.mjs` builder and deploys `dist/` (static HTML). The React SPA needs to be built during the Docker build and served under `/os/` via nginx with SPA client-side routing support.

The static builder remains needed for:
- Root redirect page (`/` → `/os/`)
- `sitemap.xml`, `robots.txt`, `manifest.json`
- Optimized images (`assets/img/` — WebP/AVIF via sharp)
- `core.css`, `core.js` (no longer needed by React but kept for potential static fallback)

## Goals / Non-Goals

**Goals:**
- Docker image serves React SPA for all `/os/*` routes with client-side routing
- Static infrastructure files (sitemap, robots, manifest, root redirect) continue working
- Optimized images from static pipeline remain available at `/assets/img/`
- Build process is self-contained in Docker (no external orchestration needed)

**Non-Goals:**
- Removing the static builder — it still produces infrastructure files
- Consolidating asset pipelines (React uses Vite, static uses sharp)
- Adding CI/CD automation — that's a separate concern (F30)
- Modifying React source or Vite config
- API backend integration

## Decisions

### D1: Multi-stage Docker: static → React → brotli → runtime
**Decision:** Four-stage Dockerfile. Static builder for SEO assets, React builder for SPA, brotli builder for compression, nginx runtime as final stage.

**Rationale:** Each stage has isolated dependencies. No need to install both `sharp` (static) and Vite (React) in the same container. If one build fails, Docker caches the other stages.

**Alternative considered:** Single Node stage running both builds. Rejected — dependency conflicts possible, longer build times without layer caching.

### D2: React dist copied into `/os/` subdirectory
**Decision:** `COPY --from=react-builder /app/dist /usr/share/nginx/html/os/`

**Rationale:** Matches Vite's `base: '/os/'` config. When the browser requests `/os/assets/index-xxx.js`, nginx finds it at `html/os/assets/index-xxx.js`. The `index.html` at `html/os/index.html` is served for `/os/`.

**Alternative considered:** Copy React to root and use nginx rewrites. Rejected — would require complex URL rewriting and conflict with root-level infrastructure files.

### D3: nginx `try_files $uri /os/index.html` for SPA
**Decision:** Specific `location /os/` block with `try_files $uri /os/index.html` — no `$uri/` directory check, no `$uri/index.html` fallback.

**Rationale:** The old static HTML `os/*/index.html` files still exist in the Docker image (from static builder), but the `/os/` location block bypasses the general `location /` block. If we used `try_files $uri $uri/ $uri/index.html`, nginx would serve the old static `os/pricing/index.html` instead of the SPA fallback. Using `try_files $uri /os/index.html` ensures static assets resolve first, then everything else falls through to the React SPA.

**Alternative considered:** Remove static `os/` pages from the Docker copy. Rejected — adds complexity to the Dockerfile for no gain; the `/os/` location block already prevents them from being served.

### D4: CSP updated for React inline styles
**Decision:** Content-Security-Policy already allows `style-src 'unsafe-inline'` — sufficient for React. No CSP changes needed.

**Rationale:** The existing CSP in `nginx.conf` was designed for the static site and already permits inline styles. React may render some inline styles for dynamic values; the existing policy covers this.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Docker build time increases (now builds React) | Longer CI pipeline | Docker layer caching; React build is ~2s on cold cache |
| Static os/ pages still in image but unreachable | ~150KB wasted disk | Negligible; keeping them simplifies Dockerfile |
| Vite `base: '/os/'` mismatch with nginx path | Broken asset URLs | Verified: Vite outputs absolute `/os/assets/...` URLs matching nginx location |
| CSP blocks React dynamic content | Console errors | Tested: existing CSP allows inline styles and self-src scripts |
| React bundle cache busting | Browser loads stale JS | Vite generates content hashes in filenames (`index-hQt6ZnhL.js`) |

## Migration Plan

1. `docker compose up -d --build` rebuilds the image with both static and React stages
2. nginx serves React SPA for `/os/*`; root redirect, sitemap, robots unchanged
3. Rollback: revert Dockerfile to previous single-stage version, rebuild

## Open Questions

None — implementation is straightforward and already verified locally.
