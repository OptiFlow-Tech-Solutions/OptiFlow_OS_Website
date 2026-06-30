## ADDED Requirements

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

#### Scenario: Easing token available
- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--ease-out)`
- **THEN** the standard ease-out cubic-bezier curve SHALL be applied

### Requirement: Noise Texture

The system SHALL provide configurable noise texture overlay via CSS custom properties.

#### Scenario: Noise opacity token
- **GIVEN** `core.css` is loaded
- **WHEN** `.noise-overlay` is used with `var(--noise-opacity)`
- **THEN** the noise texture SHALL render at the defined opacity
- **AND** dark theme SHALL use a higher opacity value for visibility on dark backgrounds

## MODIFIED Requirements

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
