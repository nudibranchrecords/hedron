const webpack = require('webpack')
const path = require('path')

const env = process.env.NODE_ENV

var entry

if (env === 'production') {
  entry = [
    'babel-polyfill',
    './src/main.js'
  ]
} else {
  entry = [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './src/main.js'
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
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
    // ,enable HMR globally
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,

    // respond to 404s with index.html

    hot: true
    // enable HMR on the server
  }
}
