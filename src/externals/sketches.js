const glob = require('glob')
const path = require('path')

const all = {}

glob.sync('../sketches/*').forEach(function (file) {
  const name = path.parse(file).name
  all[name] = {
    Module: require(path.resolve(file)),
    params: require(path.resolve(file + '/params.js'))
  }
})

module.exports = all
