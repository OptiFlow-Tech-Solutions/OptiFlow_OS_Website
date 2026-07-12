## ADDED Requirements

### Requirement: Dockerfile does not run old HTML assembly
The Dockerfile SHALL NOT execute `node scripts/assemble.mjs` or depend on `src/pages/`, `src/partials/`, or the root `package.json` build pipeline.

#### Scenario: Docker build succeeds without old assembly
- **WHEN** `docker compose build` is executed
- **THEN** the build completes without running `scripts/assemble.mjs` and without requiring `src/pages/` or `src/partials/`

#### Scenario: No old HTML pages in container
- **WHEN** inspecting `/usr/share/nginx/html/` inside the running container
- **THEN** no assembled HTML pages from the old `src/pages/` are present under `/usr/share/nginx/html/os/`

### Requirement: Root redirect page is still served
The root `/` SHALL still serve a redirect to `/os/` via a minimal HTML page generated inline in the Dockerfile or a standalone script.

#### Scenario: Root URL redirects to /os/
- **WHEN** user navigates to `http://localhost:80/`
- **THEN** browser is redirected to `/os/` and the React SPA loads

### Requirement: SEO infrastructure files are still generated
Sitemap, robots.txt, and manifest.json SHALL still be generated and served by nginx.

#### Scenario: Sitemap is accessible
- **WHEN** user navigates to `/sitemap.xml`
- **THEN** a valid XML sitemap containing all page URLs is returned

#### Scenario: Robots.txt is accessible
- **WHEN** user navigates to `/robots.txt`
- **THEN** a robots.txt file allowing all crawlers is returned

#### Scenario: Manifest is accessible
- **WHEN** user navigates to `/manifest.json`
- **THEN** a valid PWA manifest with OptiFlow OS branding is returned

### Requirement: Image optimization is preserved
The WebP and AVIF image optimization for the OptiFlow logo SHALL continue to work.

#### Scenario: Optimized images exist in build
- **WHEN** the Docker build completes
- **THEN** `/usr/share/nginx/html/assets/img/` contains both `.webp` and `.avif` versions of the OptiFlow logo

### Requirement: Nginx legacy redirects still work
All 12 legacy redirect rules in nginx.conf (lines 78-90) SHALL continue to function, redirecting old root paths to `/os/*` equivalents.

#### Scenario: Old /pricing/ redirects to /os/pricing/
- **WHEN** user navigates to `/pricing/`
- **THEN** nginx returns HTTP 301 redirect to `/os/pricing/`
