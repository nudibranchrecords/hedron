import { ChildGroups, ConfigNodeBase, NodeBase } from './NodeBase'

export interface ParamBase extends NodeBase {
  nodeType: 'param'
  key: string
  groupIndex: number
  hidden?: boolean
}

export interface ConfigParamBase extends ConfigNodeBase {
  nodeType: 'param'
}

type ConfigParamFromParam<T extends { valueType: unknown; defaultValue: unknown }> = Pick<
  T,
  'valueType' | 'defaultValue'
>

export type AsConfig<T extends { valueType: unknown; defaultValue: unknown }> = ConfigParamBase &
  ConfigParamFromParam<T>

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

export type ConfigParamNumber = AsConfig<ParamNumber> & {
  sliderMin?: number
  sliderMax?: number
}

export interface ParamBoolean extends ParamBase {
  valueType: 'boolean'
  defaultValue: boolean
}

export type ConfigParamBoolean = AsConfig<ParamBoolean>

export interface ParamString extends ParamBase {
  valueType: 'string'
  defaultValue: string
}

export type ConfigParamString = AsConfig<ParamString>

export type ParamEnumValue = string | number
export type ParamEnumOption = { value: ParamEnumValue; label: string }

export interface ParamFileValueEmpty {
  fileType: null
  fileName: null
}
export interface ParamFileValueSelected {
  // TODO: We should probably type fileType
  fileType: string
  fileName: string
}

export type ParamFileValue = ParamFileValueEmpty | ParamFileValueSelected

export interface ParamFile extends ParamBase {
  valueType: 'file'
  defaultValue: ParamFileValue
  // TODO: would probably want to mirror the HTML file input here?
  // Made this while offline so couldn't check so easily
  acceptedFileTypes?: string[] | null
}

export type ConfigParamFile = AsConfig<ParamFile> & {
  acceptedFileTypes?: string[] | null
}

export interface ParamEnum extends ParamBase {
  valueType: 'enum'
  defaultValue: ParamEnumValue
  options: ParamEnumOption[]
}

export type ConfigParamEnum = AsConfig<ParamEnum> & {
  options: ParamEnumOption[]
}
export interface ParamVector2 extends ParamVectorBase {
  valueType: 'vector2'
  defaultValue: [number, number]
}

export type ConfigParamVector2 = AsConfig<ParamVector2>

export interface ParamVector3 extends ParamVectorBase {
  valueType: 'vector3'
  defaultValue: [number, number, number]
}

export type ConfigParamVector3 = AsConfig<ParamVector3>

export interface ParamRGB extends ParamVectorBase {
  valueType: 'rgb'
  defaultValue: [number, number, number]
}

export type ConfigParamRGB = AsConfig<ParamRGB>

export type Param =
  | ParamBoolean
  | ParamString
  | ParamNumber
  | ParamEnum
  | ParamVector2
  | ParamVector3
  | ParamRGB
  | ParamFile

export type ConfigParam =
  | ConfigParamBoolean
  | ConfigParamString
  | ConfigParamNumber
  | ConfigParamEnum
  | ConfigParamVector2
  | ConfigParamVector3
  | ConfigParamRGB
  | ConfigParamFile

/** Preserves literal keys/valueTypes when defining option node config arrays. */
export const defineOptionNodeConfigs = <const TConfigs extends readonly ConfigParam[]>(
  configs: TConfigs,
): TConfigs => {
  return configs
}

export type ParamForValueType<TValueType extends Param['valueType']> = Extract<
  Param,
  { valueType: TValueType }
>

type OptionNodeConfigLike = {
  key: string
  valueType: Param['valueType']
}

/**
 * Builds a strongly-typed key -> Param map from an option node config tuple.
 *
 * Example:
 * - const CONFIGS = defineOptionNodeConfigs([...])
 * - type OptionNodes = OptionNodesFromConfigs<typeof CONFIGS>
 */
export type OptionNodesFromConfigs<TConfigs extends readonly OptionNodeConfigLike[]> = {
  [TConfig in TConfigs[number] as TConfig['key']]:
    | (ParamForValueType<TConfig['valueType']> & { key: TConfig['key'] })
    | undefined
}

export type ParamValue = number | boolean | string | ParamFileValue
export type ParamValues = Partial<Record<string, ParamValue>>
export type ParamValueType = Param['valueType'] | null

export type ParamVector = ParamVector2 | ParamVector3 | ParamRGB
export type ParamVectorValueType = ParamVector['valueType']

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

export const isParamVector = (node: Param): node is ParamVector => {
  return node.nodeType === 'param' && node.valueType in paramValueTypesWithChildren
}

export type EnsureRequiredValueType<T> = T extends { valueType?: infer V }
  ? Omit<T, 'valueType'> & { valueType: V }
  : T

export type ConfigParamImported = ConfigParam & {
  groupIndex: number
  title: string
  nodeType: 'param'
}
