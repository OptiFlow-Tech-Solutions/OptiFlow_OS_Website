# Design System

## Purpose

Define the shared design tokens, typography, spacing, and component primitives that every marketing page inherits from `assets/css/core.css`.

## Requirements

### Requirement: CSS Custom Properties

The system SHALL define all colors as CSS custom properties in `:root`.

#### Scenario: Color variables available

- **GIVEN** `core.css` is loaded on any page
- **WHEN** a component references `var(--bg)`, `var(--fg)`, `var(--surface)`, `var(--muted)`, `var(--border)`, `var(--accent)`, `var(--teal)`, `var(--green)`, or `var(--lime)`
- **THEN** the correct color value SHALL be applied

#### Scenario: Soft color variants

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--accent-soft)`, `var(--teal-soft)`, or `var(--green-soft)`
- **THEN** a low-opacity mix of the corresponding brand color SHALL be applied

### Requirement: Border Hierarchy Tokens

The system SHALL provide CSS custom properties for the complete border hierarchy defined in the brand color palette.

#### Scenario: Three-level border tokens available

- **GIVEN** `core.css` is loaded on any page
- **WHEN** a component references `var(--border-soft)`, `var(--border-default)`, or `var(--border-strong)`
- **THEN** the correct border color SHALL be applied
- **AND** `--border-soft` SHALL be the lightest (subtle dividers)
- **AND** `--border-default` SHALL match the existing `--border` token
- **AND** `--border-strong` SHALL be the strongest (focus states, emphasized separators)

#### Scenario: Dark theme border tokens

- **GIVEN** `<html data-theme="dark">`
- **WHEN** border tokens are rendered
- **THEN** each border token SHALL resolve to its dark-theme equivalent

### Requirement: Color Palette Completeness

The system SHALL include CSS custom properties for all color roles defined in the brand specification.

#### Scenario: Disabled text token

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--fg-disabled)`
- **THEN** the disabled/inactive text color SHALL be applied

#### Scenario: Glow accent token

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--glow-accent)`
- **THEN** the decorative glow color SHALL be applied
- **AND** the value SHALL match the brand specification's glow token

### Requirement: Z-Index Scale

The system SHALL provide named z-index tokens for consistent vertical layering across all pages.

#### Scenario: Z-index tokens available

- **GIVEN** `core.css` is loaded
- **WHEN** any component needs a z-index value
- **THEN** it SHALL reference a `--z-*` token
- **AND** `--z-base` SHALL be the lowest (0)
- **AND** `--z-content` SHALL be for content layering (1)
- **AND** `--z-sticky` SHALL be for sticky elements (90)
- **AND** `--z-nav` SHALL be for navigation (100)
- **AND** `--z-dropdown` SHALL be for dropdowns (101)
- **AND** `--z-drawer` SHALL be for mobile drawer (101)
- **AND** `--z-hamburger` SHALL be for hamburger button (102)
- **AND** `--z-scroll-top` SHALL be for scroll-to-top button (199)
- **AND** `--z-skip-link` SHALL be the highest for skip-to-content (1000)

#### Scenario: Existing z-index values replaced

- **GIVEN** `core.css` has been updated
- **WHEN** any component rule sets `z-index`
- **THEN** it SHALL use a `var(--z-*)` reference instead of a hardcoded number

### Requirement: Transition Tokens

The system SHALL provide transition duration and easing tokens for consistent motion.

#### Scenario: Duration tokens available

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `--transition-fast`, `--transition-base`, or `--transition-slow`
- **THEN** the correct duration (150ms, 250ms, 350ms) SHALL be applied

#### Scenario: Easing curve tokens available

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--ease-out)`, `var(--ease-in)`, `var(--ease-in-out)`, or `var(--ease-spring)`
- **THEN** the correct cubic-bezier curve SHALL be applied
- **AND** `--ease-out` SHALL be used for entrances
- **AND** `--ease-in` SHALL be used for exits
- **AND** `--ease-in-out` SHALL be used for symmetric transitions
- **AND** `--ease-spring` SHALL be used for bouncy entrances

#### Scenario: Motion distance token available

- **GIVEN** `core.css` is loaded
- **WHEN** `.reveal`, `.reveal-left`, or `.reveal-right` elements animate
- **THEN** transform distance SHALL use `var(--motion-distance, 28px)`

### Requirement: Scroll Reveal Variants

The system SHALL provide directional and scale reveal variants.

#### Scenario: Directional reveal variants

- **GIVEN** `core.css` is loaded
- **WHEN** an element has `.reveal-left`, `.reveal-right`, or `.reveal-scale`
- **THEN** each SHALL have independent opacity and transform transitions using `var(--ease-out)`
- **AND** `.reveal-left` SHALL enter from the left
- **AND** `.reveal-right` SHALL enter from the right
- **AND** `.reveal-scale` SHALL enter via scale-up animation
- **AND** all variants SHALL be observed by the IntersectionObserver in core.js

#### Scenario: GPU-accelerated reveals

- **GIVEN** any `.reveal` or reveal-variant element
- **WHEN** the page renders
- **THEN** the element SHALL have `will-change: opacity, transform`
- **AND** the compositor SHALL promote the element to a GPU layer before the transition fires

### Requirement: Noise Texture

The system SHALL provide configurable noise texture overlay via CSS custom properties.

#### Scenario: Noise opacity token

