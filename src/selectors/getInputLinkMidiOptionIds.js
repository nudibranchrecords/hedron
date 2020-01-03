import getNodes from './getNodes'

const filterId = (obj, filteredId) => obj.filter(id => id !== filteredId)

export default (state, linkId) => {
  const link = state.nodes[linkId]
  let optionIds = link.optionIds
  const optionNodes = getNodes(state, optionIds)
  const optionNodesByKey = {}
  optionNodes.forEach(node => {
    optionNodesByKey[node.key] = node
  })

  const isNotCC = optionNodesByKey.messageType.value !== 'controlChange'

  if (optionNodesByKey.controlType.value === 'abs' || isNotCC) {
    // Remove 'sensitivity' if controlType is 'absolute' or messageType is NOT 'controlChange'
    optionIds = filterId(optionIds, optionNodesByKey.sensitivity.id)
  }

  if (isNotCC) {
    // Remove 'controlType' if messageType is NOT 'controlChange'
    optionIds = filterId(optionIds, optionNodesByKey.controlType.id)
  }

  return optionIds
}
