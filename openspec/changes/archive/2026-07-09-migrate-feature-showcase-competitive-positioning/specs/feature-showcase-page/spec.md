## ADDED Requirements

### Requirement: Feature Showcase page renders hero with sticky nav
The Feature Showcase page SHALL render a hero section with eyebrow text, h1 heading, lead paragraph, dual CTAs (Book Demo, Explore Features), trust badges, and an EcosystemHub visualization. A sticky FeatureNav with 6 tabs (Tasks, Attendance, SOPs, Reports, Checklists, Leave) SHALL be fixed below the main nav.

#### Scenario: Hero renders with all elements
- **WHEN** user navigates to `/os/feature-showcase`
- **THEN** the page displays a hero section containing h1 "See What OptiFlow OS Actually Does For Your Business", lead text, Book Free Demo CTA, Explore All Features CTA, 4 trust checkmarks, and EcosystemHub with 6 orbiting modules

#### Scenario: Sticky nav renders and scrolls to sections
- **WHEN** user clicks a FeatureNav tab
- **THEN** the page scrolls smoothly to the corresponding transformation section
- **WHEN** user scrolls sections into view
- **THEN** the active tab updates to match the visible section

#### Scenario: FeatureNav shows shadow when scrolled
- **WHEN** user scrolls past the hero
- **THEN** the FeatureNav bar displays a box-shadow indicating it's "stuck"

### Requirement: 6 transformation sections render with problem-cost-solution-metrics-visual
The Feature Showcase page SHALL render 6 transformation sections (Task, Attendance, SOPs, Reports, Checklists, Leave), each containing a problem statement with cost pill, exactly 2 solution cards, exactly 3 outcome metrics, a dual visual (dashboard preview + phone frame), and a CTA bar with Book Demo link.

#### Scenario: Task Management section renders
- **WHEN** user views the Task Management transformation section
- **THEN** it displays problem text about WhatsApp chaos, cost pill "Cost: 2-4 hours/day in follow-ups", 2 solution cards (WWHWE Framework, Verification Workflow), 3 metrics (94% On-Time, 0 Missed Tasks, 3.5hrs Saved Daily), a dashboard table with 4 task rows, and a phone frame mockup

#### Scenario: Each transformation has exactly 2 solution cards
- **WHEN** any transformation section renders
- **THEN** exactly 2 solution cards are displayed below the problem block

#### Scenario: Each transformation has exactly 3 metrics
- **WHEN** any transformation section renders
- **THEN** exactly 3 metric cards (value + label) are displayed

#### Scenario: Cost pill renders in problem block
- **WHEN** any transformation section renders
- **THEN** the problem block includes a cost pill (e.g., "Cost: 2-4 hours/day in follow-ups") with distinct styling

#### Scenario: Dual device preview renders
- **WHEN** any transformation section renders
- **THEN** both a dashboard preview and a phone frame mockup are visible side by side

#### Scenario: Section CTA bar renders
- **WHEN** any transformation section renders
- **THEN** a feature CTA bar with descriptive text and "Book Demo" button is displayed below the section content

### Requirement: Feature Showcase page renders bottom CTA section
The Feature Showcase page SHALL render a final CTA section with heading, lead text, Book Demo and Product Tour buttons, and 4 trust checkmarks.

#### Scenario: Bottom CTA section renders
- **WHEN** user scrolls to the bottom of the Feature Showcase page
- **THEN** a CTA section displays "Ready To See Your Operations Transformed?", Book Free Demo button, Watch Product Tour button, and 4 trust items (Built For MSMEs, Fast Deployment, Easy Adoption, Dedicated Support)

### Requirement: Feature Showcase page matches static HTML content
The text content, headings, and structure of the Feature Showcase page SHALL match the static HTML `src/pages/feature-showcase.html`.

#### Scenario: All 6 transformation headings match
- **WHEN** comparing each transformation's h2 heading with static HTML
- **THEN** text content is identical

#### Scenario: All problem statements match
- **WHEN** comparing each problem block text with static HTML
- **THEN** text content including cost values is identical

#### Scenario: No content is added or removed
- **WHEN** comparing the React page with its static counterpart
- **THEN** all headings, paragraphs, problem texts, solution texts, metric values, and CTA text from the static page are present
