import { useCallback, useRef } from 'react'
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

export const useOnMultipleParamValuesChange = (ids: string[]) => {
  const stableIds = useRef(ids)
  const updateMultipleParamValues = useUpdateMultipleParamValues()

  const onValuesChange = useCallback(
    (values: ParamValue[]) => {
      updateMultipleParamValues(stableIds.current, values)
    },
    [updateMultipleParamValues],
  )

  return onValuesChange
}
