## Why

The OptiFlow website is a static HTML site with a custom build pipeline. Every planned feature (demo bookings, lead management, blog, admin, payments, 60 total features) requires a backend and a frontend framework. The ARCHITECTURE.md has the target blueprint fully specified; this change executes the foundation — scaffolding the monorepo with React, Django, and PostgreSQL so all subsequent vertical slices have a working dev environment to build against.

Reference: WEBSITE_FEATURE_INVENTORY.md §Feature 01 (`F-ARCH-001`).

## What Changes

- Create `frontend/` directory with Vite + React 19 + TypeScript scaffold matching existing design system
- Create `backend/` directory with Django 5 + DRF project and app skeletons (`core`, `cms`, `blog`, `leads`)
- Extend `docker-compose.yml` from single-service (Nginx) to multi-service (React dev + Django + PostgreSQL + Nginx)
- Create `GET /api/health/` endpoint returning JSON status with DB connectivity check
- Extend `nginx.conf` to reverse-proxy `/api/*` to Django and `/os/*` to React dev server (dev mode) or static files (prod)
- Initialize PostgreSQL with Django migrations and dev seed data
- Wire Django settings for CORS, environment variables, and JWT auth

## Capabilities

### New Capabilities

- `arch-monorepo-scaffold`: Monorepo structure with `frontend/`, `backend/`, shared root configs, and unified dev workflow
- `django-backend-init`: Django 5 project initialization, DRF setup, app skeletons, health endpoint, CORS config
- `dev-environment`: Docker Compose multi-service dev environment (React, Django, PostgreSQL, Nginx) with hot reload

### Modified Capabilities

- `docker-deployment`: Extend from single-service static Nginx image to multi-service compose with React build, Django backend, PostgreSQL, and Redis
- `nginx-serving`: Add `/api/*` reverse proxy to Django backend; add `/os/*` SPA fallback for client-side routing

## Impact

- `frontend/` — New directory: Vite + React + TypeScript (scaffolded from scratch)
- `backend/` — New directory: Django project + apps (scaffolded from scratch)
- `docker-compose.yml` — Extended: 4 services (web, api, db, redis) from current 1 service (web)
- `nginx.conf` — Extended: `/api/*` proxy_pass to Django, `/os/*` SPA try_files
- `Dockerfile` — Extended: React build stage added to multi-stage build
- `site.json` — Unchanged (remains canonical data source)
- `package.json` — Updated: new scripts for frontend dev, combined dev, and backend management
- `src/` — Unchanged (preserved as visual spec during migration)
- All existing E2E tests — May need path updates to match new SPA routing

## Non-goals

- Page migration to React (Feature 05–15, separate change)
- Design system component library (Feature 02, separate change)
- Auth system or admin dashboard (Phase 3 features)
- Production deployment config (separate `docker-compose.prod.yml` change)
- Removing the static site — it stays as the visual specification
