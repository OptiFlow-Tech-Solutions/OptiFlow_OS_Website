# Stage 1: Build website
FROM node:20.18-alpine AS builder

WORKDIR /app

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

COPY site.json ./
COPY src/ src/
COPY assets/ assets/
COPY scripts/ scripts/

RUN node scripts/assemble.mjs

# Stage 2: Build nginx brotli module
FROM nginx:1.27.3-alpine AS brotli-builder

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

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
    && cp objs/ngx_http_brotli_static_module.so /tmp/ \
    && apk del .build-deps \
    && rm -rf /tmp/nginx-* /tmp/ngx_brotli

# Stage 3: Runtime
FROM nginx:1.27.3-alpine

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

COPY --from=brotli-builder /tmp/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=brotli-builder /tmp/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/

RUN apk add --no-cache curl tzdata \
    && rm -rf /var/cache/apk/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -sf http://localhost/health || exit 1
