import { deleteNode } from '@store/shared/deleteNode'
import { SetterCreator } from '@store/types'

export const createDeleteNode: SetterCreator<'deleteNode'> = (setState) => (nodeId: string) =>
  setState((state) => deleteNode(state, nodeId))
