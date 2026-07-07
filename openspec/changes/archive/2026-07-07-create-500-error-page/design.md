## Context

The 500 error page source (`src/pages/500.html`) already exists with complete structure: nav, error card (code, heading, lead text, CTA buttons), contact block, footer, analytics, dark mode, and responsiveness. However, the page was created before the 404 error page implementation (FE-001), which established the canonical shared error page pattern.

The 404 and 500 pages currently duplicate ~40 lines of identical CSS in their inline `<style>` blocks. The 500 page is structurally simpler than the 404 — no "you might be looking for" suggestions block, which is correct for a server error page.

Both pages are registered in `site.json` and mapped in `scripts/assemble.mjs` SRC_MAP. The build script processes them identically to all other pages.

## Goals / Non-Goals

**Goals:**
- Finalize the 500 page to production quality matching the 404 page's standard
- Deduplicate shared error page CSS by moving it to `assets/css/core.css`
- Ensure `npm run build` produces `dist/500.html` correctly
- Ensure `npm run validate` passes for the 500 page

**Non-Goals:**
- Changing the 500 page's content structure (no suggestions block — server errors don't need navigation suggestions)
- Adding new visual elements beyond what the error pattern calls for
- Modifying the build system
- Adding JSON-LD for error pages (not indexed, not crawled)

## Decisions

### CSS Deduplication: Move shared styles to core.css
The `.error-section`, `.error-card`, `.error-code`, `.error-actions`, and `.error-contact` classes are identical in both `500.html` and `404.html`. Moving them to `core.css` eliminates ~40 lines of duplication and ensures both pages stay synchronized.

Page-specific styles (`.error-suggestions` for 404 only) remain in each page's `<style>` block.

### 500 CTA buttons: "Go to Homepage" + "Contact Support"
The 500 page should offer "Contact Support" as its secondary CTA, not "Book a Demo" (which the 404 uses). This is already correct in the existing source. A server error isn't a marketing opportunity — users need help, not a sales pitch.

### Keep 500 structure simpler than 404
No `.error-suggestions` block. Server errors don't warrant "you might be looking for" links — users should go home or contact support. This is already correct.

## Risks / Trade-offs

- **CSS deduplication risk**: Moving styles to `core.css` increases the base CSS file by ~40 lines (negligible). The benefit (single source of truth) outweighs the cost.
- **Page-specific regression**: After moving shared styles, verify both 404 and 500 still render correctly via build + visual inspection.
- **Build mapping**: `SRC_MAP` already includes `'500.html': '500.html'` — no changes needed, but confirm the page appears at `/500/` in the dist output.
