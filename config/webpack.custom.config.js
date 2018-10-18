const tryRequire = require('try-require')

const config = {
  module: {
    rules: [
      {
        test: /\.icon\.txt$/,
        use: 'svg-inline-loader?classPrefix',
      },
    ],
  },
}

if (process.env.NODE_ENV === 'development') {
  const devConfig = tryRequire('./dev.config.js', require)
  let devServerOptions = {}

  if (devConfig && devConfig.defaultProject) {
    const defaultProject = require(devConfig.defaultProject)
    const sketchesPath = defaultProject.project.sketchesPath

    if (sketchesPath) {
      devServerOptions = {
        contentBase: sketchesPath,
        watchContentBase: true,
      }
    }
  }

  config.devServer = devServerOptions
}

module.exports = config
