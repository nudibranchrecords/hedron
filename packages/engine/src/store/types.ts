import { StoreApi } from 'zustand'
import { ShotArgsObject } from '@HedronEngine/types'

export interface SketchState {
  id: string
  title: string
  moduleId: string
  nodeIds: string[]
  isBroken?: boolean
}

export type Sketches = { [key: string]: SketchState }

// TODO: How to type this??
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SketchModule = any

export type NodeType = 'param' | 'shot'

export interface NodeBase {
  id: string
  key: string
  groupIndex: number
  nodeType: NodeType
}

export interface NodeParamBase extends NodeBase {
  title: string
}

export interface NodeParamWithChildrenBase extends NodeParamBase {
  nodeType: 'param'
  childNodeIds: string[]
}

export interface NodeParamNumber extends NodeParamBase {
  valueType: 'number'
  defaultValue: number
  sliderMin?: number
  sliderMax?: number
}

export interface NodeParamBoolean extends NodeParamBase {
  valueType: 'boolean'
  defaultValue: boolean
}

export interface NodeParamString extends NodeParamBase {
  valueType: 'string'
  defaultValue: string
}

export interface NodeParamEnum extends NodeParamBase {
  valueType: 'enum'
  defaultValue: NodeEnumValue
  options: EnumOption[]
}

export interface NodeParamVector3 extends NodeParamWithChildrenBase {
  valueType: 'vector3'
  defaultValue: [number, number, number]
}

export interface NodeParamVector2 extends NodeParamWithChildrenBase {
  valueType: 'vector2'
  defaultValue: [number, number]
}

export interface NodeParamRGB extends NodeParamWithChildrenBase {
  valueType: 'rgb'
  defaultValue: [number, number, number]
}

export type Param = (
  | NodeParamBoolean
  | NodeParamString
  | NodeParamNumber
  | NodeParamEnum
  | NodeParamVector3
  | NodeParamVector2
  | NodeParamRGB
) & { nodeType: 'param' }

export type NodeParamWithChildren = NodeParamVector3 | NodeParamRGB | NodeParamVector2
export type ParamValueTypeWithChildren = NodeParamWithChildren['valueType']

export type Shot = NodeBase & {
  nodeType: 'shot'
  title: string
}

export type Node = Param | Shot
export type Nodes = { [key: string]: Node }

export type NodeValue = number | boolean | string | ShotArgsObject
export type NodeValues = { [key: string]: NodeValue }
export type NodeValueType = Param['valueType'] | null

// Record ensures every ParamValueTypeWithChildren member is listed — adding a new
// type that extends NodeParamWithChildrenBase will cause a compile error here if
// it isn't included.
const paramValueTypesWithChildren: Record<ParamValueTypeWithChildren, true> = {
  vector3: true,
  vector2: true,
  rgb: true,
}

export const isNodeTypeWithChildren = (
  nodeValueType: NodeValueType,
): nodeValueType is ParamValueTypeWithChildren => {
  return nodeValueType != null && nodeValueType in paramValueTypesWithChildren
}

// Utility type guard to check if a node has child nodes
export const hasChildNodes = (node: Node): node is NodeParamWithChildren => {
  return 'childNodeIds' in node
}

export interface SketchConfigParamBase {
  key: string
  title?: string
  /**
   * If true, this node will not appear in the UI but will still be saved/loaded
   */
  hidden?: boolean
}

export interface SketchConfigParamNumber extends SketchConfigParamBase {
  valueType?: 'number'
  defaultValue: number
  sliderMin?: number
  sliderMax?: number
}

export interface SketchConfigParamBoolean extends SketchConfigParamBase {
  valueType: 'boolean'
  defaultValue: boolean
}
export interface SketchConfigParamString extends SketchConfigParamBase {
  valueType: 'string'
  defaultValue: string
}

export type NodeEnumValue = string | number

export interface SketchConfigParamEnum extends SketchConfigParamBase {
  valueType: 'enum'
  defaultValue: NodeEnumValue
  options: EnumOption[]
}

