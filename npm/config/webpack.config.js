'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const paths = require('./paths');
const getClientEnvironment = require('./env');

const envParams = getClientEnvironment();
const envStringified = envParams.envStringified;

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    paths.appIndexJs,
  ],
  target: ['web', 'es5'],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[hash:8].chunk.js',
    publicPath: process.env.PUBLIC_PATH || './',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.svg'],
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
    ]
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: {
              loader: require.resolve('babel-loader')
            }
          },
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            include: paths.appSrc,
            use: [
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                }
              }
            ]
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('file-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[ext]',
              publicPath: './',
            }
          },
          {
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({ process: { env: envStringified } }),
    new CopyPlugin({
      patterns: [
        { from: 'public/app.js', to: "static/js/app.js" },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      templateParameters: {
        title: 'example',
        PUBLIC_PAH: '/',
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, envParams.row),
  ]
};
