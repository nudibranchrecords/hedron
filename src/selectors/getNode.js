export default (state, nodeId) => {
  if (!nodeId) return undefined

  const node = state.nodes[nodeId]
  if (node === undefined) {
    console.warn(`[HEDRON] getNode() couldn't find node for nodeId ${nodeId}`)
  }
  return node
}
