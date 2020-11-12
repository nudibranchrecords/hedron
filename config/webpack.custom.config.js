const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')

// Should mirror electron/renderer/globalVars.js
const globalDepNames = [
  'three',
  'postprocessing',
  'glslify',
  '@tweenjs/tween.js',
]

const staticGlobalVarsPath = path.join(process.cwd(), 'static/globalVars')

const copyPatterns = globalDepNames.map(name => ({
  from: `node_modules/${name}/**/*`,
  to: staticGlobalVarsPath,
}))

const config = config => {
  config = merge(config, {
    module: {
      rules: [
        {
          test: /\.icon\.txt$/,
          use: 'svg-inline-loader?classPrefix',
        },
      ],
    },
    plugins: [
      // Clear out static/globalVars for each build
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [`${staticGlobalVarsPath}/**/*`],
      }),
      // Copy global dependency files to be included externally in the build
      new CopyPlugin([
        {
          from: 'src/electron/renderer/globalVars.js',
          to: `${staticGlobalVarsPath}/index.js`,
        },
        ...copyPatterns,
      ]),
    ],
  })

  // By default, all dependencies are added as externals. This causes all sorts of issues with React and co
  // https://github.com/electron-userland/electron-webpack/issues/275#issuecomment-725641081
  config.externals = [
    // These are the only externals needed, as they all use the file system in some way
    'chokidar',
    'try-require',
    'glslify',
  ]

  return config
}

module.exports = config
