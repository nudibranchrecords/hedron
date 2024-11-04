import { useCallback } from 'react'
import { useAppStore } from 'src/renderer/appStore'

export const useOnSelectNode = (sketchId: string, nodeId: string) => {
  const selectNode = useAppStore((state) => state.setSelectedNode)

  const onSelectNode = useCallback(() => {
    selectNode(sketchId, nodeId)
  }, [sketchId, nodeId, selectNode])

  return onSelectNode
}
