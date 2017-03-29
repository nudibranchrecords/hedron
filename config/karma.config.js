module.exports = function (config) {
  config.set({
    basePath: '../', // project root in relation to bin/karma.js
    browsers: ['PhantomJS'],
    files: [
      {
        pattern: './src/**/*.spec.js',
        exclude: ['/node_modules/'],
        watched: false,
        served: true,
        included: true
      }
    ],
    preprocessors : {
      './src/**/*.spec.js' : ['browserify']
    },
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-browserify'
    ],
    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    },
    frameworks: ['browserify', 'mocha'],
    reporters: ['mocha']
  })
}
