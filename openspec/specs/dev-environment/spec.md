# dev-environment

## Purpose

Docker Compose multi-service dev environment (React, Django, PostgreSQL, Nginx) with hot reload.

## Requirements

### Requirement: Docker Compose starts all services
Running `docker compose up` from the project root SHALL start and health-check all services: Nginx (port 80), Django (port 8000 internal), PostgreSQL (port 5432), and an optional Redis (port 6379) service. The React frontend SHALL run on the host via Vite dev server (port 5173) for hot module replacement during development.

#### Scenario: All services start without errors
- **WHEN** `docker compose up` is executed
- **THEN** all services reach the `healthy` or `running` state within 60 seconds

#### Scenario: Nginx proxies to Django
- **WHEN** `GET http://localhost/api/health/` is requested
- **THEN** the Django health endpoint responds with JSON through the Nginx proxy

#### Scenario: Nginx serves React dev server
- **WHEN** `GET http://localhost/os/` is requested in dev mode
- **THEN** Nginx proxies to the Vite dev server at `http://host.docker.internal:5173`

#### Scenario: PostgreSQL accepts connections
- **WHEN** `docker compose exec db psql -U optiflow -d optiflow_dev -c "SELECT 1"` is executed
- **THEN** the query returns without error

### Requirement: Docker Compose uses named volumes for persistence
The PostgreSQL service SHALL use a named Docker volume for data persistence. The database data SHALL survive `docker compose down` when volumes are not explicitly removed.

#### Scenario: Data persists across restarts
- **WHEN** `docker compose down` is executed without `--volumes`, then `docker compose up`
- **THEN** previously created database records still exist

#### Scenario: Volumes can be reset
- **WHEN** `docker compose down --volumes` is executed
- **THEN** the database starts fresh on the next `docker compose up`

### Requirement: Services have health checks
The PostgreSQL and Django services SHALL have Docker health checks. Nginx SHALL continue its existing health check.

#### Scenario: PostgreSQL health check passes
- **WHEN** the PostgreSQL container is inspected after startup
- **THEN** `docker compose ps` shows the db service as `healthy`

#### Scenario: Django health check passes
- **WHEN** the Django container is inspected after startup
- **THEN** `docker compose ps` shows the api service as `healthy`

### Requirement: Hot reload works for Django development
The Django service SHALL use Django's development server with `--reload` flag, so code changes to Python files trigger automatic restart.

#### Scenario: Django reloads on code change
- **WHEN** a Python file in `backend/` is modified
- **THEN** the Django dev server restarts and picks up the change

### Requirement: Environment variables are loaded from .env
All services SHALL read configuration from environment variables defined in the `.env` file, with sensible defaults in `docker-compose.yml` for development.

#### Scenario: Django reads DB credentials from env
- **WHEN** `.env` contains `DB_PASSWORD=devpass`
- **THEN** Django connects to PostgreSQL using that password

#### Scenario: Missing .env file uses defaults
- **WHEN** no `.env` file exists and `docker compose up` runs
- **THEN** services start with hardcoded dev defaults from docker-compose.yml
