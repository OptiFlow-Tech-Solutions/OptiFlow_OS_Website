## ADDED Requirements

### Requirement: Green color token semantics
The design system SHALL define two distinct green color tokens with clear semantic purposes:

- `--green` SHALL represent Success Green (`#54B89A ≈ oklch(72% 0.12 145)`) and SHALL only be used for completion states, done badges, checkmarks, and success confirmations
- `--lime` SHALL represent Growth Green (`#99D271 ≈ oklch(82% 0.14 125)`) and SHALL only be used for KPIs, progress indicators, savings displays, ROI metrics, and growth highlights

#### Scenario: Success element uses correct token
- **WHEN** a UI element displays a success state (checkmark, "done" badge, form success message, comparison table "yes" cell)
- **THEN** it SHALL reference `var(--green)` for its color

#### Scenario: Growth element uses correct token
- **WHEN** a UI element displays a growth metric (savings amount, KPI value, ROI stat, progress indicator, counter display)
- **THEN** it SHALL reference `var(--lime)` for its color

### Requirement: No page-level color variable overrides
Individual pages SHALL NOT override `--green` or other design system color variables in their page-level `<style>` blocks. All color variable definitions SHALL reside solely in `assets/css/core.css`.

#### Scenario: Page loads without overriding color variables
- **WHEN** any marketing page is loaded
- **THEN** every `var(--green)` reference resolves to the `core.css` value `oklch(72% 0.12 145)` in light mode

#### Scenario: Features page uses core.css green
- **WHEN** the features page (`/features/`) is loaded
- **THEN** `--green` SHALL NOT be overridden in the page's `<style>` block

#### Scenario: Feature showcase page uses core.css green
- **WHEN** the feature showcase page (`/feature-showcase/`) is loaded
- **THEN** `--green` SHALL NOT be overridden in the page's `<style>` block

### Requirement: Pricing page consistent token usage
The pricing page SHALL use `var(--lime)` for all growth, savings, ROI, and KPI indicators, and `var(--green)` only for success/checkmark elements.

#### Scenario: ROI savings display uses growth green
- **WHEN** the pricing page hero ROI dashboard is rendered
- **THEN** the savings amount text, pulse dot, connector line, and save badge SHALL reference `var(--lime)`

#### Scenario: Feature checkmarks use success green
- **WHEN** the pricing plan feature lists are rendered
- **THEN** checkmark icons in feature lists and comparison table SHALL reference `var(--green)`

#### Scenario: Bar fills use CSS variables not hardcoded hex
- **WHEN** the pricing page ROI comparison bars are rendered
- **THEN** the OptiFlow bar fill gradients SHALL use `var(--lime)`-based color-mix or gradient values instead of hardcoded hex values like `#84CC16` or `#65A30D`
