import { createUniqueId } from '@utils/createUniqueId'
import { deleteNode } from '@store/shared/deleteNode'
import { SetterCreator } from '@store/types'

export const createAddScene: SetterCreator<'addScene'> = (setState) => () => {
  const newSceneId = createUniqueId()

  setState((state) => {
    state.nodes[newSceneId] = {
      id: newSceneId,
      nodeType: 'scene',
      title: `Scene ${state.sceneIds.length + 1}`,
      parentIds: [],
      childGroups: {
        optionNodeIds: [],
        inputNodeIds: [],
        sketchIds: [],
      },
    }

    if (!state.sceneIds.includes(newSceneId)) {
      state.sceneIds.push(newSceneId)
    }
  })

  return newSceneId
}

export const createDeleteScene: SetterCreator<'deleteScene'> = (setState) => (sceneId: string) => {
  setState((state) => {
    state.sceneIds = state.sceneIds.filter((id) => id !== sceneId)
    deleteNode(state, sceneId)
  })
}
