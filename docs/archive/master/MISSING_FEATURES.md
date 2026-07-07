# OptiFlow OS — Missing Features Register

> **Features not yet implemented or planned. Gap between current and enterprise state.**
> **Generated:** 2026-07-06

---

## Pending (17 features, ~25 hours)

These are features identified in the implementation audit that are tracked but not yet completed.

| Feature ID | Name | Category | Priority | Est. Hours | Phase |
|------------|------|----------|----------|------------|-------|
| ACC-001 | aria-hidden on decorative SVGs | Accessibility | MEDIUM | 1.5 | 05 |
| ACC-002 | Skip-to-content link consistency | Accessibility | MEDIUM | 0.5 | 05 |
| ACC-003 | ARIA labels on interactive components | Accessibility | LOW | 2.0 | 05 |
| UX-001 | Unify form component CSS | Design System | MEDIUM | 1.5 | 06 |
| UX-002 | Align container width to 1320px | Frontend | MEDIUM | 0.2 | 06 |
| UX-003 | Dark mode logo variant in nav | Frontend | LOW | 0.2 | 06 |
| UX-004 | Move page styles to core.css | Design System | MEDIUM | 4.0 | 06 |
| UX-005 | Implement breadcrumb navigation | Frontend | LOW | 1.5 | 06 |
| CNT-004 | Add proper favicon variants | Frontend | LOW | 0.3 | 07 |
| API-001 | Add API versioning prefix | API | MEDIUM | 1.0 | 08 |
| SEC-005 | Document JWT secret rotation | Security | MEDIUM | 0.3 | 08 |
| BE-001 | Integrate real calendar (Calendly) | Backend | HIGH | 2.0 | 08 |
| SEO-001 | Product + SoftwareApplication schema | SEO | MEDIUM | 0.5 | 09 |
| SEO-002 | Dynamic FAQPage structured data | SEO | MEDIUM | 1.0 | 09 |
| SEO-003 | Social media OG image (1200x630) | SEO | LOW | 0.5 | 09 |
| PERF-001 | PWA service worker | Performance | MEDIUM | 1.5 | 10 |
| PERF-002 | Print stylesheet | Performance | LOW | 0.3 | 10 |
| FE-003 | Cookie consent banner (GDPR/DPDP) | Frontend | HIGH | 1.5 | 10 |
| SEC-006 | CSP meta tag in HTML head | Security | MEDIUM | 0.3 | 10 |

*Note: IMP-0033 maps to FE-003, IMP-0034 maps to SEC-006. These are duplicates of the original IMP list.*

---

## Planned (25 features, ~140 hours)

Identified as needed for enterprise readiness but not yet in the implementation roadmap.

### Product Features (8)

| ID | Name | Priority | Est. Hours | Business Value |
|----|------|----------|------------|----------------|
| PROD-001 | WhatsApp floating button | HIGH | 1.0 | Direct customer engagement for Indian MSME audience |
| PROD-002 | Live chat widget (Tawk.to/Crisp) | MEDIUM | 2.0 | Real-time lead capture and support |
| PROD-003 | Site-wide search (Pagefind) | MEDIUM | 3.0 | Content discoverability |
| PROD-004 | Multi-language support (hi, gu) | LOW | 16.0 | Regional accessibility for Gujarati/Hindi MSMEs |
| PROD-005 | Blog/knowledge base section | MEDIUM | 8.0 | SEO content engine; authority building |
| PROD-006 | Customer portal (login, dashboard) | HIGH | 40.0 | Core product requirement |
| PROD-007 | Admin dashboard UI | HIGH | 20.0 | Business operations; submission management |
| PROD-008 | Product tour / onboarding wizard | MEDIUM | 8.0 | User adoption |

### Testing (4)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| TEST-001 | Unit tests for core.js | HIGH | 4.0 |
| TEST-002 | API integration tests | HIGH | 3.0 |
| TEST-003 | Visual regression tests | MEDIUM | 2.0 |
| TEST-004 | Load testing for API endpoints | LOW | 2.0 |

### DevOps (4)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| DEV-001 | Uptime monitoring (UptimeRobot) | HIGH | 1.0 |
| DEV-002 | Error tracking (Sentry) | MEDIUM | 2.0 |
| DEV-003 | Automated KV backups | HIGH | 1.0 |
| DEV-004 | Staging environment parity | MEDIUM | 2.0 |

### Documentation (3)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| DOC-001 | API reference (OpenAPI/Swagger) | HIGH | 3.0 |
| DOC-002 | Architecture Decision Records | MEDIUM | 2.0 |
| DOC-003 | Security runbook / incident response | MEDIUM | 2.0 |

### Security (3)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| SEC-007 | Rate limiting on admin login | HIGH | 0.5 |
| SEC-008 | Password hashing for admin (bcrypt) | HIGH | 1.0 |
| SEC-009 | Security.txt implementation | LOW | 0.3 |

### Performance (2)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| PERF-003 | Self-host Google Fonts (woff2) | MEDIUM | 1.0 |
| PERF-004 | Critical CSS inlining | LOW | 2.0 |

### SEO (1)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| SEO-004 | LocalBusiness structured data | MEDIUM | 0.5 |

---

## Out of Scope (Intentionally Not Planned)

| Feature | Reason |
|---------|--------|
| AI chatbot | Requires LLM infrastructure; not appropriate for marketing site |
| Payment gateway (Stripe/Razorpay) | Requires real product with subscription billing |
| Mobile apps (iOS/Android) | Requires product backend first |
| Third-party marketplace integrations | Requires product maturity |
| SSO / OAuth (Google, Microsoft) | Requires customer portal (PROD-006) |
| Advanced analytics (Mixpanel/Amplitude) | Overkill for current stage; Plausible sufficient |
| CDN/WAF (Cloudflare Pro) | Already behind Cloudflare free tier; upgrade when needed |

---

## Feature Backlog Summary

| Status | Count | Est. Hours |
|--------|-------|------------|
| Completed | 17 | — |
| Pending (tracked) | 17 | 25h |
| Planned (new) | 25 | 140h |
| Out of scope | 7 | — |
| **Total** | **66** | **165h remaining** |
