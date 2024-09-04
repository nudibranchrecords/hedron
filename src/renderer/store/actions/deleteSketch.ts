import { useAppStore } from '../useAppStore'

export const deleteSketch = (instanceId: string) => {
  useAppStore.setState((state) => {
    state.sketches[instanceId].paramIds.forEach((paramId) => {
      delete state.nodes[paramId]
    })

    delete state.sketches[instanceId]
    return {
      sketches: { ...state.sketches },
      nodes: { ...state.nodes },
    }
  })
}
