import isInputTypeHuman from '../../utils/isInputTypeHuman'

export const shouldItLearn = (learningId, node, payload) => {
  const pType = payload.meta && payload.meta.type
  if (pType && (!isInputTypeHuman(pType) || pType === 'macro')) {
    return false
  }

  return learningId !== false && node.type !== 'macroTargetParamLink'
}
