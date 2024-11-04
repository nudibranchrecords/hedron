import { useCallback } from 'react'
import { useUpdateNodeValue } from '@components/hooks/useUpdateNodeValue'
import { NodeValue } from '@engine/store/types'

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
