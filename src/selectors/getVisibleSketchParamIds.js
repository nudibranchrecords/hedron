import getNodes from './getNodes'

export default (state, sketchId) => {
  const nodes = getNodes(state, state.sketches[sketchId].paramIds).filter(node => !node.hidden)
  return nodes.map(node => node.id)
}

