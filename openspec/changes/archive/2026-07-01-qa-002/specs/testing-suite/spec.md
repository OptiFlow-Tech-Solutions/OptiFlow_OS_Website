# Testing Suite

## Purpose

Define the E2E testing suite that validates all OptiFlow OS marketing website pages across accessibility, SEO, navigation, responsive design, and core asset loading.

## Requirements

### Requirement: E2E Test Coverage

The testing suite SHALL cover all published pages in `site.json` across 5 test dimensions.

#### Scenario: All pages covered

- **GIVEN** the `site.json` pages array defines the published page set
- **WHEN** the E2E test suite runs
- **THEN** each published page (excluding `noindex` pages) SHALL be covered by at least one test spec
- **AND** accessibility tests SHALL scan all pages with axe-core

#### Scenario: Test dimensions

- **GIVEN** the test suite at `tests/e2e/`
- **WHEN** any page is modified
- **THEN** the following dimensions SHALL be verified:
  - Accessibility (zero critical/serious WCAG violations)
  - SEO (title, meta description, OG tags, single h1)
  - Navigation (200 status, nav visibility, link clicks, mobile drawer)
  - Responsive (no horizontal overflow at 6 breakpoints)
  - Core assets (core.css, core.js, footer loaded on every page)

### Requirement: Browser Coverage

The test suite SHALL run across Chromium, Firefox, WebKit desktop, and Chromium mobile.

#### Scenario: Multi-browser execution

- **GIVEN** Playwright is configured with 4 projects
- **WHEN** `npm test` is executed
- **THEN** all test specs SHALL run on chromium-desktop, firefox-desktop, webkit-desktop, and chromium-mobile

### Requirement: CI Integration

The test suite SHALL be integrated into the CI/CD pipeline and quality gates.

#### Scenario: PR validation includes tests

- **GIVEN** a pull request is opened against `main`
- **WHEN** the CI workflow triggers
- **THEN** `npm test` SHALL run as a required step
- **AND** the PR SHALL be blocked if any test fails

#### Scenario: GATE_TEST enforcement

- **GIVEN** the orchestration engine runs quality gates
- **WHEN** GATE_TEST is executed
- **THEN** the gate SHALL pass only when all E2E tests pass across all browser projects

### Requirement: Accessibility Gate

Accessibility tests SHALL block deployment on critical or serious axe-core violations.

#### Scenario: A11y violations block deploy

- **GIVEN** the accessibility test spec
- **WHEN** axe-core identifies a critical or serious WCAG violation on any page
- **THEN** the test SHALL fail
- **AND** the violation details SHALL be reported in the test output

### Requirement: Test Independence

Each test spec SHALL be independently runnable and not depend on state from other specs.

#### Scenario: Fully parallel execution

- **GIVEN** `fullyParallel: true` is configured in Playwright
- **WHEN** multiple test files execute concurrently
- **THEN** no test SHALL depend on cookies, localStorage, or DOM state set by another test
