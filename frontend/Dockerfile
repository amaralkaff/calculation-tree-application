# Multi-stage build for production (Railway deployment)
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy all source code first
COPY . .

# Smart detection: Check if we're in root or frontend directory
# If in root (workspace detected), move to frontend subdirectory
RUN if [ -f "package.json" ] && grep -q "calculation-tree-app" package.json; then \
      echo "Detected workspace root, moving to frontend directory..." && \
      cd frontend && \
      cp -r . /app-frontend && \
      cd / && \
      rm -rf /app && \
      mv /app-frontend /app; \
    fi

WORKDIR /app

# Verify we're now in the correct directory
RUN cat package.json | grep "calculation-tree-frontend" || (echo "ERROR: Still in wrong directory!" && exit 1)

# Remove any workspace package-lock.json
RUN rm -f package-lock.json

# Create a minimal package-lock.json to prevent workspace detection
RUN echo '{"name":"calculation-tree-frontend","lockfileVersion":3,"requires":true,"packages":{}}' > package-lock.json

# Install dependencies (force standalone mode, no workspaces)
RUN npm install --legacy-peer-deps --no-audit

# Build the application (frontend build script: tsc && vite build)
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx configuration inline
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript; \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        return 200 "OK"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
