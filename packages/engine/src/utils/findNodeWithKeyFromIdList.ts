import { Node } from '@store/types'

export const findNodeWithKeyFromIdList = (
  allNodes: Record<string, Node>,
  key: string,
  idListToSearch: string[],
): Node | null => {
  const id = idListToSearch.find(
    (nodeId: string) => 'key' in allNodes[nodeId] && allNodes[nodeId].key === key,
  )
  return id ? allNodes[id] : null
}
