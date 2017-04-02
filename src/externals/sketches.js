const glob = require('glob')
const path = require('path')

const all = {}
console.log('external sketches')
glob.sync('../sketches/*').forEach(function (file) {
  const name = path.parse(file).name
  all[name] = require(path.resolve(file))
})

module.exports = all
