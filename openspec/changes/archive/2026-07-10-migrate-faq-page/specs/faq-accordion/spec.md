# faq-accordion

## Purpose

A shared, reusable accordion component (single-open, animated expand/collapse) that replaces the two existing duplicate implementations in `FAQPreview.tsx` and `PricingFAQ.tsx`.

## ADDED Requirements

### Requirement: Single-open accordion with animation
The system SHALL provide an accordion component with smooth grid-rows animation that allows only one item to be open at a time.

#### Scenario: Click opens an item
- **WHEN** user clicks a closed accordion item
- **THEN** that item expands with a 350ms grid-rows transition and the chevron/plus icon rotates

#### Scenario: Click closes the open item
- **WHEN** user clicks the currently open accordion item
- **THEN** that item collapses and no item remains open

#### Scenario: Clicking a different item closes the previous
- **WHEN** user clicks item B while item A is open
- **THEN** item A collapses and item B expands

### Requirement: Configurable items prop
The system SHALL accept an `items` prop as an array of `{ question: string, answer: ReactNode }` objects.

#### Scenario: Items render as accordion
- **WHEN** `<FAQAccordion items={[{question: "Q1", answer: <p>A1</p>}]} />` is rendered
- **THEN** one accordion item is displayed with question "Q1" and answer "A1"

### Requirement: Consistent visual style
The system SHALL render accordion items using CSS variables (`--surface`, `--border`, `--radius-lg`, `--fg`, `--muted`, `--teal`) for colors, consistent with the design system.

#### Scenario: Visual consistency
- **WHEN** FAQAccordion renders
- **THEN** items have `var(--surface)` background, `var(--border)` border, `var(--radius-lg)` border-radius, and use `var(--fg)` for question text and `var(--muted)` for answer text

### Requirement: Replaces existing accordion implementations
The `FAQPreview.tsx` and `PricingFAQ.tsx` components SHALL be refactored to use the shared `FAQAccordion` component instead of their own inline accordion logic.

#### Scenario: FAQPreview uses shared accordion
- **WHEN** viewing the FAQ preview on the home page
- **THEN** accordion behavior is driven by `FAQAccordion`, not inline state management

#### Scenario: PricingFAQ uses shared accordion
- **WHEN** viewing the pricing FAQ section
- **THEN** accordion behavior is driven by `FAQAccordion`, not inline state management
