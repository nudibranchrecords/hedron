import { shallow } from 'zustand/shallow'
import { ACTIVE_SCENE_ID_NODE_ID } from '@constants'
import { EngineStore } from '@store/engineStore'
import { getSceneSketchIds } from '@store/selectors/getSceneSketches'
import { isSketchNode, Node } from '@store/types'

interface StoreListenerConfig {
  store: EngineStore
  onSceneAdded?: (sceneId: string) => void
  onSceneRemoved?: (sceneId: string) => void
  onSketchAdded?: (sceneId: string, instanceId: string, moduleId: string) => void
  onSketchRemoved?: (sceneId: string, instanceId: string) => void
  onNodeRemoved?: (nodeId: string, node: Node) => void
  onSketchesReordered?: (sceneId: string, instanceIds: string[]) => void
  onActiveSceneChanged?: (sceneId: string | null) => void
}

interface SceneSketchSnapshot {
  sceneId: string
  sketchIds: string[]
}

export const listenToStore = ({
  store,
  onSceneAdded,
  onSceneRemoved,
  onSketchAdded,
  onSketchRemoved,
  onNodeRemoved,
  onSketchesReordered,
  onActiveSceneChanged,
}: StoreListenerConfig) => {
  let unsubscribeScenes: () => void = () => {}
  let unsubscribeSketches: () => void = () => {}
  let unsubscribeNodes: () => void = () => {}
  let unsubscribeActiveScene: () => void = () => {}

  if (onSceneAdded || onSceneRemoved) {
    unsubscribeScenes = store.subscribe(
      (state) => state.sceneIds,
      (sceneIds, previousSceneIds) => {
        previousSceneIds.forEach((sceneId) => {
          if (!sceneIds.includes(sceneId)) {
            onSceneRemoved?.(sceneId)
          }
        })

        sceneIds.forEach((sceneId) => {
          if (!previousSceneIds.includes(sceneId)) {
            onSceneAdded?.(sceneId)
          }
        })
      },
    )
  }

  if (onSketchAdded || onSketchRemoved || onSketchesReordered) {
    unsubscribeSketches = store.subscribe(
      (state): SceneSketchSnapshot[] => {
        return state.sceneIds.map((sceneId) => ({
          sceneId,
          sketchIds: getSceneSketchIds(state, sceneId),
        }))
      },
      (newSnapshots, prevSnapshots) => {
        const state = store.getState()
        const prevMap = new Map(prevSnapshots.map(({ sceneId, sketchIds }) => [sceneId, sketchIds]))

        newSnapshots.forEach(({ sceneId, sketchIds: newSketchIds }) => {
          const prevSketchIds = prevMap.get(sceneId) ?? []

          prevSketchIds.forEach((prevId) => {
            if (!newSketchIds.includes(prevId)) {
              onSketchRemoved?.(sceneId, prevId)
            }
          })

          newSketchIds.forEach((id) => {
            if (!prevSketchIds.includes(id)) {
              const sketch = state.nodes[id]
              if (isSketchNode(sketch)) {
                onSketchAdded?.(sceneId, id, sketch.moduleId)
              }
            }
          })

          if (!shallow(prevSketchIds, newSketchIds)) {
            onSketchesReordered?.(sceneId, newSketchIds)
          }
        })
      },
    )
  }

  if (onNodeRemoved) {
    unsubscribeNodes = store.subscribe(
      (state) => state.nodes,
      (nodes, previousNodes) => {
        Object.keys(previousNodes).forEach((prevId) => {
          if (!nodes[prevId]) {
            const previousNode = previousNodes[prevId]
            if (previousNode) {
              onNodeRemoved(prevId, previousNode)
            }
          }
        })
      },
    )
  }

  if (onActiveSceneChanged) {
    unsubscribeActiveScene = store.subscribe(
      (state) => state.paramValues[ACTIVE_SCENE_ID_NODE_ID] as string | undefined,
      (activeSceneId, previousActiveSceneId) => {
        if (activeSceneId !== previousActiveSceneId) {
          onActiveSceneChanged(activeSceneId ?? null)
        }
      },
    )
  }

  return () => {
    unsubscribeScenes()
    unsubscribeSketches()
    unsubscribeNodes()
    unsubscribeActiveScene()
  }
}
