// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
var autoprefixer = require('autoprefixer');

var isProd = (process.env.NODE_ENV || '').trim().toLowerCase() === 'production';

var config = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: './entry.js',
  },
  output: {
    path: path.join(__dirname, 'target', 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'specs')
        ],
        loaders: ['babel?cacheDirectory']
      },{
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      }
    ]
  },
  postcss: function () {
    return {
      defaults: [autoprefixer],
      cleaner:  [autoprefixer({ browsers: [
        'last 3 versions',
        'ie >= 9'
      ]})]
    };
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss'],
    root: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src'),
      path.join(__dirname, 'src', 'libs')
    ],
    // for tests
    alias: {
      'sinon': 'sinon/pkg/sinon'
    }
  },
  plugins: [
    new webpack.ResolverPlugin(new DirectoryNamedWebpackPlugin(true)),
  ].concat(isProd ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        warnings: false,
        unused: true,
        drop_console: true,
      },
      beautify: false,
      mangle: true,
      output: {
        comments: false
      },
    })
  ] : [])
};
module.exports = config;