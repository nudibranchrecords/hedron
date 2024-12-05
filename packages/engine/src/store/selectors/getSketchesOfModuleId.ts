import { EngineState } from '@store/types'

export const getSketchesOfModuleId = (state: EngineState, moduleId: string) =>
  Object.values(state.sketches).filter((sketch) => sketch.moduleId === moduleId)
