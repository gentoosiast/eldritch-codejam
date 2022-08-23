const devMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WebpackPWAManifestPlugin = require('webpack-pwa-manifest');

module.exports = {
  mode: devMode,
  devtool: devMode === 'production' ? 'source-map' : 'eval-source-map',
  entry: ['./src/index.js', './src/sass/main.scss'],
  output: {
    clean: true,
    filename: '[name].[contenthash].js',
    assetModuleFilename: './assets/[name].[contenthash][ext][query]',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    port: 5333,
    client: {
      overlay: true,
      progress: true,
    },
    liveReload: true,
    watchFiles: ['src/*.html'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/assets/favicon.ico', to: '[name][ext]' }],
    }),
    new ESLintPlugin(),
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new WebpackPWAManifestPlugin({
      name: 'Eldritch Horrors CodeJam by Sergey Koksharov',
      publicPath: './',
      orientation: 'omit',
      icons: [
        {
          src: path.resolve('./src/assets/icon-192.png'),
          destination: 'assets',
          sizes: '192x192',
        },
        {
          src: path.resolve('./src/assets/icon-512.png'),
          destination: 'assets',
          sizes: '512x512',
        },
      ],
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new StylelintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          devMode === 'production'
            ? MiniCSSExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(avif|jpe?g||png|svg|webp)$/,
        type: 'asset',
      },
      {
        test: /\.(mp3|ogg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/media/[name].[ext]',
        },
      },
      {
        test: /\.(eot|otf|ttf|woff2?)$/,
        type: 'asset/resource',
      },
    ],
  },
};
