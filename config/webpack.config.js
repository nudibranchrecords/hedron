'use strict'

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

const env = process.env.NODE_ENV

let entry, plugins
const externals = './src/externals/'

let devConfig = {}

try {
  devConfig = require('./dev.config')
} catch (err) {
  console.log('No dev config file found: ', err.message)
}

console.log(devConfig.defaultProject)

if (env !== 'development') {
  entry = [
    'babel-polyfill',
    './src/main.js'
  ]
  plugins = [
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '../') }),
    new CopyWebpackPlugin([
      { from: 'config/package.build.json', to: 'package.json' },
      { from: 'index.html' },
      { from: 'output.html' },
      { from: 'sketches/**/*' },
      { from: 'modifiers/**/*' },
      { from: 'src/externals/*' },
      { from: 'src/Engine/Sketch.js', to: 'src/Engine' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
} else {
  entry = [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './src/main.js'
  ]
  plugins = [
    new webpack.DefinePlugin({
      DEFAULT_PROJECT: JSON.stringify(devConfig.defaultProject)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

module.exports = {
  entry: entry,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'svg-inline-loader?classPrefix' }
        ]
      }
    ],
    noParse: /ws\/lib/
  },
  externals: {
    sketches: {
      commonjs2: externals + 'sketches.js'
    },
    modifiers: {
      commonjs2: externals + 'modifiers.js'
    }
  },
  target: 'node-webkit',
  plugins: plugins,
  devtool: 'cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    watchContentBase: devConfig.sketchDev,
    port: 8080,
    historyApiFallback: true,
    hot: true
  }
}
