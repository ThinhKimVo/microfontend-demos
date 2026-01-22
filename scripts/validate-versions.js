#!/usr/bin/env node

/**
 * Validates that all microfrontend apps use compatible dependency versions.
 * This helps prevent runtime errors from version mismatches in Module Federation.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT_DIR, 'apps');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get shell's dependency versions as the baseline
function getShellVersions() {
  const shellPkgPath = path.join(APPS_DIR, 'shell', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(shellPkgPath, 'utf-8'));
  return {
    react: pkg.dependencies?.react,
    'react-dom': pkg.dependencies?.['react-dom'],
    'react-router-dom': pkg.dependencies?.['react-router-dom'],
  };
}

// Find all package.json files in apps directory (including nested)
function findAllPackageJsons(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      findAllPackageJsons(fullPath, results);
    } else if (entry.name === 'package.json') {
      // Only include if it has a webpack.config.js (Module Federation app)
      const webpackPath = path.join(dir, 'webpack.config.js');
      if (fs.existsSync(webpackPath)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

// Parse version string to get major version
function getMajorVersion(version) {
  if (!version) return null;
  const match = version.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

// Compare versions
function areVersionsCompatible(shellVersion, appVersion) {
  const shellMajor = getMajorVersion(shellVersion);
  const appMajor = getMajorVersion(appVersion);

  if (shellMajor === null || appMajor === null) {
    return true; // Can't compare, assume compatible
  }

  return shellMajor === appMajor;
}

function main() {
  log('\n=== Microfrontend Version Validator ===\n', 'cyan');

  const shellVersions = getShellVersions();
  log('Shell baseline versions:', 'yellow');
  log(`  react: ${shellVersions.react}`);
  log(`  react-dom: ${shellVersions['react-dom']}`);
  log(`  react-router-dom: ${shellVersions['react-router-dom']}`);
  log('');

  const packageJsonPaths = findAllPackageJsons(APPS_DIR);
  let hasErrors = false;
  const issues = [];

  for (const pkgPath of packageJsonPaths) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const appName = pkg.name || path.dirname(pkgPath);
    const relativePath = path.relative(ROOT_DIR, pkgPath);

    // Skip shell itself
    if (appName === '@mfe/shell') continue;

    const deps = { ...pkg.dependencies };
    const appIssues = [];

    // Check React version
    if (deps.react && !areVersionsCompatible(shellVersions.react, deps.react)) {
      appIssues.push(`react: ${deps.react} (shell: ${shellVersions.react})`);
    }

    // Check React DOM version
    if (deps['react-dom'] && !areVersionsCompatible(shellVersions['react-dom'], deps['react-dom'])) {
      appIssues.push(`react-dom: ${deps['react-dom']} (shell: ${shellVersions['react-dom']})`);
    }

    // Check React Router DOM - allow v6 and v7 to coexist for now
    // but warn about major version differences
    if (deps['react-router-dom']) {
      const shellRouterMajor = getMajorVersion(shellVersions['react-router-dom']);
      const appRouterMajor = getMajorVersion(deps['react-router-dom']);
      if (shellRouterMajor && appRouterMajor && Math.abs(shellRouterMajor - appRouterMajor) > 1) {
        appIssues.push(`react-router-dom: ${deps['react-router-dom']} (shell: ${shellVersions['react-router-dom']})`);
      }
    }

    if (appIssues.length > 0) {
      hasErrors = true;
      issues.push({ appName, relativePath, issues: appIssues });
    }
  }

  if (issues.length > 0) {
    log('Version mismatches found:\n', 'red');
    for (const { appName, relativePath, issues: appIssues } of issues) {
      log(`  ${appName} (${relativePath})`, 'yellow');
      for (const issue of appIssues) {
        log(`    - ${issue}`, 'red');
      }
    }
    log('\nPlease update the above packages to match the shell versions.', 'yellow');
    log('Module Federation with singleton dependencies requires compatible versions.\n', 'yellow');
    process.exit(1);
  } else {
    log('All apps have compatible versions!', 'green');
    log('');
    process.exit(0);
  }
}

main();
