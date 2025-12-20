import { SetterCreator } from '@store/types'

export const createMoveSketchUp: SetterCreator<'moveSketchUp'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sketches = Object.entries(state.sketches)
      const currentIndex = sketches.findIndex(([id]) => id === instanceId)
      if (currentIndex > 0) {
        const [currentSketch] = sketches.splice(currentIndex, 1)
        sketches.splice(currentIndex - 1, 0, currentSketch)
        state.sketches = Object.fromEntries(sketches)
      }
    })

export const createMoveSketchDown: SetterCreator<'moveSketchDown'> =
  (setState) => (instanceId: string) =>
    setState((state) => {
      const sketches = Object.entries(state.sketches)
      const currentIndex = sketches.findIndex(([id]) => id === instanceId)
      if (currentIndex < sketches.length - 1) {
        const [currentSketch] = sketches.splice(currentIndex, 1)
        sketches.splice(currentIndex + 1, 0, currentSketch)
        state.sketches = Object.fromEntries(sketches)
      }
    })
