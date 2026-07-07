## Why

The OptiFlow website supports five deployment targets (Docker/Coolify, Nixpacks, Cloudflare Pages, Netlify, manual VPS) but the Docker and Nixpacks paths have diverged — Docker gets production-grade nginx with Brotli, security headers, and healthchecks while Nixpacks serves raw files via a dev server. CI validates the static build but never verifies the Docker image. This means containerized deployments can break silently and platform parity is an illusion.

## What Changes

- **Fix Nixpacks deployment** to use nginx instead of `npx serve`, matching the Docker path in compression, security, and caching
- **Add Docker image verification to CI** — build the image, run it, curl the healthcheck, verify key routes return 200
- **Standardize nginx configuration** — consolidate `nginx.conf`, `site.conf`, and the Dockerfile's Brotli stage into a single source of truth
- **Add `.env.example` completeness** — document all env vars needed for production deployment
- **Update DEPLOYMENT.md** — cover all platforms (Coolify Dockerfile, Coolify Nixpacks, Render, Railway, VPS, Docker Compose, Cloudflare) with troubleshooting
- **Add `docker-compose.prod.yml`** — production compose file with proper resource limits matching ECS recommendations
- **Verify all 14 routes** serve correctly (200 for pages, 200 for assets, proper 404 handling)
- **Generate deployment audit report** — scorecard of detected framework, ports, routes, and readiness

## Capabilities

### New Capabilities
- `docker-deployment`: Production-ready multi-stage Docker image builds correctly, serves all routes, passes healthcheck, runs as non-root user with Brotli compression
- `nginx-serving`: nginx configuration with Brotli/Gzip compression, security headers (HSTS, CSP, X-Frame-Options), asset caching (1y for static, no-cache for HTML), SPA fallback, trailing-slash redirects, `/health` endpoint
- `nixpacks-deployment`: Nixpacks build path produces functionally equivalent deployment to Docker path — nginx serving with compression and security headers instead of `npx serve`
- `ci-deployment-gates`: CI pipeline verifies Docker image builds successfully, container starts and passes healthcheck, all 14 page routes return HTTP 200, static assets are reachable

### Modified Capabilities
- _None_ — no existing deployment specs found in `openspec/specs/`

## Impact

- **Dockerfile**: Stage 2 (Brotli builder) and Stage 3 (runtime) may be refactored to use pre-built nginx with Brotli support instead of compiling from source
- **nginx.conf + site.conf**: Merged into single `nginx/default.conf` template with platform-appropriate overrides
- **nixpacks.toml**: Rewritten to install and configure nginx instead of using `npx serve`
- **.env.example**: Fleshed out with all deployment-relevant variables
- **.github/workflows/ci.yml**: New Docker build + smoke test job added
- **docker-compose.yml**: Resource limits adjusted, production variant created
- **docs/DEPLOYMENT.md**: Rewritten with platform-specific instructions and troubleshooting
- **No changes** to `src/pages/`, `assets/`, `scripts/assemble.mjs`, `site.json`, or Cloudflare/Netlify configs
