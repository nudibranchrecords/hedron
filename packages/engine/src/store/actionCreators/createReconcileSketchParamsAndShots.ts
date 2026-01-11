import { addNode } from '@store/shared/addNode'
import {
  hasChildNodes,
  Node,
  SetterCreator,
  EngineState,
  SketchConfigParamImported,
  SketchConfigShotImported,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

type NodeConfig = SketchConfigParamImported | SketchConfigShotImported

/**
 * Reconciles a collection of nodes (params or shots) for a sketch.
 * Handles adding new nodes, updating existing nodes, and removing obsolete ones.
 */
const reconcileNodes = <T extends NodeConfig>(
  state: EngineState,
  existingNodeIds: string[],
  configNodes: T[],
): string[] => {
  console.log('Refreshing nodes:', { existingNodeIds, configNodes })
  const existingIds = new Set(existingNodeIds)
  const newNodeIds: string[] = []

  // 1. Add new nodes that are in the config but not in the current sketch.
  for (const nodeConfig of configNodes) {
    // Find existing node for this key, if any.
    let nodeId = Array.from(existingIds).find((id) => state.nodes[id]?.key === nodeConfig.key)

    // If no existing node, create a new one.
    if (!nodeId) {
      nodeId = createUniqueId()
      addNode(state, nodeId, nodeConfig)
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
    const oldNode = state.nodes[oldNodeId]
    delete state.nodes[oldNodeId]
    delete state.nodeValues[oldNodeId]

    // Remove vector child nodes if they exist
    if (hasChildNodes(oldNode)) {
      oldNode.childNodeIds.forEach((childNodeId) => {
        delete state.nodes[childNodeId]
        delete state.nodeValues[childNodeId]
      })
    }
  }

  return newNodeIds
}

export const createReconcileSketchParamsAndShots: SetterCreator<'reconcileSketchParamsAndShots'> =
  (setState) => (sketchId: string) => {
    setState((state) => {
      const sketch = state.sketches[sketchId]
      if (!sketch) {
        throw new Error(`Sketch with id ${sketchId} not found.`)
      }

      const moduleId = sketch.moduleId
      const { config } = state.sketchModules[moduleId]

      sketch.paramIds = reconcileNodes(state, sketch.paramIds, config.params)
      sketch.shotIds = reconcileNodes(state, sketch.shotIds, config.shots)
    })
  }
