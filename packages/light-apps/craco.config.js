// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

module.exports = {
  babel: {
    plugins: ['@babel/plugin-syntax-import-meta'],
  },
  webpack: {
    alias: {},
    plugins: [],
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            // https://github.com/webpack/webpack/issues/6719#issuecomment-546840116
            loader: require.resolve('@open-wc/webpack-import-meta-loader'),
          },
        ],
      },
    },
  },
};
