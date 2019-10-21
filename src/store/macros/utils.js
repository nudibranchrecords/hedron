import isInputTypeHuman from '../../utils/isInputTypeHuman'

const allowedTypes = ['float', 'boolean']

export const shouldItLearn = (learningId, node, payload) => {
  const pType = payload.meta && payload.meta.type

  return (
    learningId !== false &&
    node.type !== 'macroTargetParamLink' &&
    allowedTypes.includes(node.valueType) &&
    (!pType || pType !== 'macro' || isInputTypeHuman(pType))
  )
}
