import { useCallback } from 'react'
import { useAppStore } from '@hooks/storeHooks'

export const useOnSelectNode = (sketchId: string, nodeId: string) => {
  const selectNode = useAppStore((state) => state.setSelectedNode)

  const onSelectNode = useCallback(() => {
    selectNode(sketchId, nodeId)
  }, [sketchId, nodeId, selectNode])

  return onSelectNode
}
