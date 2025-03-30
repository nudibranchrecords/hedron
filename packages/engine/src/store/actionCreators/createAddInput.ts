import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> = (setState) => (value) => {
  setState((state) => {
    const id = createUniqueId()

    if (state.inputs[id]) {
      return
    }
    state.inputs[id] = {
      ...value,
      id,
    }
  })
}

export const createUpdateInputOptions: SetterCreator<'updateInputOptions'> =
  (setState) => (inputId, options) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (input) {
        Object.assign(input.options, options)
      }
    })
  }

export const createAddInputParam: SetterCreator<'addInputParam'> =
  (setState) => (inputId, nodeId) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (input) {
        input.targetNodeIds.push(nodeId)
      }
    })
  }

export const createDeleteInputParam: SetterCreator<'deleteInputParam'> =
  (setState) => (inputId, nodeId) => {
    setState((state) => {
      const input = state.inputs[inputId]
      if (input) {
        input.targetNodeIds = input.targetNodeIds.filter((id) => id !== nodeId)
      }
    })
  }
