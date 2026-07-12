## 1. ComparisonTable Shared Component

- [x] 1.1 Create `ComparisonTable.tsx` in `frontend/src/components/sections/` with props: `columns` (array of `{key, label, highlight?}`), `rows` (array of objects mapping column keys to `{type: 'check'|'cross'|'text', value?: string}`)
- [x] 1.2 Implement check/cross SVG icon rendering based on cell `type`
- [x] 1.3 Apply sticky header (`position: sticky; top: 0; z-index: 1`)
- [x] 1.4 Apply highlighted column styling (`highlight-col` class with accent background)
- [x] 1.5 Add horizontal scroll wrapper (`overflow-x: auto`, `min-width: 900px`, `-webkit-overflow-scrolling: touch`)
- [x] 1.6 Add dark mode styles (semi-transparent accent highlight, green checks, muted crosses)
- [x] 1.7 Add first-column left-aligned styling (30% width, bold label text)
- [x] 1.8 Verify comparison table renders 5 columns and 11 rows with WhyOptiFlow data; verify it handles check, cross, and text cell types

## 2. Problem Solutions Page — Sections

- [x] 2.1 Replace stub with full page structure importing shared components (`Section`, `Card`, `Container`, `Button`, `MetaHead`) and hooks (`useScrollReveal`)
- [x] 2.2 Implement Hero section: hook badge, h1, lead, chaos bubble grid (8 bubbles with staggered float animation), 4 trust checkmarks, 2 CTA buttons
- [x] 2.3 Implement Pain Point Carousel: 8 pain point items cycling every 3s with `setInterval`, `document.hidden` pause, `prefers-reduced-motion` static fallback, fade CSS transition
- [x] 2.4 Implement Chaos Map: 6 source bubbles (WhatsApp, Excel, Phone, Registers, Verbal, Sticky Notes with color-coded backgrounds), arrows (SVG right-arrow icons), central "CHAOS" dashed-border node with pulse animation, resolve "OptiFlow OS" node with "Single Source of Truth"
- [x] 2.5 Implement Trust Bar: 4 metrics (500+ Businesses, 10,000+ Tasks, 10,000+ Users, 1,200+ Departments) in a 4-column grid
- [x] 2.6 Implement Industry Problem Cards (6): Textile QC, Textile 3-shift, Manufacturing PM, Manufacturing Approval, Trading Sales, Logistics Dispatch — each with industry tag, heading, description, impact tag (INR), ROI solution line
- [x] 2.7 Implement WhatsApp Chat Mockup: group chat header with icon, 7 alternating sent/received messages with sender names, 3 cost cards (Tasks Get Lost, No Audit Trail, Zero Visibility)
- [x] 2.8 Implement Cost of Doing Nothing: dark section with 3 stat blocks (5-20L revenue lost, 60-100 hours wasted, 40% owner time) with note text
- [x] 2.9 Implement Solution Flow: 3 connected nodes (Business Chaos → OptiFlow OS → Process-Driven Business) with SVG arrows, 8 module tags below
- [x] 2.10 Implement People vs Process: two-column grid with 7 rows each — left "People-Driven Business" (danger-styled, dependency/errors/delays etc.), right "Process-Driven Business" (green-styled, auto-assigned/accurate/instant etc.), each with label and outcome header rows
- [x] 2.11 Implement Before/After comparison: two-column compact layout with 7 items each — left "Before OptiFlow" (danger dots, X icon heading), right "After OptiFlow" (green dots, check icon heading)
- [x] 2.12 Add micro-CTAs between sections: after WhatsApp section, after Cost of Doing Nothing
- [x] 2.13 Add final CTA section with heading, lead, and two buttons (Book Free Demo, Watch Product Tour)
- [x] 2.14 Add responsive breakpoints: single-column for hero/chaos-map/solution-flow/pvp at 1024px, single-column for stats/compact-compare at 768px, single-column for trust-metrics at 480px

