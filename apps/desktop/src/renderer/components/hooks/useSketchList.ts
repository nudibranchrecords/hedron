import { useEngineStore } from '@hedron-gl/ui-core'
import { useMemo } from 'react'
import { useAppStore } from '@renderer/appStore'

export const useSketchList = () => {
  const nodes = useEngineStore((state) => state.nodes)
  const activeSceneId = useAppStore((state) => state.activeSceneId)

  const sketchesVals = useMemo(() => {
    const activeScene = nodes[activeSceneId]
    if (!activeScene || activeScene.nodeType !== 'scene') {
      return []
    }

    return activeScene.childGroups.sketchIds
      .map((sketchId) => {
        const node = nodes[sketchId]
        return node?.nodeType === 'sketch' ? node : null
      })
      .filter((sketch): sketch is NonNullable<typeof sketch> => sketch !== null)
  }, [activeSceneId, nodes])

  return sketchesVals
}
