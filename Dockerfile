# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --omit=dev

COPY site.json ./
COPY src/ src/
COPY assets/ assets/
COPY scripts/ scripts/

RUN node scripts/assemble.mjs

# Stage 2: Runtime
FROM nginx:1.27-alpine

RUN apk add --no-cache curl tzdata

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -sf http://localhost/health || exit 1
