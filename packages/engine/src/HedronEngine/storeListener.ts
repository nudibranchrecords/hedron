import { EngineStore } from '@store/engineStore'

interface StoreListenerConfig {
  store: EngineStore
  onSketchAdded: (instanceId: string, moduleId: string) => void
  onSketchRemoved: (instanceId: string) => void
  onNodeRemoved: (nodeId: string) => void
}

export const listenToStore = ({
  store,
  onSketchAdded,
  onSketchRemoved,
  onNodeRemoved,
}: StoreListenerConfig) => {
  const unsubscribeSketches = store.subscribe(
    (state) => state.sketches,
    (sketches, previousSketches) => {
      Object.keys(previousSketches).forEach((prevId) => {
        if (!sketches[prevId]) {
          onSketchRemoved(prevId)
        }
      })

      Object.keys(sketches).forEach((id) => {
        if (!previousSketches[id]) {
          onSketchAdded(id, sketches[id].moduleId)
        }
      })
    },
  )

  const unsubscribeNodes = store.subscribe(
    (state) => state.nodes,
    (nodes, previousNodes) => {
      Object.keys(previousNodes).forEach((prevId) => {
        if (!nodes[prevId]) {
          onNodeRemoved(prevId)
        }
      })
    },
  )

  return () => {
    unsubscribeSketches()
    unsubscribeNodes()
  }
}
