## Context

The form-submit Worker (`functions/api/form-submit.js`) currently does everything: routing, validation, rate limiting, email, logging, KV storage, and admin auth. The `sendNotification()` function (lines 141-176) sends plain-text emails via Resend API only to the team inbox. No subscriber-facing emails exist (welcome, confirmation). No HTML templates. Email failure is logged but not tracked persistently.

## Goals / Non-Goals

**Goals:**
- Extract email dispatch into a standalone Worker at `/api/email` for separation of concerns
- Add HTML email templates with OptiFlow brand styling (logo, accent colors, footer)
- Send newsletter welcome/confirmation email to subscribers
- Log every email attempt to KV (`notif:*` key prefix) for audit/debugging
- Graceful degradation: email failure never blocks the caller

**Non-Goals:**
- No ESP integration (Mailchimp, Beehiiv, etc.) — this is transactional email only
- No email scheduling or batch-send support
- No email open/click tracking
- No email preference center for subscribers
- No change to the Resend provider (proven, free tier sufficient)

## Decisions

### 1. Standalone Worker vs shared module

**Decision:** Standalone Cloudflare Worker at `functions/api/email.js`

**Rationale:** A separate Worker can be called from multiple sources (form-submit, future scheduled tasks, admin actions). Cloudflare Workers can call other Workers on the same account. A shared Node.js module would couple deployment between form-submit and email — separate Worker allows independent scaling.

**Alternative considered:** Shared `lib/email.mjs` imported by form-submit. Rejected — couples deployments, no benefit since both run on Cloudflare anyway.

### 2. HTML templates: inline vs file-based

**Decision:** Inline template literals in `email.js`

**Rationale:** Two template types (team notification, subscriber welcome) with minimal variable substitution. File-based templates add build complexity for no gain. If template count exceeds 5, extract to `templates/` directory.

### 3. KV logging prefix

**Decision:** `notif:<ISO-timestamp>-<random>` key format

**Rationale:** Follows existing `sub:` prefix pattern in form-submit. Enables listing/querying from admin dashboard in the future. TTL of 30 days to match Resend's free-tier retention.

### 4. Worker-to-Worker call pattern

**Decision:** Direct HTTP `fetch()` call to the email Worker's production URL

**Rationale:** Cloudflare supports service bindings, but HTTP fetch is simpler and works identically in local dev. The email Worker validates its own request body, so the caller just sends JSON.

**Alternative considered:** Cloudflare Service Bindings. Rejected — require Wrangler config changes and don't work locally without miniflare setup.

## Risks / Trade-offs

- **Worker-to-Worker latency**: ~5-10ms intra-datacenter. Negligible for async email dispatch.
- **Email Worker unavailable**: Form-submit catches the error and returns `emailSent: false` — no data loss
- **Resend API downtime**: Same graceful degradation as current. No retry queue — add if failure rate exceeds 1%
- **KV write failures**: Email still sent, log lost — acceptable trade-off for now
- **HTML email rendering**: Limited client support for CSS. Use table-based layout with inline styles for maximum compatibility
