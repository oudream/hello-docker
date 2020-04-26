require('./check-versions')()

process.env.NODE_ENV = 'production'

let ora = require('ora')
let rm = require('rimraf')
let path = require('path')
let fs = require('fs')
let chalk = require('chalk')
let webpack = require('webpack')
let config = require(path.resolve(process.env.CVUE3_NODE_P, './config'))
let webpackConfig = require('./webpack.prod.conf')

let spinner = ora('building for production...')
spinner.start()

rm(config.build.index, err => {});

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    fs.createReadStream(path.join(config.build.assetsRoot, path.basename(config.build.index))).pipe(fs.createWriteStream(config.build.index));

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
  })
});
