# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Development (standalone at http://localhost:3101)
pnpm dev                    # or: webpack serve --mode development

# Production build
pnpm build                  # webpack --mode production
pnpm build:prod             # webpack --config webpack.config.prod.js

# From monorepo root
pnpm dev:healthcare-admin   # Start this app only
pnpm dev                    # Start all apps (shell + all remotes)

# Type check (no dedicated script — run manually)
npx tsc --noEmit

# Lint
pnpm lint                   # eslint . --ext .ts,.tsx
```

## Architecture

This is a **Webpack Module Federation remote** app within a pnpm monorepo. It runs as a standalone React app at port 3101 and is also consumed by the shell host at port 3100.

### Module Federation

- **Federation name**: `healthcareAdmin`
- **Exposes**: `./App` (raw component) and `./mount` (mount function)
- **Shared singletons**: `react`, `react-dom`, `react-router-dom`
- The shell loads this app via `healthcareAdmin@http://localhost:3101/remoteEntry.js`

### Dual Entry Points

- **Standalone** (`src/index.tsx` → `src/bootstrap.tsx`): Uses `BrowserRouter`, renders directly into DOM
- **Federated** (`src/expose/mount.tsx`): Uses `MemoryRouter` for isolated routing when loaded inside the shell. The `index.tsx` → `bootstrap.tsx` async import pattern is required by Module Federation to ensure shared dependencies load correctly.

### Key Tech Stack

- React 18, TypeScript, Tailwind CSS 3
- **State**: Zustand (persisted auth store at `store/auth.ts`)
- **Data fetching**: TanStack React Query + Axios
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Utilities**: `clsx` + `tailwind-merge` via `cn()` helper in `lib/utils.ts`

### Path Alias

`@` maps to `src/` (configured in `webpack.config.js` resolve.alias).

## Source Structure

```
src/
├── App.tsx                 # Routes with ProtectedRoute wrapper
├── bootstrap.tsx           # Standalone entry (BrowserRouter)
├── expose/mount.tsx        # Federated entry (MemoryRouter)
├── store/auth.ts           # Zustand auth store (persisted to localStorage)
├── services/
│   ├── api.ts              # Axios instance with auth interceptor
│   └── admin.ts            # All API service functions (auth, CRUD endpoints)
├── lib/utils.ts            # cn(), formatCurrency(), formatDate()
├── components/
│   ├── layout/Layout.tsx   # Sidebar + main content layout
│   └── ui/Modal.tsx        # Reusable modal component
├── pages/
│   ├── Login.tsx
│   ├── dashboard/          # Dashboard with analytics
│   ├── users/              # User management
│   ├── therapists/         # Therapist management
│   ├── appointments/       # Appointment management
│   ├── categories/         # Specialization categories
│   ├── payments/           # Payment records
│   ├── settings/           # Admin settings
│   └── support/            # Support tickets
└── hooks/                  # Custom hooks directory (currently empty)
```

## API Layer

- **Base URL**: Configured via `process.env.API_URL`, defaults to `http://localhost:3001/api/v1`
- **Auth**: JWT token stored in Zustand persist (`localStorage` key: `healthcare-admin-auth`), auto-attached via Axios request interceptor
- **401 handling**: Axios response interceptor clears auth and redirects to `/login`
- All service functions are in `services/admin.ts`, grouped by domain (auth, dashboard, users, therapists, appointments, payments, categories, settings, support)

## Auth Flow

- Login via `authService.login()` → stores admin + accessToken in Zustand
- `ProtectedRoute` in `App.tsx` guards all routes except `/login`
- Session timeout: 2 hours of inactivity (bypassed if "remember me" enabled)
- Activity tracking via DOM events (mousedown, keydown, scroll, touchstart)
- 2FA support: routes require `is2FAVerified` if `is2FAEnabled` is true

## Tailwind

Custom `primary` color scale (indigo-based, 50-900) defined in `tailwind.config.js`. Use `cn()` from `lib/utils.ts` for conditional class merging.

## Production Config

`webpack.config.prod.js` sets `publicPath` to `${REMOTE_HOST}:3101/` where `REMOTE_HOST` defaults to `http://10.30.10.18`. The `API_URL` env var is only injected in the dev webpack config via `DefinePlugin`.
