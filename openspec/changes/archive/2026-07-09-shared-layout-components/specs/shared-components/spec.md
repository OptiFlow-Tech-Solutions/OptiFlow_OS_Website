## ADDED Requirements

### Requirement: Nav component
The system SHALL provide a Nav component implementing the full navigation bar including desktop links, dropdown, mobile drawer, scroll behavior, active page highlighting, and theme toggle, as specified in the `react-nav` capability.

#### Scenario: Nav component exists and is exported
- **WHEN** importing `{ Nav }` from `./components`
- **THEN** Nav is a valid React component

#### Scenario: Nav renders without errors
- **WHEN** `<Nav />` is rendered inside a `<BrowserRouter>` and `<ThemeProvider>`
- **THEN** no console errors are produced and the nav header is visible

### Requirement: Footer component
The system SHALL provide a Footer component implementing the 5-column footer grid, social icons, theme toggle, and dynamic copyright year, as specified in the `react-footer` capability.

#### Scenario: Footer component exists and is exported
- **WHEN** importing `{ Footer }` from `./components`
- **THEN** Footer is a valid React component

#### Scenario: Footer renders without errors
- **WHEN** `<Footer />` is rendered inside a `<ThemeProvider>`
- **THEN** no console errors are produced and the footer grid is visible

### Requirement: PageLayout component
The system SHALL provide a PageLayout component composing Nav, main content slot, Footer, ScrollTop, and StickyCTA as specified in the `react-page-layout` capability.

#### Scenario: PageLayout component exists and is exported
- **WHEN** importing `{ PageLayout }` from `./components`
- **THEN** PageLayout is a valid React component

#### Scenario: PageLayout renders nested route content
- **WHEN** PageLayout is used as a layout route with nested child routes
- **THEN** child route content renders inside the `<main>` element between Nav and Footer

### Requirement: ScrollTop component
The system SHALL provide a ScrollTop floating button that appears after 400px scroll and scrolls to top on click.

#### Scenario: ScrollTop component exists
- **WHEN** importing `{ ScrollTop }` from `./components`
- **THEN** ScrollTop is a valid React component

### Requirement: StickyCTA component
The system SHALL provide a StickyCTA bottom bar visible after scrolling past viewport height.

#### Scenario: StickyCTA component exists
- **WHEN** importing `{ StickyCTA }` from `./components`
- **THEN** StickyCTA is a valid React component
