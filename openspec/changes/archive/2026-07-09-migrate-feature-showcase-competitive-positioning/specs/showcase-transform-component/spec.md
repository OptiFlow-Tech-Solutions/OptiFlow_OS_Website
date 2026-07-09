## ADDED Requirements

### Requirement: ShowcaseTransform renders problem block with cost pill
The ShowcaseTransform component SHALL accept a `problem` string and `cost` string and render a styled problem block with the cost value displayed as a pill.

#### Scenario: Problem block renders with text and cost
- **WHEN** ShowcaseTransform receives `problem="The Problem text"` and `cost="Cost: 2-4 hours/day"`
- **THEN** a problem block renders with bold "The Problem:" prefix, the problem text, and an inline cost pill showing the cost value

#### Scenario: Problem block has distinct styling
- **WHEN** the problem block renders
- **THEN** it has a left accent border, muted background tint, and the cost pill has rounded styling with distinct color

### Requirement: ShowcaseTransform renders 2 solution cards
The ShowcaseTransform component SHALL accept a `solutions` array of exactly 2 items (each with `heading` and `body`) and render them as two side-by-side cards.

#### Scenario: Two solution cards render
- **WHEN** ShowcaseTransform receives `solutions` with 2 items
- **THEN** two cards render in a 2-column grid, each displaying the solution heading and body text

### Requirement: ShowcaseTransform renders 3 metrics
The ShowcaseTransform component SHALL accept a `metrics` array of exactly 3 items (each with `val` and `lbl`) and render them as three centered metric cards.

#### Scenario: Three metric cards render
- **WHEN** ShowcaseTransform receives `metrics` with 3 items
- **THEN** three metric cards render in a 3-column grid, each displaying a large mono value and uppercase label

#### Scenario: Metric values use accent color
- **WHEN** metric cards render
- **THEN** each metric value displays in the accent color with mono font at 22px

### Requirement: ShowcaseTransform renders dual visual preview
The ShowcaseTransform component SHALL accept optional `dashboard` data and `phoneFrame` data and render them side by side when both are provided.

#### Scenario: Dashboard and phone frame render together
- **WHEN** ShowcaseTransform receives both `dashboard` and `phoneFrame` props
- **THEN** a dashboard preview and phone frame mockup render side by side in a flex layout

#### Scenario: Visuals wrap on narrow screens
- **WHEN** viewport width is 1024px or less
- **THEN** the dual visual layout collapses to single column stacking

### Requirement: ShowcaseTransform renders CTA bar
The ShowcaseTransform component SHALL accept a `cta` object with `text`, `link`, and `label` and render a feature CTA bar at the bottom of the section.

#### Scenario: CTA bar renders with text and button
- **WHEN** ShowcaseTransform receives `cta` with text, link, and label
- **THEN** a CTA bar renders with the descriptive text on the left and a Book Demo button on the right

### Requirement: ShowcaseTransform supports configurable visual side
The ShowcaseTransform component SHALL accept a `visualSide` prop (`'left'` or `'right'`, default `'right'`) that determines whether the dual visual appears on the left or right of the content.

#### Scenario: Visual renders on specified side
- **WHEN** `visualSide` is `'left'`
- **THEN** the dual visual appears on the left and text content on the right
- **WHEN** `visualSide` is `'right'` (default)
- **THEN** the dual visual appears on the right and text content on the left

### Requirement: ShowcaseTransform uses CSS variables for styling
All colors, spacing, and typography in ShowcaseTransform SHALL use CSS custom properties (`var(--*)`) from the design system.

#### Scenario: No hardcoded colors
- **WHEN** inspecting ShowcaseTransform styles
- **THEN** all color values reference CSS variables (e.g., `var(--accent)`, `var(--muted)`, `var(--bg)`)
