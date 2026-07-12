# OptiFlow OS Website — Architecture Document

**Version:** 1.1.0 | **Date:** 2026-07-09 | **Status:** In Progress — F-ARCH-001 scaffolded

## 1. System Architecture

### 1.1 Current State (Static Site)

```
Browser → Nginx (port 80)
            ├─ /os/*         → Static HTML files (dist/os/*/index.html)
            ├─ /assets/*     → Static assets (1-year cache, immutable)
            ├─ /sitemap.xml  → Static XML
            ├─ /robots.txt   → Static text
            └─ /health       → 200 OK
```

### 1.2 Target State (React + Django + PostgreSQL)

```
Browser → Nginx (port 80/443)
            ├─ /os/*         → React SPA (try_files fallback)
            ├─ /api/*        → Django Gunicorn (proxy_pass)
            ├─ /admin/*      → Django Admin (proxy_pass)
            ├─ /static/*     → Django static files
            ├─ /media/*      → Django user uploads
            ├─ /sitemap.xml  → Django dynamic
            ├─ /robots.txt   → Django dynamic
            └─ /health       → Django health check
```

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React | 19.x | UI framework |
| Build | Vite | 6.x | Frontend bundler |
| Language | TypeScript | 5.x | Type safety |
| Routing | React Router | 7.x | Client-side routing |
| CSS | CSS Modules + custom properties | — | Scoped styling |
| State | React Context + custom hooks | — | State management |
| Backend | Django | 5.x | Web framework |
| API | Django REST Framework | 3.x | REST API |
| Database | PostgreSQL | 16.x | Primary database |
| Cache | Redis | 7.x | Session + query cache |
| Queue | Celery | 5.x | Async task processing |
| Auth | Simple JWT | — | JWT authentication |
| Email | SMTP (Resend/Brevo) | — | Transactional email |
| Payment | Razorpay | — | Payment processing |
| Search | PostgreSQL full-text | — | Site search |
| Proxy | Nginx | 1.27+ | Reverse proxy + static files |
| Containers | Docker + Compose | — | Containerization |
| CI/CD | GitHub Actions | — | Automation |
| Testing | Vitest + pytest + Playwright | — | Test suite |
| Monitoring | Sentry | — | Error tracking |
| Analytics | Plausible | — | Privacy-first analytics |

## 3. Directory Structure

```
OptiFlow_OS_Website/
├── frontend/                  # React SPA (CREATED — F-ARCH-001)
│   ├── src/
│   │   ├── pages/             # Placeholder pages
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                   # Django backend (CREATED — F-ARCH-001)
│   ├── config/                # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core/                  # Health check + shared utilities
│   ├── cms/                   # CMS app skeleton
│   ├── blog/                  # Blog app skeleton
│   ├── leads/                 # Leads app skeleton
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── src/                       # LEGACY static site (preserved as spec)
│   ├── pages/                 # 16 HTML source pages
│   └── partials/              # Nav, footer, analytics
├── assets/                    # LEGACY static assets
│   ├── css/core.css           # Design system (513 lines)
│   ├── js/core.js             # Shared JS (356 lines)
│   └── img/                   # Images
├── dist/                      # Build output (auto-generated)
├── docs/                      # Documentation
├── scripts/                   # Legacy build scripts
├── tests/                     # Tests
├── docker-compose.yml         # Multi-service orchestration
├── Dockerfile                 # Legacy static Dockerfile
├── nginx.conf                 # Nginx configuration
├── .env.example               # Environment template
├── site.json                  # Company data SSOT
├── WEBSITE_FEATURE_INVENTORY.md
└── AUDIT_REPORT.md
```

## 4. Data Flow

```
User Action → React Component → API Service (fetch) → Nginx (/api/* proxy)
                                                         │
                                                         ▼
                                                    Django View
                                                         │
                                                    Service Layer
                                                         │
                                                    Django ORM
                                                         │
                                                    PostgreSQL
                                                         │
                                                    Response JSON
                                                         │
                                                         ▼
                                               React State Update → Re-render
```

