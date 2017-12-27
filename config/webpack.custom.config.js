const config = {
  module: {
    rules: [
      {
        test: /\.icon\.txt$/,
        use: 'svg-inline-loader?classPrefix'
      }
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  const devConfig = require('./dev.config.js')
  let defaultProject
  if (devConfig.defaultProject) {
    defaultProject = require(devConfig.defaultProject)
  }
  const sketchesPath = defaultProject && defaultProject.project.sketchesPath
  let devServerOptions = {}

  if (sketchesPath) {
    devServerOptions = {
      contentBase: sketchesPath,
      watchContentBase: true
    }
  }

  config.devServer = devServerOptions
}

module.exports = config
