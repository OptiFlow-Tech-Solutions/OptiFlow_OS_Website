# django-backend-init

## Purpose

Django 5 project initialization, DRF setup, app skeletons, health endpoint, CORS config.

## Requirements

### Requirement: Django project is initialized
The `backend/` directory SHALL contain a Django 5 project with the configuration package at `backend/config/` containing `settings.py`, `urls.py`, `wsgi.py`, and `asgi.py`.

#### Scenario: Django management command works
- **WHEN** `python manage.py check` is executed in `backend/`
- **THEN** Django reports zero issues

#### Scenario: Settings module is importable
- **WHEN** `DJANGO_SETTINGS_MODULE=config.settings python -c "import django; django.setup()"` is executed
- **THEN** the command completes without error

#### Scenario: Database connection is configured
- **WHEN** settings are inspected
- **THEN** `DATABASES['default']` is configured for PostgreSQL using environment variables `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

### Requirement: Django app skeletons exist
The `backend/` directory SHALL contain the following Django app packages, each with `models.py`, `views.py`, `urls.py`, `admin.py`, and `apps.py`: `core`, `cms`, `blog`, `leads`.

#### Scenario: Core app is registered
- **WHEN** `INSTALLED_APPS` is inspected
- **THEN** `core`, `cms`, `blog`, and `leads` are all listed

#### Scenario: App models files are empty but present
- **WHEN** `backend/core/models.py` is inspected
- **THEN** it exists and contains at minimum a module docstring

### Requirement: Django REST Framework is configured
The backend SHALL include `djangorestframework` in `INSTALLED_APPS` with default configurations for JSON rendering, pagination, and authentication classes.

#### Scenario: DRF is installed
- **WHEN** `pip list` is executed in the backend container
- **THEN** `djangorestframework` appears in the installed packages

#### Scenario: DRF default settings are configured
- **WHEN** `REST_FRAMEWORK` setting is inspected
- **THEN** it includes `DEFAULT_RENDERER_CLASSES`, `DEFAULT_PAGINATION_CLASS`, and `DEFAULT_AUTHENTICATION_CLASSES`

### Requirement: Health endpoint returns JSON
The `core` app SHALL expose `GET /api/health/` that returns a JSON object with `status: "ok"`, current timestamp, and database connectivity status.

#### Scenario: Health endpoint returns 200
- **WHEN** `GET /api/health/` is requested
- **THEN** response status is 200 with `Content-Type: application/json`

#### Scenario: Health endpoint includes DB status
- **WHEN** `GET /api/health/` is requested and database is accessible
- **THEN** response body includes `"database": "connected"`

#### Scenario: Health endpoint reports DB failure
- **WHEN** `GET /api/health/` is requested and database is unreachable
- **THEN** response status is 503 with `"database": "disconnected"`

### Requirement: CORS is configured for development
The backend SHALL include `django-cors-headers` with `CORS_ALLOWED_ORIGINS` configured from an environment variable, defaulting to `http://localhost:5173` for the Vite dev server.

#### Scenario: CORS allows Vite dev server
- **WHEN** a preflight `OPTIONS` request is sent from `http://localhost:5173`
- **THEN** response includes `Access-Control-Allow-Origin: http://localhost:5173`

#### Scenario: CORS blocks unknown origins
- **WHEN** a request is sent from an origin not in the allowlist
- **THEN** response does not include `Access-Control-Allow-Origin` header

### Requirement: Initial database migrations exist
Running `python manage.py migrate` SHALL create all default Django tables (auth, sessions, admin, contenttypes) in the configured PostgreSQL database.

#### Scenario: Migrations apply without error
- **WHEN** `python manage.py migrate` is executed against a clean database
- **THEN** all migrations complete without errors

#### Scenario: Django admin is accessible
- **WHEN** a superuser is created and `/admin/` is accessed
- **THEN** the Django admin login page renders