- **GIVEN** `core.css` is loaded
- **WHEN** `.noise-overlay` is used with `var(--noise-opacity)`
- **THEN** the noise texture SHALL render at the defined opacity
- **AND** dark theme SHALL use a higher opacity value for visibility on dark backgrounds

### Requirement: Neutral-to-Brand Color Ratio

The system SHALL maintain approximately 88% neutral / 12% brand color ratio.

#### Scenario: Neutral-dominant interface

- **GIVEN** any page in the marketing website
- **WHEN** the page is visually assessed
- **THEN** the majority of surface area SHALL use neutral colors (--bg, --surface, --fg, --muted, --border)
- **AND** brand colors (--accent, --teal, --green, --lime) SHALL be reserved for accent elements, CTAs, and highlights

### Requirement: Light and Dark Themes

The system SHALL support light and dark themes via the `data-theme` attribute on the `<html>` element.

#### Scenario: Light theme (default)

- **GIVEN** `<html data-theme="light">` or no `data-theme` attribute
- **WHEN** the page renders
- **THEN** light-theme color values from `:root` SHALL be applied

#### Scenario: Dark theme

- **GIVEN** `<html data-theme="dark">`
- **WHEN** the page renders
- **THEN** dark-theme color values from `[data-theme="dark"]` SHALL override `:root` values
- **AND** shadow tokens SHALL switch to dark-mode shadows
- **AND** noise texture opacity SHALL increase

### Requirement: Typography

The system SHALL use Inter as the primary font family and JetBrains Mono for monospace.

#### Scenario: Display and body text

- **GIVEN** `core.css` is loaded
- **WHEN** headings and body text render
- **THEN** `--font-display` and `--font-body` SHALL resolve to Inter with system font fallbacks
- **AND** `--font-mono` SHALL resolve to JetBrains Mono with monospace fallbacks

### Requirement: Type Scale

The system SHALL provide a complete type scale with responsive clamping.

#### Scenario: Heading sizes

- **GIVEN** `<h1>` and `<h2>` elements
- **WHEN** the page renders at any viewport width
- **THEN** `h1` SHALL use `--fs-h1` (clamped between 36px and 68px)
- **AND** `h2` SHALL use `--fs-h2` (clamped between 28px and 46px)
- **AND** `h3` SHALL use `--fs-h3` (20px)

#### Scenario: Body and utility sizes

- **GIVEN** `.lead`, `.body`, `.meta`, and `.eyebrow` elements
- **WHEN** the page renders
- **THEN** `.lead` SHALL use 18px, `.body` SHALL use 16px, `.meta` SHALL use 13px
- **AND** `.eyebrow` SHALL use 12px uppercase monospace with teal color

### Requirement: 8px Baseline Grid

The system SHALL use an 8px baseline grid spacing system.

#### Scenario: Gap tokens

- **GIVEN** `core.css` is loaded
- **WHEN** any layout spacing is applied
- **THEN** spacing SHALL use `var(--gap-*)` tokens: `--gap-xs` (8px), `--gap-sm` (12px), `--gap-md` (20px), `--gap-lg` (32px), `--gap-xl` (56px), `--gap-2xl` (96px)

### Requirement: Shared Components

The system SHALL provide shared component styles via utility classes in `core.css`.

#### Scenario: Button variants

- **GIVEN** an element with `.btn-primary`, `.btn-secondary`, or `.btn-ghost`
- **WHEN** the page renders
- **THEN** `.btn-primary` SHALL render as a gradient blue button with glow effect
- **AND** `.btn-secondary` SHALL render as an outlined button with backdrop blur
- **AND** `.btn-ghost` SHALL render as a transparent text button
- **AND** all buttons SHALL have hover lift, active press, and focus-visible states

#### Scenario: Card components

- **GIVEN** an element with `.card` or `.glass-card`
- **WHEN** the page renders
- **THEN** `.card` SHALL render with surface background, border, border-radius, and shadow
- **AND** `.glass-card` SHALL render with backdrop blur and semi-transparent background
- **AND** both SHALL have hover lift and border-color transition

#### Scenario: Grid layouts

- **GIVEN** elements with `.grid-2`, `.grid-3`, `.grid-4`, or `.grid-5`
- **WHEN** the page renders
- **THEN** child elements SHALL be arranged in responsive CSS Grid columns matching the class name
- **AND** grids SHALL collapse to single column at mobile breakpoints

#### Scenario: FAQ accordion

- **GIVEN** FAQ markup with `.faq-item`, `.faq-question`, `.faq-answer`
- **WHEN** a question is clicked
- **THEN** the answer SHALL expand with a `grid-template-rows` transition
- **AND** the icon SHALL rotate 45 degrees

### Requirement: No Hardcoded Colors

The system SHALL NOT use hardcoded hex colors in page content outside the design system, except within `<style>` blocks, SVG `fill` attributes, and `core.css` token definitions.

#### Scenario: Validation enforces variable usage

- **GIVEN** any page HTML content outside `<style>` blocks and SVG fills
- **WHEN** `npm run validate` is executed
- **THEN** hardcoded hex colors SHALL be flagged as warnings

#### Scenario: core.css is exempt from hex validation

- **GIVEN** `core.css` defines CSS custom properties using OKLCH and hex values
- **WHEN** `npm run validate` is executed
- **THEN** hex values within `core.css` token definitions SHALL NOT be flagged
