## Context

The Contact & Support page serves as the primary conversion and support hub. It must handle two distinct user intents: (1) prospective customers evaluating OptiFlow who want a demo or sales conversation, and (2) existing customers seeking technical support or platform help. The page follows the standard marketing page structure with nav, content sections, and footer.

## Goals / Non-Goals

**Goals:**
- Provide a multi-channel contact surface (phone, email, WhatsApp, helpdesk, knowledge base)
- Capture qualified leads via the enquiry form with industry and team size segmentation
- Set clear response time expectations to build trust
- Maintain visual consistency with the design system
- All form submissions handled by shared `submitForm()` in core.js
- Accessible form with ARIA validation states

**Non-Goals:**
- No live chat widget
- No ticketing system backend
- No CRM integration (handled by Netlify Forms)
- No real-time form field validation server-side

## Decisions

1. **Dual-section contact channels**: Sales channels (Section 03) and Support channels (Section 04) are separate sections to differentiate pre-sale from post-sale intent. Sales channels use accent icons; support channels use teal icons.

2. **Form validation is page-specific**: `validateForm()` runs client-side before delegating to `submitForm()`. Chose page-specific over core.js because validation rules (required fields, phone format, email format) vary per form. Core.js handles the submission state machine and network call.

3. **Enquiry form fields**: 7 fields — 4 required (name, company, phone, email) for lead qualification, 3 optional (team size, industry, challenges) for lead segmentation. Industry dropdown covers 8 MSME verticals matching the target market.

4. **Trust bar with counters**: Animated count-up using core.js `data-count` functionality. Values (500+, 10,000+, 250,000+, 1,200+) provide social proof.

5. **FAQ accordion reuses core.js**: Standard `.faq-item` / `.faq-question` / `.faq-answer` structure. No custom FAQ logic.

6. **Response time cards**: 4 response categories (Sales, Support, Critical, Demo) with color-coded icons matching the design system palette. Sets clear expectations without hard guarantees.

## Risks / Trade-offs

- [Risk: Hardcoded email `support@optiflow.in` bypasses the `{{EMAIL}}` placeholder system] → Mitigation: The sales email uses `{{EMAIL}}` via `site.json`. Support email is intentionally different from the main contact email — future improvement could add `{{SUPPORT_EMAIL}}` to `site.json`.
