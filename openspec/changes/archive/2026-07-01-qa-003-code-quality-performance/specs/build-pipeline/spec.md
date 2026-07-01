## MODIFIED Requirements

### Requirement: Asset Copying

The system SHALL copy shared assets (CSS, JS, images) from `assets/` into `dist/assets/`, and SHALL minify CSS and JS during production build.

#### Scenario: Shared assets copy

- **GIVEN** the `assets/` directory contains `css/core.css`, `js/core.js`, and image files
- **WHEN** `npm run build` is executed
- **THEN** all files and subdirectories from `assets/` SHALL be recursively copied to `dist/assets/`
- **AND** each page SHALL reference assets via `/assets/css/core.css` and `/assets/js/core.js`

#### Scenario: Logo image detection

- **GIVEN** a design specification directory exists in the project root
- **WHEN** the build runs
- **THEN** PNG logo files SHALL be copied into `dist/assets/img/`

#### Scenario: CSS and JS minification

- **WHEN** assets are copied in production build mode
- **THEN** `core.css` and `core.js` SHALL be minified before writing to `dist/assets/`
- **AND** source files in `assets/` SHALL remain unminified

### Requirement: Validation Exit Code

The system SHALL exit with a non-zero code when validation errors are present, and the post-build hook SHALL propagate this exit code.

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

#### Scenario: Post-build propagates validate exit code

- **GIVEN** validation exits with code 1 (errors found)
- **WHEN** the post-build hook runs
- **THEN** the build SHALL exit with code 1

## ADDED Requirements

### Requirement: Preconnect Resource Hints Injection

The build pipeline SHALL inject `<link rel="preconnect">` hints into every assembled page's `<head>` for Google Fonts and Plausible analytics.

#### Scenario: Preconnect hints present

- **WHEN** a page is assembled
- **THEN** `<link rel="preconnect" href="https://fonts.googleapis.com">` SHALL be present in `<head>`
- **AND** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` SHALL be present
- **AND** `<link rel="preconnect" href="https://plausible.io">` SHALL be present
