import getSelectedSketchId from './getSelectedSketchId'
import getNode from './getNode'

export default (state) => {
  const sketchId = getSelectedSketchId(state)
  const sketch = state.sketches[sketchId]
  return sketch !== undefined ? getNode(state, sketch.openedNodeId) : undefined
}
