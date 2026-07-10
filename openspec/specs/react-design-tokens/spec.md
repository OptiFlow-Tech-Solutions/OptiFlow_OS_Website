# react-design-tokens

## Purpose

Standalone CSS design token file (`design-tokens.css`) containing all CSS custom properties for colors, typography, spacing, shadows, and motion — serving as the single source of truth for the React design system, reconciled with the canonical `DESIGN.md` specification using hex color values, Inter font family, 1320px container, and fixed pixel type scale.

## Requirements

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

#### Scenario: All color tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--bg`, `--surface`, `--fg`, `--muted`, `--fg-disabled`, `--border`, `--border-soft`, `--border-default`, `--border-strong`, `--accent`, `--teal`, `--green`, `--lime`, `--accent-soft`, `--teal-soft`, `--green-soft`, `--fg-soft`, `--glow-accent` with hex values matching DESIGN.md

#### Scenario: Oklch fallback removed
- **WHEN** `design-tokens.css` is inspected
- **THEN** no `@supports (color: oklch(0 0 0))` fallback block exists (tokens are now hex-based)

#### Scenario: Dark mode tokens match DESIGN.md
- **WHEN** comparing `[data-theme="dark"]` block in `design-tokens.css`
- **THEN** all dark-mode token overrides use hex equivalents matching DESIGN.md intent

### Requirement: Font family matches DESIGN.md
The system SHALL define `--font-display` and `--font-body` using `'Inter', system-ui, -apple-system, sans-serif` as the font stack, with `--font-mono` using `'JetBrains Mono', ui-monospace, monospace`.

#### Scenario: Display font uses Inter
- **WHEN** inspecting `--font-display` in `design-tokens.css`
- **THEN** the value starts with `'Inter'`

#### Scenario: Inter is loaded via link tag
- **WHEN** inspecting `frontend/index.html`
- **THEN** a `<link>` tag loads Inter font from Google Fonts with `font-display: swap` for weights 400, 500, 600, 700

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
- **WHEN** viewport is below 1024px
- **THEN** `--fs-h1` reduces to 42px, `--fs-h2` reduces to 34px

#### Scenario: Mobile re-scaling
- **WHEN** viewport is below 768px
- **THEN** `--fs-h1` reduces to 36px, `--fs-h2` reduces to 28px
