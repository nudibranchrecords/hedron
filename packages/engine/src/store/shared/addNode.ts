import {
  EngineState,
  EnsureRequiredValueType,
  NodeTypes,
  SketchConfigParam,
  SketchConfigParamImported,
  isNodeTypeWithChildren,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const vector3Keys = ['x', 'y', 'z']
const rgbKeys = ['r', 'g', 'b']

const _addNodeToState = (
  state: EngineState,
  paramId: string,
  config: EnsureRequiredValueType<SketchConfigParam>,
) => {
  const { defaultValue, valueType, key } = config

  if (isNodeTypeWithChildren(valueType)) {
    throw new Error(`addNodeAndOptionNodes shouldn't be used with node of valueType: ${valueType}`)
  }

  state.nodes[paramId] = {
    ...config,
    id: paramId,
    type: 'param' as const,
    title: config.title ?? config.key,
  }

  if (
    (typeof defaultValue === 'number' && valueType === NodeTypes.Number) ||
    (typeof defaultValue === 'boolean' && valueType === NodeTypes.Boolean) ||
    (typeof defaultValue === 'string' && valueType === NodeTypes.Enum) ||
    (typeof defaultValue === 'number' && valueType === NodeTypes.Enum) ||
    (typeof defaultValue === 'string' && valueType === NodeTypes.String)
  ) {
    state.nodeValues[paramId] = defaultValue
  } else {
    throw new Error(
      `valueType of param ${key}: ${valueType} does not match defaultValue: ${defaultValue}`,
    )
  }

  return state.nodes[paramId]
}

const _addOptionNodeToState = (
  state: EngineState,
  paramId: string,
  sketchConfigParam: SketchConfigParam,
) => {
  /** TODO: This can probably be tidier, using some sort of config object to generate the option nodes
   * The same config object could also be used in the component to loop through
   */
  if (sketchConfigParam.valueType === NodeTypes.Number) {
    _addNodeToState(state, `${paramId}-sliderMin`, {
      key: 'sliderMin',
      valueType: NodeTypes.Number,
      defaultValue: sketchConfigParam.sliderMin ?? 0,
    })

    _addNodeToState(state, `${paramId}-sliderMax`, {
      key: 'sliderMax',
      valueType: NodeTypes.Number,
      defaultValue: sketchConfigParam.sliderMax ?? 1,
    })
  }
}

export const addNode = (state: EngineState, paramId: string, config: SketchConfigParamImported) => {
  if (isNodeTypeWithChildren(config.valueType)) {
    if (!Array.isArray(config.defaultValue)) {
      throw new Error(`Expected defaultValue to be an array for ${config.valueType} type`)
    }

    const childNodeIds = Array.from({ length: 3 }, createUniqueId) as [string, string, string]
    const keys = config.valueType === NodeTypes.Vector3 ? vector3Keys : rgbKeys

    state.nodes[paramId] = {
      ...config,
      id: paramId,
      type: 'param',
      title: config.title ?? config.key,
      childNodeIds,
    }

    for (const [index, childNodeId] of childNodeIds.entries()) {
      _addNodeToState(state, childNodeId, {
        key: keys[index],
        valueType: NodeTypes.Number,
        defaultValue: config.defaultValue[index],
      })
      _addOptionNodeToState(state, childNodeId, {
        valueType: NodeTypes.Number,
      } as SketchConfigParam)
    }
  } else {
    _addNodeToState(state, paramId, config)
    _addOptionNodeToState(state, paramId, config)
  }
}
