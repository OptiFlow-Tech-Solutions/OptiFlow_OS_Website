# Marketing Pages — Delta Spec

## MODIFIED: No Duplicate Shared Logic

Page-specific scripts SHALL NOT duplicate logic already handled by `core.js`. Sticky CTA visibility, scroll-to-top, scroll reveal, stagger animation, and FAQ accordion SHALL be handled exclusively by core.js.

#### Scenario: Sticky CTA no longer duplicated

- **GIVEN** the home, pricing, privacy-policy, and terms pages
- **WHEN** page-specific scripts are inspected
- **THEN** no sticky CTA scroll listener SHALL be present (core.js handles it)
- **AND** the sticky CTA SHALL still function correctly

#### Scenario: Scroll-to-top no longer duplicated

- **GIVEN** the home and pricing pages
- **WHEN** page-specific scripts are inspected
- **THEN** no scroll-to-top scroll listener SHALL be present (core.js handles it)

#### Scenario: Scroll reveal no longer duplicated

- **GIVEN** the product-overview and newsletter pages
- **WHEN** page-specific scripts are inspected
- **THEN** no reveal IntersectionObserver SHALL be present (core.js handles it)

#### Scenario: Stagger animation no longer duplicated

- **GIVEN** the demo-booking, product-overview, and newsletter pages
- **WHEN** page-specific scripts are inspected
- **THEN** no stagger IntersectionObserver SHALL be present (core.js handles it)

## MODIFIED: Unified Counter System

All pages SHALL use `data-count` attribute for animated counters instead of `data-target`.

#### Scenario: Demo-booking counters use data-count

- **GIVEN** the demo-booking page
- **WHEN** counter markup is inspected
- **THEN** counter elements SHALL use `data-count` (not `data-target`)

#### Scenario: Pricing counters use data-count

- **GIVEN** the pricing page
- **WHEN** counter markup is inspected
- **THEN** counter elements SHALL use `data-count` (not `data-target`)
- **AND** counters SHALL animate from 0 to their target value

## MODIFIED: Performance Standards

All page-specific scroll listeners SHALL use `{passive: true}`. Mousemove listeners SHALL be throttled via `requestAnimationFrame`.

#### Scenario: Scroll listeners are passive

- **GIVEN** any page-specific scroll listener
- **WHEN** the listener is registered
- **THEN** the options object SHALL include `{passive: true}`

#### Scenario: Mousemove listeners are throttled

- **GIVEN** a mousemove listener on home or why-optiflow pages
- **WHEN** the mouse moves rapidly
- **THEN** the callback SHALL fire at most once per animation frame
