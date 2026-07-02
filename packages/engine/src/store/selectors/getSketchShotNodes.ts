import { getSketch } from './getSceneSketches'
import { EngineState, Shot } from '@store/types'

export const getSketchShotNodes = (state: EngineState, sketchId: string) => {
  const { nodes } = state
  const sketch = getSketch(state, sketchId)

  if (!sketch) {
    return []
  }

  return sketch.nodeIds
    .map((id) => nodes[id])
    .filter((node): node is Shot => node?.nodeType === 'shot')
}
