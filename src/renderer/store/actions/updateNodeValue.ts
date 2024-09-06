import { useAppStore } from '../useAppStore'

export const updateNodeValue = (nodeId: string, value: number) => {
  useAppStore.setState((state) => ({
    nodeValues: {
      ...state.nodeValues,
      [nodeId]: value,
    },
  }))
}
