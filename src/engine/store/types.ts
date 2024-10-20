import { StoreApi } from 'zustand'

export interface SketchState {
  id: string
  title: string
  moduleId: string
  paramIds: string[]
}

export type Sketches = { [key: string]: SketchState }

// TODO: How to type this??
export type SketchModule = any

export interface NodeBase {
  id: string
  key: string
}

export enum NodeTypes {
  Number = 'number',
  Boolean = 'boolean',
  Enum = 'enum',
}

export interface NodeParamBase extends NodeBase {
  sketchId: string
}

export interface NodeParamNumber extends NodeParamBase {
  type: 'param'
  valueType: NodeTypes.Number
}

export interface NodeParamBoolean extends NodeParamBase {
  type: 'param'
  valueType: NodeTypes.Boolean
}

export interface NodeParamEnum extends NodeParamBase {
  type: 'param'
  valueType: NodeTypes.Enum
}

export type Param = NodeParamBoolean | NodeParamNumber | NodeParamEnum

export type Node = Param
export type Nodes = { [key: string]: Node }

export type NodeValue = number | boolean | string
export type NodeValues = { [key: string]: NodeValue }

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

export type SketchConfigParam =
  | SketchConfigParamNumber
  | SketchConfigParamBoolean
  | SketchConfigParamEnum

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

export type DialogId = 'sketchModules'

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
  replace?: boolean,
  name?: string,
) => void

export type SetterCreator<K extends keyof EngineStateWithActions> = (
  setState: CustomSetState,
) => EngineStateWithActions[K]
