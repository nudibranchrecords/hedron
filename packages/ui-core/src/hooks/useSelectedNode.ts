import { useAppStore } from '@hooks/store'

export const useSelectedNode = (sketchId: string | null) => {
  return useAppStore((state) => state.selectedNodes[sketchId ?? 'aux'])
}
