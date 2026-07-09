## Why

The contact page is the primary inbound lead generation channel for OptiFlow OS. The current static HTML page (`src/pages/contact.html`, 623 lines) must be migrated to the React + Django stack to unblock the full static-to-SPA migration. This page includes a 7-field contact form, sales/support channel cards, office information, response time promises, and FAQ — all of which need API-backed submission and componentized rendering.

## What Changes

- **New React components**: `ContactForm` (7 fields + honeypot + client-side validation + submission states), `ChannelCard` (icon + title + detail + action link for sales/support channels), `OfficeInfo` (address + hours + status badge), `ResponsePromiseCard` (icon + title + timeframe description)
- **New React page**: `ContactPage` composing all sections (Hero, Form, Channels, Office, Response Promises, Trust Bar, FAQ, Final CTA) using existing shared components (`Section`, `Card`, `Button`, `TrustBar`, `CTASection`, `FAQPreview`)
- **New Django model**: `Enquiry` in the existing `leads` app — name, company, phone, email, team_size, industry, challenges, type (SALES/SUPPORT/PARTNERSHIP), status (NEW/REPLIED/RESOLVED), timestamps
- **New API endpoint**: `POST /api/enquiries/` with validation, honeypot spam protection, email notification, and DRF throttle-based rate limiting
- **New API endpoint**: `GET /api/enquiries/` (admin-only list, future)
- **Contact page route**: wired to `/contact` in React Router (route already scaffolded in `routes.ts`)

## Capabilities

### New Capabilities
- `contact-page`: Full contact page composition — hero, form, channel cards, office info, response promises, trust bar, FAQ, CTA
- `contact-form`: 7-field contact form component with client-side validation, honeypot spam protection, and submission state machine (default/submitting/success/error)
- `enquiry-api`: Django Enquiry model, DRF serializer with validation, `POST /api/enquiries/` endpoint with rate limiting and email notification

### Modified Capabilities
<!-- No existing capability specs have requirement changes. This migration adds new capabilities using existing shared components and API patterns. -->

## Impact

- **Frontend**: New `Contact.tsx` page and components (`ContactForm`, `ChannelCard`, `OfficeInfo`, `ResponsePromiseCard`) in `frontend/src/`
- **Backend**: New `Enquiry` model, serializer, view, and URL config in `backend/leads/`
- **Database**: New `leads_enquiry` table via Django migration
- **API**: New `POST /api/enquiries/` endpoint; DRF throttle configuration in `settings.py`
- **Route**: Contact route already exists in `routes.ts`; page component replacement only
- **Dependencies**: No new packages required (uses existing `Button`, `Input`, `Card`, `Section`, `TrustBar`, `CTASection`, `FAQPreview`, DRF, `django-cors-headers`)
