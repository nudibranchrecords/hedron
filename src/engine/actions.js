export const engineSceneAddSketch = (sceneId, sketchId, moduleId) => ({
  type: 'ENGINE_SCENE_ADD_SKETCH',
  payload: { sceneId, sketchId, moduleId }
})
