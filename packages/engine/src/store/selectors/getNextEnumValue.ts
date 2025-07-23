import { getParamConfig } from '@store/selectors/getParamConfig'
import { EngineState, SketchConfigParamEnum } from '@store/types'

export const getNextEnumValue = (targetNodeId: string) => (state: EngineState) => {
  const paramVal = state.nodeValues[targetNodeId]
  const paramConfig = getParamConfig(targetNodeId)(state) as SketchConfigParamEnum | null

  if (!paramConfig) {
    console.warn(`No param config found for node ${targetNodeId}`)
    return paramVal
  }

  const options = paramConfig.options as { value: string | number }[]
  const currentIndex = options.findIndex((option) => option.value === paramVal)

  if (currentIndex === -1) {
    return paramVal // Return current value if not found
  }

  const nextIndex = (currentIndex + 1) % options.length
  return options[nextIndex].value
}
