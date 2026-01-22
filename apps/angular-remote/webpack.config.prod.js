const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const deps = require('./package.json').dependencies;

// Production host configuration
const REMOTE_HOST = process.env.REMOTE_HOST || 'http://10.30.10.18';

module.exports = {
  entry: './src/main.ts',
  mode: 'production',
  output: {
    publicPath: `${REMOTE_HOST}:3103/`,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    uniqueName: 'angularRemote',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: '@ngtools/webpack',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new AngularWebpackPlugin({
      tsconfig: './tsconfig.json',
      jitMode: true,
    }),
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: 'angularRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/expose/mount.ts',
        './SettingsComponent': './src/app/settings/settings.component.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/core'], eager: true },
        '@angular/common': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/common'], eager: true },
        '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/platform-browser'], eager: true },
        '@angular/platform-browser-dynamic': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/platform-browser-dynamic'], eager: true },
        rxjs: { singleton: true, strictVersion: false, requiredVersion: deps.rxjs, eager: true },
        'zone.js': { singleton: true, strictVersion: false, requiredVersion: deps['zone.js'], eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  optimization: {
    minimize: true,
  },
};
