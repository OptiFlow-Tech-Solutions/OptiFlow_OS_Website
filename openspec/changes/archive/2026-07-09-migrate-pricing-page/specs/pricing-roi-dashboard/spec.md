## ADDED Requirements

### Requirement: ROI dashboard bar chart is proportional

The ROI dashboard SHALL display traditional SaaS and OptiFlow costs as horizontal bar pairs for 5 team sizes (10, 25, 50, 100, 200), with bar widths proportional to the largest value using CSS percentage values and a minimum width of 4%.

#### Scenario: Bar widths are proportional to data values
- **WHEN** the dashboard renders with a max value of ₹28.8L (200 users traditional)
- **THEN** the traditional 200 bar has `width: 100%` and the OptiFlow 200 bar has `width: calc(100 * 149000 / 2880000)%` or approximately 5.2%

#### Scenario: No bar is thinner than 4%
- **WHEN** any bar value divided by max value produces a percentage below 4%
- **THEN** the bar width SHALL be clamped to 4%

#### Scenario: Bar label positions adjust at 15% threshold
- **WHEN** a bar width is below 15% of the track
- **THEN** its value label SHALL render outside the bar (positioned to the right)
- **WHEN** a bar width is at or above 15% of the track
- **THEN** its value label SHALL render inside the bar (right-aligned with 6px padding)

### Requirement: Bar chart tooltips appear on hover

Each comparison row SHALL display a tooltip on hover showing traditional annual cost, OptiFlow annual cost, and savings percentage.

#### Scenario: Tooltip appears on row hover
- **WHEN** the user hovers over a comparison row
- **THEN** a tooltip with traditional cost, OptiFlow cost, and savings percentage appears above the row

#### Scenario: Tooltip disappears on mouse leave
- **WHEN** the user moves the mouse away from the row
- **THEN** the tooltip fades out within 120ms

#### Scenario: Tooltip is keyboard accessible
- **WHEN** the user focuses on a comparison row via keyboard
- **THEN** the tooltip becomes visible

### Requirement: Connector lines link bar ends

Each comparison row SHALL display a horizontal connector line spanning from the shorter bar's right edge to the longer bar's right edge, visible on hover.

#### Scenario: Connector line spans between bar ends on hover
- **WHEN** the user hovers over a comparison row
- **THEN** a horizontal green line appears between the right edges of the traditional and OptiFlow bars

#### Scenario: Connector line recalculates on resize
- **WHEN** the browser window is resized while a connector line is visible
- **THEN** the connector line position updates to match the new bar positions

### Requirement: Savings badges animate on entrance

Each comparison row SHALL display a savings badge (down arrow, absolute amount, percentage) that fades up with staggered delay when the dashboard enters the viewport.

#### Scenario: Savings badge fades up with delay
- **WHEN** the dashboard scrolls into view and the IntersectionObserver fires (threshold 0.3)
- **THEN** savings badges become visible with staggered delays (0ms, 80ms, 160ms, 240ms, 320ms)

#### Scenario: Savings badge shows correct values
- **WHEN** the 10-user row is visible with traditional ₹1.44L and OptiFlow ₹49K
- **THEN** the savings badge displays "Save ₹95K" and "66%"

#### Scenario: Reduced motion skips animation
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** savings badges appear immediately without animation, and bar widths transition instantly

### Requirement: Dashboard summary row shows three stats

The dashboard SHALL display a three-column summary row with "No Per-User Charges", "Fixed Annual Pricing", and "Cloud Hosting Included".

#### Scenario: Summary row renders three stat items
- **WHEN** the dashboard renders
- **THEN** three columns display: No Per-User Charges, Fixed Annual Pricing, Cloud Hosting Included

### Requirement: Dashboard is a11y labeled

The dashboard SHALL include `role="region"` with `aria-label="Pricing comparison chart"`, and each row SHALL use `role="rowheader"` and `role="columnheader"` attributes.

#### Scenario: Dashboard region has accessible label
- **WHEN** a screen reader encounters the dashboard
- **THEN** it announces "Pricing comparison chart"

#### Scenario: Rows have row and column headers
- **WHEN** a screen reader navigates a comparison row
- **THEN** the team size is announced as a row header and costs as column headers
