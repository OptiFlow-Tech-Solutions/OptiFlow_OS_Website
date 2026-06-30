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

### Requirement: Skip-to-Content Link

The navigation partial SHALL include a skip-to-content link as the first focusable element in the page.

#### Scenario: Skip link present and functional

- **GIVEN** any page with injected navigation
- **WHEN** the page renders and the user presses Tab
- **THEN** a "Skip to content" link SHALL appear at the top of the viewport
- **AND** clicking it SHALL move focus to `<main id="content">`

### Requirement: Mobile Drawer Active State

The mobile drawer SHALL resolve active link indicators identical to desktop nav.

#### Scenario: Active link in mobile drawer

- **GIVEN** the current page has `active: "Features"` in `site.json`
- **WHEN** the mobile drawer is opened
- **THEN** the Features link in the drawer SHALL have the `.active` class

### Requirement: Resources Dropdown

The Resources dropdown in both desktop nav and mobile drawer SHALL contain only Newsletter and FAQ.

#### Scenario: Resources dropdown content

- **GIVEN** the nav is rendered
- **WHEN** the Resources dropdown is opened
- **THEN** it SHALL display only "Newsletter" and "FAQ"
- **AND** it SHALL NOT display "Privacy Policy" or "Terms & Conditions"

### Requirement: Footer Placeholders

The footer partial SHALL use `{{PHONE}}`, `{{EMAIL}}`, `{{LOCATION}}`, `{{COMPANY}}`, and `{{YEAR}}` placeholders instead of hardcoded values.

#### Scenario: Footer uses placeholders

- **GIVEN** the footer partial source
- **WHEN** inspected
- **THEN** phone SHALL be `{{PHONE}}` (not a hardcoded number)
- **AND** email SHALL be `{{EMAIL}}` (not a hardcoded email)
- **AND** year SHALL be `{{YEAR}}` (not a hardcoded year)

### Requirement: Navigation CTA

The nav CTA area SHALL show a single "Book Demo" button linking to `/demo-booking/`.

#### Scenario: Single CTA in nav

- **GIVEN** the nav header
- **WHEN** it renders
- **THEN** only one CTA button ("Book Demo") SHALL be visible
- **AND** no secondary "Watch Demo" button SHALL be present

### Requirement: Keyboard Drawer Control

The interactive runtime SHALL close the mobile drawer on Escape key press.

#### Scenario: Escape closes drawer

- **GIVEN** the mobile drawer is open
- **WHEN** the user presses the Escape key
- **THEN** the drawer SHALL close
- **AND** the hamburger button SHALL return to closed state

### Requirement: Unified FAQ Accordion

All FAQ toggles SHALL use the `.faq-question` class exclusively.

#### Scenario: FAQ toggle via .faq-question

- **GIVEN** any FAQ toggle button with class `.faq-question`
- **WHEN** the button is clicked
- **THEN** the parent `.faq-item` SHALL toggle `.open`
- **AND** `aria-expanded` SHALL update to reflect state

### Requirement: Unified Counter System

All animated counters SHALL use `data-count` attribute. Incorrect `data-target` usage SHALL be migrated.

#### Scenario: Counter via data-count

- **GIVEN** an element with `data-count="1500"`
- **WHEN** the element enters the viewport
- **THEN** an easeOutExpo animation SHALL count from 0 to 1500
- **AND** `data-prefix`, `data-suffix`, `data-fmt`, `data-duration` attributes SHALL be respected
