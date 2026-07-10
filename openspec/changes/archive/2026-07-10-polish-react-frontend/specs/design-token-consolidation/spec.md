## ADDED Requirements

### Requirement: Single source of truth for design tokens
The React frontend SHALL use the same design token names and values as the static site's `assets/css/core.css`.

#### Scenario: Color tokens match core.css
- **WHEN** comparing `--bg`, `--surface`, `--fg`, `--muted`, `--accent`, `--teal`, `--green`, `--lime`, `--border`, `--border-soft`, `--border-strong` between static `core.css` and React `design-tokens.css`
- **THEN** the resolved color values SHALL be visually equivalent in both light and dark modes

#### Scenario: Oklch color space used
- **WHEN** inspecting color definitions in React `design-tokens.css`
- **THEN** color values SHALL use Oklch color space (e.g., `oklch(97% 0.005 250)`) matching the static site's approach

### Requirement: Tailwind theme maps design tokens
Tailwind v4 `@theme` directive SHALL map all CSS custom properties to utility classes.

#### Scenario: Background utility uses token
- **WHEN** an element uses `className="bg-bg"`
- **THEN** the resolved background color SHALL equal `var(--bg)`

#### Scenario: Text color utility uses token
- **WHEN** an element uses `className="text-accent"`
- **THEN** the resolved text color SHALL equal `var(--accent)`

#### Scenario: Spacing utility uses token
- **WHEN** an element uses `className="p-gap-md"`
- **THEN** the resolved padding SHALL equal `var(--gap-md)` (24px)

### Requirement: Dark mode consistency
Dark mode color values SHALL match between static and React frontends.

#### Scenario: Dark mode background
- **WHEN** `data-theme="dark"` is set on the document
- **THEN** `--bg` SHALL resolve to the same dark color in both static and React frontends

#### Scenario: Dark mode accent
- **WHEN** `data-theme="dark"` is set on the document
- **THEN** `--accent` SHALL resolve to the same accent color in both static and React frontends

### Requirement: No hex color remnants
After consolidation, no hardcoded hex color values SHALL remain in React component or style files.

#### Scenario: grep for hex colors in frontend
- **WHEN** searching `frontend/src/` for hex color patterns (`#[0-9a-fA-F]{3,8}`)
- **THEN** no results SHALL be found in `.tsx`, `.ts`, or `.css` files (excluding comments and data attributes)
