import { EngineState, ParamEnum, ParamEnumValue } from '@store/types'

export const getNextEnumValue = (targetNodeId: string) => (state: EngineState) => {
  const paramVal = state.paramValues[targetNodeId]
  const param = state.nodes[targetNodeId] as ParamEnum | undefined

  if (!param) {
    console.warn(`No param found for node ${targetNodeId}`)
    return paramVal
  }

  const options = param.options as { value: ParamEnumValue }[]
  const currentIndex = options.findIndex((option) => option.value === paramVal)

  if (currentIndex === -1) {
    return paramVal // Return current value if not found
  }

  const nextIndex = (currentIndex + 1) % options.length
  return options[nextIndex].value
}
