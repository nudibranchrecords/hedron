import { StoreApi } from 'zustand'
import { Group } from 'three'
import { Pass } from 'postprocessing'
import { PassNode } from 'three/webgpu'
import { type ShaderNodeObject } from 'three/tsl'
import { ShotArgsObject } from '@HedronEngine/types'
import { EngineScene } from '@world/EngineScene'

export interface SketchState {
  id: string
  title: string
  moduleId: string
  nodeIds: string[]
  isBroken?: boolean
}

export type Sketches = { [key: string]: SketchState }

type SketchUpdateParams = {
  deltaFrame: number
  deltaTime: number
  params: { [key: string]: unknown }
  scene: EngineScene
}

type SketchShotFunc = (
  args: Omit<SketchUpdateParams, 'deltaFrame' | 'deltaTime'> & { shotArgs: ShotArgsObject },
) => void

export type SketchInstance = {
  id: string
  update: (arg: SketchUpdateParams) => void
  root?: Group

  getPasses?: (engineScene: EngineScene) => Pass[]

  getWebGPUPass?: (
    prevPass: ShaderNodeObject<PassNode>,
    renderPassNode: ShaderNodeObject<PassNode>,
  ) => ShaderNodeObject<PassNode>

  dispose(engineScene: EngineScene): () => void
} & Record<string, SketchShotFunc>

export type SketchInstanceMap = Map<string, SketchInstance>
export type SketchInstanceErrorType = 'Create' | 'Dispose'
export type SketchInstanceError = (
  sketchInstanceId: string,
  errorType?: SketchInstanceErrorType,
) => void

export type SketchModule = {
  new (scene: EngineScene): SketchInstance
  getConfig?: () => SketchConfigRaw
}

interface ChildGroups {
  [key: string]: string[]
  optionNodeIds: string[]
  inputNodeIds: string[]
}

export interface NodeBase {
  id: string
  title: string
  parentIds: string[]
  childGroups: ChildGroups

  /** Allows plugins to attach custom arbitrary data to any node.
   * Best for special cases where params don't make sense (e.g. timeline keyframe data) */
  customData?: Record<string, unknown>
}

export interface ParamBase extends NodeBase {
  nodeType: 'param'
  key: string
  groupIndex: number
  hidden?: boolean
}

export interface ParamVectorBase extends ParamBase {
  nodeType: 'param'
  childGroups: ChildGroups & {
    vectorComponentIds: string[]
  }
}

export interface ParamNumber extends ParamBase {
  valueType: 'number'
  defaultValue: number
}

export interface ParamBoolean extends ParamBase {
  valueType: 'boolean'
  defaultValue: boolean
}

export interface ParamString extends ParamBase {
  valueType: 'string'
  defaultValue: string
}

export interface ParamEnum extends ParamBase {
  valueType: 'enum'
  defaultValue: NodeEnumValue
  options: EnumOption[]
}

export interface ParamVector2 extends ParamVectorBase {
  valueType: 'vector2'
  defaultValue: [number, number]
}

export interface ParamVector3 extends ParamVectorBase {
  valueType: 'vector3'
  defaultValue: [number, number, number]
}

export interface ParamRGB extends ParamVectorBase {
  valueType: 'rgb'
  defaultValue: [number, number, number]
}

export type Param =
  | ParamBoolean
  | ParamString
  | ParamNumber
  | ParamEnum
  | ParamVector2
  | ParamVector3
  | ParamRGB

export type ParamVector = ParamVector2 | ParamVector3 | ParamRGB
export type ParamVectorValueType = ParamVector['valueType']

export type Shot = NodeBase & {
  nodeType: 'shot'
  key: string
  hidden?: boolean
  groupIndex: number
}

export type CustomNode = NodeBase & {
  nodeType: 'custom'
  customNodeType: string
}

export type Node = Param | Shot | Input | CustomNode
export type Nodes = Partial<Record<string, Node>>
export type NodeType = Node['nodeType']

export type NodeValue = number | boolean | string
export type NodeValues = Partial<Record<string, NodeValue>>
export type ParamValueType = Param['valueType'] | null

// Record ensures every ParamValueTypeWithChildren member is listed — adding a new
// type that extends NodeParamWithChildrenBase will cause a compile error here if
// it isn't included.
const paramValueTypesWithChildren: Record<ParamVectorValueType, true> = {
  vector3: true,
  vector2: true,
  rgb: true,
}

export const isParamVectorValueType = (
  nodeValueType: ParamValueType,
): nodeValueType is ParamVectorValueType => {
  return nodeValueType != null && nodeValueType in paramValueTypesWithChildren
}

export const isParamVector = (node: Node): node is ParamVector => {
  return node.nodeType === 'param' && node.valueType in paramValueTypesWithChildren
}

interface SketchConfigNodeBase {
  key: string
  title?: string
  hidden?: boolean
}

export type SketchConfigShot = SketchConfigNodeBase

export interface SketchConfigParamBase extends SketchConfigNodeBase {
  nodeType?: 'param'
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

export interface SketchConfigParamVector2 extends SketchConfigParamBase {
  valueType: 'vector2'
  defaultValue: [number, number]
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
  | SketchConfigParamVector2
  | SketchConfigParamVector3
  | SketchConfigParamRGB

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

export type SketchConfigNodeImported =
  | SketchConfigParamImported
  | SketchConfigShotImported
  | CustomNode

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

export type NodeConfig = SketchConfigParam | (SketchConfigShot & { nodeType: 'shot' })

export interface Input extends NodeBase {
  nodeType: 'input'
  inputType: string
  targetNodeId: string
}

export interface EngineData {
  sketches: Sketches
  nodes: Nodes
  nodeValues: NodeValues
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
    inputConfig: Omit<Input, 'id' | 'optionNodeIds' | 'childGroups' | 'nodeType'>,
    optionsNodeConfig?: NodeConfig[],
  ) => string
  deleteNode: (nodeId: string) => void
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
