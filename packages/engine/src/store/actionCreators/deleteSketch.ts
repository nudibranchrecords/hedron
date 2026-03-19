import { SetterCreator } from '@store/types'
import { deleteNode } from '@store/shared/deleteNode'

export const createDeleteSketch: SetterCreator<'deleteSketch'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      state.sketches[instanceId].nodeIds.forEach((nodeId) => {
        deleteNode(state, nodeId)
      })

      delete state.sketches[instanceId]
    })
