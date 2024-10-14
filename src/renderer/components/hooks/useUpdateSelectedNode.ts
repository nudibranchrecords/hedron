import { useEngineStore } from 'src/renderer/engine'

export const useUpdateSelectedNode = () => {
  const updateSelected = useEngineStore((state) => state.updateSelectedNode)

  return updateSelected
}
