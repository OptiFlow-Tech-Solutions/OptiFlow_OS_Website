## MODIFIED Requirements

### Requirement: Nav component renders desktop navigation
The system SHALL provide a Nav component that renders a fixed-position `<header>` with the OptiFlow logo, 8 desktop navigation links, a Resources hover dropdown, a theme toggle button, and a "Book Demo" CTA button. Navigation data SHALL be imported from `siteConfig` rather than hardcoded within the component.

#### Scenario: Desktop nav renders all links from siteConfig
- **WHEN** Nav is rendered on a viewport wider than 1024px
- **THEN** an `<header>` element with `role="navigation"` contains the OptiFlow logo linking to `/os/`, all nav links matching `siteConfig.navLinks`, a Resources dropdown matching `siteConfig.navDropdown`, a theme toggle button with sun/moon SVG icons, and a "Book Demo" button matching `siteConfig.navCTA`

#### Scenario: Desktop nav hides on mobile
- **WHEN** Nav is rendered on a viewport narrower than 1024px
- **THEN** the desktop nav links are hidden via CSS `display: none` and a hamburger button is shown instead

#### Scenario: Nav links are not hardcoded
- **WHEN** inspecting Nav.tsx source
- **THEN** the `navLinks`, `navDropdown`, and `navCTA` constants are imported from `siteConfig`, not defined inline in the component file
