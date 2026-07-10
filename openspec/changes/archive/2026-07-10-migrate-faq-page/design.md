## Context

The OptiFlow website has two frontends: a static HTML/CSS site at `src/pages/` (assembled via `scripts/assemble.mjs`) and a React SPA at `frontend/src/` (Vite + TypeScript + Tailwind CSS). The FAQ page lives in the static site (`src/pages/faq.html`, 658 lines) with 42 FAQs, search, tabs, troubleshooting wizard, and feedback — all as inline vanilla JS. The React app has only a 14-line stub at `frontend/src/pages/FAQ.tsx`.

The existing React app pattern is entirely static data: `src/data/*.ts` files export typed arrays that page components import and render. The only API call in the frontend is the demo booking form submission. There are already two separate accordion implementations: `FAQPreview.tsx` (CSS class-based) and `PricingFAQ.tsx` (grid-rows animation), neither shared.

The backend is a minimal Django + DRF app with only one functional app (`leads/`), using `@api_view` decorator functions, no ViewSets, no routers.

## Goals / Non-Goals

**Goals:**
- Port all 42 FAQ items and their category structure to a static TypeScript data file matching the existing `src/data/*.ts` pattern
- Build the full FAQ page in React with feature parity to the static HTML version
- Extract a shared `FAQAccordion` component and refactor the two existing accordion usages to use it
- Add server-side feedback tracking via a small Django API endpoint (replacing localStorage)
- Follow all existing codebase conventions: inline styles with CSS variables, shared components via barrel exports, function-based Django views

