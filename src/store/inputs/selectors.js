import getCurrentBankIndex from '../../selectors/getCurrentBankIndex'

export const getAssignedLinks = (state, inputId) => {
  let arr = []
  let currBankIndex
  const input = state.inputs[inputId]
  const ids = input && input.assignedLinkIds
  if (!ids || ids.length === 0) return arr

  const deviceId = input && input.deviceId

  if (deviceId) {
    currBankIndex = getCurrentBankIndex(state, deviceId)
  }

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const link = state.nodes[id]
    const node = state.nodes[link.nodeId]
    const matchedBankIndex =
      link.bankIndex === undefined || link.bankIndex === currBankIndex

    const isActive =
      link.linkType === 'linkableAction' ||
      (link.input && link.input.type === 'midi') ||
      node.activeInputLinkId === id

    if (link === undefined) {
      throw (new Error(`getAssignedLinks: Missing assigned link for input ${inputId}: ${id}`))
    }

    if (matchedBankIndex && isActive) {
      arr.push(link)
    }
  }

  return arr
}
