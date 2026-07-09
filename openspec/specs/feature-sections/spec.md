# feature-sections

## Purpose

Feature detail sections for the Features page — 11 config-driven sections with problem statements, cards, benefits, dashboard previews, and CTAs, plus bottom CTA section.

## Requirements

### Requirement: Features page renders all 12 sections
The Features page SHALL render the hero section, 11 feature detail sections (Tasks, Checklists, Delegation, Worklists, Attendance, Leave, SOPs, Training, Helpdesk, Reports, Notifications, Mobile), and a bottom CTA section, with content matching the static `features.html` source.

#### Scenario: All sections present in order
- **WHEN** user navigates to `/os/features`
- **THEN** all 12 sections render in order with their headings, lead text, and child content matching the static HTML

#### Scenario: Each section has a heading
- **WHEN** any feature section is inspected
- **THEN** it contains an `<h2>` heading matching the corresponding section header from `features.html`

### Requirement: Feature sections use shared Section component
Every feature detail section SHALL use the `<Section>` component with appropriate `heading`, `lead`, and optional `eyebrow` props. No raw `<section className="section">` tags SHALL be used.

#### Scenario: Section component wraps feature content
- **WHEN** inspecting the Features page source
- **THEN** all content sections use `<Section heading="...">` or equivalent, not raw section tags

### Requirement: Feature data is defined in a config file
The content for all 11 feature sections SHALL be defined in a structured data file (`data/features.js` or similar) separate from the rendering components.

#### Scenario: Data file contains all section entries
- **WHEN** inspecting the feature data file
- **THEN** it contains entries for all 11 features with id, label, heading, lead, problem, cards, benefits, and CTA fields

#### Scenario: Adding a feature section requires only data
- **WHEN** a new feature section entry is added to the data file
- **THEN** it renders automatically without modifying any component source

### Requirement: Each feature section renders a problem statement
Each feature section SHALL include a problem statement block (styled with accent left border) displaying the real-world pain point the feature solves.

#### Scenario: Problem statement visible in Task section
- **WHEN** user views the Task Management section
- **THEN** a problem statement beginning with "The Problem:" is displayed with accent left border

### Requirement: Feature sections render cards for key points
Each feature section SHALL render cards (2-4 depending on section) summarizing the feature's key capabilities.

#### Scenario: Task Management has 4 cards
- **WHEN** user views the Task Management section
- **THEN** 4 cards are displayed covering WWHWE Framework, Priority & Due Dates, Evidence Uploads, and Verification Workflow

#### Scenario: Training has 3 cards
- **WHEN** user views the Training section
- **THEN** 3 cards are displayed covering Courses, Quizzes & Certifications, and Progress Tracking

### Requirement: Feature sections render a benefit checklist
Sections with benefits SHALL display a grid of checkmark items listing key advantages.

#### Scenario: Task Management shows 4 benefits
- **WHEN** user views the Task Management section
- **THEN** 4 benefit items are displayed: Clear Ownership, Faster Execution, Better Accountability, Zero Follow-Ups

### Requirement: Feature sections render a CTA bar
Every feature section SHALL include a CTA bar at the bottom with persuasive text and a link to the demo booking page.

#### Scenario: CTA bar in each section
- **WHEN** user scrolls through any feature section
- **THEN** a CTA bar is visible with a heading and "Book Free Demo" or equivalent link

### Requirement: Dashboard previews render static mock data
Feature sections that include dashboard previews SHALL render metric cards and data tables with the same mock data as in the static HTML.

#### Scenario: Task Management dashboard shows metrics
- **WHEN** user views the Task Management section dashboard
- **THEN** 3 metric cards display "142 Active Tasks", "28 Done Today", and "94% On-Time"

#### Scenario: SOP dashboard shows ack tracking
- **WHEN** user views the SOP Management dashboard
- **THEN** the table shows "18/18", "12/12", "14/16", and "6/6" in the Ack'd column

### Requirement: Phone frame renders for Mobile section
The Mobile section SHALL render two phone frame mockups showing a task list and attendance screen, matching the static HTML design.

#### Scenario: Two phone frames visible
- **WHEN** user views the Mobile section
- **THEN** two phone-frame elements are displayed side by side with notch, content rows, and action buttons

### Requirement: Delegation section renders process steps
The Delegation section SHALL render a horizontal process-steps visualization showing the Create → Assign → Verify → Report workflow.

#### Scenario: Process steps visible
- **WHEN** user views the Delegation section
- **THEN** 4 process steps are displayed in order with labels and example descriptions

### Requirement: Bottom CTA section
A final CTA section SHALL render below all feature sections with heading "Ready To See Every Feature In Action?", lead text, two CTA buttons (Book Free Demo, Watch Product Tour), and trust badges.

#### Scenario: Bottom CTA renders
- **WHEN** user scrolls to the bottom of the Features page
- **THEN** a full-width CTA section with two buttons and 4 trust badges is displayed

### Requirement: Responsive layout
Feature sections SHALL adapt to single-column layout on screens ≤1024px and maintain readability down to 320px viewport width.

#### Scenario: Two-column layout collapses
- **WHEN** viewport width is ≤1024px
- **THEN** feature-hero grids collapse to single column with dashboard previews stacking above/below content

#### Scenario: Phone frames shrink on mobile
- **WHEN** viewport width is ≤480px
- **THEN** phone frame width reduces to 200px with reduced border-radius
