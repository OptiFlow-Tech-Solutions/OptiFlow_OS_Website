## ADDED Requirements

### Requirement: 404 page renders with standard error page structure
The 404 error page SHALL render at `/404/` with the standard error page layout: nav, error card, footer, and all shared assets (core.css, core.js).

#### Scenario: Page loads successfully
- **WHEN** a user navigates to `/404/`
- **THEN** the page renders with nav, main content area, and footer
- **THEN** the error code "404" is displayed prominently

#### Scenario: Page uses noindex
- **WHEN** a search engine crawler visits `/404/`
- **THEN** the page includes `robots` meta tag with `noindex, nofollow`

### Requirement: Error card displays helpful navigation
The error card SHALL include a heading, descriptive lead text, primary CTA (Go to Homepage), secondary CTA (Book a Demo), and a list of suggested links.

#### Scenario: User sees navigation options
- **WHEN** a user lands on the 404 page
- **THEN** the heading "Page Not Found" is displayed
- **THEN** a lead paragraph explains the page doesn't exist
- **THEN** "Go to Homepage" and "Book a Demo" buttons are visible
- **THEN** suggested links include Product Overview, Features, Pricing, Contact, and FAQ

### Requirement: Contact information block
The 404 page SHALL display company contact information using the same pattern as the 500 error page, including email and phone placeholders ({{EMAIL}}, {{PHONE}}).

#### Scenario: Contact info is visible
- **WHEN** a user views the 404 page
- **THEN** an email address is displayed using the {{EMAIL}} placeholder
- **THEN** a phone number is displayed using the {{PHONE}} placeholder
- **THEN** a response time note is shown

### Requirement: Dark mode support
The 404 page SHALL support dark mode via `[data-theme="dark"]` CSS overrides, consistent with the rest of the site.

#### Scenario: Dark mode renders correctly
- **WHEN** dark mode is active (`data-theme="dark"` on `<html>`)
- **THEN** the error code color changes to `var(--lime)`
- **THEN** suggestion/contact box backgrounds use dark surface color

### Requirement: Responsive layout
The 404 page SHALL adapt to mobile viewports (<480px) with reduced padding and smaller error code font size.

#### Scenario: Mobile viewport
- **WHEN** the viewport is narrower than 480px
- **THEN** section padding collapses to 40px from 80px
- **THEN** error code font size reduces to 72px

### Requirement: Animation on load
The error card and suggestion/contact boxes SHALL animate in using the site's reveal animation classes.

#### Scenario: Elements animate on load
- **WHEN** the 404 page loads
- **THEN** the error card has the `reveal` class for scroll-triggered animation
- **THEN** the suggestions block has the `reveal` class for staggered animation
