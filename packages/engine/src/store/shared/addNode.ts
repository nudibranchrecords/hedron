import {
  EngineState,
  EnsureRequiredValueType,
  NodeParamWithChildrenBase,
  ParamValueTypeWithChildren,
  SketchConfigParamImported,
  isNodeTypeWithChildren,
  NodeValueType,
  SketchConfigShotImported,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const vector3Keys = ['x', 'y', 'z']
const rgbKeys = ['r', 'g', 'b']

type AddNodeConfig = EnsureRequiredValueType<SketchConfigParamImported> | SketchConfigShotImported

// Exclude param types that have children (vector3, rgb)
type ParamConfigWithoutChildren = Exclude<
  EnsureRequiredValueType<SketchConfigParamImported>,
  { valueType: ParamValueTypeWithChildren }
>

const isParamConfigWithoutChildren = (
  config: EnsureRequiredValueType<SketchConfigParamImported>,
): config is ParamConfigWithoutChildren => {
  return !isNodeTypeWithChildren(config.valueType)
}

const _addNodeToState = (state: EngineState, nodeId: string, config: AddNodeConfig) => {
  if (config.nodeType === 'shot') {
    state.nodes[nodeId] = {
      ...config,
      id: nodeId,
      nodeType: 'shot',
      title: config.title ?? config.key,
    }

    return state.nodes[nodeId]
  }

  if (!isParamConfigWithoutChildren(config)) {
    throw new Error(`_addNodeToState shouldn't be used with node of valueType: ${config.valueType}`)
  }

  const { defaultValue, valueType, key, groupIndex, hidden } = config
  const title = config.title ?? config.key

  const baseNode = {
    id: nodeId,
    key,
    groupIndex,
    nodeType: 'param' as const,
    title,
    hidden,
  }

  switch (valueType) {
    case 'number':
      state.nodes[nodeId] = {
        ...baseNode,
        valueType,
        defaultValue,
        sliderMin: config.sliderMin,
        sliderMax: config.sliderMax,
      }
      break
    case 'boolean':
      state.nodes[nodeId] = { ...baseNode, valueType, defaultValue }
      break
    case 'string':
      state.nodes[nodeId] = { ...baseNode, valueType, defaultValue }
      break
    case 'enum':
      state.nodes[nodeId] = { ...baseNode, valueType, defaultValue, options: config.options }
      break
  }

  if (
    (valueType === 'number' && typeof defaultValue === 'number') ||
    (valueType === 'boolean' && typeof defaultValue === 'boolean') ||
    (valueType === 'enum' &&
      (typeof defaultValue === 'string' || typeof defaultValue === 'number')) ||
    (valueType === 'string' && typeof defaultValue === 'string')
  ) {
    state.nodeValues[nodeId] = defaultValue
  } else {
    throw new Error(
      `valueType of param ${key}: ${valueType} does not match defaultValue: ${defaultValue}`,
    )
  }

  return state.nodes[nodeId]
}

const _addSliderMinAndMaxNodesToState = (
  state: EngineState,
  paramId: string,
  sketchConfigParam: { sliderMin?: number; sliderMax?: number; valueType: NodeValueType },
) => {
  /** TODO: This can probably be tidier, using some sort of config object to generate the option nodes
   * The same config object could also be used in the component to loop through
   */
  if (sketchConfigParam.valueType === 'number') {
    _addNodeToState(state, `${paramId}-sliderMin`, {
      key: 'sliderMin',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMin ?? 0,
      groupIndex: 0,
      title: 'Slider Min',
    })

    _addNodeToState(state, `${paramId}-sliderMax`, {
      key: 'sliderMax',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMax ?? 1,
      groupIndex: 0,
      title: 'Slider Max',
    })
  }
}

export const addNode = (state: EngineState, nodeId: string, config: AddNodeConfig) => {
  if (config.nodeType === 'param' && isNodeTypeWithChildren(config.valueType)) {
    if (!Array.isArray(config.defaultValue)) {
      throw new Error(`Expected defaultValue to be an array for ${config.valueType} type`)
    }

    const childNodeIds = Array.from({ length: 3 }, createUniqueId) as [string, string, string]
    const keys = config.valueType === 'vector3' ? vector3Keys : rgbKeys

    state.nodes[nodeId] = {
      ...config,
      id: nodeId,
      nodeType: 'param',
      title: config.title ?? config.key,
      childNodeIds,
    } as NodeParamWithChildrenBase

    for (const [index, childNodeId] of childNodeIds.entries()) {
      _addNodeToState(state, childNodeId, {
        groupIndex: 0,
        nodeType: 'param',
        title: keys[index],
        key: keys[index],
        valueType: 'number',
        defaultValue: config.defaultValue[index],
      })
      _addSliderMinAndMaxNodesToState(state, childNodeId, {
        valueType: 'number',
      })
    }
  } else {
    _addNodeToState(state, nodeId, config)

    if (config.nodeType === 'param') {
      _addSliderMinAndMaxNodesToState(state, nodeId, config)
    }
  }
}
