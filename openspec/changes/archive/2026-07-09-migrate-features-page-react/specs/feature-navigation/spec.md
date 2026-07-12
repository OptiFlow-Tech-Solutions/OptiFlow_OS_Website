## ADDED Requirements

### Requirement: Sticky feature navigation bar
The Features page SHALL display a horizontal sticky navigation bar fixed below the main navigation bar, containing 12 tab buttons for each feature section.

#### Scenario: Nav bar renders below main nav
- **WHEN** user navigates to `/os/features`
- **THEN** a horizontal bar with 12 tab buttons (Task Mgmt, Checklists, Delegation, Worklists, Attendance, Leave, SOPs, Training, Helpdesk, Reports, Notifications, Mobile) is visible below the main Nav

#### Scenario: Nav bar is fixed on scroll
- **WHEN** user scrolls down the page
- **THEN** the feature nav bar remains visible at the top of the viewport, positioned 52px (the main nav height) from the top

#### Scenario: Nav bar has bottom border
- **WHEN** feature nav bar is rendered
- **THEN** it has a 1px bottom border using the design system border color variable

### Requirement: Active tab highlights on scroll
The feature navigation bar SHALL highlight the tab corresponding to the feature section currently visible in the viewport, using IntersectionObserver for detection.

#### Scenario: First tab active by default
- **WHEN** user views the top of the Features page
- **THEN** the "Task Mgmt" tab is styled as active (accent background, white text)

#### Scenario: Tab changes on scroll
- **WHEN** user scrolls so the Checklists section enters the viewport
- **THEN** the "Checklists" tab becomes active and the previous tab deactivates

#### Scenario: All 12 tabs highlight correctly
- **WHEN** user scrolls through all 12 sections
- **THEN** each tab activates in sequence as its corresponding section enters the detection zone

### Requirement: Tab click scrolls to section
Clicking a feature navigation tab SHALL smoothly scroll the page to the corresponding feature section.

#### Scenario: Click scrolls to section
- **WHEN** user clicks the "SOPs" tab
- **THEN** the page scrolls to the SOP Management section with smooth behavior

#### Scenario: Clicked tab becomes active
- **WHEN** user clicks any tab
- **THEN** that tab immediately becomes active (accent background, white text, bold weight)

### Requirement: Nav bar gets shadow when scrolled
The feature navigation bar SHALL display a subtle box-shadow after any scroll position to separate it from the content below.

#### Scenario: Shadow appears on scroll
- **WHEN** user scrolls the page more than 10px from the top
- **THEN** the feature nav bar displays a bottom shadow

#### Scenario: No shadow at top of page
- **WHEN** page scroll position is at the very top
- **THEN** the feature nav bar has no shadow

### Requirement: Nav bar is horizontally scrollable on overflow
On small viewports where tabs exceed the available width, the feature nav bar SHALL allow horizontal scrolling with hidden scrollbars.

#### Scenario: Horizontal scroll on narrow viewport
- **WHEN** viewport width is less than the total width of all 12 tabs
- **THEN** the nav bar allows horizontal touch scrolling with `-webkit-overflow-scrolling: touch` and hidden scrollbars
