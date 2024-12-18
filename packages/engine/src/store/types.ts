import { StoreApi } from 'zustand'

export interface SketchState {
  id: string
  title: string
  moduleId: string
  paramIds: string[]
}

export type Sketches = { [key: string]: SketchState }

// TODO: How to type this??
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SketchModule = any

export interface NodeBase {
  id: string
  key: string
}

export enum NodeTypes {
  Number = 'number',
  Boolean = 'boolean',
  Enum = 'enum',
  Vector3 = 'vector3',
  RGB = 'rgb',
}

export const NodeTypesWithChildren = [NodeTypes.Vector3, NodeTypes.RGB] as const
export type NodeTypeWithChildren = (typeof NodeTypesWithChildren)[number]

export interface NodeParamBase extends NodeBase {
  type: 'param'
  sketchId: string
}

export interface NodeParamNumber extends NodeParamBase {
  valueType: NodeTypes.Number
}

export interface NodeParamBoolean extends NodeParamBase {
  valueType: NodeTypes.Boolean
}

export interface NodeParamEnum extends NodeParamBase {
  valueType: NodeTypes.Enum
}

export interface NodeParamVector3 extends NodeParamBase {
  valueType: NodeTypes.Vector3
  childNodeIds: [string, string, string]
}

export interface NodeParamRGB extends NodeParamBase {
  valueType: NodeTypes.RGB
  childNodeIds: [string, string, string]
}

export type Param =
  | NodeParamBoolean
  | NodeParamNumber
  | NodeParamEnum
  | NodeParamVector3
  | NodeParamRGB

export type Node = Param
export type Nodes = { [key: string]: Node }

export type NodeValue = number | boolean | string
export type NodeValues = { [key: string]: NodeValue }

export const isNodeTypeWithChildren = (nodeType: NodeTypes): nodeType is NodeTypeWithChildren => {
  return NodeTypesWithChildren.includes(nodeType as NodeTypeWithChildren)
}

// Utility type guard to check if a node has child nodes
export const hasChildNodes = (
  node: Node,
): node is NodeParamBase & {
  childNodeIds: [string, string, string]
  valueType: NodeTypeWithChildren
} => {
  return 'childNodeIds' in node && isNodeTypeWithChildren(node.valueType)
}

export interface SketchConfigParamBase {
  key: string
  title?: string
}

export interface SketchConfigParamNumber extends SketchConfigParamBase {
  valueType?: NodeTypes.Number
  defaultValue: number
}

export interface SketchConfigParamBoolean extends SketchConfigParamBase {
  valueType: NodeTypes.Boolean
  defaultValue: boolean
}

export interface SketchConfigParamEnum extends SketchConfigParamBase {
  valueType: NodeTypes.Enum
  defaultValue: string
  options: EnumOption[]
}

export interface SketchConfigParamVector3 extends SketchConfigParamBase {
  valueType: NodeTypes.Vector3
  defaultValue: [number, number, number]
}

export interface SketchConfigParamRGB extends SketchConfigParamBase {
  valueType: NodeTypes.RGB
  defaultValue: [number, number, number]
}

export type SketchConfigParam =
  | SketchConfigParamNumber
  | SketchConfigParamBoolean
  | SketchConfigParamEnum
  | SketchConfigParamVector3
  | SketchConfigParamRGB

export interface SketchConfig {
  title: string
  description?: string
  params: SketchConfigParam[]
}

export interface SketchModuleItem {
  moduleId: string
  config: SketchConfig
  module: SketchModule
}

export type SketchModules = { [key: string]: SketchModuleItem }

export type EnumOption = { value: string; label: string }

export interface EngineData {
  sketches: Sketches
  nodes: Nodes
  nodeValues: NodeValues
}

interface AuxState {
  sketchModules: SketchModules
  isSketchModulesReady: boolean
}

export type EngineState = EngineData & AuxState

interface Actions {
  addSketch: (moduleId: string) => string
  updateSketchParams: (instanceId: string) => void
  deleteSketch: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateNodeValue: (nodeId: string, value: NodeValue) => void
  deleteSketchModule: (moduleId: string) => void
  loadProject: (project: EngineData) => void
  reset: () => void
}

export type EngineStateWithActions = EngineData & AuxState & Actions

export type SetState = StoreApi<EngineStateWithActions>['setState']

// Matches immer middleware and devtools
export type CustomSetState = (
  cb: (draft: EngineStateWithActions) => void,
  replace?: false,
  name?: string,
) => void

export type SetterCreator<K extends keyof EngineStateWithActions> = (
  setState: CustomSetState,
) => EngineStateWithActions[K]