## 3. Why OptiFlow Page — Sections

- [x] 3.1 Replace stub with full page structure importing shared components and hooks (`useTypewriter`, `useMouseGlow`, `useCountUp`, `useScrollReveal`)
- [x] 3.2 Implement Hero section: typewriter with 5 custom phrases ("Turn Chaos Into Complete Control." etc.) via `useTypewriter`, mouse glow via `useMouseGlow` (600px radial gradient, rAF-throttled), blinking cursor `.tw-cursor`, lead paragraph, 2 CTA buttons, 4 trust checkmarks
- [x] 3.3 Implement Transform Visual: 3 stacked stages (Traditional Business Chaos → OptiFlow OS → Process Driven Operations) with down arrows, pulsed glow on OptiFlow stage, 3 floating KPI badges with `transform-kpi` classes (80% Reduced Follow-Ups, 95% Accountability, 120+ hrs/month)
- [x] 3.4 Implement Problem Cards (6): WhatsApp Dependency, Excel Dependency, Manual Follow-Ups, Employee Dependency, No Visibility, No Accountability — each with icon SVG, heading, problem description, impact stat badge, OptiFlow solution line
- [x] 3.5 Implement Designer Cards (3) with dark section background: Designed For Daily Operations, Built For Real Accountability, Practical Easy Relevant — each with icon, heading, description
- [x] 3.6 Implement Easy Adoption: 3 adoption cards (Simple Interface, Role-Based Views, Mobile First) + 4 adoption stats (90%+, <7 days, 3 roles, 24/7)
- [x] 3.7 Implement Timeline (4-step): vertical gradient line, 4 alternating items with numbered dots — Discovery & Setup, Configuration, Team Training, Go Live & Support
- [x] 3.8 Implement ROI Stats Grid: 8 stat cards with `useCountUp` animated values (80%, 95%, 100%, 40%, 120+, 3, 92%, 100%) — each with label and description. Counters trigger on scroll via IntersectionObserver
- [x] 3.9 Implement Comparison Table section with dark background: use shared `ComparisonTable` component with 5 columns (Capability, WhatsApp, Excel, Generic Task Tools, Traditional Systems, OptiFlow OS — last highlighted) and 11 rows of check/cross data
- [x] 3.10 Implement Customer Results: 3 testimonial cards (Amit Kumar, Neha Sharma, Rajesh Patel) with quote, avatar initials, name, role, outcome text; 4 testimonial stats with animated `useCountUp`
- [x] 3.11 Implement Trust Elements: 4 trust cards (Role Based Permissions, Complete Audit Trails, 99.9% Reliability, Dedicated Support) with icons, headings, descriptions
- [x] 3.12 Implement Final CTA: dark background section with heading, lead, 3 buttons (Book Free Demo, Watch Product Tour, Compare vs Alternatives), 4 trust checkmarks
- [x] 3.13 Add responsive breakpoints: single-column hero at 1024px, 2-col ROI/trust at 1024px, single-column at 480px; timeline left-aligned at 768px; hide floating KPIs at 1024px

## 4. Integration and Verification

- [x] 4.1 Verify both pages lazy-load correctly via existing routes in `routes.ts` (no route changes needed)
- [x] 4.2 Verify `MetaHead` sets correct title/description for both pages (use existing route config)
- [x] 4.3 Run `npm run frontend:build` and verify no build errors
- [x] 4.4 Run `npm run lint:all` and verify no lint errors
- [x] 4.5 Spot-check both pages in browser: all sections render, animations work, responsive layouts function, dark mode colors correct
- [x] 4.6 Verify carousel pauses on tab blur; typewriter pauses on tab blur; mouse glow activates/deactivates on hero enter/leave; count-up triggers on scroll
- [x] 4.7 Verify comparison table renders correctly in dark mode with proper check/cross icon colors and highlight column styling
