# react-footer

## Purpose

React footer component with 5-column responsive grid, social media icons, theme toggle, dynamic copyright year, and data sourced from site.json.

## Requirements

### Requirement: Footer component renders 5-column grid
The system SHALL provide a Footer component that renders a 5-column responsive grid containing brand info, Product links, Solutions links, Resources links, and Contact info.

#### Scenario: Footer renders all columns on desktop
- **WHEN** Footer is rendered on a viewport wider than 1024px
- **THEN** a `<footer>` element with background `oklch(12% 0.018 250)` contains a 5-column grid: Brand (logo + tagline, 2fr), Product links (4 items), Solutions links (2 items), Resources links (5 items), and Contact info (phone, email, location)

#### Scenario: Footer collapses to 3 columns on tablet
- **WHEN** Footer is rendered on a viewport between 769px and 1024px
- **THEN** the grid displays 3 columns per row

#### Scenario: Footer collapses to 2 columns on mobile
- **WHEN** Footer is rendered on a viewport between 481px and 768px
- **THEN** the grid displays 2 columns per row

#### Scenario: Footer collapses to single column on small mobile
- **WHEN** Footer is rendered on a viewport 480px or narrower
- **THEN** the grid displays 1 column, stacking all sections vertically

### Requirement: Footer contact info uses site.json data
The system SHALL render contact information using data imported from site.json, including phone number, email address, and location.

#### Scenario: Phone number links correctly
- **WHEN** Footer is rendered
- **THEN** the contact column contains a phone link with `href="tel:+917874677836"` displaying "+91 7874677836"

#### Scenario: Email links correctly
- **WHEN** Footer is rendered
- **THEN** the contact column contains an email link with `href="mailto:info@optiflow.co.in"`

#### Scenario: Location text rendered
- **WHEN** Footer is rendered
- **THEN** the contact column displays "Surat, India"

### Requirement: Footer social media icons
The system SHALL render social media icon links for LinkedIn, X (Twitter), and YouTube in the footer bottom bar.

#### Scenario: Social icons link to correct profiles
- **WHEN** Footer is rendered
- **THEN** the footer bottom bar contains `<a>` elements linking to `https://linkedin.com/company/optiflow-os`, `https://x.com/optiflow_os`, and `https://youtube.com/@optiflow_os` with inline SVG icons

#### Scenario: Social icons have accessible labels
- **WHEN** Footer is rendered
- **THEN** each social icon link has an `aria-label` attribute (e.g., "LinkedIn", "X (Twitter)", "YouTube")

### Requirement: Footer theme toggle
The system SHALL include a theme toggle button in the footer bottom bar that consumes the `useTheme()` hook.

#### Scenario: Footer theme toggle works
- **WHEN** the footer theme toggle button is clicked
- **THEN** the site theme switches between light and dark mode, consistent with the nav theme toggle

### Requirement: Footer copyright year is dynamic
The system SHALL render the copyright year dynamically using `new Date().getFullYear()`.

#### Scenario: Copyright shows current year
- **WHEN** Footer is rendered in 2026
- **THEN** the copyright line displays "2026 OptiFlow Tech Solutions. Built for Indian MSMEs."

### Requirement: Footer link data from site.json
The system SHALL source footer link column data from `site.json.footer.columns`.

#### Scenario: Product column matches site.json
- **WHEN** Footer is rendered
- **THEN** the Product column links match the href and label values defined in `site.json.footer.columns` for the Product section

#### Scenario: Solutions column matches site.json
- **WHEN** Footer is rendered
- **THEN** the Solutions column links match the href and label values defined in `site.json.footer.columns` for the Solutions section
