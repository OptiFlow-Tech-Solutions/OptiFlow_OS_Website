## Proposal: Cookie Consent & Privacy Compliance (UI-005)

### Rationale

The OptiFlow OS website uses localStorage for theme preference, admin authentication, and FAQ feedback. While Plausible Analytics is privacy-first and requires no cookie consent, the site must display a cookie consent banner to comply with Indian DPDP Act 2023 and GDPR transparency requirements. This was explicitly scoped as a non-goal in the legal-pages change (LEGAL-001) and deferred to this feature.

### Scope

**In scope:**
- Cookie consent banner (fixed bottom bar) injected on all pages
- Three-tier consent: Accept All, Reject Non-Essential, Customize
- Manage Preferences modal with category toggles (Essential always on)
- localStorage persistence of consent choice
- Light mode + dark mode support (CSS variables)
- Responsive: desktop, tablet, mobile
- WCAG 2.2 Level AA accessible
- Reopenable via a "Cookie Settings" link in the footer

**Out of scope:**
- Dynamic cookie scanning/auto-classification
- Script blocking/mutation observer (no tracking scripts to block)
- CMP integration (OneTrust, Cookiebot)
- Geo-targeted consent (GDPR vs DPDP Act variants)
- Consent logging/audit trail

### Verification

1. `npm run build` passes for all pages
2. `npm run validate` passes
3. Banner appears on first visit, hidden on subsequent visits
4. Consent stored in `localStorage.optiflow-cookie-consent`
5. "Cookie Settings" link in footer reopens preferences
6. E2E: banner renders, accept works, settings modal toggles function
