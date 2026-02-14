import { Node } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useAppStore } from '@renderer/appStore'
import { useActiveSketch } from '@components/hooks/useActiveSketch'

export const useSelectedNode = (): Node | null => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useSelectedNode hook: No active sketch found')
  }

  const selectedNodeId = useAppStore((state) => state.selectedNodes[activeSketch.id])
  return useEngineStore((state) => state.nodes[selectedNodeId])
}
