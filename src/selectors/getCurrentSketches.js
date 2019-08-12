import getCurrentSceneId from './getCurrentSceneId'

export default state => {
  const sceneId = getCurrentSceneId(state)
  if (sceneId) {
    const sketchIds = state.scenes.items[sceneId].sketchIds
    return sketchIds.map((id) => (
      {
        ...state.sketches[id],
        id,
      }
    ))
  } else {
    return []
  }
}
