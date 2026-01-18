import { SetterCreator } from '@store/types'

export const createDeleteSketch: SetterCreator<'deleteSketch'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      state.sketches[instanceId].nodeIds.forEach((nodeId) => {
        delete state.nodes[nodeId]
        delete state.nodeValues[nodeId]
      })

      delete state.sketches[instanceId]
    })
