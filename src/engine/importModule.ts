import { uid } from 'uid'
import { SketchModuleItem } from './store/types'

export const importSketchModule = async (
  baseUrl: string,
  moduleId: string,
): Promise<SketchModuleItem> => {
  const cacheBust = uid()

  const configModule = await import(
    /* @vite-ignore */ `${baseUrl}/${moduleId}/config.js?${cacheBust}`
  )
  const sketchModule = await import(
    /* @vite-ignore */ `${baseUrl}/${moduleId}/index.js?${cacheBust}`
  )

  const title = configModule.default.title

  return {
    title,
    moduleId,
    config: configModule.default,
    module: sketchModule.default,
  }
}
