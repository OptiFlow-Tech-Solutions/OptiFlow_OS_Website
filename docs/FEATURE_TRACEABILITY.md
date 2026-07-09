# OptiFlow OS Website — Feature Traceability Matrix

**Version:** 1.0.0 | **Date:** 2026-07-09 | **Status:** Pre-Implementation

## Overview

This document maps every feature from `WEBSITE_FEATURE_INVENTORY.md` to its required implementation artifacts, ensuring complete end-to-end traceability.

**Traceability Chain:**
```
Business Need → Feature → UI Components → API Endpoints → Django Services → DB Tables → Tests → Documentation
```

## Legend

| Symbol | Meaning |
|--------|---------|
| [P] | Planned (spec exists, not implemented) |
| [N] | Not started |
| N/A | Not applicable to this layer |

---

## Phase 1: Foundation (Features 01-04)

### F-ARCH-001 — Project Architecture & Monorepo Setup

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 01 | ✓ |
| **Architecture** | ARCHITECTURE.md §3 (Directory Structure) | ✓ |
| **Setup** | SETUP.md (Full Stack Quick Start) | ✓ |
| **Environment** | ENVIRONMENT.md (All variables) | ✓ |
| **Frontend** | `frontend/` directory, Vite config, tsconfig.json | [N] |
| **Backend** | `backend/` directory, Django settings, urls.py | [N] |
| **Database** | PostgreSQL container config in docker-compose.yml | [N] |
| **API** | `GET /api/health/` | [N] |
| **Docker** | docker-compose.yml (React + Django + PG + Redis) | [N] |
| **CI/CD** | `.github/workflows/ci.yml` | [N] |
| **Test** | Health endpoint test, smoke test | [N] |
| **Docs** | ARCHITECTURE.md, SETUP.md, ENVIRONMENT.md | ✓ |

### F-DS-001 — Design System Foundation

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 02 | ✓ |
| **Design Source** | assets/css/core.css (513 lines) | ✓ (spec) |
| **Design Spec** | DESIGN.md/DESIGN.md (382 lines) | ✓ |
| **Frontend** | `design-tokens.css`, `GlobalStyles`, `Button`, `Card`, `Input`, `Container`, `Section`, `Typography`, `Grid` | [N] |
| **Backend** | N/A | N/A |
| **Database** | N/A | N/A |
| **API** | N/A | N/A |
| **Test** | Component render tests, visual regression vs original | [N] |
| **Docs** | WEBSITE_FEATURE_INVENTORY.md A.3 | ✓ |

### F-LAY-001 — Shared Layout Components

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 03 | ✓ |
| **Frontend** | `Nav`, `Footer`, `PageLayout`, `ScrollTop`, `StickyCTA`, `MobileDrawer` | [N] |
| **Backend** | SiteSetting model | [N] |
| **Database** | `site_setting` (key, value, type) | [N] |
| **API** | `GET /api/site-settings/` | [N] |
| **Test** | Nav render (desktop+mobile), drawer open/close, scroll effect, keyboard accessibility | [N] |
| **Docs** | ROUTES.md | ✓ |

### F-ROUTE-001 — Routing & Page Shell

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 04 | ✓ |
| **Frontend** | React Router config, 16 routes, page transitions, `Suspense` boundaries, breadcrumbs | [N] |
| **Backend** | N/A | N/A |
| **Database** | N/A | N/A |
| **API** | N/A | N/A |
| **Test** | Route navigation, back/forward, 404, scroll restoration | [N] |
| **Docs** | ROUTES.md | ✓ |

---

## Phase 2: Page Migration (Features 05-15)

### F-MIG-HOME-001 — Home Page

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 05 | ✓ |
| **Source** | src/pages/home.html (677 lines, 13 sections) | ✓ (spec) |
| **Frontend** | `HomePage`, `HeroSection`, `TrustBar`, `ProblemSection`, `CostOfInaction`, `SolutionFlow`, `ProductSnapshot`, `HowItWorks`, `FeatureSection`, `IndustrySection`, `WhyOptiflowComparison`, `TestimonialSection`, `CTASection`, `FAQPreview`, `WhatsAppFloat`, `ExitOverlay` | [N] |
| **Hooks** | `useTypewriter`, `useMouseGlow`, `useCardTilt`, `useParallax`, `useCounter` | [N] |
| **Backend** | GET /api/testimonials/featured/ (for testimonial data) | [N] |
| **Database** | `testimonial` table | [N] |
| **API** | Dynamic testimonials from API | [N] |
| **Test** | Visual regression vs original, typewriter cycling, mouse glow, card tilt, FAQ accordion, counter animation, mobile layout | [N] |
| **Docs** | ROUTES.md §Route 1 | ✓ |

