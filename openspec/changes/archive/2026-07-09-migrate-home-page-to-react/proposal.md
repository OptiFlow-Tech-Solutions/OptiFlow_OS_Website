## Why

The home page is the most-visited page on optiflow.in and the primary conversion path for demo bookings. Currently it's a 14-line placeholder in React while the 677-line static `home.html` (13 sections, 7 animations) remains the live version. Migrating it now establishes the migration pattern for the remaining 13 pages, proves the shared component system at scale, and unblocks conversion optimization.

## What Changes

- Replace the placeholder `Home.tsx` with a full page component rendering all 13 sections from the static HTML with identical content and visual output
- Create 13 section components: `HeroSection`, `TrustBar`, `ProblemSection`, `CostOfInaction`, `SolutionFlow`, `ProductSnapshot`, `HowItWorks`, `FeatureSection`, `IndustrySection`, `WhyOptiflowComparison`, `TestimonialSection`, `CTASection`, `FAQPreview`
- Port 4 custom animation hooks from vanilla JS: `useTypewriter`, `useMouseGlow`, `useCardTilt`, `useParallax`
- Port 2 interactive overlays: `ExitOverlay` (exit-intent popup), `WhatsAppFloat` (floating WhatsApp button)
- Add `useCountUp` hook (net-new; counter animation not present in original HTML)
- Create `HomeStyles` component for page-specific CSS (hero gradients, dashboard mockup, floating widgets, typewriter cursor, card tilt) following the `GlobalStyles` injected-`<style>` pattern
- Wire 8 ScrollReveal intersections via `useScrollReveal` hook compatible with existing `.reveal` / `.stagger-*` CSS classes
- All CTAs use `<Button>` component, all sections use `<Section>` component, all cards use `<Card>` component as required by `shared-components` spec

## Capabilities

### New Capabilities
- `home-page-sections`: 13 section components rendering complete content from static home.html, using shared Section/Card/Button components
- `home-page-animations`: Custom React hooks (`useTypewriter`, `useMouseGlow`, `useCardTilt`, `useParallax`, `useCountUp`, `useScrollReveal`) porting all home page animations with identical timing and easing
- `home-page-styles`: Page-specific CSS (hero gradients, dashboard mockup, floating widgets, typewriter cursor, card tilt, exit overlay) injected via HomeStyles component

### Modified Capabilities
- `page-migration`: Update Home page scenario from "at least 3 content sections" to "all 13 sections with identical text content, layout, and animations matching static home.html"

## Impact

- `frontend/src/pages/Home.tsx` — replaced entirely (14 lines → full page)
- `frontend/src/hooks/` — 6 new hook files (`useTypewriter.ts`, `useMouseGlow.ts`, `useCardTilt.ts`, `useParallax.ts`, `useCountUp.ts`, `useScrollReveal.ts`)
- `frontend/src/components/` — 13 new section components in `sections/` subdirectory
- `frontend/src/components/` — `ExitOverlay.tsx`, `WhatsAppFloat.tsx`
- `frontend/src/styles/home.css` — page-specific styles (~250 lines equivalent)
- No backend, database, or API changes
