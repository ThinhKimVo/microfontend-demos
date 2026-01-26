# Microfrontend Demo - Webpack Module Federation

A demonstration of microfrontends using Webpack 5 Module Federation with multiple React applications.

## Architecture

```
Shell (Host) - React                → http://localhost:3100
├── Hopefull Admin                  → http://localhost:3101
├── Asset Management                → http://localhost:3102
├── CMMS                            → http://localhost:3103
├── FamilyFun                       → http://localhost:3104
├── Booking Guest Portal            → http://localhost:3105
├── Booking Host Portal             → http://localhost:3106
├── E-Learning Admin Portal         → http://localhost:3107
└── E-Learning Student Portal       → http://localhost:3108
```

## Features

- **Module Federation**: Multiple React apps working together seamlessly
- **Shared Dependencies**: React, ReactDOM, and React Router shared as singletons
- **Independent Deployment**: Each remote can be deployed separately
- **Runtime Integration**: Components loaded dynamically at runtime
- **Mount/Unmount Pattern**: Remotes expose mount functions with MemoryRouter for isolated routing
- **CI/CD Pipeline**: GitHub Actions with self-hosted runner for automatic deployment
- **PM2 Process Management**: Production-ready process management

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

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
pnpm dev:shell              # Shell host
pnpm dev:hopefull-admin     # Hopefull Admin
pnpm dev:assestmanagement   # Asset Management
pnpm dev:cmms               # CMMS
pnpm dev:familyfun          # FamilyFun
pnpm dev:booking-guest      # Booking Guest Portal
pnpm dev:booking-host       # Booking Host Portal
pnpm dev:elearn-admin       # E-Learning Admin
pnpm dev:elearn-student     # E-Learning Student
```

### Access (Development)

| App | URL | Description |
|-----|-----|-------------|
| Shell | http://localhost:3100 | Host application with routing |
| Hopefull Admin | http://localhost:3101 | Admin dashboard |
| Asset Management | http://localhost:3102 | Asset tracking system |
| CMMS | http://localhost:3103 | Maintenance management |
| FamilyFun | http://localhost:3104 | Family events platform |
| Booking Guest | http://localhost:3105 | Guest booking portal |
| Booking Host | http://localhost:3106 | Host property management |
| E-Learning Admin | http://localhost:3107 | E-Learning admin portal |
| E-Learning Student | http://localhost:3108 | E-Learning student portal |

## Project Structure

```
microfrontend/
├── apps/
│   ├── shell/                  # Host application (React)
│   ├── hopefull-admin/         # Hopefull Admin dashboard
│   ├── assest-management/      # Asset Management system
│   ├── cmms/                   # CMMS application
│   ├── FamilyFun/              # Family events platform
│   │   └── frontend/           # FamilyFun frontend
│   ├── BookingSystem/          # Booking system monorepo
│   │   └── packages/
│   │       ├── guest-portal/   # Guest booking portal
│   │       └── host-portal/    # Host management portal
│   └── elearning/              # E-Learning monorepo
│       ├── admin-portal/       # Admin portal
│       └── student-portal/     # Student portal
├── scripts/
│   ├── integrate-remote.js     # Integration automation script
│   └── deploy-pm2.sh           # PM2 deployment script
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
└── ecosystem.config.js         # PM2 process configuration
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

Each remote exposes a `mount` function via `ModuleFederationPlugin`:

```javascript
// Remote webpack.config.js
new ModuleFederationPlugin({
  name: 'familyFun',
  filename: 'remoteEntry.js',
  exposes: {
    './mount': './src/expose/mount',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.1' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.22.0' },
  },
})
```

The shell consumes these remotes:

```javascript
// Shell webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    hopefullAdmin: 'hopefullAdmin@http://localhost:3101/remoteEntry.js',
    assestManagement: 'assestManagement@http://localhost:3102/remoteEntry.js',
    cmms: 'cmms@http://localhost:3103/remoteEntry.js',
    familyFun: 'familyFun@http://localhost:3104/remoteEntry.js',
    bookingGuestPortal: 'bookingGuestPortal@http://localhost:3105/remoteEntry.js',
    bookingHostPortal: 'bookingHostPortal@http://localhost:3106/remoteEntry.js',
    elearningAdminPortal: 'elearningAdminPortal@http://localhost:3107/remoteEntry.js',
    elearningStudentPortal: 'elearningStudentPortal@http://localhost:3108/remoteEntry.js',
  },
})
```

### Mount/Unmount Pattern

All remotes use the mount/unmount pattern with `MemoryRouter` for isolated routing:

```typescript
// Remote mount.tsx
export default function mount(el: HTMLElement, options = {}) {
  const root = ReactDOM.createRoot(el);
  root.render(
    <MemoryRouter initialEntries={[options.initialPath || '/']}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
  return { unmount: () => root.unmount() };
}
```

The shell uses `RemoteWrapper` components to load and mount remotes:

```typescript
// Shell RemoteWrapper
const RemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadRemote = async () => {
      const { default: mount } = await import('remoteName/mount');
      const { unmount } = mount(containerRef.current);
      unmountRef.current = unmount;
    };
    loadRemote();
    return () => unmountRef.current?.();
  }, []);

  return <div ref={containerRef} />;
};
```

## Applications

| App | Description |
|-----|-------------|
| **Hopefull Admin** | Admin dashboard with analytics and user management |
| **Asset Management** | Asset tracking and inventory management system |
| **CMMS** | Computerized Maintenance Management System |
| **FamilyFun** | Family events discovery platform for Hong Kong |
| **Booking Guest Portal** | Guest-facing property booking interface |
| **Booking Host Portal** | Property management for hosts |
| **E-Learning Admin** | Course and student management for educators |
| **E-Learning Student** | Learning interface for students |

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

## CI/CD

The project uses GitHub Actions with a self-hosted runner for automatic deployment:

- **Trigger**: Push to `master` branch
- **Change Detection**: Only builds apps that have changed
- **Smart Rebuilds**: Shell rebuilds if any remote changes (updates remoteEntry URLs)
- **PM2 Management**: Automatic restart of updated services

### Workflow

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - Checkout code
      - Detect changed apps
      - Install dependencies
      - Build changed apps
      - Restart PM2 services
```

## Troubleshooting

### Remote Loading Failed
- Check if all remotes are running: `pnpm dev`
- Verify port numbers in webpack config match the architecture table
- Check browser console for CORS errors
- Ensure shared dependencies versions match across apps

### MUI Grid Layout Issues
When using MUI Grid with the `size` prop (Grid2 syntax):
```typescript
// Correct - import from Grid2
import Grid from '@mui/material/Grid2';
<Grid size={{ xs: 12, md: 6 }}>...</Grid>

// Incorrect - legacy Grid doesn't support size prop
import { Grid } from '@mui/material';
```

### React Router Version Mismatch
All apps must use compatible `react-router-dom` versions. Check for warnings:
```
Unsatisfied version 7.x.x of shared singleton module react-router-dom
```
Solution: Align all apps to use `react-router-dom@^6.22.0`

### Port Already in Use
```bash
# Find process using port
lsof -i :3100

# Kill process
kill -9 <PID>
```

### PM2 Process Issues
```bash
# Check PM2 status
pm2 status

# View logs for specific app
pm2 logs shell

# Restart all apps
pm2 restart ecosystem.config.js
```

## License

MIT
