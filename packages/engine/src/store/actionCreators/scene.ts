import { createUniqueId } from '@utils/createUniqueId'
import { SetterCreator } from '@store/types'

export const createAddScene: SetterCreator<'addScene'> = (setState) => () => {
  const newSceneId = createUniqueId()

  setState((state) => {
    const sceneCount = Object.values(state.nodes).filter(
      (node) => node?.nodeType === 'scene',
    ).length

    state.nodes[newSceneId] = {
      id: newSceneId,
      nodeType: 'scene',
      title: `Scene ${sceneCount + 1}`,
      parentIds: [],
      childGroups: {
        optionNodeIds: [],
        inputNodeIds: [],
        sketchIds: [],
      },
    }
  })

  return newSceneId
}
