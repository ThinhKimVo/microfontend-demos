const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};

// Create object with VITE_ prefixed env vars for import.meta.env compatibility
const envKeys = Object.keys(env).reduce((prev, key) => {
  if (key.startsWith('VITE_')) {
    prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
  }
  return prev;
}, {
  'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV || 'development'),
  'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV !== 'production'),
  'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
});

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    port: 3102,
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
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: 'assestManagement',
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
      template: './index.html',
    }),
  ],
};
