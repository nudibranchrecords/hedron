import getCurrentSceneId from './getCurrentSceneId'

export default state => {
  const sceneId = getCurrentSceneId(state)
  const scene = state.scenes.items[sceneId]
  return scene ? scene.selectedSketchId : undefined
}
