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

### Requirement: Development Server

The system SHALL support `npm run dev` for local development (build + serve).

#### Scenario: Dev workflow

- **GIVEN** the project source files
- **WHEN** `npm run dev` is executed
- **THEN** the build SHALL run first
- **AND** a local HTTP server SHALL serve the `dist/` directory
