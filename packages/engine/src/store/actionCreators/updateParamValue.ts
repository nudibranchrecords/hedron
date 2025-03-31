import { SetterCreator } from '@store/types'

export const createUpdateParamValue: SetterCreator<'updateParamValue'> =
  (setState) => (nodeId, value) => {
    setState((state) => {
      state.paramValues[nodeId] = value
    })
  }
