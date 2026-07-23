import { EngineStore } from '@store/engineStore'
import { ParamValue, SetterCreator } from '@store/types'

// Temporary buffer for node value updates per frame
const tempParamValueBuffer: Record<string, ParamValue> = {}

export const createUpdateParamValue: SetterCreator<'updateParamValue'> = () => (paramId, value) => {
  tempParamValueBuffer[paramId] = value
}

// Called once per frame in the engine update loop to flush buffered node values
export function flushParamValueBuffer(setState: EngineStore['setState']) {
  setState(
    (state) => {
      for (const paramId in tempParamValueBuffer) {
        state.paramValues[paramId] = tempParamValueBuffer[paramId]
      }
    },
    undefined,
    'ignore/paramValues',
  )
  // Clear buffer after flush
  for (const paramId in tempParamValueBuffer) {
    delete tempParamValueBuffer[paramId]
  }
}
