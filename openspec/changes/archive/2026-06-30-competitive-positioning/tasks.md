## 1. Site Configuration

- [ ] 1.1 Add competitive-positioning entry to `site.json` pages array with title, description, and `active: "Resources"`
- [ ] 1.2 Add `competitive-positioning/index.html` → `competitive-positioning.html` to SRC_MAP in `scripts/assemble.mjs`

## 2. Shared Components Update

- [ ] 2.1 Add "Competitive Positioning" link to Resources dropdown in `src/partials/nav.html`
- [ ] 2.2 Add "Competitive Positioning" link to Resources column in `src/partials/footer.html`

## 3. Page Creation

- [ ] 3.1 Create `src/pages/competitive-positioning.html` using the standard page template (nav include, footer include, core.css, core.js)
- [ ] 3.2 Build Hero section: heading, subheading, CTA button, brief positioning statement
- [ ] 3.3 Build Competitor Quadrant Grid section: 2x2 grid with 4 competitor categories and center OptiFlow node
- [ ] 3.4 Build Feature Comparison Matrix section: responsive HTML table with 5 columns and 10+ feature rows
- [ ] 3.5 Build Cost Comparison section: 4 cost cards comparing pricing models in ₹
- [ ] 3.6 Build Why OptiFlow Stands Out section: 3 cards highlighting unique advantages
- [ ] 3.7 Build CTA section with "Book a Demo" button and secondary messaging
- [ ] 3.8 Add page-specific `<style>` block with dark mode overrides for all custom components

## 4. Cross-Linking

- [ ] 4.1 Add "Compare vs alternatives" secondary CTA link in `src/pages/why-optiflow.html` CTA section
- [ ] 4.2 Add "See full competitive comparison" link in `src/pages/pricing.html` cost comparison section

## 5. Build & Validate

- [ ] 5.1 Run `npm run build` to assemble all pages including the new one
- [ ] 5.2 Run `npm run validate` to check links, SEO, colors, and consistency
- [ ] 5.3 Verify the page renders correctly at `dist/competitive-positioning/index.html`
