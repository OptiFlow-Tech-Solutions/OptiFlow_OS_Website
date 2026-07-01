# Build Pipeline

## Purpose

Define the build and validation system that assembles the OptiFlow OS marketing website from source files, partials, and shared assets into a production-ready `dist/` directory.

## Requirements

### Requirement: Page Assembly

The system SHALL assemble all pages from `src/pages/`, `src/partials/`, and shared assets into the `dist/` directory via `npm run build`.

#### Scenario: Full build from clean state

- **GIVEN** a clean project with no `dist/` directory
- **WHEN** `npm run build` is executed
- **THEN** all 12 pages SHALL be generated under `dist/` with clean URLs (directory-based, `/page-name/index.html`)
- **AND** the home page SHALL be generated at `dist/index.html`

#### Scenario: Rebuild overwrites previous output

- **GIVEN** an existing `dist/` directory
- **WHEN** `npm run build` is executed
- **THEN** the existing `dist/` SHALL be removed and recreated from scratch

### Requirement: SEO Meta Injection

The build pipeline SHALL inject canonical URLs, OpenGraph URL/site name/locale/dimensions, Twitter image, and robots meta tags into every assembled page.

#### Scenario: Canonical URL injection

- **GIVEN** a page with file path `features/index.html` in site.json
- **WHEN** the build pipeline assembles the page
- **THEN** `<link rel="canonical" href="https://optiflow.in/features/">` SHALL be injected into `<head>`

#### Scenario: OG URL and site name injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta property="og:url" content="https://optiflow.in/<path>/">` SHALL be injected
- **AND** `<meta property="og:site_name" content="OptiFlow OS">` SHALL be injected
- **AND** `<meta property="og:locale" content="en_IN">` SHALL be injected
- **AND** `<meta property="og:image:width" content="512">` SHALL be injected
- **AND** `<meta property="og:image:height" content="512">` SHALL be injected

#### Scenario: Robots meta injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta name="robots" content="index, follow">` SHALL be injected into `<head>`

#### Scenario: Twitter image injection

- **GIVEN** any page being assembled
- **WHEN** the build pipeline processes the page
- **THEN** `<meta name="twitter:image" content="/assets/img/OptiFlow.Logo.png">` SHALL be injected
- **AND** `<meta name="twitter:image:alt" content="OptiFlow OS Logo">` SHALL be injected

### Requirement: BreadcrumbList Structured Data Injection

The build pipeline SHALL inject BreadcrumbList JSON-LD structured data into every assembled page.

#### Scenario: BreadcrumbList generation

- **GIVEN** a page at `/problem-solutions/`
- **WHEN** the build pipeline injects JSON-LD
- **THEN** a BreadcrumbList schema SHALL be present with items for Home and Solutions

### Requirement: Article Structured Data on Newsletter

The build pipeline SHALL inject Article JSON-LD structured data into the newsletter page.

#### Scenario: Article schema on newsletter

- **GIVEN** the newsletter page
- **WHEN** the build pipeline injects JSON-LD
- **THEN** an Article schema SHALL be present with headline, description, publisher, and datePublished fields

### Requirement: Placeholder Variable Replacement

The system SHALL replace `{{PLACEHOLDER}}` variables in source pages with values from `site.json`.

#### Scenario: Canonical data injection

- **GIVEN** a source page contains `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`, `{{SITE_NAME}}`
- **WHEN** the page is assembled
- **THEN** each placeholder SHALL be replaced with its corresponding value from `site.json`
- **AND** no `{{PLACEHOLDER}}` variables SHALL remain in the output

#### Scenario: Page-specific metadata injection

- **GIVEN** a source page contains `{{PAGE_TITLE}}` and `{{PAGE_DESCRIPTION}}`
- **WHEN** the page is assembled
- **THEN** these SHALL be replaced with the page's title and description from the `site.json` pages array

### Requirement: Partial Injection

The system SHALL inject navigation and footer partials via `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->` comments.

#### Scenario: Navigation injection

- **GIVEN** a source page contains `<!-- INCLUDE: nav -->`
- **WHEN** the page is assembled
- **THEN** the comment SHALL be replaced with the contents of `src/partials/nav.html`
- **AND** the active page indicator SHALL be resolved based on the page's `active` field in `site.json`
- **AND** active state SHALL be resolved for both desktop nav AND mobile drawer links

#### Scenario: Footer injection

- **GIVEN** a source page contains `<!-- INCLUDE: footer -->`
- **WHEN** the page is assembled
- **THEN** the comment SHALL be replaced with the contents of `src/partials/footer.html`

### Requirement: Asset Copying

The system SHALL copy shared assets (CSS, JS, images) from `assets/` into `dist/assets/`.

#### Scenario: Shared assets copy

