import { useCallback } from 'react'
import { useAppStore } from '@hooks/engineHooks'

export const useOnSelectNode = (sketchId: string | null, nodeId: string | null) => {
  const selectNode = useAppStore((state) => state.setSelectedNode)

  const onSelectNode = useCallback(() => {
    selectNode(sketchId ?? 'NO_ACTIVE_SKETCH', nodeId)
  }, [sketchId, nodeId, selectNode])

  return onSelectNode
}
