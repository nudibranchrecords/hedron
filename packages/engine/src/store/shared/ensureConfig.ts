import {
  ConfigParam,
  ConfigShot,
  ConfigCustomNode,
  ConfigParamImported,
  ConfigShotImported,
  ConfigCustomNodeImported,
} from '@store/types'

/*
  Fills in gaps in user defined configs such as a missing `valueType` for number params, or a missing `title` for any node.
*/
export const ensureNodeConfig = (
  nodeConfig: ConfigParam | ConfigShot | ConfigCustomNode,
  groupIndex: number = 0,
): ConfigParamImported | ConfigShotImported | ConfigCustomNodeImported => {
  const base = {
    title: nodeConfig.title ?? nodeConfig.key,
    groupIndex,
  }

  return {
    ...nodeConfig,
    ...base,
  }
}
