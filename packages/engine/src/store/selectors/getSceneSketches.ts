import { DEFAULT_SCENE_NODE_ID, EngineState, isScene, isSketch, Sketch } from '@store/types'

export const getCurrentScene = (state: EngineState) => {
  const node = state.nodes[DEFAULT_SCENE_NODE_ID]
  return isScene(node) ? node : null
}

export const getCurrentSceneSketchIds = (state: EngineState) => {
  return getCurrentScene(state)?.childGroups.sketchIds ?? []
}

export const getSketch = (state: EngineState, sketchId: string): Sketch | null => {
  const node = state.nodes[sketchId]
  return isSketch(node) ? node : null
}

export const getCurrentSceneSketches = (state: EngineState): Sketch[] => {
  return getCurrentSceneSketchIds(state)
    .map((id) => getSketch(state, id))
    .filter((sketch): sketch is Sketch => sketch !== null)
}
