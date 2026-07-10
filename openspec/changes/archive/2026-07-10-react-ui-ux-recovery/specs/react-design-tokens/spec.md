# react-design-tokens (delta)

## MODIFIED Requirements

### Requirement: No hardcoded values
All color values in `design-tokens.css` SHALL use hex notation matching DESIGN.md specification. Soft/derived color variants SHALL use `color-mix()` with hex inputs. No `oklch()` values SHALL appear in `:root` or `[data-theme="dark"]` blocks.

#### Scenario: No Oklch values in token definitions
- **WHEN** running `rgrep "oklch"` on `design-tokens.css` within `:root` or `[data-theme="dark"]` blocks
- **THEN** no `oklch()` values are found

#### Scenario: Soft tokens use color-mix with hex inputs
- **WHEN** inspecting `--accent-soft` definition
- **THEN** the value uses `color-mix(in oklch, #1B4D81 X%, transparent)` or equivalent hex-based derivation

### Requirement: Design tokens CSS file exists
The system SHALL provide a standalone `design-tokens.css` file containing all CSS custom properties matching DESIGN.md specification scoped under `:root` (light mode) and `[data-theme="dark"]` (dark mode).

#### Scenario: All color tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--bg`, `--surface`, `--fg`, `--muted`, `--fg-disabled`, `--border`, `--border-soft`, `--border-default`, `--border-strong`, `--accent`, `--teal`, `--green`, `--lime`, `--accent-soft`, `--teal-soft`, `--green-soft`, `--fg-soft`, `--glow-accent` with hex values matching DESIGN.md

#### Scenario: Typography tokens match DESIGN.md
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--font-display`, `--font-body` using Inter font family; `--fs-h1: 52px`, `--fs-h2: 42px`, `--fs-h3: 34px`, `--fs-h4: 28px`, `--fs-h5: 22px`, `--fs-lead: 20px`, `--fs-body: 18px`, `--fs-small: 16px`, `--fs-caption: 14px` with matching DESIGN.md values

#### Scenario: Container token matches DESIGN.md
- **WHEN** `design-tokens.css` is inspected
- **THEN** `--container` is `1320px`

#### Scenario: Oklch fallback removed
- **WHEN** `design-tokens.css` is inspected
- **THEN** no `@supports (color: oklch(0 0 0))` fallback block exists (tokens are now hex-based)

## ADDED Requirements

### Requirement: Inter font is loaded via @import or link
The system SHALL load the Inter font family (weights 400, 500, 600, 700) with `font-display: swap` via a `<link>` tag in `index.html` or `@import` in `index.css`.

#### Scenario: Inter font is available
- **WHEN** inspecting the rendered page in DevTools
- **THEN** Inter is listed in the Computed font-family stack and renders correctly at all weights

### Requirement: Responsive type scale via media queries
The system SHALL define media queries at 1024px and 768px breakpoints that reduce font-size tokens for smaller viewports while maintaining the DESIGN.md type hierarchy.

#### Scenario: H1 scales at tablet
- **WHEN** viewport is below 1024px
- **THEN** `--fs-h1` is reduced to 42px

#### Scenario: H1 scales at mobile
- **WHEN** viewport is below 768px
- **THEN** `--fs-h1` is reduced to 36px and `--fs-h2` is reduced to 28px
