## ADDED Requirements

### Requirement: Dockerfile builds React SPA
The Dockerfile SHALL include a multi-stage build that compiles the React SPA using `npm run build` in the `frontend/` directory and copies the output to the nginx runtime image.

#### Scenario: React build stage succeeds
- **WHEN** `docker build` runs
- **THEN** the React build stage compiles without errors and produces `frontend/dist/` with `index.html`, chunked JS, and CSS

#### Scenario: React dist copied to /os/ prefix
- **WHEN** the runtime image is built
- **THEN** `frontend/dist/` contents are at `/usr/share/nginx/html/os/` in the nginx root

### Requirement: Static builder coexists with React builder
The Dockerfile SHALL continue to run the static `assemble.mjs` builder in a separate stage to produce root redirect page, sitemap.xml, robots.txt, manifest.json, and optimized images.

#### Scenario: Root redirect page deployed
- **WHEN** the runtime image is built
- **THEN** `/usr/share/nginx/html/index.html` contains a meta-refresh redirect to `/os/`

#### Scenario: Sitemap deployed
- **WHEN** the runtime image is built
- **THEN** `/usr/share/nginx/html/sitemap.xml` exists with `/os/` prefixed URLs

#### Scenario: Optimized images deployed
- **WHEN** the runtime image is built
- **THEN** `/usr/share/nginx/html/assets/img/` contains WebP and AVIF optimized images
