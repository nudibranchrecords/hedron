import { EngineState, NodeTypes, SketchConfigParam, isNodeTypeWithChildren } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

const vector3Keys = ['x', 'y', 'z']
const rgbKeys = ['r', 'g', 'b']

export const addNode = (
  state: EngineState,
  paramId: string,
  sketchId: string,
  { key, valueType = NodeTypes.Number, defaultValue }: SketchConfigParam,
) => {
  if (isNodeTypeWithChildren(valueType)) {
    if (!Array.isArray(defaultValue)) {
      throw new Error(`Expected defaultValue to be an array for ${valueType} type`)
    }

    const childNodeIds = Array.from({ length: 3 }, createUniqueId) as [string, string, string]
    const keys = valueType === NodeTypes.Vector3 ? vector3Keys : rgbKeys

    state.nodes[paramId] = {
      id: paramId,
      key,
      type: 'param',
      valueType,
      sketchId,
      childNodeIds,
    }

    childNodeIds.forEach((childNodeId, index) => {
      state.nodes[childNodeId] = {
        id: childNodeId,
        key: keys[index],
        type: 'param',
        valueType: NodeTypes.Number,
        sketchId,
      }
    })

    defaultValue.forEach((value: number, index: number) => {
      state.nodeValues[childNodeIds[index]] = value
    })
  } else {
    state.nodes[paramId] = {
      id: paramId,
      key,
      type: 'param' as const,
      valueType,
      sketchId,
    }

    // Set the default value if it matches the valueType.
    if (
      (typeof defaultValue === 'number' && valueType === NodeTypes.Number) ||
      (typeof defaultValue === 'boolean' && valueType === NodeTypes.Boolean) ||
      (typeof defaultValue === 'string' && valueType === NodeTypes.Enum)
    ) {
      state.nodeValues[paramId] = defaultValue
    } else {
      throw new Error(
        `valueType of param ${key} does not match defaultValue for sketch ${sketchId}`,
      )
    }
  }
}
