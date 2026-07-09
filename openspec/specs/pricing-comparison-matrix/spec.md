# pricing-comparison-matrix

## Purpose

Feature comparison matrix on the pricing page showing three plan columns (Starter, Growth, Scale) across 15 features grouped into three sections (Core Platform, Automation & Scale, Support) with yes/limited/no cell states, on a dark background section.

## Requirements

### Requirement: Matrix displays three plan columns

The comparison matrix SHALL display three columns (Starter, Growth, Scale) with a label column on the left, rendered on a dark background section.

#### Scenario: Matrix has four-column grid layout
- **WHEN** the matrix renders
- **THEN** four columns display: Capability, Starter, Growth, Scale

#### Scenario: Column headers display plan names
- **WHEN** the matrix renders
- **THEN** the header row shows "Starter", "Growth", "Scale" above their respective columns

### Requirement: Matrix groups features into sections

The comparison matrix SHALL organize features into labeled section groups: "Core Platform", "Automation & Scale", and "Support".

#### Scenario: Section labels appear between groups
- **WHEN** the matrix renders
- **THEN** "Core Platform" appears above the first group, "Automation & Scale" above the second group, and "Support" above the third group

### Requirement: Cells use three states with distinct icons

Each cell in the matrix SHALL display one of three states: "yes" (green checkmark icon + "Included"), "limited" (info icon + descriptive text like "Basic"), or "no" (em dash).

#### Scenario: Checkmark for included features
- **WHEN** a feature is available in a plan (e.g., Task Management in all plans)
- **THEN** the cell displays a green checkmark SVG icon with caption "Included"

#### Scenario: Limited indicator for partial features
- **WHEN** a feature has limited availability (e.g., Reports in Starter)
- **THEN** the cell displays an info circle icon with "Basic"

#### Scenario: Em dash for unavailable features
- **WHEN** a feature is not available in a plan (e.g., Process Automation in Starter)
- **THEN** the cell displays "—" with muted styling

### Requirement: Matrix rows are the complete feature set

The matrix SHALL include all rows matching the static HTML: Task Management, Worklists, Checklist Management, Attendance, Leave Management, SOP Management, Training, Helpdesk, Reports, Approval Workflows, Process Automation, Multi-Location, Advanced Analytics, Priority Support, Dedicated Success Manager (15 rows).

#### Scenario: All 15 feature rows render
- **WHEN** the matrix renders
- **THEN** exactly 15 feature rows appear across three section groups

### Requirement: Matrix has hover row highlight

Matrix rows SHALL highlight on hover with a subtle background change for readability.

#### Scenario: Row highlights on hover
- **WHEN** the user hovers over a feature row
- **THEN** the row background transitions to a subtle tint within 200ms
