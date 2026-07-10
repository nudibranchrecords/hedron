import { useCallback } from 'react'
import { ParamValue } from '@hedron-gl/engine'
import { useUpdateMultipleParamValues, useUpdateParamValue } from '@hooks/useUpdateParamValue'

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

export const useOnMultipleParamValuesChange = (...ids: string[]) => {
  const updateMultipleParamValues = useUpdateMultipleParamValues()

  const onValuesChange = useCallback(
    (values: ParamValue[]) => {
      updateMultipleParamValues(ids, values)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...ids, updateMultipleParamValues],
  )

  return onValuesChange
}
