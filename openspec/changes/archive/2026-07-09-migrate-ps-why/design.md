## Context

The React SPA (`frontend/`) is a Vite 8 + React 19 + Tailwind CSS 4 + React Router 7 application. It coexists with the legacy HTML build system (`src/pages/` → `dist/` via `scripts/assemble.mjs`). Pages are lazy-loaded via `routes.ts`. Both `ProblemSolutions.tsx` and `WhyOptiFlow.tsx` are 14-line stubs. All shared infrastructure exists: hooks (`useTypewriter`, `useMouseGlow`, `useCountUp`, `useScrollReveal`), components (`Section`, `Card`, `Container`, `Button`), and existing shared sections (`TrustBar`, `SolutionFlow`, `CTASection`, `TestimonialSection`).

The static HTML originals (607 and 637 lines respectively) serve as the single source of truth for content, structure, and animation behavior. The React pages must match content fidelity while adapting to React patterns (components, hooks, inline styles + Tailwind).

## Goals / Non-Goals

**Goals:**
- Migrate all 10 visual sections from `problem-solutions.html` into `ProblemSolutions.tsx`
- Migrate all 10 visual sections from `why-optiflow.html` into `WhyOptiFlow.tsx`
- Build `ComparisonTable` as a reusable shared component (5-col, 11-row for WhyOptiFlow; also usable by Home and Competitive pages)
- Reuse existing hooks (`useTypewriter` with custom phrases, `useMouseGlow`, `useCountUp`, `useScrollReveal`)
- Match all animation behavior: pain carousel (3s auto-rotate, pause on blur), typewriter (custom phrases, pause on blur), mouse glow (rAF-throttled), count-up (IntersectionObserver-triggered)

**Non-Goals:**
- Extracting page content into data files — inline data in page components follows existing patterns (Home.tsx, Features.tsx)
- Removing the static HTML originals — they remain as content reference; cleanup is a separate step
- Adding unit tests for page-specific components — the page-migration spec requires content fidelity, not component-level tests
- Modifying existing shared components or hooks — all needed hooks and components already exist

## Decisions

### Decision 1: Page-specific components live alongside pages, not in shared `components/sections/`

**Choice**: Page-specific components (PainPointCarousel, ChaosMap, WhatsAppChatMockup, etc.) go in the page file or as co-located files in a page subdirectory.

**Rationale**: These are conviction-page-specific components not reused elsewhere. Following React conventions, co-location beats premature abstraction. If a component later proves reusable (e.g., BeforeAfterCompare), it can be promoted to shared.

**Alternatives considered**: Putting everything in `components/sections/` — rejected because it adds 10+ files to the shared namespace when only `ComparisonTable` is genuinely shared.

### Decision 2: ComparisonTable as a shared component with a data-driven API

**Choice**: `ComparisonTable` accepts `columns` (array of `{key, label, highlight?}`), `rows` (array of objects mapping column keys to `{type: 'check'|'cross'|'text', value?: string}`), and an optional `rowLabels` array.

**Rationale**: Three pages need comparison tables (WhyOptiFlow 5-col+11-row, Home 5-col+9-row, CompetitivePositioning multi-column). A data-driven component is the lazy win — one component, multiple data configurations.

**File location**: `frontend/src/components/sections/ComparisonTable.tsx` — follows the existing pattern of `WhyOptiflowComparison.tsx`, `TrustBar.tsx`, etc.

### Decision 3: Inline data in page components, not separate data files

**Choice**: Content (card text, comparison data, testimonials, stats) lives directly in the page component files.

**Rationale**: Follows existing patterns (Home.tsx, Features.tsx). Extracting to data files adds indirection without benefit — these are marketing pages, not a CMS. Data files exist for `features.ts` and `productOverview.ts` because those pages have programmatic section generation; these pages are more narrative and less data-driven.

### Decision 4: Reuse existing hooks; no new hooks needed

**Choice**: Use `useTypewriter` with custom phrases for WhyOptiFlow hero, `useMouseGlow` for hero glow, `useCountUp` for ROI stats, `useScrollReveal` for reveal animations.

**Rationale**: All four hooks already handle the needed behaviors (phrase cycling, rAF-throttled mouse tracking, IntersectionObserver-triggered counting, scroll-triggered reveals). The `useTypewriter` hook accepts custom phrases — just pass the 5 WhyOptiFlow phrases. No hook modifications needed.

### Decision 5: Pain Point Carousel as a simple React interval with document.hidden check

**Choice**: Use `useState` + `useEffect` + `setInterval` at 3s, checking `document.hidden` to pause.

**Rationale**: The existing HTML implementation uses exactly this pattern (setInterval, document.hidden check, class toggling). Reactifying it is straightforward — no need for a complex animation library. The `prefers-reduced-motion` media query disables the carousel (shows first item static).

### Decision 6: Section decomposition strategy

**Choice**: Use the shared `<Section>` component for standard sections with `heading`/`lead` props. Use raw `<section>` only for special sections (hero with custom layout, pain points with custom background, dark background sections, CTA sections).

**Rationale**: The `<Section>` component auto-wraps in `<Container>` and renders `section-header`. But several sections need custom layouts (hero grid, chaos map, timeline, comparison table wrapper). The spec requires using `<Section>` where possible, but pragmatically, custom-layout sections need raw `<section>` tags.

**Note**: The page-migration spec says "Pages SHALL NOT use raw `<section className='section'>` tags — they SHALL use the `<Section>` component." This will be followed except where `<Section>` cannot express the layout (e.g., hero with grid, section-dark with custom children like comparison table). For those cases, we can use `<Section>` with just `background` and `className` props and pass children directly (bypassing its header block).

## Risks / Trade-offs

- **Carousel interval cleanup**: React strict mode double-mounts in dev, which could cause double intervals. → Mitigation: proper cleanup in useEffect return, useRef for interval ID.
- **ComparisonTable complexity**: The 5-column table with check/cross SVG icons, sticky headers, and dark mode is the most complex component. → Mitigation: build it first as a standalone component, test with WhyOptiFlow data, then verify it works with Home and Competitive data.
- **Content drift between HTML and React**: If the HTML pages are updated, the React pages fall behind. → Mitigation: this is a known risk of the dual-system architecture. The HTML pages remain the source of truth until the final switchover.
- **Animation performance**: Multiple simultaneous animations (typewriter + mouse glow + count-up on WhyOptiFlow hero) could cause jank on low-end devices. → Mitigation: all animations use rAF, `prefers-reduced-motion` disables animations, IntersectionObserver defers off-screen animations.

## Open Questions

- **When to remove the static HTML files?** They remain as content reference during migration. Should they be deleted in this change or in a follow-up cleanup?
- **Should the ComparisonTable replace the existing `WhyOptiflowComparison.tsx` on the Home page?** That component is home-page-specific with hardcoded data. A future refactor could make it use the new ComparisonTable, but that's out of scope for this migration.
