## ADDED Requirements

### Requirement: QuadrantGrid renders 4 quadrant cards in 2x2 layout
The QuadrantGrid component SHALL accept an array of 4 quadrant entries (each with `label`, `title`, `weaknesses` string array, and `advantage` string) and render them in a 2-column, 2-row grid.

#### Scenario: Four quadrant cards render in grid
- **WHEN** QuadrantGrid receives 4 quadrant entries
- **THEN** four cards render in a 2x2 CSS grid, each with a category label, title, up to 3 weaknesses (marked with ×), and an advantage line (marked with green text and border-top)

#### Scenario: Card corners are rounded appropriately
- **WHEN** the grid renders
- **THEN** top-left card has `border-radius` on top-left corner only, top-right on top-right, bottom-left on bottom-left, bottom-right on bottom-right

### Requirement: QuadrantGrid renders center overlay
The QuadrantGrid component SHALL accept `centerTitle` and `centerSubtitle` props and render an absolutely positioned circular overlay at the center of the 2x2 grid.

#### Scenario: Center overlay renders with title and subtitle
- **WHEN** QuadrantGrid receives `centerTitle="OptiFlow OS"` and `centerSubtitle="All 4 solved in one platform"`
- **THEN** a 140px circular overlay with gradient background, white text, and glow shadow renders at the exact center of the grid (top: 50%, left: 50%, transform: translate(-50%, -50%))

#### Scenario: Center overlay has visual prominence
- **WHEN** the center overlay renders
- **THEN** it has a higher z-index than quadrant cards and a colored box-shadow glow

### Requirement: QuadrantGrid collapses to single column on mobile
The QuadrantGrid SHALL display as a single-column layout with the center overlay rendered as a static block between the second and third cards when viewport is 767px or less.

#### Scenario: Single column layout on mobile
- **WHEN** viewport width is 767px or less
- **THEN** quadrant cards stack vertically, all card corners are fully rounded, and the center overlay becomes a static rounded rectangle with auto width and height

### Requirement: QuadrantGrid uses CSS variables for styling
All colors in QuadrantGrid SHALL use CSS custom properties (`var(--accent)`, `var(--teal)`, `var(--green)`, `var(--border)`, `var(--fg)`, etc.) and support dark mode via `[data-theme="dark"]` selectors.

#### Scenario: Dark mode styling applies
- **WHEN** `data-theme="dark"` is active
- **THEN** quadrant cards use surface background, border colors adjust, advantage text uses lime color, and center overlay gradient and glow remain visible

### Requirement: QuadrantGrid uses weaknesses with × markers
Each quadrant card's weaknesses list SHALL render list items with × markers using a red-tinged color and no default list styling.

#### Scenario: Weaknesses display with × markers
- **WHEN** a quadrant card renders its weaknesses
- **THEN** each weakness displays with an × character in red-tinted color followed by the weakness text
