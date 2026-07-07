# Nixpacks Deployment

**Purpose:** Define Nixpacks deployment requirements ensuring the build pack produces an equivalent deployment to the Docker path using nginx instead of `npx serve`. Covers build phase, runtime server, healthcheck, Node version, and artifact-only image.

## Requirements

### Requirement: Nixpacks builds the static site
The `nixpacks.toml` configuration SHALL run `npm ci` followed by `npm run build` during the build phase, producing a complete `dist/` directory.

#### Scenario: Build completes successfully
- **WHEN** Nixpacks processes the build phase
- **THEN** the `dist/` directory exists and contains `index.html`, subdirectories for all pages, and the `assets/` directory

### Requirement: Nixpacks serves via nginx, not `npx serve`
The Nixpacks start command SHALL use nginx to serve the static site, not `npx serve`. The nginx configuration SHALL match the Docker deployment path in compression, caching, and security headers.

#### Scenario: Nginx is the runtime server
- **WHEN** the Nixpacks-built container starts
- **THEN** the process listening on the exposed port is nginx, not a Node.js process

#### Scenario: All Docker-path routes work identically
- **WHEN** the same routes tested against the Docker image are tested against the Nixpacks image
- **THEN** all return the same HTTP status codes and content types

### Requirement: Nixpacks deployment passes healthcheck
The Nixpacks deployment SHALL respond to `GET /health` with HTTP 200, matching the Docker deployment's healthcheck behavior.

#### Scenario: Health endpoint works
- **WHEN** `GET /health` is requested from the Nixpacks container
- **THEN** response is HTTP 200 with body `ok`

### Requirement: Nixpacks uses correct Node version
The `nixpacks.toml` configuration SHALL specify Node.js version 20 (matching `.node-version`) so that the build phase uses the correct runtime.

#### Scenario: Node 20 is used during build
- **WHEN** Nixpacks provisions the build environment
- **THEN** the Node.js version is 20.x

### Requirement: Nixpacks final image contains only production artifacts
The Nixpacks setup phase SHALL only include `dist/` and nginx configuration in the final runtime image, excluding source files and build dependencies.

#### Scenario: Source files excluded from runtime
- **WHEN** inspecting the final Nixpacks runtime image
- **THEN** `src/`, `node_modules/`, and `scripts/` directories are absent
