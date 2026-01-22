# Multi-stage build for all microfrontend apps
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/shell/package.json ./apps/shell/
COPY apps/react-remote/package.json ./apps/react-remote/
COPY apps/vue-remote/package.json ./apps/vue-remote/
COPY apps/angular-remote/package.json ./apps/angular-remote/
COPY apps/hopefull-admin/package.json ./apps/hopefull-admin/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set the remote host for production builds
ARG REMOTE_HOST=http://10.30.10.18
ENV REMOTE_HOST=${REMOTE_HOST}

# Build all apps with production webpack config
RUN cd apps/shell && pnpm exec webpack --config webpack.config.prod.js
RUN cd apps/react-remote && pnpm exec webpack --config webpack.config.prod.js
RUN cd apps/vue-remote && pnpm exec webpack --config webpack.config.prod.js
RUN cd apps/angular-remote && pnpm exec webpack --config webpack.config.prod.js
RUN cd apps/hopefull-admin && pnpm exec webpack --config webpack.config.prod.js

# Production stage with nginx
FROM nginx:alpine AS production

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html/shell
COPY --from=builder /app/apps/react-remote/dist /usr/share/nginx/html/react-remote
COPY --from=builder /app/apps/vue-remote/dist /usr/share/nginx/html/vue-remote
COPY --from=builder /app/apps/angular-remote/dist /usr/share/nginx/html/angular-remote
COPY --from=builder /app/apps/hopefull-admin/dist /usr/share/nginx/html/hopefull-admin

# Expose all ports
EXPOSE 3100 3101 3102 3103 3105

CMD ["nginx", "-g", "daemon off;"]
