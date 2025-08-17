import { SetterCreator } from '@store/types'

export const createUpdateSketch: SetterCreator<'updateSketch'> =
  (setState) => (instanceId, sketchState) => {
    setState((state) => {
      const sketch = state.sketches[instanceId]
      if (!sketch) return

      state.sketches[instanceId] = {
        ...sketch,
        ...sketchState,
      }
    })
  }
