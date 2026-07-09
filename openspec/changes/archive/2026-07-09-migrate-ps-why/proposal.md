## Why

The Problem Solutions and Why OptiFlow pages are two of the highest-converting conviction pages in the funnel — together covering problem-awareness and solution-awareness buyer stages. Both exist as 600+ line static HTML files with inline CSS/JS but are currently 14-line React stubs. Completing their migration unlocks the full content marketing funnel in the React SPA and eliminates two of the largest remaining static pages.

## What Changes

- **ProblemSolutions.tsx**: Full migration of all 10 visual sections from the static `problem-solutions.html` — hero with chaos bubbles, pain point carousel (8 items, 3s auto-rotate), chaos map, trust metrics, 6 industry problem cards, WhatsApp chat mockup (7 messages), cost stats, solution flow, people-vs-process comparison (7 rows), and before/after compare (7 rows)
- **WhyOptiFlow.tsx**: Full migration of all 10 visual sections from the static `why-optiflow.html` — hero with typewriter (5 custom phrases) and mouse glow, 6 problem cards, 3 designer cards, adoption stats, 4-step timeline, 8 animated ROI counters, comparison table (5 columns, 11 rows), 3 testimonials, 4 trust elements, and final CTA
- **New shared component**: `ComparisonTable` — reusable table component with check/cross icons, highlighted column, sticky headers, horizontal scroll, dark mode support. Used by WhyOptiFlow, Home (WhyOptiflowComparison section), and CompetitivePositioning pages
- **Page-specific components**: PainPointCarousel, ChaosMap, WhatsAppChatMockup, PeopleVsProcess, BeforeAfterCompare for ProblemSolutions; ROIStatCard, TimelineItem, DesignerCard, TrustElementCard for WhyOptiFlow
- **Hooks**: Reuse existing `useTypewriter` (with custom phrases) and `useMouseGlow` for WhyOptiFlow hero; `useCountUp` for ROI stat animations

## Capabilities

### New Capabilities
- `comparison-table-component`: Reusable comparison table with configurable columns, rows, check/cross icons, highlight column, sticky headers, and responsive horizontal scroll
- `problem-solutions-page`: React page rendering all 10 sections from the static HTML with interactive animations (pain carousel, chaos map, WhatsApp mockup)
- `why-optiflow-page`: React page rendering all 10 sections from the static HTML with interactive animations (typewriter, mouse glow, count-up stats)

### Modified Capabilities
- `page-migration`: Two additional pages (ProblemSolutions, WhyOptiFlow) move from stub to fully migrated, advancing progress toward the "all 17 pages" requirement

## Impact

- Affected code: `frontend/src/pages/ProblemSolutions.tsx`, `frontend/src/pages/WhyOptiFlow.tsx` (stubs → full pages)
- New components: `frontend/src/components/sections/ComparisonTable.tsx`, plus page-specific components in `frontend/src/components/sections/problem-solutions/` and `frontend/src/components/sections/why-optiflow/`
- No backend, database, or API changes
- No breaking changes — routes already configured, pages already lazy-loaded
- Static HTML source files (`src/pages/problem-solutions.html`, `src/pages/why-optiflow.html`) remain as content reference during migration; can be removed in a follow-up cleanup
