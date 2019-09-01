require('@babel/register')

const glob = require('glob')
const path = require('path')
const errcode = require('err-code')
const fs = require('fs')

const ignoredFolders = ['node_modules']

const loadFile = resolvedPath => {
  let file = false

  if (fs.existsSync(resolvedPath)) {
    if (resolvedPath.includes('\\')) {
      // For paths in Windows the next require function requires the path to have \\ as a separator instead of only \
      resolvedPath = resolvedPath.replace(/\\/g, '\\\\')
    }

    // Must purge the require cache for hot reloading to work
    // We must do this inside an eval so it is in the same context as the eval'd sketch below
    /*eslint-disable */
    eval(`
      // Resolve the module identified by the specified name
      let mod = require.resolve('${resolvedPath}')

      // Check if the module has been resolved and found within
      // the cache
      if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse (mod) {
          // Go over each of the module's children and
          // traverse them
          mod.children.forEach(function (child) {
            traverse(child)
          })
          // delete from cache
          delete require.cache[mod.id]
        }(mod))
      }
    `)
 
    file = eval(`require('${resolvedPath}')`)
    /* eslint-enable */
  }

  return file
}

const loadSketch = (file) => {
  const url = path.resolve(file)
  let indexUrl = path.format({ dir: url, base: 'index.js' })
  let configUrl = path.format({ dir: url, base: 'config.js' })

  return {
    Module: loadFile(indexUrl),
    config: loadFile(configUrl),
  }
}

const loadConfig = (file) => {
  const url = path.resolve(file)
  let configUrl = path.format({ dir: url, base: 'config.js' })

  return loadFile(configUrl)
}

const findSketches = (file, all, pathArray) => {
  if (fs.statSync(file).isDirectory) {
    const name = path.parse(file).name
    if (ignoredFolders.includes(name)) {
      return
    }

    const sketch = loadSketch(file)

    if (sketch.Module !== false) {
      sketch.config.filePathArray = pathArray
      sketch.config.filePath = file
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
    console.error(`Failed to load sketch folder.`, error)
    throw (error)
  }
}

module.exports = {
  loadSketches,
  loadSketch,
  loadConfig,
}
