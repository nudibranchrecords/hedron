import { ParamValueType, ParamVector, ParamVectorValueType } from './ParamNode'
import { Node } from './Node'
import { SceneNode } from './SceneNode'
import { SketchNode } from './SketchNode'
import type { HedronEngine } from '@HedronEngine/HedronEngine'

// Record ensures every ParamValueTypeWithChildren member is listed — adding a new
// type that extends NodeParamWithChildrenBase will cause a compile error here if
// it isn't included.
const paramValueTypesWithChildren: Record<ParamVectorValueType, true> = {
  vector3: true,
  vector2: true,
  rgb: true,
}

export const isParamVectorValueType = (
  paramValueType: ParamValueType,
): paramValueType is ParamVectorValueType => {
  return paramValueType != null && paramValueType in paramValueTypesWithChildren
}

export const isParamVector = (node: Node): node is ParamVector => {
  return node.nodeType === 'param' && node.valueType in paramValueTypesWithChildren
}

export const isParamVectorComponent = (node: Node, engine: HedronEngine) => {
  let isComponent = false

  if (node.nodeType !== 'param') return false

  for (const parentId of node.parentIds) {
    const parentNode = engine.getNode(parentId)!

    if (isParamVector(parentNode)) {
      isComponent = true
    }
  }

  return isComponent
}

export const isSketchNode = (node: Node | undefined): node is SketchNode => {
  return node?.nodeType === 'sketch'
}

export const isSceneNode = (node: Node | undefined): node is SceneNode => {
  return node?.nodeType === 'scene'
}
