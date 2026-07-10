## ADDED Requirements

### Requirement: Per-page CSS files achieve visual parity
The system SHALL verify that every per-page `.css` file in the React frontend produces visual output matching the corresponding static page's `<style>` block and shared `core.css` styles, with zero visual regressions.

#### Scenario: Home.css produces identical hero appearance
- **WHEN** comparing React Home page hero section with static `home.html` hero section
- **THEN** background color, gradients, typography, spacing, dashboard mockup, floating widgets, and animations are visually identical at all breakpoints

#### Scenario: No missing or extra CSS rules
- **WHEN** auditing a React page's CSS file against the static page's `<style>` block
- **THEN** every CSS rule in the static `<style>` block has a corresponding rule in the React CSS file, and no React CSS rule introduces visual deviations from the static baseline

### Requirement: Visual parity is the primary styling constraint
The system SHALL treat the static HTML rendering as the visual specification. Any deviation from the static visual output — regardless of whether it uses Tailwind utilities or CSS custom properties — SHALL be classified as a regression.

#### Scenario: Tailwind utilities must not cause visual drift
- **WHEN** a React component uses Tailwind utility classes for layout or spacing
- **THEN** the rendered output matches the static HTML rendering at all four audit breakpoints

#### Scenario: CSS variable usage matches static site
- **WHEN** a React component or CSS file references a CSS custom property
- **THEN** the property is defined in `design-tokens.css` with a value matching `core.css`
