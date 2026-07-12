## ADDED Requirements

### Requirement: CostComparison renders configurable cost cards
The CostComparison component SHALL accept an array of cost card entries (each with `title`, `cost`, `detail`, and optional `bestValue` flag) and render them in a responsive grid.

#### Scenario: Multiple cost cards render in grid
- **WHEN** CostComparison receives 4 cost card entries
- **THEN** four cards render in a 4-column grid, each displaying the title, cost range (large mono text), and detail description

#### Scenario: Cost cards have hover lift effect
- **WHEN** user hovers over a cost card
- **THEN** the card translates up 4px with increased shadow and accent-tinted border

### Requirement: CostComparison highlights best value card
When a cost card entry has `bestValue: true`, the component SHALL render it with a "Best Value" badge, green border, and green cost range color.

#### Scenario: Best value card has badge
- **WHEN** a cost card has `bestValue: true`
- **THEN** a "Best Value" badge (uppercase, green background, white text, pill-shaped) renders at the top of the card

#### Scenario: Best value card has green styling
- **WHEN** a cost card has `bestValue: true`
- **THEN** the card border is green, the cost range text is green, and the card has a green glow shadow

### Requirement: CostComparison supports dark mode
The CostComparison component SHALL render correctly in dark mode with adjusted backgrounds, text colors, border colors, and best-value styling.

#### Scenario: Dark mode styling applies
- **WHEN** `data-theme="dark"` is active
- **THEN** cards use dark surface background (#111827 equivalent), text and cost are light (#F9FAFB equivalent), borders use semi-transparent white, and best value card uses lime accent instead of green

### Requirement: CostComparison grid adapts to screen size
The cost card grid SHALL adapt from 4 columns to 2 columns at 1024px, and to 1 column at 767px.

#### Scenario: Responsive grid layout
- **WHEN** viewport width is above 1024px
- **THEN** cards display in 4 columns
- **WHEN** viewport width is 1024px or less
- **THEN** cards display in 2 columns
- **WHEN** viewport width is 767px or less
- **THEN** cards display in 1 column

### Requirement: CostComparison uses CSS variables where possible
CostComparison SHALL use CSS custom properties for theme-adaptive colors (background, text, borders) with explicit dark mode overrides for the card-specific styling that cannot be purely variable-based.

#### Scenario: Theme tokens used
- **WHEN** inspecting cost card styles
- **THEN** background uses `var(--surface)`, text uses `var(--fg)`, and best value badge uses `var(--green)`
