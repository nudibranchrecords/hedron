import { EngineState, isSceneNode, isSketchNode, SceneNode, SketchNode } from '@store/types'

export const getScene = (state: EngineState, sceneId: string): SceneNode | null => {
  const node = state.nodes[sceneId]
  return isSceneNode(node) ? node : null
}

export const getSceneIds = (state: EngineState): string[] => {
  return Object.values(state.nodes)
    .filter((node): node is SceneNode => node?.nodeType === 'scene')
    .map((scene) => scene.id)
}

export const getSceneSketchIds = (state: EngineState, sceneId: string): string[] => {
  return getScene(state, sceneId)?.childGroups.sketchIds ?? []
}

export const getSketch = (state: EngineState, sketchId: string): SketchNode | null => {
  const node = state.nodes[sketchId]
  return isSketchNode(node) ? node : null
}

export const getAllSceneSketchIds = (state: EngineState): string[] => {
  return getSceneIds(state).flatMap((sceneId) => getSceneSketchIds(state, sceneId))
}

export const getAllSceneSketches = (state: EngineState): SketchNode[] => {
  return getAllSceneSketchIds(state)
    .map((id) => getSketch(state, id))
    .filter((sketch): sketch is SketchNode => sketch !== null)
}
