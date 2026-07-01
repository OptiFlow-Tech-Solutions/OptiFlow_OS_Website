## Context

The OptiFlow OS website target audience — Indian MSME owners and business operators — needs a legally compliant Privacy Policy that explains data handling practices clearly. The page must serve both website visitors and Platform users (business customers and their employees).

The page follows the same two-column layout pattern established by the Terms & Conditions page: sticky side navigation on the left, scrollable content cards on the right. This layout is optimized for long-form legal content where users may need to jump between sections.

## Goals / Non-Goals

**Goals:**
- Serve a comprehensive privacy policy covering DPDP Act 2023, GDPR, and general data protection
- Provide section-level navigation for quick reference
- Maintain visual consistency with the design system (CSS variables, typography, spacing)
- Support both light and dark themes
- Be print-friendly for offline compliance review
- Use `{{PLACEHOLDER}}` variables from `site.json` for all company data

**Non-Goals:**
- No cookie consent banner (handled separately)
- No interactive form (contact section links to email/contact page)
- No translation/internationalization
- No dynamic content fetching

## Decisions

1. **Copy-pattern layout**: Side nav + content cards (mirrors `terms.html`). Chosen over full-width single-column to allow section jumping in long documents. Side nav hides on tablet breakpoints.

2. **Inline SVG icons**: Each section heading and grid card uses inline SVGs. Avoids icon font/CDN dependency. SVGs use `stroke="var(--accent)"` to inherit theme colors.

3. **Page-specific CSS in `<style>` block**: Content card styles, grid layouts (rights, security, cookies), side nav, reading progress bar. These are NOT in `core.css` because they apply only to legal pages. The pattern is reusable — future legal pages (e.g., refund policy) can copy the layout.

4. **Reading progress bar**: `position: fixed` bar at top with gradient (`--accent` → `--teal`). Driven by a scroll listener with `{passive: true}`. Page-specific since not all pages need it.

5. **Sticky CTA via core.js**: The "Book Demo" floating button uses `core.js` sticky CTA logic. The page only needs to render the HTML element with class `.sticky-cta`.

6. **Print stylesheet**: Hide nav, drawer, side nav, progress bar, footer. Strip colors to black/white. Prevent orphans/widows. Applied via `@media print` in page-specific styles.

## Risks / Trade-offs

- [Risk: Side nav scroll tracking may conflict with IntersectionObserver in core.js] → Mitigation: Side nav uses its own scroll listener with `{passive: true}`, operating on section bounding rects. No shared state with core.js observers.
- [Risk: New legal requirements may require section additions] → Mitigation: Content card structure is modular — add a new `<section class="content-card">` with an ID and a side nav link. No layout changes needed.
