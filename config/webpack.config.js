'use strict'

const webpack = require('webpack')
const path = require('path')

const env = process.env.NODE_ENV

let entry, plugins

if (env === 'production') {
  entry = [
    'babel-polyfill',
    './src/main.js'
  ]
  plugins = [
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
      }
    ],
    noParse: /ws\/lib/
  },
  externals: {
    sketches: {
      commonjs2: path.resolve(__dirname, '../src/externals/sketches.js')
    },
    modifiers: {
      commonjs2: path.resolve(__dirname, '../src/externals/modifiers.js')
    }
  },
  target: 'node-webkit',
  plugins: plugins,
  devtool: 'cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
    hot: true
  }
}
