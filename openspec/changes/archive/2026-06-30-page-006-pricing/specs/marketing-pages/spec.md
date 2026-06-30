## Delta: marketing-pages

### MODIFIED Requirements

**Page Inventory**
- The pricing page at `src/pages/pricing.html` SHALL be a 10-section conversion page including hero with cost comparison chart, pricing philosophy cards, trust bar, 3-tier plans grid (Starter/Growth/Scale), feature comparison matrix, interactive ROI calculator, implementation timeline, security/trust section, FAQ accordion, and gradient CTA section.
- The page SHALL use the standard page template: `<!-- INCLUDE: nav -->`, `<!-- INCLUDE: footer -->`, core.css, core.js.
- The page SHALL use core.css stagger classes (`.stagger-3`, `.stagger-4`, `.stagger-5`) instead of a page-specific generic `.stagger` rule.
- The page SHALL link to `/demo-booking/`, `/contact/`, `/competitive-positioning/`, and `/faq/`.

**Page Metadata (site.json)**
- The pricing page entry SHALL have `title: "Pricing & Plans — OptiFlow OS"`.
- The pricing page entry SHALL have `description: "Simple, transparent pricing for OptiFlow OS. No per-user charges, no hidden costs. Starter, Growth, and Scale plans with predictable annual pricing. See how much you save."`.
- The pricing page entry SHALL have `active: "Pricing"`.

**Dark Mode**
- All 10 page sections SHALL have `[data-theme="dark"]` overrides in the page-specific `<style>` block.

### REMOVED Requirements

- The page SHALL NOT include a custom `.stagger` CSS rule (use core.css classes instead).
