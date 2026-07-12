## Why

The Product Overview page is the primary product education page for OptiFlow OS — it is the second-most-visited page after Home and contains the architecture diagram, which is the key technical differentiator. Currently it exists only as a 973-line static HTML file in `src/pages/`. The React SPA has a 14-line skeleton placeholder. Completing this migration unlocks the full product page in the new frontend and sets the pattern for the remaining high-complexity page migrations.

## What Changes

- Replace the skeleton `ProductOverview.tsx` with a full implementation mirroring all 12 sections from `src/pages/product-overview.html`
- Create a shared data module (`data/productOverview.ts`) containing 12 module specs, demo tab content, architecture node metadata, and panel content
- Build 6 page-specific components: `ArchitectureDiagram`, `ModuleSpotlight`, `PanelSection`, `WorkflowEngine`, `DemoTabs`, and `ProductOverviewStyles`
- Wire interactive state: tab switching, KPI/metric cycling, status chip toggling, architecture tooltips, module expand/collapse
- Port all dark mode overrides and responsive breakpoints to the React styles component

## Capabilities

### New Capabilities
- `product-overview-data`: Centralized static data module for the Product Overview page — 12 module definitions (name, description, icon, benefit), 4 demo tab panels (dashboard, tasks, attendance, reports), 12 architecture node metadata entries, and panel content for Admin/Captain/Doer views
- `product-overview-components`: Page-specific React components for the Product Overview page — `ArchitectureDiagram` (SVG hub-and-spoke with tooltips), `ModuleSpotlight` (6+6 expandable grid), `PanelSection` (feature list + dashboard mockup + 3 benefit cards), `WorkflowEngine` (5-step numbered flow), `DemoTabs` (4-tab interactive dashboard mockup), and `ProductOverviewStyles` (CSS-in-JS styles component)

### Modified Capabilities
- None — the existing `page-migration` spec already covers the requirement that all 17 pages render complete content; this change implements that requirement for the Product Overview page

## Impact

- **New files**: `frontend/src/data/productOverview.ts`, `frontend/src/components/product-overview/*.tsx` (6 components), `frontend/src/components/product-overview/ProductOverviewStyles.tsx`
- **Modified files**: `frontend/src/pages/ProductOverview.tsx` (14 → ~350 lines), `frontend/src/data/index.ts` (add re-export)
- **Referenced specs**: `page-migration`, `shared-components`, `react-design-tokens`, `react-router-config`
- **No API, backend, or database changes**
