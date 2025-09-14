import { useCallback, useRef } from 'react'
import { NodeValue } from '@hedron/engine'
import { useUpdateMultipleNodeValues, useUpdateNodeValue } from '@hooks/useUpdateNodeValue'

export const useOnNodeValueChange = (id: string) => {
  const updateNodeValue = useUpdateNodeValue()

  const onValueChange = useCallback(
    (value: NodeValue) => {
      updateNodeValue(id, value)
    },
    [id, updateNodeValue],
  )

  return onValueChange
}

export const useOnMultipleNodeValuesChange = (ids: string[]) => {
  const stableIds = useRef(ids)
  const updateMultipleNodeValues = useUpdateMultipleNodeValues()

  const onValuesChange = useCallback(
    (values: NodeValue[]) => {
      updateMultipleNodeValues(stableIds.current, values)
    },
    [updateMultipleNodeValues],
  )

  return onValuesChange
}
