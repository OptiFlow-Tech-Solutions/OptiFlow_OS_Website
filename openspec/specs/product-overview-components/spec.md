# product-overview-components

## Purpose

Page-specific React components for the Product Overview page — `ArchitectureDiagram` (SVG hub-and-spoke with tooltips), `ModuleSpotlight` (6+6 expandable grid), `PanelSection` (feature list + dashboard mockup + 3 benefit cards), `WorkflowEngine` (5-step numbered flow), `DemoTabs` (4-tab interactive dashboard mockup), and `ProductOverviewStyles` (CSS-in-JS styles component).

## Requirements

### Requirement: ArchitectureDiagram component
The system SHALL provide an `ArchitectureDiagram` component rendering a hub-and-spoke SVG diagram with a central OptiFlow OS hub, 12 peripheral module nodes, 12 dashed connector lines, and hover-activated tooltips.

#### Scenario: Hub renders in center
- **WHEN** `ArchitectureDiagram` is rendered
- **THEN** a centered circle displays "OptiFlow OS" with a gradient background and pulsing glow animation

#### Scenario: All 12 peripheral nodes render
- **WHEN** `ArchitectureDiagram` is rendered
- **THEN** 12 circular nodes are visible positioned around the hub, each displaying a distinct SVG icon

#### Scenario: SVG connector lines render
- **WHEN** `ArchitectureDiagram` is rendered
- **THEN** 12 dashed lines connect the hub to each peripheral node, styled with `var(--border)` color

#### Scenario: Tooltip shows on node hover
- **WHEN** user hovers over a peripheral node
- **THEN** a tooltip appears displaying the module name (in accent color), description text, and benefit text (in green)

#### Scenario: Tooltip hides on mouse leave
- **WHEN** user moves the mouse away from a node
- **THEN** the tooltip disappears

#### Scenario: Tooltip does not overflow viewport
- **WHEN** hovering near the right edge of the diagram
- **THEN** the tooltip repositions to the left of the node instead of the right to avoid viewport clipping

#### Scenario: Tooltip does not overflow viewport bottom
- **WHEN** hovering near the bottom edge of the diagram
- **THEN** the tooltip positions above the node instead of below

#### Scenario: Nodes are keyboard accessible
- **WHEN** user tabs to a peripheral node and focuses it
- **THEN** the tooltip appears (same as hover behavior) and the node has `role="button"` and an `aria-label`

#### Scenario: Diagram is responsive
- **WHEN** the viewport width is below 480px
- **THEN** nodes and connector lines scale down proportionally while remaining touchable

### Requirement: ModuleSpotlight component
The system SHALL provide a `ModuleSpotlight` component rendering an expandable grid of module cards — 6 visible by default with a "Show all 12 modules" toggle button.

#### Scenario: Six modules visible by default
- **WHEN** `ModuleSpotlight` first renders
- **THEN** exactly 6 module cards are visible in a 2-column grid

#### Scenario: Expand shows all 12 modules
- **WHEN** user clicks "Show all 12 modules" button
- **THEN** the expandable area reveals 6 additional module cards in a 3-column grid with a smooth height animation

#### Scenario: Collapse returns to 6 modules
- **WHEN** user clicks "Show less" button
- **THEN** the expandable area collapses, showing only the original 6 modules

#### Scenario: Button text changes on toggle
- **WHEN** the grid is collapsed
- **THEN** the button displays "Show all 12 modules" with a down chevron
- **WHEN** the grid is expanded
- **THEN** the button displays "Show less" with an up chevron

#### Scenario: Chevron rotates on open
- **WHEN** the module grid is expanded
- **THEN** the button SVG chevron icon rotates 180 degrees with a 0.3s ease transition

#### Scenario: Each module card has icon, heading, description, and benefit
- **WHEN** any module card is inspected
- **THEN** it displays an SVG icon (in a colored background circle), an h4 heading, a description paragraph, and a green benefit/outcome statement

### Requirement: PanelSection component
The system SHALL provide a `PanelSection` component rendering a two-column layout with a feature list on one side, a dashboard mockup preview on the other, and 3 benefit cards below — supporting both default and reversed layouts.

#### Scenario: Panel renders features and dashboard side by side
- **WHEN** `PanelSection` is rendered with feature and dashboard data
- **THEN** a two-column grid displays: left column has checkmarked feature items, right column has a dashboard preview card

