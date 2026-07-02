import { addNode } from '@store/shared/addNode'
import { DEFAULT_SCENE_NODE_ID, isSceneNode, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddSketch: SetterCreator<'addSketch'> = (setState) => (moduleId: string) => {
  const newSketchId = createUniqueId()
  setState((state) => {
    const { config } = state.sketchModules[moduleId]
    const nodeIds = []

    for (const nodeConfig of config.nodes) {
      const id = createUniqueId()
      nodeIds.push(id)
      addNode(state, id, newSketchId, nodeConfig)
    }

    const sceneNode = state.nodes[DEFAULT_SCENE_NODE_ID]
    if (!isSceneNode(sceneNode)) {
      throw new Error('Default scene node is missing or invalid')
    }

    state.nodes[newSketchId] = {
      id: newSketchId,
      nodeType: 'sketch',
      moduleId,
      title: config.title,
      parentIds: [DEFAULT_SCENE_NODE_ID],
      childGroups: { optionNodeIds: [], inputNodeIds: [], nodeIds },
      nodeIds,
    }

    sceneNode.childGroups.sketchIds.push(newSketchId)
  })

  return newSketchId
}
