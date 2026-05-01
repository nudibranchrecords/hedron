import { useEngineStore } from '@hooks/engineHooks'

export const useUpdateParamValue = () => {
  const updateParamValue = useEngineStore((state) => state.updateParamValue)

  return updateParamValue
}

export const useUpdateMultipleParamValues = () => {
  const updateMultipleParamValues = useEngineStore((state) => state.updateMultipleParamValues)

  return updateMultipleParamValues
}
