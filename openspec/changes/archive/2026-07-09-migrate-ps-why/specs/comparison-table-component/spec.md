## ADDED Requirements

### Requirement: ComparisonTable renders configurable columns and rows
The ComparisonTable component SHALL accept a `columns` array (each with `key`, `label`, optional `highlight`) and a `rows` array (objects mapping column keys to cell data with `type: 'check'|'cross'|'text'` and optional `value`) and render a responsive HTML table.

#### Scenario: Renders 5 columns with highlighted last column
- **WHEN** ComparisonTable receives 5 columns where the last has `highlight: true`
- **THEN** 5 `<th>` elements render with the last column using `highlight-col` styling (accent-soft background, bold text)

#### Scenario: Renders check and cross cells
- **WHEN** a row cell has `type: 'check'`
- **THEN** a green checkmark SVG icon renders in that cell
- **WHEN** a row cell has `type: 'cross'`
- **THEN** a red/muted X SVG icon renders in that cell

#### Scenario: Renders text cells
- **WHEN** a row cell has `type: 'text'` with a `value`
- **THEN** the text value renders in that cell

#### Scenario: First column is row label
- **WHEN** the table renders
- **THEN** the first column displays left-aligned text labels for each row and takes 30% width

### Requirement: ComparisonTable supports sticky headers
The table header row SHALL remain visible when scrolling vertically within the table wrapper.

#### Scenario: Header stays visible on vertical scroll
- **WHEN** user scrolls the table vertically
- **THEN** the `<thead>` row remains fixed at the top using `position: sticky; top: 0`

### Requirement: ComparisonTable supports horizontal scroll on mobile
The table SHALL be horizontally scrollable on screens narrower than the table's minimum width (900px).

#### Scenario: Horizontal scrollbar appears on narrow screens
- **WHEN** viewport width is less than 900px
- **THEN** the table wrapper shows a horizontal scrollbar and `-webkit-overflow-scrolling: touch` is applied

### Requirement: ComparisonTable supports dark mode
The table SHALL render correctly in dark mode with appropriate colors for highlighted columns, check/cross icons, and text.

#### Scenario: Dark mode styling applies
- **WHEN** `data-theme="dark"` is active
- **THEN** highlighted column background uses semi-transparent accent color, check icons are green, cross icons are muted red, and row labels have higher contrast text
