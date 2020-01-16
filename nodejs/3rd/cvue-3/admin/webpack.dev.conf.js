let path = require('path')

if (!process.env.CVUEADMIN_CONFIG_P) {
  throw new Error('process.env.CVUEADMIN_CONFIG_P is invalid! ' + __filename);
}

if (!process.env.CVUEADMIN_INDEX_PAGE_FP) {
  throw new Error('process.env.CVUEADMIN_INDEX_PAGE_FP is invalid! ' + __filename);
}

let utils = require('./utils')
let webpack = require('webpack')
let config = require(process.env.CVUEADMIN_CONFIG_P)
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.conf')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [path.join(__dirname, 'dev-client')].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin({
      // Options...
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: process.env.CVUEADMIN_INDEX_PAGE_FP,
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
