# react-ui-audit

## Purpose

Systematic audit framework that compares every React page against its original HTML counterpart and the DESIGN.md specification, documenting all UI/UX discrepancies in a structured, trackable format.

## Requirements

### Requirement: Every React page is audited against original HTML
The system SHALL execute the audit framework defined in `parity-audit-framework` against all 15 React pages, comparing each against its corresponding `src/pages/*.html` original across content, visual layout, interactive behavior, responsive breakpoints, and accessibility dimensions.

#### Scenario: All 15 pages audited
- **WHEN** the parity audit executes
- **THEN** each of the 15 React pages has a documented list of findings categorized by type (content, layout, spacing, typography, color, responsive, interactive, accessibility)

#### Scenario: Audit produces reconciliation checklist
- **WHEN** the audit completes
- **THEN** a reconciliation checklist is produced listing every finding with severity classification, source references (static file:line, React component), and fix status

#### Scenario: Home page audit complete
- **WHEN** the audit runs against the Home page
- **THEN** all visual discrepancies are documented with severity (critical/major/minor), component name, and a description of the deviation

#### Scenario: Every page has an audit report
- **WHEN** the audit phase is complete
- **THEN** each of the 15 pages has a documented list of issues categorized by type (layout, spacing, typography, color, responsive, animation)

### Requirement: DESIGN.md compliance verified during audit
The system SHALL verify React design tokens, component styling, and visual output against the canonical DESIGN.md specification during the parity audit. The audit SHALL NOT be considered complete until all DESIGN.md compliance issues are resolved or waived.

#### Scenario: Color tokens match DESIGN.md
- **WHEN** comparing `design-tokens.css` color values with DESIGN.md hex values during audit
- **THEN** all mismatches are documented with the token name, current value, and expected value

#### Scenario: Typography matches DESIGN.md
- **WHEN** comparing rendered type against DESIGN.md type scale during audit
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
