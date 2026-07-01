## Why

The OptiFlow OS website requires a comprehensive Privacy Policy page to comply with Indian DPDP Act 2023, GDPR, and general data protection regulations. Business customers (MSMEs) handling employee data through the Platform need clear documentation of how their data is collected, used, stored, and protected.

## What Changes

- **Privacy Policy page** (`src/pages/privacy-policy.html`) — full legal compliance page with 9 content sections, sticky side navigation, reading progress bar, content cards, rights grid, security features grid, cookie classification grid, and contact section
- **site.json entry** — page metadata with title, description, and Resources nav grouping
- **Footer link** — Privacy Policy link in Resources column via shared footer partial
- **Build pipeline** — SRC_MAP entry for `privacy-policy/index.html` → `privacy-policy.html`

## Capabilities

### New Capabilities
- `legal-pages`: Privacy Policy and Terms & Conditions pages providing legal compliance documentation with side navigation, progress indicators, and content card layouts

### Modified Capabilities
<!-- No existing capability specs require requirement-level changes — privacy policy page conforms to existing marketing-pages, seo, accessibility, design-system, and shared-components specs -->

## Impact

- **Source**: `src/pages/privacy-policy.html` (497 lines), `site.json` (1 entry added)
- **Shared**: `src/partials/footer.html` (footer link), `scripts/assemble.mjs` (SRC_MAP entry)
- **Assets**: Uses `core.css` and `core.js` (no new dependencies)
- **Dist**: `dist/privacy-policy/index.html` (~43 KB assembled)
- **No API changes, no new dependencies, no breaking changes**
