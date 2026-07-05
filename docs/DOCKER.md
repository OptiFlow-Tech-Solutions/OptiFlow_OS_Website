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
Stage 1: Builder (node:20-alpine)
  npm ci --ignore-scripts        ← includes sharp for image optimization
  COPY src/ assets/ scripts/ site.json
  RUN node scripts/assemble.mjs  →  dist/

Stage 2: Brotli Builder (nginx:1.27-alpine)
  Compiles ngx_http_brotli_*_module.so

Stage 3: Runtime (nginx:1.27-alpine)
  COPY nginx.conf → /etc/nginx/conf.d/default.conf
  COPY dist/ → /usr/share/nginx/html
  COPY brotli modules → /usr/lib/nginx/modules/
  EXPOSE 80
  HEALTHCHECK /health
```

## Running

```bash
# Run container
docker run -p 80:80 --name optiflow-website optiflow-website

# Run detached
docker run -d -p 80:80 --name optiflow-website optiflow-website

# With npm script
npm run docker:run
```

## Docker Compose

```bash
# Start
docker compose up --build

# Start detached
docker compose up -d --build

# Stop
docker compose down
```

## Environment

The container uses the following environment variables (configurable via `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `80` | Container port (compose only) |
| `DOMAIN` | `optiflow.in` | Domain for Traefik routing labels |
| `API_BASE_URL` | — | Future backend API URL |
| `SITE_URL` | `https://optiflow.in` | Public site URL |

## Image Details

- **Base:** `nginx:1.27-alpine` (~12 MB compressed)
- **Compression:** Brotli (level 6) + Gzip (level 6, fallback)
- **User:** `nginx` (non-root, UID 101)
- **Healthcheck:** `GET /health` every 30s
- **Port:** 80

## Coolify Deployment

The image is Coolify-compatible with Traefik labels.

1. Create a new application, select **Build Pack: Dockerfile**
2. Set repository URL
3. No additional build commands needed
4. Set `DOMAIN` environment variable to your domain

## Known Limitations

- Cloudflare Workers API (`functions/api/`) does not run inside Docker. The `/api/*` routes return 503 until a backend is connected.
- Form submissions on deployed Docker instances should use an external backend. See `.env.example` for `API_BASE_URL`.
