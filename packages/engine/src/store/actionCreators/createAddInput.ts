import { Input, SetterCreator } from '@store/types'

export const createAddInput: SetterCreator<'addInput'> =
  (setState) => (inputId: string, value: Input) => {
    setState((state) => {
      if (state.inputs[inputId]) {
        return
      }
      state.inputs[inputId] = value
    })
  }

export const createAddInputParam: SetterCreator<'addInputParam'> =
  (setState) => (inputId: string, nodeId: string) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (input) {
        input.targetNodeIds.push(nodeId)
      }
    })
  }

export const createDeleteInputParam: SetterCreator<'deleteInputParam'> =
  (setState) => (inputId: string, nodeId: string) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (input) {
        input.targetNodeIds = input.targetNodeIds.filter((id) => id !== nodeId)
      }
    })
  }
