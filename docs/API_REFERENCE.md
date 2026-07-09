# OptiFlow OS Website — API Reference

**Version:** 1.0.0 | **Date:** 2026-07-09 | **Status:** Planned (Pre-Implementation)

## Base URL

- **Development:** `http://localhost:8000/api/`
- **Production:** `https://os.optiflow.co.in/api/`

## Authentication

All admin endpoints require JWT Bearer token:
```
Authorization: Bearer <access_token>
```

Token endpoints are public. Access token expires in 30 minutes. Refresh with `/api/auth/refresh/`.

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "fields": {
      "email": ["This field is required.", "Enter a valid email address."]
    }
  }
}
```

## Endpoint Catalog

### Health & Meta
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health/` | No | Health check with component status |
| GET | `/api/site-settings/public/` | No | Public site settings |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login/` | No | Login, returns access + refresh tokens |
| POST | `/api/auth/refresh/` | No | Refresh access token |
| POST | `/api/auth/logout/` | Yes | Revoke refresh token |
| POST | `/api/auth/forgot-password/` | No | Send password reset email |
| POST | `/api/auth/reset-password/` | No | Reset password with token |
| GET | `/api/auth/me/` | Yes | Current user profile |

### CMS Pages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cms/:slug/` | No | Get published page with sections |
| GET | `/api/cms/pages/` | No | List published pages |
| GET | `/api/page-content/:slug/` | No | Page content including hero |

### FAQ
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/faq/` | No | List FAQs grouped by category |
| GET | `/api/faq/?search=term` | No | Search FAQs |
| POST | `/api/faq/feedback/` | No | Submit helpful/not-helpful vote |

### Articles (Blog)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles/` | No | Paginated articles, filter by ?category=slug |
| GET | `/api/articles/:slug/` | No | Single article detail |
| GET | `/api/articles/popular/` | No | Top articles by view count |

### Demo Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/demo-bookings/` | No | Submit demo booking |
| GET | `/api/demo-bookings/slots/?date=YYYY-MM-DD` | No | Available time slots for date |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/enquiries/` | No | Submit contact enquiry |

### Newsletter
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/newsletter/subscribe/` | No | Subscribe email |
| POST | `/api/newsletter/unsubscribe/` | No | Unsubscribe |
| GET | `/api/newsletter/unsubscribe/:token/` | No | Unsubscribe via link |

### Resources
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resources/` | No | List resources with search/filter |
| GET | `/api/resources/:id/download/` | No | Download (creates record, returns file) |
| POST | `/api/resources/:id/access/` | No | Gate form submission |

### Search
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/search/?q=term&type=&page=` | No | Full-text search |
| GET | `/api/search/suggestions/?q=` | No | Autocomplete suggestions |

### Testimonials
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/testimonials/` | No | Published testimonials |
| GET | `/api/testimonials/featured/` | No | Featured subset |

### Navigation
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/nav/` | No | Navigation structure |

### Chatbot
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat/start/` | No | Initialize conversation |
| POST | `/api/chat/message/` | No | Process user message |
| POST | `/api/chat/handoff/` | No | Request human handoff |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-order/` | No | Create Razorpay order |
| POST | `/api/payments/verify/` | No | Verify payment signature |
| POST | `/api/payments/webhook/` | No | Razorpay event webhook |

### Meetings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/meetings/types/` | No | Available meeting types |
| GET | `/api/meetings/slots/?type=&date=&member=` | No | Available slots |
| POST | `/api/meetings/book/` | No | Book meeting |
| POST | `/api/meetings/:id/cancel/` | No | Cancel meeting |
| GET | `/api/meetings/:id/ics/` | No | Download calendar invite |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs/` | No | Active job listings |
| GET | `/api/jobs/:slug/` | No | Job detail |
| POST | `/api/jobs/:id/apply/` | No | Submit application |

### PWA
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/pwa/subscribe/` | No | Save push subscription |
| POST | `/api/pwa/unsubscribe/` | No | Remove subscription |

### Cookie Consent
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/cookie-consent/` | No | Record consent preferences |

### Announcements
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/announcement/active/` | No | Active banner for current page |

