import { useCallback } from 'react'
import { useAppStore } from 'src/renderer/appStore'

export const useOnSelectNode = (id: string) => {
  const selectNode = useAppStore((state) => state.setSelectedNode)

  const onSelectNode = useCallback(() => {
    selectNode(id)
  }, [id, selectNode])

  return onSelectNode
}
