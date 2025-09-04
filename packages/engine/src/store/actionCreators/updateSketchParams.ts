import { addNode } from '@store/shared/addNode'
import { hasChildNodes, Param, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createUpdateSketchParams: SetterCreator<'updateSketchParams'> =
  (setState) => (sketchId: string) => {
    setState((state) => {
      const sketch = state.sketches[sketchId]
      if (!sketch) {
        throw new Error(`Sketch with id ${sketchId} not found.`)
      }

      const moduleId = sketch.moduleId
      const { config } = state.sketchModules[moduleId]

      const existingParamIds = new Set(sketch.paramIds)
      const newParamIds: string[] = []

      // 1. Add new params that are in the new config but not in the current sketch.
      for (const paramConfig of config.params) {
        // Find existing node for this key, if any.
        let paramId = Array.from(existingParamIds).find(
          (id) => state.nodes[id]?.key === paramConfig.key,
        )

        // If no existing node, create a new one.
        if (!paramId) {
          paramId = createUniqueId()
          addNode(state, paramId, paramConfig)
        } else if (state.nodes[paramId]) {
          // Update the existing node with any changes from the config.
          state.nodes[paramId] = {
            ...state.nodes[paramId],
            ...paramConfig,
          } as Param
        }

        // Add this paramId to the new list.
        newParamIds.push(paramId)
        existingParamIds.delete(paramId) // Remove from the set of existing IDs, indicating it's still valid.
      }

      // 2. Remove params that are no longer in the new config.
      for (const oldParamId of existingParamIds) {
        const oldNode = state.nodes[oldParamId]
        delete state.nodes[oldParamId]
        delete state.nodeValues[oldParamId]

        // Remove vector child nodes if they exist
        if (hasChildNodes(oldNode)) {
          oldNode.childNodeIds.forEach((childNodeId) => {
            delete state.nodes[childNodeId]
            delete state.nodeValues[childNodeId]
          })
        }
      }

      // 3. Update the sketch with the new list of param IDs.
      sketch.paramIds = newParamIds
    })
  }
