import {
  DEFAULT_SCENE_NODE_ID,
  EngineState,
  isSceneNode,
  isSketchNode,
  SketchNode,
} from '@store/types'

export const getCurrentScene = (state: EngineState) => {
  const node = state.nodes[DEFAULT_SCENE_NODE_ID]
  return isSceneNode(node) ? node : null
}

export const getCurrentSceneSketchIds = (state: EngineState) => {
  return getCurrentScene(state)?.childGroups.sketchIds ?? []
}

export const getSketch = (state: EngineState, sketchId: string): SketchNode | null => {
  const node = state.nodes[sketchId]
  return isSketchNode(node) ? node : null
}

export const getCurrentSceneSketches = (state: EngineState): SketchNode[] => {
  return getCurrentSceneSketchIds(state)
    .map((id) => getSketch(state, id))
    .filter((sketch): sketch is SketchNode => sketch !== null)
}
