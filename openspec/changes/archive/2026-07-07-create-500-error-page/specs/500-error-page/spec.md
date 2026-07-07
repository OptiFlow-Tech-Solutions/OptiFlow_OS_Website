## ADDED Requirements

### Requirement: 500 page renders with standard error page structure
The 500 error page SHALL render at `/500/` with the shared error page layout: nav, error card, footer, and all shared assets (core.css, core.js). The page SHALL use shared error CSS classes from core.css rather than duplicating them inline.

#### Scenario: Page loads successfully
- **WHEN** a user navigates to `/500/`
- **THEN** the page renders with nav, main content area, and footer
- **THEN** the error code "500" is displayed prominently
- **THEN** shared error CSS classes (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact`) are loaded from core.css

#### Scenario: Page uses noindex
- **WHEN** a search engine crawler visits `/500/`
- **THEN** the page includes `robots` meta tag with `noindex, nofollow`

#### Scenario: Build produces dist output
- **WHEN** `npm run build` is executed
- **THEN** `dist/500/index.html` is generated with resolved placeholders and injected partials

### Requirement: Error card displays appropriate CTAs
The error card SHALL include a heading, descriptive lead text explaining the server error, a primary CTA ("Go to Homepage"), and a secondary CTA ("Contact Support"). No suggestion links block — server errors are not navigational.

#### Scenario: User sees error information
- **WHEN** a user lands on the 500 page
- **THEN** the heading "Something Went Wrong" is displayed
- **THEN** a lead paragraph explains the server error and that the team has been notified
- **THEN** "Go to Homepage" and "Contact Support" buttons are visible
- **THEN** no suggestion links block is present (unlike the 404 page)

### Requirement: Contact information block
The 500 page SHALL display company contact information using email and phone placeholders ({{EMAIL}}, {{PHONE}}) in a styled contact block using `.error-contact`.

#### Scenario: Contact info is visible
- **WHEN** a user views the 500 page
- **THEN** an email address is displayed using the {{EMAIL}} placeholder
- **THEN** a phone number is displayed using the {{PHONE}} placeholder
- **THEN** a response time note ("We respond within one business day") is shown

### Requirement: Dark mode support
The 500 page SHALL support dark mode via `[data-theme="dark"]` CSS overrides in core.css, consistent with the shared error page pattern.

#### Scenario: Dark mode renders correctly
- **WHEN** dark mode is active (`data-theme="dark"` on `<html>`)
- **THEN** the error code color changes to `var(--lime)`
- **THEN** the contact box background uses the dark surface color

### Requirement: Responsive layout
The 500 page SHALL adapt to mobile viewports (<480px) with reduced padding and smaller error code font size.

#### Scenario: Mobile viewport
- **WHEN** the viewport is narrower than 480px
- **THEN** section padding collapses from 80px to 40px
- **THEN** error code font size reduces to 72px

### Requirement: Animation on load
The error card and contact box SHALL animate in using the site's `reveal` animation class.

#### Scenario: Elements animate on load
- **WHEN** the 500 page loads
- **THEN** the error card div has the `reveal` class for scroll-triggered animation
- **THEN** the contact error box has the `reveal` class for staggered animation

### Requirement: All placeholders resolved
The 500 page SHALL use the standard placeholder system: {{PAGE_TITLE}}, {{PAGE_DESCRIPTION}}, {{EMAIL}}, {{PHONE}}, {{PHONE_TEL}}. No hardcoded company information.

#### Scenario: Placeholders replaced at build time
- **WHEN** the build script processes `500.html`
- **THEN** {{EMAIL}} is replaced with the value from site.json
- **THEN** {{PHONE}} is replaced with the value from site.json
- **THEN** {{PHONE_TEL}} is replaced with the phone number without spaces

## MODIFIED Requirements

### Requirement: Error page CSS uses shared core.css classes
The 404 error page SHALL use shared error page CSS classes (`.error-section`, `.error-card`, `.error-code`, `.error-actions`, `.error-contact`) from `assets/css/core.css` instead of duplicating them in its inline `<style>` block. Only page-specific styles (`.error-suggestions`) SHALL remain inline.

#### Scenario: 404 loads shared CSS from core.css
- **WHEN** a user navigates to `/404/`
- **THEN** shared error page styles render from core.css
- **THEN** only `.error-suggestions` styles remain in the page's `<style>` block

#### Scenario: No visual regression
- **WHEN** the 404 page renders after CSS migration
- **THEN** the page appears visually identical to before the change
