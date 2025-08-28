import { Nodes, NodeValues, SetterCreator } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> =
  (setState) => (inputConfig, optionsNodeConfig) => {
    const id = createUniqueId()

    const optionNodes: Nodes = {}
    const nodeValues: NodeValues = {}

    // TODO: Use something like `addNode` rather than doing it inside here, as we have to handle all sorts of node types
    for (const cfg of optionsNodeConfig) {
      const optionId = createUniqueId()
      optionNodes[optionId] = {
        valueType: cfg.valueType,
        id: optionId,
        key: cfg.key,
      }
      nodeValues[optionId] = cfg.defaultValue
    }

    setState((state) => {
      if (state.inputs[id]) {
        return
      }
      state.inputs[id] = {
        ...inputConfig,
        optionNodeIds: Object.keys(optionNodes),
        id,
      }

      state.nodes = {
        ...state.nodes,
        ...optionNodes,
      }

      state.nodeValues = {
        ...state.nodeValues,
        ...nodeValues,
      }
    })

    return id
  }
