# Platform Auth

## Purpose

Define authentication and authorization for the OptiFlow OS admin panel, enabling team members to securely view form submissions and manage data.

## Requirements

### Requirement: Admin Login

The system SHALL provide a password-based login endpoint for admin users.

#### Scenario: Successful login

- **GIVEN** an admin user exists with email `admin@optiflow.in` and a valid password
- **WHEN** a `POST` request is made to `/api/auth/login` with `{ "email": "admin@optiflow.in", "password": "<correct-password>" }`
- **THEN** the server SHALL respond with HTTP 200 OK
- **AND** the response SHALL include `{ "token": "<jwt>", "expires_in": 28800 }`
- **AND** the JWT token SHALL be signed and include `sub` (user ID), `role`, and `exp` claims

#### Scenario: Invalid credentials

- **GIVEN** an admin user exists
- **WHEN** a `POST` request is made to `/api/auth/login` with an incorrect password
- **THEN** the server SHALL respond with HTTP 401 Unauthorized
- **AND** the response SHALL include `{ "success": false, "message": "Invalid email or password" }`
- **AND** the error message SHALL NOT reveal whether the email exists

#### Scenario: Brute force protection

- **GIVEN** the login endpoint has rate limiting
- **WHEN** more than 5 failed login attempts occur from the same IP within 15 minutes
- **THEN** subsequent login attempts from that IP SHALL respond with HTTP 429 Too Many Requests
- **AND** the rate limit SHALL reset after 15 minutes

### Requirement: Session Management

The system SHALL manage admin sessions via JWT tokens with configurable expiry.

#### Scenario: Token required for admin endpoints

- **GIVEN** the `GET /api/admin/submissions` endpoint
- **WHEN** a request is made without an `Authorization: Bearer <token>` header
- **THEN** the server SHALL respond with HTTP 401 Unauthorized

#### Scenario: Expired token rejected

- **GIVEN** a JWT token with an `exp` claim in the past
- **WHEN** a request is made with that token to any admin endpoint
- **THEN** the server SHALL respond with HTTP 401 Unauthorized
- **AND** the response SHALL include `{ "success": false, "message": "Session expired. Please login again." }`

#### Scenario: Token refresh

- **GIVEN** a valid but expiring token
- **WHEN** a `POST` request is made to `/api/auth/refresh` with the current token
- **THEN** the server SHALL respond with HTTP 200 OK
- **AND** the response SHALL include a new token with a reset expiry
- **AND** the old token SHALL be added to an invalidation list

### Requirement: Admin User Management

The system SHALL support multiple admin user accounts with role-based access.

#### Scenario: Admin roles

- **GIVEN** admin users exist with roles `owner` and `viewer`
- **WHEN** a `viewer` attempts to delete a submission
- **THEN** the server SHALL respond with HTTP 403 Forbidden
- **AND** the `owner` role SHALL be allowed to delete submissions

#### Scenario: Password change

- **GIVEN** an authenticated admin user
- **WHEN** a `POST` request is made to `/api/auth/change-password` with `{ "current_password": "...", "new_password": "..." }`
- **THEN** the password SHALL be updated if the current password is correct
- **AND** all existing sessions for that user SHALL be invalidated
- **AND** the response SHALL include `{ "success": true, "message": "Password changed. Please login again." }`

### Requirement: CSRF Protection

The system SHALL protect state-changing endpoints against Cross-Site Request Forgery.

#### Scenario: CSRF token required

- **GIVEN** cookie-based authentication is used for the admin panel
- **WHEN** a state-changing request (POST, PUT, DELETE) is made without a valid CSRF token
- **THEN** the server SHALL respond with HTTP 403 Forbidden
- **AND** the CSRF token SHALL be delivered via a `csrf_token` cookie on first page load

#### Scenario: Token-based auth bypasses CSRF

- **GIVEN** the request uses `Authorization: Bearer <token>` header
- **WHEN** a state-changing request is made without a CSRF token
- **THEN** the server SHALL process the request normally
- **AND** CSRF checks SHALL be skipped for bearer token authentication

### Requirement: Admin Panel Page

The system SHALL provide a minimal admin panel HTML page at `/admin/` with login and submission listing.

#### Scenario: Unauthenticated user sees login form

- **GIVEN** the admin panel page at `/admin/`
- **WHEN** a user navigates to the page without a valid session
- **THEN** the login form SHALL be displayed
- **AND** all `/api/admin/*` fetch calls SHALL be deferred until login completes

#### Scenario: Authenticated user sees submission data

- **GIVEN** a valid session token is present
- **WHEN** the admin panel loads
- **THEN** submission data SHALL be fetched from `/api/admin/submissions`
- **AND** contact submissions, demo bookings, and newsletter subscriptions SHALL be displayed in tabbed sections
- **AND** each submission SHALL show all fields, timestamp, and status

#### Scenario: Logout clears session

- **GIVEN** an authenticated admin user
- **WHEN** the logout button is clicked
- **THEN** the session token SHALL be cleared from storage
- **AND** the page SHALL redirect to the login form
