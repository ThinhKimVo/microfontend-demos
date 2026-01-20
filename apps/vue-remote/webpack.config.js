const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/main.ts',
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
    extensions: ['.vue', '.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'vueRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/expose/mount',
        './Dashboard': './src/components/Dashboard/Dashboard.vue',
        './AnalyticsChart': './src/components/Charts/AnalyticsChart.vue',
        './StatsWidget': './src/components/Stats/StatsWidget.vue',
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: deps.vue,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
