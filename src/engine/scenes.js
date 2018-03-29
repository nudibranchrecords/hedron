let scenes = {}

export const getEngineScenes = () => scenes
export const setEngineScenes = newScenes => {
  scenes = newScenes
  return scenes
}
