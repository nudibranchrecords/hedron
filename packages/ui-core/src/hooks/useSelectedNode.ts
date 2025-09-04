import { useAppStore } from '@hooks/useStores'

export const useSelectedNode = (sketchId: string | null) => {
  return useAppStore((state) => state.selectedNodes[sketchId ?? 'aux'])
}
