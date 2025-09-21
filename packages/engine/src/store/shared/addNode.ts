import {
  EngineState,
  EnsureRequiredValueType,
  NodeParamWithChildren,
  SketchConfigParamImported,
  isNodeTypeWithChildren,
  NodeValueType,
  Param,
  SketchConfigParam,
} from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const vector3Keys = ['x', 'y', 'z']
const rgbKeys = ['r', 'g', 'b']

const _addNodeToState = (
  state: EngineState,
  paramId: string,
  config: EnsureRequiredValueType<SketchConfigParamImported>,
) => {
  const { defaultValue, valueType, key } = config

  if (isNodeTypeWithChildren(valueType)) {
    throw new Error(`_addNodeToState shouldn't be used with node of valueType: ${valueType}`)
  }

  state.nodes[paramId] = {
    ...config,
    valueType,
    id: paramId,
    type: 'param' as const,
    title: config.title ?? config.key,
  } as Param

  if (
    (valueType === 'number' && typeof defaultValue === 'number') ||
    (valueType === 'boolean' && typeof defaultValue === 'boolean') ||
    (valueType === 'enum' &&
      (typeof defaultValue === 'string' || typeof defaultValue === 'number')) ||
    (valueType === 'string' && typeof defaultValue === 'string')
  ) {
    state.nodeValues[paramId] = defaultValue
  } else {
    throw new Error(
      `valueType of param ${key}: ${valueType} does not match defaultValue: ${defaultValue}`,
    )
  }

  return state.nodes[paramId]
}

const _addSliderMinAndMaxNodesToState = (
  state: EngineState,
  paramId: string,
  sketchConfigParam: SketchConfigParam,
) => {
  /** TODO: This can probably be tidier, using some sort of config object to generate the option nodes
   * The same config object could also be used in the component to loop through
   */
  if (sketchConfigParam.valueType === 'number') {
    _addNodeToState(state, `${paramId}-sliderMin`, {
      key: 'sliderMin',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMin ?? 0,
      groupIndex: null,
      params: [], // TODO: Bad typing means we have to do this
      title: 'Slider Min',
    })

    _addNodeToState(state, `${paramId}-sliderMax`, {
      key: 'sliderMax',
      valueType: 'number',
      defaultValue: sketchConfigParam.sliderMax ?? 1,
      groupIndex: null,
      params: [], // TODO: Bad typing means we have to do this
      title: 'Slider Max',
    })
  }
}

export const addNode = (state: EngineState, paramId: string, config: SketchConfigParamImported) => {
  if (isNodeTypeWithChildren(config.valueType)) {
    if (!Array.isArray(config.defaultValue)) {
      throw new Error(`Expected defaultValue to be an array for ${config.valueType} type`)
    }

    const childNodeIds = Array.from({ length: 3 }, createUniqueId) as [string, string, string]
    const keys = config.valueType === 'vector3' ? vector3Keys : rgbKeys

    state.nodes[paramId] = {
      ...config,
      id: paramId,
      type: 'param',
      title: config.title ?? config.key,
      childNodeIds,
    } as NodeParamWithChildren

    for (const [index, childNodeId] of childNodeIds.entries()) {
      _addNodeToState(state, childNodeId, {
        groupIndex: null,
        title: keys[index],
        key: keys[index],
        valueType: 'number',
        defaultValue: config.defaultValue[index],
        params: [], // TODO: Bad typing means we have to do this
      })
      _addSliderMinAndMaxNodesToState(state, childNodeId, {
        valueType: 'number',
      })
    }
  } else {
    _addNodeToState(state, paramId, config)
    _addSliderMinAndMaxNodesToState(state, paramId, config)
  }
}
