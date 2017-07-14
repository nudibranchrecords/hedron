import _ from 'lodash'

export const getAssignedLinks = (state, inputId) => {
  const ids = _.get(state, `inputs[${inputId}].assignedLinkIds`)
  if (!ids || ids.length === 0) return []

  return ids.map(id => {
    const link = state.inputLinks[id]
    if (link === undefined) {
      throw (new Error(`getAssignedLinks: Missing assigned link for input ${inputId}: ${id}`))
    }
    return link
  })
}
