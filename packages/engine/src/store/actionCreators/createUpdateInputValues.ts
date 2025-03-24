import { NodeValue, SetterCreator } from '@store/types'

export const createUpdateInputValues: SetterCreator<'updateInputValues'> =
  (setState) => (inputId: string, value: NodeValue) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (!input) {
        //throw new Error(`Input with id ${inputId} not found.`)
        return
      }

      input.targetNodeIds.forEach((nodeId) => {
        state.nodeValues[nodeId] = value
      })
    })
  }
