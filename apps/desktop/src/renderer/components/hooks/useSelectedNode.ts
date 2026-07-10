import { Node } from '@hedron-gl/engine'
import { useEngineStore } from '@hedron-gl/ui-core'
import { useAppStore } from '@renderer/appStore'
import { useSelectedSketch } from '@components/hooks/useSelectedSketch'

export const useSelectedNode = (): Node | null => {
  const selectedSketch = useSelectedSketch()

  const selectedNodeId = useAppStore((state) =>
    selectedSketch ? state.selectedNodes[selectedSketch.id] : null,
  )

  return useEngineStore((state) => (selectedNodeId ? (state.nodes[selectedNodeId] ?? null) : null))
}
