/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.tsx',
  output: {
    publicPath: '/',
    path: path.resolve(`${__dirname}/bundle`),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_VERSION: require('./package.json').version,
      BUILD_DATE: new Date().toISOString(),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './favicon.ico',
      inject: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
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
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.PNG$/, /\.svg$/, /\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[ext]',
        },
      },
    ],
  },
}
