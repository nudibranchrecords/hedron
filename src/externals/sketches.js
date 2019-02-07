require('@babel/register')

const glob = require('glob')
const path = require('path')
const errcode = require('err-code')
const fs = require('fs')

const ignoredFolders = ['node_modules']

const loadSketch = (file) => {
  const url = path.resolve(file)
  let indexUrl = path.format({ dir: url, base: 'index.js' })
  let sketch = false

  if (fs.existsSync(indexUrl)) {
    let configUrl = path.format({ dir: url, base: 'config.js' })

    if (indexUrl.indexOf('\\')) {
      // For paths in Windows the next require function requires the path to have \\ as a separator instead of only \
      indexUrl = indexUrl.replace(/\\/g, '\\\\')
      configUrl = configUrl.replace(/\\/g, '\\\\')
    }

    /*eslint-disable */
    // need to invalidate require cache for any hot changes to be picked up
    // this must be inside an eval() so it is in the correct context as the scripts eval'd below
    eval(`delete require.cache[require.resolve('${indexUrl}')]`)
    eval(`delete require.cache[require.resolve('${configUrl}')]`)

    sketch = {
      Module: eval(`require('${indexUrl}')`),
      config: eval(`require('${configUrl}')`)
    }
    /*eslint-enable */
  }

  return sketch
}

const findSketches = (file, all, pathArray) => {
  if (fs.statSync(file).isDirectory) {
    const name = path.parse(file).name
    if (ignoredFolders.includes(name)) {
      return
    }

    const sketch = loadSketch(file)

    if (sketch !== false) {
      sketch.config.filePathArray = pathArray
      all[name] = sketch
    } else {
      glob.sync(file + '/*').forEach(function (childFile) {
        findSketches(childFile, all, [...pathArray, name])
      })
    }
  }
}

const loadSketches = globUrl => {
  const all = {}
  try {
    glob.sync(globUrl + '/*').forEach(function (file) {
      findSketches(file, all, [])
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
  loadSketches,
  loadSketch,
}
