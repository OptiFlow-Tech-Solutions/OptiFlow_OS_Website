## MODIFIED Requirements

### Requirement: Page Inventory

The system SHALL render exactly 14 marketing pages as defined in the `site.json` pages array, including the Newsletter & Content page at `/newsletter/`.

#### Scenario: Newsletter page present

- **GIVEN** `site.json` contains an entry for `newsletter/index.html`
- **WHEN** `npm run build` is executed
- **THEN** `dist/newsletter/index.html` SHALL be generated

### Requirement: Shared Logic Deduplication

Page-specific scripts SHALL NOT duplicate logic already handled by `core.js`. Sticky CTA visibility, scroll-to-top, scroll reveal, stagger animation, FAQ accordion, and counter animation SHALL be handled exclusively by core.js. Page-specific CSS SHALL NOT redefine stagger animation keyframes or transition rules already provided by core.css `.stagger-3`/`.stagger-4`/`.stagger-5` utility classes.

#### Scenario: No duplicate stagger CSS in newsletter page

- **GIVEN** the newsletter page source at `src/pages/newsletter.html`
- **WHEN** the `<style>` block is inspected
- **THEN** no `.stagger > *` or `.stagger.visible > *:nth-child()` animation rules SHALL be present
- **AND** all stagger animations SHALL use core.css `.stagger-N` utility classes

#### Scenario: No duplicate reveal or stagger

- **GIVEN** the product-overview and newsletter pages
- **WHEN** page-specific scripts are inspected
- **THEN** no reveal or stagger IntersectionObserver SHALL be present (core.js handles it)
