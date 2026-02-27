import {
  EngineState,
  EngineStateWithActions,
  Input,
  Node,
  NodeConfig,
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
   * Config to generate option nodes. Follows same structure as sketch params config.
   */
  optionNodesConfig: NodeConfig[]

  /**
   * Config to generate global option nodes. Follows same structure as sketch params config.
   */
  globalOptionNodesConfig?: NodeConfig[]

  /**
   * Optional callback called after engine initialization (project load, sketches folder selection)
   * Useful for plugins that need to sync their state after the store is populated
   */
  onEngineInitialize?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigToOptionsType<T extends readonly any[]> = {
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

/**
 * Get option nodes from state by their IDs.
 * @param state The engine state.
 * @param ids The IDs of the option nodes.
 * @returns The option nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOptionNodesFromIds = <T extends readonly any[]>(
  state: EngineState,
  ids: string[],
) => {
  type OptionsType = ConfigToOptionsType<T>

  const options = {} as OptionsType
  ids.forEach((id) => {
    const node = state.nodes[id]

    if (node.nodeType === 'input') {
      console.warn(
        `Node ${node.title}: ${node.id} is an input node. Input nodes cannot be used as option nodes for plugins.`,
      )
      return
    }
    ;(options as Record<string, unknown>)[node.key] = state.nodeValues[id]
  })
  return options
}

/**
 * Plugin helper that loops through all inputs and handles those of a specific type.
 * Gets and hands back option nodes, the target node for the input, and its value.
 * @param storeState The engine store state.
 * @param inputType The type of input to handle (e.g. "midi")
 * @param callback The callback to execute for each input of the specified type.
 */
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
    targetNode: Exclude<Node, Input>
    targetNodeValue: NodeValue
  }) => void,
) => {
  const allNodes = Object.values(storeState.nodes)

  // TODO: Not very performant, we might want to cache inputs somehow
  allNodes.forEach((input) => {
    if (input.nodeType !== 'input' || input.inputType !== inputType) return

    const targetNode = storeState.nodes[input.targetNodeId]

    if (!targetNode) {
      // Node may not exist if deleting a sketch/param didn't clean up properly
      // TODO: special log level for checking this
      return
    }

    if (targetNode.nodeType === 'input') {
      console.warn(
        `Input ${input.title}: ${input.id} is trying to target another input ${targetNode.title}: ${targetNode.id}. This is not supported.`,
      )
      return
    }

    const targetNodeValue = storeState.nodeValues[input.targetNodeId]

    const optionNodes = getOptionNodesFromIds<T>(storeState, input.optionNodeIds)

    callback({ input, optionNodes, targetNode, targetNodeValue })
  })
}
