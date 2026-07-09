## 1. Data Files

- [x] 1.1 Create `frontend/src/data/showcase.ts` with `ShowcaseEntry` interface and 6 showcase entries (task, attendance, sop, reports, checklist, leave) matching static HTML content — each with id, label, heading, lead, problem, cost, solutions (2), metrics (3), dashboard, phoneFrame, visualSide, cta
- [x] 1.2 Create `frontend/src/data/competitive.ts` with quadrant entries (4), feature matrix rows (13), cost card entries (4), and standout card entries (3) matching static HTML content
- [x] 1.3 Update `frontend/src/data/index.ts` to re-export `showcase` and `competitive` data

## 2. ShowcaseTransform Component

- [x] 2.1 Create `frontend/src/components/sections/features/ShowcaseTransform.tsx` — accepts ShowcaseEntry props, renders problem block with cost pill, 2 solution cards, 3 metric cards, dual visual (DashboardPreview + PhoneFrame), and FeatureCTA
- [x] 2.2 Support `visualSide` prop to swap content/visual positions (left or right)
- [x] 2.3 Add responsive styles: 2-col grid collapses at 1024px, solution and metric grids collapse at 768px

## 3. Competitive Positioning Components

- [x] 3.1 Create `frontend/src/components/sections/competitive/QuadrantGrid.tsx` — 2x2 grid with 4 quadrant cards (label, title, weaknesses with ×, advantage) and centered overlay circle
- [x] 3.2 Add responsive behavior: single column + static center block at <=767px
- [x] 3.3 Create `frontend/src/components/sections/competitive/CostComparison.tsx` — responsive card grid with best-value badge, hover lift, dark mode support

## 4. FeatureShowcase Page

- [x] 4.1 Replace stub in `FeatureShowcase.tsx` with full page: hero (eyebrow + h1 + lead + CTAs + EcosystemHub), FeatureNav (6 items), 6 ShowcaseTransform sections, and bottom CTA
- [x] 4.2 Wire up scroll spy for FeatureNav active tab tracking using `useScrollSpy` hook
- [x] 4.3 Add page-specific dark mode styles (card, button, dashboard-preview, phone-frame, feature-cta overrides)
- [x] 4.4 Verify content parity: all 6 transformation headings, problem texts, solution texts, metric values, and CTA labels match static HTML

## 5. CompetitivePositioning Page

- [x] 5.1 Replace stub in `CompetitivePositioning.tsx` with full page: hero (h1 + lead + CTAs + SVG comparison diagram), QuadrantGrid, feature matrix section using ComparisonTable, CostComparison, standout cards section, and CTA
- [x] 5.2 Wire up ComparisonTable with 5 columns (Feature, OptiFlow OS highlighted, WhatsApp/Excel, Generic SaaS, Traditional ERP) and 13 data rows
- [x] 5.3 Add page-specific dark mode styles (quadrant cards, cost cards, matrix, standout cards)
- [x] 5.4 Verify content parity: all headings, matrix cell values, cost card data, and standout card text match static HTML

## 6. Verification

- [x] 6.1 Run `cd frontend && npm run build` — ensure no TypeScript errors and successful Vite build
- [x] 6.2 Visual verification: compare FeatureShowcase page against static `feature-showcase.html` for layout, content, and responsiveness
- [x] 6.3 Visual verification: compare CompetitivePositioning page against static `competitive-positioning.html` for layout, content, and responsiveness
- [x] 6.4 Verify dark mode on both pages — all sections render correctly with `data-theme="dark"`
- [x] 6.5 Verify responsive behavior: mobile viewport (375px, 768px) for both pages — nav, quadrant, matrix scroll, cost cards
