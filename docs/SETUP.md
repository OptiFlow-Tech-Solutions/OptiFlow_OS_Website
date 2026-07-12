# OptiFlow OS Website — Developer Setup Guide

**Version:** 1.0.0 | **Date:** 2026-07-09

## Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Node.js | 18.0+ | `node --version` |
| npm | 9.0+ | `npm --version` |
| Python | 3.12+ | `python --version` |
| Docker | 24.0+ | `docker --version` |
| Docker Compose | 2.20+ | `docker compose version` |
| Git | 2.40+ | `git --version` |

## Quick Start (Full Stack)

```bash
git clone <repo-url>
cd OptiFlow_OS_Website

# Copy environment file
cp .env.example .env
# Edit .env with your values (or use defaults for dev)

# Start all services
docker compose up --build
```

Services available at:
- **Website:** http://localhost (Nginx, port 80)
- **React Dev:** http://localhost:5173 (Vite HMR — run `cd frontend && npm run dev` separately)
- **Django API:** http://localhost/api/health/ (proxied through Nginx)
- **Django Admin:** http://localhost/admin/
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Alternative: Frontend-only dev (recommended for UI work)

```bash
# Terminal 1: Start backend services
docker compose up -d db redis api

# Terminal 2: Start frontend with hot reload
cd frontend
npm install
npm run dev
# Visit http://localhost:5173/os/
```

The Vite dev server proxies `/api/*` to `http://localhost` (Nginx → Django).

## Quick Start (Frontend Only)

```bash
cd frontend
npm install
npm run dev
```

## Quick Start (Legacy Static Site)

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Environment Variables

See `.env.example` for all variables. Key variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `DJANGO_SECRET_KEY` | Django secret | Random 50-char string |
| `DJANGO_DEBUG` | Django debug | `True` / `False` |
| `DATABASE_URL` | PostgreSQL URL | `postgres://user:pass@localhost:5432/optiflow` |
| `REDIS_URL` | Redis URL | `redis://localhost:6379/0` |
| `VITE_API_BASE_URL` | Frontend API URL | `http://localhost:8000/api` |
| `EMAIL_HOST` | SMTP host | `smtp.resend.com` |

## Project Structure

```
OptiFlow_OS_Website/
├── frontend/          # React SPA (Vite + TypeScript)
├── backend/           # Django 5 + DRF 3
├── src/               # Legacy static HTML (preserved as visual spec)
├── docs/              # Documentation
├── tests/             # Test suites
├── docker-compose.yml # Multi-service orchestration
├── nginx.conf         # Production nginx config
└── site.json          # Canonical company data
```

## Development Workflow

1. Create feature branch: `git checkout -b feature/F-XXX-name`
2. Write tests first (TDD)
3. Implement feature as complete vertical slice
4. Run all tests: `docker compose exec backend pytest` + `docker compose exec frontend npm test`
5. Run E2E: `npm run test:e2e`
6. Open PR → CI runs → code review → merge

## Common Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server with HMR
npm run build        # Production build
npm run lint         # ESLint + Prettier
npm run test         # Vitest unit tests
npm run typecheck    # TypeScript check
```

### Backend
```bash
# Management commands via Docker (recommended)
npm run backend:manage -- migrate
npm run backend:manage -- createsuperuser
npm run backend:shell

# Or directly
docker compose exec api python manage.py migrate
docker compose exec api python manage.py createsuperuser
docker compose exec api python manage.py shell
```

### Docker
```bash
docker compose up -d db redis          # Start database + cache only
docker compose up -d api               # Start backend (depends on db)
docker compose up --build              # Start all services with rebuild
docker compose down                    # Stop all services
docker compose down --volumes          # Stop + remove all data (fresh start)
docker compose logs -f api             # View backend logs
docker compose exec api bash           # Shell into backend container
```

### Legacy Static Site
```bash
npm run build       # Build dist/
npm run validate    # Run validation
npm run test:e2e    # Run E2E tests
npm run lint:all    # Lint everything
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 80 in use | Change `PORT` in .env |
| PostgreSQL connection refused | Wait for DB health check; verify DATABASE_URL |
| npm install fails | Delete node_modules + package-lock.json, retry |
| Django migrations fail | `docker compose exec backend python manage.py migrate --fake-initial` |
| Docker build slow | Enable BuildKit: `export DOCKER_BUILDKIT=1` |
| Form submission returns 503 | Backend not running; start with `docker compose up` |
