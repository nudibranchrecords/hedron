import { getAllSceneSketches } from './getSceneSketches'
import { EngineState } from '@store/types'

export const getSketchesOfModuleId = (state: EngineState, moduleId: string) =>
  getAllSceneSketches(state).filter((sketch) => sketch.moduleId === moduleId)
