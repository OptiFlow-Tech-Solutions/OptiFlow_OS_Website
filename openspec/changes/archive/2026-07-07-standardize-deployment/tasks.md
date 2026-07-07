## 1. Dockerfile Hardening

- [x] 1.1 Pin nginx base image to exact version `nginx:1.27.3-alpine` in both Stage 2 and Stage 3
- [x] 1.2 Pin node base image to `node:20.18-alpine` for reproducible builds
- [x] 1.3 Add `SHELL ["/bin/ash", "-eo", "pipefail", "-c"]` for pipefail safety in RUN commands
- [x] 1.4 Add `--no-cache` flag to `apk add` for smaller layer, then clean up build deps in brotli stage
- [x] 1.5 Add `npm cache clean --force` after `npm ci` in builder stage to reduce layer size
- [x] 1.6 Verify Dockerfile builds successfully locally: `docker build -t optiflow-website .`

## 2. Nginx Configuration Consolidation

- [x] 2.1 Merge `site.conf` server block into `nginx.conf` so there is a single nginx config file
- [x] 2.2 Verify all security headers present: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, CSP
- [x] 2.3 Fix trailing-slash redirect to handle mixed-case paths and query strings correctly
- [x] 2.4 Update Dockerfile COPY to reference the consolidated config path
- [x] 2.5 Update nixpacks.toml to reference the consolidated nginx config
- [x] 2.6 Remove `site.conf` after migration is verified

## 3. Nixpacks Production-Grade Deployment

- [x] 3.1 Rewrite `nixpacks.toml` to install nginx via nixpkg provider instead of `npx serve`
- [x] 3.2 Configure nixpacks `start.cmd` to launch nginx with the consolidated config
- [x] 3.3 Set `NIXPACKS_NODE_VERSION=20` in nixpacks config for deterministic builds
- [x] 3.4 Verify nixpacks build produces functionally equivalent deployment (same routes, compression, headers)
- [x] 3.5 Test nixpacks deployment locally or via `nixpacks build` if available

## 4. Docker Compose Improvements

- [x] 4.1 Bump memory limit from 128M to 256M in `docker-compose.yml`
- [x] 4.2 Create `docker-compose.prod.yml` — minimal production compose without Coolify/Traefik labels
- [x] 4.3 Add `docker-compose.prod.yml` entry to `.dockerignore` exceptions (allow in repo, exclude from image)
- [x] 4.4 Verify `docker compose up --build` succeeds with updated config

## 5. CI Docker Verification

- [x] 5.1 Add `docker` job to `.github/workflows/ci.yml` that builds the Docker image
- [x] 5.2 Configure Docker layer caching via `docker/build-push-action` in CI
- [x] 5.3 Add container smoke test: start container, curl `/health`, verify 200
- [x] 5.4 Add route verification: curl `/`, `/pricing/`, `/contact/`, `/demo-booking/`, `/robots.txt`, `/assets/css/core.css`, `/assets/js/core.js`
- [x] 5.5 Add 404 verification: curl `/nonexistent/` and verify 404 status
- [x] 5.6 Add job dependency: `docker` job runs after `validate` job, in parallel with E2E test job
- [x] 5.7 Run full CI locally or push to verify all jobs pass

## 6. Environment & Configuration

- [x] 6.1 Flesh out `.env.example` with all variables referenced in compose and nginx configs
- [x] 6.2 Add explanatory comments in `.env.example` for each variable's purpose and platform relevance
- [x] 6.3 Verify no secrets, API keys, or credentials are hardcoded in any config file
- [x] 6.4 Add `.env` to `.gitignore` if not already present

## 7. Deployment Documentation

- [x] 7.1 Rewrite `docs/DEPLOYMENT.md` with sections for each platform: Local, Docker, Docker Compose, Coolify (Dockerfile), Coolify (Nixpacks), Render, Railway, VPS, Cloudflare Pages, Netlify
- [x] 7.2 Add troubleshooting section covering: port conflicts, memory issues, Brotli build failures, 404 on subpages, healthcheck failures
- [x] 7.3 Add quick-start section: 3 commands to get running on any platform
- [x] 7.4 Update `docs/DOCKER.md` to reflect consolidated nginx config and pinned versions

## 8. Deployment Audit & Verification

- [x] 8.1 Run full build: `npm run build` and verify `dist/` contains all 16 pages + assets
- [x] 8.2 Run validator: `npm run validate` and ensure zero errors
- [x] 8.3 Build Docker image and verify all 14 marketing routes return 200
- [x] 8.4 Verify Docker healthcheck passes: `docker run --rm -d --name test-optiflow -p 8080:80 optiflow-website && sleep 20 && curl -sf http://localhost:8080/health && docker stop test-optiflow`
- [x] 8.5 Generate deployment audit report with framework, build dir, runtime, ports, routes, and readiness score
- [x] 8.6 Run Playwright E2E tests: `npm run test` and verify all pass
- [x] 8.7 Final review: verify all 13 steps from the original deployment standardization checklist are satisfied
