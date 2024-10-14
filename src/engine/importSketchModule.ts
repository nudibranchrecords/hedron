import { SketchConfig, SketchModule, SketchModuleItem } from '@engine/store/types'
import { createUniqueId } from '@engine/utils/createUniqueId'

export const importSketchModule = async (
  baseUrl: string,
  moduleId: string,
): Promise<SketchModuleItem> => {
  const cacheBust = createUniqueId()

  // Get the sketch module
  const sketchPath = `${baseUrl}/${moduleId}/index.js?${cacheBust}`
  if ((await fetch(sketchPath)).status !== 200) {
    return Promise.reject(`Sketch module not found: ${sketchPath}`)
  }
  const sketchModule = await import(/* @vite-ignore */ sketchPath)
  const module: SketchModule = sketchModule.default

  // Get the sketch config
  const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`
  let config: SketchConfig
  if ((await fetch(configPath)).status !== 200) {
    // No config file found
    // Try instancing the sketch, and call getConfig() on it
    const tempModule = new module()
    config = tempModule.getConfig?.()
    if (!config) {
      return Promise.reject(
        `Sketch config not found: ${configPath} and no valid getConfig() function found in sketch`,
      )
    }
  } else {
    const configModule = await import(/* @vite-ignore */ configPath)
    config = configModule.default
  }

  // A config could be missing a title, but it is a required parameter
  if (!config.title) {
    config.title = moduleId
  }

  return {
    moduleId,
    config,
    module,
  }
}
