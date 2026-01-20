const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

// Path to Hopefull Admin source
const HOPEFULL_ADMIN_PATH = path.resolve(__dirname, '../../../hopefull/apps/admin/src');

module.exports = {
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    port: 3104,
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    ],
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@hopefull': HOPEFULL_ADMIN_PATH,
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'hopefullAdapter',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/expose/mount',
        './Dashboard': './src/components/DashboardBridge',
        './UsersList': './src/components/UsersListBridge',
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
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: deps['@tanstack/react-query'],
        },
        zustand: {
          singleton: true,
          requiredVersion: deps.zustand,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
