## ADDED Requirements

### Requirement: All pages use shared Section component
All 17 page components SHALL use the `<Section>` component for page sections. No page SHALL use raw `<section className="section">` tags.

#### Scenario: About page uses Section component
- **WHEN** inspecting About.jsx source
- **THEN** all sections use `<Section>` with appropriate heading and lead props

#### Scenario: FAQ page uses Section component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all sections use `<Section>` instead of raw `<section className="section">`

#### Scenario: Contact page uses Section component
- **WHEN** inspecting Contact.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

#### Scenario: DemoBooking page uses Section component
- **WHEN** inspecting DemoBooking.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

#### Scenario: Newsletter page uses Section component
- **WHEN** inspecting Newsletter.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

#### Scenario: ProblemSolutions page uses Section component
- **WHEN** inspecting ProblemSolutions.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

#### Scenario: WhyOptiFlow page uses Section component
- **WHEN** inspecting WhyOptiFlow.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

#### Scenario: CompetitivePositioning page uses Section component
- **WHEN** inspecting CompetitivePositioning.jsx source
- **THEN** all sections use `<Section>` instead of raw section tags

### Requirement: All pages use shared Card component
All 17 page components SHALL use the `<Card>` component for card-style content blocks. No page SHALL use raw `<div className="card">` tags.

#### Scenario: Contact page uses Card component
- **WHEN** inspecting Contact.jsx source
- **THEN** all card elements use `<Card>` instead of raw `<div className="card">`

#### Scenario: DemoBooking page uses Card component
- **WHEN** inspecting DemoBooking.jsx source
- **THEN** all card elements use `<Card>` instead of raw `<div className="card">`

#### Scenario: FAQ page uses Card component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all card elements use `<Card>` instead of raw `<div className="card">`

### Requirement: All pages use shared Button component  
All CTA links in every page SHALL use the `<Button>` component with `as={Link}` prop instead of raw `<a>` or `<Link>` tags with CSS classes.

#### Scenario: About page CTAs use Button component
- **WHEN** inspecting About.jsx source
- **THEN** all CTA elements use `<Button as={Link} to="...">` pattern

#### Scenario: FAQ page CTAs use Button component
- **WHEN** inspecting FAQ.jsx source
- **THEN** all CTA elements use `<Button>` component

#### Scenario: Contact page CTAs use Button component
- **WHEN** inspecting Contact.jsx source
- **THEN** all CTA elements use `<Button>` component

#### Scenario: DemoBooking page CTAs use Button component
- **WHEN** inspecting DemoBooking.jsx source
- **THEN** all CTA elements use `<Button>` component
