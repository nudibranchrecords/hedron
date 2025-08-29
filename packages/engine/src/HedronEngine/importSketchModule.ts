import { Result } from './types'
import {
  NodeTypes,
  SketchConfigRaw,
  SketchConfigImported,
  SketchModule,
  SketchModuleItem,
  SketchConfigParamImported,
  SketchConfigParam,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const ensureParamImported = (
  param: SketchConfigParam,
  groupIndex: number | null,
): SketchConfigParamImported => {
  const valueType =
    'valueType' in param && param.valueType !== undefined ? param.valueType : NodeTypes.Number

  return {
    ...param,
    groupIndex,
    valueType,
  } as SketchConfigParamImported
}

interface ProcessConfigOptions {
  fallBackTitle: string
}

const processConfig = (
  config: SketchConfigRaw,
  { fallBackTitle }: ProcessConfigOptions,
): SketchConfigImported => {
  const groupInfo: SketchConfigImported['groupInfo'] = []

  let groupIndex = -1
  const flattenedParams: SketchConfigParamImported[] = []

  if (config.params) {
    config.params.forEach((param) => {
      if ('params' in param) {
        groupIndex++

        groupInfo[groupIndex] = {
          groupTitle: param.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedParams.push(...param.params.map((p) => ensureParamImported(p, groupIndex)))
      } else {
        flattenedParams.push(ensureParamImported(param, null))
      }
    })
  }

  const processedConfig: SketchConfigImported = {
    ...config,
    title: config.title ?? fallBackTitle,
    params: flattenedParams,
    groupInfo,
  }

  return processedConfig
}

export const importSketchModule = async (
  baseUrl: string,
  moduleId: string,
): Promise<Result<SketchModuleItem>> => {
  try {
    const cacheBust = createUniqueId()

    // Get the sketch module
    const sketchPath = `${baseUrl}/${moduleId}/index.js?${cacheBust}`
    if ((await fetch(sketchPath)).status !== 200) {
      return Promise.reject(`Sketch module not found: ${sketchPath}`)
    }
    const sketchModule = await import(/* @vite-ignore */ sketchPath)
    const module: SketchModule = sketchModule.default

    const processConfigOptions = {
      fallBackTitle: moduleId,
    }

    // Get the sketch config
    const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`
    let config: SketchConfigImported
    if ((await fetch(configPath)).status !== 200) {
      // No config file found
      // Try instancing the sketch, and call getConfig() on it
      const tempModule = new module(undefined)
      const unprocessedConfig = tempModule.getConfig?.() as SketchConfigRaw | undefined

      tempModule.dispose?.()

      if (unprocessedConfig) {
        config = processConfig(unprocessedConfig, processConfigOptions)
      } else {
        return Promise.reject(
          `Sketch config not found: ${configPath} and no valid getConfig() function found in sketch`,
        )
      }
    } else {
      const configModule = await import(/* @vite-ignore */ configPath)
      config = processConfig(configModule.default as SketchConfigRaw, processConfigOptions)
    }

    return {
      success: true,
      error: undefined,
      data: {
        moduleId,
        config,
        module,
      },
    }
  } catch (error) {
    console.error(error)

    return {
      data: undefined,
      success: false,
      error: `[HEDRON] Sketch module failed to import: ${moduleId}`,
    }
  }
}
