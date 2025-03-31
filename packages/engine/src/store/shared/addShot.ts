import { EngineState, SketchConfigShot } from '@store/types'

export const addShot = (
  state: EngineState,
  shotId: string,
  sketchId: string,
  config: SketchConfigShot,
) => {
  state.shots[shotId] = {
    id: shotId,
    key: config.method,
    type: 'shot',
    sketchId,
  }
}
