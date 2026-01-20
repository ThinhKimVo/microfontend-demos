# Microfrontend Demo - Webpack Module Federation

A demonstration of cross-framework microfrontends using Webpack 5 Module Federation.

## Architecture

```
Shell (Host) - React          → http://localhost:3100
├── React Remote              → http://localhost:3101
├── Vue Remote                → http://localhost:3102
└── Angular Remote            → http://localhost:3103
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
│   └── angular-remote/     # Angular microfrontend
├── packages/
│   └── shared/             # Shared utilities (EventBus, types)
└── scripts/
    └── start-all.sh
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

## Production Build

```bash
pnpm build
```

Each app builds to its `dist/` folder with `remoteEntry.js` for federation.
