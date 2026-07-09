import { isSketchNode, SetterCreator } from '@store/types'

export const createUpdateSketch: SetterCreator<'updateSketch'> =
  (setState) => (instanceId, sketchState) => {
    setState((state) => {
      const sketch = state.nodes[instanceId]
      if (!isSketchNode(sketch)) return

      state.nodes[instanceId] = {
        ...sketch,
        ...sketchState,
      }
    })
  }
