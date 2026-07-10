import { useCallback } from 'react'
import { useOnMultipleParamValuesChange } from './useOnParamValueChange'

export const useOnParamVec3ValueChange = (id1: string, id2: string, id3: string) => {
  const onValuesChange = useOnMultipleParamValuesChange(id1, id2, id3)

  const onVec3ValueChange = useCallback(
    (value: [number, number, number]) => {
      onValuesChange(value)
    },
    [onValuesChange],
  )

  return onVec3ValueChange
}
