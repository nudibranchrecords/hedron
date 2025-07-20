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
  sketchId: string,
  { key, defaultValue, valueType, ...config }: EnsureRequiredValueType<SketchConfigParam>,
) => {
  if (isNodeTypeWithChildren(valueType)) {
    throw new Error(`addNodeAndOptionNodes shouldn't be used with node of valueType: ${valueType}`)
  }

  state.nodes[paramId] = {
    id: paramId,
    key,
    type: 'param' as const,
    sketchId,
    valueType,
    groupIndex: null,
    ...config,
  }

  if (
    (typeof defaultValue === 'number' && valueType === NodeTypes.Number) ||
    (typeof defaultValue === 'boolean' && valueType === NodeTypes.Boolean) ||
    (typeof defaultValue === 'string' && valueType === NodeTypes.Enum)
  ) {
    state.nodeValues[paramId] = defaultValue
  } else {
    throw new Error(`valueType of param ${key} does not match defaultValue for sketch ${sketchId}`)
  }

  return state.nodes[paramId]
}

const _addOptionNodeToState = (
  state: EngineState,
  paramId: string,
  sketchId: string,
  sketchConfigParam: SketchConfigParam,
) => {
  /** TODO: This can probably be tidier, using some sort of config object to generate the option nodes
   * The same config object could also be used in the component to loop through
   */
  if (sketchConfigParam.valueType === NodeTypes.Number) {
    _addNodeToState(state, `${paramId}-sliderMin`, sketchId, {
      key: 'sliderMin',
      valueType: NodeTypes.Number,
      defaultValue: sketchConfigParam.sliderMin ?? 0,
    })

    _addNodeToState(state, `${paramId}-sliderMax`, sketchId, {
      key: 'sliderMax',
      valueType: NodeTypes.Number,
      defaultValue: sketchConfigParam.sliderMax ?? 1,
    })
  }
}

export const addNode = (
  state: EngineState,
  paramId: string,
  sketchId: string,
  sketchConfigParam: SketchConfigParamImported,
) => {
  if (isNodeTypeWithChildren(sketchConfigParam.valueType)) {
    if (!Array.isArray(sketchConfigParam.defaultValue)) {
      throw new Error(
        `Expected defaultValue to be an array for ${sketchConfigParam.valueType} type`,
      )
    }

    const childNodeIds = Array.from({ length: 3 }, createUniqueId) as [string, string, string]
    const keys = sketchConfigParam.valueType === NodeTypes.Vector3 ? vector3Keys : rgbKeys

    state.nodes[paramId] = {
      id: paramId,
      key: sketchConfigParam.key,
      type: 'param',
      valueType: sketchConfigParam.valueType,
      sketchId,
      groupIndex: sketchConfigParam.groupIndex ?? null,
      childNodeIds,
    }

    for (const [index, childNodeId] of childNodeIds.entries()) {
      _addNodeToState(state, childNodeId, sketchId, {
        key: keys[index],
        valueType: NodeTypes.Number,
        defaultValue: sketchConfigParam.defaultValue[index],
      })
      _addOptionNodeToState(state, childNodeId, sketchId, {
        valueType: NodeTypes.Number,
      } as SketchConfigParam)
    }
  } else {
    _addNodeToState(state, paramId, sketchId, sketchConfigParam)
    _addOptionNodeToState(state, paramId, sketchId, sketchConfigParam)
  }
}
