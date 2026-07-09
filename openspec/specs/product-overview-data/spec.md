# product-overview-data

## Purpose

Centralized static data module for the Product Overview page — 12 module definitions (name, description, icon, benefit), 4 demo tab panels (dashboard, tasks, attendance, reports), 12 architecture node metadata entries, panel content for Admin/Captain/Doer views, workflow steps, report types, vision cards, and permissions matrix data.

## Requirements

### Requirement: Module data definitions
The system SHALL provide a typed `ModuleData` interface and 12 module entries covering all OptiFlow OS modules: Task Management, Worklists, Attendance, Reports & Analytics, Analytics, SOP Library, Training, Notifications, Leave Management, Meetings, Inventory, and Verification.

#### Scenario: All 12 modules are defined
- **WHEN** importing `modules` from `data/productOverview`
- **THEN** the array contains exactly 12 entries, each with `id`, `name`, `desc`, and `benefit` string fields

#### Scenario: Module data includes SVG icon identifiers
- **WHEN** inspecting any module entry
- **THEN** it contains an `icon` field that identifies which SVG icon to render (checkmark, clock, document, chart, list, shield, star, envelope, sun, checkbox, box, or check-badge)

#### Scenario: Module data is exported from data index
- **WHEN** importing from `../data`
- **THEN** `productOverviewData` or individual named exports (`modules`, `demoTabContent`, `archNodes`, `panelData`) are available

### Requirement: Demo tab content
The system SHALL provide content data for the 4 interactive demo tabs (dashboard, tasks, attendance, reports) including KPI metrics, table rows, attendance records, and report summaries.

#### Scenario: Dashboard tab has KPI metrics
- **WHEN** reading the dashboard demo tab data
- **THEN** it contains 3 KPI metrics (completion rate, tasks/month, present count) and 4 dashboard widgets (attendance, tasks done, SOP adherence, pending approvals)

#### Scenario: Tasks tab has table rows
- **WHEN** reading the tasks demo tab data
- **THEN** it contains exactly 4 task rows, each with task name, owner initials, due date, and status (pending/done/overdue)

#### Scenario: Attendance tab has employee records
- **WHEN** reading the attendance demo tab data
- **THEN** it contains exactly 6 employee attendance records with names, initials, and status (present/absent/late/on-leave)

#### Scenario: Reports tab has weekly summary
- **WHEN** reading the reports demo tab data
- **THEN** it contains 2 KPI cards, a date range, and 4 growth indicator cards

#### Scenario: KPI data supports cycling
- **WHEN** inspecting KPI data arrays
- **THEN** each KPI metric has at least 2 alternative values for click-to-cycle behavior (e.g., completion rate cycles through "92%", "88%", "95%")

### Requirement: Architecture node metadata
The system SHALL provide metadata for all 12 architecture diagram nodes including display name, description text, and benefit statement matching the static HTML module data.

#### Scenario: All 12 architecture nodes have metadata
- **WHEN** reading `archNodes` from the data module
- **THEN** there are exactly 12 entries keyed by the `data-module` attribute values from the static HTML (tasks, worklists, attendance, reports, analytics, sop, training, notifications, leaves, meetings, inventory, verification)

#### Scenario: Each node has name, description, and benefit
- **WHEN** inspecting any architecture node entry
- **THEN** it has `name`, `desc`, and `benefit` fields with non-empty strings

### Requirement: Panel content data
The system SHALL provide content data for Admin, Captain, and Doer panels including feature lists, dashboard row data, and benefit cards.

#### Scenario: Admin panel has 7 features and 7 dashboard rows
- **WHEN** reading admin panel data
- **THEN** it contains 7 feature descriptions, 7 dashboard metrics (employees, active, pending, completed, overdue, approvals, compliance), and 3 benefit cards

#### Scenario: Captain panel has 6 features and 7 dashboard rows
- **WHEN** reading captain panel data
- **THEN** it contains 6 feature descriptions, 7 dashboard metrics (team size, tasks assigned, pending verification, completed, leave requests, checklist compliance, top performer), and 3 benefit cards

#### Scenario: Doer panel has 6 features and 7 dashboard rows
- **WHEN** reading doer panel data
- **THEN** it contains 6 feature descriptions, 7 workspace rows (today's tasks, completed, pending, overdue, attendance status, leave balance, next deadline), platform badge data (Desktop/Mobile), and 3 benefit cards

### Requirement: Workflow steps data
The system SHALL provide data for the 5-step workflow engine including step number, title, description, and example text.

#### Scenario: Workflow has exactly 5 steps
- **WHEN** reading workflow data
- **THEN** there are exactly 5 step entries: Create Workflow, Assign Doer, Execute Work, Verify Completion, Generate Reports

#### Scenario: Each workflow step has example text
- **WHEN** inspecting any workflow step
- **THEN** it has `num`, `title`, `desc`, and `example` string fields

### Requirement: Report type data
The system SHALL provide data for the 6 report type cards displayed in the reporting engine section.

#### Scenario: Six report types defined
- **WHEN** reading report type data
- **THEN** there are exactly 6 entries: Task Reports, Attendance Reports, Department Reports, Performance Reports, Audit Reports, and Analytics Reports

### Requirement: Vision card data
The system SHALL provide data for the 6 vision cards in the Product Vision section.

#### Scenario: Six vision cards defined
- **WHEN** reading vision card data
- **THEN** there are exactly 6 entries with title and description fields covering Single Source of Truth, Operational Excellence, Business Scalability, Process-Driven Culture, Visibility & Accountability, and Owner Independence

### Requirement: Permissions matrix data
The system SHALL provide data for the 8-row permissions matrix table.

#### Scenario: Eight permission rows defined
- **WHEN** reading permission matrix data
- **THEN** there are exactly 8 rows covering Task Management, Attendance, Reports, SOP Library, Leave Management, Checklists, Audit Logs, and System Config

#### Scenario: Each row has per-role access levels
- **WHEN** inspecting any permission row
- **THEN** it has fields for employee, manager, and admin access levels with descriptive text and badge type (full/limited/none)