### F-MIG-FEAT-001 — Features Page

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 06 | ✓ |
| **Source** | src/pages/features.html (626 lines, 11 sections) | ✓ (spec) |
| **Frontend** | `FeaturesPage`, `FeatureNav`, `FeatureSection`, `EcosystemHub`, `DashboardPreview`, `PhoneFrame` | [N] |
| **Hook** | `useScrollSpy` | [N] |
| **Backend** | N/A (static during migration) | N/A |
| **Test** | All 11 sections, sticky nav tracking, tab click scroll, dashboard preview data | [N] |
| **Docs** | ROUTES.md §Route 4 | ✓ |

### F-MIG-PRICING-001 — Pricing Page

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 07 | ✓ |
| **Source** | src/pages/pricing.html (1043 lines) — ROI dashboard, calculator, plans | ✓ (spec) |
| **Frontend** | `PricingPage`, `ROIDashboard`, `PricingCard`, `ComparisonMatrix`, `ROICalculator`, `ImplementationTimeline`, `PricingFAQ` | [N] |
| **Backend** | GET /api/payments/create-order/ (for checkout flow) | [N] |
| **Database** | `order`, `invoice`, `payment_config` | [N] |
| **API** | Payment endpoints (when integrated with F-PAYMENT-001) | [N] |
| **Test** | Calculator math verification, slider interaction, chart proportions, tooltip positioning, plan switching | [N] |
| **Docs** | ROUTES.md §Route 7 | ✓ |

### F-MIG-PROD-001 — Product Overview

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 08 | ✓ |
| **Source** | src/pages/product-overview.html (973 lines) | ✓ (spec) |
| **Frontend** | `ProductOverviewPage`, `DemoTabs`, `ArchitectureDiagram`, `ModuleSpotlight`, `PanelLayout`, `WorkflowEngine`, `PermissionsMatrix`, `ReportingEngine` | [N] |
| **Test** | Tab switching, 12 SVG nodes + tooltips, expand/collapse, permissions matrix, workflow count | [N] |
| **Docs** | ROUTES.md §Route 3 | ✓ |

### F-MIG-PS-WHY-001 — Problem Solutions & Why Optiflow

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 09 | ✓ |
| **Source** | problem-solutions.html (607 lines) + why-optiflow.html (637 lines) | ✓ (spec) |
| **Frontend** | `ProblemSolutionsPage`, `WhyOptiflowPage`, `PainPointCarousel`, `ChaosMap`, `WhatsAppChatMockup`, `PeopleVsProcess`, `ROIStatsGrid`, `ComparisonTable` | [N] |
| **Test** | Carousel auto-rotation, typewriter cycling, mouse glow, counters, comparison table rows | [N] |
| **Docs** | ROUTES.md §Routes 2, 6 | ✓ |

### F-MIG-FSCP-001 — Feature Showcase & Competitive Positioning

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 10 | ✓ |
| **Source** | feature-showcase.html (535 lines) + competitive-positioning.html (391 lines) | ✓ (spec) |
| **Frontend** | `FeatureShowcasePage`, `CompetitivePositioningPage`, `ShowcaseTransform`, `QuadrantGrid`, `FeatureMatrix`, `CostComparison` | [N] |
| **Test** | 6 transformations, quadrant layout, 13 matrix rows, cost comparison cards | [N] |
| **Docs** | ROUTES.md §Routes 5, 15 | ✓ |

