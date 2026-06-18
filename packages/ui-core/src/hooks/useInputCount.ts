import { useEngineStore } from './storeHooks'

export const useInputCount = (nodeId: string): number =>
  useEngineStore((state) => state.nodes[nodeId]?.childGroups.inputNodeIds.length ?? 0)
