import { EngineState } from '@engine/store/types'

export const initialState: EngineState = {
  isSketchModulesReady: false,
  sketches: {},
  nodes: {},
  nodeValues: {},
  sketchModules: {},
}
