const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100;
const API_SERVER = process.env.API_SERVER || 'http://localhost:3150';

// Proxy /api and /screenshots to the shell API server
app.use(createProxyMiddleware({
  target: API_SERVER,
  changeOrigin: true,
  pathFilter: ['/api/**', '/screenshots/**'],
}));

// Proxy remote microfrontend apps: /mfe/:port/* -> localhost:port/*
// This avoids mixed content issues when the shell is served over HTTPS
const REMOTE_PORTS = [3001, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109];
REMOTE_PORTS.forEach(port => {
  app.use(`/mfe/${port}`, createProxyMiddleware({
    target: `http://localhost:${port}`,
    changeOrigin: true,
    pathRewrite: { [`^/mfe/${port}`]: '' },
  }));
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Shell Static] Serving on http://localhost:${PORT}`);
  console.log(`[Shell Static] Proxying /api -> ${API_SERVER}`);
  console.log(`[Shell Static] Proxying /mfe/:port -> localhost:port`);
});