#### Scenario: Panel supports reversed layout
- **WHEN** `PanelSection` is rendered with `reverse={true}` prop
- **THEN** the visual layout is flipped (features on right, dashboard on left) using CSS `direction: rtl` with inner content reset to `direction: ltr`

#### Scenario: Panel renders 3 benefit cards below
- **WHEN** `PanelSection` is rendered with benefit data
- **THEN** a 3-column grid of benefit cards appears below the features/dashboard section, each with an icon, heading, and description

#### Scenario: Dashboard mockup displays rows
- **WHEN** inspecting the dashboard preview visual
- **THEN** each row shows a label on the left and a value (with monospace font) on the right, separated by a border

#### Scenario: Doer panel variant shows platform badges
- **WHEN** `PanelSection` is rendered with badge data (Desktop/Mobile variants)
- **THEN** two small colored badges appear above the dashboard rows

### Requirement: WorkflowEngine component
The system SHALL provide a `WorkflowEngine` component rendering a horizontal 5-step numbered flow with connecting arrows between each step.

#### Scenario: Five steps render in sequence
- **WHEN** `WorkflowEngine` is rendered
- **THEN** 5 workflow step cards are visible in a row, each with a numbered circle, title, description, and example text

#### Scenario: Connecting arrows between steps
- **WHEN** `WorkflowEngine` is rendered
- **THEN** 4 arrow SVG connectors appear between the 5 steps, pointing right

#### Scenario: Each step has distinct accent color
- **WHEN** inspecting each step's number circle
- **THEN** step 1 uses accent color, step 2 uses teal, step 3 uses green, step 4 uses lime/green, step 5 uses accent color

#### Scenario: Steps wrap on small screens
- **WHEN** the viewport width is below 1024px
- **THEN** the steps stack vertically and connector arrows rotate 90 degrees to point down

#### Scenario: All workflow step cards are functional
- **WHEN** inspecting the component
- **THEN** 5 connected workflow steps exist with visible step numbers, headings, and descriptions

### Requirement: DemoTabs component
The system SHALL provide a `DemoTabs` component rendering an interactive dashboard mockup with 4 clickable tabs (Dashboard, Tasks, Attendance, Reports) that switch the displayed content panel.

#### Scenario: Dashboard tab is active by default
- **WHEN** `DemoTabs` first renders
- **THEN** the Dashboard tab is visually active (accent color, surface background, bottom border invisible) and the Dashboard content panel is visible

#### Scenario: Clicking a tab switches content
- **WHEN** user clicks the "Tasks" tab
- **THEN** the Tasks tab becomes active, Dashboard tab becomes inactive, and the Tasks content panel replaces the Dashboard panel

#### Scenario: Non-active tabs show placeholder
- **WHEN** user clicks the "Reports" tab
- **THEN** only the Reports panel is visible; Dashboard, Tasks, and Attendance panels are hidden

#### Scenario: Tabs have ARIA attributes
- **WHEN** inspecting a tab button
- **THEN** it has `role="tab"`, `aria-selected` reflecting its active state, and an associated `role="tabpanel"` content container

#### Scenario: Click hint text is displayed
- **WHEN** `DemoTabs` is rendered
- **THEN** a small italic hint text appears below the tabs: "Click tabs above to explore the platform · Click KPIs to cycle metrics · Click status chips to toggle"

### Requirement: ProductOverviewStyles component
The system SHALL provide a `ProductOverviewStyles` component rendering a `<style>` tag with all page-specific CSS — hero layout, dashboard mockups, transformation flow, architecture diagram, module spotlight, panels, workflow, reports, security, CTA, scroll reveal animations, sticky CTA, dark mode overrides, and responsive breakpoints.

#### Scenario: CSS is injected in document head
- **WHEN** `ProductOverview` page renders
- **THEN** page-specific styles are present in the document `<head>` via the `ProductOverviewStyles` component

#### Scenario: Dark mode overrides are included
- **WHEN** the document has `data-theme="dark"`
- **THEN** all page-specific components respond with appropriate dark color values matching the static HTML dark mode rules

#### Scenario: Responsive breakpoints are included
- **WHEN** the viewport width is 480px, 768px, or 1024px
- **THEN** the page layout adapts at each breakpoint matching the static HTML responsive rules

#### Scenario: All CSS variables reference design tokens
- **WHEN** inspecting the style output
- **THEN** all color values use `var(--*)` references; no hex values are hardcoded in the styles component
