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
}

export interface NodeParamNumber extends NodeBase {
  type: 'param'
  valueType: NodeTypes.Number
}

export interface NodeParamBoolean extends NodeBase {
  type: 'param'
  valueType: NodeTypes.Boolean
}

export type Param = NodeParamBoolean | NodeParamNumber

export type Node = Param
export type Nodes = { [key: string]: Node }

export type NodeValue = number | boolean
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

export type SketchConfigParam = SketchConfigParamNumber | SketchConfigParamBoolean

export interface SketchConfig {
  title?: string
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
