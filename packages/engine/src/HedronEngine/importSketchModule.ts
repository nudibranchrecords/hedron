import { Result } from './types'
import { safeImport } from './importUtils'
import {
  ConfigParamImported,
  ConfigShotImported,
  ConfigSketch,
  ConfigSketchImported,
  SketchConfigParam,
  SketchConfigShot,
  SketchModule,
  SketchModuleItem,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

interface ProcessConfigOptions {
  fallBackTitle: string
}

const ensureParamConfig = (param: SketchConfigParam, groupIndex: number): ConfigParamImported => {
  const base = {
    title: param.title ?? param.key,
    groupIndex,
    nodeType: 'param',
  } as const

  if (param.valueType === undefined) {
    return {
      ...param,
      ...base,
      valueType: 'number',
    }
  }

  return {
    ...param,
    ...base,
  } as ConfigParamImported
}

const ensureShotConfig = (shot: SketchConfigShot, groupIndex: number): ConfigShotImported => {
  return {
    ...shot,
    title: shot.title ?? shot.key,
    groupIndex,
    nodeType: 'shot',
  }
}

export const processSketchConfig = (
  config: ConfigSketch,
  { fallBackTitle }: ProcessConfigOptions,
): ConfigSketchImported => {
  const groupInfo: ConfigSketchImported['groupInfo'] = []

  let groupIndex = -1
  let shotGroupIndex = -1
  const flattenedNodes: ConfigSketchImported['nodes'] = []
  const ungroupedParams: SketchConfigParam[] = []
  const ungroupedShots: SketchConfigShot[] = []

  if (config.params) {
    config.params.forEach((param) => {
      if ('params' in param) {
        groupIndex++

        groupInfo[groupIndex] = {
          groupTitle: param.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedNodes.push(...param.params.map((p) => ensureParamConfig(p, groupIndex)))
      } else {
        ungroupedParams.push(param)
      }
    })

    if (ungroupedParams.length > 0) {
      // Add ungrouped params as a separate group at the end
      groupIndex++

      groupInfo[groupIndex] = {
        groupTitle: groupIndex === 0 ? 'Params' : `Ungrouped Params`,
      }

      flattenedNodes.push(...ungroupedParams.map((p) => ensureParamConfig(p, groupIndex)))
    }
  }

  if (config.shots) {
    config.shots.forEach((shot) => {
      if ('shots' in shot) {
        groupIndex++
        shotGroupIndex++

        groupInfo[groupIndex] = {
          groupTitle: shot.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedNodes.push(...shot.shots.map((s) => ensureShotConfig(s, groupIndex)))
      } else {
        ungroupedShots.push(shot)
      }
    })

    if (ungroupedShots.length > 0) {
      // Add ungrouped shots as a separate group at the end
      groupIndex++

      groupInfo[groupIndex] = {
        groupTitle: shotGroupIndex === -1 ? 'Shots' : `Ungrouped Shots`,
      }

      flattenedNodes.push(...ungroupedShots.map((s) => ensureShotConfig(s, groupIndex)))
    }
  }

  const processedConfig: ConfigSketchImported = {
    title: config.title ?? fallBackTitle,
    description: config.description,
    nodes: flattenedNodes,
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

    const sketchImport = await safeImport(sketchPath)
    if (!sketchImport.ok) {
      return { success: false, error: sketchImport.error, data: undefined }
    }

    const module: SketchModule = sketchImport.module.default

    const processConfigOptions = {
      fallBackTitle: moduleId,
    }

    let config: ConfigSketchImported

    // First try to get config from static getConfig()
    const unprocessedConfigFromGetConfig = module.getConfig?.() as ConfigSketch | undefined

    if (unprocessedConfigFromGetConfig) {
      config = processSketchConfig(unprocessedConfigFromGetConfig, processConfigOptions)
    } else {
      // If no getConfig(), try to import config.js
      const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`

      const configImport = await safeImport(configPath)
      if (configImport.ok) {
        config = processSketchConfig(
          configImport.module.default as ConfigSketch,
          processConfigOptions,
        )
      } else {
        console.warn(
          `Couldn't find sketch config: ${configPath}, generating empty config instead. Error: ${configImport.error}`,
        )
        // Generate empty config if config.js is not found, allowing for no config sketches
        config = processSketchConfig({}, processConfigOptions)
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
