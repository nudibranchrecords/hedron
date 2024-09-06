import { useAppStore } from '../useAppStore'

export const useActiveSketch = () => {
  const sketches = useAppStore((state) => state.sketches)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  return activeSketchId ? sketches[activeSketchId] : null
}
