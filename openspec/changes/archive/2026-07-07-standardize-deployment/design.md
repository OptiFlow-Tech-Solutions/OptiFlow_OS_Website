## Context

The OptiFlow website is a custom static site with 16 pages built by `scripts/assemble.mjs`. It deploys to five platforms via three build methods:

| Path | Build | Serve | Production? |
|------|-------|-------|-------------|
| Docker (Dockerfile) | `node:20-alpine` → `scripts/assemble.mjs` | nginx:1.27-alpine + Brotli | Yes |
| Nixpacks (nixpacks.toml) | `npm ci && npm run build` | `npx serve dist -l 80` | No (dev server) |
| Cloudflare Pages (wrangler) | GitHub Actions | Cloudflare edge | Yes |
| Netlify (netlify.toml) | `npm run deploy` | Netlify CDN | Yes |

The Docker and Nixpacks paths serve different container platforms (Coolify, Railway, Render, VPS, Docker Compose). Currently they are not equivalent — Nixpacks lacks compression, security headers, caching, and healthcheck.

The CI (ci.yml) validates the static build and runs Playwright E2E tests but never builds or smoke-tests the Docker image. A broken nginx config or Dockerfile regression would pass CI unnoticed.

## Goals / Non-Goals

**Goals:**
- Make Docker and Nixpacks deployments functionally equivalent — both serve via nginx with compression, security headers, and caching
- Add Docker image build + smoke test to CI so container regressions are caught pre-merge
- Consolidate nginx configuration into a single source of truth with clear module structure
- Document every deployment platform with step-by-step instructions and troubleshooting

**Non-Goals:**
- Changing the static build pipeline (`scripts/assemble.mjs`)
- Adding a backend API to Docker deployments (forms remain Cloudflare Workers-only)
- Changing Cloudflare Pages or Netlify deployment configs
- Adding Kubernetes manifests (already documented in DEPLOYMENT.md, out of scope)
- Modifying source pages, assets, or design system

## Decisions

### Decision 1: Nixpacks should use nginx, not `npx serve`

**Chosen:** Install nginx via nixpkg provider and configure it identically to the Docker path.

**Rationale:** `npx serve` is a single-threaded Node dev server with zero production features. nginx gives Brotli/Gzip compression, security headers, cache policies, healthcheck endpoint, and proper 404 handling. The Docker path already has this — Nixpacks should too.

**Alternatives considered:**
- Keep `npx serve` and document it as "dev only" → creates a two-tier deployment where the Nixpacks path is permanently inferior. Users who start with Nixpacks on Coolify get a worse experience without knowing why.
- Use Caddy instead of nginx → Caddy has auto-HTTPS and simpler config, but it's not available as a standard nixpkg and adds another server to maintain. nginx is already configured and tested.

### Decision 2: Keep Brotli compilation in Dockerfile (don't switch package source)

**Chosen:** Keep Stage 2 compiling `ngx_brotli` from source. Pin nginx version explicitly.

**Rationale:** The Alpine `nginx` package does not ship Brotli modules via `apk`. The alternative is switching to `nginxinc/nginx-unprivileged` image which bundles Brotli but is a different base. Compiling from source is fragile but correct. The mitigation is pinning the exact nginx version (`nginx:1.27.3-alpine` instead of `nginx:1.27-alpine`) so patch updates don't silently break the module ABI.

**Alternatives considered:**
- `nginxinc/nginx-unprivileged:1.27-alpine` → bundles Brotli, no compilation needed. But it runs as non-root by default and changes the user model. Worth evaluating in a future iteration but adds scope.
- Remove Brotli, gzip only → Brotli saves ~20% vs gzip on HTML/CSS. The compile stage adds ~30s to build. Worth the tradeoff for a static site where asset size directly impacts UX.

### Decision 3: Consolidate nginx config files

**Chosen:** Merge `nginx.conf` (global settings) and `site.conf` (server block) into a single `/etc/nginx/conf.d/default.conf`. Keep the main `nginx.conf` minimal.

**Rationale:** The current split is nominal — `site.conf` is the only `conf.d` file. Consolidating reduces the file count and makes the config self-contained per server block. The main `nginx.conf` stays as a thin wrapper for global settings (worker processes, mime types).

### Decision 4: CI adds a Docker verification job (new, not modifying existing)

**Chosen:** Add a new `docker` job to `ci.yml` that runs after `validate` and in parallel with the E2E test. It builds the Docker image, runs the container, curls `/health` and three key routes, then stops.

**Rationale:** The E2E tests validate the static site via `npx serve`. The Docker job validates the containerized deployment path. Both paths need to work. Running them in parallel keeps CI fast.

### Decision 5: Resource limits in docker-compose match ECS recommendations

**Chosen:** Bump `docker-compose.yml` memory from 128M to 256M (matches mid-point between current 128M and ECS doc's 512M). Keep CPU at 0.5.

**Rationale:** 128MB is functional for nginx + Brotli but tight — spikes during Brotli compression of large pages can OOM. 256MB provides headroom. The ECS doc recommends 512MB which includes Fargate overhead.

## Risks / Trade-offs

- **[Risk] Brotli compilation breaks on nginx patch update** → Mitigation: Pin exact version `nginx:1.27.3-alpine`, add daily Dependabot for base images
- **[Risk] Nixpacks nginx config path differs from Docker** → Mitigation: Nixpacks mounts config at build time via `nixpacks.toml` setup commands. Test both paths in CI.
- **[Risk] Adding Docker build to CI increases CI time by ~2 minutes** → Mitigation: Run in parallel with existing E2E job. Cache Docker layers via `docker/build-push-action`.
- **[Trade-off] Docker image size increases slightly if nginx config is baked in via COPY instead of volume** → Acceptable — the image is already ~25MB compressed. Config-as-file means zero runtime configuration needed.

## Open Questions

- **Q:** Should the Nixpacks path also include Brotli, or is gzip sufficient?  
  **A:** Gzip-only for Nixpacks. Installing Brotli via nixpkgs requires a custom provider, which complicates the Nixpacks config. gzip at level 6 provides adequate compression for most use cases.

- **Q:** Should we add a `docker-compose.prod.yml` with Traefik labels removed?  
  **A:** Yes — a minimal production compose without Coolify-specific labels for users on plain Docker hosts.
