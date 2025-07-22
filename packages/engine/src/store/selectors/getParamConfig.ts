import { EngineState, Param, SketchConfigParamImported } from '@store/types'

export type ParamWithInfo = Param & { title: string }

export const getParamConfig =
  (paramId: string) =>
  (state: EngineState): SketchConfigParamImported | null => {
    const param = state.nodes[paramId]
    if (!param) return null

    const sketch = state.sketches[param.sketchId]
    if (!sketch) return null

    const module = state.sketchModules[sketch.moduleId]
    if (!module) return null

    const paramIndex = sketch.paramIds.indexOf(paramId)
    return module.config.params[paramIndex] ?? null
  }
