import { HedronStore } from './store/store'

export const listenToStore = (
  store: HedronStore,
  addSketch: (instanceId: string, moduleId: string) => void,
  removeSketch: (instanceId: string) => void,
) =>
  store.subscribe(
    (state) => state.sketches,
    (sketches, previousSketches) => {
      Object.keys(previousSketches).forEach((prevId) => {
        if (!sketches[prevId]) {
          console.log('Removing sketch:', prevId)
          removeSketch(prevId)
        }
      })

      Object.keys(sketches).forEach((id) => {
        if (!previousSketches[id]) {
          console.log('Adding sketch:', id)
          addSketch(id, sketches[id].moduleId)
        }
      })
    },
  )
