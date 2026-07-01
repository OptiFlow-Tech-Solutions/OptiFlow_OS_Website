# Delta: Form Processing API → API-005 Database & Data Management

## Change: Enforce KV Schema and Key Format

### Modified: KV Submission Storage

- **MODIFY**: Submission key format changed from `sub:<timestamp>-<random>` to `sub:{YYYY-MM-DD}:{uuid}`
- **ADD**: All stored values SHALL include `"schema": "submission.v1"` field
- **ADD**: Value SHALL include `"id"` field set to the same UUID as the key
- **ADD**: `"ip"` field SHALL be hashed before storage (SHA-256)
- **ADD**: After successful KV write, an audit entry SHALL be written with `action: "submission_write"`

### Modified: Newsletter Handling

- **ADD**: On valid newsletter submission, a subscriber record SHALL be stored at `subscriber:{sha256(email)}`
- **ADD**: Subscriber value SHALL include `{ email, subscribedAt, source, firstSeen }`
- **ADD**: Existing subscriber overwrite SHALL update `subscribedAt` but preserve `firstSeen`

### Modified: KV Namespace Binding

- **MODIFY**: Worker SHALL bind to three namespaces: `SUBMISSIONS`, `NOTIFICATIONS`, `AUDIT`
- **ADD**: Notification logs SHALL be written to `NOTIFICATIONS` namespace (not `SUBMISSIONS`)
