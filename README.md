# OptiFlow OS Website

Business Execution Operating System marketing website for Indian MSMEs. 17 static pages with a custom design system, assembled by a Node.js build pipeline.

## Quick Start

```bash
git clone <repo>
cd OptiFlow_OS_Website
npm install
npm run dev          # Build + serve locally at http://localhost:3000
```

## Docker Quick Start

```bash
docker build -t optiflow-website .
docker run -p 80:80 optiflow-website

# Open 
http://localhost:80
```

Or with Docker Compose:

```bash
docker compose up --build
```

## Project Overview

| Aspect | Detail |
|--------|--------|
| Framework | None — pure static HTML/CSS/JS |
| Build | Custom Node.js ESM pipeline (`scripts/assemble.mjs`) |
| CSS | Oklch color space, CSS custom properties |
| JS | Vanilla JS, no bundler |
| Runtime | Zero runtime dependencies |
| Web Server | nginx (production), `npx serve` (dev) |

## Directory Structure

```
src/pages/          17 HTML source pages
src/partials/       nav, footer, analytics, cookie-consent
assets/css/         core.css — design system
assets/js/          core.js, search.js, sw.js
scripts/            assemble.mjs (build), validate.mjs (lint)
functions/api/      Cloudflare Workers API backend
tests/e2e/          Playwright E2E + a11y tests
docs/               Developer + deployment docs
site.json           Canonical company data + page metadata
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Assemble `dist/` from `src/` |
| `npm run validate` | Post-build validation |
| `npm run dev` | Build + serve locally |
| `npm run watch` | Watch + live reload |
| `npm run test` | Playwright E2E tests |
| `npm run lint:all` | CSS + HTML + JS linting |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |
| `npm run docker:compose` | Docker Compose up |

## Deployment Targets

- **Docker / Coolify** — `Dockerfile` build pack (recommended)
- **Cloudflare Pages** — `npm run deploy:cloudflare`
- **Netlify** — `npm run deploy:netlify`
- **AWS ECS / Kubernetes** — Docker image (see `docs/DEPLOYMENT.md`)

## Environment

Copy `.env.example` to `.env` and adjust:

```env
NODE_ENV=production
PORT=80
API_BASE_URL=http://localhost:3001
SITE_URL=https://optiflow.in
```

## Development

Read `docs/DEVELOPER.md` for detailed developer instructions, coding conventions, and the OpenSpec workflow.
