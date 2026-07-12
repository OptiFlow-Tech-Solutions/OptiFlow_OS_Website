## ADDED Requirements

### Requirement: Keyboard navigation for all interactive elements
All interactive UI elements SHALL be operable via keyboard alone.

#### Scenario: Tab through navigation links
- **WHEN** user presses Tab key repeatedly
- **THEN** focus SHALL move sequentially through all navigation links, dropdown triggers, and CTA buttons, with a visible focus indicator on each

#### Scenario: Open and close nav dropdown with keyboard
- **WHEN** user focuses the "Resources" dropdown trigger and presses Enter or Space
- **THEN** the dropdown menu SHALL open, and pressing Escape SHALL close it and return focus to the trigger

#### Scenario: Open and close mobile drawer with keyboard
- **WHEN** user presses Enter on the hamburger button
- **THEN** the mobile drawer SHALL open, focus SHALL move to the first link inside it, and pressing Escape SHALL close the drawer and return focus to the hamburger

#### Scenario: Navigate FAQ accordion with keyboard
- **WHEN** user focuses an FAQ question button and presses Enter or Space
- **THEN** the answer SHALL expand, `aria-expanded` SHALL update to "true", and pressing Enter/Space again SHALL collapse it

### Requirement: Visible focus indicators
All focusable elements SHALL display a visible focus indicator.

#### Scenario: Element receives keyboard focus
- **WHEN** any interactive element receives focus via keyboard navigation
- **THEN** a visible outline or ring SHALL appear on the element with at least 3:1 contrast against adjacent colors

#### Scenario: Mouse click does not show focus ring
- **WHEN** user clicks an element with a mouse
- **THEN** the focus ring SHALL NOT appear (using `:focus-visible` not `:focus`)

### Requirement: ARIA labels on icon-only controls
All icon-only buttons and controls SHALL have accessible text labels.

#### Scenario: Theme toggle button
- **WHEN** a screen reader encounters the theme toggle button
- **THEN** it SHALL announce "Toggle dark mode" or "Toggle light mode" based on current state

#### Scenario: Hamburger menu button
- **WHEN** a screen reader encounters the mobile menu button
- **THEN** it SHALL announce "Open menu" or "Close menu" based on current state

#### Scenario: Scroll-to-top button
- **WHEN** a screen reader encounters the scroll-to-top button
- **THEN** it SHALL announce "Scroll to top"

### Requirement: Color contrast compliance
All text SHALL meet WCAG 2.2 AA contrast minimums.

#### Scenario: Body text contrast
- **WHEN** measuring contrast ratio of body text against its background
- **THEN** the ratio SHALL be at least 4.5:1

#### Scenario: Large text contrast
- **WHEN** measuring contrast ratio of heading text (≥18px bold or ≥24px) against its background
- **THEN** the ratio SHALL be at least 3:1

#### Scenario: Dark mode contrast
- **WHEN** measuring contrast ratios in dark mode
- **THEN** all text SHALL meet the same AA contrast minimums as light mode

### Requirement: Form accessibility
All forms SHALL have properly associated labels and error messages.

#### Scenario: Form input has accessible label
- **WHEN** a screen reader encounters a form input
- **THEN** it SHALL announce the associated label text

#### Scenario: Form error announcement
- **WHEN** form validation fails on submission
- **THEN** error messages SHALL be programmatically associated with their inputs via `aria-describedby` and the first error SHALL receive focus

### Requirement: Skip link
The system SHALL provide a skip-to-content link as the first focusable element.

#### Scenario: Tab from page load
- **WHEN** user presses Tab immediately after page load
- **THEN** a "Skip to content" link SHALL become visible and focused, allowing bypass of navigation
