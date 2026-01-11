import { Result } from './types'
import {
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
    'valueType' in param && param.valueType !== undefined ? param.valueType : 'number'

  return {
    ...param,
    groupIndex,
    valueType,
  } as SketchConfigParamImported
}

interface ProcessConfigOptions {
  fallBackTitle: string
}

export const processConfig = (
  config: SketchConfigRaw,
  { fallBackTitle }: ProcessConfigOptions,
): SketchConfigImported => {
  const paramGroupInfo: SketchConfigImported['paramGroupInfo'] = []
  const shotGroupInfo: SketchConfigImported['shotGroupInfo'] = []

  let groupIndex = -1
  const flattenedParams: SketchConfigImported['params'] = []
  const flattenedShots: SketchConfigImported['shots'] = []

  if (config.params) {
    config.params.forEach((param) => {
      if ('params' in param) {
        groupIndex++

        paramGroupInfo[groupIndex] = {
          groupTitle: param.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedParams.push(...param.params.map((p) => ensureParamImported(p, groupIndex)))
      } else {
        flattenedParams.push(ensureParamImported(param, null))
      }
    })
  }

  if (config.shots) {
    config.shots.forEach((shot) => {
      if ('shots' in shot) {
        groupIndex++

        shotGroupInfo[groupIndex] = {
          groupTitle: shot.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedShots.push(
          ...shot.shots.map((s) => ({ ...s, groupIndex, title: s.title ?? s.key })),
        )
      } else {
        flattenedShots.push({ ...shot, groupIndex: null, title: shot.title ?? shot.key })
      }
    })
  }

  const processedConfig: SketchConfigImported = {
    ...config,
    title: config.title ?? fallBackTitle,
    params: flattenedParams,
    shots: flattenedShots,
    paramGroupInfo: paramGroupInfo,
    shotGroupInfo: shotGroupInfo,
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
