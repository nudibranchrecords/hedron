import { SetterCreator } from '@store/types'

export const createMoveSketchUp: SetterCreator<'moveSketchUp'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sketches = Object.entries(state.sketches)
      const currentIndex = sketches.findIndex(([id]) => id === instanceId)
      if (currentIndex <= 0) {
        // Can't move the first index up further
        return
      }
      const [currentSketch] = sketches.splice(currentIndex, 1)
      sketches.splice(currentIndex - 1, 0, currentSketch)
      state.sketches = Object.fromEntries(sketches)
    })

export const createMoveSketchDown: SetterCreator<'moveSketchDown'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sketches = Object.entries(state.sketches)
      const currentIndex = sketches.findIndex(([id]) => id === instanceId)
      if (currentIndex === -1 || currentIndex >= sketches.length - 1) {
        // Can't move the last index down further
        return
      }
      const [currentSketch] = sketches.splice(currentIndex, 1)
      sketches.splice(currentIndex + 1, 0, currentSketch)
      state.sketches = Object.fromEntries(sketches)
    })
