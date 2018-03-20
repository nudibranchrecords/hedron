import getCurrentSceneId from './getCurrentSceneId'

export default state => {
  const sceneId = getCurrentSceneId(state)
  return sceneId ? state.scenes.items[sceneId].selectedSketchId : undefined
}
