import getCurrentSceneId from './getCurrentSceneId'
import getScene from './getScene'

export default state => {
  const sceneId = getCurrentSceneId(state)
  return getScene(state, sceneId)
}
