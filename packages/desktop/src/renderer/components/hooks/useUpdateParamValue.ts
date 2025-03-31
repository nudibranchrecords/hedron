import { useEngineStore } from '@renderer/engine'

export const useUpdateParamValue = () => {
  const updateParamValue = useEngineStore((state) => state.updateParamValue)

  return updateParamValue
}