### Admin Endpoints (all require JWT + staff role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats/` | KPI summary |
| GET | `/api/admin/dashboard/charts/` | Chart data |
| GET | `/api/admin/activity/` | Recent activity feed |
| GET/POST | `/api/admin/users/` | User management |
| PUT/DELETE | `/api/admin/users/:id/` | User update/deactivate |
| POST | `/api/admin/users/invite/` | Invite user |
| GET/POST | `/api/admin/roles/` | Role management |
| PUT | `/api/admin/roles/:id/` | Update role |
| GET/POST/PUT | `/api/admin/seo/` + `:slug/` | SEO management |
| GET | `/api/admin/leads/` | Filtered lead list |
| GET | `/api/admin/leads/:id/` | Lead detail |
| PUT | `/api/admin/leads/:id/` | Update lead |
| POST | `/api/admin/leads/:id/activities/` | Add activity |
| GET/POST/PUT | `/api/admin/articles/` + `:id/` | Article CRUD |
| POST | `/api/admin/images/upload/` | Image upload |
| GET | `/api/admin/articles/:id/versions/` | Version history |
| POST | `/api/admin/articles/:id/revert/:version_id/` | Revert |
| GET/POST/PUT | `/api/admin/campaigns/` + `:id/` | Campaign CRUD |
| POST | `/api/admin/campaigns/:id/send/` | Send campaign |
| POST | `/api/admin/campaigns/:id/test/` | Test send |
| GET | `/api/admin/campaigns/:id/stats/` | Campaign stats |
| GET/POST | `/api/admin/drips/` | Drip campaign CRUD |
| GET/POST/PUT | `/api/admin/settings/` | Site settings |
| GET/POST/PUT | `/api/admin/announcement/` | Announcement CRUD |
| GET/POST/PUT | `/api/admin/whatsapp/config/` | WhatsApp config |
| GET | `/api/admin/whatsapp/messages/` | Message history |
| POST | `/api/admin/whatsapp/send-template/` | Send template |
| GET/POST/PUT | `/api/admin/chat/flows/` | Chat flow management |
| GET | `/api/admin/chat/conversations/` | Conversations |
| GET/POST | `/api/admin/schedule/` | Schedule config |
| POST | `/api/admin/holidays/` | Holiday management |
| GET/POST/PUT | `/api/admin/meetings/` + `:id/` | Meeting management |
| GET/PUT | `/api/admin/applications/` + `:id/` | Application management |
| GET/POST/PUT | `/api/admin/payments/orders/` | Order management |
| GET | `/api/admin/payments/invoices/` | Invoice list |
| GET | `/api/admin/payments/invoices/:id/download/` | Invoice PDF |
| GET | `/api/admin/resources/stats/` | Resource analytics |
| GET/POST/PUT | `/api/admin/ab-tests/` | A/B test CRUD |
| GET | `/api/admin/ab-tests/:id/results/` | Test results |
| GET | `/api/admin/analytics/summary/` | Analytics summary |
| GET | `/api/admin/analytics/funnel/` | Conversion funnel |
| GET | `/api/admin/analytics/sources/` | Source breakdown |
| GET | `/api/admin/analytics/trends/` | Time-series |
| GET | `/api/admin/analytics/content/` | Content performance |
| GET | `/api/admin/analytics/export/` | CSV export |
| POST | `/api/admin/exports/` | Create export job |
| GET | `/api/admin/exports/` | List exports |
| GET | `/api/admin/exports/:id/download/` | Download export |
| GET | `/api/admin/backups/` | Backup status |
| POST | `/api/admin/backups/trigger/` | Trigger backup |
| GET | `/api/admin/logs/` | Error log viewer |
| POST | `/api/admin/email/test/` | Test email |
| GET | `/api/admin/email/logs/` | Email log |
| GET/POST/PUT | `/api/admin/page-builder/section-types/` | Page builder |
| PUT | `/api/cms/:id/sections/` | Batch update sections |
| POST | `/api/cms/:id/publish/` | Publish page |
| POST | `/api/admin/pwa/notify/` | Send push notification |

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success with data |
| 201 | Resource created |
| 204 | Success, no content (delete) |
| 400 | Validation error |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limited |
| 500 | Server error |

## Pagination

All list endpoints support:
```
?page=1&page_size=20
```

Response includes meta object with page, page_size, total, total_pages.

## Filtering & Sorting

Common patterns:
```
?status=NEW&source=DEMO_BOOKING           # Filter
?ordering=-created_at                     # Sort (descending)
?search=term                              # Full-text search
?date_from=2026-01-01&date_to=2026-06-30  # Date range
```
