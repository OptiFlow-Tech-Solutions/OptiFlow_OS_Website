# OptiFlow OS Website — Database Schema

**Version:** 1.0.0 | **Date:** 2026-07-09 | **Status:** Pre-Implementation (Planned Schema)

## Overview

- **Database:** PostgreSQL 16
- **ORM:** Django ORM
- **Migrations:** Django migrations (auto-generated)
- **Search:** PostgreSQL full-text search (GIN indexes)
- **Cache:** Redis 7 (session + query cache)

## Schema Diagram (Planned)

```
accounts          cms               blog              leads
─────────         ───               ────              ─────
auth_user         cms_page          article_category  lead
user_profile      cms_section       article           lead_activity
role              page_template      article_image    demo_booking
permission        seo_meta          article_version   enquiry
refresh_token     site_setting                         testimonial
user_invitation   nav_item
                  social_link

faq               newsletter        resources         payments
───               ──────────        ─────────         ────────
faq_category      newsletter_       resource          order
faq_item           subscriber       resource_download invoice
faq_feedback      newsletter_                         payment_config
                   campaign
                  email_template
                  campaign_send
                  drip_campaign
                  drip_sequence
                  drip_enrollment

meetings          chatbot           whatsapp          careers
────────          ───────           ────────          ───────
meeting_type      chat_flow         whatsapp_config   job
meeting_booking   chat_node         whatsapp_message  job_application
                  chat_conversation whatsapp_template

analytics         ab_testing        misc              ops
─────────         ──────────        ────              ───
analytics_daily   ab_test           announcement_     error_log
 _snapshot        ab_test_variant    banner            performance_metric
analytics_event   ab_test_          cookie_consent    backup_record
search_log         impression       push_subscription data_export
                  ab_test_          form_submission   email_log
                   conversion        _log             admin_activity
                                   rate_limit_        _log
                                    record
                                   translation
```

## Core Tables

### auth_user (Django built-in)
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| email | VARCHAR(254) UNIQUE | Used as username |
| password | VARCHAR(128) | Hashed |
| is_active | BOOLEAN | Default true |
| is_staff | BOOLEAN | Admin access |
| is_superuser | BOOLEAN | Full access |
| date_joined | TIMESTAMP | |

### user_profile
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| user_id | FK → auth_user | OneToOne |
| phone | VARCHAR(15) | |
| department | VARCHAR(100) | |
| avatar | VARCHAR(255) | File path |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMP | auto_now_add |
| updated_at | TIMESTAMP | auto_now |

### lead
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| source | VARCHAR(20) | DEMO_BOOKING/CONTACT_FORM/NEWSLETTER/WHATSAPP/MANUAL |
| source_id | INTEGER | FK to source record |
| name | VARCHAR(200) | |
| company | VARCHAR(200) | |
| phone | VARCHAR(15) | |
| email | VARCHAR(254) | |
| team_size | VARCHAR(20) | |
| industry | VARCHAR(100) | |
| challenges | TEXT | |
| status | VARCHAR(20) | NEW/CONTACTED/QUALIFIED/DEMO_SCHEDULED/NEGOTIATING/WON/LOST |
| assigned_to_id | FK → auth_user | |
| notes | TEXT | |
| last_contacted_at | TIMESTAMP | |
| created_at | TIMESTAMP | auto_now_add |
| updated_at | TIMESTAMP | auto_now |

### article
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| title | VARCHAR(200) | Unique |
| slug | VARCHAR(200) | Unique, auto-generated |
| excerpt | TEXT | |
| content | TEXT | Rich HTML (sanitized) |
| category_id | FK → article_category | |
| author | VARCHAR(100) | |
| read_time_minutes | INTEGER | |
| featured_image | VARCHAR(255) | |
| is_published | BOOLEAN | Default false |
| published_at | TIMESTAMP | |
| view_count | INTEGER | Default 0 |
| meta_keywords | VARCHAR(500) | |
| meta_canonical | VARCHAR(255) | |
| noindex | BOOLEAN | Default false |
| created_at | TIMESTAMP | auto_now_add |
| updated_at | TIMESTAMP | auto_now |

## Indexing Strategy

| Table | Index Type | Columns | Purpose |
|-------|------------|---------|---------|
| article | GIN | to_tsvector('english', title \|\| ' ' \|\| content) | Full-text search |
| article | BTREE | (category_id, is_published, published_at) | Filtered listing |
| article | BTREE | (slug) UNIQUE | URL lookup |
| faq_item | GIN | to_tsvector('english', question \|\| ' ' \|\| answer) | Full-text search |
| faq_item | BTREE | (category_id, is_active, display_order) | Category listing |
| lead | BTREE | (status, created_at) | Pipeline views |
| lead | BTREE | (email) | Duplicate detection |
| lead | BTREE | (source, created_at) | Source analytics |
| cms_page | BTREE | (slug) UNIQUE | URL lookup |
| demo_booking | BTREE | (preferred_date, preferred_time_slot) | Slot availability |
| newsletter_subscriber | BTREE | (email) UNIQUE | Subscription check |
| analytics_daily_snapshot | BTREE | (date) UNIQUE | Daily aggregation |
| rate_limit_record | BTREE | (ip_address, endpoint, window_start) | Rate limiting |
| error_log | BTREE | (created_at, severity) | Log filtering |

## Conventions

1. **Primary keys:** `id` SERIAL for all tables
2. **Timestamps:** `created_at` (auto_now_add), `updated_at` (auto_now) on all tables
3. **Soft delete:** Use `is_active` or `is_deleted` boolean; never hard delete
4. **Foreign keys:** Always use `_id` suffix; always add indexes
5. **Naming:** snake_case for columns; plural for table names
6. **JSON fields:** Use JSONB for structured data (settings, content, metadata)
7. **Enum fields:** Use VARCHAR with CHECK constraints or Django choices
8. **File fields:** Store file path only; files in S3 or /media/
9. **Encrypted fields:** API keys, secrets encrypted with Django fernet or pgcrypto
10. **Search:** tsvector columns updated via Django signals on save
