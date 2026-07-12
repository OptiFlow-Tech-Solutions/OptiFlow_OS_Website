## 1. Complete Feature Page Stubs

- [x] 1.1 Read old `src/pages/features.html` for reference content
- [x] 1.2 Migrate Checklist section to Features.jsx (problem box, card grid, dashboard preview, CTA)
- [x] 1.3 Migrate Delegation section to Features.jsx
- [x] 1.4 Migrate Worklists section to Features.jsx
- [x] 1.5 Migrate Attendance section to Features.jsx
- [x] 1.6 Migrate Leave Management section to Features.jsx
- [x] 1.7 Migrate SOP Management section to Features.jsx
- [x] 1.8 Migrate Training section to Features.jsx
- [x] 1.9 Migrate Helpdesk section to Features.jsx
- [x] 1.10 Migrate Reports & Analytics section to Features.jsx
- [x] 1.11 Migrate Notifications & Mobile section to Features.jsx
- [x] 1.12 Read old `src/pages/feature-showcase.html` for reference content
- [x] 1.13 Migrate T02 Attendance transformation to FeatureShowcase.jsx
- [x] 1.14 Migrate T03 SOPs transformation to FeatureShowcase.jsx
- [x] 1.15 Migrate T04 Reports transformation to FeatureShowcase.jsx
- [x] 1.16 Migrate T05 Checklists transformation to FeatureShowcase.jsx
- [x] 1.17 Migrate T06 Leave transformation to FeatureShowcase.jsx

## 2. Wire Missing Routes

- [x] 2.1 Add `ServerError` export to `frontend/src/pages/index.js` barrel
- [x] 2.2 Add lazy import for `ServerError` and `CompetitivePositioning` in App.jsx
- [x] 2.3 Add `<Route path="competitive-positioning">` and `<Route path="server-error">` to App.jsx
- [x] 2.4 Fix `ServerError.jsx` error reference ID to use `useState` for stable value on re-renders

## 3. Fix Data Consistency

- [x] 3.1 Fix `{{WHATSAPP}}` template literal in Home.jsx to use `site.whatsapp`
- [x] 3.2 Replace hardcoded email in Contact.jsx with `site.email`
- [x] 3.3 Replace hardcoded phone and WhatsApp in FAQ.jsx with `site.phone` and `site.whatsapp`
- [x] 3.4 Replace hardcoded emails in PrivacyPolicy.jsx with `site.email`
- [x] 3.5 Replace hardcoded emails in Terms.jsx with `site.email`
- [x] 3.6 Fix price range in CompetitivePositioning.jsx to match Pricing.jsx values (₹49,000 — ₹1,49,000)
- [x] 3.7 Remove unused `useEffect` import from FAQ.jsx

## 4. Refactor Pages to Shared Components

- [x] 4.1 Refactor About.jsx: replace raw `<a className="btn">` with `<Button as={Link}>`
- [x] 4.2 Refactor FAQ.jsx: replace raw `<section>`, `<div className="card">`, `<Link className="btn">` with Section, Card, Button
- [x] 4.3 Refactor Contact.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.4 Refactor DemoBooking.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.5 Refactor Newsletter.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.6 Refactor ProblemSolutions.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.7 Refactor WhyOptiFlow.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.8 Refactor CompetitivePositioning.jsx: replace raw `<section>`, `<div className="card">`, `<a className="btn">` with Section, Card, Button
- [x] 4.9 Refactor PrivacyPolicy.jsx: replace raw `<section>`, `<div className="card">` with Section, Card
- [x] 4.10 Refactor Terms.jsx: replace raw `<section>`, `<div className="card">` with Section, Card
- [x] 4.11 Extract shared `InfoBlock` from PrivacyPolicy.jsx and Terms.jsx to `frontend/src/components/InfoBlock.jsx`

## 5. Clean Docker Pipeline

- [x] 5.1 Create `frontend/scripts/generate-infra-files.mjs` — generates root redirect, sitemap.xml, robots.txt, manifest.json at build time
- [x] 5.2 Update `frontend/package.json` with `generate-infra` script calling the new script
- [x] 5.3 Update `frontend/vite.config.js` to use `build.rollupOptions` to copy `_redirects`, manifest, robots, sitemap to dist
- [x] 5.4 Update Dockerfile: replace Stage 1 (static-builder) with a lightweight image optimization stage using only `sharp`
- [x] 5.5 Update Dockerfile runtime stage: copy root redirect from frontend build output instead of static-builder
- [x] 5.6 Update Dockerfile: copy sitemap, robots, manifest from frontend build output
- [x] 5.7 Verify `docker compose build` succeeds with new Dockerfile

## 6. Remove Legacy Files

- [x] 6.1 Verify all content is migrated and Docker build succeeds
- [x] 6.2 Delete `src/pages/*.html` (16 files)
- [x] 6.3 Delete `src/partials/*.html` (3 files: nav, footer, analytics)
- [x] 6.4 Delete `assets/css/core.css`
- [x] 6.5 Delete `assets/js/core.js`
- [x] 6.6 Delete `scripts/assemble.mjs`
- [x] 6.7 Delete obsolete root `package.json` scripts that reference old build pipeline (`build`, `start`, `dev`, `validate`, `watch`, `lint`, `lint:all`)
- [x] 6.8 Remove old build dependencies from root `package.json` (`serve`, `html-validate`, `stylelint`, `stylelint-config-standard`, `sharp`, `husky`)
- [x] 6.9 Verify `npm run build` in frontend/ still works after legacy removal

## 7. Build & Verify

- [x] 7.1 Run `cd frontend && npm run build` — verify zero errors and zero warnings
- [x] 7.2 Run `cd frontend && npm run lint` — verify zero lint errors
- [x] 7.3 Run `cd frontend && npm test` — verify all existing tests pass
- [ ] 7.4 Run `docker compose build` — verify zero errors
- [ ] 7.5 Run `docker compose up -d` — verify container starts and health check passes
- [ ] 7.6 Verify all 17 routes render correctly at `/os/*` paths
- [ ] 7.7 Verify legacy redirects work (`/pricing/` → `/os/pricing/`, etc.)
- [ ] 7.8 Verify `/sitemap.xml`, `/robots.txt`, `/manifest.json` are accessible
- [ ] 7.9 Verify dark/light theme toggle works across all pages
- [ ] 7.10 Verify responsive layout on mobile viewport (375px) for Home, Features, and Pricing pages
- [ ] 7.11 Run `npm run validate` on `dist/` (if the validate script is preserved) or manual check that all links resolve
