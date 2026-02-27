import { shallow } from 'zustand/shallow'
import { EngineStore } from '@store/engineStore'

interface StoreListenerConfig {
  store: EngineStore
  onSketchAdded: (instanceId: string, moduleId: string) => void
  onSketchRemoved: (instanceId: string) => void
  onNodeRemoved: (nodeId: string) => void
  onSketchesReordered: (instanceIds: string[]) => void
}

export const listenToStore = ({
  store,
  onSketchAdded,
  onSketchRemoved,
  onNodeRemoved,
  onSketchesReordered,
}: StoreListenerConfig) => {
  const unsubscribeSketches = store.subscribe(
    (state) => state.sketches,
    (sketches, previousSketches) => {
      const prevKeys = Object.keys(previousSketches)
      const newKeys = Object.keys(sketches)

      prevKeys.forEach((prevId) => {
        if (!sketches[prevId]) {
          onSketchRemoved(prevId)
        }
      })

      newKeys.forEach((id) => {
        if (!previousSketches[id]) {
          onSketchAdded(id, sketches[id].moduleId)
        }
      })

      if (!shallow(prevKeys, newKeys)) {
        onSketchesReordered(newKeys)
      }
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