- **GIVEN** the `assets/` directory contains `css/core.css`, `js/core.js`, and image files
- **WHEN** `npm run build` is executed
- **THEN** all files and subdirectories from `assets/` SHALL be recursively copied to `dist/assets/`
- **AND** each page SHALL reference assets via `/assets/css/core.css` and `/assets/js/core.js`

#### Scenario: Logo image detection

- **GIVEN** a design specification directory exists in the project root
- **WHEN** the build runs
- **THEN** PNG logo files SHALL be copied into `dist/assets/img/`

### Requirement: Validation

The system SHALL validate all generated pages via `npm run validate`, checking internal links, hardcoded hex colors, dark mode coverage, SEO tags, and data consistency.

#### Scenario: Internal link validation

- **GIVEN** a generated page contains internal links (`href="/path/"`)
- **WHEN** `npm run validate` is executed
- **THEN** each internal link SHALL be verified as resolvable against the `dist/` directory
- **AND** broken links SHALL be reported as errors

#### Scenario: Hardcoded color detection

- **GIVEN** a generated page contains inline hex colors outside `<style>` blocks and SVG `fill` attributes
- **WHEN** `npm run validate` is executed
- **THEN** each hardcoded hex color SHALL be reported as a warning

#### Scenario: Dark mode coverage check

- **GIVEN** a generated page does NOT contain `[data-theme="dark"]` selectors
- **WHEN** `npm run validate` is executed
- **THEN** a warning SHALL be reported for that page

#### Scenario: SEO tag presence check

- **GIVEN** a generated page
- **WHEN** `npm run validate` is executed
- **THEN** the system SHALL verify `<title>`, meta description, `<h1>`, and OG tags exist
- **AND** missing tags SHALL be reported as errors or warnings

#### Scenario: Data consistency check

- **GIVEN** a generated page
- **WHEN** `npm run validate` is executed
- **THEN** the system SHALL check for stale phone numbers and locations
- **AND** inconsistencies SHALL be reported as errors

### Requirement: Validation Exit Code

The system SHALL exit with a non-zero code when validation errors are present.

#### Scenario: Errors cause failure

- **GIVEN** validation finds one or more errors
- **WHEN** `npm run validate` completes
- **THEN** the process SHALL exit with code 1

#### Scenario: Test failures cause CI failure

- **GIVEN** one or more E2E tests fail
- **WHEN** `npm test` completes
- **THEN** the process SHALL exit with code 1

#### Scenario: Warnings-only success

- **GIVEN** validation finds only warnings and no errors
- **WHEN** `npm run validate` completes
- **THEN** the process SHALL exit with code 0

### Requirement: Clean URLs

The system SHALL produce clean, directory-based URLs without `.html` extensions.

#### Scenario: Directory-based output

- **GIVEN** a page mapped to `features/index.html` in the page map
- **WHEN** the page is assembled
- **THEN** the output SHALL be written to `dist/features/index.html`
- **AND** the URL path SHALL be `/features/`

### Requirement: CI/CD Pipeline

The system SHALL include a GitHub Actions CI workflow that runs on pull requests and pushes to main.

#### Scenario: PR validation

- **GIVEN** a pull request is opened against `main`
- **WHEN** the CI workflow triggers
- **THEN** the build SHALL run via `npm run build`
- **AND** validation SHALL run via `npm run validate`
- **AND** lint checks SHALL run via `npm run lint:all`
- **AND** E2E tests SHALL run via `npm test`
- **AND** all steps SHALL complete within 10 minutes

#### Scenario: Deploy scripts

- **GIVEN** the project is configured for deployment
- **WHEN** `npm run deploy:netlify` is executed
- **THEN** the site SHALL be deployed to Netlify
- **WHEN** `npm run deploy:cloudflare` is executed
- **THEN** the site SHALL be deployed to Cloudflare Pages

### Requirement: Pipeline Configuration

The system SHALL have a deploy step in the build pipeline config that invokes the actual deploy script.

#### Scenario: Pipeline deploy step

- **GIVEN** the build pipeline config at `orchestrate/pipeline-config/build.yaml`
- **WHEN** the deploy step is executed
- **THEN** it SHALL run `npm run deploy`
- **AND** it SHALL NOT be a placeholder echo command

### Requirement: Development Server

The system SHALL support `npm run dev` for local development (build + serve).

#### Scenario: Dev workflow

- **GIVEN** the project source files
- **WHEN** `npm run dev` is executed
- **THEN** the build SHALL run first
- **AND** a local HTTP server SHALL serve the `dist/` directory

### Requirement: Test Command

The system SHALL include an `npm test` script that runs the full Playwright E2E test suite.

#### Scenario: Test command execution

- **GIVEN** the project has test files in `tests/e2e/`
- **WHEN** `npm test` is executed
- **THEN** Playwright SHALL run all test specs across configured browser projects
- **AND** the dev server SHALL be started automatically via `webServer` config
