import isInputTypeHuman from '../../utils/isInputTypeHuman'

// TODO: Boolean not yet supported type of node value
// but putting in for future's sake
const allowedTypes = ['number', 'boolean']

export const shouldItLearn = (learningId, node, payload) => {
  if (!allowedTypes.includes(typeof node.value)) return false

  const pType = payload.meta && payload.meta.type
  if (pType && (!isInputTypeHuman(pType) || pType === 'macro')) {
    return false
  }

  return learningId !== false && node.type !== 'macroTargetParamLink'
}
