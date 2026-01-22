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
      name: 'mfe-hopefull-admin',
      script: 'npx',
      args: 'serve dist -p 3101 -s --cors',
      cwd: './apps/hopefull-admin',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-assest-management',
      script: 'npx',
      args: 'serve dist -p 3102 -s --cors',
      cwd: './apps/assest-management',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-cmms',
      script: 'npx',
      args: 'serve dist -p 3103 -s --cors',
      cwd: './apps/cmms',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-family-fun',
      script: 'npx',
      args: 'serve dist -p 3104 -s --cors',
      cwd: './apps/FamilyFun/frontend',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-booking-guest',
      script: 'npx',
      args: 'serve dist -p 3105 -s --cors',
      cwd: './apps/BookingSystem/packages/guest-portal',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-booking-host',
      script: 'npx',
      args: 'serve dist -p 3106 -s --cors',
      cwd: './apps/BookingSystem/packages/host-portal',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-elearning-admin',
      script: 'npx',
      args: 'serve dist -p 3107 -s --cors',
      cwd: './apps/elearning/admin-portal',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mfe-elearning-student',
      script: 'npx',
      args: 'serve dist -p 3108 -s --cors',
      cwd: './apps/elearning/student-portal',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
