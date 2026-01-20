# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Start all apps concurrently (shell + all remotes)
pnpm dev

# Start individual apps
pnpm dev:shell    # Shell host at http://localhost:3100
pnpm dev:react    # React remote at http://localhost:3101
pnpm dev:vue      # Vue remote at http://localhost:3102
pnpm dev:angular  # Angular remote at http://localhost:3103

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
| react-remote | 3101 | React 18 | Exposes ProductList, CartWidget, App |
| vue-remote | 3102 | Vue 3 | Exposes mount function, Dashboard, Charts |
| angular-remote | 3103 | Angular 17 | Exposes mount function, SettingsComponent |

### Module Federation Pattern

**Shell consumes remotes via webpack config:**
```javascript
remotes: {
  reactRemote: 'reactRemote@http://localhost:3101/remoteEntry.js',
  vueRemote: 'vueRemote@http://localhost:3102/remoteEntry.js',
  angularRemote: 'angularRemote@http://localhost:3103/remoteEntry.js',
}
```

**Remote type declarations:** `src/federation/types.d.ts`

### Cross-Framework Integration

- **React remotes**: Direct lazy imports with Suspense
- **Vue/Angular remotes**: Manual mount/unmount pattern via exposed `mount` function
  - Mount function called in `useEffect` with container ref
  - Returns cleanup function for unmount

### Key Files

- `src/components/Layout/Shell.tsx` - Main layout with sticky header and back navigation
- `src/pages/Home.tsx` - Home page with searchable demo cards
- `src/components/RemoteWrapper/*` - Wrapper components for each remote framework
- `src/components/RemoteWrapper/ErrorBoundary.tsx` - Catches remote loading failures
- `src/App.tsx` - Route definitions
- `webpack.config.js` - Module federation configuration

### Shared Dependencies

React, ReactDOM, and React Router are configured as singletons to prevent duplicate instances across remotes. The shell eagerly loads these dependencies.
