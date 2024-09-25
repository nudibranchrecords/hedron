import { uid } from 'uid'
import { SketchConfig, SketchModule, SketchModuleItem } from './store/types'

export const importSketchModule = async (
  baseUrl: string,
  moduleId: string,
): Promise<SketchModuleItem> => {
  const cacheBust = uid()

  const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`
  const sketchPath = `${baseUrl}/${moduleId}/index.js?${cacheBust}`

  const configModule = await import(/* @vite-ignore */ configPath)
  const sketchModule = await import(/* @vite-ignore */ sketchPath)

  const config: SketchConfig = configModule.default
  const module: SketchModule = sketchModule.default

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