**Non-Goals:**
- Backend-driven FAQ content management (no admin-editable FAQ content — out of scope; static data is sufficient for 42 rarely-changing items)
- Full CMS integration (that's feature `F-CMS-PAGE-001`)
- Migrating the troubleshooting wizard to backend config (the 15-path tree is static config)
- Multi-language FAQ support
- Analytics dashboard for feedback data

## Decisions

### 1. Static data over API-driven FAQ content

**Decision**: Store FAQ items, categories, and troubleshooting tree in `frontend/src/data/faq.ts` as typed TypeScript exports, NOT in Django models.

**Alternatives considered**:
- Django models + API endpoint (`GET /api/faq/`) → Adds 3 models, 2 serializers, 3 views, 2 API endpoints, migrations, seed scripts, and `useEffect`+fetch+loading states in the frontend. For 42 rarely-changing items, this is over-engineering.
- Hybrid (static data + feedback API only) → **Chosen**. Matches the existing codebase pattern (features.ts, showcase.ts, pricingData.ts, etc.). Search, filtering, and rendering are instant with no network latency. The only dynamic piece — feedback votes — gets a focused API.

**Rationale**: Follows the existing architecture. Every other page uses static data. Adding a full DB-driven content system for 42 FAQ items would create a new architectural pattern inconsistent with the rest of the app, with no proportional benefit. If content management is needed later, it's the `F-CMS-PAGE-001` feature's responsibility.

### 2. FAQAccordion animation: grid-rows over height transition

**Decision**: Use the `gridTemplateRows: '0fr' / '1fr'` animation pattern from `PricingFAQ.tsx`.

**Alternatives considered**:
- CSS class-based with `max-height` transition (used in `FAQPreview.tsx`) → Janky on variable-height content; requires guessing max-height.
- Native `<details>/<summary>` elements (used in DemoBooking page) → No animation control; inconsistent with the polished feel of the rest of the site.

**Rationale**: The grid-rows pattern is already used in one component and provides smooth, deterministic animation regardless of content height. Standardizing on this creates consistency.

### 3. FAQAccordion as shared component

**Decision**: Extract a new `<FAQAccordion items={...} />` component into `frontend/src/components/sections/FAQAccordion.tsx`, export from `components/index.ts`, and refactor `FAQPreview.tsx` and `PricingFAQ.tsx` to use it.

**Rationale**: Two independent accordion implementations already exist. A shared component eliminates duplication, ensures consistent behavior, and the `items` prop pattern is simple enough to serve both use cases without premature abstraction.

### 4. Search: client-side filtering

**Decision**: Implement search as client-side `Array.filter()` over the static FAQ data, triggered by input with 200ms debounce. Highlight matching terms using `dangerouslySetInnerHTML` with `<mark>` tag injection.

**Alternatives considered**:
- Server-side search via API → Unnecessary for 42 items. Adds network latency.
- Fuse.js or other fuzzy search library → Unnecessary dependency. Simple `indexOf` substring matching is sufficient for FAQ search.

**Rationale**: 42 items is trivial for client-side search. The existing `faq.html` already does this in vanilla JS. The debounce prevents excessive re-renders. Term highlighting uses a simple regex replace on the answer text.

### 5. Feedback: server-side API over localStorage

**Decision**: Create a `faq/` Django app with `FAQFeedback` model and `POST /api/faq/feedback/` endpoint. The frontend posts votes on click and shows a thank-you state. No read-back of votes (no vote count display).

**Alternatives considered**:
- localStorage only (current behavior) → Simple but device-bound; no aggregate analytics.
- Full feedback management with counts → Adds read API, vote counting, and display logic. Out of scope for initial implementation.

**Rationale**: The feedback endpoint is the only piece that benefits from a server. It's a simple model + serializer + view following the exact pattern from `leads/`. The frontend uses a straightforward `fetch()` call (same pattern as `BookingForm.tsx`). Rate limiting prevents abuse.

### 6. Django app: new `faq/` over extending `cms/`

**Decision**: Create a new `faq/` Django app with just the `FAQFeedback` model and endpoint.

**Alternatives considered**:
- Extend the `cms/` app → CMS is a stub tagged for feature `F-CMS-PAGE-001`. Mixing FAQ feedback into CMS would create coupling between two separate features.
- Put feedback model in `core/` → `core/` is for shared utilities, not feature-specific models.

**Rationale**: Clean separation. A focused `faq/` app with one model and one endpoint is minimal and self-contained. When `F-CMS-PAGE-001` builds out the CMS, it won't conflict with this.

### 7. Data organization: single file with typed exports

**Decision**: `frontend/src/data/faq.ts` exports:
- `FAQCategory` interface: `{ id, name, slug, icon, description }`
- `FAQItem` interface: `{ id, question, answer, category, relatedIds }`
- `FAQ_CATEGORIES: FAQCategory[]` (4 items)
- `FAQ_ITEMS: FAQItem[]` (42 items)
- `TROUBLESHOOTING_TREE` — nested object (5 categories, 15 paths)
- `FAQ_ESCALATION_CHANNELS` — 4 escalation card entries

**Rationale**: Single file, single source of truth. Follows the pattern of `pricingData.ts` and `features.ts`. The troubleshooting tree and escalation data are small enough to co-locate.

## Risks / Trade-offs

- **Search performance at scale**: O(n) substring matching over 42 items with regex highlighting is fine. If the FAQ pool grows beyond ~500 items, consider adding a lightweight search index. Mitigation: 42 items is trivial; revisit if content volume 10x.
- **Troubleshooting tree maintenance**: The 15-path resolution tree is a nested JS object with no admin UI. Changes require a code deploy. Mitigation: This data changes rarely (problem categories are stable). Document the tree structure clearly.
- **Feedback without auth**: The endpoint is public with rate limiting only. Anyone can POST fake votes. Mitigation: Rate limiting (30/hr) prevents abuse. FAQ feedback is low-stakes — no PII, no financial data. Acceptable for this use case.
- **FAQAccordion breaking change**: Refactoring `FAQPreview.tsx` and `PricingFAQ.tsx` to use the shared component changes their internal implementation. Mitigation: The `FAQAccordion` component uses the same grid-rows animation pattern (`PricingFAQ.tsx` already uses it). Behavior is preserved; only the source of truth moves.
