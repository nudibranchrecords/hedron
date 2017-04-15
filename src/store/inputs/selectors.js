export const getAssignedParams = (state, inputId) => {
  const ids = state.inputs[inputId].assignedParamIds
  if (ids.length === 0) return []

  return ids.map(id => {
    const param = state.params[id]
    if (param === undefined) {
      throw (new Error(`Missing assigned param for input ${inputId}: ${id}`))
    }
    return param
  })
}
