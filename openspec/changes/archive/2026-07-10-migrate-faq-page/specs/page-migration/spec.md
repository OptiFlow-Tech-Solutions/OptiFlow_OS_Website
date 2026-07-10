# page-migration — Delta Spec

## MODIFIED Requirements

### Requirement: Every page in the SPA SHALL render the full content from its static HTML counterpart
Every page in the SPA SHALL render the full content from its static HTML counterpart, with Features (11 sections) and FeatureShowcase (6 sections) fully completed, using shared components (Section, Card, Button) for structure.

#### Scenario: FAQ page renders all sections
- **WHEN** user navigates to `/os/faq`
- **THEN** all FAQ sections are visible: hero with search bar, 4 help cards, category tabs (All/Product/Pricing/Security/Implementation), 42 FAQ items across 4 categories in accordion format, troubleshooting wizard (5 categories, 15 resolution paths), 4 escalation cards, micro-CTAs, and final CTA

#### Scenario: FAQ page uses shared components
- **WHEN** user navigates to `/os/faq`
- **THEN** all sections use `<Section>` instead of raw section tags, all cards use `<Card>`, all CTAs use `<Button as={Link}>`, and FAQ items use `<FAQAccordion>`

#### Scenario: FAQ page preserves original content
- **WHEN** comparing React FAQ page with static `faq.html`
- **THEN** all 42 FAQ questions and answers match the original content; all 4 category names and counts match; all 6 search suggestion chips match; all 15 troubleshooting paths match; all 4 escalation cards match
