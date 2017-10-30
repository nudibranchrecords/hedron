require('babel-register')

const glob = require('glob')
const path = require('path')

const all = {}

const url = './sketches/*'

glob.sync(url).forEach(function (file) {
  const name = path.parse(file).name
  console.log(path.resolve(file))
  all[name] = {
    Module: eval('require(path.resolve(file))'),
    config: eval('require(path.resolve(file + "/config.js"))')
  }
})

module.exports = all
