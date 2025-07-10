import path from 'path'
import { FSWatcher } from 'chokidar'
import { GlobalEngineVarsRef } from '@hedron/engine'
import { debounceWithId } from '@shared/utils/debounceWithId'
import { FileWatchEvents } from '@shared/Events'

const WATCH_DEBOUNCE_MS = 300

export const getSketchIdFromPath = (sketchPath: string): string => {
  const folderName = path.dirname(sketchPath).split(path.sep).pop()
  if (!folderName) return sketchPath
  return folderName
}

export const watchWithDebounce = (
  watcher: FSWatcher,
  eventName: FileWatchEvents,
  cb: (path: string, moduleId: string) => void,
) => {
  watcher.on(eventName, (path) => {
    const id = getSketchIdFromPath(path)

    debounceWithId(
      () => {
        cb(path, id)
      },
      WATCH_DEBOUNCE_MS,
      id + eventName,
    )
  })
}

export const generateModuleExportString = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any,
  moduleName: string,
  globalPath: string,
): string => {
  const exportNames = Object.getOwnPropertyNames(module)
    .filter((name) => {
      if (name === 'default' || name === '__esModule') return false
      try {
        const value = module[name]
        if (typeof value === 'function' && name.startsWith('_')) return false
        return true
      } catch (e) {
        return false
      }
    })
    .sort()

  const exportLines = exportNames.map((name) => `export const ${name} = MODULE.${name};`).join('\n')

  return `
// ${moduleName} submodule proxy - re-exports from Hedron's instance
const MODULE = ${globalPath};
export default MODULE;

// Static named exports
${exportLines}
`.trim()
}

export const createGlobalVarModuleFiles = async (
  outdir: string,
  globalVarsRef: GlobalEngineVarsRef,
): Promise<void> => {
  const fs = require('fs')

  try {
    for (const { varName, packageName } of globalVarsRef.vars) {
      const MODULE = await import(packageName)
      const proxy = generateModuleExportString(
        MODULE,
        packageName,
        `${globalVarsRef.dependenciesRoot}.${varName}`,
      )
      fs.writeFileSync(path.join(outdir, `${varName}.js`), proxy)
    }
  } catch (error) {
    console.error('Failed to create Three.js proxy modules:', error)
  }
}
