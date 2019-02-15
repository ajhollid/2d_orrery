const path = require( 'path' );
const webpack = require( 'webpack' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const DIST = path.resolve( __dirname, './dist' );

module.exports = {
  entry: [
    './src/main.js',
  ],
  output: {
    path: DIST,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: 'index.html',
    } ),
    new CopyWebpackPlugin( [
      { from: './docs/favicon.ico', to: './favicon.ico' },
      { from: 'index.html' },
    ] ),
  ],
};
