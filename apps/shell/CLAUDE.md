# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Start all apps concurrently (shell + all remotes)
pnpm dev

# Start individual apps
pnpm dev:shell              # Shell host at http://localhost:3100
pnpm dev:healthcare-admin     # Healthcare Admin at http://localhost:3101
pnpm dev:assestmanagement   # Asset Management at http://localhost:3102
pnpm dev:cmms               # CMMS at http://localhost:3103
pnpm dev:familyfun          # FamilyFun at http://localhost:3104
pnpm dev:booking-guest      # Booking Guest Portal at http://localhost:3105
pnpm dev:booking-host       # Booking Host Portal at http://localhost:3106
pnpm dev:elearn-admin       # E-Learning Admin at http://localhost:3107
pnpm dev:elearn-student     # E-Learning Student at http://localhost:3108

# Integrate a new remote
pnpm integrate           # Interactive mode
pnpm integrate:scan      # Auto-integrate all new apps from /apps

# Validate React versions
pnpm validate            # Check version compatibility

# Build all apps
pnpm build

# Type check
npx tsc --noEmit
```

## Architecture

This is a **Webpack 5 Module Federation** microfrontend monorepo. The shell app (this directory) is the host that dynamically loads remote applications at runtime.

### Directory Structure

```
src/
├── api/                        # API layer
│   ├── httpClient.ts           # Centralized fetch wrapper
│   └── appsApi.ts              # CRUD operations for apps
├── components/
│   ├── Admin/                  # Admin page components
│   │   ├── EditAppModal.tsx    # Modal form for app editing
│   │   ├── AppsTable.tsx       # Table display component
│   │   ├── ScreenshotManager.tsx # Screenshot upload UI
│   │   └── index.ts
│   ├── AppDetail/              # AppDetail page components
│   │   ├── HeroSection.tsx     # Hero with gradient
│   │   ├── ScreenshotCarousel.tsx # Screenshot carousel
│   │   └── index.ts
│   ├── Icons/                  # Shared SVG icons
│   │   └── index.tsx           # BackIcon, ArrowIcon, SearchIcon, etc.
│   ├── Layout/
│   │   └── Shell.tsx           # Main layout with header
│   └── RemoteWrapper/          # Microfrontend wrappers
│       ├── createRemoteWrapper.tsx  # Factory function
│       ├── ErrorBoundary.tsx
│       └── [8 wrapper files]   # One-liner wrappers using factory
├── constants/
│   ├── config.ts               # API_BASE, timeouts
│   └── themes.ts               # gradientPresets
├── hooks/                      # Custom React hooks
│   ├── useLoadApps.ts          # App loading with loading state
│   ├── useMessage.ts           # Toast message with auto-dismiss
│   ├── useCarousel.ts          # Slide navigation logic
│   └── index.ts
├── pages/
│   ├── Admin.tsx               # Admin panel (~250 lines)
│   ├── AppDetail.tsx           # App detail page (~180 lines)
│   └── Home.tsx                # Home page with cards
├── services/
│   └── appsService.ts          # Facade re-exporting from api/utils
├── styles/
│   ├── index.css
│   └── appDetail.css           # AppDetail content styles
├── utils/
│   └── appHelpers.ts           # Array utilities, generators
├── data/
│   └── apps.ts                 # TypeScript interfaces
└── federation/
    └── types.d.ts              # Remote module declarations
