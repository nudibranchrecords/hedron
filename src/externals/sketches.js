require('babel-register')
const glob = require('glob')
const path = require('path')
const errcode = require('err-code')

const loadSketches = globUrl => {
  const all = {}
  try {
    glob.sync(globUrl + '/*').forEach(function (file) {
      const name = path.parse(file).name
      const url = path.resolve(file)
      let indexUrl = path.format({ dir: url, base: 'index.js' })
      let configUrl = path.format({ dir: url, base: 'config.js' })

      if (indexUrl.indexOf('\\')) {
        // For paths in Windows the next require function requires the path to have \\ as a separator instead of only \
        indexUrl = indexUrl.replace(/\\/g, '\\\\')
        configUrl = configUrl.replace(/\\/g, '\\\\')
      }

      all[name] = {
        /*eslint-disable */
        Module: eval('require("' + indexUrl + '")'),
        config: eval('require("' + configUrl + '")')
        /*eslint-enable */
      }
    })

    if (Object.keys(all).length === 0) {
      throw errcode(new Error('No sketches found'), 'NO_SKETCH_FOLDER')
    }

    return all
  } catch (error) {
    console.error(`Failed to load sketch folder: ${error.message}`)
    throw (error)
  }
}

module.exports = {
  loadSketches
}
