import { useEngineStore } from '@renderer/engine'
import { useAppStore } from '@renderer/appStore'

export const useActiveSketch = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  return activeSketchId ? sketches[activeSketchId] : null
}
