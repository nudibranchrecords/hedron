import { useEngineStore } from 'src/renderer/engine'

export const useUpdateNodeValue = () => {
  const updateNodeValue = useEngineStore((state) => state.updateNodeValue)

  return updateNodeValue
}
