import getCurrentSceneId from './getCurrentSceneId'

export default state => {
  const sceneId = getCurrentSceneId(state)
  return state.scenes.items[sceneId].selectedSketchId
}
