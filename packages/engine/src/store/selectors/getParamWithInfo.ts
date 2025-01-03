import { EngineState, Param } from '@store/types'

export type ParamWithInfo = Param & { title: string }

export const getParamWithInfo =
  (paramId: string) =>
  (state: EngineState): ParamWithInfo | null => {
    const param = state.nodes[paramId]
    if (!param) return null

    const sketch = state.sketches[param.sketchId]
    if (!sketch) return null

    const module = state.sketchModules[sketch.moduleId]
    if (!module) return null

    const paramIndex = sketch.paramIds.indexOf(paramId)
    const paramConfig = module.config.params[paramIndex]
    const title = paramConfig?.title ?? paramConfig?.key

    return { ...param, title }
  }
