import { ParamValue, SetterCreator } from '@store/types'
import { fireShotOnSketch } from '@world/SketchManager'

export const createUpdateNodeValues: SetterCreator<'updateNodeValues'> =
  (setState) => (inputId: string, value: ParamValue) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (!input) {
        //throw new Error(`Input with id ${inputId} not found.`)
        return
      }

      input.targetNodeIds.forEach((nodeId) => {
        if (state.params[nodeId]) {
          state.paramValues[nodeId] = value
        } else if (state.shots[nodeId]) {
          const shot = state.shots[nodeId]
          if (value) fireShotOnSketch(shot.sketchId, shot.key)
        }
      })
    })
  }
