import isInputTypeHuman from '../../utils/isInputTypeHuman'
import { getType } from '../../valueTypes'

export const shouldItLearn = (learningId, node, payload) => {
  const pType = payload.meta && payload.meta.type
  return (
    learningId !== false &&
    node.type !== 'macroTargetParamLink' &&
    getType(node.valueType).canDoMacro &&
    (!pType || pType !== 'macro' || isInputTypeHuman(pType))
  )
}
