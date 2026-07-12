# page-migration (delta)

## ADDED Requirements

### Requirement: Every React page passes visual quality gate
Every React page SHALL pass a visual quality gate before being considered production-ready: no layout breakage, colors match DESIGN.md, typography is consistent, spacing matches the original HTML, and the page renders without console errors.

#### Scenario: Visual quality gate checklist
- **WHEN** a page is verified against the quality gate
- **THEN** it passes checks for: layout accuracy, color consistency, typography consistency, spacing alignment, responsive behavior at 4 breakpoints, zero console errors, and functional verification of all interactive elements

#### Scenario: Page is better than original HTML
- **WHEN** comparing the React page with its HTML original
- **THEN** the React version matches or exceeds the original in visual polish, spacing, readability, and component hierarchy

### Requirement: All pages verified responsive
Every React page SHALL be verified at 320px, 480px, 768px, 1024px, 1200px, and 1440px viewport widths with no horizontal overflow, broken grids, or misaligned elements.

#### Scenario: Responsive verification on all pages
- **WHEN** responsive audit runs against all 15 pages
- **THEN** every page has zero horizontal overflow, correct grid collapse, and readable typography at every breakpoint

### Requirement: No console errors on any page
All 15 React pages SHALL render without producing console errors, React key warnings, or deprecation notices during navigation and interaction.

#### Scenario: Zero errors in browser console
- **WHEN** navigating through all 15 pages and interacting with all interactive elements
- **THEN** the browser console contains zero errors and zero React warnings

### Requirement: Visual regression tests exist
The test suite SHALL include at minimum one visual regression test per page comparing the React output against a known-good baseline.

#### Scenario: Home page visual regression test passes
- **WHEN** `npm run test:e2e` includes visual regression
- **THEN** a Playwright screenshot comparison for the Home page passes against the approved baseline
