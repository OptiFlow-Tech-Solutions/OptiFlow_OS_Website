## Why

The Newsletter & Content page is the content marketing hub—housing articles, resources, and a subscription form. The page already exists with 8 sections, a newsletter signup form, category cards, article grids, popular articles list, and a resources hub. This change formalizes the page as an OpenSpec-governed artifact, verifies correctness, and cleans up any issues.

## What Changes

- Review the existing newsletter page for spec compliance (placeholders, includes, CSS variables, dark mode, accessibility)
- Verify cross-links to `/demo-booking/`, `/product-overview/`, `/features/`, `/problem-solutions/`, `/faq/`
- Remove page-specific `.stagger` animation CSS (lines 134–140) — core.css `.stagger-N` classes already handle this
- Replace `.stagger` usage in Popular Articles and Resources Hub sections with `.stagger-3`/`.stagger-4` from core.css
- Verify dark mode coverage for all 8 sections
- Build + validate

## Capabilities

### New Capabilities

None. The newsletter page is an existing page being formalized, not a new capability.

### Modified Capabilities

- `marketing-pages`: Newsletter page source cleanup (~7 lines CSS removed). Ensure `.stagger` uses core.css utility classes instead of page-redundant definitions.

## Impact

- `src/pages/newsletter.html`: Remove redundant `.stagger` CSS, update HTML classes
- Build + validate pass
