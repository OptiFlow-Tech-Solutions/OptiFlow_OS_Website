# Skeleton Loading & Empty States

## Purpose

Define skeleton loading placeholders and empty state UIs for all pages to improve perceived performance and handle edge cases where content is unavailable.

## Requirements

### Requirement: Skeleton Loading for Content Grids

Content sections that display multiple items (articles, features, resources) SHALL support skeleton loading placeholders using the `.skeleton` CSS classes defined in `core.css`.

#### Scenario: Skeleton cards render correctly

- **GIVEN** a page with a content grid
- **WHEN** skeletons are injected via `showSkeleton(container, 'card', count)`
- **THEN** the correct number of skeleton card placeholders SHALL appear
- **AND** each placeholder SHALL have the shimmer animation
- **AND** `prefers-reduced-motion` SHALL disable the animation

#### Scenario: Skeletons are hidden from screen readers

- **GIVEN** skeleton placeholders are visible on a page
- **WHEN** a screen reader encounters the skeleton elements
- **THEN** the skeleton elements SHALL have `aria-hidden="true"`

### Requirement: Empty State for Filtered Content

When a category filter or search returns no matching content, an empty state SHALL be displayed with a descriptive message.

#### Scenario: Category filter returns no results

- **GIVEN** a page with a category-filterable content grid
- **WHEN** the user selects a category that has no matching items
- **THEN** an empty state component SHALL be shown
- **AND** the empty state SHALL include an icon, a title, and a descriptive paragraph

#### Scenario: Empty state includes recovery action

- **GIVEN** an empty state is displayed due to a filter
- **WHEN** the user interacts with a "Clear filter" or "View all" button
- **THEN** the full content list SHALL be restored

### Requirement: Form Submission Loading State

All forms on the site SHALL display a loading state during submission using the `.form-submitting` CSS class from `core.css`.

#### Scenario: Newsletter form shows loading state

- **GIVEN** the newsletter subscription form
- **WHEN** the user submits the form
- **THEN** the form SHALL enter the `.form-submitting` state
- **AND** the submit button SHALL show a loading spinner
- **AND** the form fields SHALL be dimmed

#### Scenario: Demo booking form shows loading state

- **GIVEN** the demo booking form
- **WHEN** the user submits the form
- **THEN** the form SHALL enter the `.form-submitting` state

#### Scenario: Contact form shows loading state

- **GIVEN** the contact form
- **WHEN** the user submits the form
- **THEN** the form SHALL enter the `.form-submitting` state
