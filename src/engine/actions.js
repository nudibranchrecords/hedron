export const engineSceneSketchAdd = (sceneId, sketchId, moduleId) => ({
  type: 'ENGINE_SCENE_SKETCH_ADD',
  payload: { sceneId, sketchId, moduleId }
})

export const engineSceneSketchDelete = (sceneId, sketchId) => ({
  type: 'ENGINE_SCENE_SKETCH_DELETE',
  payload: { sceneId, sketchId }
})
