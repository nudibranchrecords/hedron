import { addNode } from '@store/shared/addNode'
import { deleteNode } from '@store/shared/deleteNode'
import { Node, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

/**
 * Reconciles a collection of nodes for a sketch.
 * Handles adding new nodes, updating existing nodes, and removing obsolete ones.
 */
export const createReconcileSketchNodes: SetterCreator<'reconcileSketchNodes'> =
  (setState) => (sketchId: string) => {
    setState((state) => {
      const sketch = state.sketches[sketchId]
      if (!sketch) {
        throw new Error(`Sketch with id ${sketchId} not found.`)
      }

      const moduleId = sketch.moduleId
      const { config } = state.sketchModules[moduleId]

      const existingIds = new Set(state.sketches[sketchId].nodeIds)
      const newNodeIds: string[] = []

      // 1. Add new nodes that are in the config but not in the current sketch.
      for (const nodeConfig of config.nodes) {
        // Find existing node for this key, if any.
        let nodeId = Array.from(existingIds).find((id) => state.nodes[id]?.key === nodeConfig.key)

        // If no existing node, create a new one.
        if (!nodeId) {
          nodeId = createUniqueId()
          // TODO: We're handing sketchId as a parentId but sketches aren't yet nodes (this might break things...)
          addNode(state, nodeId, sketchId, nodeConfig)
        } else if (state.nodes[nodeId]) {
          // Update the existing node with any changes from the config.
          state.nodes[nodeId] = {
            ...state.nodes[nodeId],
            ...nodeConfig,
          } as Node
        }

        // Add this nodeId to the new list.
        newNodeIds.push(nodeId)
        existingIds.delete(nodeId) // Remove from the set of existing IDs, indicating it's still valid.
      }

      // 2. Remove nodes that are no longer in the config.
      for (const oldNodeId of existingIds) {
        deleteNode(state, oldNodeId)
      }

      sketch.nodeIds = newNodeIds
    })
  }
