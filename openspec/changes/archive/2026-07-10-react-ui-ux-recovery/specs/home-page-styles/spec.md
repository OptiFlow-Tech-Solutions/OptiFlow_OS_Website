# home-page-styles (delta)

## MODIFIED Requirements

### Requirement: Home-specific styles use Tailwind classes, not injected <style>
The Home page SHALL define page-specific styles via Tailwind utility classes referencing CSS custom properties. Complex page-specific CSS (keyframe animations, pseudo-elements, gradient backgrounds) SHALL be defined in a dedicated `Home.css` file imported by the Home page component. No `<style>` tag injection SHALL be used.

#### Scenario: Home page has a dedicated CSS file
- **WHEN** inspecting `frontend/src/pages/` directory
- **THEN** a `Home.css` file exists with all page-specific styles

#### Scenario: HomeStyles component is removed
- **WHEN** inspecting `Home.tsx`
- **THEN** no `HomeStyles` import or usage exists

#### Scenario: Home page styles do not leak to other pages
- **WHEN** viewing any other page
- **THEN** home-specific CSS classes are not present in the DOM (CSS file is imported at page level, scoped via component hierarchy)

### Requirement: All home styles respect CSS variables
All home-specific CSS SHALL reference CSS custom properties for colors, spacing, and typography. Hardcoded gradient values SHALL use DESIGN.md hex colors. No Oklch values SHALL appear in home-specific styles.

#### Scenario: Gradient uses DESIGN.md hex values
- **WHEN** inspecting home-specific CSS for hero gradients
- **THEN** the linear-gradient uses `#1B4D81` and `#278D9F` hex values

#### Scenario: Shadow token usage
- **WHEN** inspecting home-specific CSS for card shadows
- **THEN** shadows reference `var(--shadow-card)`, `var(--shadow-elevated)`, etc.

## ADDED Requirements

### Requirement: Hero styles use Tailwind + CSS file pattern
Hero section styling (gradient background, grid layout, dashboard mockup, floating widgets, typewriter cursor) SHALL be split between Tailwind utility classes for layout/spacing and `Home.css` for complex visual effects (pseudo-elements, keyframes, backdrop-filter).

#### Scenario: Hero grid uses Tailwind
- **WHEN** inspecting `HeroSection.tsx`
- **THEN** grid layout uses Tailwind classes like `grid grid-cols-1 lg:grid-cols-2 gap-16`

#### Scenario: Dashboard mockup glass effect in Home.css
- **WHEN** inspecting `Home.css`
- **THEN** `.dashboard-mockup` class defines `backdrop-filter: blur(12px)`, semi-transparent background, and inset shadow using CSS custom properties

### Requirement: All keyframe animations in Home.css
All `@keyframes` declarations (heroReveal, floatWidget, logoScroll, blink, exitFadeIn, floatDashboard) SHALL be defined in `Home.css` and imported by the Home page.

#### Scenario: Keyframes imported via CSS
- **WHEN** the Home page renders
- **THEN** all keyframe animations are available via the imported CSS file
