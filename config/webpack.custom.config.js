const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// Should mirror electron/renderer/globalVars.js
const globalDepNames = [
  'three',
  'postprocessing',
  'glslify',
  '@tweenjs/tween.js',
]

const staticGlobalsPath = path.join(process.cwd(), 'static/globals')

const copyPatterns = globalDepNames.map(name => ({
  from: `node_modules/${name}/**/*`,
  to: staticGlobalsPath,
}))

const config = {
  module: {
    rules: [
      {
        test: /\.icon\.txt$/,
        use: 'svg-inline-loader?classPrefix',
      },
    ],
  },
  plugins: [
    // Clear out static/globals for each build
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [`${staticGlobalsPath}/**/*`],
    }),
    // Copy global dependency files to be included externally in the build
    new CopyPlugin([
      {
        from: 'src/electron/renderer/globalVars.js',
        to: `${staticGlobalsPath}/index.js`,
      },
      ...copyPatterns,
    ]),
  ],
}

module.exports = config