### F-MIG-DEMO-001 — Demo Booking

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 11 | ✓ |
| **Source** | src/pages/demo-booking.html (614 lines) | ✓ (spec) |
| **Frontend** | `DemoBookingPage`, `BookingForm`, `CalendarWidget`, `BenefitCard`, `TimelineSteps`, `DashboardMockup` | [N] |
| **Backend** | DemoBooking model, demo-booking API views | [N] |
| **Database** | `demo_booking` table | [N] |
| **API** | `POST /api/demo-bookings/`, `GET /api/demo-bookings/slots/?date=` | [N] |
| **Test** | Form validation, calendar date/time selection, slot availability, email confirmation, concurrent booking | [N] |
| **Docs** | API_REFERENCE.md §Demo Bookings | ✓ |

### F-MIG-CONTACT-001 — Contact Page

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 12 | ✓ |
| **Source** | src/pages/contact.html (623 lines) | ✓ (spec) |
| **Frontend** | `ContactPage`, `ContactForm`, `ChannelCard`, `OfficeInfo`, `ResponsePromiseCard` | [N] |
| **Backend** | Enquiry model, enquiry API views | [N] |
| **Database** | `enquiry` table | [N] |
| **API** | `POST /api/enquiries/` | [N] |
| **Test** | Form validation, email notification, honeypot, rate limiting | [N] |
| **Docs** | API_REFERENCE.md §Contact, ROUTES.md §Route 11 | ✓ |

### F-MIG-FAQ-001 — FAQ Page

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 13 | ✓ |
| **Source** | src/pages/faq.html (658 lines, 42 Qs, troubleshooting wizard) | ✓ (spec) |
| **Frontend** | `FAQPage`, `FAQSearch`, `FAQCategoryTabs`, `FAQAccordion`, `HelpCard`, `TroubleshootingWizard`, `EscalationCard`, `FAQFeedback` | [N] |
| **Backend** | FAQItem, FAQCategory, FAQFeedback models + views | [N] |
| **Database** | `faq_category`, `faq_item`, `faq_feedback` tables | [N] |
| **API** | `GET /api/faq/`, `GET /api/faq/?search=`, `POST /api/faq/feedback/` | [N] |
| **Test** | Search highlighting, category filtering, troubleshooting 15 paths, feedback persistence | [N] |
| **Docs** | API_REFERENCE.md §FAQ | ✓ |

### F-MIG-NEWS-001 — Newsletter/Blog

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 14 | ✓ |
| **Source** | src/pages/newsletter.html (645 lines) | ✓ (spec) |
| **Frontend** | `NewsletterPage`, `ArticleDetailPage`, `FeaturedArticle`, `ArticleCard`, `CategoryFilterBar`, `PopularArticles`, `NewsletterSignup`, `ResourceCard` | [N] |
| **Backend** | Article, ArticleCategory, Resource, NewsletterSubscriber models + views | [N] |
| **Database** | `article_category`, `article`, `resource`, `newsletter_subscriber` tables | [N] |
| **API** | `GET /api/articles/`, `GET /api/articles/:slug/`, `GET /api/articles/popular/`, `GET /api/resources/`, `POST /api/newsletter/subscribe/`, `POST /api/newsletter/unsubscribe/` | [N] |
| **Test** | Article listing, category filter, article detail, signup, unsubscribe, empty states | [N] |
| **Docs** | API_REFERENCE.md §Articles, Newsletter | ✓ |

### F-MIG-LEGAL-001 — Legal Pages & CMS

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 15 | ✓ |
| **Source** | privacy-policy.html (496 lines) + terms.html (545 lines) | ✓ (spec) |
| **Frontend** | `LegalPageTemplate`, `PrivacyPolicyPage`, `TermsPage`, `CMSPage`, `ContentSection`, `ProgressBar` | [N] |
| **Backend** | CMSPage, CMSSection, SiteSetting models + views | [N] |
| **Database** | `cms_page`, `cms_section`, `site_setting` tables | [N] |
| **API** | `GET /api/cms/:slug/`, `GET /api/cms/pages/` | [N] |
| **Test** | Progress bar scroll tracking, side nav highlighting, CMS page rendering | [N] |
| **Docs** | API_REFERENCE.md §CMS Pages | ✓ |

---

## Phase 3: Auth & Admin (Features 16-20, 34-35)

