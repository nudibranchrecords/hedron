export const getAssignedParams = (state, inputId) => {
  const ids = state.inputs.assignedParamIds[inputId]

  return ids.map(id => {
    const param = state.params[id]
    if (param === undefined) {
      throw (new Error(`Missing assigned param for input ${inputId}: ${id}`))
    }
    return param
  })
}
