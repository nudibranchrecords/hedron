const devConfig = require('./dev.config.js')

let devServerOptions = {}

console.log(devConfig)

if (devConfig && devConfig.sketchFolder) {
  devServerOptions = {
    contentBase: devConfig.sketchFolder.slice(0, -2),
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
