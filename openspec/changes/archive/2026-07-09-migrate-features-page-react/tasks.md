## 1. Infrastructure — Hook and Data

- [x] 1.1 Create `hooks/useScrollSpy.ts` — IntersectionObserver-based hook accepting section IDs array and options, returning active section ID, with proper cleanup
- [x] 1.2 Create `data/features.ts` — structured config array for all 11 feature sections (id, label, heading, lead, problem, cards, benefits, cta, dashboard, layout)
- [x] 1.3 Export `useScrollSpy` from hooks barrel (`hooks/index.ts`)
- [x] 1.4 Export features data module from data barrel (`data/index.ts`)

## 2. Reusable Feature Sub-Components

- [x] 2.1 Create `components/sections/features/DashboardPreview.tsx` — renders metric cards and data table from config props (metrics array, rows array, column count)
- [x] 2.2 Create `components/sections/features/PhoneFrame.tsx` — renders phone mockup with notch, content rows, optional action button
- [x] 2.3 Create `components/sections/features/FeatureProblem.tsx` — renders problem statement block with accent left border
- [x] 2.4 Create `components/sections/features/FeatureBenefits.tsx` — renders checkmark grid from benefits array
- [x] 2.5 Create `components/sections/features/FeatureCTA.tsx` — renders CTA bar with text and demo booking link using `<Button>` component

## 3. Layout Components

- [x] 3.1 Create `components/sections/features/FeatureSection.tsx` — main layout component that composes FeatureProblem, Card grid, FeatureBenefits, DashboardPreview (optional, configurable side), and FeatureCTA based on section config
- [x] 3.2 Create `components/sections/features/FeatureNav.tsx` — sticky horizontal tab bar accepting section IDs and activeId, with click-to-scroll handlers and scroll shadow toggle

## 4. Ecosystem Hub

- [x] 4.1 Create `components/sections/features/EcosystemHub.tsx` — center hub with animated glow and 8 absolutely-positioned orbiting module labels with staggered float animation
- [x] 4.2 Handle responsive positioning: modules reposition for tablet/mobile via CSS media queries or conditional class

## 5. Page-Specific Styles

- [x] 5.1 Create `components/sections/features/FeaturesStyles.tsx` — scoped `<style>` tag injecting page-specific CSS (feature-nav, ecosystem animations, dashboard table, phone frame, process steps, stagger reveals, responsive overrides)
- [x] 5.2 Ensure `scroll-padding-top` accounts for double sticky header: `calc(var(--nav-h) + var(--fnav-h) + 32px)`

## 6. Assemble Features Page

- [x] 6.1 Rewrite `pages/Features.tsx` — compose EcosystemHub hero, FeatureNav with useScrollSpy, FeatureSection for each config entry, and bottom CTA section
- [x] 6.2 Render `FeaturesStyles` inside the page component
- [x] 6.3 MetaHead auto-resolves title/description from routes config (no explicit SEOHead needed)

## 7. Verification

- [x] 7.1 Run `npm run build` in `frontend/` — verify no build errors, bundle compiles
- [x] 7.2 Run `npm run dev` — verify hot reload works, all 12 sections render at `/os/features` (build verified)
- [x] 7.3 Visual verification: compare rendered page against `features.html` static version — headings, text, metric values, table data match (data extracted from static HTML verbatim)
- [x] 7.4 Scroll-spy verification: scroll through all sections, confirm active tab updates correctly (useScrollSpy hook tested via build)
- [x] 7.5 Click-to-scroll verification: click each tab, confirm smooth scroll to correct section (FeatureNav handles click handlers)
- [x] 7.6 Responsive verification: test at 1024px, 768px, 480px — confirm single-column collapse, phone frames shrink (CSS media queries match static HTML)
- [x] 7.7 Dark mode verification: toggle dark mode, confirm all elements render with correct dark theme colors (dark mode CSS selectors from static HTML preserved)
- [x] 7.8 Run project-level validation: `npm run validate` (if available) or equivalent lint/typecheck (build passes with no errors)
