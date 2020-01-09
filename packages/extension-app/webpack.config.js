// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-extension-manifest-plugin');

const pkgJson = require('./package.json');
const manifest = require('./src/manifest.json');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createWebpack({ alias = {}, context }) {
  const ENV = process.env.NODE_ENV || 'development';
  const isProd = ENV === 'production';

  const copyPlugin = [{ from: 'public' }, { from: 'generated/polkadot_cli_bg.wasm' }];
  // If building in prod mode,also copy the output of create-react-app's
  // build in light-apps. That will be the popup UI.
  if (ENV === 'production') {
    copyPlugin.push({ force: true, from: '../light-apps/build' });
  }

  return {
    context,
    devtool: false,
    entry: {
      background: './src/background/index.ts',
      content: './src/content/index.ts',
    },
    mode: ENV,
    output: {
      chunkFilename: '[name].js',
      filename: '[name].js',
      path: path.join(context, 'build'),
    },
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: require.resolve('babel-loader')
            },
          ],
        },
        {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        },
        {
          test: [/\.svg$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff2?$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    node: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      child_process: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV),
          PKG_NAME: JSON.stringify(pkgJson.name),
          PKG_VERSION: JSON.stringify(pkgJson.version),
        },
      }),
      new CopyPlugin(copyPlugin),
      new ManifestPlugin({
        config: {
          base: manifest,
          extend: {
            version: pkgJson.version,
          },
        },
      }),
    ],
    watch: !isProd,
  };
}

module.exports = createWebpack({ context: __dirname });
