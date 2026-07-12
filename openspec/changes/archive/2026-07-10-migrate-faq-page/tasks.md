## 1. Backend — FAQ Feedback API

- [x] 1.1 Create `faq/` Django app with `python manage.py startapp faq`
- [x] 1.2 Add `FAQFeedback` model in `faq/models.py` (fields: `faq_item_id` IntegerField, `was_helpful` BooleanField, `created_at` DateTimeField auto_now_add)
- [x] 1.3 Create and apply migration for `FAQFeedback` model
- [x] 1.4 Register model in `faq/admin.py`
- [x] 1.5 Create `FAQFeedbackSerializer` in `faq/serializers.py` following `leads/` pattern (explicit fields list, field-level validation for `faq_item_id >= 0`)
- [x] 1.6 Create `POST /api/faq/feedback/` view in `faq/views.py` using `@api_view(["POST"])` decorator, with rate limiting (30/hr)
- [x] 1.7 Wire `faq/urls.py` and include in root `config/urls.py` under `/api/`
- [x] 1.8 Add `faq` to `INSTALLED_APPS` in `config/settings.py`
- [x] 1.9 Write unit tests for feedback endpoint (valid vote, invalid faq_item_id, missing fields, rate limit)

## 2. Shared Component — FAQAccordion

- [x] 2.1 Create `frontend/src/components/sections/FAQAccordion.tsx` using grid-rows animation pattern
- [x] 2.2 Define props: `items: Array<{ question: string; answer: ReactNode }>` and optional `className?: string`
- [x] 2.3 Export `FAQAccordion` from `frontend/src/components/index.ts` barrel
- [x] 2.4 Refactor `FAQPreview.tsx` to use `<FAQAccordion items={FAQS} />` instead of inline accordion logic; remove local `useState` and `PlusIcon`
- [x] 2.5 Refactor `PricingFAQ.tsx` to use `<FAQAccordion items={PRICING_FAQS} />` instead of inline accordion logic; remove local `useState` and `ChevronIcon`
- [x] 2.6 Verify both refactored components render and behave identically to before

## 3. Static Data — FAQ Content

- [x] 3.1 Create `frontend/src/data/faq.ts` with typed interfaces: `FAQCategory` (`id`, `name`, `slug`, `icon`, `description`), `FAQItem` (`id`, `question`, `answer`, `categorySlug`, `relatedIds`), `TroubleshootingNode`, `EscalationChannel`
- [x] 3.2 Port all 42 FAQ items from `src/pages/faq.html` into `FAQ_ITEMS` array (Product: 12, Pricing: 10, Security: 10, Implementation: 10) — preserve exact question and answer text
- [x] 3.3 Define `FAQ_CATEGORIES` array (4 categories: Product, Pricing, Security, Implementation with slugs matching `FAQItem.categorySlug`)
- [x] 3.4 Define `TROUBLESHOOTING_TREE` nested object with 5 categories (login, task, attendance, report, mobile), each with 2-3 sub-problems, each with resolution (title, desc, cta, ctaLabel)
- [x] 3.5 Define `FAQ_ESCALATION_CHANNELS` array (4 items: Book Demo, Email, WhatsApp, Call)
- [x] 3.6 Define `SEARCH_SUGGESTIONS` array (6 suggestion chip strings)
- [x] 3.7 Export all from `frontend/src/data/index.ts` barrel

## 4. FAQ Page — Search & Tabs

- [x] 4.1 Create `frontend/src/components/faq/FAQSearch.tsx` with search input, debounced filtering (200ms), results dropdown with category labels, match count, and result click handler
- [x] 4.2 Implement `highlightText()` utility: regex replaces search terms in answer HTML with `<mark>` tags (style: `background: color-mix(in oklch, var(--teal) 20%, transparent)`)
- [x] 4.3 Create `frontend/src/components/faq/FAQCategoryTabs.tsx` with 5 tabs (All, Product, Pricing, Security, Implementation), `useState<string>` active tab, count display
- [x] 4.4 Wire tabs to filter `FAQ_ITEMS` by category slug; "All" shows all 42
- [x] 4.5 Wire search to filter `FAQ_ITEMS` by question text match; clear search on tab change

