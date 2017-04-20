export const getParamInputId = (state, paramId) => {
  const input = state.params[paramId].input
  return input && input.id
}

export const getDefaultModifierIds = state =>
  ['gain']
