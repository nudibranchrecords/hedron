require('babel-register')

const glob = require('glob')
const path = require('path')

const all = {}

const url = './modifiers/*'

glob.sync(url).forEach(function (file) {
  const name = path.parse(file).name
  console.log(path.resolve(file))
  all[name] = {
    func: eval('require(path.resolve(file))'),
    config: eval('require(path.resolve(file + "/config.js"))')
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
