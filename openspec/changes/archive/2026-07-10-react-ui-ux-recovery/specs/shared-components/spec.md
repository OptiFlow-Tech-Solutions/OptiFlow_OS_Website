# shared-components (delta)

## ADDED Requirements

### Requirement: Button component has transition animation
The Button component SHALL apply CSS transitions on `background-color`, `border-color`, `box-shadow`, and `transform` properties using `var(--transition-base)` duration and `var(--ease-out)` timing.

#### Scenario: Button hover transitions smoothly
- **WHEN** hovering over a primary button
- **THEN** the background, shadow, and transform change over ~250ms with an ease-out curve

#### Scenario: Button active state provides feedback
- **WHEN** pressing a button
- **THEN** the button scales down slightly (`transform: scale(0.97)`) providing tactile feedback

### Requirement: Card component has hover transition
The Card component SHALL apply a smooth elevation transition on hover using CSS `transition` on `box-shadow` and `transform` properties.

#### Scenario: Card hover elevates smoothly
- **WHEN** hovering over a card with `hover` prop
- **THEN** the shadow deepens and the card lifts over ~250ms

### Requirement: Section component scroll reveal
The Section component SHALL support a `reveal` prop that, when enabled, applies scroll-triggered fade-in animation to its children using the existing `useScrollReveal` hook integration.

#### Scenario: Reveal section animates on scroll
- **WHEN** `<Section reveal>` scrolls into view
- **THEN** its direct children animate in with staggered delays

### Requirement: Input component focus transition
The Input component SHALL apply a CSS transition on `border-color` and `box-shadow` during focus/blur events.

#### Scenario: Input focus has smooth border transition
- **WHEN** an input receives `:focus-visible`
- **THEN** the border and box-shadow change over ~150ms

### Requirement: Nav dropdown menu animation
The Nav component's Resource dropdown SHALL animate in/out using `opacity` and `transform: translateY()` with `var(--transition-base)` duration.

#### Scenario: Dropdown animates open
- **WHEN** hovering over the Resources nav item
- **THEN** the dropdown menu fades in and slides down over 250ms
