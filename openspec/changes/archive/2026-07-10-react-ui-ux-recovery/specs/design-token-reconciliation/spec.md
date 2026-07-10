# design-token-reconciliation

## Purpose

Reconcile `frontend/src/styles/design-tokens.css` with the canonical `DESIGN.md/DESIGN.md` specification by migrating from Oklch-based color values to hex values, switching to the Inter font family, updating the container width to 1320px, and aligning the type scale with fixed pixel values.

## ADDED Requirements

### Requirement: Color tokens match DESIGN.md hex values
The system SHALL define all semantic color tokens using hex values that match the DESIGN.md specification: `--accent: #1B4D81`, `--teal: #278D9F`, `--green: #54B89A`, `--lime: #99D271`, `--bg: #F8FAFC`, `--surface: #FFFFFF`, `--fg: #0F172A`, `--muted: #475569`, with corresponding soft variants derived via `color-mix()`.

#### Scenario: Primary blue token matches DESIGN.md
- **WHEN** inspecting `--accent` in `design-tokens.css`
- **THEN** the value is `#1B4D81`

#### Scenario: Teal token matches DESIGN.md
- **WHEN** inspecting `--teal` in `design-tokens.css`
- **THEN** the value is `#278D9F`

#### Scenario: All color tokens use DESIGN.md hex values
- **WHEN** running `rgrep "oklch"` on `design-tokens.css` inside `:root` and `[data-theme="dark"]`
- **THEN** no Oklch values remain; all token definitions use hex or `color-mix()` with hex inputs

### Requirement: Font family matches DESIGN.md
The system SHALL define `--font-display` and `--font-body` using `'Inter', system-ui, -apple-system, sans-serif` as the font stack, with `--font-mono` using `'JetBrains Mono', ui-monospace, monospace`.

#### Scenario: Display font uses Inter
- **WHEN** inspecting `--font-display` in `design-tokens.css`
- **THEN** the value starts with `'Inter'`

#### Scenario: Inter is loaded via @font-face or link
- **WHEN** inspecting the document head or CSS
- **THEN** Inter font is loaded with `font-display: swap` for all required weights (400, 500, 600, 700)

### Requirement: Container width matches DESIGN.md
The system SHALL set `--container: 1320px` and `--gutter: 32px`, matching the DESIGN.md layout specification.

#### Scenario: Container is 1320px
- **WHEN** inspecting `--container` in `design-tokens.css`
- **THEN** the value is `1320px`

### Requirement: Type scale matches DESIGN.md
The system SHALL define font-size tokens using fixed pixel values matching DESIGN.md: `--fs-h1: 52px`, `--fs-h2: 42px`, `--fs-h3: 34px`, `--fs-h4: 28px`, `--fs-h5: 22px`, `--fs-lead: 20px`, `--fs-body: 18px`, `--fs-small: 16px`, `--fs-caption: 14px`. Responsive scaling SHALL be handled via media queries, not `clamp()`.

#### Scenario: H3 is 34px
- **WHEN** inspecting `--fs-h3` in `design-tokens.css`
- **THEN** the value is `34px`

#### Scenario: Body text is 18px
- **WHEN** inspecting `--fs-body` in `design-tokens.css`
- **THEN** the value is `18px`

#### Scenario: Responsive re-scaling via media queries
- **WHEN** viewport is below 768px and `--fs-h1` is read
- **THEN** a media query reduces `--fs-h1` to an appropriate smaller value (e.g., 36px)
