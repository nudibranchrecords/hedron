import isInputTypeHuman from '../../utils/isInputTypeHuman'

export const shouldItLearn = (learningId, node, payload) => {
  if (
      payload.meta &&
      payload.meta &&
      payload.meta.type &&
      !isInputTypeHuman(payload.meta.type)
    ) { return false }

  return learningId !== false && node.type !== 'macroTargetParamLink'
}
