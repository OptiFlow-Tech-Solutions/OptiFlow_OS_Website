# FAQ Accordion
- **Status:** partial | **Used On:** faq.html, pricing.html
- **Priority:** medium

## Feature IDs
- SEO-002 — dynamic FAQPage JSON-LD schema
- ACC-001 — aria-hidden
- ACC-003 — ARIA labels

## Pending Improvements
- [ ] Dynamic JSON-LD FAQPage schema generation (SEO-002)
- [ ] Full accessibility review

## Dependencies / Implementation Notes
Implemented in `assets/js/core.js` as a generic accordion component. Uses `aria-expanded` toggle, `aria-hidden` on collapsed panels, max-height CSS transition for open/close animation. FAQ data lives inline in page HTML. JSON-LD schema currently static — needs dynamic generation from page content under SEO-002.
