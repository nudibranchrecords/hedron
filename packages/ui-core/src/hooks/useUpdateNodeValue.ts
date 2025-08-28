import { useEngineStore } from '@hooks/store'

export const useUpdateNodeValue = () => {
  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)

  return updateNodeValue
}

export const useUpdateMultipleNodeValues = () => {
  const updateMultipleNodeValues = useEngineStore((state) => state.updateMultipleNodeValues)

  return updateMultipleNodeValues
}
