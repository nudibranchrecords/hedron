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

module.exports = config
