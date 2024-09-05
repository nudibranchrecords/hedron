import { useAppStore } from '../useAppStore'

export const updateNodeValue = (nodeId: string, value: number) => {
  // Mutating state for performance reasons
  useAppStore.getState().nodes[nodeId].value = value
}
