## 1. Site Configuration

- [x] 1.1 Add Feature Showcase entry to `site.json` pages array with title "Feature Showcase — OptiFlow OS" and description
- [x] 1.2 Add "Showcase" nav link to `site.json` nav.links array pointing to `/feature-showcase/`

## 2. Page Shell

- [x] 2.1 Create `src/pages/feature-showcase.html` with standard shell: `<!doctype html>`, `<html data-theme="light">`, charset, viewport meta
- [x] 2.2 Include `{{PAGE_TITLE}}` and `{{PAGE_DESCRIPTION}}` placeholders
- [x] 2.3 Include OG tags (og:image, og:type) and twitter:card meta
- [x] 2.4 Link to `/assets/css/core.css` and `/assets/js/core.js` with defer
- [x] 2.5 Add skip-to-content link, nav include, main#content, footer include, sticky-cta, scroll-top button

## 3. Hero Section

- [x] 3.1 Hero section with `data-screen-label="00 Hero"` and `.eyebrow`, `h1`, `.lead`, CTA buttons
- [x] 3.2 Hero trust indicators (4 checkmark items)
- [x] 3.3 Hero visual: orbiting ecosystem diagram (center hub + 6 module nodes)

## 4. Sub-Navigation

- [x] 4.1 Sticky `.feature-nav` bar with 6 `.feature-tab` buttons: Tasks, Attendance, SOPs, Reports, Checklists, Leave
- [x] 4.2 First tab starts as `.active`

## 5. Feature Sections — Problem → Fix → Outcome

- [x] 5.1 Task Management section (showcase-problem, 3 solution cards, dual-device visual, 3 outcome metrics, CTA bar)
- [x] 5.2 Attendance section with GPS/selfie visual mockup
- [x] 5.3 SOP Library section with version tracking visual
- [x] 5.4 Reports & Analytics section with KPI dashboard visual
- [x] 5.5 Checklist Management section with adherence tracking visual
- [x] 5.6 Leave Management section with buddy assignment visual

## 6. CTA Section

- [x] 6.1 Final CTA section with `data-screen-label="07 CTA"` — heading, lead, Book Demo + Product Tour buttons, trust indicators

## 7. Styling

- [x] 7.1 CSS custom properties in `<style>` block: accent, teal, green, lime overrides
- [x] 7.2 Section layouts: `.showcase-hero`, `.showcase-problem`, `.showcase-visual`, `.showcase-metric`, `.showcase-cta`
- [x] 7.3 Reuse existing `.feature-nav`, `.feature-tab`, `.dashboard-preview`, `.phone-frame`, `.card`, `.grid-*` classes
- [x] 7.4 All colors use CSS variables; no hardcoded hex in styles

## 8. Dark Mode

- [x] 8.1 `[data-theme="dark"]` overrides for: .card, .showcase-problem, .showcase-metric, .dashboard-preview, .phone-frame, .feature-nav, .feature-cta, .btn-secondary, .btn-ghost, .process-step

## 9. Responsive Breakpoints

- [x] 9.1 1024px: hero grid and feature-hero collapse to single column
- [x] 9.2 768px: CTA buttons stack vertically, grid-2 collapses
- [x] 9.3 480px: phone-frame smaller (200px width)

## 10. Page-Specific Scripts

- [x] 10.1 Feature sub-nav IntersectionObserver for tab activation on scroll
- [x] 10.2 Feature sub-nav IntersectionObserver for `.stuck` shadow effect
- [x] 10.3 Tab click handlers for scroll-to-section
- [x] 10.4 No duplication of core.js logic (reveal, stagger, sticky-cta, scroll-top)

## 11. Build & Validate

- [x] 11.1 Run `npm run build` — confirm `dist/feature-showcase/index.html` generated
- [x] 11.2 Run `npm run validate` — 0 errors, 0 warnings
- [x] 11.3 Verify all placeholders resolve (title, description from site.json)
- [x] 11.4 Verify nav include and footer include rendered correctly
