// PM2 Ecosystem Configuration
// Run with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'mfe-shell',
      script: 'npx',
      args: 'serve dist -p 3100 -s --cors',
      cwd: './apps/shell',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-react-remote',
      script: 'npx',
      args: 'serve dist -p 3101 -s --cors',
      cwd: './apps/react-remote',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-vue-remote',
      script: 'npx',
      args: 'serve dist -p 3102 -s --cors',
      cwd: './apps/vue-remote',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-angular-remote',
      script: 'npx',
      args: 'serve dist -p 3103 -s --cors',
      cwd: './apps/angular-remote',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-hopefull-admin',
      script: 'npx',
      args: 'serve dist -p 3105 -s --cors',
      cwd: './apps/hopefull-admin',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
