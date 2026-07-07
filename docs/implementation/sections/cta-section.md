# CTA Section
- **Status:** partial | **Used On:** home, pricing, features, product-overview, problem-solutions, why-optiflow, newsletter
- **Priority:** medium

## Feature IDs
- UX-004 — style extraction

## Pending Improvements
- [ ] Extract to consistent shared component (UX-004)

## Dependencies / Implementation Notes
Defined in `core.css` as `.cta-section` class. Gradient background with white text, heading, lead paragraph, dual CTA buttons (primary + secondary), optional trust badges row. Each page currently duplicates the CTA HTML block — should be refactored into `<!-- INCLUDE: cta -->` partial with configurable heading/text/buttons driven by page frontmatter.
