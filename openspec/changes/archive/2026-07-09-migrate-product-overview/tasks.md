## 1. Data Layer

- [x] 1.1 Create `frontend/src/data/productOverview.ts` with TypeScript interfaces (`ModuleData`, `ArchNodeData`, `DemoTabContent`, `PanelData`, `WorkflowStep`, `ReportType`, `VisionCard`, `PermissionRow`) and all static content arrays
- [x] 1.2 Add product overview data re-exports to `frontend/src/data/index.ts`
- [x] 1.3 Verify data module compiles with `cd frontend && npx tsc --noEmit`

## 2. Shared Reusable Components

- [x] 2.1 Create `ArchitectureDiagram` component in `frontend/src/components/product-overview/ArchitectureDiagram.tsx` — SVG hub-and-spoke with 12 nodes, 12 connector lines, and tooltip hover/focus behavior with viewport edge detection
- [x] 2.2 Create `ModuleSpotlight` component in `frontend/src/components/product-overview/ModuleSpotlight.tsx` — expandable 6+6 grid with CSS grid animation and toggle button
- [x] 2.3 Create `PanelSection` component in `frontend/src/components/product-overview/PanelSection.tsx` — two-column feature+dashboard layout with 3 benefit cards, supporting `reverse` and `badge` props
- [x] 2.4 Create `WorkflowEngine` component in `frontend/src/components/product-overview/WorkflowEngine.tsx` — 5-step numbered flow with arrow connectors and wrapping layout
- [x] 2.5 Create `DemoTabs` component in `frontend/src/components/product-overview/DemoTabs.tsx` — 4-tab interactive dashboard mockup with useState for active tab, KPI cycling, and status chip toggling
- [x] 2.6 Verify all components compile with `cd frontend && npx tsc --noEmit`

## 3. Styles

- [x] 3.1 Create `frontend/src/components/product-overview/ProductOverviewStyles.tsx` — all page-specific CSS ported from the static HTML including hero, dashboard mockups, transformation flow, architecture diagram, modules, panels, workflow, reports, security/permissions, CTA, scroll reveals, sticky CTA, dark mode overrides, and responsive breakpoints (480px, 768px, 1024px)
- [x] 3.2 Verify no hardcoded hex colors in styles — all colors use `var(--*)` references

## 4. Page Assembly

- [x] 4.1 Rewrite `frontend/src/pages/ProductOverview.tsx` with all 12 sections: Hero (with DemoTabs), Transformation Flow, Product Vision (6 cards), Platform Architecture (ArchitectureDiagram), Core Modules (ModuleSpotlight), Admin Panel (PanelSection), Captain Panel (PanelSection with reverse), Doer Panel (PanelSection with badges), Workflow Engine (WorkflowEngine), Reporting Engine (4 KPIs + 6 report cards), Security & Permissions (matrix table + 3 security cards), CTA Section
- [x] 4.2 Wire SEOHead with title and description from site.json page metadata
- [x] 4.3 Verify all sections use `<Section>` component (not raw `<section>` tags) and `<Button as={Link}>` for CTAs

## 5. Validation

- [x] 5.1 Run `cd frontend && npx tsc --noEmit` — zero type errors
- [x] 5.2 Run `cd frontend && npm run build` — builds successfully with no warnings
- [x] 5.3 Start dev server and manually verify: 4 demo tabs switch content, 12 architecture nodes show tooltips on hover, module grid expands from 6 to 12, panel sections render with correct data, workflow shows 5 connected steps, permissions matrix has 8 rows with correct badges
- [x] 5.4 Verify dark mode: toggle theme and confirm all page elements respond with correct colors
- [x] 5.5 Verify responsive: test at 480px, 768px, and 1024px breakpoints — layouts collapse correctly, tooltips remain functional on mobile
- [x] 5.6 Run `npm run validate` from project root to confirm no regressions in the static site build
