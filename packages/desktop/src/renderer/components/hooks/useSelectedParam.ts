import { Param } from '@hedron/engine'
import { useEngineStore } from '@hedron/ui-core'
import { useAppStore } from '@renderer/appStore'
import { useActiveSketch } from '@components/hooks/useActiveSketch'

export const useSelectedParam = (): Param | null => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useSelectedParam hook: No active sketch found')
  }

  const selectedNodeId = useAppStore((state) => state.selectedNodes[activeSketch.id])
  return useEngineStore((state) => state.nodes[selectedNodeId])
}
