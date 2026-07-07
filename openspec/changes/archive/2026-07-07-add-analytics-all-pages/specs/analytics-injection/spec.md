## ADDED Requirements

### Requirement: Analytics partial included on every page
Every source page in `src/pages/` SHALL include `<!-- INCLUDE: analytics -->` before the closing `</head>` tag, matching the pattern used for nav and footer partials.

#### Scenario: All source pages have analytics include
- **WHEN** checking each `.html` file in `src/pages/`
- **THEN** every file contains `<!-- INCLUDE: analytics -->` on a line before `</head>`

#### Scenario: Build script handles the include directive
- **WHEN** `npm run build` executes
- **THEN** `scripts/assemble.mjs` replaces `<!-- INCLUDE: analytics -->` with the contents of `src/partials/analytics.html` in every assembled page

### Requirement: No redundant auto-injection fallback
The build script SHALL NOT inject analytics via a secondary mechanism. Only the `<!-- INCLUDE: analytics -->` directive replacement (L94 of assemble.mjs) SHALL be used.

#### Scenario: Ponytail auto-injection removed
- **WHEN** `scripts/assemble.mjs` is executed
- **THEN** the `html.replace('</head>', analyticsRaw)` call on or near line 157 is removed
- **AND** analytics is injected solely via the INCLUDE directive replacement at line 94

#### Scenario: Build still produces analytics on all pages
- **WHEN** viewing any assembled page in `dist/`
- **THEN** the Plausible `<script>` tag and `<link rel="dns-prefetch">` are present in the `<head>`
