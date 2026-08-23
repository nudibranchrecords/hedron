import { useCallback } from 'react'
import { ParamValue } from '@hedron-gl/engine'
import { useEngine } from './engineHooks'

export const useOnParamValueChange = (id: string) => {
  const engine = useEngine()

  const onValueChange = useCallback(
    (value: ParamValue | ParamValue[]) => {
      engine.setParamValue(id, value)
    },
    [engine, id],
  )

  return onValueChange
}
