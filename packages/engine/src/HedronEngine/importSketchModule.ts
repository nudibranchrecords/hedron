import { Result } from './types'
import { safeImport } from './importUtils'
import {
  SketchConfigRaw,
  SketchConfigImported,
  SketchModule,
  SketchModuleItem,
  SketchConfigParamImported,
  SketchConfigParam,
  SketchConfigShot,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const ensureParamImported = (
  param: SketchConfigParam,
): Omit<SketchConfigParamImported, 'groupIndex'> => {
  const valueType = param.valueType ?? 'number'

  return {
    ...param,
    valueType,
    title: param.title ?? param.key,
    nodeType: 'param',
  }
}

interface ProcessConfigOptions {
  fallBackTitle: string
}

export const processConfig = (
  config: SketchConfigRaw,
  { fallBackTitle }: ProcessConfigOptions,
): SketchConfigImported => {
  const groupInfo: SketchConfigImported['groupInfo'] = []

  let groupIndex = -1
  let shotGroupIndex = -1
  const flattenedNodes: SketchConfigImported['nodes'] = []
  const ungroupedParams: SketchConfigParam[] = []
  const ungroupedShots: SketchConfigShot[] = []

  if (config.params) {
    config.params.forEach((param) => {
      if ('params' in param) {
        groupIndex++

        groupInfo[groupIndex] = {
          groupTitle: param.groupTitle ?? `Group ${groupIndex}`,
        }

        flattenedNodes.push(
          ...param.params.map(
            (p) => ({ ...ensureParamImported(p), groupIndex }) as SketchConfigParamImported,
          ),
        )
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

      flattenedNodes.push(
        ...ungroupedParams.map(
          (p) => ({ ...ensureParamImported(p), groupIndex }) as SketchConfigParamImported,
        ),
      )
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

        flattenedNodes.push(
          ...shot.shots.map((s) => ({
            ...s,
            groupIndex,
            title: s.title ?? s.key,
            nodeType: 'shot' as const,
          })),
        )
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

      flattenedNodes.push(
        ...ungroupedShots.map((s) => ({
          ...s,
          groupIndex,
          title: s.title ?? s.key,
          nodeType: 'shot' as const,
        })),
      )
    }
  }

  const processedConfig: SketchConfigImported = {
    ...config,
    title: config.title ?? fallBackTitle,
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

    const sketchImport = await safeImport(
      sketchPath,
      `Failed to import sketch module: ${sketchPath}`,
    )
    if (!sketchImport.ok) {
      return { success: false, error: sketchImport.error, data: undefined }
    }

    const module: SketchModule = sketchImport.module.default

    const processConfigOptions = {
      fallBackTitle: moduleId,
    }

    let config: SketchConfigImported

    // First try to get config from static getConfig()
    const unprocessedConfigFromGetConfig = module.getConfig?.() as SketchConfigRaw | undefined

    if (unprocessedConfigFromGetConfig) {
      config = processConfig(unprocessedConfigFromGetConfig, processConfigOptions)
    } else {
      // If no getConfig(), try to import config.js
      const configPath = `${baseUrl}/${moduleId}/config.js?${cacheBust}`

      const configImport = await safeImport(
        configPath,
        `Failed to import sketch config: ${configPath}`,
      )
      if (configImport.ok) {
        config = processConfig(configImport.module.default as SketchConfigRaw, processConfigOptions)
      } else {
        // Generate empty config if config.js is not found, allowing for no config sketches
        config = processConfig({}, processConfigOptions)
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
