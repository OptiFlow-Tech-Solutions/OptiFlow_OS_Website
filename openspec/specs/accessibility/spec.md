# Accessibility

## Purpose

Define the accessibility standards that every page must meet to ensure the OptiFlow OS website is usable by all visitors.

## Requirements

### Requirement: WCAG 2.2 Level AA Compliance

The system SHALL meet WCAG 2.2 Level AA standards across all pages.

#### Scenario: Standards conformance

- **GIVEN** any page on the website
- **WHEN** the page is tested against WCAG 2.2 Level AA criteria
- **THEN** all success criteria SHALL be satisfied

### Requirement: Skip-to-Content Link

The system SHALL provide a skip-to-content link on every page.

#### Scenario: Skip link visibility

- **GIVEN** a keyboard user navigates to a page
- **WHEN** the Tab key is pressed
- **THEN** a "Skip to content" link SHALL become visible at the top of the page
- **AND** activating the link SHALL move focus to the `<main>` content area

### Requirement: Visible Focus Indicators

The system SHALL provide visible `:focus-visible` outlines on all interactive elements.

#### Scenario: Keyboard focus visible

- **GIVEN** a keyboard user navigates interactive elements
- **WHEN** any element receives focus via keyboard
- **THEN** a 2px solid teal (`var(--teal)`) outline with 2px offset SHALL appear
- **AND** the outline SHALL have a 4px border-radius

### Requirement: Minimum Contrast Ratio

The system SHALL maintain a minimum 4.5:1 contrast ratio for all text content.

#### Scenario: Text contrast sufficient

- **GIVEN** any text content on any page
- **WHEN** the foreground and background colors are measured
- **THEN** the contrast ratio SHALL be at least 4.5:1
- **AND** large text (18px+ or 14px+ bold) SHALL meet at least 3:1

### Requirement: Semantic HTML Landmarks

The system SHALL use semantic HTML landmarks on every page.

#### Scenario: Landmark structure

- **GIVEN** any assembled page
- **WHEN** the page is inspected
- **THEN** navigation SHALL be wrapped in `<header role="navigation">`
- **AND** main content SHALL be wrapped in `<main>`
- **AND** footer SHALL be wrapped in `<footer>`

### Requirement: ARIA Labels

The system SHALL include `aria-label` attributes on interactive elements.

#### Scenario: Interactive element labeling

- **GIVEN** interactive elements without visible text labels
- **WHEN** the page is inspected
- **THEN** each SHALL have an `aria-label` attribute (e.g., hamburger button: "Toggle menu", theme toggle: "Toggle theme")
- **AND** FAQ question buttons SHALL have `aria-expanded` reflecting open/closed state

### Requirement: Reduced Motion

The system SHALL respect the `prefers-reduced-motion` media query.

#### Scenario: Animations disabled

- **GIVEN** the user's system has `prefers-reduced-motion: reduce` enabled
- **WHEN** any page renders
- **THEN** all CSS animations and transitions SHALL be disabled (duration 0.01ms)
- **AND** all `.reveal` and staggered elements SHALL be fully visible (opacity: 1, transform: none)
- **AND** glow and CTA gradient animations SHALL be disabled

### Requirement: Keyboard Navigation

The system SHALL ensure all navigation and interactive elements are keyboard-accessible.

#### Scenario: Full keyboard operability

- **GIVEN** a keyboard-only user navigates the website
- **WHEN** the Tab key is used to move through interactive elements
- **THEN** all nav links, buttons, theme toggles, FAQ accordion items, and form fields SHALL be focusable and operable
- **AND** the mobile drawer SHALL not trap focus when closed
