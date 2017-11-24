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

module.exports = {
  module: {
    rules: [
      {
        test: /\.icon\.txt$/,
        use: 'svg-inline-loader?classPrefix'
      }
    ]
  },
  devServer: devServerOptions
}
