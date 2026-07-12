## Context

The OptiFlow website is currently a static HTML site built by `scripts/assemble.mjs` and served by Nginx in a single Docker container. The ARCHITECTURE.md defines a target state: React SPA frontend, Django REST API backend, PostgreSQL database, and Redis cache — all orchestrated by Docker Compose.

This change is Feature F-ARCH-001, the foundation. No pages get migrated, no design system components get built — just the scaffolding that makes every subsequent feature possible.

The legacy static site (`src/`, `assets/`, `scripts/`) is preserved intact as the visual specification and SEO fallback.

## Goals / Non-Goals

**Goals:**
- Working dev environment: `docker compose up` starts Django + PostgreSQL + Nginx, with Vite hot-reload on the host
- Django project with 4 app skeletons (`core`, `cms`, `blog`, `leads`) and DRF configured
- React scaffold with Vite, TypeScript, and a single "Hello World" page at `/os/`
- Health endpoint at `GET /api/health/` with DB connectivity check
- Nginx routing: `/os/*` → React (SPA fallback), `/api/*` → Django, static assets preserved
- All config via environment variables (`.env` file)

**Non-Goals:**
- Page migration (home, pricing, features, etc.) — separate change
- Design system components (Button, Card, etc.) — separate change
- Auth, admin, CMS, or any business logic
- Production hardening (Gunicorn config, SSL, rate limiting)
- Removing the legacy static build pipeline

## Decisions

### 1. Docker Compose orchestration (not npm workspaces)

**Decision:** Use Docker Compose as the orchestrator. No monorepo tool (Turborepo, Nx, Lerna).

**Rationale:** The stack spans Python and Node — npm workspaces can't manage Python dependencies. Docker Compose already defines service dependencies, networking, and volumes. Adding a monorepo tool would duplicate orchestration logic without benefit at this scale.

**Alternatives considered:**
- *Turborepo/Nx* — powerful for multi-package Node projects, but Django has no package.json. Would require custom task runners just for the backend. Overkill for 2 services.
- *Makefile* — simple but platform-dependent. Docker Compose is cross-platform already.

### 2. Vite dev server on host, not containerized

**Decision:** Run Vite dev server directly on the host (port 5173), not inside a Docker container. Nginx proxies `/os/*` to `host.docker.internal:5173` in dev mode.

**Rationale:** Hot Module Replacement (HMR) over Docker volumes is slow and unreliable on Windows/macOS. Running Vite natively gives instant HMR, proper source maps, and simpler debugging. Developers run `npm run dev` in `frontend/` separately.

**Alternatives considered:**
- *Containerized Vite with bind mounts* — HMR can break due to filesystem event propagation issues across OS boundaries. Docker Desktop on Windows is particularly problematic.
- *Vite in Docker with polling* — Works but slower, higher CPU, worse DX.

### 3. Django project structure: flat apps, not nested

**Decision:** `backend/config/` for project settings, `backend/<app_name>/` for each Django app (core, cms, blog, leads). No `backend/apps/` nesting.

**Rationale:** Django's default project layout is flat. Nesting under `apps/` adds an extra `sys.path` entry and confuses Django's app discovery. The ARCHITECTURE.md shows nested apps, but that's the planned full implementation — for the scaffold, simpler is better.

### 4. CSS Modules over Tailwind for the scaffold

**Decision:** Use CSS Modules (`.module.css` files) for the initial React scaffold. Do not add Tailwind CSS in this change.

**Rationale:** The ARCHITECTURE.md decision record says "CSS Modules over Tailwind — Closer to existing core.css system; explicit class naming." The existing `core.css` uses CSS custom properties — CSS Modules compose naturally with those. Tailwind would require a full theme configuration + design token reconciliation, which is Feature 02 territory (Design System Foundation). The scaffold needs minimal styling (just enough to verify the dev pipeline works).

**Alternatives considered:**
- *Tailwind from day one* — Would force premature design token decisions. Better to add in Feature 02 when the design system component library is built.

### 5. Single Nginx config for dev and prod (with conditional logic)

**Decision:** One `nginx.conf` that uses upstream server variables. Dev mode points to `host.docker.internal:5173` for React and `api:8000` for Django. Prod mode points to static files for React and `api:8000` for Django. The distinction is controlled by `NGINX_DEV_MODE` environment variable or a separate `nginx.prod.conf`.

**Rationale:** Two configs risk drift. The dev/prod difference is only the React serving strategy (Vite proxy vs static files). Everything else (API proxy, security headers, caching) is identical.

### 6. PostgreSQL 16, not SQLite for dev

**Decision:** Use PostgreSQL even in local development, matching the production target.

**Rationale:** "Works on SQLite, breaks on PostgreSQL" is a classic Django problem — differences in JSON field handling, full-text search, case sensitivity, and constraint enforcement. Docker makes PostgreSQL zero-setup (one line in docker-compose.yml).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Django/React dev servers consume high resources on dev machines | Docker Compose resource limits (CPU 0.5, memory 256M per service). Vite runs natively (minimal overhead). |
| `host.docker.internal` not available on Linux | Provide fallback using `network_mode: host` or `extra_hosts` in docker-compose.override.yml for Linux users. Document in SETUP.md. |
| Port conflicts (80, 5173, 8000, 5432, 6379) with existing services | Document in SETUP.md. Use `.env` overrides for all ports. |
| Windows line endings (CRLF) break Docker entrypoint scripts | `.editorconfig` already enforces LF. Add `.gitattributes` for shell scripts. |
| Legacy E2E tests break because `/os/*` now serves React instead of static HTML | Skip E2E tests in CI for this change. They'll be re-enabled once page migration is complete. Document in tasks.md. |
| Scope creep into design system or page migration | Strictly limit to scaffolding. Any page content beyond a placeholder "Hello World" is out of scope. |

## Open Questions

- Should Redis be included now or deferred to the feature that needs it (Celery, caching)? Currently leaning: include as optional service, started but not required for health check.
- Django app names: `core`, `cms`, `blog`, `leads` match the ARCHITECTURE.md. Do we also scaffold `accounts` (auth), `faq`, `newsletter`, `resources` now or later? Currently leaning: only the 4 specified in the feature, defer the rest.
