## 1. Root Configuration & Environment Setup

- [x] 1.1 [DEVOPS] Extend `.env.example` with all service variables — `D:\OptiFlow_OS_Website\.env.example`
- [x] 1.2 [DEVOPS] Add Django/Python entries to `.gitignore` — `D:\OptiFlow_OS_Website\.gitignore`
- [x] 1.3 [DEVOPS] Add `.gitattributes` with LF enforcement for `.sh`, `.py`, `.yml` files — `D:\OptiFlow_OS_Website\.gitattributes`
- [x] 1.4 [DOCS] Update root `package.json` scripts (`frontend:dev`, `dev:full`, `backend:manage`, `docker:compose`) — `D:\OptiFlow_OS_Website\package.json`

## 2. Frontend Scaffold (React + Vite + TypeScript)

- [x] 2.1 [FRONTEND] Scaffold Vite + React + TypeScript in `frontend/` — `D:\OptiFlow_OS_Website\frontend\`
- [x] 2.2 [FRONTEND] Create `frontend/vite.config.ts` with `/os/` base path and dev proxy to Django — `D:\OptiFlow_OS_Website\frontend\vite.config.ts`
- [x] 2.3 [FRONTEND] Create minimal `frontend/src/App.tsx` with React Router at `/os/` — `D:\OptiFlow_OS_Website\frontend\src\App.tsx`
- [x] 2.4 [FRONTEND] Create `frontend/src/main.tsx` entry point — `D:\OptiFlow_OS_Website\frontend\src\main.tsx`
- [x] 2.5 [FRONTEND] Add placeholder `frontend/src/pages/Home.tsx` component — `D:\OptiFlow_OS_Website\frontend\src\pages\Home.tsx`
- [x] 2.6 [FRONTEND] Verify `npm run dev` in `frontend/` starts on port 5173

## 3. Backend Scaffold (Django + DRF)

- [x] 3.1 [BACKEND] Create `backend/requirements.txt` with Django 5, DRF, django-cors-headers, psycopg2-binary, gunicorn — `D:\OptiFlow_OS_Website\backend\requirements.txt`
- [x] 3.2 [BACKEND] Initialize Django project: `backend/manage.py`, `backend/config/settings.py`, `backend/config/urls.py`, `backend/config/wsgi.py` — `D:\OptiFlow_OS_Website\backend\`
- [x] 3.3 [BACKEND] Configure `backend/config/settings.py` — PostgreSQL DATABASES from env vars, DRF defaults, CORS settings, installed apps — `D:\OptiFlow_OS_Website\backend\config\settings.py`
- [x] 3.4 [BACKEND] Create Django app skeletons: `core/`, `cms/`, `blog/`, `leads/` with `models.py`, `views.py`, `urls.py`, `admin.py`, `apps.py` — `D:\OptiFlow_OS_Website\backend\core\`, etc.
- [x] 3.5 [BACKEND] Create `GET /api/health/` endpoint in `core/views.py` with DB connectivity check — `D:\OptiFlow_OS_Website\backend\core\views.py`
- [x] 3.6 [BACKEND] Wire health endpoint URL in `core/urls.py` and include in `config/urls.py` under `/api/` prefix — `D:\OptiFlow_OS_Website\backend\core\urls.py`
- [x] 3.7 [BACKEND] Create `backend/Dockerfile` — Python 3.12-slim, install deps, copy source, run gunicorn — `D:\OptiFlow_OS_Website\backend\Dockerfile`

## 4. Docker & Infrastructure

- [x] 4.1 [DEVOPS] Extend `docker-compose.yml` — add services: `api` (Django, port 8000), `db` (PostgreSQL 16, port 5432), `redis` (optional, port 6379) — `D:\OptiFlow_OS_Website\docker-compose.yml`
- [x] 4.2 [DEVOPS] Add PostgreSQL named volume and health checks to docker-compose.yml — `D:\OptiFlow_OS_Website\docker-compose.yml`
- [x] 4.3 [DEVOPS] Add `host.docker.internal` extra_hosts mapping for Vite dev proxy on Linux — `D:\OptiFlow_OS_Website\docker-compose.yml`
- [x] 4.4 [DEVOPS] Update `nginx.conf` — add `/api/` proxy_pass to Django, add `/os/` SPA try_files fallback — `D:\OptiFlow_OS_Website\nginx.conf`
- [x] 4.5 [DEVOPS] Update `Dockerfile` — add React build stage, copy `frontend/dist/` into nginx runtime — `D:\OptiFlow_OS_Website\Dockerfile`
- [x] 4.6 [DEVOPS] Create `docker-compose.override.yml` for Linux hosts (alternative to `host.docker.internal`) — `D:\OptiFlow_OS_Website\docker-compose.override.yml`

## 5. Integration & Verification

- [x] 5.1 [TEST] Verify `docker compose up` starts all services without errors
- [x] 5.2 [TEST] Verify `GET /api/health/` returns JSON with database status via Nginx proxy
- [x] 5.3 [TEST] Verify `GET /os/` serves React app (Vite dev server via Nginx proxy, or static files via Docker)
- [x] 5.4 [TEST] Verify `docker compose exec api python manage.py migrate` applies all migrations
- [x] 5.5 [TEST] Verify Django admin is accessible at `/admin/` via Nginx proxy
- [x] 5.6 [DOCS] Update `SETUP.md` with full-stack dev onboarding steps — `D:\OptiFlow_OS_Website\docs\SETUP.md`
- [x] 5.7 [DOCS] Update `ARCHITECTURE.md` to mark current state as "In Progress" — `D:\OptiFlow_OS_Website\docs\ARCHITECTURE.md`
