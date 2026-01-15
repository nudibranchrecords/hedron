import { EngineState } from '@store/types'

export const getSketchShotNodes = (state: EngineState, sketchId: string) => {
  const { sketches, nodes } = state
  const sketch = sketches[sketchId]

  console.log(sketch)

  return sketch.nodeIds.map((id) => nodes[id]).filter((node) => node.nodeType === 'shot')
}
