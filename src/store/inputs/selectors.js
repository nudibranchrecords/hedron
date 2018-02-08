import _ from 'lodash'

export const getAssignedLinks = (state, inputId) => {
  let arr = []
  const ids = _.get(state, `inputs[${inputId}].assignedLinkIds`)
  if (!ids || ids.length === 0) return arr

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const link = state.inputLinks[id]
    const node = state.nodes[link.nodeId]

    if (link === undefined) {
      throw (new Error(`getAssignedLinks: Missing assigned link for input ${inputId}: ${id}`))
    }

    if (
      link.linkType === 'linkableAction' ||
      (link.input && link.input.type === 'midi') ||
      node.activeInputLinkId === id
    ) {
      arr.push(link)
    }
  }

  return arr
}
