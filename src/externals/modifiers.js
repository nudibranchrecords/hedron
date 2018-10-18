require('babel-register')

const all = {
  gain: {
    func: require('../coreModifiers/gain'),
    config: require('../coreModifiers/gain/config'),
  },
  range: {
    func: require('../coreModifiers/range'),
    config: require('../coreModifiers/range/config'),
  },
  threshold: {
    func: require('../coreModifiers/threshold'),
    config: require('../coreModifiers/threshold/config'),
  },
}

const getAll = () =>
  all

const work = (modifierId, control, value) =>
  all[modifierId].func(control, value)

module.exports = {
  getAll,
  work,
}
