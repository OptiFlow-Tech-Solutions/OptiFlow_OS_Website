## 1. Page Source

- [x] 1.1 Create `src/pages/contact.html` with full HTML structure, inline CSS, and page-specific JS
- [x] 1.2 Implement hero section with badge, heading, lead text, dual CTAs, chat illustration SVG, and 3 stats
- [x] 1.3 Implement enquiry form: 4 required fields (name, company, phone, email) + 3 optional (team size, industry, challenges)
- [x] 1.4 Implement page-specific `validateForm()` with field validation, email regex, phone regex, and `aria-invalid` support
- [x] 1.5 Implement success state UI with checkmark icon, message, and pulse-dot badge
- [x] 1.6 Implement sales contact channels section: Call ({{PHONE}}), Email ({{EMAIL}}), WhatsApp ({{PHONE}})
- [x] 1.7 Implement support contact channels section: Support Email, Helpdesk Portal, Knowledge Base
- [x] 1.8 Implement office info card with location ({{LOCATION}}), phone ({{PHONE}}), email ({{EMAIL}}), hours, and open badge
- [x] 1.9 Implement response time commitment cards: Sales, Support, Critical, Demo (4 cards with color-coded icons)
- [x] 1.10 Implement trust bar with 4 animated counters (500, 10000, 250000, 1200) using data-count
- [x] 1.11 Implement contact-specific FAQ accordion with 7 questions
- [x] 1.12 Implement final dual CTA section
- [x] 1.13 Add dark mode overrides for all page-specific components
- [x] 1.14 Add responsive breakpoints (1024px, 768px, 480px)

## 2. Form Integration

- [x] 2.1 Configure form with `data-netlify="true"` and `name="contact"`
- [x] 2.2 Use core.js `submitForm()` for form submission (no custom fetch/XHR)
- [x] 2.3 Integrate form with `<div class="form-error-msg">` and `<button class="form-error-retry">` for error/retry states
- [x] 2.4 Add `:user-invalid`/`:user-valid` CSS pseudo-class support for real-time validation feedback

## 3. Shared Component Usage

- [x] 3.1 Use `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->` includes
- [x] 3.2 Use `{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}`, `{{PHONE}}`, `{{EMAIL}}`, `{{LOCATION}}` placeholders
- [x] 3.3 Use core.css for all CSS variables and core.js for FAQ accordion, counter animations, scroll reveal
- [x] 3.4 Use `.faq-item`/`.faq-question`/`.faq-answer` pattern for FAQ (no custom accordion logic)
- [x] 3.5 Use `data-count` attributes for trust bar counter animations

## 4. Verification

- [x] 4.1 Run `npm run build` — confirm contact page assembles without errors
- [x] 4.2 Run `npm run validate` — confirm no link errors, SEO issues, or data consistency warnings for contact page
- [x] 4.3 Verify all `{{PLACEHOLDER}}` variables resolve to correct values in assembled output
- [x] 4.4 Verify form submits via core.js `submitForm()` (not page-specific fetch)
