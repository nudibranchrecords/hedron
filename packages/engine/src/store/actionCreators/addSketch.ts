import { addNode } from '@store/shared/addNode'
import { isSceneNode, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddSketchToScene: SetterCreator<'addSketchToScene'> =
  (setState) => (sceneId: string, moduleId: string) => {
    const newSketchId = createUniqueId()
    setState((state) => {
      const { config } = state.sketchModules[moduleId]
      const nodeIds = []

      for (const nodeConfig of config.nodes) {
        const id = createUniqueId()
        nodeIds.push(id)
        addNode(state, id, newSketchId, nodeConfig)
      }

      const sceneNode = state.nodes[sceneId]
      if (!isSceneNode(sceneNode)) {
        throw new Error(`Scene node ${sceneId} is missing or invalid`)
      }

      state.nodes[newSketchId] = {
        id: newSketchId,
        nodeType: 'sketch',
        moduleId,
        title: config.title,
        parentIds: [sceneId],
        childGroups: { optionNodeIds: [], inputNodeIds: [], nodeIds },
      }

      sceneNode.childGroups.sketchIds.push(newSketchId)
    })

    return newSketchId
  }
