# page-transitions

## Purpose

SPA page transition animations using the CSS View Transition API with `<custom-ident>@</custom-ident>view-transition` and graceful degradation for unsupported browsers, matching the visual polish of the static site's CSS animations.

## Requirements

### Requirement: Page transition animation on navigation
The system SHALL apply a crossfade transition animation when the user navigates between pages, matching the visual polish of the static site's CSS page transitions.

#### Scenario: Crossfade on forward navigation
- **WHEN** the user clicks a link to navigate to a different page
- **THEN** the outgoing page content fades out while the incoming page content fades in over approximately 200-300ms

#### Scenario: Crossfade on browser back/forward
- **WHEN** the user navigates via browser back or forward buttons
- **THEN** the same crossfade transition animation plays

### Requirement: View Transition API as primary mechanism
The system SHALL use the CSS View Transition API as the primary mechanism for page transitions, with automatic fallback to no animation in unsupported browsers.

#### Scenario: Animation plays in Chromium browsers
- **WHEN** a user navigates in a browser that supports `document.startViewTransition`
- **THEN** the crossfade animation plays

#### Scenario: No animation in unsupported browsers
- **WHEN** a user navigates in a browser that does not support View Transitions
- **THEN** the page changes immediately without animation and no errors occur

### Requirement: Transition respects reduced motion preference
The system SHALL disable page transition animations when the user has enabled the `prefers-reduced-motion: reduce` media query.

#### Scenario: Animation disabled for reduced motion
- **WHEN** a user has `prefers-reduced-motion: reduce` set in their OS
- **THEN** page navigation occurs without any transition animation
