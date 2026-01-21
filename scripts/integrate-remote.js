#!/usr/bin/env node

/**
 * Microfrontend Remote Integration Script
 *
 * Automates the process of integrating a new remote application into the shell.
 *
 * Usage:
 *   node scripts/integrate-remote.js
 *   node scripts/integrate-remote.js --name myApp --port 3105 --framework react
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT_DIR = path.resolve(__dirname, '..');
const SHELL_DIR = path.join(ROOT_DIR, 'apps', 'shell');
const APPS_DIR = path.join(ROOT_DIR, 'apps');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      // Boolean flags (no value)
      if (key === 'skipCreate' || key === 'yes' || key === 'y' || key === 'force') {
        config[key] = true;
      } else if (value && !value.startsWith('--')) {
        config[key] = value;
        i++;
      }
    }
  }

  return config;
}

// Create readline interface for prompts
function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Validate remote name
function validateName(name) {
  if (!name || name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)) {
    return 'Name must start with a letter and contain only letters, numbers, and hyphens';
  }
  return null;
}

// Validate port
function validatePort(port) {
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 3000 || portNum > 65535) {
    return 'Port must be a number between 3000 and 65535';
  }
  return null;
}

// Get existing ports from shell webpack config
function getExistingPorts() {
  const webpackPath = path.join(SHELL_DIR, 'webpack.config.js');
  const content = fs.readFileSync(webpackPath, 'utf-8');
  const portMatches = content.match(/localhost:(\d+)/g) || [];
  return portMatches.map((m) => parseInt(m.split(':')[1], 10));
}

// Convert name to various cases
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Update shell's webpack.config.js
function updateShellWebpack(config) {
  const webpackPath = path.join(SHELL_DIR, 'webpack.config.js');
  let content = fs.readFileSync(webpackPath, 'utf-8');

  const remoteName = toCamelCase(config.name);
  const remoteEntry = `        ${remoteName}: '${remoteName}@http://localhost:${config.port}/remoteEntry.js',`;

  // Find the remotes object and add the new entry
  const remotesRegex = /(remotes:\s*\{[\s\S]*?)((\s*}\s*,\s*shared))/;
  const match = content.match(remotesRegex);

  if (match) {
    // Check if already exists
    if (content.includes(`${remoteName}:`)) {
      logError(`Remote "${remoteName}" already exists in webpack.config.js`);
      return false;
    }

    const newContent = content.replace(
      remotesRegex,
      `$1${remoteEntry}\n$2`
    );
    fs.writeFileSync(webpackPath, newContent);
    logSuccess(`Updated shell webpack.config.js with ${remoteName} remote`);
    return true;
  } else {
    logError('Could not find remotes section in webpack.config.js');
    return false;
  }
}

// Add type declarations
function addTypeDeclarations(config) {
  const typesPath = path.join(SHELL_DIR, 'src', 'federation', 'types.d.ts');
  let content = fs.readFileSync(typesPath, 'utf-8');

  const remoteName = toCamelCase(config.name);
  const pascalName = toPascalCase(config.name);

  // Check if already exists
  if (content.includes(`'${remoteName}/`)) {
    logError(`Type declarations for "${remoteName}" already exist`);
    return false;
  }

  let declarations = '';

  if (config.framework === 'react') {
    declarations = `
// ${pascalName} Remote
declare module '${remoteName}/App' {
  const App: React.ComponentType;
  export default App;
}

`;
    // Add component declarations if provided
    if (config.components && config.components.length > 0) {
      config.components.forEach((comp) => {
        declarations += `declare module '${remoteName}/${comp}' {
  const ${comp}: React.ComponentType;
  export default ${comp};
}

`;
      });
    }
  } else {
    // For Vue, Angular, or other frameworks - use mount pattern
    declarations = `
// ${pascalName} Remote (${config.framework})
declare module '${remoteName}/mount' {
  const mount: (el: HTMLElement) => { unmount: () => void };
  export default mount;
}

`;
  }

  content += declarations;
  fs.writeFileSync(typesPath, content);
  logSuccess(`Added type declarations for ${remoteName}`);
  return true;
}

// Create wrapper component
function createWrapperComponent(config) {
  const wrapperDir = path.join(SHELL_DIR, 'src', 'components', 'RemoteWrapper');
  const pascalName = toPascalCase(config.name);
  const remoteName = toCamelCase(config.name);
  const wrapperPath = path.join(wrapperDir, `${pascalName}RemoteWrapper.tsx`);

  if (fs.existsSync(wrapperPath)) {
    logError(`Wrapper component ${pascalName}RemoteWrapper.tsx already exists`);
    return false;
  }

  let wrapperContent;

  if (config.framework === 'react') {
    wrapperContent = `import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const App = lazy(() => import('${remoteName}/App'));

const Loading: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
  </div>
);

const ${pascalName}RemoteWrapper: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ${pascalName}RemoteWrapper;
`;
  } else {
    // Vue, Angular, or other frameworks - use mount pattern
    wrapperContent = `import React, { useEffect, useRef } from 'react';

const ${pascalName}RemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadRemote = async () => {
      if (!containerRef.current) return;

      try {
        const { default: mount } = await import('${remoteName}/mount');
        const { unmount } = mount(containerRef.current);
        unmountRef.current = unmount;
      } catch (error) {
        console.error('Failed to load ${config.name} remote:', error);
      }
    };

    loadRemote();

    return () => {
      if (unmountRef.current) {
        unmountRef.current();
      }
    };
  }, []);

  return <div ref={containerRef} className="${toKebabCase(config.name)}-remote-container" />;
};

export default ${pascalName}RemoteWrapper;
`;
  }

  fs.writeFileSync(wrapperPath, wrapperContent);
  logSuccess(`Created ${pascalName}RemoteWrapper.tsx`);
  return true;
}

// Update App.tsx with new route
function updateAppRoutes(config) {
  const appPath = path.join(SHELL_DIR, 'src', 'App.tsx');
  let content = fs.readFileSync(appPath, 'utf-8');

  const pascalName = toPascalCase(config.name);
  const routePath = `/${toKebabCase(config.name)}`;

  // Check if route already exists
  if (content.includes(`path="${routePath}`)) {
    logError(`Route "${routePath}" already exists in App.tsx`);
    return false;
  }

  // Add lazy import
  const lazyImportPattern = /const \w+RemoteWrapper = lazy\(\(\) => import\('[^']+'\)\);/g;
  const lastLazyImport = content.match(lazyImportPattern);
  if (lastLazyImport) {
    const lastImport = lastLazyImport[lastLazyImport.length - 1];
    const newImport = `const ${pascalName}RemoteWrapper = lazy(() => import('./components/RemoteWrapper/${pascalName}RemoteWrapper'));`;
    content = content.replace(lastImport, `${lastImport}\n${newImport}`);
  }

  // Add route - find the last Route before </Routes>
  const routePattern = /(<Route path="\/[^"]*" element={<\w+RemoteWrapper \/>} \/>)(\s*<\/Routes>)/;
  const match = content.match(routePattern);

  if (match) {
    const newRoute = `<Route path="${routePath}/*" element={<${pascalName}RemoteWrapper />} />`;
    content = content.replace(routePattern, `$1\n            ${newRoute}$2`);
  }

  fs.writeFileSync(appPath, content);
  logSuccess(`Added route ${routePath} to App.tsx`);
  return true;
}

// Update root package.json scripts
function updateRootPackageJson(config) {
  const packagePath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

  const kebabName = toKebabCase(config.name);
  const shortName = config.name.toLowerCase().replace(/-remote$/, '').replace(/-/g, '');
  const filterName = `@mfe/${kebabName}`;

  // Add individual dev script
  const devScriptKey = `dev:${shortName}`;
  if (pkg.scripts[devScriptKey]) {
    logError(`Script "${devScriptKey}" already exists`);
    return false;
  }

  pkg.scripts[devScriptKey] = `pnpm --filter ${filterName} dev`;

  // Update main dev script to include new remote
  const devScript = pkg.scripts.dev || '';
  if (devScript.includes('concurrently')) {
    // Parse existing concurrently command
    // Format: concurrently -n name1,name2 -c color1,color2 "cmd1" "cmd2"
    const namesMatch = devScript.match(/-n\s+([^\s]+)/);
    const colorsMatch = devScript.match(/-c\s+([^\s]+)/);
    const commandsMatch = devScript.match(/"pnpm[^"]+"/g) || [];

    if (namesMatch && colorsMatch) {
      const names = namesMatch[1].split(',');
      const colors = colorsMatch[1].split(',');

      // Available colors for concurrently (expanded list)
      const availableColors = [
        'blue', 'green', 'yellow', 'magenta', 'cyan', 'white', 'gray', 'red',
        'blueBright', 'greenBright', 'yellowBright', 'magentaBright', 'cyanBright',
        'redBright', 'bgBlue', 'bgGreen', 'bgYellow', 'bgMagenta', 'bgCyan', 'bgRed'
      ];
      const usedColors = colors.map(c => c.toLowerCase());
      // Find unused color, or cycle through colors if all used
      let newColor = availableColors.find(c => !usedColors.includes(c.toLowerCase()));
      if (!newColor) {
        // Cycle: use color based on position (skip first 5 reserved for core apps)
        const colorIndex = (names.length) % availableColors.length;
        newColor = availableColors[colorIndex];
      }

      // Add new remote
      names.push(shortName);
      colors.push(newColor);
      commandsMatch.push(`"pnpm --filter ${filterName} dev"`);

      // Rebuild dev script
      pkg.scripts.dev = `concurrently -n ${names.join(',')} -c ${colors.join(',')} ${commandsMatch.join(' ')}`;
      logSuccess(`Added ${shortName} to main dev script (color: ${newColor})`);
    }
  }

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
  logSuccess(`Added dev:${shortName} script to root package.json`);
  return true;
}

// Update Home.tsx with new demo card
function updateHomePage(config) {
  const homePath = path.join(SHELL_DIR, 'src', 'pages', 'Home.tsx');
  let content = fs.readFileSync(homePath, 'utf-8');

  const pascalName = toPascalCase(config.name);
  const kebabName = toKebabCase(config.name);
  const routePath = `/${kebabName}`;

  // Check if already exists
  if (content.includes(`path: '${routePath}'`)) {
    logError(`Demo card for "${routePath}" already exists in Home.tsx`);
    return false;
  }

  // Determine icon and colors based on framework
  const frameworkConfig = {
    react: {
      icon: 'ReactIcon',
      gradient: 'from-sky-500 to-blue-600',
      bgGradient: 'from-sky-50 to-blue-50',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700',
    },
    vue: {
      icon: 'VueIcon',
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
    },
    angular: {
      icon: 'AngularIcon',
      gradient: 'from-rose-500 to-red-600',
      bgGradient: 'from-rose-50 to-red-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
    },
    other: {
      icon: 'ReactIcon', // Default icon
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
    },
  };

  const fwConfig = frameworkConfig[config.framework] || frameworkConfig.other;

  const newDemo = `  {
    name: '${pascalName} Remote',
    path: '${routePath}',
    framework: '${toPascalCase(config.framework)}',
    icon: ${fwConfig.icon},
    gradient: '${fwConfig.gradient}',
    bgGradient: '${fwConfig.bgGradient}',
    borderColor: '${fwConfig.borderColor}',
    textColor: '${fwConfig.textColor}',
    description: '${config.description || `${pascalName} microfrontend application`}',
    features: [${(config.features || ['App']).map((f) => `'${f}'`).join(', ')}],
  },`;

  // Find the demos array and add the new entry
  const demosEndPattern = /(\];\s*\nexport default function Home)/;
  content = content.replace(demosEndPattern, `${newDemo}\n$1`);

  fs.writeFileSync(homePath, content);
  logSuccess(`Added demo card for ${pascalName} to Home.tsx`);
  return true;
}

// Create remote app from template
function createRemoteApp(config) {
  const kebabName = toKebabCase(config.name);
  const remoteName = toCamelCase(config.name);
  const pascalName = toPascalCase(config.name);
  const remoteDir = path.join(APPS_DIR, kebabName);

  if (fs.existsSync(remoteDir)) {
    logError(`Directory apps/${kebabName} already exists`);
    return false;
  }

  // Create directory structure
  fs.mkdirSync(remoteDir, { recursive: true });
  fs.mkdirSync(path.join(remoteDir, 'src', 'components'), { recursive: true });
  fs.mkdirSync(path.join(remoteDir, 'src', 'expose'), { recursive: true });
  fs.mkdirSync(path.join(remoteDir, 'public'), { recursive: true });

  // package.json
  const packageJson = {
    name: `@mfe/${kebabName}`,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'webpack serve --mode development',
      build: 'webpack --mode production',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'react-router-dom': '^6.22.0',
    },
    devDependencies: {
      '@babel/core': '^7.24.0',
      '@babel/preset-env': '^7.24.0',
      '@babel/preset-react': '^7.23.3',
      '@babel/preset-typescript': '^7.23.3',
      '@types/react': '^18.2.64',
      '@types/react-dom': '^18.2.21',
      'babel-loader': '^9.1.3',
      'css-loader': '^6.10.0',
      'html-webpack-plugin': '^5.6.0',
      'postcss-loader': '^8.1.1',
      'style-loader': '^3.3.4',
      typescript: '^5.7.2',
      webpack: '^5.90.3',
      'webpack-cli': '^5.1.4',
      'webpack-dev-server': '^5.0.2',
    },
  };

  fs.writeFileSync(
    path.join(remoteDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // webpack.config.js
  const webpackConfig = `const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    port: ${config.port},
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: '${remoteName}',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './mount': './src/expose/mount',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
`;

  fs.writeFileSync(path.join(remoteDir, 'webpack.config.js'), webpackConfig);

  // tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      lib: ['DOM', 'DOM.Iterable', 'ES2020'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
    include: ['src'],
  };

  fs.writeFileSync(
    path.join(remoteDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2) + '\n'
  );

  // public/index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pascalName} Remote</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

  fs.writeFileSync(path.join(remoteDir, 'public', 'index.html'), indexHtml);

  // src/index.tsx
  const indexTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  fs.writeFileSync(path.join(remoteDir, 'src', 'index.tsx'), indexTsx);

  // src/App.tsx
  const appTsx = `import React from 'react';

const App: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">${pascalName} Remote</h1>
      <p className="text-gray-600">
        This is the ${pascalName} microfrontend application.
      </p>
    </div>
  );
};

export default App;
`;

  fs.writeFileSync(path.join(remoteDir, 'src', 'App.tsx'), appTsx);

  // src/expose/mount.tsx
  const mountTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

export default function mount(el: HTMLElement): { unmount: () => void } {
  const root = ReactDOM.createRoot(el);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}
`;

  fs.writeFileSync(path.join(remoteDir, 'src', 'expose', 'mount.tsx'), mountTsx);

  // src/styles.css (empty for now)
  fs.writeFileSync(path.join(remoteDir, 'src', 'styles.css'), '');

  logSuccess(`Created remote app in apps/${kebabName}`);
  return true;
}

// Print summary
function printSummary(config) {
  const kebabName = toKebabCase(config.name);
  const shortName = config.name.toLowerCase().replace(/-remote$/, '').replace(/-/g, '');

  log('\n' + '='.repeat(60), 'bright');
  log('Integration Complete!', 'green');
  log('='.repeat(60) + '\n', 'bright');

  log('Next Steps:', 'yellow');
  log(`\n1. Install dependencies:`, 'reset');
  log(`   cd apps/${kebabName} && pnpm install`, 'cyan');
  log(`   # Or from root: pnpm install`, 'cyan');

  log(`\n2. Start the remote (in a separate terminal):`, 'reset');
  log(`   pnpm dev:${shortName}`, 'cyan');

  log(`\n3. Start the shell (if not running):`, 'reset');
  log(`   pnpm dev:shell`, 'cyan');

  log(`\n4. Access your remote:`, 'reset');
  log(`   Standalone: http://localhost:${config.port}`, 'cyan');
  log(`   Via Shell:  http://localhost:3100/${kebabName}`, 'cyan');

  log('\nFiles Created/Modified:', 'yellow');
  log(`  - apps/${kebabName}/ (new remote app)`, 'reset');
  log(`  - apps/shell/webpack.config.js`, 'reset');
  log(`  - apps/shell/src/federation/types.d.ts`, 'reset');
  log(`  - apps/shell/src/components/RemoteWrapper/${toPascalCase(config.name)}RemoteWrapper.tsx`, 'reset');
  log(`  - apps/shell/src/App.tsx`, 'reset');
  log(`  - apps/shell/src/pages/Home.tsx`, 'reset');
  log(`  - package.json (root)`, 'reset');

  log('\n' + '='.repeat(60) + '\n', 'bright');
}

// Main function
async function main() {
  log('\n' + '='.repeat(60), 'bright');
  log('  Microfrontend Remote Integration Script', 'blue');
  log('='.repeat(60) + '\n', 'bright');

  const cliArgs = parseArgs();
  const rl = createPrompt();

  try {
    // Get configuration
    const config = {};

    // Remote name
    if (cliArgs.name) {
      config.name = cliArgs.name;
    } else {
      config.name = await question(rl, 'Remote name (e.g., my-app, user-portal): ');
    }

    let nameError = validateName(config.name);
    while (nameError) {
      logError(nameError);
      config.name = await question(rl, 'Remote name: ');
      nameError = validateName(config.name);
    }

    // Port
    const existingPorts = getExistingPorts();
    const suggestedPort = Math.max(...existingPorts) + 1;

    if (cliArgs.port) {
      config.port = cliArgs.port;
    } else {
      const portInput = await question(rl, `Port (suggested: ${suggestedPort}): `);
      config.port = portInput || suggestedPort.toString();
    }

    let portError = validatePort(config.port);
    while (portError) {
      logError(portError);
      const portInput = await question(rl, `Port: `);
      config.port = portInput;
      portError = validatePort(config.port);
    }

    if (existingPorts.includes(parseInt(config.port, 10)) && !cliArgs.force) {
      logError(`Port ${config.port} is already in use by another remote`);
      log('Use --force to continue anyway (for completing partial integrations)', 'yellow');
      rl.close();
      process.exit(1);
    }

    // Framework
    if (cliArgs.framework) {
      config.framework = cliArgs.framework.toLowerCase();
    } else {
      log('\nFramework options:', 'yellow');
      log('  1. react (recommended for React apps)');
      log('  2. vue');
      log('  3. angular');
      log('  4. other\n');
      const fwInput = await question(rl, 'Framework (react/vue/angular/other) [react]: ');
      config.framework = fwInput.toLowerCase() || 'react';
    }

    // Description (optional)
    if (!cliArgs.description) {
      config.description = await question(rl, 'Description (optional): ');
    } else {
      config.description = cliArgs.description;
    }

    // Features (optional)
    if (!cliArgs.features) {
      const featuresInput = await question(rl, 'Features (comma-separated, optional): ');
      config.features = featuresInput ? featuresInput.split(',').map((f) => f.trim()) : ['App'];
    } else {
      config.features = cliArgs.features.split(',').map((f) => f.trim());
    }

    // Create remote app?
    let createApp = true;
    if (cliArgs.skipCreate) {
      createApp = false;
    } else if (cliArgs.yes || cliArgs.y) {
      createApp = true;
    } else {
      const createInput = await question(rl, '\nCreate new remote app from template? (Y/n): ');
      createApp = createInput.toLowerCase() !== 'n';
    }

    rl.close();

    log('\n' + '-'.repeat(40), 'reset');
    log('Configuration:', 'yellow');
    log(`  Name:        ${config.name}`);
    log(`  Port:        ${config.port}`);
    log(`  Framework:   ${config.framework}`);
    log(`  Description: ${config.description || '(none)'}`);
    log(`  Features:    ${config.features.join(', ')}`);
    log(`  Create App:  ${createApp ? 'Yes' : 'No'}`);
    log('-'.repeat(40) + '\n', 'reset');

    // Execute steps
    logStep('1/7', 'Updating shell webpack.config.js...');
    updateShellWebpack(config);

    logStep('2/7', 'Adding type declarations...');
    addTypeDeclarations(config);

    logStep('3/7', 'Creating wrapper component...');
    createWrapperComponent(config);

    logStep('4/7', 'Updating App.tsx routes...');
    updateAppRoutes(config);

    logStep('5/7', 'Updating root package.json...');
    updateRootPackageJson(config);

    logStep('6/7', 'Updating Home.tsx demo cards...');
    updateHomePage(config);

    if (createApp) {
      logStep('7/7', 'Creating remote app from template...');
      createRemoteApp(config);
    } else {
      logStep('7/7', 'Skipping remote app creation...');
    }

    printSummary(config);

  } catch (error) {
    logError(`Error: ${error.message}`);
    rl.close();
    process.exit(1);
  }
}

main();
