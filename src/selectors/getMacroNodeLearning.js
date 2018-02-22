export default state => {
  const macro = state.macros.items[state.macros.learningId]
  return macro && state.nodes[macro.nodeId]
}
