# Shared Components

## Purpose

Define the reusable UI components provided by `src/partials/nav.html`, `src/partials/footer.html`, `assets/css/core.css`, and `assets/js/core.js` that every page inherits.

## Requirements

### Requirement: Shared Navigation Component

The system SHALL provide a shared navigation component with desktop navigation and a mobile drawer.

#### Scenario: Desktop navigation

- **GIVEN** a page with viewport width > 1024px
- **WHEN** the navigation renders
- **THEN** all nav links SHALL be displayed inline via `.desktop-nav`
- **AND** the hamburger button SHALL be hidden
- **AND** the "Resources" link SHALL open a dropdown on hover

#### Scenario: Mobile drawer

- **GIVEN** a page with viewport width <= 1024px
- **WHEN** the hamburger button is clicked
- **THEN** the mobile drawer SHALL slide in from the right
- **AND** a semi-transparent overlay SHALL appear
- **AND** clicking the overlay or any drawer link SHALL close the drawer

#### Scenario: Active link indicator

- **GIVEN** the current page has an `active` field in `site.json` (e.g., "Solutions")
- **WHEN** the nav is injected during build
- **THEN** the corresponding nav link SHALL receive the `.active` class
- **AND** the active link SHALL render with accent color and an underline indicator

### Requirement: Shared Footer Component

The system SHALL provide a shared footer component with branded columns.

#### Scenario: Footer structure

- **GIVEN** any page with an injected footer
- **WHEN** the footer renders
- **THEN** it SHALL display a 5-column grid: Brand, Product, Solutions, Resources, Contact
- **AND** the Contact column SHALL include phone (tel: link), email (mailto: link), and location text
- **AND** the bottom bar SHALL display the copyright notice with the current year and company name

### Requirement: Theme Toggle

The system SHALL provide a theme toggle (light/dark) that persists preference to localStorage.

#### Scenario: Theme toggle in navigation

- **GIVEN** the page header
- **WHEN** the theme toggle button is clicked
- **THEN** the `data-theme` attribute on `<html>` SHALL toggle between "light" and "dark"
- **AND** the preference SHALL be saved to `localStorage` under key `optiflow-theme`

#### Scenario: Theme toggle in footer

- **GIVEN** the page footer
- **WHEN** the footer theme toggle button is clicked
- **THEN** the theme SHALL toggle identically to the nav toggle
- **AND** both toggles SHALL remain synchronized

#### Scenario: Icon display per theme

- **GIVEN** a theme toggle button
- **WHEN** the current theme is "light"
- **THEN** the sun icon SHALL be visible and the moon icon SHALL be hidden
- **WHEN** the current theme is "dark"
- **THEN** the moon icon SHALL be visible and the sun icon SHALL be hidden

### Requirement: Scroll-Reveal Animation

The system SHALL provide scroll-reveal animation via IntersectionObserver.

#### Scenario: Elements revealed on scroll

- **GIVEN** elements marked with `.reveal` class
- **WHEN** an element enters the viewport (threshold 0.1, rootMargin -40px)
- **THEN** the `.visible` class SHALL be added
- **AND** the element SHALL be unobserved after becoming visible
- **AND** staggered children within `.stagger-3`, `.stagger-4`, `.stagger-5` SHALL animate sequentially

### Requirement: Animated Counters

The system SHALL provide animated counter elements for statistics.

#### Scenario: Counter animation

- **GIVEN** an element with `data-count` attribute
- **WHEN** the element enters the viewport (threshold 0.5)
- **THEN** a number animation SHALL run with easeOutExpo easing over the specified duration
- **AND** the counter SHALL be unobserved after animation completes
- **AND** `data-prefix`, `data-suffix`, and `data-fmt` attributes SHALL format the output

### Requirement: FAQ Accordion

The system SHALL provide FAQ accordion with expand/collapse functionality.

#### Scenario: Accordion toggle

- **GIVEN** FAQ items with `.faq-question` buttons
- **WHEN** a question is clicked
- **THEN** the parent `.faq-item` SHALL toggle the `.open` class
- **AND** `aria-expanded` SHALL update to reflect the state
- **AND** the answer area SHALL animate open via CSS grid transition

### Requirement: Sticky CTA Visibility

The system SHALL provide sticky CTA button visibility control based on scroll position.

#### Scenario: CTA appears after hero

- **GIVEN** a `.sticky-cta` element
- **WHEN** the user scrolls past 70% of the hero section height
- **THEN** the `.visible` class SHALL be added, making the CTA visible and clickable

### Requirement: Scroll-to-Top Button

The system SHALL provide a scroll-to-top button with visibility control.

#### Scenario: Button appears after scrolling

- **GIVEN** a `.scroll-top` button
- **WHEN** the user scrolls past 600px
- **THEN** the `.visible` class SHALL be added
- **AND** clicking the button SHALL smoothly scroll to the top of the page
