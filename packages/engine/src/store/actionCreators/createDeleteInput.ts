import { deleteInput } from '@store/shared/deleteCascade'
import { SetterCreator } from '@store/types'

export const createDeleteInput: SetterCreator<'deleteInput'> = (setState) => (inputId: string) =>
  setState((state) => deleteInput(state, inputId))
