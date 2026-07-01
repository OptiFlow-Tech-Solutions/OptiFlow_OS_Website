# Performance Optimization

## Purpose

Optimize page load performance through resource hints, lazy image loading, and build-time asset minification.

## Requirements

### Requirement: Preconnect Resource Hints

The build pipeline SHALL inject `<link rel="preconnect">` hints for third-party origins into every page's `<head>`.

#### Scenario: Google Fonts preconnect

- **WHEN** a page is assembled
- **THEN** `<link rel="preconnect" href="https://fonts.googleapis.com">` SHALL be injected
- **AND** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` SHALL be injected

#### Scenario: Analytics preconnect

- **WHEN** a page is assembled with Plausible analytics
- **THEN** `<link rel="preconnect" href="https://plausible.io">` SHALL be injected

### Requirement: Lazy Image Loading

Images below the viewport fold SHALL use `loading="lazy"` to defer loading.

#### Scenario: Below-fold images lazily loaded

- **WHEN** an `<img>` tag appears outside the initial viewport on content pages (feature-showcase, product-overview, competitive-positioning)
- **THEN** the image SHALL include `loading="lazy"` attribute

#### Scenario: Above-fold images remain eager

- **WHEN** an `<img>` tag appears in the hero section or above fold
- **THEN** the image SHALL NOT include `loading="lazy"`

### Requirement: CSS and JS Minification

The build pipeline SHALL minify CSS and JavaScript assets during production build.

#### Scenario: Build-time minification

- **WHEN** `npm run build` is executed
- **THEN** `dist/assets/css/core.css` SHALL be minified (whitespace and comments removed)
- **AND** `dist/assets/js/core.js` SHALL be minified
- **AND** source files in `assets/` SHALL remain unminified for development

#### Scenario: Minification reduces size

- **WHEN** minification is applied to core.css (current ~26KB) and core.js (current ~18KB)
- **THEN** the combined output SHALL be at least 20% smaller than unminified versions

### Requirement: GATE_PERF Quality Gate

The orchestration engine SHALL include a GATE_PERF step that validates performance budgets.

#### Scenario: Performance gate in build pipeline

- **WHEN** the build pipeline config runs GATE_PERF
- **THEN** it SHALL check that CSS + JS combined size does not exceed 100KB
- **AND** it SHALL verify Lighthouse Performance score >= 0.8 for all configured pages
