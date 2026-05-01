import {
  EngineState,
  EnsureRequiredValueType,
  ParamVectorValueType,
  SketchConfigParamImported,
  ParamValueType,
  SketchConfigShotImported,
  ParamVector,
  isParamVectorValueType,
  CustomNode,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const keysLookup: Record<ParamVectorValueType, string[]> = {
  vector3: ['x', 'y', 'z'],
  vector2: ['x', 'y'],
  rgb: ['r', 'g', 'b'],
}

export type AddNodeConfig =
  | EnsureRequiredValueType<SketchConfigParamImported>
  | SketchConfigShotImported
  | CustomNode

// Exclude param types that have children (vector3, rgb)
type ParamConfigNonVector = Exclude<
  EnsureRequiredValueType<SketchConfigParamImported>,
  { valueType: ParamVectorValueType }
>

const isParamNonVectorConfig = (
  config: EnsureRequiredValueType<SketchConfigParamImported>,
): config is ParamConfigNonVector => {
  return !isParamVectorValueType(config.valueType)
}

const _addNodeToState = (
  state: EngineState,
  nodeId: string,
  parentId: string | null,
  optionNodeIds: string[],
  config: AddNodeConfig,
) => {
  if (config.nodeType === 'custom') {
    const { childGroups, ...rest } = config

    state.nodes[nodeId] = {
      ...rest,
      id: nodeId,
      parentIds: parentId ? [parentId] : [],
      childGroups,
    }

    return state.nodes[nodeId]
  }

  if (config.nodeType === 'shot') {
    state.nodes[nodeId] = {
      ...config,
      id: nodeId,
      nodeType: 'shot',
      title: config.title ?? config.key,
      parentIds: parentId ? [parentId] : [],
      childGroups: { optionNodeIds, inputNodeIds: [] },
    }

    return state.nodes[nodeId]
  }

  if (!isParamNonVectorConfig(config)) {
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
    parentIds: parentId ? [parentId] : [],
    childGroups: { optionNodeIds, inputNodeIds: [] },
  }

  switch (valueType) {
    case 'number':
      state.nodes[nodeId] = { ...baseNode, valueType, defaultValue }
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
    state.paramValues[nodeId] = defaultValue
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
  sketchConfigParam: { sliderMin?: number; sliderMax?: number; valueType: ParamValueType },
) => {
  /** TODO: This can probably be tidier, using some sort of config object to generate the option nodes
   * The same config object could also be used in the component to loop through
   */
  if (sketchConfigParam.valueType === 'number') {
    _addNodeToState(state, `${paramId}-sliderMin`, paramId, [], {
      key: 'sliderMin',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMin ?? 0,
      groupIndex: 0,
      title: 'Slider Min',
    })

    _addNodeToState(state, `${paramId}-sliderMax`, paramId, [], {
      key: 'sliderMax',
      nodeType: 'param',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMax ?? 1,
      groupIndex: 0,
      title: 'Slider Max',
    })

    return [`${paramId}-sliderMin`, `${paramId}-sliderMax`]
  }

  return []
}

export const addNode = (
  state: EngineState,
  nodeId: string,
  parentId: string | null,
  config: AddNodeConfig,
) => {
  if (config.nodeType === 'param' && isParamVectorValueType(config.valueType)) {
    if (!Array.isArray(config.defaultValue)) {
      throw new Error(`Expected defaultValue to be an array for ${config.valueType} type`)
    }

    const keys = keysLookup[config.valueType]

    const vectorComponentIds = Array.from({ length: keys.length }, createUniqueId) as string[]

    state.nodes[nodeId] = {
      ...config,
      id: nodeId,
      nodeType: 'param',
      title: config.title ?? config.key,
      childGroups: { optionNodeIds: [], inputNodeIds: [], vectorComponentIds },
      parentIds: parentId ? [parentId] : [],
    } as ParamVector

    for (const [index, childNodeId] of vectorComponentIds.entries()) {
      const optionNodeIds = _addSliderMinAndMaxNodesToState(state, childNodeId, {
        valueType: 'number',
      })

      _addNodeToState(state, childNodeId, nodeId, optionNodeIds, {
        groupIndex: 0,
        nodeType: 'param',
        title: keys[index],
        key: keys[index],
        valueType: 'number',
        defaultValue: config.defaultValue[index],
      })
    }
  } else {
    let optionNodeIds: string[] = []

    if (config.nodeType === 'param') {
      optionNodeIds = _addSliderMinAndMaxNodesToState(state, nodeId, config)
    }

    _addNodeToState(state, nodeId, parentId, optionNodeIds, config)
  }
}
