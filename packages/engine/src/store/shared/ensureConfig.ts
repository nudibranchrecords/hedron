import { NodeConfig, SketchConfigNodeImported, SketchConfigParamImported } from '@store/types'

/*
  Fills in gaps in user defined configs such as a missing `valueType` for number params, or a missing `title` for any node.
*/
export const ensureConfig = (
  nodeConfig: NodeConfig,
  groupIndex: number = 0,
): SketchConfigNodeImported => {
  const nodeType = nodeConfig.nodeType ?? 'param'

  const base = {
    title: nodeConfig.title ?? nodeConfig.key,
    groupIndex,
  }

  switch (nodeType) {
    case 'param': {
      // We force the imported version of this type to make typing much easier
      const cfg = nodeConfig as SketchConfigParamImported

      // We still need to set this fallback! The types above assume this has already happened (but it hasn't)
      cfg.valueType = cfg.valueType ?? 'number'

      return {
        ...cfg,
        ...base,
        nodeType: 'param',
      }
    }

    case 'shot': {
      const cfg = nodeConfig as NodeConfig & { nodeType: 'shot' }

      return {
        ...cfg,
        ...base,
        nodeType: 'shot',
      }
    }

    default:
      throw new Error(`Unexpected nodeType: ${nodeType}`)
  }
}
