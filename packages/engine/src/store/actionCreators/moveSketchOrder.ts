import { DEFAULT_SCENE_NODE_ID, isSceneNode, SetterCreator } from '@store/types'

export const createMoveSketchUp: SetterCreator<'moveSketchUp'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sceneNode = state.nodes[DEFAULT_SCENE_NODE_ID]
      if (!isSceneNode(sceneNode)) {
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
      const sceneNode = state.nodes[DEFAULT_SCENE_NODE_ID]
      if (!isSceneNode(sceneNode)) {
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
