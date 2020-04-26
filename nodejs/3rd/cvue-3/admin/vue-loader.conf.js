let path = require('path')
let utils = require('./utils')
let config = require(path.resolve(process.env.CVUE3_NODE_P, './config'))
let isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
