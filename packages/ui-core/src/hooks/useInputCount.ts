import { useEngineStore } from './engineHooks'

export const useInputCount = (nodeId: string): number =>
  useEngineStore((state) => state.nodes[nodeId]?.childGroups.inputNodeIds.length ?? 0)
