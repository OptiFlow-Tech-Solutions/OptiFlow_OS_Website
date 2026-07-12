## Why

The FAQ page is the last remaining high-traffic marketing page stuck in the static HTML site (`src/pages/faq.html`, 658 lines). It serves 42 FAQs across 4 categories, a troubleshooting wizard with 15 resolution paths, search with text highlighting, and user feedback — all as inline vanilla JS. The React SPA has only a 14-line stub (`frontend/src/pages/FAQ.tsx`). Bringing this page into the React app completes the page migration, enables consistent shared component usage, and adds server-side feedback tracking (currently limited to per-device localStorage).

## What Changes

- Port all 42 FAQ items (Product: 12, Pricing: 10, Security: 10, Implementation: 10) into a static TypeScript data file matching the existing `src/data/*.ts` pattern
- Build the full FAQ page with: search with text highlighting, category tabs with counts, accordion, 4 help cards, troubleshooting wizard (5 categories, 15 paths), escalation cards, micro-CTAs, and feedback
- Extract a shared `FAQAccordion` component that replaces the two existing duplicate accordion implementations (`FAQPreview.tsx`, `PricingFAQ.tsx`)
- Add a `POST /api/faq/feedback/` Django endpoint to record helpful/unhelpful votes (cross-device, replaces localStorage)
- **BREAKING**: Removes the legacy `src/pages/faq.html` and its inline JavaScript after migration is verified

## Capabilities

### New Capabilities
- `faq-page`: Full FAQ page ported from static HTML with all sections, search, tabs, troubleshooting wizard, escalation cards, and feedback
- `faq-accordion`: Shared accordion component (single-open, animated, reusable) replacing two existing duplicate implementations
- `faq-feedback-api`: Django API endpoint and model for recording FAQ helpfulness votes

### Modified Capabilities
- `shared-components`: Add `FAQAccordion` to the shared component exports; update `FAQPreview.tsx` and `PricingFAQ.tsx` to use it
- `page-migration`: FAQ page requirements are already specified — this change fulfills them

## Impact

- **Frontend**: New `src/data/faq.ts` (static data), new `src/components/sections/FAQAccordion.tsx` (shared), new `src/components/faq/` sub-components, updated `FAQPreview.tsx` and `PricingFAQ.tsx` to use shared accordion, full `src/pages/FAQ.tsx` rewrite
- **Backend**: New `faq/` Django app with `FAQFeedback` model, serializer, view, and URL; one migration
- **Static site**: `src/pages/faq.html` deprecated after verification
- **Routes**: No change — `/faq` route already exists in `frontend/src/routes.ts` (currently points to the stub)