## 5. Request Lifecycle

```
1. Browser requests /os/pricing/
2. Nginx receives request
3. Nginx proxies to React SPA (try_files $uri /os/index.html)
4. React Router matches /os/pricing/ → PricingPage
5. PricingPage mounts → useEffect fires API calls
6. React -> Nginx -> Django Gunicorn worker
7. Django view authenticates (if needed), queries DB
8. Django returns JSON response
9. React updates state, re-renders with data
10. User sees dynamic pricing page
```

## 6. Authentication Flow

```
1. User visits /admin → React ProtectedRoute checks auth
2. No JWT → Redirect to /admin/login
3. User submits email + password
4. POST /api/auth/login/ → Django validates
5. Django returns { access_token, refresh_token }
6. Frontend stores tokens (httpOnly cookie or secure storage)
7. All subsequent API requests include Authorization: Bearer <token>
8. Token expires → Frontend POST /api/auth/refresh/ → New access token
9. Refresh fails → Redirect to login
```

## 7. Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Docker Host (VPS / Cloud)              │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  nginx (port 80/443)               │ │
│  │  ├─ SSL termination (Let's Encrypt)│ │
│  │  ├─ Static files (React build)     │ │
│  │  └─ API proxy (Django upstream)    │ │
│  └──────────┬─────────────────────────┘ │
│             │                            │
│  ┌──────────▼─────────────────────────┐ │
│  │  frontend (nginx:alpine)           │ │
│  │  ├─ React SPA static files         │ │
│  │  └─ Port 3000 (internal)           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  backend (python:3.12-slim)        │ │
│  │  ├─ Gunicorn (4 workers)           │ │
│  │  ├─ Port 8000 (internal)           │ │
│  │  └─ Celery worker (separate)       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │  Redis   │            │
│  │   :5432  │  │  :6379   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

## 8. Design Principles

1. **Vertical Slice Architecture** — Every feature is independently implementable from UI to database
2. **API-First** — All data flows through REST APIs; frontend never accesses DB directly
3. **Component Reuse** — Shared design system components across all pages
4. **Progressive Enhancement** — Core content works without JavaScript; enhanced with React
5. **Security by Default** — All inputs validated, all outputs sanitized, all endpoints authenticated
6. **Test-Driven** — Write tests before implementation; 80%+ coverage required
7. **Documentation as Code** — Architecture decisions documented alongside code
8. **Preserve, Never Redesign** — Current visual design IS the specification

## 9. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| React over Vue/Svelte | Larger ecosystem, more hiring pool, established patterns |
| Django over Node/Express | Admin interface built-in, ORM maturity, Python ecosystem |
| PostgreSQL over MySQL | Full-text search, JSON support, GIN indexes, MSME data integrity |
| CSS Modules over Tailwind | Closer to existing core.css system; explicit class naming |
| Vite over Webpack | Faster builds, simpler config, React 19 compatibility |
| Razorpay over Stripe | Indian business focus, GST compliance, local payment methods |
| Nginx over Caddy/Traefik | Existing expertise, proven config, team familiarity |
| Docker Compose over Kubernetes | Appropriate scale; K8s overkill for this scope |
| JWT over Session Auth | API-first architecture, mobile-ready, stateless |
| Celery over Django-Q | Mature ecosystem, scheduling reliability, community support |

## 10. Constraints

- Must run on a single VPS initially (no auto-scaling needed)
- Must support Docker Compose deployment (no K8s required)
- Must maintain existing URL structure (`/os/*` prefix)
- Must preserve current SEO rankings (301 redirects for any changes)
- Must support at least 500 concurrent users
- Build + deploy must complete in under 20 minutes
- All admin operations must be behind authentication
- PII data must be encrypted at rest (DPDP Act 2023)
