## 1. Add analytics include directives to all pages

- [x] 1.1 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/home.html`
- [x] 1.2 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/problem-solutions.html`
- [x] 1.3 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/product-overview.html`
- [x] 1.4 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/features.html`
- [x] 1.5 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/feature-showcase.html`
- [x] 1.6 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/why-optiflow.html`
- [x] 1.7 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/pricing.html`
- [x] 1.8 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/newsletter.html`
- [x] 1.9 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/faq.html`
- [x] 1.10 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/contact.html`
- [x] 1.11 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/demo-booking.html`
- [x] 1.12 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/privacy-policy.html`
- [x] 1.13 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/terms.html`
- [x] 1.14 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/404.html`
- [x] 1.15 Add `<!-- INCLUDE: analytics -->` before `</head>` in `src/pages/500.html`

## 2. Add conversion event tracking to core.js

- [x] 2.1 Add `trackEvent(name, props?)` helper function with null guard for `window.plausible`
- [x] 2.2 Wire `trackEvent('Submit Demo Booking', utmParams)` into `submitForm()` on successful demo booking form submission
- [x] 2.3 Wire `trackEvent('Submit Contact Form', utmParams)` into `submitForm()` on successful contact form submission
- [x] 2.4 Wire `trackEvent('Sign Up Newsletter', utmParams)` into `submitForm()` on successful newsletter form submission
- [x] 2.5 Add click listener for pricing CTA elements that fires `trackEvent('Click Pricing CTA')`

## 3. Remove ponytail auto-injection from build script

- [x] 3.1 Remove the `html.replace('</head>', analyticsRaw)` auto-injection on or near line 157 of `scripts/assemble.mjs`
- [x] 3.2 Verify the `<!-- INCLUDE: analytics -->` replacement at line 94 remains intact

## 4. Build and validate

- [x] 4.1 Run `npm run build` and verify no errors
- [x] 4.2 Run `npm run validate` and verify all checks pass
- [x] 4.3 Spot-check assembled pages in `dist/` for presence of Plausible script and absence of duplicate injection
- [x] 4.4 Verify `trackEvent()` function works in browser console (Plausible events appear in network tab)
