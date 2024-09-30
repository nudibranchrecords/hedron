import { initialState } from '../initialState'
import { SetterCreator } from '../types'

export const createReset: SetterCreator<'reset'> = (setState) => () => {
  setState(() => initialState)
}
