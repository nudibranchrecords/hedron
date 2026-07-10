import { EngineState, isSceneNode, isSketchNode, SetterCreator } from '@store/types'

const getParentScene = (state: EngineState, instanceId: string) => {
  const sketchNode = state.nodes[instanceId]
  if (!isSketchNode(sketchNode)) {
    return null
  }

  const parentSceneId = sketchNode.parentIds.find((id) => isSceneNode(state.nodes[id]))
  if (!parentSceneId) {
    return null
  }

  const parentScene = state.nodes[parentSceneId]
  return isSceneNode(parentScene) ? parentScene : null
}

export const createMoveSketchUp: SetterCreator<'moveSketchUp'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sceneNode = getParentScene(state, instanceId)
      if (!sceneNode) {
        return
      }

      const sketches = [...sceneNode.childGroups.sketchIds]
      const currentIndex = sketches.findIndex((id) => id === instanceId)
      if (currentIndex <= 0) {
        // Can't move the first index up further
        return
      }
      const [currentSketch] = sketches.splice(currentIndex, 1)
      sketches.splice(currentIndex - 1, 0, currentSketch)
      sceneNode.childGroups.sketchIds = sketches
    })

export const createMoveSketchDown: SetterCreator<'moveSketchDown'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sceneNode = getParentScene(state, instanceId)
      if (!sceneNode) {
        return
      }

      const sketches = [...sceneNode.childGroups.sketchIds]
      const currentIndex = sketches.findIndex((id) => id === instanceId)
      if (currentIndex === -1 || currentIndex >= sketches.length - 1) {
        // Can't move the last index down further
        return
      }
      const [currentSketch] = sketches.splice(currentIndex, 1)
      sketches.splice(currentIndex + 1, 0, currentSketch)
      sceneNode.childGroups.sketchIds = sketches
    })
