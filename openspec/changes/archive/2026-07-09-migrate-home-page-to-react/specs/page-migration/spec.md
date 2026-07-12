## MODIFIED Requirements

### Requirement: Home page has hero and sections
The home page SHALL render the hero heading and all 13 content sections (Hero, Trust Bar, The Problem, Cost of Inaction, Solution, Product Snapshot, How It Works, Features, Industries, Why OptiFlow Comparison, Testimonials, Final CTA, FAQ Preview) with content, layout, and animations matching the static `home.html` source.

#### Scenario: Home page renders all 13 sections
- **WHEN** user navigates to `/os/`
- **THEN** all 13 sections are visible with identical text content, heading levels, and card counts as the static HTML

#### Scenario: Home page typewriter cycles 5 phrases
- **WHEN** user views the hero section
- **THEN** the typewriter animation cycles through all 5 phrases with matching timing (60ms type, 30ms delete, 2200ms hold)

#### Scenario: Home page mouse glow follows cursor
- **WHEN** user moves the mouse over the hero section
- **THEN** a radial gradient glow follows the cursor position using rAF-throttled updates

#### Scenario: Home page card tilt works
- **WHEN** user hovers over impact cards in the Cost of Inaction section
- **THEN** cards tilt up to 12 degrees on X/Y axes based on mouse position

#### Scenario: Home page exit overlay triggers
- **WHEN** user scrolls past 400px and moves mouse above the viewport
- **THEN** the exit-intent popup displays with demo booking CTA

#### Scenario: Home page FAQ accordion opens/closes
- **WHEN** user clicks a FAQ question
- **THEN** the answer expands and the icon rotates; clicking again closes it

#### Scenario: Home page scroll reveal animations fire
- **WHEN** sections scroll into the viewport
- **THEN** elements with `.reveal` class fade in with stagger delays matching the original

#### Scenario: Home page comparison table renders
- **WHEN** user views the Why OptiFlow section
- **THEN** a 9-row comparison table displays with green check marks in the OptiFlow column
