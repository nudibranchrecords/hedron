import { SetterCreator } from '../store'

export const createUpdateNodeValue: SetterCreator<'updateNodeValue'> =
  (setState) => (nodeId, value) => {
    setState((state) => ({
      nodeValues: {
        ...state.nodeValues,
        [nodeId]: value,
      },
    }))
  }
