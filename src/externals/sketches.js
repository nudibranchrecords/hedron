require('babel-register')
const glob = require('glob')
const path = require('path')

const getSketches = globUrl => {
  const all = {}

  glob.sync(globUrl + '/*').forEach(function (file) {
    const name = path.parse(file).name
    const url = path.resolve(file)
    all[name] = {
      /*eslint-disable */
      Module: eval('require("' + url + '")'),
      config: eval('require("' + url + '/config.js")')
      /*eslint-enable */
    }
  })

  return all
}

module.exports = {
  getSketches
}
