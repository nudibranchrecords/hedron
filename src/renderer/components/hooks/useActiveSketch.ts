import { useAppStore } from 'src/renderer/appStore'
import { useEngineStore } from '../../engine'

export const useActiveSketch = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  return activeSketchId ? sketches[activeSketchId] : null
}
