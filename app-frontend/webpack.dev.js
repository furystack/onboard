/* eslint-disable @typescript-eslint/no-var-requires */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
  },
  output: {
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
})
