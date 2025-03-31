import { useCallback } from 'react'
import { ParamValue } from '@hedron/engine'
import { useUpdateParamValue } from '@components/hooks/useUpdateParamValue'

export const useOnParamValueChange = (id: string) => {
  const updateParamValue = useUpdateParamValue()

  const onValueChange = useCallback(
    (value: ParamValue) => {
      updateParamValue(id, value)
    },
    [id, updateParamValue],
  )

  return onValueChange
}
