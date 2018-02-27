require('babel-register')
const glob = require('glob')
const path = require('path')

const getSketches = globUrl => {
  const all = {}
  try {
    glob.sync(globUrl + '/*').forEach(function (file) {
      const name = path.parse(file).name
      const url = path.resolve(file)
      all[name] = {
        /*eslint-disable */
        Module: eval('require("' + url + '/index.js")'),
        config: eval('require("' + url + '/config.js")')
        /*eslint-enable */
      }
    })

    if (Object.keys(all).length === 0) {
      throw new Error('No sketches found')
    }

    return all
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to load sketch folder: ${error.message}`)
  }
}

module.exports = {
  getSketches
}
