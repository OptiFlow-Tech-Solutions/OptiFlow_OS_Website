# Deployment Guide

## Quick Start

```bash
# 1. Build the site
npm ci --ignore-scripts
npm run build

# 2. Serve locally
npx serve dist

# 3. Or: Docker (production-equivalent)
docker build -t optiflow-website .
docker run -d -p 80:80 --name optiflow optiflow-website
curl http://localhost/health
```

---

## Platform Guides

### Local Development

```bash
npm ci
npm run dev          # builds dist/ + serves on port 3000
npm run watch        # rebuilds on file changes
```

### Docker (Any Platform)

```bash
docker build -t optiflow-website .
docker run -d -p 80:80 --name optiflow optiflow-website
```

The image uses `nginx:1.27.3-alpine` with Brotli compression (level 6), security headers, and a `/health` endpoint.

### Docker Compose

```bash
# Standard (with Coolify/Traefik labels)
docker compose up -d --build

# Production (no platform-specific labels)
docker compose -f docker-compose.prod.yml up -d --build
```

### Coolify (Dockerfile)

1. Create new application → **Build Pack: Dockerfile**
2. Set repository URL
3. Set environment variable: `DOMAIN=your-domain.com`
4. Deploy — no additional build commands needed

The Dockerfile handles the full build pipeline. Traefik auto-routing via docker-compose labels.

### Coolify (Nixpacks)

1. Create new application → **Build Pack: Nixpacks**
2. Set repository URL
3. Set environment variable: `DOMAIN=your-domain.com`
4. Deploy — Nixpacks runs `npm ci && npm run build` and serves via nginx

**Note:** Nixpacks path uses gzip compression (Brotli not available in nixpkgs nginx). Functionally identical otherwise — same security headers, caching, and routing.

### Render

1. Create new **Web Service**
2. Connect repository
3. Settings:
   - **Runtime:** Docker
   - **Build Command:** _(auto-detected from Dockerfile)_
   - **Port:** 80
4. Health check path: `/health`
5. Deploy

### Railway

1. Create new service from GitHub repo
2. Railway auto-detects the Dockerfile
3. Set `PORT=80` in variables
4. Deploy — Railway assigns a public URL automatically

### VPS (Manual)

```bash
# Option A: Docker
docker build -t optiflow-website .
docker run -d -p 80:80 --restart unless-stopped --name optiflow optiflow-website

# Option B: nginx directly
npm ci --ignore-scripts
npm run build
sudo cp -r dist/* /var/www/optiflow/
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx
```

### Cloudflare Pages

```bash
npm run deploy:cloudflare
# Or via GitHub Actions — automatically deploys on push to main/staging
```

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

### Netlify

```bash
npm run deploy:netlify
```

---

## Environment Variables

| Variable | Required | Default | Platforms |
|----------|----------|---------|-----------|
| `PORT` | No | `80` | Docker, Compose, Coolify |
| `DOMAIN` | No | `optiflow.in` | Coolify (Traefik routing) |
| `SITE_URL` | No | `https://os.optiflow.co.in` | All (build-time, sitemap/OG) |
| `API_BASE_URL` | No | _(none)_ | Docker (future backend) |
| `NODE_ENV` | No | `production` | All |
| `RESEND_API_KEY` | No | _(none)_ | Cloudflare Workers |
| `JWT_SECRET` | No | _(none)_ | Cloudflare Workers |
| `ADMIN_USERNAME` | No | _(none)_ | Cloudflare Workers |
| `ADMIN_PASSWORD` | No | _(none)_ | Cloudflare Workers |

All variables have defaults in `.env.example`. None are required for the static site to serve.

---

## Architecture

```
Multi-Stage Docker Build:

Stage 1: node:20.18-alpine (builder)
  npm ci --ignore-scripts → scripts/assemble.mjs → dist/

Stage 2: nginx:1.27.3-alpine (brotli-builder)
  Compiles ngx_http_brotli_*_module.so from source

Stage 3: nginx:1.27.3-alpine (runtime)
  nginx + Brotli modules + dist/ + nginx.conf
  EXPOSE 80  |  HEALTHCHECK /health  |  Non-root user
```

---

## Troubleshooting

### Port conflict on host
```
Error: listen tcp :80: bind: address already in use
```
→ Change `PORT` in `.env` or use `-p 8080:80` in docker run.

### Container exits immediately
```
→ docker logs optiflow-website
```
Common causes:
- nginx.conf syntax error → validate with `nginx -t`
- Brotli module incompatible with nginx version → rebuild with `--no-cache`

### All routes return 404 in Docker
→ Check that `dist/` was copied correctly: `docker run --rm optiflow-website ls /usr/share/nginx/html/`

### Healthcheck fails
→ Wait for start period (15s): `sleep 20 && curl http://localhost/health`

### Nixpacks: nginx fails to start
→ Nixpacks requires `dist/` to exist at build time. Verify `npm run build` succeeded in build logs.

### Memory issues (OOM kill)
→ Increase memory limit in docker-compose.yml beyond 256M if serving high traffic.

### "API not configured" on form submissions
→ Docker deployments don't include Cloudflare Workers. Form handling requires a separate backend or Cloudflare Pages deployment.

### Build fails: "Cannot find module 'sharp'"
→ Run `npm ci` without `--ignore-scripts` for local builds that need native modules. Docker builds use `--ignore-scripts` and still work because sharp is only needed for optional image optimization.
