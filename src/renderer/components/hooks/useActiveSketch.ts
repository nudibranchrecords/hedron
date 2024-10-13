import { useEngineStore } from '../../engine'
import { useAppStore } from 'src/renderer/appStore'

export const useActiveSketch = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const activeSketchId = useAppStore((state) => state.activeSketchId)

  return activeSketchId ? sketches[activeSketchId] : null
}
