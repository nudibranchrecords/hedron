import { SetterCreator } from '@engine/store/types'

export const createUpdateNodeValue: SetterCreator<'updateNodeValue'> =
  (setState) => (nodeId, value) => {
    setState((state) => {
      state.nodeValues[nodeId] = value
    })
  }
