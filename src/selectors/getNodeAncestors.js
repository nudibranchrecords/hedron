import getNode from './getNode'

export default (state, nodeId) => {
  const arr = []

  const addNode = nodeId => {
    const node = getNode(state, nodeId)
    arr.push(node)
    if (node.parentNodeId) addNode(node.parentNodeId)
  }

  addNode(nodeId)

  return arr
}
