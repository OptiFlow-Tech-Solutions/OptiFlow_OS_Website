# scroll-spy-hook

## Purpose

Reusable React hook providing IntersectionObserver-based scroll spy functionality — returns the ID of the currently visible section for nav highlighting.

## Requirements

### Requirement: useScrollSpy hook tracks visible section
The system SHALL provide a `useScrollSpy` React hook that accepts an array of section element IDs and returns the ID of the currently visible section using IntersectionObserver.

#### Scenario: Returns first section ID by default
- **WHEN** `useScrollSpy(['task', 'checklist', 'delegation'])` is called and the page is at the top
- **THEN** it returns `'task'`

#### Scenario: Returns visible section on scroll
- **WHEN** user scrolls so the 'checklist' section enters the intersection zone
- **THEN** the hook returns `'checklist'`

#### Scenario: Returns null when no sections visible
- **WHEN** no observed section elements are in the viewport
- **THEN** the hook returns `null`

### Requirement: useScrollSpy accepts IntersectionObserver options
The hook SHALL accept an optional options parameter to configure rootMargin, threshold, and root element.

#### Scenario: Custom rootMargin
- **WHEN** `useScrollSpy(ids, { rootMargin: '-30% 0px -50% 0px' })` is called
- **THEN** the intersection detection uses the specified rootMargin

#### Scenario: Default options work without config
- **WHEN** `useScrollSpy(ids)` is called without options
- **THEN** the hook uses sensible defaults (`rootMargin: '-30% 0px -50% 0px'`)

### Requirement: useScrollSpy cleans up on unmount
The hook SHALL disconnect the IntersectionObserver when the component unmounts to prevent memory leaks.

#### Scenario: Observer disconnected on unmount
- **WHEN** the component using `useScrollSpy` unmounts
- **THEN** no IntersectionObserver callbacks fire for the disconnected observer

### Requirement: useScrollSpy works with dynamic section lists
The hook SHALL re-observe sections when the sectionIds array changes between renders.

#### Scenario: Sections added after mount
- **WHEN** the sectionIds array changes from `['a', 'b']` to `['a', 'b', 'c']`
- **THEN** the new section 'c' is observed and its intersection state is tracked

### Requirement: useScrollSpy is exported from hooks barrel
The hook SHALL be importable from `./hooks` for reuse across pages.

#### Scenario: Import from barrel
- **WHEN** developer writes `import { useScrollSpy } from '../hooks'`
- **THEN** the hook is successfully imported
