# OptiFlow OS Website — Route Map

**Version:** 1.0.0 | **Date:** 2026-07-09

## Public Routes (React SPA)

| # | Route | Page Component | Description | Status |
|---|-------|---------------|-------------|--------|
| 1 | `/os/` | HomePage | Landing page with hero, problems, features, testimonials | Planned |
| 2 | `/os/problem-solutions/` | ProblemSolutionsPage | Industry pain points and OptiFlow solutions | Planned |
| 3 | `/os/product-overview/` | ProductOverviewPage | Full platform tour with architecture diagram | Planned |
| 4 | `/os/features/` | FeaturesPage | 11 feature deep-dives with sticky nav | Planned |
| 5 | `/os/feature-showcase/` | FeatureShowcasePage | 6 before/after transformations | Planned |
| 6 | `/os/why-optiflow/` | WhyOptiflowPage | Conviction page with comparisons and ROI | Planned |
| 7 | `/os/pricing/` | PricingPage | 3-tier plans, ROI calculator, comparison matrix | Planned |
| 8 | `/os/newsletter/` | NewsletterPage | Blog listing with category filters | Planned |
| 9 | `/os/newsletter/:slug/` | ArticleDetailPage | Single article with progress bar | Planned |
| 10 | `/os/faq/` | FAQPage | Searchable FAQ with troubleshooting wizard | Planned |
| 11 | `/os/contact/` | ContactPage | Contact form with sales/support channels | Planned |
| 12 | `/os/demo-booking/` | DemoBookingPage | Demo booking form with calendar widget | Planned |
| 13 | `/os/privacy-policy/` | PrivacyPolicyPage | Privacy policy with reading progress bar | Planned |
| 14 | `/os/terms/` | TermsPage | Terms & conditions with reading progress bar | Planned |
| 15 | `/os/competitive-positioning/` | CompetitivePositioningPage | 2x2 quadrant + feature matrix + cost comparison | Planned |
| 16 | `/os/careers/` | CareerPage | Job listings with company culture | Planned |
| 17 | `/os/careers/:slug/` | JobDetailPage | Single job with application form | Planned |
| 18 | `/os/search/` | SearchResultsPage | Full-text search results | Planned |
| 19 | `/os/page/:slug/` | CMSPage | Dynamic CMS-driven page | Planned |
| 20 | `/os/*` | NotFoundPage | 404 error page | Planned |

## Admin Routes (React, Auth Protected)

| # | Route | Component | Description | Role |
|---|-------|-----------|-------------|------|
| 21 | `/admin/` | AdminDashboard | KPI widgets, charts, activity feed | All |
| 22 | `/admin/login/` | LoginPage | Admin login form | Public |
| 23 | `/admin/forgot-password/` | ForgotPasswordPage | Password reset request | Public |
| 24 | `/admin/reset-password/` | ResetPasswordPage | Set new password | Public |
| 25 | `/admin/leads/` | LeadListPage | Filterable lead table | Admin+ |
| 26 | `/admin/leads/:id/` | LeadDetailPage | Lead detail + activity timeline | Admin+ |
| 27 | `/admin/articles/` | ArticleListPage | Article management list | Editor+ |
| 28 | `/admin/articles/new/` | ArticleEditorPage | New article editor | Editor+ |
| 29 | `/admin/articles/:id/edit/` | ArticleEditorPage | Edit article | Editor+ |
| 30 | `/admin/pages/` | PageListPage | CMS page list | Editor+ |
| 31 | `/admin/pages/new/` | PageBuilderPage | New page builder | Editor+ |
| 32 | `/admin/pages/:id/edit/` | PageBuilderPage | Edit page | Editor+ |
| 33 | `/admin/campaigns/` | CampaignListPage | Newsletter campaigns | Editor+ |
| 34 | `/admin/campaigns/new/` | CampaignEditorPage | Campaign composer | Editor+ |
| 35 | `/admin/subscribers/` | SubscriberManagerPage | Subscriber list + import | Editor+ |
| 36 | `/admin/users/` | UserManagementPage | User list | Super Admin |
| 37 | `/admin/users/new/` | UserEditorPage | Create user | Super Admin |
| 38 | `/admin/users/:id/` | UserDetailPage | User detail | Super Admin |
| 39 | `/admin/roles/` | RoleManagementPage | Role CRUD | Super Admin |
| 40 | `/admin/settings/` | SiteSettingsPage | Site configuration | Super Admin |
| 41 | `/admin/seo/` | SEOManagerPage | SEO management | Admin+ |
| 42 | `/admin/analytics/` | AnalyticsDashboard | Business analytics | Admin+ |
| 43 | `/admin/faq/` | FAQManagerPage | FAQ CRUD | Editor+ |
| 44 | `/admin/testimonials/` | TestimonialManagerPage | Testimonial CRUD | Editor+ |
| 45 | `/admin/resources/` | ResourceManagerPage | Resource management | Editor+ |
| 46 | `/admin/navigation/` | NavigationManagerPage | Nav structure editor | Admin+ |
| 47 | `/admin/orders/` | OrderListPage | Payment orders | Admin+ |
| 48 | `/admin/invoices/` | InvoiceListPage | Invoice history | Admin+ |
| 49 | `/admin/meetings/` | MeetingListPage | Meeting bookings | Admin+ |
| 50 | `/admin/jobs/` | JobListPage | Job postings | Admin+ |
| 51 | `/admin/jobs/:id/applications/` | ApplicationListPage | Applications per job | Admin+ |
| 52 | `/admin/announcements/` | AnnouncementManagerPage | Banner management | Admin+ |
| 53 | `/admin/chat/` | ChatConversationListPage | Chatbot conversations | Admin+ |
| 54 | `/admin/ab-tests/` | ABTestListPage | A/B test management | Admin+ |
| 55 | `/admin/exports/` | DataExportPage | Data exports | Admin+ |
| 56 | `/admin/backups/` | BackupStatusPage | Backup management | Super Admin |
| 57 | `/admin/logs/` | LogViewerPage | Error logs | Admin+ |
| 58 | `/admin/profile/` | ProfilePage | User profile settings | All |

## Static Routes (Nginx)

| Route | Purpose |
|-------|---------|
| `/sitemap.xml` | Dynamic XML sitemap |
| `/robots.txt` | Dynamic robots.txt |
| `/health` | Health check endpoint |
| `/.well-known/security.txt` | Security contact info |

## Legacy Redirects (301)

| From | To |
|------|-----|
| `/pricing/` | `/os/pricing/` |
| `/features/` | `/os/features/` |
| `/contact/` | `/os/contact/` |
| `/faq/` | `/os/faq/` |
| `/blog/` | `/os/newsletter/` |
| `/about/` | `/os/why-optiflow/` |
| `/demo/` | `/os/demo-booking/` |
| All root `/<page>/` | All redirect to `/os/<page>/` |
