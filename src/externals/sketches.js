require('@babel/register')

const glob = require('glob')
const path = require('path')
const errcode = require('err-code')
const fs = require('fs')

const ignoredFolders = ['node_modules']
const purgeRequireCache = require('./purgeRequireCache')

const loadFile = resolvedPath => {
  let file = false

  if (fs.existsSync(resolvedPath)) {
    if (resolvedPath.includes('\\')) {
      // For paths in Windows the next require function requires the path to have \\ as a separator instead of only \
      resolvedPath = resolvedPath.replace(/\\/g, '\\\\')
    }

    // Must purge the require cache for hot reloading to work
    purgeRequireCache(resolvedPath)

    /* eslint-disable-next-line */
    file = eval(`require('${resolvedPath}')`)
  }

  if (!file) {
    throw errcode(
      new Error(`File not found: ${resolvedPath}`),
      'FILE_NOT_FOUND',
      { forcePopup: true }
    )
  }

  return file
}

const loadSketch = (file) => {
  return {
    Module: loadIndex(file),
    config: loadConfig(file),
  }
}

const loadIndex = (file) => {
  try {
    const url = path.resolve(file)
    let indexUrl = path.format({ dir: url, base: 'index.js' })

    return loadFile(indexUrl)
  } catch (error) {
    throw errcode(
      new Error(`No index file found: ${error.message}`),
      'SKETCH_INDEX_NOT_FOUND',
      { forcePopup: true }
    )
  }
}

const loadConfig = (file) => {
  try {
    const url = path.resolve(file)
    let configUrl = path.format({ dir: url, base: 'config.js' })

    return loadFile(configUrl)
  } catch (error) {
    throw errcode(
      new Error(`No config file found: ${error.message}`),
      'SKETCH_CONFIG_NOT_FOUND',
      { forcePopup: true }
    )
  }
}

const findSketches = (file, all, pathArray) => {
  if (fs.statSync(file).isDirectory) {
    const name = path.parse(file).name
    if (ignoredFolders.includes(name)) {
      return
    }

    let numErrors = 0
    let badFile = ''

    const sketch = {
      Module: null,
      config: null,
    }

    try {
      sketch.Module = loadIndex(file)
    } catch {
      numErrors++
      badFile = 'index'
    }

    try {
      sketch.config = loadConfig(file)
    } catch {
      numErrors++
      badFile = 'config'
    }

    switch (numErrors) {
      case 0:
        // If we havent had any file errors, set the sketch
        sketch.config.filePathArray = pathArray
        sketch.config.filePath = file
        all[name] = sketch
        break
      case 1:
        // If only one file is missing (e.g. config but no index or index but no config)
        throw errcode(
          new Error(`File not found: ${badFile}`),
          'FILE_NOT_FOUND',
          { forcePopup: true }
        )
      case 2:
        // If both files are missing, keep looking at child folders
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
      throw errcode(
        new Error('No sketches found in folder.'),
        'NO_SKETCH_FOLDER',
        { forcePopup: true }
      )
    }

    return all
  } catch (error) {
    console.error(`Failed to load sketches folder.`, error)
    throw error
  }
}

module.exports = {
  loadSketches,
  loadSketch,
  loadConfig,
}
