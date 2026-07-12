# OptiFlow OS Website — Environment Configuration

**Version:** 1.0.0 | **Date:** 2026-07-09

## Overview

All configuration is managed via environment variables. The `.env` file is gitignored. `.env.example` serves as the template.

## Required Variables

### Core Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `production` | `development` or `production` |
| `PORT` | Yes | `80` | Web server port |
| `SITE_URL` | Yes | — | Public site URL for OG tags, sitemap |
| `DOMAIN` | Yes | — | Domain for Traefik/Coolify routing |

### Django Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | **Yes** | — | Django cryptographic signing key (50+ chars random) |
| `DJANGO_DEBUG` | Yes | `False` | Debug mode (never True in production) |
| `DJANGO_ALLOWED_HOSTS` | Yes | `*` | Comma-separated allowed hosts |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Logging level |

### Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection URL |
| `POSTGRES_USER` | Dev only | `optiflow` | Database user |
| `POSTGRES_PASSWORD` | Dev only | — | Database password |
| `POSTGRES_DB` | Dev only | `optiflow` | Database name |
| `POSTGRES_HOST` | Dev only | `localhost` | Database host |
| `POSTGRES_PORT` | Dev only | `5432` | Database port |

### Redis / Cache

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | Yes | `redis://localhost:6379/0` | Redis connection URL |

### Frontend (Vite)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | **Yes** | `http://localhost:8000/api` | API base URL for frontend |
| `VITE_SITE_URL` | Yes | `http://localhost:5173` | Frontend site URL |

### Email (SMTP)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_HOST` | Yes | — | SMTP server host |
| `EMAIL_PORT` | Yes | `587` | SMTP port |
| `EMAIL_HOST_USER` | Yes | — | SMTP username |
| `EMAIL_HOST_PASSWORD` | Yes | — | SMTP password |
| `EMAIL_USE_TLS` | No | `True` | Use TLS |
| `EMAIL_FROM` | Yes | — | Default from address |

### Payment (Razorpay)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAZORPAY_KEY_ID` | Yes | — | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Yes | — | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | — | Webhook verification secret |
| `RAZORPAY_TEST_MODE` | No | `True` | Test mode (True for sandbox) |

### WhatsApp Business API

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WHATSAPP_PHONE_NUMBER_ID` | No | — | WhatsApp phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | No | — | WhatsApp API access token |
| `WHATSAPP_WEBHOOK_TOKEN` | No | — | Webhook verification token |

### JWT Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | **Yes** | — | JWT signing key |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | No | `30` | Access token expiry |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | No | `7` | Refresh token expiry |

### CORS

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CORS_ALLOWED_ORIGINS` | Yes | `http://localhost:5173` | Comma-separated allowed origins |

### Monitoring & Analytics

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | No | — | Sentry DSN for error tracking |
| `PLAUSIBLE_DOMAIN` | No | `optiflow.in` | Plausible analytics domain |

### File Storage

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MEDIA_ROOT` | No | `/app/media` | Media files directory |
| `STATIC_ROOT` | No | `/app/static` | Static files directory |
| `USE_S3` | No | `False` | Use S3 for file storage |

## Environment Files

| File | Purpose | Committed |
|------|---------|-----------|
| `.env` | Local development | No (gitignored) |
| `.env.example` | Template with defaults | Yes |
| `.env.production` | Production overrides | No (gitignored) |
| `.env.staging` | Staging overrides | No (gitignored) |
| `.env.test` | Test environment | No (gitignored) |

## Development Setup

```bash
cp .env.example .env
# Edit .env with your local values
# Ensure DJANGO_DEBUG=True for development
```

## Production Setup

```bash
cp .env.example .env
# Edit with production values:
# - Set DJANGO_DEBUG=False
# - Set strong DJANGO_SECRET_KEY
# - Set JWT_SECRET
# - Set all API keys (Razorpay, WhatsApp, Email)
# - Set CORS_ALLOWED_ORIGINS to production domain
```
