# Stage 1: Build website
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY site.json ./
COPY src/ src/
COPY assets/ assets/
COPY scripts/ scripts/

RUN node scripts/assemble.mjs

# Stage 2: Build nginx brotli module
FROM nginx:1.27-alpine AS brotli-builder

RUN apk add --no-cache --virtual .build-deps \
    gcc libc-dev make cmake git pcre-dev openssl-dev zlib-dev brotli-dev

RUN git clone --depth=1 --recurse-submodules \
    https://github.com/google/ngx_brotli /tmp/ngx_brotli \
    && NGINX_VER=$(nginx -v 2>&1 | cut -d'/' -f2) \
    && wget -qO- https://nginx.org/download/nginx-${NGINX_VER}.tar.gz | tar xz -C /tmp \
    && cd /tmp/nginx-${NGINX_VER} \
    && ./configure --with-compat --add-dynamic-module=/tmp/ngx_brotli \
    && make modules \
    && cp objs/ngx_http_brotli_filter_module.so /tmp/ \
    && cp objs/ngx_http_brotli_static_module.so /tmp/

# Stage 3: Runtime
FROM nginx:1.27-alpine

COPY --from=brotli-builder /tmp/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=brotli-builder /tmp/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/

RUN apk add --no-cache curl tzdata

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -sf http://localhost/health || exit 1
