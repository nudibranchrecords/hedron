import { Node, Nodes } from '@store/types'

export const findNodeWithKeyFromIdList = (
  allNodes: Nodes,
  key: string,
  idListToSearch: string[],
): Node | null => {
  const id = idListToSearch.find(
    (nodeId: string) =>
      allNodes[nodeId] && 'key' in allNodes[nodeId] && allNodes[nodeId]!.key === key,
  )
  return id ? allNodes[id]! : null
}
