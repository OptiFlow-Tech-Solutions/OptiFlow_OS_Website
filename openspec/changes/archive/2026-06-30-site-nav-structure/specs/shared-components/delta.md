# Shared Components — Delta Spec

## ADDED: Skip-to-Content Link

The navigation partial SHALL include a skip-to-content link as the first focusable element.

### Scenario: Skip link present and functional

- **GIVEN** any page with injected navigation
- **WHEN** the page renders and the user presses Tab
- **THEN** a "Skip to content" link SHALL appear at the top of the viewport
- **AND** clicking it SHALL move focus to `<main id="main-content">`

## ADDED: Mobile Drawer Active State

The mobile drawer SHALL resolve active link indicators identical to desktop nav.

### Scenario: Active link in mobile drawer

- **GIVEN** the current page has `active: "Features"` in `site.json`
- **WHEN** the mobile drawer is opened
- **THEN** the Features link in the drawer SHALL have the `.active` class

## MODIFIED: Resources Dropdown

The Resources dropdown in both desktop nav and mobile drawer SHALL contain only Newsletter and FAQ. Legal pages SHALL be removed from the dropdown.

### Scenario: Resources dropdown trimmed

- **GIVEN** the nav is rendered
- **WHEN** the Resources dropdown is opened
- **THEN** it SHALL display only "Newsletter" and "FAQ"
- **AND** it SHALL NOT display "Privacy Policy" or "Terms & Conditions"

## MODIFIED: Footer Placeholders

The footer SHALL use `{{PHONE}}`, `{{EMAIL}}`, and `{{YEAR}}` placeholders instead of hardcoded values.

### Scenario: Footer uses placeholders

- **GIVEN** the footer partial source
- **WHEN** inspected
- **THEN** phone SHALL be `{{PHONE}}` (not `+91 7874677836`)
- **AND** email SHALL be `{{EMAIL}}` (not `info@optiflow.co.in`)
- **AND** year SHALL be `{{YEAR}}` (not `2026`)

## MODIFIED: Nav CTA

The nav CTA area SHALL show a single "Book Demo" button instead of both "Watch Demo" and "Book Demo".

### Scenario: Single CTA

- **GIVEN** the nav header
- **WHEN** it renders
- **THEN** only one CTA button ("Book Demo") SHALL be visible
- **AND** no "Watch Demo" button SHALL be present
