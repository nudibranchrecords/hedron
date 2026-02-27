import { Result } from './types'
import { ensureConfig } from '@store/shared/ensureConfig'
import {
  SketchConfigRaw,
  SketchConfigImported,
  SketchModule,
  SketchModuleItem,
  SketchConfigParam,
  SketchConfigShot,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

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

        flattenedNodes.push(...param.params.map((p) => ensureConfig(p, groupIndex)))
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

      flattenedNodes.push(...ungroupedParams.map((p) => ensureConfig(p, groupIndex)))
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
          ...shot.shots.map((s) => ensureConfig({ ...s, nodeType: 'shot' }, groupIndex)),
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
        ...ungroupedShots.map((s) => ensureConfig({ ...s, nodeType: 'shot' }, groupIndex)),
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
