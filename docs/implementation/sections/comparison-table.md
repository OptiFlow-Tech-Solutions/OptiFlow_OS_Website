# Comparison Table
- **Status:** partial | **Used On:** features.html, competitive-positioning.html, problem-solutions.html, why-optiflow.html
- **Priority:** medium

## Feature IDs
- UX-004 — style extraction

## Pending Improvements
- [ ] Confirm/complete extraction to `core.css` (UX-004)

## Dependencies / Implementation Notes
Styled via `.comparison-table` class in `core.css`. Responsive layout: horizontal scroll on mobile viewports (`overflow-x: auto` wrapper). Checkmark/cross icon indicators per row. Data is inline HTML in each page — no shared data source. Styles are already in `core.css`; the pending task is to verify coverage covers all four usage pages.
