# Design System — Delta: Page Transition Animations

## ADDED: Page Enter Animation

The system SHALL animate the page content on initial load with a subtle fade-and-slide entrance.

#### Scenario: Page loads with enter animation

- **GIVEN** a page is loaded via navigation
- **WHEN** `DOMContentLoaded` fires
- **THEN** the `<html>` element SHALL receive class `page-enter-active`
- **AND** the `<body>` SHALL animate from `opacity: 0; transform: translateY(10px)` to `opacity: 1; transform: translateY(0)`
- **AND** the animation duration SHALL be 350ms
- **AND** the animation SHALL use `cubic-bezier(0.22, 1, 0.36, 1)` easing

#### Scenario: Reduced motion disables enter animation

- **GIVEN** `prefers-reduced-motion: reduce` is active
- **WHEN** a page loads
- **THEN** the enter animation SHALL NOT play (animation-duration: 0.01ms)

## ADDED: Page Exit Animation

The system SHALL animate the page content on navigation exit with a quick fade-out.

#### Scenario: Clicking internal link plays exit animation

- **GIVEN** the user clicks an internal navigation link (same-origin, not hash-only, not download, not `target="_blank"`, not `mailto:`/`tel:`)
- **WHEN** the click handler fires
- **THEN** the default navigation SHALL be prevented
- **AND** the `<html>` element SHALL receive class `page-exit-active`
- **AND** the `<body>` SHALL animate from `opacity: 1` to `opacity: 0`
- **AND** the animation duration SHALL be 250ms
- **AND** the animation SHALL use `cubic-bezier(0.64, 0, 0.78, 0)` easing
- **AND** after 300ms the browser SHALL navigate to the link's href

#### Scenario: Reduced motion disables exit animation

- **GIVEN** `prefers-reduced-motion: reduce` is active
- **WHEN** an internal link is clicked
- **THEN** the exit animation SHALL NOT play
- **AND** navigation SHALL proceed immediately (no preventDefault)

#### Scenario: External links bypass exit animation

- **GIVEN** a link points to a different origin
- **WHEN** the link is clicked
- **THEN** the exit animation SHALL NOT trigger
- **AND** default browser navigation SHALL proceed

## ADDED: Page Transition CSS Primitives

The system SHALL provide `@keyframes pageEnter` and `@keyframes pageExit` primitives in core.css.

#### Scenario: Keyframe definitions exist

- **GIVEN** `core.css` is loaded
- **WHEN** any component references `pageEnter` or `pageExit` animation
- **THEN** `@keyframes pageEnter` SHALL define `from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) }`
- **AND** `@keyframes pageExit` SHALL define `from { opacity: 1 } to { opacity: 0 }`
