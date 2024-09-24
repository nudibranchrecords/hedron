import { EngineState } from '../engineStore'

export const getSketchesOfModuleId = (state: EngineState, moduleId: string) =>
  Object.values(state.sketches).filter((sketch) => sketch.moduleId === moduleId)
