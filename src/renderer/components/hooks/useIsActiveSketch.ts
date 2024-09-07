import { useAppStore } from 'src/renderer/appStore'

export const useIsActiveSketch = (id: string) => {
  const activeSketchId = useAppStore((state) => state.activeSketchId)
  return activeSketchId === id
}
