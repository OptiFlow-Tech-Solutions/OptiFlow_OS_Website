# Docker Guide

## Building

```bash
# Local build
docker build -t optiflow-website .

# With npm script
npm run docker:build
```

### Multi-Stage Architecture

```
Stage 1: Builder (node:20.18-alpine)
  npm ci --ignore-scripts        ← includes sharp for image optimization
  COPY src/ assets/ scripts/ site.json
  RUN node scripts/assemble.mjs  →  dist/

Stage 2: Brotli Builder (nginx:1.27.3-alpine)
  Compiles ngx_http_brotli_*_module.so
  Build deps cleaned after compilation

Stage 3: Runtime (nginx:1.27.3-alpine)
  COPY nginx.conf → /etc/nginx/nginx.conf (server block inline)
  COPY dist/ → /usr/share/nginx/html
  COPY brotli modules → /usr/lib/nginx/modules/
  EXPOSE 80
  HEALTHCHECK /health
  Runs as non-root nginx user
```

## Running

```bash
# Run (auto-removes on stop)
docker run -p 80:80 --rm optiflow-website

# Run detached
docker run -d -p 80:80 --rm optiflow-website

# With npm script
npm run docker:run
```

## Docker Compose

Compose auto-generates unique container names (`<project>_web_1`). No manual name conflicts.

```bash
# Standard (with Coolify/Traefik labels)
npm run docker:compose

# Production (no platform labels)
npm run docker:compose:prod

# Stop and clean up
npm run docker:stop
```

## Environment

The container uses the following environment variables (configurable via `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `80` | Container port (compose only) |
| `DOMAIN` | `optiflow.in` | Domain for Traefik routing labels |
| `API_BASE_URL` | — | Future backend API URL |
| `SITE_URL` | `https://os.optiflow.co.in` | Public site URL |

## Image Details

- **Base:** `nginx:1.27.3-alpine` (pinned version, ~12 MB compressed)
- **Node:** `node:20.18-alpine` (build stage only, pinned version)
- **Compression:** Brotli (level 6) + Gzip (level 6, fallback)
- **User:** `nginx` (non-root, UID 101)
- **Healthcheck:** `GET /health` every 30s (start period: 15s)
- **Port:** 80

## Nginx Configuration

The consolidated `nginx.conf` includes:
- Brotli + Gzip compression
- Security headers (HSTS, CSP, X-Frame-Options, Permissions-Policy)
- Trailing-slash redirect for SEO-friendly URLs
- Asset caching: 1 year for `/assets/`, 1 day for SEO artifacts
- No CDN caching for HTML pages
- SPA-like fallback: `try_files $uri $uri/ $uri/index.html =404`
- `/health` endpoint (returns 200)
- `/api/` placeholder (returns 503 until backend connected)

## Coolify Deployment

The image is Coolify-compatible with Traefik labels.

1. Create a new application, select **Build Pack: Dockerfile**
2. Set repository URL
3. No additional build commands needed
4. Set `DOMAIN` environment variable to your domain

## Known Limitations

- Cloudflare Workers API (`functions/api/`) does not run inside Docker. The `/api/*` routes return 503 until a backend is connected.
- Form submissions on deployed Docker instances should use an external backend. See `.env.example` for `API_BASE_URL`.
- Nixpacks deployments use gzip-only compression (no Brotli) but are otherwise functionally identical.
