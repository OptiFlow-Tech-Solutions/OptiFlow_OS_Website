# Design: api-002

## Decisions
- **Single-page admin**: Login form and dashboard share one page. Auth state toggles UI visibility.
- **JWT in localStorage**: Token persists across tabs. Set to 24h expiry.
- **Env-var credentials**: ADMIN_USERNAME and ADMIN_PASSWORD set in Cloudflare dashboard. No database needed.
- **`/api/admin/login`**: POST with `{ username, password }` → returns JWT on success.
- **`/api/admin/verify`**: POST with `{ token }` → returns `{ valid: boolean }`.
- **`/api/admin/submissions`**: GET with Bearer token → returns recent log entries (worker tail).
- **No nav/footer on admin page**: Admin page is standalone, uses minimal chrome.
- **Admin CSS in core.css**: `.admin-login`, `.admin-dashboard`, `.admin-submission-list` classes.
- **Admin JS in core.js**: `adminLogin()`, `adminLogout()`, `adminVerify()` functions, gated by `window.location.pathname.startsWith('/admin')`.
- **Worker stateless**: JWT signed with env.JWT_SECRET. No session store.
- **Build pipeline**: Admin page NOT linked from nav/footer. Not indexed. robots noindex.
