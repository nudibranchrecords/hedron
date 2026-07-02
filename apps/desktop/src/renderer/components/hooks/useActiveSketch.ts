import { useEngineStore } from '@hedron-gl/ui-core'
import { useAppStore } from '@renderer/appStore'

export const useActiveSketch = () => {
  const nodes = useEngineStore((state) => state.nodes)
  const activeSceneId = useAppStore((state) => state.activeSceneId)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  if (!activeSketchId) {
    return null
  }

  const activeScene = nodes[activeSceneId]
  if (!activeScene || activeScene.nodeType !== 'scene') {
    return null
  }

  if (!activeScene.childGroups.sketchIds.includes(activeSketchId)) {
    return null
  }

  const activeSketch = nodes[activeSketchId]
  if (!activeSketch || activeSketch.nodeType !== 'sketch') {
    return null
  }

  return activeSketch
}
