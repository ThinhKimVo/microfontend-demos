# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Start all apps concurrently (shell + all remotes)
pnpm dev

# Start individual apps
pnpm dev:shell              # Shell host at http://localhost:3100
pnpm dev:hopefull-admin     # Hopefull Admin at http://localhost:3101
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

### Apps Structure

| App | Port | Framework | Role |
|-----|------|-----------|------|
| shell | 3100 | React 18 | Host application with routing and layout |
| hopefull-admin | 3101 | React 18 | Hopefull Admin dashboard |
| assest-management | 3102 | React 18 | Asset Management app |
| cmms | 3103 | React 18 | CMMS app |
| family-fun | 3104 | React 18 | Family events platform |
| booking-guest-portal | 3105 | React 18 | Guest booking portal |
| booking-host-portal | 3106 | React 18 | Host property management |
| elearning-admin-portal | 3107 | React 18 | E-Learning admin portal |
| elearning-student-portal | 3108 | React 18 | E-Learning student portal |

### Module Federation Pattern

**Shell consumes remotes via webpack config:**
```javascript
remotes: {
  hopefullAdmin: 'hopefullAdmin@http://localhost:3101/remoteEntry.js',
  assestManagement: 'assestManagement@http://localhost:3102/remoteEntry.js',
  cmms: 'cmms@http://localhost:3103/remoteEntry.js',
  familyFun: 'familyFun@http://localhost:3104/remoteEntry.js',
  bookingGuestPortal: 'bookingGuestPortal@http://localhost:3105/remoteEntry.js',
  bookingHostPortal: 'bookingHostPortal@http://localhost:3106/remoteEntry.js',
  elearningAdminPortal: 'elearningAdminPortal@http://localhost:3107/remoteEntry.js',
  elearningStudentPortal: 'elearningStudentPortal@http://localhost:3108/remoteEntry.js',
}
```

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

### Key Files

- `src/components/Layout/Shell.tsx` - Main layout with sticky header and back navigation
- `src/pages/Home.tsx` - Home page with searchable demo cards
- `src/components/RemoteWrapper/*` - Wrapper components for each remote framework
- `src/components/RemoteWrapper/ErrorBoundary.tsx` - Catches remote loading failures
- `src/App.tsx` - Route definitions
- `src/federation/types.d.ts` - TypeScript declarations for remote modules
- `webpack.config.js` - Module federation configuration
- `../../scripts/integrate-remote.js` - Script to integrate new remotes

### Shared Dependencies

React, ReactDOM, and React Router are configured as singletons to prevent duplicate instances across remotes. The shell eagerly loads these dependencies.

## Deployment

### PM2 with Cloudflare Tunnel (No Sudo Required)

```bash
# Deploy all apps with Cloudflare Tunnel
./scripts/deploy-pm2.sh deploy

# Check status
./scripts/deploy-pm2.sh status

# View logs
./scripts/deploy-pm2.sh logs

# Get Cloudflare Tunnel URL
ssh user@server "pm2 logs cloudflare-tunnel --lines 10 --nostream | grep trycloudflare"
```

### Production Build

```bash
# Build all apps for production
pnpm build:prod

# Build shell only
pnpm --filter @mfe/shell build:prod
```

### Production Webpack Config

The `webpack.config.prod.js` uses environment variables:
- `REMOTE_HOST` - Base URL for remote apps (default: `http://10.30.10.18`)
