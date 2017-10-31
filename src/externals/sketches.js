require('babel-register')
const config = require('../../config/dev.config.js')

const glob = require('glob')
const path = require('path')

const all = {}

const url = config.sketchFolder

glob.sync(url).forEach(function (file) {
  const name = path.parse(file).name
  const url = path.resolve(file)
  all[name] = {
    Module: eval('require("' + url + '")'),
    config: eval('require("' + url + '/config.js")')
  }
})

module.exports = all
