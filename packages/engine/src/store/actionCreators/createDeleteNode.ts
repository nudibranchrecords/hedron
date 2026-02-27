import { deleteNode } from '@store/shared/deleteNode'
import { SetterCreator } from '@store/types'

export const createDeleteInput: SetterCreator<'deleteNode'> = (setState) => (inputId: string) =>
  setState((state) => deleteNode(state, inputId))
