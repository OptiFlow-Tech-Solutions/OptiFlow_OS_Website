# react-ui-audit

## Purpose

Systematic audit framework that compares every React page against its original HTML counterpart and the DESIGN.md specification, documenting all UI/UX discrepancies in a structured, trackable format.

## Requirements

### Requirement: Every React page is audited against original HTML
The system SHALL conduct a side-by-side visual audit of all 15 React pages against their corresponding `src/pages/*.html` originals, comparing layout, spacing, typography, colors, and responsive behavior at four breakpoints (480px, 768px, 1024px, 1440px).

#### Scenario: Home page audit complete
- **WHEN** the audit runs against the Home page
- **THEN** all visual discrepancies are documented with severity (critical/major/minor), component name, and a description of the deviation

#### Scenario: Every page has an audit report
- **WHEN** the audit phase is complete
- **THEN** each of the 15 pages has a documented list of issues categorized by type (layout, spacing, typography, color, responsive, animation)

### Requirement: DESIGN.md compliance audit
The system SHALL compare all React design tokens, component styling, and visual output against the canonical DESIGN.md specification (hex colors, Inter font family, 1320px container, fixed px type scale).

#### Scenario: Color tokens match DESIGN.md
- **WHEN** comparing `design-tokens.css` color values with DESIGN.md hex values
- **THEN** all mismatches are documented with the token name, current value, and expected value

#### Scenario: Typography matches DESIGN.md
- **WHEN** comparing rendered type against DESIGN.md type scale
- **THEN** all deviations in font family, size, weight, or line-height are documented

### Requirement: Console error audit
The system SHALL verify that no React pages produce console errors during navigation, rendering, or interaction.

#### Scenario: Zero console errors on all pages
- **WHEN** navigating to each of the 15 React pages
- **THEN** the browser console has zero errors, zero warnings about missing keys, and zero deprecation notices

### Requirement: Issues are categorized and prioritized
Every audit finding SHALL be categorized (layout/spacing/typography/color/responsive/animation/accessibility/functionality) and assigned a severity (critical — blocks core function; major — visibly broken; minor — cosmetic discrepancy).

#### Scenario: Issue categorization
- **WHEN** an audit finding is documented
- **THEN** it includes category, severity, page name, component name, description, and a recommendation
