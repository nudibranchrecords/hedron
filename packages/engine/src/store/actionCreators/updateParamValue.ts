import { EngineStore } from '@store/engineStore'
import { ParamValue, ParamValueOrigin, SetterCreator } from '@store/types'

// Temporary buffer for node value updates per frame
const tempParamValueBuffer: Record<string, ParamValue> = {}
const tempParamOriginBuffer: Record<string, ParamValueOrigin> = {}
const lastParamValueOrigins: Record<string, ParamValueOrigin> = {}

export const createUpdateParamValue: SetterCreator<'updateParamValue'> =
  () =>
  (paramId, value, origin = 'automation') => {
    tempParamValueBuffer[paramId] = value
    tempParamOriginBuffer[paramId] = origin
  }

/** Origin of the most recently flushed value for a param. */
export function getLastParamValueOrigin(paramId: string): ParamValueOrigin | undefined {
  return lastParamValueOrigins[paramId]
}

// Called once per frame in the engine update loop to flush buffered node values
export function flushParamValueBuffer(setState: EngineStore['setState']) {
  // Recorded before setState so store subscribers can read the origin synchronously.
  for (const paramId in tempParamOriginBuffer) {
    lastParamValueOrigins[paramId] = tempParamOriginBuffer[paramId]

    delete tempParamOriginBuffer[paramId]
  }

  setState(
    (state) => {
      for (const paramId in tempParamValueBuffer) {
        state.paramValues[paramId] = tempParamValueBuffer[paramId]

        // remove from buffer
        delete tempParamValueBuffer[paramId]
      }
    },
    undefined,
    'ignore/paramValues',
  )
}
