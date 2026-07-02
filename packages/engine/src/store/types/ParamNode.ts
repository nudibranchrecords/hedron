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

export interface ParamFile extends ParamBase {
  valueType: 'file'
  defaultValue: string | null
  accept?: string[] | null
}

export type ParamFileValue = string | null

export type ConfigParamFile = AsConfig<ParamFile> & {
  accept?: string[] | null
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

export type ParamNode =
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

export type ParamForValueType<TValueType extends ParamNode['valueType']> = Extract<
  ParamNode,
  { valueType: TValueType }
>

type OptionNodeConfigLike = {
  key: string
  valueType: ParamNode['valueType']
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

export type ParamValue = number | boolean | string | null
export type ParamValues = Partial<Record<string, ParamValue>>
export type ParamValueType = ParamNode['valueType'] | null

export type ParamVector = ParamVector2 | ParamVector3 | ParamRGB
export type ParamVectorValueType = ParamVector['valueType']

export type EnsureRequiredValueType<T> = T extends { valueType?: infer V }
  ? Omit<T, 'valueType'> & { valueType: V }
  : T

export type ConfigParamImported = ConfigParam & {
  groupIndex: number
  title: string
  nodeType: 'param'
}
