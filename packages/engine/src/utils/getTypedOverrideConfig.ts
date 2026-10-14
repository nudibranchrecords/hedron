import { ConfigParam, ParamEnumValue, ParamNode, ParamValue } from '@store/types'

export const TYPED_OVERRIDE_KEY = 'overrideTargetValue'

// Override option node that mirrors an enum, boolean or string target, null for other types
export const getTypedOverrideConfig = (
  targetNode: ParamNode,
  value: ParamValue | undefined,
): ConfigParam | null => {
  const base = { nodeType: 'param', key: TYPED_OVERRIDE_KEY, title: 'Override Value' } as const

  switch (targetNode.valueType) {
    case 'enum':
      return {
        ...base,
        valueType: 'enum',
        options: targetNode.options,
        defaultValue: (value ?? targetNode.defaultValue) as ParamEnumValue,
      }
    case 'boolean':
      return {
        ...base,
        valueType: 'boolean',
        defaultValue: (value ?? targetNode.defaultValue) as boolean,
      }
    case 'string':
      return {
        ...base,
        valueType: 'string',
        defaultValue: (value ?? targetNode.defaultValue) as string,
      }
    default:
      return null
  }
}
