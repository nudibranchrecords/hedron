import { StoreApi } from 'zustand'

export interface SketchState {
  id: string
  title: string
  moduleId: string
  paramIds: string[]
  isBroken?: boolean
}

export type Sketches = { [key: string]: SketchState }

// TODO: How to type this??
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SketchModule = any

export interface NodeBase {
  id: string
  key: string
}

export const NodeTypesWithChildren = ['vector3', 'rgb'] as const
export type NodeTypeWithChildren = (typeof NodeTypesWithChildren)[number]

export interface NodeParamBase extends NodeBase {
  type: 'param'
  title: string
  groupIndex: number | null
}

export interface NodeParamWithChildren extends NodeParamBase {
  childNodeIds: string[]
  valueType: NodeTypeWithChildren
  defaultValue: [number, number, number]
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

export interface NodeParamVector3 extends NodeParamWithChildren {
  valueType: 'vector3'
  defaultValue: [number, number, number]
}

export interface NodeParamRGB extends NodeParamWithChildren {
  valueType: 'rgb'
  defaultValue: [number, number, number]
}

export type Param =
  | NodeParamBoolean
  | NodeParamString
  | NodeParamNumber
  | NodeParamEnum
  | NodeParamVector3
  | NodeParamRGB

export type Node = Param
export type Nodes = { [key: string]: Node }

export type NodeValue = number | boolean | string
export type NodeValues = { [key: string]: NodeValue }
export type NodeValueType = Node['valueType']

export const isNodeTypeWithChildren = (
  nodeValueType: NodeValueType,
): nodeValueType is NodeTypeWithChildren => {
  return NodeTypesWithChildren.includes(nodeValueType as NodeTypeWithChildren)
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
  groupIndex: number | null
  title: string
}

export type SketchConfigParamImported = SketchConfigItemImported<
  EnsureRequiredValueType<SketchConfigParam>
>

export type SketchConfigShotImported = SketchConfigItemImported<SketchConfigShot>

export interface SketchConfigGroup {
  groupTitle?: string
}

export interface SketchConfigParamGroup extends SketchConfigGroup {
  params: SketchConfigParam[]
}

export interface SketchConfigShotGroup extends SketchConfigGroup {
  shots: SketchConfigShot[]
}

// Generic type for imported config groups
export interface SketchConfigGroupImported extends SketchConfigGroup {
  groupTitle: string
  groupIndex: number
}

export interface SketchConfigParamGroupImported extends SketchConfigGroupImported {
  params: SketchConfigParam[]
}

export interface SketchConfigShotGroupImported extends SketchConfigGroupImported {
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
  params: SketchConfigParamImported[]
  shots: SketchConfigShotImported[]
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
  updateSketchParams: (instanceId: string) => void
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
