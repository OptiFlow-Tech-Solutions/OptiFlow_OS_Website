# style-consistency-enforcement

## Purpose

Eliminate the three competing styling patterns (page-local `<style>` tags, inline `style={{}}` objects, Tailwind utilities) in favor of a single consistent approach: Tailwind utility classes referencing CSS custom properties via `@theme`, with complex page-specific styles in dedicated CSS files when Tailwind utilities are insufficient.

## ADDED Requirements

### Requirement: No inline style objects in production components
No component SHALL use inline `style={{}}` objects for layout, spacing, or color values. Inline styles are permitted only for dynamic values (e.g., `transform` from useParallax, `left`/`top` from useMouseGlow).

#### Scenario: Pricing page uses no inline layout styles
- **WHEN** inspecting `Pricing.tsx` source
- **THEN** no `style={{}}` objects contain `display`, `gridTemplateColumns`, `gap`, `padding`, `margin`, `color`, or `background` properties

#### Scenario: ProblemSolutions page uses no inline styles
- **WHEN** inspecting `ProblemSolutions.tsx` source
- **THEN** no `style={{}}` objects contain layout or color properties

### Requirement: No page-local <style> tags for layout
No page component SHALL inject layout styles via `<style>` tags. Complex page-specific styles SHALL be defined in dedicated `.css` files imported at the component level, or in Tailwind's `@layer components` in `index.css`.

#### Scenario: Home page has no HomeStyles component
- **WHEN** inspecting `Home.tsx` source
- **THEN** no `HomeStyles` component is imported or rendered

#### Scenario: Pricing page has no inline <style> tags
- **WHEN** inspecting `Pricing.tsx` source
- **THEN** no JSX-injected `<style>{}` blocks define layout rules

### Requirement: All styling uses Tailwind class attribute
All non-dynamic styling SHALL use Tailwind utility classes in the `className` attribute. These classes reference the CSS custom properties registered in `@theme`.

#### Scenario: Cards use Tailwind classes
- **WHEN** inspecting any card component
- **THEN** background, border, shadow, padding, and border-radius are set via Tailwind classes (e.g., `bg-surface`, `border`, `shadow-card`, `p-gap-md`, `rounded`)

#### Scenario: Grids use Tailwind classes
- **WHEN** inspecting any grid layout
- **THEN** the grid is defined via Tailwind classes (e.g., `grid grid-cols-3 gap-gap-lg`)

### Requirement: ESLint enforces no-inline-styles rule
The ESLint configuration SHALL include a rule that flags inline `style={{}}` objects for review, with an allowlist for known dynamic-value exceptions.

#### Scenario: Lint catches inline style
- **WHEN** running `npm run lint` in the frontend directory
- **THEN** any inline `style={{ display: ... }}` produces a lint warning
