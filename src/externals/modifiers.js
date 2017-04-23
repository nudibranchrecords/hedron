require('babel-register')

const glob = require('glob')
const path = require('path')

const all = {}

glob.sync('../modifiers/*').forEach(function (file) {
  const name = path.parse(file).name
  all[name] = {
    func: require(path.resolve(file)),
    config: require(path.resolve(file + '/config.js'))
  }
})

const getAll = () =>
  all

const work = (modifierId, control, value) =>
  all[modifierId].func(control, value)

module.exports = {
  getAll,
  work
}
