## ADDED Requirements

### Requirement: PageLayout wraps pages with Nav, main, and Footer
The system SHALL provide a PageLayout component that renders Nav at the top, a `<main>` content area with `<Outlet />` for page content, and Footer at the bottom.

#### Scenario: PageLayout renders full shell
- **WHEN** PageLayout is used as a React Router layout route
- **THEN** it renders `<Nav />`, followed by a `<main id="content" role="main">` element containing `<Outlet />` for nested route content, followed by `<Footer />`

#### Scenario: Footer stays at bottom on short pages
- **WHEN** a page content is shorter than the viewport height
- **THEN** the Footer is pushed to the bottom of the viewport via a CSS flex layout (`min-height: 100vh`, `display: flex`, `flex-direction: column`, with `<main>` using `flex: 1`)

#### Scenario: Skip link is rendered
- **WHEN** PageLayout is rendered
- **THEN** a skip-link anchor (`<a href="#content" className="skip-link">Skip to content</a>`) is rendered before the Nav, allowing keyboard users to bypass navigation

### Requirement: PageLayout renders ScrollTop button
The system SHALL render a floating ScrollTop button inside PageLayout that appears after scrolling 400px.

#### Scenario: ScrollTop appears after scrolling
- **WHEN** the user scrolls the page beyond 400px from the top
- **THEN** a floating button appears in the bottom-right corner of the viewport

#### Scenario: ScrollTop scrolls to top on click
- **WHEN** the ScrollTop button is clicked
- **THEN** the page smoothly scrolls to the top (`window.scrollTo({ top: 0, behavior: 'smooth' })`)

#### Scenario: ScrollTop hidden at top of page
- **WHEN** the page is scrolled to less than 400px from the top
- **THEN** the ScrollTop button is hidden

#### Scenario: ScrollTop has accessible label
- **WHEN** ScrollTop button is rendered
- **THEN** it has `aria-label="Scroll to top"`

### Requirement: PageLayout renders StickyCTA
The system SHALL render a StickyCTA bar at the bottom of the viewport that is only visible when the user has scrolled past the viewport height.

#### Scenario: StickyCTA visible after hero
- **WHEN** the user scrolls past `window.innerHeight` pixels
- **THEN** a fixed-position bottom bar appears with a "Book Demo" CTA button

#### Scenario: StickyCTA hidden near top
- **WHEN** the page is scrolled to less than `window.innerHeight` from the top
- **THEN** the StickyCTA bar is hidden

#### Scenario: StickyCTA links to demo booking
- **WHEN** StickyCTA is rendered
- **THEN** it contains a "Book Demo" link or button pointing to `/os/demo-booking/`
