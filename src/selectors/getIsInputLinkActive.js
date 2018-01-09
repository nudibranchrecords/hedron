export default (state, id) => {
  const link = state.inputLinks[id]
  const node = state.nodes[link.nodeId]
  return node.activeInputLinkId === id
}
