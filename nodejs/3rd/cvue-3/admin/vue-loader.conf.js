if (!process.env.CVUEADMIN_CONFIG_P) {
  throw new Error('process.env.CVUEADMIN_CONFIG_P is invalid! ' + __filename);
}

let utils = require('./utils')
let config = require(process.env.CVUEADMIN_CONFIG_P)
let isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