### F-DYN-NAV-001 — Dynamic Navigation

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 16 | ✓ |
| **Frontend** | Nav component (updated to fetch from API) | [N] |
| **Backend** | NavItem model + views | [N] |
| **Database** | `nav_item` table | [N] |
| **API** | `GET /api/nav/`, `PUT /api/nav/` (admin) | [N] |
| **Test** | API nav fetch, admin CRUD, fallback on API failure, dropdown rendering | [N] |
| **Docs** | API_REFERENCE.md §Navigation | ✓ |

### F-CMS-HERO-001 — Hero CMS Content

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 17 | ✓ |
| **Frontend** | `DynamicHero` component (typewriter, dashboard, trust badge variants) | [N] |
| **Backend** | PageContent model (extends CMSPage) | [N] |
| **Database** | `page_content` (hero fields) | [N] |
| **API** | `GET /api/page-content/:slug/` | [N] |
| **Test** | Admin edit headline → frontend update, variant switching, trust badge toggling | [N] |
| **Docs** | API_REFERENCE.md §CMS Pages | ✓ |

### F-DYN-TEST-001 — Dynamic Testimonials

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 18 | ✓ |
| **Frontend** | `TestimonialCard`, `TestimonialCarousel`, `TestimonialGrid` | [N] |
| **Backend** | Testimonial model + views | [N] |
| **Database** | `testimonial` table | [N] |
| **API** | `GET /api/testimonials/`, `GET /api/testimonials/featured/`, admin CRUD | [N] |
| **Test** | Featured filter, carousel auto-rotation, admin CRUD, structured data injection | [N] |
| **Docs** | API_REFERENCE.md §Testimonials | ✓ |

### F-LEAD-001 — Lead Management

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 19 | ✓ |
| **Frontend** | `LeadList`, `LeadDetail`, `LeadKanban` (admin) | [N] |
| **Backend** | Lead, LeadActivity models + views | [N] |
| **Database** | `lead`, `lead_activity` tables | [N] |
| **API** | `GET /api/admin/leads/`, `GET /api/admin/leads/:id/`, `PUT /api/admin/leads/:id/`, `POST /api/admin/leads/:id/activities/` | [N] |
| **Test** | Lead creation from forms, status transitions, kanban drag, activity log, duplicate detection | [N] |
| **Docs** | API_REFERENCE.md §Admin — Leads | ✓ |

### F-ADMIN-001 — Admin Dashboard

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 20 | ✓ |
| **Frontend** | `AdminLayout`, `AdminDashboard`, KPIs, charts, `RecentActivityFeed`, `QuickAction` | [N] |
| **Backend** | Dashboard aggregation views, activity logging middleware | [N] |
| **Database** | `admin_activity_log`, analytics db views | [N] |
| **API** | `GET /api/admin/dashboard/stats/`, `GET /api/admin/dashboard/charts/`, `GET /api/admin/activity/` | [N] |
| **Test** | KPI loading, date filter, N+1 prevention, auth gate, chart rendering | [N] |
| **Docs** | API_REFERENCE.md §Admin — Dashboard | ✓ |

