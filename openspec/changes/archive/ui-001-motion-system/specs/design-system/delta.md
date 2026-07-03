# Design System — Delta: Easing Tokens & Reveal Variants

## ADDED: Complete Easing Curve Tokens

The system SHALL provide a complete set of easing curve tokens for all common animation needs.

#### Scenario: Easing tokens available

- **GIVEN** `core.css` is loaded
- **WHEN** a component references `var(--ease-out)`, `var(--ease-in)`, `var(--ease-in-out)`, or `var(--ease-spring)`
- **THEN** the correct cubic-bezier curve SHALL be applied
- **AND** `--ease-out` SHALL be `cubic-bezier(0.22, 1, 0.36, 1)` (entrances)
- **AND** `--ease-in` SHALL be `cubic-bezier(0.64, 0, 0.78, 0)` (exits)
- **AND** `--ease-in-out` SHALL be `cubic-bezier(0.65, 0, 0.35, 1)` (symmetric)
- **AND** `--ease-spring` SHALL be `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy entrances)

## ADDED: Motion Distance Token

The system SHALL provide a `--motion-distance` token for configurable reveal animation distance.

#### Scenario: Motion distance configurable

- **GIVEN** `core.css` is loaded
- **WHEN** `.reveal` or `.reveal-left` or `.reveal-right` elements animate
- **THEN** transform distance SHALL use `var(--motion-distance, 28px)`
- **AND** the default value SHALL be 28px

## ADDED: Reveal Direction Variants

The system SHALL provide directional and scale reveal variants in addition to the base `.reveal` class.

#### Scenario: Directional reveal variants

- **GIVEN** `core.css` is loaded
- **WHEN** an element has `.reveal-left`, `.reveal-right`, or `.reveal-scale`
- **THEN** each SHALL have independent opacity and transform transitions
- **AND** `.reveal-left` SHALL enter from the left (`translateX` negative)
- **AND** `.reveal-right` SHALL enter from the right (`translateX` positive)
- **AND** `.reveal-scale` SHALL enter via scale-up (`scale(0.94)` to `scale(1)`)
- **AND** all variants SHALL be observed by the shared IntersectionObserver in core.js

#### Scenario: GPU-accelerated reveals

- **GIVEN** any `.reveal` or reveal-variant element
- **WHEN** the page renders
- **THEN** the element SHALL have `will-change: opacity, transform` to hint GPU compositing

## ADDED: CSS-Only Reveal (@starting-style)

The system SHALL provide CSS-only enter-transition support for JS-disabled browsers.

#### Scenario: @starting-style fallback

- **GIVEN** `core.css` is loaded and JavaScript is disabled
- **WHEN** the page renders
- **THEN** `.reveal`, `.reveal-left`, `.reveal-right`, and `.reveal-scale` elements SHALL have an `@starting-style` block setting `opacity: 0`
- **AND** elements SHALL transition to their visible state when added to the DOM

## MODIFIED: Transition Tokens Requirement

The Transition Tokens requirement SHALL be extended to include the complete easing curve palette (`--ease-in`, `--ease-in-out`, `--ease-spring`) and the motion distance token (`--motion-distance`).
