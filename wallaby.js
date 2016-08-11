var wallabyWebpack = require('wallaby-webpack');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

delete webpackConfig.entry;

if(!webpackConfig.plugins) {
  webpackConfig.plugins = [];
}

webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.(gif|png|scss|css)$/, 'node-noop'));

if(!webpackConfig.externals) {
  webpackConfig.externals = {};
}

webpackConfig.externals['react'] = 'React';

if(!webpackConfig.devtool) {
  webpackConfig.devtool = 'source-map';
}

// removing babel-loader, we will use babel compiler instead, it's more performant
webpackConfig.module.loaders = webpackConfig.module.loaders.filter(function(l){
  return l.loader !== 'babel-loader';
});

delete webpackConfig.devtool;

webpackConfig.module.noParse = [];
webpackConfig.module.noParse.push(/node_modules\/sinon/);

var wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function (wallaby) {
  return {
    // set `load: false` to all source files and tests processed by webpack
    // (except external files),
    // as they should not be loaded in browser,
    // their wrapped versions will be loaded instead
    files: [
      // {pattern: 'lib/jquery.js', instrument: false},
      {pattern: 'src/**/*.js', load: false},
      {pattern: 'node_modules/react/dist/react-with-addons.js', instrument: false},
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
    ],

    tests: [
      {pattern: 'specs/**/*Specs.js', load: false}
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
      '**/*.jsx': wallaby.compilers.babel()
    },

    postprocessor: wallabyPostprocessor,

    debug: true,

    setup: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};