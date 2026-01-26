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
- **Admin Panel**: Manage app metadata without code changes (`/admin`)
- **Auto Availability Detection**: Automatically detects if remote apps are deployed
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

### Architecture

```
Production Services:
├── PostgreSQL Database     → Docker container (port 5432)
├── Shell API Server        → PM2 process (port 3150)
├── Shell Frontend          → PM2 static server (port 3100)
└── Remote Apps (8)         → PM2 static servers (ports 3101-3108)
```

### Option 1: PM2 with Docker PostgreSQL (Recommended)

Deploy all services including the database:

```bash
# Full deployment (database + API + all frontends)
./scripts/deploy-pm2.sh deploy

# Check status (shows database, API, and all apps)
./scripts/deploy-pm2.sh status

# View logs
./scripts/deploy-pm2.sh logs

# Stop services (keeps database running)
./scripts/deploy-pm2.sh stop
```

After deployment, get your public URL:
```bash
ssh user@server "pm2 logs cloudflare-tunnel --lines 10 --nostream | grep trycloudflare"
```

### Database Management

```bash
# Start database only
./scripts/deploy-pm2.sh db:start

# Stop database
./scripts/deploy-pm2.sh db:stop

# Check database status and table info
./scripts/deploy-pm2.sh db:status

# Initialize or reset database schema
./scripts/deploy-pm2.sh db:init

# View database logs
./scripts/deploy-pm2.sh db:logs
```

### Single App Deployment

Deploy individual apps without affecting others:

```bash
# Deploy specific apps
./scripts/deploy-pm2.sh deploy:app shell        # Frontend only
./scripts/deploy-pm2.sh deploy:app shell-api    # API server only
./scripts/deploy-pm2.sh deploy:app cmms         # Single remote

# Restart specific apps
./scripts/deploy-pm2.sh restart:app shell-api

# View logs for specific app
./scripts/deploy-pm2.sh logs:app shell-api
```

### Option 2: Local Development with Database

```bash
# Start PostgreSQL locally
cd apps/shell
docker-compose up -d

# Start API server (in one terminal)
cd apps/shell/server
npm install
npm run dev

# Start all frontends (in another terminal)
pnpm dev
```

### Option 3: Manual PM2 Deployment

On your server:

```bash
# Start database
docker run -d \
  --name shell-postgres \
  -e POSTGRES_USER=shell \
  -e POSTGRES_PASSWORD=shell123 \
  -e POSTGRES_DB=shell_apps \
  -p 5432:5432 \
  -v shell_postgres_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:15-alpine

# Install dependencies
pnpm install

# Build for production
pnpm build:prod

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### Server Requirements

- **Docker** (for PostgreSQL database)
- **Node.js 18+**
- **PM2** (`npm install -g pm2`)
- (Optional) Nginx for port 80 reverse proxy

### Environment Variables

Create `.env` file based on `.env.example`:

```bash
REMOTE_HOST=http://your-server-ip

# Database (defaults shown)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shell_apps
DB_USER=shell
DB_PASSWORD=shell123

# API Server
API_PORT=3150
```

### Port Reference

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| Shell API | 3150 | Backend API server |
| Shell | 3100 | Host application |
| Hopefull Admin | 3101 | Remote app |
| Asset Management | 3102 | Remote app |
| CMMS | 3103 | Remote app |
| FamilyFun | 3104 | Remote app |
| Booking Guest | 3105 | Remote app |
| Booking Host | 3106 | Remote app |
| E-Learning Admin | 3107 | Remote app |
| E-Learning Student | 3108 | Remote app |

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

## Admin Panel

The shell includes an admin panel at `http://localhost:3100/admin` for managing app information.

### Features

- **CRUD Operations**: Add, edit, delete apps without code changes
- **App Configuration**: Name, description, port, framework, version, color theme
- **Screenshot Management**: Upload and manage app screenshots
- **Availability Toggle**: Manually disable apps with "Integrated & Deployed" toggle
- **Export to JSON**: Download app data as JSON backup

### Backend

The admin panel uses a PostgreSQL database backend:

- **Database**: PostgreSQL 15 (Docker container)
- **API Server**: Express.js on port 3150
- **Endpoints**: `/api/apps`, `/api/upload-screenshot`

### Auto Availability Detection

The AppDetail page automatically checks if remote apps are deployed:

1. Makes HEAD request to `{host}:{port}/remoteEntry.js`
2. Shows status: "Checking..." → "Online" (green) or "Offline" (amber)
3. Disables "Launch App" button for unavailable apps

### Data Flow

```
Admin Panel → API Server (port 3150) → PostgreSQL Database
                                    ↓
                              Export JSON (backup)
```

## Scripts Reference

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm dev:shell` | Start shell only |
| `pnpm build` | Build all apps |
| `pnpm build:prod` | Build for production |
| `pnpm integrate` | Interactive remote integration |
| `pnpm integrate:scan` | Auto-integrate new apps |

### Deployment

| Command | Description |
|---------|-------------|
| `./scripts/deploy-pm2.sh deploy` | Full deployment (database + all apps) |
| `./scripts/deploy-pm2.sh deploy:app NAME` | Deploy single app |
| `./scripts/deploy-pm2.sh status` | Check all services status |
| `./scripts/deploy-pm2.sh logs` | View all PM2 logs |
| `./scripts/deploy-pm2.sh restart` | Restart all services |
| `./scripts/deploy-pm2.sh stop` | Stop all services |

### Database

| Command | Description |
|---------|-------------|
| `./scripts/deploy-pm2.sh db:start` | Start PostgreSQL container |
| `./scripts/deploy-pm2.sh db:stop` | Stop PostgreSQL container |
| `./scripts/deploy-pm2.sh db:status` | Show database status |
| `./scripts/deploy-pm2.sh db:init` | Initialize database schema |
| `./scripts/deploy-pm2.sh db:logs` | View database logs |

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

### Database Connection Issues
```bash
# Check if database is running
./scripts/deploy-pm2.sh db:status

# Start database if not running
./scripts/deploy-pm2.sh db:start

# Check Docker container
docker ps | grep shell-postgres

# View database logs
./scripts/deploy-pm2.sh db:logs

# Reset database (caution: deletes data)
docker rm -f shell-postgres
docker volume rm shell_postgres_data
./scripts/deploy-pm2.sh db:init
```

### API Server Issues
```bash
# Check API server status
pm2 logs mfe-shell-api

# Restart API server
pm2 restart mfe-shell-api

# Test API endpoint
curl http://localhost:3150/api/health
```

## License

MIT
