import { useAppStore } from '../useAppStore'

export const useIsActiveSketch = (id: string) => {
  const activeSketchId = useAppStore((state) => state.activeSketchId)
  return activeSketchId === id
}
