if (!process.env.CVUEADMIN_PROJECT_P) {
  throw new Error('process.env.CVUEADMIN_PROJECT_P is invalid! ' + __filename);
}

if (!process.env.CVUEADMIN_CONFIG_P) {
  throw new Error('process.env.CVUEADMIN_CONFIG_P is invalid! ' + __filename);
}

let path = require('path')
let utils = require('./utils')
let config = require(process.env.CVUEADMIN_CONFIG_P)
let vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(process.env.CVUEADMIN_PROJECT_P, dir)
}

module.exports = {
  entry: {
    app: resolve('main.js')
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve(''),
      'scss_vars': resolve('styles/vars.scss'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve(''), resolve('_test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
