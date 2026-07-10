# react-nav

## Purpose

React navigation bar component with desktop links, Resources dropdown, mobile hamburger drawer, scroll-triggered blur/border, active page highlighting via React Router, and theme toggle integration.

## Requirements

### Requirement: Nav component renders desktop navigation
The system SHALL provide a Nav component that renders a fixed-position `<header>` with the OptiFlow logo, 8 desktop navigation links, a Resources hover dropdown, a theme toggle button, and a "Book Demo" CTA button. Navigation data SHALL be imported from the centralized site module (`frontend/src/data/site.ts`) rather than hardcoded within the component.

#### Scenario: Desktop nav renders all links from site module
- **WHEN** Nav is rendered on a viewport wider than 1024px
- **THEN** an `<header>` element with `role="navigation"` contains the OptiFlow logo linking to `/os/`, all nav links matching the site module's `navLinks`, a Resources dropdown matching the site module's `navDropdown`, a theme toggle button with sun/moon SVG icons, and a "Book Demo" button matching the site module's `navCTA`

#### Scenario: Desktop nav hides on mobile
- **WHEN** Nav is rendered on a viewport narrower than 1024px
- **THEN** the desktop nav links are hidden via CSS `display: none` and a hamburger button is shown instead

#### Scenario: Nav links are not hardcoded
- **WHEN** inspecting Nav.tsx source
- **THEN** the `navLinks`, `navDropdown`, and `navCTA` constants are imported from the site module, not defined inline in the component file

### Requirement: Nav component highlights active page
The system SHALL highlight the nav link matching the current route using the `.active` CSS class.

#### Scenario: Active page highlighted
- **WHEN** the browser URL is `/os/pricing/`
- **THEN** the "Pricing" nav link has the `.active` class (accent color, bold font-weight, underline indicator)

#### Scenario: No active highlight on non-matching routes
- **WHEN** the browser URL is `/os/terms/`
- **THEN** no desktop nav link has the `.active` class

### Requirement: Nav scroll behavior
The system SHALL apply a `.scrolled` CSS class to the nav header when the page is scrolled past 20px from the top.

#### Scenario: Scroll adds scrolled class
- **WHEN** the user scrolls the page beyond 20px from the top
- **THEN** the nav `<header>` element receives the `.scrolled` class, applying a semi-transparent background with `backdrop-filter: blur(24px)`, a bottom border, and a box shadow

#### Scenario: Scroll to top removes scrolled class
- **WHEN** the user scrolls back to the top of the page (scrollY <= 20)
- **THEN** the `.scrolled` class is removed from the nav `<header>` element

### Requirement: Nav mobile drawer
The system SHALL provide a mobile slide-in drawer containing all nav links, triggered by a hamburger button on viewports 1024px and below.

#### Scenario: Hamburger opens drawer
- **WHEN** the hamburger button is clicked on a mobile viewport
- **THEN** the mobile drawer slides in from the right (`transform: translateX(0)`), the hamburger icon morphs into an X shape, and a dark overlay appears behind the drawer

#### Scenario: Drawer closes on link click
- **WHEN** a nav link inside the open drawer is clicked
- **THEN** the drawer closes (slides out), the overlay fades out, and the hamburger returns to its default state

#### Scenario: Drawer closes on overlay click
- **WHEN** the dark overlay behind the open drawer is clicked
- **THEN** the drawer closes

#### Scenario: Drawer closes on Escape key
- **WHEN** the Escape key is pressed while the drawer is open
- **THEN** the drawer closes

#### Scenario: Drawer animation matches original
- **WHEN** the drawer opens or closes
- **THEN** the animation uses `transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)` for the slide and a matching opacity transition for the overlay

### Requirement: Nav theme toggle
The system SHALL include a theme toggle button in the nav that consumes the `useTheme()` hook from ThemeProvider.

#### Scenario: Theme toggle switches theme
- **WHEN** the nav theme toggle button is clicked
- **THEN** the site theme switches between light and dark mode via `toggleTheme()`, and the button displays a sun icon in light mode and a moon icon in dark mode

#### Scenario: Theme toggle has accessible label
- **WHEN** the nav theme toggle button is rendered
- **THEN** it has an `aria-label` of "Switch to dark mode" when in light mode and "Switch to light mode" when in dark mode

### Requirement: Nav CTA button uses shared Button component
The system SHALL render the "Book Demo" CTA as a `<Button variant="primary" glow as={Link} to="/os/demo-booking/">` using the existing shared Button component.

#### Scenario: CTA renders as primary glow button
- **WHEN** Nav is rendered
- **THEN** the CTA is a `<Button>` component with `variant="primary"`, `glow` prop enabled, `as={Link}`, and `to="/os/demo-booking/"`
