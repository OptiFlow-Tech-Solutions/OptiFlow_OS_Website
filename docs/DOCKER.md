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
  npm ci --ignore-scripts
  COPY src/ assets/ scripts/ site.json
  RUN node scripts/assemble.mjs  →  dist/

Stage 2: Runtime (nginx:alpine)
  COPY nginx.conf → /etc/nginx/conf.d/default.conf
  COPY dist/ → /usr/share/nginx/html
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

Set at runtime:

```bash
docker run -p 80:80 \
  -e NODE_ENV=production \
  -e API_BASE_URL=https://api.optiflow.in \
  optiflow-website
```

## Image Details

- **Base:** `nginx:alpine` (~12 MB compressed)
- **User:** `nginx` (non-root, UID 101)
- **Healthcheck:** `GET /health` every 30s
- **Port:** 80

## Known Limitations

- Cloudflare Workers API (`functions/api/`) does not run inside Docker. The `/api/*` routes return 503 until a backend is connected.
- Form submissions on deployed Docker instances should use an external backend. See `.env.example` for `API_BASE_URL`.
