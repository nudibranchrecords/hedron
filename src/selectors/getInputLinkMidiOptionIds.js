import getNodes from './getNodes'
import getNode from './getNode'

const filterId = (obj, filteredId) => obj.filter(id => id !== filteredId)

export default (state, linkId) => {
  const link = state.nodes[linkId]
  let optionIds = link.midiOptionIds
  const node = getNode(state, link.nodeId)
  const optionNodes = getNodes(state, optionIds)
  const optionNodesByKey = {}
  optionNodes.forEach(node => {
    optionNodesByKey[node.key] = node
  })

  if (optionNodesByKey.controlType.value === 'abs') {
    // Remove 'sensitivity' if controlType is 'absolute'
    optionIds = filterId(optionIds, optionNodesByKey.sensitivity.id)
  }

  if (node.valueType !== 'boolean' && optionNodesByKey.booleanMode !== undefined) {
    // Remove 'booleanMode' if node's valueType isnt boolean
    optionIds = filterId(optionIds, optionNodesByKey.booleanMode.id)
  }

  return optionIds
}
