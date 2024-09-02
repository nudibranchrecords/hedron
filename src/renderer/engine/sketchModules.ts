import { uid } from 'uid'
import { getSketchesServerUrl } from './globals'
import { SketchConfig, SketchModule, SketchModules, useAppStore } from './sketchesState'

const importSketch = async (
  sketchId: string,
): Promise<{ config: SketchConfig; module: SketchModule }> => {
  const base = getSketchesServerUrl()
  const cacheBust = uid()

  const configModule = await import(/* @vite-ignore */ `${base}/${sketchId}/config.js?${cacheBust}`)
  const sketchModule = await import(/* @vite-ignore */ `${base}/${sketchId}/index.js?${cacheBust}`)

  return {
    config: configModule.default,
    module: sketchModule.default,
  }
}

export const initiateSketchModules = (moduleIds: string[]): void => {
  const getSketchInfo = async (): Promise<void> => {
    const modules: SketchModules = {}
    for (const moduleId of moduleIds) {
      const { config, module } = await importSketch(moduleId)

      const title = config.title

      modules[moduleId] = {
        moduleId,
        title,
        module,
        config,
      }
    }

    const appState = useAppStore.getState()
    appState.setSketchModules(modules)
    appState.setIsSketchModulesReady()
  }

  getSketchInfo()
}

export const reimportSketchModule = async (moduleId: string): Promise<void> => {
  const { config, module } = await importSketch(moduleId)

  const title = config.title

  const item = {
    moduleId,
    title,
    module,
    config,
  }

  useAppStore.getState().setSketchModuleItem(item)
}
