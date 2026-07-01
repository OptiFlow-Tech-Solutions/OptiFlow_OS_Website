# Delta: Email Notifications → API-005 Database & Data Management

## Change: Enforce KV Schema and Key Format

### Modified: Notification Log Key Format

- **MODIFY**: Notification log key changed from `notif:<timestamp>-<random>` to `notif:{YYYY-MM-DD}:{uuid}`
- **ADD**: All stored values SHALL include `"schema": "notification.v1"` field
- **ADD**: Value SHALL include `"id"` field set to the same UUID as the key

### Modified: KV Namespace

- **MODIFY**: Notification logs SHALL be written to `NOTIFICATIONS` KV namespace (was previously written to `SUBMISSIONS` namespace or unspecified)
- **ADD**: Worker SHALL bind to `NOTIFICATIONS` namespace

### Modified: Logging Behavior

- **ADD**: KV write failure SHALL log a console warning but SHALL NOT fail the email dispatch
- **MODIFY**: Error details in log SHALL exclude sensitive fields (email addresses in error context)
