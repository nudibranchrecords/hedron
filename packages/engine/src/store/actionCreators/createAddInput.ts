import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> = (setState) => (value) => {
  const id = createUniqueId()

  setState((state) => {
    if (state.inputs[id]) {
      return
    }
    state.inputs[id] = {
      ...value,
      id,
    }
  })

  return id
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
