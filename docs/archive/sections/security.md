# Security — Implementation Documentation
- **Current Score:** 58/100 | **Target Score:** 85/100 | **Gap:** 27 | **Last Updated:** 2026-07-06

## Overview
The security posture covers input sanitization, CSRF protection, rate limiting, JWT authentication, and security headers. The current implementation protects the public form endpoints and admin area but has critical gaps in credential management, multi-user access control, and client-side compliance. The 27-point gap is driven by missing password hashing, absent admin brute-force protection, and incomplete security header implementation.

## Current State
- **CSRF protection** — Origin header check on all POST endpoints; rejects requests from non-whitelisted origins (SEC-002, COMPLETED)
- **Input sanitization** — HTML entity encoding on all form fields before storage/email; prevents XSS via stored content (SEC-003, COMPLETED)
- **Rate limiting** — 5 requests per 10 minutes per IP for form submission endpoint; KV-backed sliding window (SEC-001, COMPLETED)
- **Phone validation** — regex pattern validation on phone fields; rejects non-Indian mobile formats (SEC-004, COMPLETED)
- **JWT auth** — HS256-signed tokens with 24h expiry for admin authentication; login/verify flow (SEC-001 proxy, COMPLETED)
- **Security headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy set at reverse proxy (nginx/Netlify) level
- **Honey-pot spam detection** — hidden form field traps automated bots
- Scoring deductions: single admin user with plaintext credentials in env vars (TD-05), no admin login rate limiting (SEC-007), no password hashing (SEC-008), no CSP via meta tag (SEC-006), no JWT rotation documentation (SEC-005), no cookie consent (FE-003)

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|------------|------|----------|------------|--------|
| SEC-005 | JWT rotation documentation | MEDIUM | 0.3 | Not Started |
| SEC-006 | CSP meta tag | MEDIUM | 0.3 | Not Started |
| SEC-007 | Admin login rate limiting | HIGH | 0.5 | Not Started |
| SEC-008 | Password hashing (bcrypt) | HIGH | 1.0 | Not Started |
| FE-003 | Cookie consent banner | HIGH | 1.5 | Not Started |
| SEC-009 | Security.txt | LOW | 0.3 | Not Started |

## Implementation Order
1. **SEC-008 (Password hashing)** — highest priority; replaces plaintext admin credentials in environment variables with bcrypt-hashed passwords. Remove plaintext ADMIN_PASS from env vars entirely; store only hash. Update login flow to compare against hash.
2. **SEC-007 (Admin rate limiting)** — prevent brute-force attacks on admin login; add KV-backed rate limiter identical to form submission pattern (5 req/5min per IP).
3. **SEC-005 (JWT rotation docs)** — document JWT_SECRET rotation procedure in .env.example and security runbook; trivial documentation task with high compliance value.
4. **SEC-006 (CSP meta tag)** — add Content-Security-Policy meta tag via assemble.mjs to complement existing proxy-level headers; defense-in-depth for XSS mitigation.
5. **FE-003 (Cookie consent banner)** — legal compliance for Plausible analytics; requires core.css + core.js changes; see frontend section for full scope.
6. **SEC-009 (Security.txt)** — add `/.well-known/security.txt` per RFC 9116; low effort, industry standard.

## Dependencies
| Depends On | For Feature |
|------------|-------------|
| SEC-008 | PROD-006 (customer portal needs proper auth) |
| SEC-007 | SEC-008 (rate limit the bcrypt login endpoint, not the plaintext one) |
| UX-004 (frontend) | FE-003 (cookie banner styles must be in core.css) |
| (none) | SEC-005, SEC-006, SEC-009 |

## Key Files
| File | Purpose |
|------|---------|
| `workers/form-submit.js` | CSRF origin check, input sanitization, rate limiting, honey-pot detection |
| `workers/email.js` | Internal-only endpoint; receives pre-validated data |
| `workers/form-submit.js` (admin) | JWT auth (HS256), login/verify/submissions/stats/export endpoints |
| `.env.example` | ADMIN_USER, ADMIN_PASS (plaintext — target for SEC-008 replacement), JWT_SECRET |
| `wrangler.toml` | Worker config, KV bindings for RATE_LIMIT, environment variable definitions |
| `scripts/assemble.mjs` | Build script where SEC-006 (CSP meta tag) will be injected |
| `assets/js/core.js` | Client-side analytics; FE-003 consent check will gate analytics loading |

## Acceptance Criteria
- [ ] ADMIN_PASS removed from environment variables; bcrypt hash stored as ADMIN_PASS_HASH
- [ ] Admin login validates against bcrypt hash; login flow unchanged from user perspective
- [ ] Admin login endpoint rate-limited: 5 attempts per 5 minutes per IP; 429 response with Retry-After header
- [ ] JWT rotation documented: procedure steps, .env.example comments, schedule recommendation in security runbook
- [ ] CSP meta tag includes: default-src 'self', script-src 'self' plausible.io, style-src 'self' 'unsafe-inline', img-src 'self' data:
- [ ] Cookie consent banner displays on first visit; Plausible analytics loads only after explicit consent
- [ ] `/.well-known/security.txt` returns valid RFC 9116 response with contact email and policy link
- [ ] No plaintext credentials in any file tracked by git; .env.example shows only variable names, not values

## References
- MASTER_IMPLEMENTATION.md
- FEATURE_INDEX.md
- TECHNICAL_DEBT.md (TD-05, TD-15)
