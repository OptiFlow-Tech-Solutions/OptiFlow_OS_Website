# PERF-002: Print Stylesheet
- **Feature ID:** PERF-002 | **Category:** Performance | **Priority:** LOW | **Phase:** 10 | **Status:** Pending | **Est. Hours:** 0.3

## Business Goal
Ensure that pages printed from the browser are legible, well-formatted, and free of unnecessary UI elements, supporting users who need physical copies of proposals, pricing, or documentation.

## Technical Goal
Add `@media print` styles to `core.css` that hide navigation, footers (or simplify them), remove backgrounds and shadows, and optimize typography for print.

## Problem Statement
No `@media print` styles exist in `core.css`. Printing any page results in the full website layout — navigation bar, footer, background colors, shadows, and screen-optimized fonts — wasting ink/toner and producing poorly formatted output.

## Current Behavior
Printed output mirrors the screen layout exactly, including navigation, decorative elements, and background colors.

## Expected Behavior
Printed output hides the navigation bar, simplifies the footer to contact info only, removes background colors and box shadows, sets black text on white background, and adjusts font sizes for readability on paper.

## Affected Pages / Components / Files
- `assets/css/core.css` — add `@media print` block

## Dependencies
None

## Acceptance Criteria
- [ ] Navigation bar is hidden in print
- [ ] Footer is simplified to essential contact information only
- [ ] Background colors and box shadows are removed
- [ ] Text is black on white background
- [ ] Links display their URL in parentheses (e.g., via `a[href]::after { content: " (" attr(href) ")" }`)
- [ ] Page breaks avoid breaking cards or sections mid-content (`page-break-inside: avoid`)
- [ ] `npm run build && npm run validate` passes

## Definition of Done
- [ ] Code implemented
- [ ] Tests passing
- [ ] Validation passing

## Implementation Notes
Standard print reset: `display: none` on `nav` and decorative elements, `background: white !important; color: black !important` on `body`, `box-shadow: none` on cards, `font-size` adjustments to `pt` units for readability. Add `@page { margin: 1cm }` for consistent margins. Test by printing the pricing and about pages as representative samples.

## Rollback Notes
Remove the `@media print` block from `core.css`.
