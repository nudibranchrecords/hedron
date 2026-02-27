import { addNode } from './addNode'
import { ensureConfig } from './ensureConfig'
import { createUniqueId } from '@utils/createUniqueId'
import { EngineState, NodeConfig } from '@store/types'

export const addOptionNodes = (
  state: EngineState,
  parentId: string | null,
  optionNodesConfig: NodeConfig[],
) => {
  const optionNodeIds: string[] = []

  for (const cfg of optionNodesConfig) {
    const optionNodeId = createUniqueId()
    optionNodeIds.push(optionNodeId)

    const cfgImported = ensureConfig(cfg)

    addNode(state, optionNodeId, parentId, cfgImported)
  }

  return optionNodeIds
}
