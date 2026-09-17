import { getSketch } from './getSceneSketches'
import { EngineState, ShotNode } from '@store/types'

export const getSketchShotNodes = (state: EngineState, sketchId: string) => {
  const { nodes } = state
  const sketch = getSketch(state, sketchId)

  if (!sketch) {
    return []
  }

  return sketch.childGroups.nodeIds
    .map((id) => nodes[id])
    .filter((node): node is ShotNode => node?.nodeType === 'shot')
}
