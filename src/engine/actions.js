export const engineSceneSketchAdd = (sceneId, sketchId, moduleId) => ({
  type: 'ENGINE_SCENE_SKETCH_ADD',
  payload: { sceneId, sketchId, moduleId }
})

export const engineSceneSketchDelete = (sceneId, sketchId) => ({
  type: 'ENGINE_SCENE_SKETCH_DELETE',
  payload: { sceneId, sketchId }
})

export const engineSceneAdd = (sceneId) => ({
  type: 'ENGINE_SCENE_ADD',
  payload: { sceneId }
})

export const engineSceneRemove = (sceneId) => ({
  type: 'ENGINE_SCENE_REMOVE',
  payload: { sceneId }
})
