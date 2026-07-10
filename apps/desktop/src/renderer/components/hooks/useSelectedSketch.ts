import { useEngineStore } from '@hedron-gl/ui-core'
import { useAppStore } from '@renderer/appStore'

export const useSelectedSketch = () => {
  const nodes = useEngineStore((state) => state.nodes)
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const selectedSketches = useAppStore((state) => state.selectedSketches)
  const selectedSketchId = selectedSceneId ? selectedSketches[selectedSceneId] : null

  if (!selectedSceneId || !selectedSketchId) {
    return null
  }

  const selectedScene = nodes[selectedSceneId]
  if (!selectedScene || selectedScene.nodeType !== 'scene') {
    return null
  }

  if (!selectedScene.childGroups.sketchIds.includes(selectedSketchId)) {
    return null
  }

  const selectedSketch = nodes[selectedSketchId]
  if (!selectedSketch || selectedSketch.nodeType !== 'sketch') {
    return null
  }

  return selectedSketch
}
