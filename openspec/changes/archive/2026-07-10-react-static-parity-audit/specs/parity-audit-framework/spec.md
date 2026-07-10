## ADDED Requirements

### Requirement: Structured per-page audit produces mismatch report
The system SHALL conduct a systematic comparison of every React page against its static HTML counterpart across five dimensions: content, visual layout, interactive behavior, responsive breakpoints, and accessibility. The output SHALL be a single structured mismatch report file.

#### Scenario: Audit covers all 15 pages
- **WHEN** the audit framework runs
- **THEN** each of the 15 React page routes is compared against its corresponding `src/pages/*.html` source file

#### Scenario: Content dimension checked
- **WHEN** auditing a page's content
- **THEN** all headings, paragraphs, list items, button labels, card text, and link text are compared for exact match

#### Scenario: Visual dimension checked
- **WHEN** auditing a page's visual layout
- **THEN** automated screenshot comparison is run at 480px, 768px, 1024px, and 1440px viewport widths, flagging spacing, alignment, color, and typography deviations

#### Scenario: Interactive dimension checked
- **WHEN** auditing a page's behavior
- **THEN** forms, accordions, dropdowns, modals, carousels, typewriter, parallax, mouse glow, card tilt, exit overlay, and scroll effects are tested for functional equivalence

#### Scenario: Responsive dimension checked
- **WHEN** auditing responsive behavior
- **THEN** grid collapse, navigation mode (desktop vs hamburger), font scaling, and element stacking are verified at 480px, 768px, 1024px, and 1440px

#### Scenario: Accessibility dimension checked
- **WHEN** auditing accessibility
- **THEN** keyboard navigation, focus order, ARIA attributes, semantic HTML structure, and color contrast ratios are verified against WCAG AA

### Requirement: Mismatch severity classification
The system SHALL classify every identified mismatch into one of three severity levels: critical (broken functionality, missing content), major (visible visual regression, incorrect behavior), or minor (subtle spacing/timing differences).

#### Scenario: Critical mismatch blocks release
- **WHEN** the audit report contains any critical severity mismatches
- **THEN** the change is NOT considered complete and release is blocked

#### Scenario: Major mismatches are tracked as bugs
- **WHEN** the audit report contains major severity mismatches
- **THEN** each major mismatch is documented with a unique identifier, page name, component name, and reproduction steps

#### Scenario: Minor mismatches are documented
- **WHEN** the audit report contains minor severity mismatches
- **THEN** each minor mismatch is listed with a recommendation but does not block the change

### Requirement: Audit report is traceable
The system SHALL produce an audit report that maps each finding back to the specific static page line(s) and React component file(s) involved.

#### Scenario: Each finding has source reference
- **WHEN** reviewing an audit finding
- **THEN** the finding includes the static HTML file path and line number, and the React component file path

### Requirement: Reconciliation checklist gates completion
The system SHALL maintain a reconciliation checklist that tracks which findings have been fixed, verified, and closed. The change is NOT complete until all critical and major findings are resolved.

#### Scenario: Checklist tracks fix status
- **WHEN** a finding is fixed in code
- **THEN** its status changes from "open" to "fixed" in the checklist

#### Scenario: Checklist tracks verification
- **WHEN** a fixed finding passes re-audit
- **THEN** its status changes from "fixed" to "verified"

#### Scenario: Change gates on unresolved issues
- **WHEN** the audit report contains unresolved critical or major findings
- **THEN** the change SHALL NOT be archived
