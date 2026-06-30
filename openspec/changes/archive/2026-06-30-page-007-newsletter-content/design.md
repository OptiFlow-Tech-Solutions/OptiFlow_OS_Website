## Context

The Newsletter & Content page (`src/pages/newsletter.html`) is an existing 591-line page that serves as the content marketing hub. It contains 8 sections: Hero, Trust Bar, Featured Article, Explore By Topic (categories), Latest Articles, Most Read This Month (popular), Newsletter Subscription, Resources Hub, and Final CTA. The page builds successfully and follows all project conventions (placeholders, includes, CSS variables).

No new architecture is needed—this is a cleanup and formalization task.

## Goals / Non-Goals

**Goals:**
- Remove redundant `.stagger` CSS animation rules (7 lines) in favor of core.css `.stagger-3`/`.stagger-4` utility classes
- Replace all `.stagger` class usages with appropriate `.stagger-N` classes
- Verify the page builds and validates cleanly

**Non-Goals:**
- No layout or content changes
- No new sections
- No new dependencies

## Decisions

- **Use core.css `.stagger-3`/`.stagger-4`**: The page defines its own `.stagger > *` animation rules (lines 134–140) that duplicate core.css's `stagger-3`/`stagger-4`/`stagger-5` classes. The Trust Metrics grid (4 items) uses `.stagger` → switch to `.stagger-4`. The Popular Articles list (6 items) uses `.stagger` → switch to `.stagger-4` (core.js handles any count). Categories grid (6 items) uses `.stagger` → switch to `.stagger-3`. Latest Articles grid (6 items) uses `.stagger` → switch to `.stagger-3`. Resources grid (6 items) uses `.stagger` → switch to `.stagger-3`.

- **Keep page-specific stagger post-processor in core.js**: The core.js stagger handler dynamically applies delays to children, so any `.stagger-N` class works for any child count. No page-specific JS needed.

## Risks / Trade-offs

None. This is a pure cleanup with no behavioral change.
