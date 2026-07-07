# DevOps — Implementation Documentation
- **Current Score:** 65/100 | **Target Score:** 85/100 | **Gap:** 20 | **Last Updated:** 2026-07-06

## Overview / Current State
The project uses a multi-stage Dockerfile: a Node.js builder stage runs `assemble.mjs`, a Brotli compression stage pre-compresses static assets, and the final stage serves from nginx on Alpine. Docker Compose includes Traefik as a reverse proxy with automatic TLS via Let's Encrypt. Nginx runs as a non-root user (UID 101) and includes a `Docker HEALTHCHECK` instruction. A `/health` endpoint returns HTTP 200 for readiness probes.

GitHub Actions provides 3 CI/CD workflows:
- **`ci.yml`** — Build and validate on every push/PR
- **`deploy.yml`** — Build Docker image, push to registry, trigger deployment
- **`test.yml`** — Run Playwright E2E suite

Deployment targets are documented in `DEPLOYMENT.md` and include Coolify, AWS ECS, Kubernetes (manifests provided), Cloudflare Pages, and Netlify.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| DEV-001 | Uptime monitoring (UptimeRobot/Checkly) | High | 2 | Not Started |
| DEV-002 | Error tracking (Sentry/GlitchTip) | Medium | 4 | Not Started |
| DEV-003 | Automated KV/backup strategy | Medium | 3 | Not Started |
| DEV-004 | Staging environment parity | High | 6 | Not Started |

## Implementation Order
1. **DEV-001** — Configure external uptime monitoring. Create a status page or integrate with status badge.
2. **DEV-002** — Add client-side error tracking. Instrument 404s and JS errors with a lightweight error tracker.
3. **DEV-004** — Provision a staging environment that mirrors production (same Docker image, different config). Wire to `deploy-staging.yml`.
4. **DEV-003** — If stateful services are added (KV store, DB), implement backup automation. Currently not applicable for a static site.

## Dependencies
- DEV-004 depends on infrastructure provisioning (DNS, server, Traefik config).
- DEV-001 and DEV-002 are independent of each other and of other features.

## Key Files
| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build (builder → brotli → nginx) |
| `docker-compose.yml` | Traefik + nginx with TLS |
| `nginx.conf` | Non-root nginx, Brotli/Gzip, `/health`, caching |
| `.github/workflows/ci.yml` | Build + validate on push/PR |
| `.github/workflows/deploy.yml` | Docker build, push, deploy trigger |
| `.github/workflows/test.yml` | Playwright E2E test suite |
| `DEPLOYMENT.md` | Deployment target documentation |
| `k8s/*.yaml` | Kubernetes manifests (Deployment, Service, Ingress) |

## Acceptance Criteria
- [ ] Uptime ≥ 99.9% with monitoring alerts configured
- [ ] Staging environment is provisioned and mirrors production configuration
- [ ] Client-side errors are tracked with source maps for debugging
- [ ] Docker image builds are reproducible (same hash for same source)
- [ ] CI pipeline completes in under 3 minutes
- [ ] Deployments are zero-downtime (rolling update or blue/green)
- [ ] Container runs as non-root user with no privileged mode
- [ ] `/health` endpoint responds within 100ms
