## ADDED Requirements

### Requirement: useTypewriter hook
The system SHALL provide a useTypewriter hook that animates text character-by-character through a cycle of typing and deleting phrases, matching the timing and behavior of the original home.html typewriter.

#### Scenario: Hook types first phrase on mount
- **WHEN** a component using `useTypewriter(phrases, options)` mounts
- **THEN** it starts typing the first phrase character by character at the configured speed (default 60ms per character)

#### Scenario: Hook cycles through all phrases
- **WHEN** the hook has finished typing and holding (default 2200ms hold) a phrase
- **THEN** it deletes the text at delete speed (default 30ms per character) and begins typing the next phrase

#### Scenario: Hook pauses on tab blur
- **WHEN** the browser tab becomes hidden (visibilitychange)
- **THEN** the animation pauses and resumes when the tab regains focus

#### Scenario: Hook respects reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` set
- **THEN** the cursor stops blinking and the typewriter displays a static phrase without animation

#### Scenario: Hook cleans up on unmount
- **WHEN** the component using useTypewriter unmounts
- **THEN** all rAF callbacks and timeouts are cancelled

#### Scenario: Hook returns current text and cursor visibility
- **WHEN** the hook is active
- **THEN** it returns `{ text: string, isCursorVisible: boolean }` where text is the current displayed substring

### Requirement: useMouseGlow hook
The system SHALL provide a useMouseGlow hook that tracks mouse position within a container element and returns coordinates for a radial gradient follower effect.

#### Scenario: Hook tracks mouse position
- **WHEN** the user moves the mouse over the target element
- **THEN** the hook returns `{ x: number, y: number, isActive: boolean }` with throttled position updates via requestAnimationFrame

#### Scenario: Hook sets isActive on first mousemove
- **WHEN** the mouse first enters the target area
- **THEN** isActive becomes true, enabling the glow element's opacity transition

#### Scenario: Hook cleans up listeners on unmount
- **WHEN** the component unmounts
- **THEN** all event listeners are removed

### Requirement: useCardTilt hook
The system SHALL provide a useCardTilt hook that applies 3D perspective transforms to elements on mouse hover, matching the original card tilt behavior.

#### Scenario: Hook tilts card on mousemove
- **WHEN** the user moves the mouse over a card-tilt element
- **THEN** the card rotates up to 12 degrees on X and Y axes based on mouse position relative to the card center, using rAF-throttled updates

#### Scenario: Hook resets transform on mouse leave
- **WHEN** the mouse leaves the card-tilt element
- **THEN** the transform resets to none (no rotation)

#### Scenario: Hook supports max tilt angle configuration
- **WHEN** the hook is initialized with `{ maxTilt: 12 }`
- **THEN** the tilt angle is bounded to the configured maximum

### Requirement: useParallax hook
The system SHALL provide a useParallax hook that moves an element in response to mouse position across the entire viewport.

#### Scenario: Hook moves element on global mousemove
- **WHEN** the user moves the mouse anywhere on the page
- **THEN** the hook returns `{ transform: string }` with translateX/translateY values (max 16px horizontal, 12px vertical) based on mouse position relative to viewport center

#### Scenario: Hook uses rAF throttling
- **WHEN** multiple mousemove events fire rapidly
- **THEN** updates are throttled to one per animation frame

### Requirement: useCountUp hook
The system SHALL provide a useCountUp hook that animates a numeric value counting up from a start to a target value.

#### Scenario: Hook counts up on scroll into view
- **WHEN** the element containing the counter scrolls into the viewport (IntersectionObserver)
- **THEN** the hook animates from 0 to the target value over the configured duration

#### Scenario: Hook fires only once
- **WHEN** the counter has already animated
- **THEN** it does not re-animate on subsequent scroll events

#### Scenario: Hook supports prefix/suffix formatting
- **WHEN** the hook is configured with `{ suffix: '+', prefix: '₹' }`
- **THEN** the returned display string includes the formatting (e.g., "₹8L")

#### Scenario: Hook respects reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` set
- **THEN** the target value is displayed immediately without animation

### Requirement: useScrollReveal hook
The system SHALL provide a useScrollReveal hook compatible with the existing `.reveal` and `.stagger-*` CSS classes from GlobalStyles.

#### Scenario: Hook adds visible class on scroll into view
- **WHEN** an element with `.reveal` class scrolls into the viewport
- **THEN** the hook adds `.visible` class, triggering the CSS opacity/transform transition

#### Scenario: Hook respects stagger delays
- **WHEN** a container has `.stagger-4` class with 8 children
- **THEN** children become visible with staggered delays matching the CSS (0s, 0.08s, 0.16s, ... 0.56s)

#### Scenario: Hook works with existing CSS transitions
- **WHEN** the `.visible` class is added
- **THEN** the element's opacity transitions from 0 to 1 and transform from translateY(28px) to none over 0.7s with cubic-bezier easing
