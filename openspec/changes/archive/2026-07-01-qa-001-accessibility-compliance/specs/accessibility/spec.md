# Delta Spec: Accessibility (QA-001)

## Modified Requirements

### Requirement: Minimum Contrast Ratio (MODIFIED)

Adds automated verification to existing requirement. Adjusted `--teal` from `oklch(55% 0.10 210)` to `oklch(52% 0.10 210)` in light mode to achieve 4.5+:1 contrast on background.

#### Scenario: Automated contrast validation

- **GIVEN** the build validation pipeline runs
- **WHEN** `npm run validate` executes
- **THEN** all oklch color variable pairs defined in `core.css` SHALL be checked for WCAG 2.2 AA contrast compliance
- **AND** any pair below 4.5:1 (normal text) or 3:1 (large text) SHALL produce a warning

### Requirement: Admin Tab Accessibility (MODIFIED)

Admin dashboard tab buttons now include `aria-controls` attributes linking to their corresponding tab panels.

#### Scenario: Tab aria-controls

- **GIVEN** the admin dashboard page
- **WHEN** the page is inspected
- **THEN** each tab button SHALL have an `aria-controls` attribute pointing to the corresponding `role="tabpanel"` element

### Requirement: E2E Accessibility Testing (NEW)

The system SHALL include automated accessibility scans for all 14 public pages in the E2E test suite.

#### Scenario: Page-level axe scan

- **GIVEN** the E2E test suite runs
- **WHEN** any public page is loaded
- **THEN** an `axe-core` scan SHALL run at `wcag2aa` standard
- **AND** zero violations SHALL be present

## Deleted Requirements

None.
