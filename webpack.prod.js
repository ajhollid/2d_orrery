const merge = require( 'webpack-merge' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );

const path = require( 'path' );
const common = require( './webpack.common.js' );

const DIST = path.resolve( __dirname, './dist' );


module.exports = merge( common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin( {
        cache: true,
        parallel: true,
        sourceMap: true,
      } ),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin( DIST ),
  ],
} );