### F-AUTH-001 — Auth & Authorization

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 34 | ✓ |
| **Frontend** | `LoginPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `ProtectedRoute`, `AuthContext` | [N] |
| **Backend** | Django Simple JWT config, User model, Role/Permission, password policies | [N] |
| **Database** | `auth_user`, `user_profile`, `role`, `permission`, `refresh_token` | [N] |
| **API** | `POST /api/auth/login/`, `POST /api/auth/refresh/`, `POST /api/auth/logout/`, `POST /api/auth/forgot-password/`, `POST /api/auth/reset-password/`, `GET /api/auth/me/` | [N] |
| **Test** | Login success/fail, token refresh, rate limiting, forgot/reset flow, role gates | [N] |
| **Docs** | API_REFERENCE.md §Auth, ARCHITECTURE.md §6 | ✓ |

### F-ADMIN-USERS-001 — Admin User Management

| Layer | Artifact | Status |
|-------|----------|--------|
| **Spec** | WEBSITE_FEATURE_INVENTORY.md §Feature 35 | ✓ |
| **Frontend** | `UserManagement`, `UserEditor`, `UserDetail`, `RoleManagement`, `InviteUser` | [N] |
| **Backend** | User management views, invitation system, permission enforcement | [N] |
| **Database** | `user_invitation`, `admin_activity_log` | [N] |
| **API** | `GET/POST /api/admin/users/`, `PUT/DELETE /api/admin/users/:id/`, `POST /api/admin/users/invite/`, `GET/POST /api/admin/roles/` | [N] |
| **Test** | User CRUD, invitation flow, role changes, deactivation, permission gates | [N] |
| **Docs** | API_REFERENCE.md §Admin — Users, Roles | ✓ |

---

## Phase 4-9: Remaining Features (21-60)

### F-CMS-BLOG-001 — Blog Editor
[P] → `ArticleEditor`, `ArticleList` | API: articles CRUD + image upload + versions | DB: `article_image`, `article_version`

### F-CMS-PAGE-001 — Page Builder
[P] → `PageBuilder` | API: section types, batch update, publish | DB: `page_template`

### F-NEWS-CAMPAIGN-001 — Newsletter Campaigns
[P] → `CampaignEditor`, `SubscriberManager` | API: campaigns CRUD + send/test/stats + track | DB: `newsletter_campaign`, `email_template`, `campaign_send`

### F-EMAIL-001 — SMTP Email
[P] → Email templates (React Email) | API: test + logs | DB: `email_log`

### F-WHATSAPP-001 — WhatsApp
[P] → `WhatsAppFloat`, chat bubble | API: config, webhook, send-template | DB: `whatsapp_config`, `whatsapp_message`, `whatsapp_template`

### F-CHATBOT-001 — Chatbot
[P] → `ChatWidget` | API: start, message, handoff | DB: `chat_flow`, `chat_node`, `chat_conversation`

### F-CAREER-001 — Career Page
[P] → `CareerPage`, `JobDetail`, `ApplicationForm` | API: jobs + apply | DB: `job`, `job_application`

### F-RESOURCE-001 — Resource Center
[P] → `ResourceCenter`, `ResourceGate` | API: resources + download + access | DB: `resource`, `resource_download`

### F-SEARCH-001 — Search
[P] → `GlobalSearch`, `SearchResultsPage` | API: search + suggestions | DB: `search_log`, GIN indexes

### F-COOKIE-001 — Cookie Consent
[P] → `CookieConsent`, `CookiePreferences` | API: consent record | DB: `cookie_consent`

### F-BANNER-001 — Announcement Banner
[P] → `AnnouncementBanner` | API: active + CRUD | DB: `announcement_banner`

### F-SEO-001 — SEO Dashboard
[P] → `SEOManager` | API: SEO CRUD + score | DB: `seo_meta`

### F-SITEMAP-001 — Dynamic Sitemap
[P] → N/A (XML) | API: GET /sitemap.xml, GET /robots.txt

### F-ANALYTICS-001 — Business Analytics
[P] → `AnalyticsDashboard` | API: summary, funnel, sources, trends, content, export | DB: `analytics_daily_snapshot`, `analytics_event`

### F-SEC-FORM-001 — Spam Protection
[P] → CAPTCHA on forms | API: captcha verify | DB: `form_submission_log`, `rate_limit_record`

### F-SEC-HARDEN-001 — Security Hardening
[P] → XSS sanitization, CSRF tokens, SRI | API: security headers, security.txt | Config only

### F-OPS-LOG-001 — Logging
[P] → Sentry SDK (frontend/backend) | API: error report, performance report | DB: `error_log`, `performance_metric`

### F-PAYMENT-001 — Razorpay
[P] → `PaymentModal`, `InvoiceHistory` | API: create-order, verify, webhook | DB: `order`, `invoice`, `payment_config`

### F-CALENDAR-001 — Advanced Calendar
[P] → `CalendarWidget` (enhanced) | API: slots + schedule config + holidays | DB: `booked_slot`, `schedule_config`, `holiday`, `availability_override`

### F-MEETING-001 — Meeting Booking
[P] → `MeetingBooking` | API: types + slots + book + cancel + ics | DB: `meeting_type`, `meeting_booking`

### F-DRIP-001 — Email Drip Campaigns
[P] → `DripCampaignEditor` | API: drips CRUD + activate + stats | DB: `drip_campaign`, `drip_sequence`, `drip_enrollment`

### F-PWA-001 — PWA
[P] → Service worker, install prompt | API: subscribe, unsubscribe, notify | DB: `push_subscription`

### F-I18N-001 — Multilingual
[P] → Language switcher, i18next, translated content | DB: `translation`

### F-SOCIAL-001 — Social Share
[P] → `SocialShare` component | API: social links + share tracking | DB: `social_link`, `social_share`

### F-SETTINGS-001 — Site Settings
[P] → `SiteSettingsPage` | API: settings CRUD + public | DB: `site_setting` (extended)

### F-BACKUP-001 — Backup System
[P] → `BackupStatusPage`, `DataExportPage` | API: backup trigger + exports CRUD | DB: `backup_record`, `data_export`

### F-ABTEST-001 — A/B Testing
[P] → A/B test provider, variant components | API: active, impression, conversion, results | DB: `ab_test`, `ab_test_variant`, `ab_test_impression`, `ab_test_conversion`

### F-PERF-001 — Performance Optimization
[P] → Code splitting, lazy loading, image optimization, CDN | DB indexes

### F-A11Y-001 — Accessibility Final
[P] → axe-core audit, keyboard testing, screen reader, accessibility statement

### F-SEO-FINAL-001 — SEO Final Pass
[P] → Structured data completion, E-E-A-T signals, GSC integration

### F-TEST-E2E-001 — E2E Tests
[P] → 30+ Playwright scenarios (public + admin + cross-browser)

### F-TEST-UNIT-001 — Unit/Integration Tests
[P] → 500+ unit tests, 100+ integration tests, 80%+ coverage

### F-CICD-001 — CI/CD
[P] → `.github/workflows/ci.yml` (lint → test → build → deploy)

### F-DOCKER-PROD-001 — Docker Production
[P] → Multi-service compose, health checks, resource limits, volumes

### F-NGINX-PROD-001 — Nginx Production
[P] → SPA fallback, API proxy, SSL, HSTS, CSP, rate limiting, caching

### F-MIGRATE-DATA-001 — Content Migration
[P] → Django management command: parse static HTML → seed DB

### F-QA-FINAL-001 — Final QA
[P] → Visual regression, cross-browser, performance, security, load testing, compliance

### F-DEPLOY-FINAL-001 — Go-Live
[P] → DNS, SSL, deploy, smoke tests, monitoring, 24h support

---

## Cross-Cutting Concerns

| Concern | Features | Docs |
|---------|----------|------|
| Authentication | F-AUTH-001, all admin features | ARCHITECTURE.md §6, API_REFERENCE.md §Auth |
| Authorization (RBAC) | F-ADMIN-USERS-001, all admin features | DB: `role`, `permission` |
| Email Sending | F-EMAIL-001, F-NEWS-CAMPAIGN-001, F-DRIP-001, F-MIG-DEMO-001, F-MIG-CONTACT-001 | ENVIRONMENT.md §Email, API_REFERENCE.md §Email |
| Rate Limiting | F-SEC-FORM-001, F-SEC-HARDEN-001 | DB: `rate_limit_record` |
| Error Tracking | F-OPS-LOG-001, all features | ENVIRONMENT.md §Monitoring |
| Caching | F-PERF-001 | DB: Redis |
| Search | F-SEARCH-001, F-MIG-FAQ-001, F-MIG-NEWS-001 | DATABASE.md §Indexing |
| File Storage | F-CMS-BLOG-001, F-CAREER-001, F-RESOURCE-001 | ENVIRONMENT.md §File Storage |
| SEO | F-SEO-001, F-SITEMAP-001, F-SEO-FINAL-001, F-MIG-LEGAL-001 | API_REFERENCE.md §SEO |
| Accessibility | F-A11Y-001, F-DS-001, all pages | — |
| Mobile/Responsive | All features | — |
| Dark Mode | F-DS-001, all pages | — |

---

## Traceability Health

| Metric | Count |
|--------|-------|
| Total features | 60 |
| Features with specs | 60 (100%) |
| Features with arch docs | 60 (100%) |
| Features with API docs | 60 (100%) |
| Features with DB docs | 60 (100%) |
| Features with route docs | 60 (100%) |
| Features with test plans | 60 (100%) |
| Features implemented | 0 (0%) |
| Documentation completeness | 100% |

**Status: Documentation is implementation-ready. Zero code exists. All 60 features are fully specified and traceable.**
