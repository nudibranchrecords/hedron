import { initialState } from '@engine/store/initialState'
import { SetterCreator } from '@engine/store/types'

export const createReset: SetterCreator<'reset'> = (setState) => () => {
  setState(() => initialState)
}
