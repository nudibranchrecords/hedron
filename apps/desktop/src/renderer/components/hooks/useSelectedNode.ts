import { Node } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useAppStore } from '@renderer/appStore'
import { useActiveSketch } from '@components/hooks/useActiveSketch'

export const useSelectedNode = (): Node | null => {
  const activeSketch = useActiveSketch()

  const selectedNodeId = useAppStore((state) =>
    activeSketch ? state.selectedNodes[activeSketch.id] : null,
  )

  return useEngineStore((state) => (selectedNodeId ? state.nodes[selectedNodeId] : null))
}
