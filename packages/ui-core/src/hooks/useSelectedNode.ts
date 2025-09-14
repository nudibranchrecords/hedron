import { useAppStore } from '@hooks/storeHooks'

export const useSelectedNode = (sketchId: string | null) => {
  return useAppStore((state) => state.selectedNodes[sketchId ?? 'aux'])
}
