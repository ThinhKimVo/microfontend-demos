const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

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
        healthcareAdmin: 'healthcareAdmin@/mfe/3101/remoteEntry.js',
        healthcareMarketing: 'healthcareMarketing@/mfe/3109/remoteEntry.js',
        assestManagement: 'assestManagement@/mfe/3102/remoteEntry.js',
        cmms: 'cmms@/mfe/3103/remoteEntry.js',
        familyFun: 'familyFun@/mfe/3104/remoteEntry.js',
        bookingGuestPortal: 'bookingGuestPortal@/mfe/3105/remoteEntry.js',
        bookingHostPortal: 'bookingHostPortal@/mfe/3106/remoteEntry.js',
        elearningAdminPortal: 'elearningAdminPortal@/mfe/3107/remoteEntry.js',
        elearningStudentPortal: 'elearningStudentPortal@/mfe/3108/remoteEntry.js',
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
  },
};
