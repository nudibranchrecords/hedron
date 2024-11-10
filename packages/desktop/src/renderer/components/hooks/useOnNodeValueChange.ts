import { useCallback } from 'react'
import { NodeValue } from '@hedron/engine'
import { useUpdateNodeValue } from '@components/hooks/useUpdateNodeValue'

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
