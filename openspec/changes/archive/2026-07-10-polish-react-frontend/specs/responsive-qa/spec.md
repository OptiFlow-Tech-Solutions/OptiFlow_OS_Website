## ADDED Requirements

### Requirement: Mobile layout (375px)
All 16 pages SHALL render correctly at 375px viewport width without horizontal overflow.

#### Scenario: No horizontal scroll at mobile
- **WHEN** any page is viewed at 375px width
- **THEN** no horizontal scrollbar SHALL appear and all content SHALL fit within the viewport

#### Scenario: Navigation collapses to hamburger
- **WHEN** viewport is below 1024px width
- **THEN** desktop navigation links SHALL hide and the hamburger menu button SHALL be visible

#### Scenario: Single-column grids at mobile
- **WHEN** any multi-column grid is viewed below 768px width
- **THEN** all grid items SHALL stack vertically in a single column

### Requirement: Tablet layout (768px)
All pages SHALL render correctly at 768px viewport width.

#### Scenario: Two-column grids at tablet
- **WHEN** a `.grid-3` or `.grid-4` container is viewed at 768px
- **THEN** items SHALL arrange in 2 columns with consistent gap spacing

#### Scenario: Navigation remains collapsed at tablet
- **WHEN** viewport is 768px wide
- **THEN** the hamburger menu SHALL be visible (desktop nav threshold is 1024px)

### Requirement: Desktop layout (1440px)
All pages SHALL render correctly at 1440px viewport width.

#### Scenario: Container max-width enforced
- **WHEN** viewport is wider than 1200px
- **THEN** the `.container` class SHALL cap content width at 1200px and center it

#### Scenario: Full multi-column grids at desktop
- **WHEN** `.grid-3` is viewed at desktop width
- **THEN** items SHALL arrange in 3 equal-width columns

### Requirement: Touch-friendly interactive targets
All interactive elements SHALL meet minimum touch target size on mobile.

#### Scenario: Button touch target
- **WHEN** any button or link is rendered on a touch device
- **THEN** its clickable area SHALL be at least 44x44 CSS pixels (or 24x24 with sufficient spacing from adjacent targets per WCAG 2.2)

### Requirement: Font scaling resilience
Pages SHALL remain usable when browser font size is increased.

#### Scenario: Text zoom to 200%
- **WHEN** browser zoom is increased to 200%
- **THEN** all text SHALL remain readable, no content SHALL overlap or be clipped, and no horizontal scrolling SHALL be required
