## Why

Prospective customers need a single destination to contact OptiFlow — for sales enquiries, product demos, support questions, and general information. The Contact & Support page consolidates all communication channels (phone, email, WhatsApp, helpdesk, knowledge base) alongside a lead-capture enquiry form, response time commitments, and office location details. This is a critical conversion point in the customer journey.

## What Changes

- **Contact page** (`src/pages/contact.html`) — full contact hub with enquiry form, sales channels (3), support channels (3), office info card, response time promises (4 categories), FAQ accordion (7 questions), trust bar with animated counters, and dual CTA sections
- **Lead capture form** — 7-field enquiry form (name, company, phone, email, team size, industry, challenges) using `submitForm()` from core.js with Netlify Forms integration
- **Page-specific validation** — `validateForm()` function for required fields, email format, and phone number format with ARIA error states
- **Site configuration** — Page listed in `site.json` with full metadata and Contact nav link

## Capabilities

### New Capabilities
- `contact-support`: Sales and support communication channels, office information, response time commitments, and contact-page-specific FAQ

### Modified Capabilities
<!-- No existing capability specs require requirement-level changes — contact page conforms to existing lead-capture (form submission), marketing-pages (page inventory), and shared-components (nav, footer, FAQ, counters) specs -->

## Impact

- **Source**: `src/pages/contact.html` (482 lines)
- **Shared**: Uses `core.js` `submitForm()` for form handling, FAQ accordion, and counter animations
- **Assets**: Uses `core.css` design system (no new dependencies)
- **Dist**: `dist/contact/index.html` (~43 KB assembled)
- **No API changes or breaking changes**
