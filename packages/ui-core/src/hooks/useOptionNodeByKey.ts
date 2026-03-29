import { findNodeWithKeyFromIdList, Node } from '@hedron-gl/engine'
import { useMemo } from 'react'
import { useEngineStore } from './storeHooks'

export const useOptionNodeByKey = (parentNode: Node, key: string): Node | null => {
  const nodes = useEngineStore((state) => state.nodes)
  const optionNodeIds = parentNode.childGroups.optionNodeIds
  const optionNode = useMemo(
    () => findNodeWithKeyFromIdList(nodes, key, optionNodeIds),
    [nodes, key, optionNodeIds],
  )

  return optionNode
}
