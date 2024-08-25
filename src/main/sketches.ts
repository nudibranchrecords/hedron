import fs from 'fs'
import path from 'path'

export const loadFileAsText = (resolvedPath: string): string => {
  let text

  if (fs.existsSync(resolvedPath)) {
    if (resolvedPath.includes('\\')) {
      // For paths in Windows the next require function requires the path to have \\ as a separator instead of only \
      resolvedPath = resolvedPath.replace(/\\/g, '\\\\')
    }

    // Must purge the require cache for hot reloading to work
    // purgeRequireCache(resolvedPath)

    /* eslint-disable-next-line */
    // file = eval(`require('${resolvedPath}')`)

    try {
      text = fs.readFileSync(resolvedPath, 'utf8')
    } catch (err) {
      console.error(err)
    }
  }

  if (!text) {
    throw new Error('file issue')
    // throw errcode(new Error(`File not found: ${resolvedPath}`), 'FILE_NOT_FOUND', {
    //   forcePopup: true,
    // })
  }

  return text
}

const loadSketch = (file) => {
  return {
    Module: loadIndex(file),
    config: loadConfig(file),
  }
}

export const loadIndex = (file) => {
  try {
    const url = path.resolve(file)
    const indexUrl = path.format({ dir: url, base: 'index.js' })

    return loadFileAsText(indexUrl)
  } catch (error) {
    // throw errcode(new Error(`No index file found: ${error.message}`), 'SKETCH_INDEX_NOT_FOUND', {
    //   forcePopup: true,
    // })
  }
}

const loadConfig = (file) => {
  try {
    const url = path.resolve(file)
    const configUrl = path.format({ dir: url, base: 'config.js' })

    return loadFileAsText(configUrl)
  } catch (error) {
    // throw errcode(new Error(`No config file found: ${error.message}`), 'SKETCH_CONFIG_NOT_FOUND', {
    //   forcePopup: true,
    // })
  }
}
