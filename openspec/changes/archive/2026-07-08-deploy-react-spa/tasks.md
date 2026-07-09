## 1. Dockerfile — React Build Stage

- [x] 1.1 Add `react-builder` stage with `node:20.18-alpine`, install deps from `frontend/package.json`, copy `frontend/` source
- [x] 1.2 Run `npm run build` in react-builder stage to produce `frontend/dist/`
- [x] 1.3 Rename existing `builder` stage to `static-builder` for clarity
- [x] 1.4 Runtime stage: `COPY --from=react-builder /app/dist /usr/share/nginx/html/os/`
- [x] 1.5 Runtime stage: keep static `COPY` directives for root redirect, sitemap.xml, robots.txt, manifest.json, assets/img/

## 2. nginx.conf — SPA Fallback

- [x] 2.1 Add `location /os/` block before `location /` with security headers matching existing config
- [x] 2.2 Configure `try_files $uri /os/index.html` — serve static assets directly, fall back to SPA index for unknown paths
- [x] 2.3 Set `Cache-Control: no-cache, must-revalidate` on `/os/` responses (same as `location /`)

## 3. Verification

- [x] 3.1 Run `npm run build` in `frontend/` — verify clean output with zero errors
- [x] 3.2 Run `npm run build` from root — verify static builder still produces all infrastructure files
- [x] 3.3 Run `npm run test` in `frontend/` — verify 27/27 tests pass
- [x] 3.4 Verify React `index.html` references `/os/assets/...` paths matching nginx location
- [x] 3.5 Verify no changes to `docker-compose.yml` or `docker-compose.prod.yml` needed (both reference `build: .`)
