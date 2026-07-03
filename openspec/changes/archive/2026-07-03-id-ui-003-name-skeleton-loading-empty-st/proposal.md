# UI-003: Skeleton Loading & Empty States

## Summary

Implement skeleton loading placeholders and empty state UIs across all pages to improve perceived performance and handle edge cases where content is unavailable.

## Scope

- Skeleton loading patterns for content grids (articles, features, resources)
- Empty state UIs for "no results" and "no data" scenarios
- Form submission loading states (already partially implemented via `.form-submitting`)
- Image placeholder skeletons for async-loaded images

## Affected Specs

- `skeleton-loading` (new delta spec)
- `design-system` (no changes — CSS classes already exist in core.css)
- `shared-components` (no changes — JS helpers already exist in core.js)

## Current State

CSS skeleton classes (`.skeleton`, `.skeleton-text`, `.skeleton-heading`, `.skeleton-card`, `.skeleton-row`, `.skeleton-list`, `.skeleton-hidden`) and empty-state classes (`.empty-state`, `.empty-state-icon`) are fully implemented in `core.css` lines 485-575. JS helpers `showSkeleton()`, `hideSkeleton()`, `emptyState()` exist in `core.js` lines 297-328. Only `admin.html` uses them. Public-facing pages have zero skeleton or empty state usage.

## Target State

- Newsletter page: skeleton loading for article grid, empty state for filtered-no-results
- All form pages: `.form-submitting` skeleton state on submit (already functional via core.js)
- Feature showcase: image skeleton placeholders for visual frames
- Home page: skeleton pattern for features grid (progressive enhancement demo)