export interface SketchConfigParamVector3 extends SketchConfigParamBase {
  valueType: 'vector3'
  defaultValue: [number, number, number]
}

export interface SketchConfigParamRGB extends SketchConfigParamBase {
  valueType: 'rgb'
  defaultValue: [number, number, number]
}

export type SketchConfigParam =
  | SketchConfigParamNumber
  | SketchConfigParamBoolean
  | SketchConfigParamString
  | SketchConfigParamEnum
  | SketchConfigParamVector3
  | SketchConfigParamRGB

export type SketchConfigShot = {
  key: string
  title?: string
}

export type EnsureRequiredValueType<T> = T extends { valueType?: infer V }
  ? Omit<T, 'valueType'> & { valueType: V }
  : T

export type SketchConfigItemImported<T> = T & {
  groupIndex: number
  title: string
}

export type SketchConfigParamImported = SketchConfigItemImported<
  EnsureRequiredValueType<SketchConfigParam>
> & { nodeType: 'param' }

export type SketchConfigShotImported = SketchConfigItemImported<SketchConfigShot> & {
  nodeType: 'shot'
}

export type SketchConfigNodeImported = SketchConfigParamImported | SketchConfigShotImported

export interface SketchConfigNodeGroup {
  groupTitle?: string
  children: (SketchConfigParam | SketchConfigShot)[]
}

export interface SketchConfigParamGroup {
  groupTitle?: string
  params: SketchConfigParam[]
}

export interface SketchConfigShotGroup {
  groupTitle?: string
  shots: SketchConfigShot[]
}

// As the user defines the config, it can be a mix of params and groups
export interface SketchConfigRaw {
  title?: string
  description?: string
  params?: (SketchConfigParam | SketchConfigParamGroup)[]
  shots?: (SketchConfigShot | SketchConfigShotGroup)[]
}

export interface SketchConfigImported {
  title: string
  description?: string
  nodes: SketchConfigNodeImported[]
  groupInfo: { groupTitle: string }[]
}

export interface SketchModuleItem {
  moduleId: string
  config: SketchConfigImported
  module: SketchModule
}

export type SketchModules = { [key: string]: SketchModuleItem }

export type EnumOption = { value: NodeEnumValue; label: string }

export type InputOptionNodesConfig = readonly SketchConfigParam[]

export interface Input {
  id: string
  title: string
  type: 'midi' | 'gamepad' | string
  targetNodeId: string
  optionNodeIds: string[]
  // sketchID is optional because not all inputs relate to sketches
  sketchId?: string
}

export type Inputs = { [key: string]: Input }

export interface EngineData {
  sketches: Sketches
  nodes: Nodes
  nodeValues: NodeValues
  inputs: Inputs
}

interface AuxState {
  sketchModules: SketchModules
}

export type EngineState = EngineData & AuxState

interface Actions {
  addSketch: (moduleId: string) => string
  updateSketch: (instanceId: string, sketchState: Partial<SketchState>) => void
  reconcileSketchNodes: (instanceId: string) => void
  deleteSketch: (instanceId: string) => void
  moveSketchUp: (instanceId: string) => void
  moveSketchDown: (instanceId: string) => void
  setSketchModuleItem: (newItem: SketchModuleItem) => void
  updateNodeValue: (nodeId: string, value: NodeValue) => void
  updateMultipleNodeValues: (nodeIds: string[], values: NodeValue[]) => void
  deleteSketchModule: (moduleId: string) => void
  loadProject: (project: EngineData) => void
  reset: () => void
  addInput: (
    inputConfig: Omit<Input, 'id' | 'optionNodeIds'>,
    optionsNodeConfig: InputOptionNodesConfig,
  ) => string
  deleteInput: (inputId: string) => void
}

export type EngineStateWithActions = EngineData & AuxState & Actions
export type UseEngineStore = <T>(selector?: (state: EngineStateWithActions) => T) => T

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