## 5. FAQ Page — Help Cards & Escalation

- [x] 5.1 Create `frontend/src/components/faq/HelpCard.tsx` component (icon, title, description, CTA link) — renders 4 cards
- [x] 5.2 Create `frontend/src/components/faq/EscalationCard.tsx` component (icon, title, description, CTA button)
- [x] 5.3 Render the self-service toolbar section with 4 help cards linking to `/os/features/`, `/os/product-overview/`, `/os/demo-booking/`, and `#troubleshoot`
- [x] 5.4 Render escalation section with 4 cards: Book Demo, Email (links to contact), WhatsApp (wa.me link with `{{WHATSAPP}}` from `site.ts`), Call (tel: link with `{{PHONE}}` from `site.ts`)
- [x] 5.5 Add micro-CTA banners at the end of each FAQ category section

## 6. FAQ Page — Troubleshooting Wizard

- [x] 6.1 Create `frontend/src/components/faq/TroubleshootingWizard.tsx` with 3 cascading `<select>` elements
- [x] 6.2 First select loads categories from `TROUBLESHOOTING_TREE` keys
- [x] 6.3 Second select loads sub-problems based on selected category (disabled until category chosen)
- [x] 6.4 Third select auto-selects the resolution detail; shows resolution panel with title, description, and CTA link
- [x] 6.5 Changing category resets downstream selects to default
- [x] 6.6 Apply native `<select>` styling with CSS variables, custom dropdown arrow via `background-image` SVG

## 7. FAQ Page — Feedback

- [x] 7.1 Create `frontend/src/components/faq/FAQFeedback.tsx` with thumbs up/down buttons
- [x] 7.2 On vote click, POST to `/api/faq/feedback/` with `{ faq_item_id, was_helpful }` using `fetch()` (same pattern as `BookingForm.tsx`)
- [x] 7.3 Show thank-you message on success (replaces buttons); show follow-up links on "No" vote
- [x] 7.4 Attach feedback component below each FAQ answer in the accordion

## 8. FAQ Page — Assembly

- [x] 8.1 Rewrite `frontend/src/pages/FAQ.tsx` composing all sections: Hero with search + suggestion chips, help toolbar, category tabs, FAQ accordion list, troubleshooting wizard, escalation cards, final CTA
- [x] 8.2 Use `<Section>`, `<Container>`, `<Card>`, `<Button as={Link}>` shared components consistently
- [x] 8.3 Apply page-specific inline styles referencing CSS variables (`var(--surface)`, `var(--border)`, `var(--radius-lg)`, etc.)
- [x] 8.4 Add dark mode support (inline styles reference CSS vars which auto-switch via ThemeProvider)
- [x] 8.5 Add responsive styling (grid collapse at 768px and 480px breakpoints matching original `faq.html` media queries)
- [x] 8.6 Verify the route already exists at `/faq` in `routes.ts` (it does — currently pointing to stub)

## 9. Verification

- [x] 9.1 Verify all 42 FAQ items match original `faq.html` text content
- [x] 9.2 Test search: type "pricing" → pricing FAQs with highlights
- [x] 9.3 Test tabs: click "Pricing" → 10 pricing FAQs; click "All" → all 42
- [x] 9.4 Test troubleshooting wizard: Login → Forgot Password → reset instructions displayed
- [x] 9.5 Test feedback: click Yes/No → thank-you message, POST sends to API
- [x] 9.6 Verify responsive layout at 320px, 480px, 768px, 1024px
- [x] 9.7 Run `npm run build` in frontend (TypeScript compiles, Vite builds without errors)
- [x] 9.8 Run `npm run validate` at root (HTML validate, lint pass)
- [x] 9.9 Run backend tests: `docker compose exec api python manage.py test faq`
- [x] 9.10 Verify dark mode renders correctly
