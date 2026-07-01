# API-005: Database & Data Management

## Summary

Define and implement a structured data management layer for the OptiFlow OS website's Cloudflare KV-backed application data. This capability covers data schemas, key structures, lifecycle policies, admin export functionality, pagination, and audit logging.

## Motivation

The project currently stores form submissions and email notification logs in Cloudflare KV as unstructured JSON blobs with flat key patterns (`sub:<timestamp>-<random>`, `notif:<timestamp>-<random>`). There is no formal data schema, no retention policy, no admin export, and no pagination on the submissions endpoint. As the site scales, these gaps create operational risk: runaway storage costs, difficulty auditing data, inability to export leads to CRM, and a brittle admin dashboard.

## Scope

1. **KV Data Schemas** — Formalize JSON schemas for submission records, notification logs, and audit entries
2. **Key Space Design** — Structured key patterns with namespacing for efficient listing and filtering
3. **Data Lifecycle** — Retention policies (30-day submission retention, 7-day notification log retention), automated cleanup via scheduled Worker
4. **Admin Export** — GET `/api/admin/submissions/export` with CSV and JSON format support
5. **Pagination** — Offset-based pagination on `/api/admin/submissions` with `?page=` and `?per_page=` query params
6. **Audit Trail** — Separate `audit:` KV namespace for data access and modification records
7. **Data Integrity** — Submission uniqueness constraint, schema validation on read, KV consistency checks

## Out of Scope

- Cloudflare D1 or SQL migration (KV remains the storage layer)
- Real-time data sync / WebSocket
- Data anonymization / GDPR tooling
- Multi-tenant data isolation

## Affected Specs

| Spec | Impact |
|------|--------|
| `admin-authentication` | Add export endpoint, pagination to submissions endpoint |
| `form-processing-api` | Add KV schema enforcement, audit logging on write |
| `email-notifications` | Add notification log schema conformance |
| `build-pipeline` | No changes |
| `shared-components` | No changes |
