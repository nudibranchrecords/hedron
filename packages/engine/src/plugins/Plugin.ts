import { HedronEngine } from '@HedronEngine/HedronEngine'
import { nodesAsArray } from '@utils/nodesAsArray'
import {
  EngineState,
  EngineStateWithActions,
  InputNode,
  ParamValue,
  ParamNode,
  ShotNode,
  ConfigParam,
  ConfigShot,
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
   * Icon to be displayed in various places
   * https://fonts.google.com/icons
   */
  iconName: string

  /**
   * The description of the plugin.
   */
  description: string

  /**
   * @deprecated prefer `onNewInput` to create option nodes
   * Config to generate option nodes. Follows same structure as sketch params config.
   */
  optionNodesConfig?: readonly (ConfigParam | ConfigShot)[]

  /**
   * @deprecated prefer `onEngineInitialize` to create global plugin option nodes
   * Config to generate global option nodes. Follows same structure as sketch params config.
   */
  globalOptionNodesConfig?: readonly (ConfigParam | ConfigShot)[]

  /**
   * Optional callback called after engine initialization (project load, sketches folder selection)
   * Useful for plugins that need to sync their state after the store is populated
   */
  onEngineInitialize?: (engine: HedronEngine) => void

  /**
   * Optional callback called after each input for this plugin is added
   */
  onNewInput?: (engine: HedronEngine, newInput: InputNode, targetNode: ParamNode | ShotNode) => void
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

    if (!node) {
      // Node may not exist if deleting a sketch/param didn't clean up properly
      console.warn(`Option node with id ${id} not found in state.`)
      return
    }

    if (node.nodeType === 'custom') {
      console.warn(
        `Node ${node.id} is a custom node. Custom nodes cannot be used as option nodes for plugins.`,
      )

      return
    }

    if (node.nodeType === 'input') {
      console.warn(
        `Node ${node.id} is an input node. Input nodes cannot be used as option nodes for plugins.`,
      )
      return
    }

    if (node.nodeType === 'scene' || node.nodeType === 'sketch') {
      console.warn(
        `Node ${node.id} is a ${node.nodeType} node. ${node.nodeType} nodes cannot be used as option nodes for plugins.`,
      )
      return
    }

    ;(options as Record<string, unknown>)[node.key] = state.paramValues[id]
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
  }:
    | {
        input: InputNode
        optionNodes: ConfigToOptionsType<T>
        targetNode: ParamNode
        targetParamValue: ParamValue
      }
    | {
        input: InputNode
        optionNodes: ConfigToOptionsType<T>
        targetNode: ShotNode
        targetParamValue?: never
      }) => void,
) => {
  const allNodes = nodesAsArray(storeState.nodes)

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
        `Input ${input.id} is trying to target another input ${targetNode.id}. This is not supported.`,
      )
      return
    }

    if (targetNode.nodeType === 'custom') {
      console.warn(
        `Input ${input.id} is trying to target a custom node ${targetNode.id}. This is not supported.`,
      )
      return
    }

    if (targetNode.nodeType === 'scene' || targetNode.nodeType === 'sketch') {
      console.warn(
        `Input ${input.id} is trying to target a ${targetNode.nodeType} node ${targetNode.id}. This is not supported.`,
      )
      return
    }

    const optionNodes = getOptionNodesFromIds<T>(storeState, input.childGroups.optionNodeIds)

    if (targetNode.nodeType === 'param') {
      const targetParamValue = storeState.paramValues[input.targetNodeId]

      if (targetParamValue === undefined) {
        // Node may not exist if deleting a sketch/param didn't clean up properly
        // TODO: special log level for checking this
        return
      }

      callback({ input, optionNodes, targetNode, targetParamValue: targetParamValue })
    } else if (targetNode.nodeType === 'shot') {
      callback({ input, optionNodes, targetNode })
    }
  })
}
