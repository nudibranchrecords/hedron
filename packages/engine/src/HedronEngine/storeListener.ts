import { shallow } from 'zustand/shallow'
import { EngineStore } from '@store/engineStore'
import { getCurrentSceneSketchIds } from '@store/selectors/getSceneSketches'
import { isSketchNode } from '@store/types'

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
    (state) => getCurrentSceneSketchIds(state),
    (newKeys, prevKeys) => {
      const state = store.getState()

      prevKeys.forEach((prevId) => {
        if (!newKeys.includes(prevId)) {
          onSketchRemoved(prevId)
        }
      })

      newKeys.forEach((id) => {
        if (!prevKeys.includes(id)) {
          const sketch = state.nodes[id]
          if (isSketchNode(sketch)) {
            onSketchAdded(id, sketch.moduleId)
          }
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
