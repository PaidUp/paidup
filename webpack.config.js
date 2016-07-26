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
      'angular-ui-bootstrap', 'angular-ui-bootstrap', 'angulartics-google-analytics', 'angular-ui-mask', 'angular-local-storage', 'angulartics-mixpanel'],
    main: './src/app.js',
    less: './less/style.less'
  },
  output: {
    path: path.join(__dirname, 'build/client'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {


    loaders: [

      {
        test: /\.html$/,
        loader: "html"
      }

      ,

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
    new ManifestPlugin(),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Custom template using Handlebars',
      template: path.join(__dirname, 'client/index.hbs'),
      assets: {
        "style": "style.[hash].css",
      }
    }),
    new ExtractTextPlugin('styles.[hash].css'),

    new TransferWebpackPlugin([
      { from: './ico' },
      { from: './img/email', to: 'img/email' },
      //{ from: './templates', to: 'templates' },
      { from: './fonts', to: 'fonts' },
      { from: './css', to: 'css' },
      { from: '../server', to: '../server' }

    ])

  ],



};
