import { SetterCreator } from '@store/types'

export const createDeleteSketch: SetterCreator<'deleteSketch'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      state.sketches[instanceId].paramIds.forEach((paramId) => {
        delete state.params[paramId]
        delete state.paramValues[paramId]
      })

      state.sketches[instanceId].shotIds.forEach((shotId) => {
        delete state.shots[shotId]
      })

      delete state.sketches[instanceId]
    })
