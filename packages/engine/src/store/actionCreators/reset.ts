import { initialState } from '@store/initialState'
import { SetterCreator } from '@store/types'

export const createReset: SetterCreator<'reset'> = (setState) => () => {
  setState(() => initialState)
}
