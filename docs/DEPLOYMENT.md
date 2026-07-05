# Deployment Guide

## Supported Platforms

| Platform | Method | One-Click |
|----------|--------|-----------|
| Coolify | Dockerfile build pack | Yes |
| AWS ECS | Docker image | Fargate compatible |
| Kubernetes | Docker image | Standard Deployment |
| Cloudflare Pages | Wrangler CLI | Yes |
| Netlify | Netlify CLI | Yes |

---

## Coolify Deployment

**Prerequisites:** Coolify server with Docker installed.

### Steps

1. In Coolify, create a new application
2. Select **Build Pack: Dockerfile** (not Nixpacks)
3. Set the repository URL
4. No additional build commands needed — `Dockerfile` handles everything
5. Deploy

The build process:
- Pulls `node:20-alpine` → builds `dist/`
- Copies into `nginx:alpine`
- Exposes port 80 with healthcheck at `/health`

---

## AWS ECS (Fargate)

### 1. Push image to ECR

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.ap-south-1.amazonaws.com
docker tag optiflow-website:latest <account>.dkr.ecr.ap-south-1.amazonaws.com/optiflow-website:latest
docker push <account>.dkr.ecr.ap-south-1.amazonaws.com/optiflow-website:latest
```

### 2. Task Definition

```json
{
  "family": "optiflow-website",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "<account>.dkr.ecr.ap-south-1.amazonaws.com/optiflow-website:latest",
      "portMappings": [{ "containerPort": 80 }],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 10
      }
    }
  ]
}
```

### 3. Service with ALB

Create an Application Load Balancer with a target group pointing to port 80. Attach health checks to `/health`.

---

## Kubernetes

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: optiflow-website
spec:
  replicas: 3
  selector:
    matchLabels:
      app: optiflow-website
  template:
    metadata:
      labels:
        app: optiflow-website
    spec:
      containers:
        - name: web
          image: optiflow-website:latest
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /health
              port: 80
            periodSeconds: 10
          resources:
            requests:
              cpu: 100m
              memory: 64Mi
            limits:
              cpu: 500m
              memory: 128Mi
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: optiflow-website
spec:
  type: ClusterIP
  selector:
    app: optiflow-website
  ports:
    - port: 80
      targetPort: 80
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: optiflow-website
spec:
  rules:
    - host: optiflow.in
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: optiflow-website
                port:
                  number: 80
```

---

## Manual Server Deployment

```bash
# Build
npm ci --ignore-scripts
npm run build

# Serve with nginx
cp -r dist/* /var/www/optiflow/
cp nginx.conf /etc/nginx/sites-enabled/optiflow.conf
nginx -t && systemctl reload nginx
```

## Adding a Backend API

1. Set `API_BASE_URL` in your environment
2. Update `nginx.conf` — replace the `/api/` 503 stub with a proxy:

```nginx
location /api/ {
    proxy_pass http://backend:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

3. Frontend can call `/api/` endpoints without CORS issues (same origin via nginx proxy).
