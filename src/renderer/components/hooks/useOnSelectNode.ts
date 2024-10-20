import { useCallback } from 'react'
import { useUpdateSelectedNode } from './useUpdateSelectedNode'
import { useEngineStore } from 'src/renderer/engine'

export const useOnSelectNode = (id: string) => {
  const selectNode = useEngineStore((state) => state.updateSelectedNode)

  const onSelectNode = useCallback(() => {
    selectNode(id)
  }, [id, selectNode])

  return onSelectNode
}
