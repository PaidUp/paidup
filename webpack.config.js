var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var minimizeOptions = {
  conservativeCollapse: false,
  preserveLineBreaks: false
};

module.exports = {
  context: path.join(__dirname, 'client'),
  entry: {
    vendor: ['angular', 'angular-ui-router', 'angular-resource', 'angular-sanitize', 'angular-cookies', 'angular-translate', 'angular-animate',
      'angular-ui-bootstrap', 'angulartics-google-analytics', 'angular-ui-mask', 'angular-local-storage', 'angulartics-mixpanel'],
    main: './src/app.js',
    less: './less/style.less'
  },
  output: {
    path: path.join(__dirname, 'build/client'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './client')) + '/!raw'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")

      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
      { test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ManifestPlugin(),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Custom template using Handlebars',
      template: path.join(__dirname, 'client/index.hbs'),
      inject: 'body',
      minify: {
        minifyJS: true,
        caseSensitive: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
      assets: {
        "style": "style.[hash].css",
      }
    }),
    new ExtractTextPlugin('styles.[hash].css'),

    new TransferWebpackPlugin([
      { from: './ico' },
      { from: './img', to: 'img' },
      { from: './templates', to: 'templates' },
      { from: './fonts', to: 'fonts' },
      { from: './css', to: 'css' },
      { from: '../server', to: '../server' }
    ])
  ],
};