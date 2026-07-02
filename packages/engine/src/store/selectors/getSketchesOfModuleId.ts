import { getCurrentSceneSketches } from './getSceneSketches'
import { EngineState } from '@store/types'

export const getSketchesOfModuleId = (state: EngineState, moduleId: string) =>
  getCurrentSceneSketches(state).filter((sketch) => sketch.moduleId === moduleId)
