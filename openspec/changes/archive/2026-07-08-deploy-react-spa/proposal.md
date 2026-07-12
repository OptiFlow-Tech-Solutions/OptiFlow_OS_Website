## Why

The React SPA (F01) is built and tested but never deployed. The Docker image only serves the static HTML site because the Dockerfile runs `assemble.mjs` (static builder) and never builds or copies the React `frontend/`. The `nginx.conf` lacks SPA fallback for client-side routing. This change bridges the build-to-deploy gap so the React SPA reaches production.

## What Changes

- Add React build stage to Dockerfile (multi-stage: static builder → React builder → brotli builder → nginx runtime)
- Copy React `frontend/dist/` into `/usr/share/nginx/html/os/` matching Vite's `base: '/os/'`
- Add `/os/` nginx location block with `try_files $uri /os/index.html` for SPA client-side routing
- Keep static builder for infrastructure files (root redirect, sitemap.xml, robots.txt, manifest.json, optimized images)
- Static HTML pages under `/os/*` replaced by React SPA at deploy time — static builder continues to run for SEO assets

## Capabilities

### New Capabilities

- `docker-react-build`: Dockerfile multi-stage build that compiles the React SPA alongside static assets and deploys both into the nginx runtime image
- `nginx-spa-fallback`: nginx location configuration serving the React SPA with client-side routing fallback for all `/os/*` paths

### Modified Capabilities

- `os-route-prefix`: SPA fallback scenario added — nginx `try_files /os/index.html` supersedes per-page `index.html` files for client-side routing

## Impact

- `Dockerfile`: New `react-builder` stage, updated runtime `COPY` directives
- `nginx.conf`: New `location /os/` block with SPA fallback
- React `frontend/dist/`: Deployed to `/os/` prefix in nginx root
- Static `dist/os/*`: Replaced at runtime by React SPA; static builder continues producing root files and optimized images
- No changes to `docker-compose.yml`, `docker-compose.prod.yml`, `site.json`, or React source
