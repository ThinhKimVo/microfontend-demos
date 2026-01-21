# Microfrontend Demo - Webpack Module Federation

A demonstration of cross-framework microfrontends using Webpack 5 Module Federation.

## Architecture

```
Shell (Host) - React          → http://localhost:3100
├── React Remote              → http://localhost:3101
├── Vue Remote                → http://localhost:3102
├── Angular Remote            → http://localhost:3103
└── Hopefull Adapter          → http://localhost:3104
```

## Features

- **Cross-Framework Federation**: React, Vue, and Angular apps working together
- **Shared Dependencies**: React and other libraries shared as singletons
- **Independent Deployment**: Each remote can be deployed separately
- **Runtime Integration**: Components loaded dynamically at runtime
- **Framework Adapters**: Vue and Angular components wrapped for React host

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
cd /Users/thinh.vo/sts/microfrontend
pnpm install
```

### Development

Start all applications:

```bash
pnpm dev
```

Or start individual applications:

```bash
pnpm dev:shell      # Shell only
pnpm dev:react      # React remote only
pnpm dev:vue        # Vue remote only
pnpm dev:angular    # Angular remote only
```

### Access

- Shell (main app): http://localhost:3100
- React Remote: http://localhost:3101
- Vue Remote: http://localhost:3102
- Angular Remote: http://localhost:3103

## Project Structure

```
microfrontend/
├── apps/
│   ├── shell/              # Host application (React)
│   ├── react-remote/       # React microfrontend
│   ├── vue-remote/         # Vue microfrontend
│   ├── angular-remote/     # Angular microfrontend
│   └── hopefull-adapter/   # Adapter for external apps
├── packages/
│   └── shared/             # Shared utilities (EventBus, types)
└── scripts/
    ├── start-all.sh
    └── integrate-remote.js # Integration automation script
```

## Integrating New Remotes

Use the integration script to automatically add a new remote to the shell:

### Quick Start

```bash
pnpm integrate
```

### Command-Line Options

```bash
node scripts/integrate-remote.js --name my-app --port 3105 --framework react
```

| Option | Description |
|--------|-------------|
| `--name` | Remote name (kebab-case, e.g., `user-dashboard`) |
| `--port` | Dev server port (e.g., `3105`) |
| `--framework` | `react`, `vue`, `angular`, or `other` |
| `--description` | Short description for the home page |
| `--features` | Comma-separated feature list |

### What the Script Does

1. Updates `shell/webpack.config.js` with new remote entry
2. Adds TypeScript declarations to `federation/types.d.ts`
3. Creates wrapper component (`{Name}RemoteWrapper.tsx`)
4. Adds route to `shell/src/App.tsx`
5. Updates root `package.json` with dev script
6. Adds demo card to home page
7. Creates new remote app from template (optional)

### Manual Integration

If integrating an existing project manually:

1. **Add Module Federation to your webpack.config.js:**

```javascript
new ModuleFederationPlugin({
  name: 'yourRemote',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
    './mount': './src/expose/mount',  // For non-React frameworks
  },
  shared: {
    react: { singleton: true, requiredVersion: deps.react },
    'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
  },
})
```

2. **Add remote to shell's webpack.config.js:**

```javascript
remotes: {
  yourRemote: 'yourRemote@http://localhost:YOUR_PORT/remoteEntry.js',
}
```

3. **Add type declarations** in `shell/src/federation/types.d.ts`

4. **Create wrapper component** in `shell/src/components/RemoteWrapper/`

5. **Add route** in `shell/src/App.tsx`

### Mount Pattern for Non-React Frameworks

For Vue, Angular, or other frameworks, create a mount function:

```typescript
// src/expose/mount.ts
export default function mount(el: HTMLElement): { unmount: () => void } {
  // Mount your app to the element
  const app = createApp(YourComponent);
  app.mount(el);

  return {
    unmount: () => app.unmount(),
  };
}
```

## How It Works

### Module Federation Configuration

Each remote exposes components via `ModuleFederationPlugin`:

```javascript
new ModuleFederationPlugin({
  name: 'reactRemote',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/components/ProductList/ProductList',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

The shell consumes these remotes:

```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    reactRemote: 'reactRemote@http://localhost:3101/remoteEntry.js',
    vueRemote: 'vueRemote@http://localhost:3102/remoteEntry.js',
    angularRemote: 'angularRemote@http://localhost:3103/remoteEntry.js',
  },
})
```

### Cross-Framework Integration

- **Vue in React**: VueWrapper component mounts Vue apps
- **Angular in React**: AngularWrapper component bootstraps Angular modules

## Demo Components

### React Remote
- ProductList: E-commerce product grid
- CartWidget: Shopping cart summary

### Vue Remote
- Dashboard: Analytics dashboard
- StatsWidget: Statistics cards
- AnalyticsChart: Bar charts

### Angular Remote
- SettingsComponent: User settings panel

### Hopefull Adapter
- Dashboard: Admin dashboard bridge
- UsersList: User management bridge

## Production Build

```bash
pnpm build
```

Each app builds to its `dist/` folder with `remoteEntry.js` for federation.
