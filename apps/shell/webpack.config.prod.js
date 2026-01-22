const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

// Production host configuration
const REMOTE_HOST = process.env.REMOTE_HOST || 'http://10.30.10.18';

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
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
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        hopefullAdmin: `hopefullAdmin@${REMOTE_HOST}:3101/remoteEntry.js`,
        assestManagement: `assestManagement@${REMOTE_HOST}:3102/remoteEntry.js`,
        cmms: `cmms@${REMOTE_HOST}:3103/remoteEntry.js`,
        familyFun: `familyFun@${REMOTE_HOST}:3104/remoteEntry.js`,
        bookingGuestPortal: `bookingGuestPortal@${REMOTE_HOST}:3105/remoteEntry.js`,
        bookingHostPortal: `bookingHostPortal@${REMOTE_HOST}:3106/remoteEntry.js`,
        elearningAdminPortal: `elearningAdminPortal@${REMOTE_HOST}:3107/remoteEntry.js`,
        elearningStudentPortal: `elearningStudentPortal@${REMOTE_HOST}:3108/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
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
  optimization: {
    minimize: true,
  },
};