```

### Apps Structure

| App | Port | Framework | Role |
|-----|------|-----------|------|
| shell | 3100 | React 18 | Host application with routing and layout |
| shell-api | 3150 | Express | Backend API server (PostgreSQL) |
| healthcare-admin | 3101 | React 18 | Healthcare Admin dashboard |
| healthcare-api | 3001 | NestJS | Healthcare API (PostgreSQL/Prisma) |
| assest-management | 3102 | React 18 | Asset Management app |
| cmms | 3103 | React 18 | CMMS app |
| family-fun | 3104 | React 18 | Family events platform |
| booking-guest-portal | 3105 | React 18 | Guest booking portal |
| booking-host-portal | 3106 | React 18 | Host property management |
| elearning-admin-portal | 3107 | React 18 | E-Learning admin portal |
| elearning-student-portal | 3108 | React 18 | E-Learning student portal |
| healthcare-marketing | 3109 | React 18 | Healthcare Marketing site |

### Module Federation Pattern

**Shell consumes remotes via webpack config:**

Development (`webpack.config.js`):
```javascript
remotes: {
  healthcareAdmin: 'healthcareAdmin@http://localhost:3101/remoteEntry.js',
  // ... other remotes at localhost:PORT
}
```

Production (`webpack.config.prod.js`):
```javascript
remotes: {
  healthcareAdmin: 'healthcareAdmin@/mfe/3101/remoteEntry.js',
  // ... all remotes use relative /mfe/PORT paths
}
```
In production, the shell's Express static server (`server/static.js`) proxies `/mfe/:port/*` requests to `localhost:port`, avoiding mixed content issues when served via HTTPS.

**Remote type declarations:** `src/federation/types.d.ts`

### Adding New Remotes

Use the integration script to automate adding new remotes:

```bash
# Interactive mode - single remote
pnpm integrate

# Scan mode - auto-integrate all new apps
pnpm integrate:scan

# With CLI options
node scripts/integrate-remote.js --name my-app --port 3109 --framework react
```

**Scan mode** auto-detects and integrates all apps in `/apps` that have Module Federation configured. Apps using Vite or without `ModuleFederationPlugin` are skipped with a message.

The script updates:
- `webpack.config.js` - Adds remote entry
- `src/federation/types.d.ts` - Adds type declarations
- `src/components/RemoteWrapper/` - Creates wrapper component
- `src/App.tsx` - Adds route
- `src/pages/Home.tsx` - Adds demo card
- Root `package.json` - Adds dev script and updates main `dev` command

### Remote Integration

All remotes use the mount/unmount pattern:
- Each remote exposes a `mount` function that takes an HTML element
- Mount function is called in `useEffect` with container ref
- Returns cleanup function for unmount

**Important:** Remote wrappers should always import the `mount` function, not the `App` component directly. This is because:
- The mount function uses `MemoryRouter` internally (isolated routing)
- The App component typically has its own `BrowserRouter`
- Importing App directly causes "Router inside Router" errors

**RemoteWrapper Factory Pattern:**
```tsx
// src/components/RemoteWrapper/createRemoteWrapper.tsx
import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'my-app',
  containerClassName: 'my-app-remote-container',
  loadMount: () => import('myApp/mount'),
});
```

The factory handles StrictMode double-mount, error handling, and cleanup automatically.

## Hooks Usage

Custom hooks are located in `src/hooks/`:

```tsx
import { useLoadApps, useMessage, useCarousel } from '../hooks';

// Load apps with loading state
const { apps, loading, reload } = useLoadApps();

// Toast messages with auto-dismiss
const { message, showMessage } = useMessage(3000);
showMessage('success', 'Saved!');

// Carousel navigation
const { currentSlide, nextSlide, prevSlide, goToSlide } = useCarousel(totalSlides);
```

## Component Organization

### Icons
All shared icons are in `src/components/Icons/index.tsx`:
```tsx
import { BackIcon, ArrowIcon, SearchIcon, ChevronLeftIcon } from '../components/Icons';

// Icons accept optional className prop
<BackIcon className="w-6 h-6" />
```

### Admin Components
```tsx
import { EditAppModal, AppsTable, ScreenshotManager } from '../components/Admin';
```

### AppDetail Components
```tsx
import { HeroSection, ScreenshotCarousel } from '../components/AppDetail';
```

## Design System: Neo-Brutalist Kinetic

The shell follows a high-impact **Neo-Brutalist Kinetic** aesthetic, characterized by bold typography, glassmorphism, and dynamic gradients.

### Core Color Palette
- **Primary / Accent**: `#84AF48` (Branded as `accent-cyan` or `accent.primary` in Tailwind)
- **Background**: `#0A0A0B` (Obsidian / Deep Surface)
- **Accents**: 
  - Emerald: `#00FF9C`
  - Magenta: `#FF00E5`
- **Text**: `slate-300` (muted), `white` (prominent), `obsidian` (on primary backgrounds)

### Typography
- **Headings**: `Outfit` (sans-serif, bold/black weights)
- **Monospace/Metadata**: `JetBrains Mono`
- **Body**: Standard sans-serif (Inter/system fallback)

### Key UI Patterns
- **Glassmorphism**: Use the `.glass-panel` utility for containers.
- **Micro-interactions**: Standardized hover transitions to `accent-cyan` (#84AF48).
- **Animations**: Staggered reveals using `animate-fade-in-up` with progressive `animation-delay`.
- **Glows**: Subtle radial glows using the primary brand color for high-visibility triggers.

## Key Files

### Core
- `src/App.tsx` - Route definitions
- `src/components/Layout/Shell.tsx` - Main layout with sticky header
- `src/data/apps.ts` - TypeScript interfaces (AppInfo, AppScreenshot)
- `public/data/apps.json` - App configuration data (source of truth)

### Pages
- `src/pages/Home.tsx` - Home page with searchable demo cards
- `src/pages/AppDetail.tsx` - App detail page with availability detection
- `src/pages/Admin.tsx` - Admin panel for managing app data

### Services & API
- `src/services/appsService.ts` - Facade re-exporting from specialized modules
- `src/api/appsApi.ts` - CRUD operations for apps
- `src/api/httpClient.ts` - Centralized fetch wrapper
- `src/utils/appHelpers.ts` - Array utilities and generators
- `src/constants/themes.ts` - Gradient presets
- `src/constants/config.ts` - API configuration

### Remote Integration
- `src/components/RemoteWrapper/createRemoteWrapper.tsx` - Factory for wrappers
- `src/components/RemoteWrapper/ErrorBoundary.tsx` - Error boundary for remotes
- `src/federation/types.d.ts` - TypeScript declarations for remote modules
- `webpack.config.js` - Module federation configuration
- `../../scripts/integrate-remote.js` - Script to integrate new remotes

### Admin Page

The shell includes an admin panel at `/admin` for managing app information without code changes.

**Features:**
- Add, edit, delete apps
- Configure app metadata (name, description, port, framework, version)
- Color theme presets
- Toggle "Integrated & Deployed" status
- Export to JSON for permanent updates

**Data Flow:**
1. App data is stored in PostgreSQL database
2. Admin changes are saved directly to database
3. Click "Export JSON" to download a backup
4. Use "Refresh" to reload from database

**App Availability Detection:**
- The AppDetail page automatically checks if a remote app is deployed
- Makes HEAD request to `{host}:{port}/remoteEntry.js` with 3s timeout
- Shows "Checking..." → "Online" (green) or "Offline" (amber)
- Launch button disabled for unavailable apps
- Admin can manually override with `integrated: false` field

### Shared Dependencies

React, ReactDOM, and React Router are configured as singletons to prevent duplicate instances across remotes. The shell eagerly loads these dependencies.

**Version compatibility is critical:** All remotes must use compatible versions of shared singleton packages. For example:
- `react-router-dom` v6.x is not compatible with v7.x
- If a remote uses a different major version, you'll see "Unsatisfied version" warnings and routing failures
- Always check the shell's versions and match them in remote apps

## Deployment

### PM2 with Docker PostgreSQL

The deployment script manages:
- **PostgreSQL databases** via Docker containers (ports 5433, 5434)
- **Shell API server** via PM2 (port 3150)
- **Healthcare API server** via PM2 (port 3001)
- **Shell frontend** via Express static server with API proxy (port 3100)
- **Remote apps** via PM2 static servers (ports 3101-3109)

```bash
# Deploy all apps with database
./scripts/deploy-pm2.sh deploy

# Deploy a single app only
./scripts/deploy-pm2.sh deploy:app shell
./scripts/deploy-pm2.sh deploy:app shell-api
./scripts/deploy-pm2.sh deploy:app healthcare-admin
./scripts/deploy-pm2.sh deploy:app assest-management
./scripts/deploy-pm2.sh deploy:app cmms
./scripts/deploy-pm2.sh deploy:app family-fun
./scripts/deploy-pm2.sh deploy:app booking-guest-portal
./scripts/deploy-pm2.sh deploy:app booking-host-portal
./scripts/deploy-pm2.sh deploy:app elearning-admin-portal
./scripts/deploy-pm2.sh deploy:app elearning-student-portal

# Restart a single app
./scripts/deploy-pm2.sh restart:app shell

# View logs for a single app
./scripts/deploy-pm2.sh logs:app healthcare-admin

# List all managed apps
./scripts/deploy-pm2.sh list

# Check status (includes database)
./scripts/deploy-pm2.sh status

# View all logs
./scripts/deploy-pm2.sh logs

# Get Cloudflare Tunnel URL
ssh user@server "pm2 logs cloudflare-tunnel --lines 10 --nostream | grep trycloudflare"
```

### Database Commands

```bash
# Start database only
./scripts/deploy-pm2.sh db:start

# Stop database
./scripts/deploy-pm2.sh db:stop

# Check database status
./scripts/deploy-pm2.sh db:status

# Initialize/reset database schema
./scripts/deploy-pm2.sh db:init

# View database logs
./scripts/deploy-pm2.sh db:logs
```

### Local Development with Database

```bash
# Start PostgreSQL locally with Docker Compose
cd apps/shell
docker-compose up -d

# Start API server (pnpm manages deps via workspace)
cd server && npm run dev

# Start shell frontend (in another terminal)
pnpm dev:shell
```

### Production Build

```bash
# Build all apps for production
pnpm build:prod

# Build shell only
pnpm --filter @mfe/shell build:prod
```

### Production Architecture

In production, the shell frontend runs via an Express static server (`server/static.js`) on port 3100 that:
- Serves the built `dist/` files with SPA fallback
- Proxies `/api` and `/screenshots` requests to the shell API server (port 3150)
- Proxies `/mfe/:port/*` requests to remote app ports (avoiding mixed content over HTTPS)

The `webpack.config.prod.js` uses relative URLs (`/mfe/PORT/remoteEntry.js`) for Module Federation remotes instead of hardcoded host/port URLs. All remote apps use `publicPath: 'auto'` so chunks resolve correctly regardless of the serving origin.

This means both `http://10.30.10.18:3100` and `https://demo.saigontechnology.vn` work without mixed content issues.

### pnpm Workspace

All packages are managed by pnpm workspace, including backend servers:
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'apps/FamilyFun/frontend'
  - 'apps/BookingSystem/packages/*'
  - 'apps/elearning/*'
  - 'apps/shell/server'          # @mfe/shell-api
  - 'apps/healthcare-admin/api'  # @hopefull/api
```

A single `pnpm install` at the root installs dependencies for all workspace packages.

## Refactoring Guidelines

### Adding New Components
1. Create component in appropriate subdirectory under `src/components/`
2. Add export to the directory's `index.ts`
3. Import from the directory, not the file directly

### Adding New Icons
1. Add to `src/components/Icons/index.tsx`
2. Follow the `IconProps` interface pattern with optional `className`

### Adding New Hooks
1. Create in `src/hooks/` with `use` prefix
2. Export from `src/hooks/index.ts`

### Service Layer Changes
1. Add API calls to `src/api/appsApi.ts`
2. Add utilities to `src/utils/appHelpers.ts`
3. Re-export from `src/services/appsService.ts` for backward compatibility

### CSS Organization
- **Global Styles**: `src/styles/index.css` (Contains the design system tokens and base classes)
- **Utility Classes**: Extends Tailwind with `accent-cyan`, `obsidian`, and custom keyframes (`glow-pulse`, `fade-in-up`).
- **Component-specific**: `src/styles/[componentName].css` (e.g., `appDetail.css` for complex layout styles)
- **Best Practices**:
  - Prefer CSS variables from `:root` for brand alignment.
  - Use `@apply` in `index.css` for reusable patterns like `.glass-panel`.
  - Avoid hardcoded colors like `emerald-600` or `blue-500`; use `accent-cyan` instead.
