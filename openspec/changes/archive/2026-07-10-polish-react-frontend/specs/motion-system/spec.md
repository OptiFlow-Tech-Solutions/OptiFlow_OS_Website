## ADDED Requirements

### Requirement: Scroll-triggered reveal animation
The system SHALL animate elements into view as they enter the viewport during scrolling.

#### Scenario: Element reveals on scroll
- **WHEN** a `.reveal` element's intersection ratio exceeds 0.1 with the viewport
- **THEN** the element SHALL transition from opacity 0 and translateY of `--motion-distance` to opacity 1 and translateY 0 over 600ms

#### Scenario: Staggered children animate sequentially
- **WHEN** a `.stagger-3`, `.stagger-4`, or `.stagger-5` container enters the viewport
- **THEN** each child SHALL animate with a delay of 80ms times its index, producing a cascading entrance

#### Scenario: Reduced motion is respected
- **WHEN** the user has `prefers-reduced-motion: reduce` set
- **THEN** all scroll-triggered animations SHALL be disabled and elements SHALL appear immediately at their final state

### Requirement: Card hover micro-interaction
The system SHALL provide subtle visual feedback on card hover.

#### Scenario: Card hover state
- **WHEN** user hovers over a `.card` element
- **THEN** the card SHALL translate upward by 4px, its shadow SHALL increase to `--shadow-card-hover`, and it SHALL scale to 1.01 over 250ms

#### Scenario: Card hover respects reduced motion
- **WHEN** user with reduced motion preference hovers over a card
- **THEN** no transform or shadow transition SHALL occur

### Requirement: Button interaction feedback
The system SHALL provide visual feedback on button hover and active states.

#### Scenario: Primary button hover
- **WHEN** user hovers over a `.btn-primary` element
- **THEN** the button SHALL show a background-position shift animation (shimmer effect) and shadow increase to `--shadow-button-hover`

#### Scenario: Button active/press state
- **WHEN** user presses (mousedown or touchstart) a button
- **THEN** the button SHALL scale to 0.97 and shadow SHALL reduce to `--shadow-inset` over 100ms

### Requirement: Page transition refinement
The system SHALL provide smooth visual transitions between routes.

#### Scenario: Navigate between pages
- **WHEN** user navigates from one route to another within the SPA
- **THEN** the outgoing page SHALL fade out and the incoming page SHALL fade in with a subtle translateY slide-up using the View Transitions API

#### Scenario: Page transition respects reduced motion
- **WHEN** user with reduced motion preference navigates
- **THEN** no crossfade or slide animation SHALL play; pages SHALL swap instantly

### Requirement: Counter animation
The system SHALL animate numeric values counting up when they enter the viewport.

#### Scenario: Counter enters viewport
- **WHEN** a `.count-up` element with `data-count` attribute enters the viewport
- **THEN** the displayed number SHALL animate from 0 to the target value using easeOutExpo easing over the duration specified in `data-duration` (default 2000ms)

#### Scenario: Counter respects reduced motion
- **WHEN** user has reduced motion preference
- **THEN** the counter SHALL display the final value immediately without animation
