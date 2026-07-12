## ADDED Requirements

### Requirement: Scroll to top on forward navigation
The system SHALL automatically scroll the viewport to the top when the user navigates to a new route via link click or programmatic navigation (PUSH or REPLACE actions).

#### Scenario: Scroll resets on link navigation
- **WHEN** the user clicks a navigation link to a different page
- **THEN** the viewport scrolls to the top (scrollY = 0)

#### Scenario: Scroll resets on programmatic navigation
- **WHEN** the application programmatically navigates via `navigate('/pricing/')`
- **THEN** the viewport scrolls to the top

### Requirement: Preserve scroll position on back/forward
The system SHALL NOT interfere with the browser's native scroll position restoration when the user navigates via browser back or forward buttons (POP action).

#### Scenario: Back button restores scroll position
- **WHEN** the user scrolls down on a page, navigates away, then clicks the browser back button
- **THEN** the page restores its previous scroll position

#### Scenario: Forward button restores scroll position
- **WHEN** the user scrolls down on a page, navigates back, then clicks the browser forward button
- **THEN** the page restores its previous scroll position

### Requirement: Scroll restoration is automatic
The scroll restoration SHALL be handled by a dedicated component or hook that observes route changes, requiring no per-page implementation.

#### Scenario: No per-page scroll code needed
- **WHEN** a new page component is created
- **THEN** the developer does not need to add any scroll-related code to the page component
