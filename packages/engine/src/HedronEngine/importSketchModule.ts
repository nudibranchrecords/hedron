import { Result } from './types'
import {
  NodeTypes,
  SketchConfigRaw,
  SketchConfigImported,
  SketchModule,
  SketchModuleItem,
  SketchConfigParamImported,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const processConfig = (config: SketchConfigRaw): SketchConfigImported => {
  const groupInfo: SketchConfigImported['groupInfo'] = []

  let groupIndex = -1
  const flattenedParams: SketchConfigParamImported[] = []

  config.params.forEach((param) => {
    if ('params' in param) {
      groupIndex++

      groupInfo[groupIndex] = {
        groupTitle: param.groupTitle ?? `Group ${groupIndex}`,
      }

      flattenedParams.push(
        ...param.params.map((p) => ({ ...p, title: p.title ?? p.key, groupIndex })),
      )
    } else {
      flattenedParams.push({
        ...param,
        title: param.title ?? param.key,
        groupIndex: null,
      })
    }
  })

  const processedConfig: SketchConfigImported = {
    ...config,
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
        config = processConfig(unprocessedConfig)
      } else {
        return Promise.reject(
          `Sketch config not found: ${configPath} and no valid getConfig() function found in sketch`,
        )
      }
    } else {
      const configModule = await import(/* @vite-ignore */ configPath)
      config = processConfig(configModule.default as SketchConfigRaw)
    }

    // A config could be missing a title, but it is a required parameter
    if (!config.title) {
      config.title = moduleId
    }

    for (const param of config.params) {
      if (!param.valueType) {
        // @ts-expect-error - valueType is NOT optional in SketchConfigParam, but is optional for users in config.ts
        param.valueType = NodeTypes.Number
      }
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
