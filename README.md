# Microfrontend Demo - Webpack Module Federation

A demonstration of cross-framework microfrontends using Webpack 5 Module Federation.

## Architecture

```
Shell (Host) - React          → http://localhost:3100
├── React Remote              → http://localhost:3101
├── Vue Remote                → http://localhost:3102
├── Angular Remote            → http://localhost:3103
└── Hopefull Admin            → http://localhost:3105
```

## Features

- **Cross-Framework Federation**: React, Vue, and Angular apps working together
- **Shared Dependencies**: React and other libraries shared as singletons
- **Independent Deployment**: Each remote can be deployed separately
- **Runtime Integration**: Components loaded dynamically at runtime
- **Framework Adapters**: Vue and Angular components wrapped for React host
- **Cloudflare Tunnel**: Free HTTPS access without port forwarding

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

Start all applications:

```bash
pnpm dev
```

Or start individual applications:

```bash
pnpm dev:shell           # Shell only
pnpm dev:react           # React remote only
pnpm dev:vue             # Vue remote only
pnpm dev:angular         # Angular remote only
pnpm dev:hopefull-admin  # Hopefull Admin only
```

### Access (Development)

- Shell (main app): http://localhost:3100
- React Remote: http://localhost:3101
- Vue Remote: http://localhost:3102
- Angular Remote: http://localhost:3103
- Hopefull Admin: http://localhost:3105

## Project Structure

```
microfrontend/
├── apps/
│   ├── shell/              # Host application (React)
│   ├── react-remote/       # React microfrontend
│   ├── vue-remote/         # Vue microfrontend
│   ├── angular-remote/     # Angular microfrontend
│   └── hopefull-admin/     # Hopefull Admin dashboard
├── scripts/
│   ├── integrate-remote.js # Integration automation script
│   ├── deploy-pm2.sh       # PM2 deployment script
│   └── deploy.sh           # Docker deployment script
├── docker/                 # Docker configuration
├── nginx/                  # Nginx configuration
└── ecosystem.config.js     # PM2 process configuration
```

## Deployment

### Option 1: PM2 with Cloudflare Tunnel (Recommended, No Sudo Required)

Deploy to a server with PM2 and get a free HTTPS URL via Cloudflare Tunnel:

```bash
# Build and deploy
./scripts/deploy-pm2.sh deploy

# Check status
./scripts/deploy-pm2.sh status

# View logs
./scripts/deploy-pm2.sh logs

# Stop services
./scripts/deploy-pm2.sh stop
```

After deployment, get your public URL:
```bash
ssh user@server "pm2 logs cloudflare-tunnel --lines 10 --nostream | grep trycloudflare"
```

This gives you a URL like: `https://random-words.trycloudflare.com`

### Option 2: Docker Deployment

```bash
# Build and start with Docker Compose
pnpm docker:build
pnpm docker:up

# Stop
pnpm docker:down

# View logs
pnpm docker:logs
```

### Option 3: Manual PM2 Deployment

On your server:

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build:prod

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### Server Requirements

- Node.js 18+
- PM2 (`npm install -g pm2`)
- (Optional) Nginx for port 80 reverse proxy
- (Optional) Docker & Docker Compose

### Environment Variables

Create `.env` file based on `.env.example`:

```bash
REMOTE_HOST=http://your-server-ip
```

## Integrating New Remotes

Use the integration script to automatically add a new remote to the shell:

### Quick Start

```bash
# Interactive mode - add single remote
pnpm integrate

# Scan mode - auto-integrate all new apps from /apps
pnpm integrate:scan
```

### Command-Line Options

```bash
node scripts/integrate-remote.js --name my-app --port 3106 --framework react
node scripts/integrate-remote.js --scan
```

| Option | Description |
|--------|-------------|
| `--name` | Remote name (kebab-case, e.g., `user-dashboard`) |
| `--port` | Dev server port (e.g., `3106`) |
| `--framework` | `react`, `vue`, `angular`, or `other` |
| `--description` | Short description for the home page |
| `--features` | Comma-separated feature list |
| `--scan` | Auto-detect and integrate all new apps from `/apps` |
| `--force` | Continue even if port is already in use |
| `--skipCreate` | Skip creating new remote app from template |

### Requirements for Auto-Integration

- App must have `webpack.config.js`
- Must include `ModuleFederationPlugin`
- Must have `remoteEntry.js` configured

Apps using Vite or other build tools will be skipped with a helpful message.

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
    hopefullAdmin: 'hopefullAdmin@http://localhost:3105/remoteEntry.js',
  },
})
```

### Cross-Framework Integration

- **React Remotes**: Direct lazy imports with Suspense
- **Vue/Angular Remotes**: Mount/unmount pattern via exposed `mount` function

## Demo Components

### React Remote
- ProductList: E-commerce product grid
- CartWidget: Shopping cart summary

### Vue Remote
- Dashboard: Analytics dashboard with charts
- StatsWidget: Statistics cards

### Angular Remote
- SettingsComponent: User settings and profile management

### Hopefull Admin
- Dashboard: Admin analytics dashboard
- UsersList: User management

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps |
| `pnpm build:prod` | Build for production |
| `pnpm integrate` | Interactive remote integration |
| `pnpm integrate:scan` | Auto-integrate new apps |
| `pnpm deploy:pm2` | Deploy with PM2 + Cloudflare Tunnel |
| `pnpm docker:up` | Start with Docker Compose |

## Troubleshooting

### Remote Loading Failed
- Check if all remotes are running
- Verify port numbers in webpack config
- Check browser console for CORS errors

### Cloudflare Tunnel Not Working
```bash
# Check tunnel status
pm2 logs cloudflare-tunnel

# Restart tunnel
pm2 restart cloudflare-tunnel
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3100

# Kill process
kill -9 <PID>
```

## License

MIT
