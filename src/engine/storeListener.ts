import { EngineStore } from './store/engineStore'

export const listenToStore = (
  store: EngineStore,
  addSketch: (instanceId: string, moduleId: string) => void,
  removeSketch: (instanceId: string) => void,
) =>
  store.subscribe(
    (state) => state.sketches,
    (sketches, previousSketches) => {
      Object.keys(previousSketches).forEach((prevId) => {
        if (!sketches[prevId]) {
          removeSketch(prevId)
        }
      })

      Object.keys(sketches).forEach((id) => {
        if (!previousSketches[id]) {
          addSketch(id, sketches[id].moduleId)
        }
      })
    },
  )
