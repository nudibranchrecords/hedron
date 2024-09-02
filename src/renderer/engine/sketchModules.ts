import { uid } from 'uid'
import { getSketchesServerUrl } from './globals'
import { SketchModules, useAppStore } from './sketchesState'

const importSketch = async (sketchId: string): Promise<{ config: any; module: any }> => {
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
      }
    }

    const appState = useAppStore.getState()
    appState.setSketchModules(modules)
    appState.setIsSketchModulesReady()
  }

  getSketchInfo()
}

export const reimportSketchModule = async (sketchId: string): Promise<void> => {
  const { config, module } = await importSketch(sketchId)

  const name = config.defaultTitle

  const item = {
    sketchId,
    name,
    module,
  }

  useAppStore.getState().setSketchModuleItem(item)
}
