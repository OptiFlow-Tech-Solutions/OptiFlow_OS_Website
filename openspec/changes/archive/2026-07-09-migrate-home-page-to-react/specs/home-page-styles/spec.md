## ADDED Requirements

### Requirement: Home-specific styles use injected <style> pattern
The Home page SHALL inject page-specific CSS via a HomeStyles component following the same `<style>` tag injection pattern as GlobalStyles.tsx.

#### Scenario: HomeStyles renders a <style> element
- **WHEN** the Home page component renders
- **THEN** a `<style>` element containing all home-specific CSS is injected into the DOM

#### Scenario: Home page styles do not conflict with global styles
- **WHEN** viewing any other page
- **THEN** home-specific styles are not present in the DOM

### Requirement: Hero styles preserved exactly
The Home page styles SHALL include all hero-specific CSS from the original `home.html` `<style>` block: background gradient, mouse glow, hook badge, hero grid layout, dashboard mockup (KPI cards, chart, table, floating widgets), typewriter cursor blink animation, and hero entry reveal keyframes.

#### Scenario: Hero background gradient renders
- **WHEN** viewing the hero section
- **THEN** the radial gradient overlay using `rgba(39,141,159,.04)` renders at the correct position (50% 30%)

#### Scenario: Dashboard mockup glass effect renders
- **WHEN** viewing the dashboard mockup
- **THEN** it has `backdrop-filter: blur(12px)`, semi-transparent white background, and a white inset border

#### Scenario: Floating widgets render at correct positions
- **WHEN** viewing the dashboard mockup
- **THEN** 3 floating widgets render at positions (top-right, bottom-left, bottom-right) with staggered float animation delays (0s, 1.3s, 2.6s)

#### Scenario: Typewriter cursor blinks
- **WHEN** the typewriter is active
- **THEN** a red cursor (3px wide, #FF3B3B) blinks with an 0.8s step animation

### Requirement: Card tilt CSS included
The Home page styles SHALL include the card tilt perspective and transform-style CSS for the CostOfInaction section.

#### Scenario: Card tilt perspective applied
- **WHEN** a card-tilt wrapper is rendered
- **THEN** it has `perspective: 800px` and its card child has `transform-style: preserve-3d`

### Requirement: Comparison table styles included
The Home page styles SHALL include the comparison table styling for traditional vs OptiFlow columns.

#### Scenario: Traditional column uses muted styling
- **WHEN** the comparison table renders
- **THEN** traditional column cells use `color: var(--muted)` with font-size 13px

#### Scenario: OptiFlow column uses strong styling
- **WHEN** the comparison table renders in dark mode
- **THEN** OptiFlow column cells use `color: rgba(255,255,255,.92)`

### Requirement: Exit overlay styles included
The Home page styles SHALL include the exit-intent overlay CSS: fixed backdrop blur overlay, centered card with entrance animation, close button positioning.

#### Scenario: Exit overlay renders with backdrop blur
- **WHEN** the exit overlay is active
- **THEN** it has semi-transparent dark background with `backdrop-filter: blur(6px)` and the card animates in with translateY + scale

### Requirement: WhatsApp float styles included
The Home page styles SHALL include the floating WhatsApp button CSS: fixed position, #25D366 brand color, hover scale effect, mobile repositioning.

#### Scenario: WhatsApp float positioned correctly
- **WHEN** viewing on desktop
- **THEN** the button is fixed at bottom: 88px, right: 32px with 52x52px dimensions

#### Scenario: WhatsApp float repositions on mobile
- **WHEN** viewport is below 480px
- **THEN** the button repositions to bottom: 72px, right: 20px

### Requirement: Trust bar styles included
The Home page styles SHALL include trust bar CSS: metrics grid, logo scroll infinite animation with gradient edge mask.

#### Scenario: Logo scroll animation runs continuously
- **WHEN** the trust bar renders
- **THEN** the logo marquee scrolls horizontally using `animation: logoScroll 30s linear infinite` with a CSS mask for edge fade

### Requirement: Solution visual styles included
The Home page styles SHALL include solution stage styling: chaos (warm tint), OptiFlow (gradient), excellence (green tint) with their background, border, and shadow properties.

#### Scenario: OptiFlow stage uses accent gradient
- **WHEN** the solution visual renders
- **THEN** the middle "OptiFlow OS" stage has a linear-gradient background from #1B4D81 to #278D9F with an elevated shadow and blue glow

### Requirement: Steps connector line included
The Home page styles SHALL include the horizontal gradient connecting line for the How It Works steps, positioned to span across step numbers.

#### Scenario: Gradient connector line renders
- **WHEN** the how-it-works section renders
- **THEN** a horizontal line with gradient (accent → teal → green → lime) spans between the step circles

### Requirement: All home styles respect CSS variables
No home-specific CSS SHALL use hardcoded color values except gradients and the typewriter cursor. All colors, spacing, and typography SHALL reference CSS custom properties (`var(--*)`) or use oklch values consistent with the design system.

#### Scenario: Styles use CSS variables
- **WHEN** inspecting home-specific CSS
- **THEN** colors reference `var(--accent)`, `var(--teal)`, `var(--green)`, `var(--lime)`, `var(--muted)`, `var(--fg)`, `var(--surface)`, `var(--border)`, `var(--bg)` where applicable

### Requirement: Home styles respect dark mode
All home-specific CSS SHALL include `[data-theme="dark"]` overrides where the dark appearance differs from light mode, matching the original home.html dark mode declarations.

#### Scenario: Dark mode overrides present
- **WHEN** inspecting home-specific CSS
- **THEN** sections that differ in dark mode (hero, problem cards, solution stages, industry cards, comparison table, exit overlay) have corresponding `[data-theme="dark"]` rules

### Requirement: Responsive breakpoints for home styles
Home-specific CSS SHALL include responsive overrides at 1024px, 768px, and 480px matching the original home.html media queries.

#### Scenario: Hero grid collapses at 1024px
- **WHEN** viewport is below 1024px
- **THEN** the hero grid switches to single column and padding reduces

#### Scenario: Floating widgets hidden at 768px
- **WHEN** viewport is below 768px
- **THEN** floating widgets are hidden

#### Scenario: Mouse glow hidden at 480px
- **WHEN** viewport is below 480px
- **THEN** the mouse glow element is hidden and CTA buttons stack vertically
