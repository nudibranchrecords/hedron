import { useCallback } from 'react'
import { useOnParamValueChange } from './useOnParamValueChange'

export const useOnNodeVec3ValueChange = (id1: string, id2: string, id3: string) => {
  const onValueChange1 = useOnParamValueChange(id1)
  const onValueChange2 = useOnParamValueChange(id2)
  const onValueChange3 = useOnParamValueChange(id3)

  const onVec3ValueChange = useCallback(
    (value: [number, number, number]) => {
      onValueChange1(value[0])
      onValueChange2(value[1])
      onValueChange3(value[2])
    },
    [onValueChange1, onValueChange2, onValueChange3],
  )

  return onVec3ValueChange
}
