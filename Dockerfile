# Multi-stage build for all microfrontend apps
FROM node:20-alpine AS builder

# Install pnpm and Expo CLI
RUN npm install -g pnpm@9 @expo/cli

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Shared packages
COPY packages/shared/package.json ./packages/shared/

# Web apps
COPY apps/shell/package.json ./apps/shell/
COPY apps/shell/server/package.json ./apps/shell/server/
COPY apps/healthcare-admin/package.json ./apps/healthcare-admin/
COPY apps/healthcare-admin/api/package.json ./apps/healthcare-admin/api/
COPY apps/healthcare-marketing/package.json ./apps/healthcare-marketing/
COPY apps/assest-management/package.json ./apps/assest-management/
COPY apps/cmms/package.json ./apps/cmms/
COPY apps/FamilyFun/frontend/package.json ./apps/FamilyFun/frontend/
COPY apps/BookingSystem/packages/guest-portal/package.json ./apps/BookingSystem/packages/guest-portal/
COPY apps/BookingSystem/packages/host-portal/package.json ./apps/BookingSystem/packages/host-portal/
COPY apps/BookingSystem/packages/shared/package.json ./apps/BookingSystem/packages/shared/
COPY apps/BookingSystem/packages/ui-components/package.json ./apps/BookingSystem/packages/ui-components/
COPY apps/elearning/admin-portal/package.json ./apps/elearning/admin-portal/
COPY apps/elearning/student-portal/package.json ./apps/elearning/student-portal/

# Mobile app
COPY apps/healthcare-mobile/package.json ./apps/healthcare-mobile/

RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

ARG REMOTE_HOST=http://localhost
ENV REMOTE_HOST=${REMOTE_HOST}

# Build all web apps
RUN pnpm --filter @mfe/shell build:prod
RUN pnpm --filter @mfe/healthcare-admin build:prod
RUN pnpm --filter @mfe/healthcare-marketing build:prod
RUN pnpm --filter @mfe/assest-management build
RUN pnpm --filter @mfe/cmms build
RUN pnpm --filter @mfe/family-fun build
RUN pnpm --filter @mfe/booking-guest-portal build
RUN pnpm --filter @mfe/booking-host-portal build
RUN pnpm --filter @mfe/elearning-admin-portal build
RUN pnpm --filter @mfe/elearning-student-portal build

# Build healthcare-mobile as a static web app
RUN pnpm --filter @hopefull/mobile build:web

# Production stage — serve all static builds with nginx
FROM nginx:alpine AS production

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/apps/shell/dist                              /usr/share/nginx/html/shell
COPY --from=builder /app/apps/healthcare-admin/dist                   /usr/share/nginx/html/healthcare-admin
COPY --from=builder /app/apps/healthcare-marketing/dist               /usr/share/nginx/html/healthcare-marketing
COPY --from=builder /app/apps/assest-management/dist                  /usr/share/nginx/html/assest-management
COPY --from=builder /app/apps/cmms/dist                               /usr/share/nginx/html/cmms
COPY --from=builder /app/apps/FamilyFun/frontend/dist                 /usr/share/nginx/html/family-fun
COPY --from=builder /app/apps/BookingSystem/packages/guest-portal/dist /usr/share/nginx/html/booking-guest-portal
COPY --from=builder /app/apps/BookingSystem/packages/host-portal/dist  /usr/share/nginx/html/booking-host-portal
COPY --from=builder /app/apps/elearning/admin-portal/dist             /usr/share/nginx/html/elearning-admin-portal
COPY --from=builder /app/apps/elearning/student-portal/dist           /usr/share/nginx/html/elearning-student-portal
COPY --from=builder /app/apps/healthcare-mobile/dist                  /usr/share/nginx/html/healthcare-mobile

EXPOSE 80 3100 3101 3102 3103 3104 3105 3106 3107 3108 3109 3110

CMD ["nginx", "-g", "daemon off;"]
