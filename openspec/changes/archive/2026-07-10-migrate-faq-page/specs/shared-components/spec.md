# shared-components — Delta Spec

## ADDED Requirements

### Requirement: FAQAccordion component
The system SHALL provide a shared `FAQAccordion` component with single-open behavior, smooth grid-rows animation, and an `items` prop accepting `{ question: string, answer: ReactNode }[]`. The component SHALL be exported from `components/index.ts`.

#### Scenario: FAQAccordion renders items
- **WHEN** `<FAQAccordion items={[{question: "Q", answer: <p>A</p>}]} />` is rendered
- **THEN** one accordion item is displayed with the question and expandable answer

#### Scenario: Single-open behavior
- **WHEN** user clicks a second accordion item while the first is open
- **THEN** the first item closes and the second opens

#### Scenario: Uses design tokens
- **WHEN** FAQAccordion renders
- **THEN** styles reference `var(--surface)`, `var(--border)`, `var(--radius-lg)`, `var(--fg)`, `var(--muted)`, `var(--teal)` CSS variables

#### Scenario: Exported from barrel
- **WHEN** importing `{ FAQAccordion }` from `'../../components'`
- **THEN** the component is available and usable

## MODIFIED Requirements

### Requirement: FAQ page component
The FAQ page component (`src/pages/FAQ.tsx`) SHALL display questions grouped by category using the shared `FAQAccordion` component.

#### Scenario: FAQ page uses FAQAccordion
- **WHEN** navigating to the FAQ page
- **THEN** FAQ items are rendered using the `<FAQAccordion>` shared component
