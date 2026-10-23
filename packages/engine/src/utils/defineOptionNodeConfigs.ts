import type { ConfigParam, ParamForValueType, ParamNode } from '@store/types/ParamNode'
import type { ConfigShot, ShotNode } from '@store/types/ShotNode'

/** Preserves literal keys and node/value types when defining option node config arrays. */
export const defineOptionNodeConfigs = <
  const TConfigs extends readonly (ConfigParam | ConfigShot)[],
>(
  configs: TConfigs,
): TConfigs => {
  return configs
}

type OptionNodeConfigLike =
  | { nodeType: 'param'; key: string; valueType: ParamNode['valueType'] }
  | { nodeType: 'shot'; key: string }

/**
 * Builds a strongly-typed key -> param/shot node map from an option node config tuple.
 *
 * Example:
 * - const CONFIGS = defineOptionNodeConfigs([...])
 * - type OptionNodes = OptionNodesFromConfigs<typeof CONFIGS>
 */
export type OptionNodesFromConfigs<TConfigs extends readonly OptionNodeConfigLike[]> = {
  [TConfig in TConfigs[number] as TConfig['key']]:
    | ((TConfig extends {
        nodeType: 'param'
        valueType: infer TValueType extends ParamNode['valueType']
      }
        ? ParamForValueType<TValueType>
        : ShotNode) & { key: TConfig['key'] })
    | undefined
}
