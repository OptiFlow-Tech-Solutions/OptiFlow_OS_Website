# Docker Deployment

**Purpose:** Ensure the OptiFlow website builds and runs correctly as a multi-service Docker environment. Covers multi-stage builds (static site + React SPA + Nginx), multi-service Compose orchestration (web, api, db, redis), non-root execution, health checks, route serving, layer caching, and pinned base image versions.

## Requirements

### Requirement: Docker Compose includes all services
The `docker-compose.yml` SHALL define services for `web` (Nginx), `api` (Django/Gunicorn), `db` (PostgreSQL), and `redis` (Redis), replacing the current single-service `web` only configuration.

#### Scenario: docker-compose.yml defines 4+ services
- **WHEN** `docker compose config --services` is executed
- **THEN** output lists at minimum `web`, `api`, `db`, and `redis`

#### Scenario: Services are on the same network
- **WHEN** `docker compose config` is inspected
- **THEN** all services share a common Docker network for internal communication

### Requirement: Multi-stage Dockerfile includes React build
The `Dockerfile` SHALL include a React build stage that compiles the `frontend/` directory and copies the output into the Nginx runtime stage alongside the static site assets.

#### Scenario: React build stage is present
- **WHEN** the Dockerfile is inspected
- **THEN** it contains a stage that runs `npm run build` in the `frontend/` directory

#### Scenario: React dist is in final image
- **WHEN** the built image is inspected
- **THEN** `/usr/share/nginx/html/os/` contains a React `index.html` with module script tags

### Requirement: Backend Dockerfile exists
The `backend/` directory SHALL contain a `Dockerfile` that builds a Django-ready Python image with dependencies installed and the application code copied.

#### Scenario: Backend Dockerfile builds successfully
- **WHEN** `docker compose build api` is executed
- **THEN** the backend image builds without errors

#### Scenario: Backend image is minimal
- **WHEN** the built backend image size is inspected
- **THEN** it is under 300MB compressed

### Requirement: Multi-stage Docker build succeeds
The Dockerfile SHALL use a multi-stage build that compiles the React SPA (`frontend/dist/`) and the static site (`dist/`) in separate Node.js stages, then copies both outputs plus nginx config into a minimal nginx runtime stage. The final image SHALL be non-root and SHALL expose port 80.

#### Scenario: Build completes without error
- **WHEN** `docker compose build web` is executed
- **THEN** the build completes with exit code 0

#### Scenario: Final image runs as non-root
- **WHEN** the web container is started
- **THEN** `whoami` inside the container returns `nginx`, not `root`

#### Scenario: Health endpoint responds
- **WHEN** `curl -sf http://localhost/health` is requested from inside the web container
- **THEN** the response is HTTP 200 with body `ok`

### Requirement: Docker image serves all routes
The Docker web container SHALL serve the React SPA at `/os/*` paths (with SPA client-side routing fallback), static SEO artifacts (robots.txt, sitemap.xml, manifest.json), and proxy API requests to the Django backend at `/api/*`. The legacy static HTML pages under `/os/*` SHALL be replaced by the React SPA at runtime.

#### Scenario: React SPA serves at /os/
- **WHEN** `GET /os/` is requested
- **THEN** response status is 200 and Content-Type is `text/html` from the React build

#### Scenario: SPA fallback for client-side routes
- **WHEN** `GET /os/pricing/` is requested
- **THEN** nginx returns `/os/index.html` via try_files for React Router to handle

#### Scenario: SEO artifacts are reachable
- **WHEN** `GET /robots.txt`, `GET /sitemap.xml`, and `GET /manifest.json` are requested
- **THEN** each returns HTTP 200

#### Scenario: API requests are proxied
- **WHEN** `GET /api/health/` is requested
- **THEN** nginx proxies the request to the Django backend and returns the JSON response

#### Scenario: Missing page returns 404
- **WHEN** `GET /nonexistent-page/` is requested
- **THEN** response status is 404

#### Scenario: Static assets are reachable
- **WHEN** `GET /assets/css/core.css` and `GET /assets/js/core.js` are requested
- **THEN** each returns HTTP 200

### Requirement: Dockerfile caches build layers
The Dockerfile SHALL order COPY instructions so that dependencies are installed before source files, maximizing layer cache reuse.

#### Scenario: Dependency layer cached on rebuild
- **WHEN** only a source file changes and the image is rebuilt
- **THEN** the `npm ci` layer is retrieved from cache, not re-executed

### Requirement: Pinned base image versions
The Dockerfile SHALL use exact version tags for base images to prevent silent ABI breakage of compiled Brotli modules.

#### Scenario: Dockerfile uses explicit version
- **WHEN** the Dockerfile is inspected
- **THEN** the nginx FROM line specifies a major.minor.patch version (e.g., `nginx:1.27.3-alpine`) rather than a floating tag
