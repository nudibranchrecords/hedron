import { useEngineStore } from '@hedron-gl/ui-core'
import { useMemo } from 'react'
import { useAppStore } from '@renderer/appStore'

export const useSketchList = () => {
  const nodes = useEngineStore((state) => state.nodes)
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)

  const sketchesVals = useMemo(() => {
    if (!selectedSceneId) {
      return []
    }

    const activeScene = nodes[selectedSceneId]
    if (!activeScene || activeScene.nodeType !== 'scene') {
      return []
    }

    return activeScene.childGroups.sketchIds
      .map((sketchId) => {
        const node = nodes[sketchId]
        return node?.nodeType === 'sketch' ? node : null
      })
      .filter((sketch): sketch is NonNullable<typeof sketch> => sketch !== null)
  }, [selectedSceneId, nodes])

  return sketchesVals
}
