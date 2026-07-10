import { EngineState } from '@store/types'

export const getSketchSceneId = (state: EngineState, sketchId: string): string | null => {
  const sketchNode = state.nodes[sketchId]
  if (!sketchNode || sketchNode.nodeType !== 'sketch') {
    return null
  }

  const sceneId = sketchNode.parentIds.find(
    (parentId) => state.nodes[parentId]?.nodeType === 'scene',
  )
  return sceneId ?? null
}
