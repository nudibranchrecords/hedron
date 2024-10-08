import { SetterCreator } from '../types'

export const createUpdateSelectedNode: SetterCreator<'updateSelectedNode'> =
(setState) => (nodeId) => {
  setState((state) => {
    state.selectedNode = nodeId
  })
}