import { ensureNodeConfig } from '@store/shared/ensureConfig'
import { addNode } from '@store/shared/addNode'
import { InputNode, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> =
  (setState) =>
  (inputConfig, optionsNodeConfig = []) => {
    const id = createUniqueId()

    const optionNodeIds: string[] = []

    let newInput: InputNode | undefined = undefined

    setState((state) => {
      for (const cfg of optionsNodeConfig) {
        const optionNodeId = createUniqueId()
        optionNodeIds.push(optionNodeId)

        const cfgImported = ensureNodeConfig(cfg)

        addNode(state, optionNodeId, id, cfgImported)
      }

      if (state.nodes[id]) {
        newInput = state.nodes[id] as InputNode
        return
      }

      newInput = {
        ...inputConfig,
        childGroups: {
          optionNodeIds,
          inputNodeIds: [],
        },
        id,
        nodeType: 'input',
      }

      state.nodes[id] = newInput

      // Add children Ids to target node (so that cleanup works if target node is deleted)
      state.nodes[inputConfig.targetNodeId]?.childGroups.inputNodeIds.push(id)
    })

    if (!newInput) {
      throw new Error(
        'Failed to create new input. This is likely a bug in the engine store, as it should have been created in the setState callback.',
      )
    }

    return newInput as InputNode
  }
