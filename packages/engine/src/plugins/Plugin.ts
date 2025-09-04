import {
  EngineState,
  EngineStateWithActions,
  Input,
  InputOptionNodesConfig,
  Node,
  NodeValue,
} from '@store/types'

/**
 * Class type for a Plugin.
 */
export interface IPlugin {
  /**
   * Unique ID for plugin
   */
  id: string

  /**
   * Type of input
   */
  inputType: string

  /**
   * The name of the plugin.
   */
  name: string

  /**
   * The description of the plugin.
   */
  description: string

  /**
   * Config to generate option nodes
   */
  optionNodesConfig: InputOptionNodesConfig
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigToOptionsType<T extends readonly any[]> = {
  [K in T[number] as K['key']]: K['valueType'] extends 'enum'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      K['options'] extends readonly any[]
      ? K['options'][number]['value']
      : K['defaultValue']
    : K['valueType'] extends 'number'
      ? number
      : K['valueType'] extends 'boolean'
        ? boolean
        : K['defaultValue']
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOptionNodesFromIds = <T extends readonly any[]>(
  state: EngineState,
  ids: string[],
) => {
  type OptionsType = ConfigToOptionsType<T>

  const options = {} as OptionsType
  ids.forEach((id) => {
    const node = state.nodes[id]
    ;(options as Record<string, unknown>)[node.key] = state.nodeValues[id]
  })
  return options
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleEachInput = <T extends readonly any[]>(
  storeState: EngineStateWithActions,
  inputType: string,
  callback: ({
    input,
    optionNodes,
  }: {
    input: Input
    optionNodes: ConfigToOptionsType<T>
    targetNode: Node
    targetNodeValue: NodeValue
  }) => void,
) => {
  const inputs = Object.values(storeState.inputs)

  // TODO: Not very performant, we might want to cache inputs somehow
  inputs.forEach((input) => {
    if (input.type !== inputType) return

    const targetNode = storeState.nodes[input.targetNodeId]

    if (!targetNode) {
      // Node may not exist if deleting a sketch/param didn't clean up properly
      // TODO: special log level for checking this
      return
    }

    const targetNodeValue = storeState.nodeValues[input.targetNodeId]

    const optionNodes = getOptionNodesFromIds<T>(storeState, input.optionNodeIds)

    callback({ input, optionNodes, targetNode, targetNodeValue })
  })
}
