import getCurrentSceneId from '../../selectors/getCurrentSceneId'

export const getSketches = (state) => {
  const sceneId = getCurrentSceneId(state)
  const sketchIds = state.scenes.items[sceneId].sketchIds
  return sketchIds.map((id) => (
    {
      title: state.sketches[id].title,
      id
    }
  ))
}
