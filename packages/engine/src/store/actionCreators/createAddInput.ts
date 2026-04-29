import { ensureConfig } from '@store/shared/ensureConfig'
import { addNode } from '@store/shared/addNode'
import { SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> =
  (setState) =>
  (inputConfig, optionsNodeConfig = []) => {
    const id = createUniqueId()

    const optionNodeIds: string[] = []

    setState((state) => {
      for (const cfg of optionsNodeConfig) {
        const optionNodeId = createUniqueId()
        optionNodeIds.push(optionNodeId)

        const cfgImported = ensureConfig(cfg)

        addNode(state, optionNodeId, id, cfgImported)
      }

      if (state.nodes[id]) {
        return
      }
      state.nodes[id] = {
        ...inputConfig,
        childGroups: {
          optionNodeIds,
          inputNodeIds: [],
        },
        id,
        nodeType: 'input',
      }

      // Add children Ids to target node (so that cleanup works if target node is deleted)
      state.nodes[inputConfig.targetNodeId]?.childGroups.inputNodeIds.push(id)
    })

    return id
  }
