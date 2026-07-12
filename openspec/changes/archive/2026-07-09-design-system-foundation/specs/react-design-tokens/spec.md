## ADDED Requirements

### Requirement: Design tokens CSS file exists
The system SHALL provide a standalone `design-tokens.css` file containing all CSS custom properties from `assets/css/core.css` scoped under `:root` (light mode) and `[data-theme="dark"]` (dark mode).

#### Scenario: All color tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--bg`, `--surface`, `--fg`, `--muted`, `--fg-disabled`, `--border`, `--border-soft`, `--border-default`, `--border-strong`, `--accent`, `--teal`, `--green`, `--lime`, `--accent-soft`, `--teal-soft`, `--green-soft`, `--fg-soft`, `--glow-accent` with matching Oklch values from `core.css`

#### Scenario: Typography tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--font-display`, `--font-body`, `--font-mono`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`, `--fs-meta` with matching values from `core.css`

#### Scenario: Spacing and layout tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--gap-xs`, `--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`, `--gap-2xl`, `--container`, `--gutter`, `--radius`, `--radius-lg`, `--radius-xl` with matching values from `core.css`

#### Scenario: Shadow tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--shadow-card`, `--shadow-card-hover`, `--shadow-elevated`, `--shadow-button`, `--shadow-button-hover`, `--shadow-inset`, `--shadow-nav` with matching values from `core.css`

#### Scenario: Transition and motion tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains `--transition-fast`, `--transition-base`, `--transition-slow`, `--ease-out`, `--ease-in`, `--ease-in-out`, `--ease-spring`, `--motion-distance` with matching values from `core.css`

#### Scenario: Z-index tokens are defined
- **WHEN** `design-tokens.css` is inspected
- **THEN** it contains all z-index tokens from `--z-base` through `--z-skip-link` with matching values from `core.css`

#### Scenario: Dark mode tokens match core.css
- **WHEN** comparing `[data-theme="dark"]` block in `design-tokens.css` with `core.css`
- **THEN** all dark-mode token overrides match exactly

#### Scenario: Tokens are importable by both React and static site
- **WHEN** `design-tokens.css` is linked via `<link>` in a static HTML page or imported in a React component
- **THEN** all CSS custom properties are available on the document root

#### Scenario: Oklch fallback exists
- **WHEN** `design-tokens.css` is inspected
- **THEN** a `@supports (color: oklch(0 0 0))` block provides sRGB fallbacks for `--bg`, `--surface`, `--fg`, `--accent`, and `--teal`

### Requirement: No hardcoded values
All color values in `design-tokens.css` SHALL use the `oklch()` functional notation. No hex values, no RGB values SHALL appear as token values.

#### Scenario: No hex values in token definitions
- **WHEN** running `rgrep "#[0-9a-fA-F]"` on `design-tokens.css`
- **THEN** no hex color values are found in `:root` or `[data-theme="dark"]` blocks (fallback block excluded)
