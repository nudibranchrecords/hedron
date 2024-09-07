import { useEngineStore } from '../engine'

export const useActiveSketch = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const activeSketchId = useEngineStore((state) => state.activeSketchId)

  return activeSketchId ? sketches[activeSketchId] : null
}
