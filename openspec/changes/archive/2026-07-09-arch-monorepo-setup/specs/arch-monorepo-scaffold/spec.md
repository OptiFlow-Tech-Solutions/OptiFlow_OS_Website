## ADDED Requirements

### Requirement: Monorepo directory structure exists
The project root SHALL contain `frontend/` and `backend/` directories as sibling packages under the existing root, with the legacy `src/`, `assets/`, `scripts/`, and `dist/` directories preserved unchanged.

#### Scenario: Frontend directory is present
- **WHEN** `frontend/` directory is inspected
- **THEN** it contains `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and `src/` subdirectory

#### Scenario: Backend directory is present
- **WHEN** `backend/` directory is inspected
- **THEN** it contains `manage.py`, `requirements.txt`, `Dockerfile`, and a `config/` Django project package

#### Scenario: Legacy directories preserved
- **WHEN** project root is inspected
- **THEN** `src/pages/`, `assets/css/core.css`, `scripts/assemble.mjs`, and `site.json` all still exist unchanged

### Requirement: Root package.json scripts support monorepo workflow
The root `package.json` SHALL include new npm scripts to manage the full-stack dev workflow: starting the frontend dev server, running Django management commands, and orchestrating both services.

#### Scenario: Frontend dev script exists
- **WHEN** `npm run frontend:dev` is executed
- **THEN** the Vite dev server starts on port 5173 from the `frontend/` directory

#### Scenario: Combined dev script exists
- **WHEN** `npm run dev:full` is executed
- **THEN** both the Vite dev server and Docker Compose services start

#### Scenario: Backend management script exists
- **WHEN** `npm run backend:manage` is executed with arguments
- **THEN** the Django `manage.py` is invoked inside the backend container

### Requirement: Shared root configuration files exist
The project root SHALL contain `.env.example` with all environment variables needed by frontend, backend, and database services. The existing `.editorconfig`, `.prettierrc`, and `.gitignore` SHALL be extended to cover new file types.

#### Scenario: Environment template covers all services
- **WHEN** `.env.example` is inspected
- **THEN** it includes variables for Django secret key, database connection, Redis URL, CORS origins, and API base URL

#### Scenario: Gitignore covers new directories
- **WHEN** `.gitignore` is inspected
- **THEN** it excludes `frontend/dist/`, `frontend/node_modules/`, `backend/staticfiles/`, `backend/media/`, `*.pyc`, `__pycache__/`, and `.env`
