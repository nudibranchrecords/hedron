import { useCallback } from 'react'
import { useUpdateNodeValue } from './useUpdateNodeValue'
import { NodeValue } from 'src/engine/store/types'

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
