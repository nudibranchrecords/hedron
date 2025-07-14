import { SetterCreator } from '@store/types'

export const createUpdateNodeValue: SetterCreator<'updateNodeValue'> =
  (setState) => (nodeId, value) => {
    setState((state) => {
      state.nodeValues[nodeId] = value
    })
  }

export const createUpdateMultipleNodeValues: SetterCreator<'updateMultipleNodeValues'> =
  (setState) => (nodeIds, values) => {
    setState((state) => {
      for (let i = 0; i < nodeIds.length; i++) {
        state.nodeValues[nodeIds[i]] = values[i]
      }
    })
  }
