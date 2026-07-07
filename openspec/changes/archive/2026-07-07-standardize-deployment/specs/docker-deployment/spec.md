## ADDED Requirements

### Requirement: Multi-stage Docker build succeeds
The Dockerfile SHALL use a multi-stage build that compiles the static site in a Node.js stage, then copies only `dist/` and nginx config into a minimal nginx runtime stage. The final image SHALL be non-root and SHALL expose port 80.

#### Scenario: Build completes without error
- **WHEN** `docker build -t optiflow-website .` is run
- **THEN** the build completes with exit code 0

#### Scenario: Final image runs as non-root
- **WHEN** the container is started
- **THEN** `whoami` inside the container returns `nginx`, not `root`

#### Scenario: Health endpoint responds
- **WHEN** `curl -sf http://localhost/health` is requested from inside the container
- **THEN** the response is HTTP 200 with body `ok`

### Requirement: Docker image serves all routes
The Docker container SHALL serve all 14 marketing pages, static assets, and SEO artifacts (robots.txt, sitemap.xml, manifest.json) with correct HTTP 200 status codes. Missing pages SHALL return 404.

#### Scenario: Homepage serves correctly
- **WHEN** `GET /` is requested
- **THEN** response status is 200 and Content-Type is `text/html`

#### Scenario: Subdirectory page serves correctly
- **WHEN** `GET /pricing/` is requested
- **THEN** response status is 200 and Content-Type is `text/html`

#### Scenario: SEO artifacts are reachable
- **WHEN** `GET /robots.txt`, `GET /sitemap.xml`, and `GET /manifest.json` are requested
- **THEN** each returns HTTP 200

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
