import { useCallback } from 'react'
import { useUpdateSelectedNode } from './useUpdateSelectedNode'

export const useOnSelectNode = (id: string) => {
  const selectNode = useUpdateSelectedNode()

  const onSelectNode = useCallback(
    () => {
      selectNode(id)
    },
    [id, selectNode],
  )

  return onSelectNode
}
