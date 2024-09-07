import { useEngineStore } from '../engine'

export const useIsActiveSketch = (id: string) => {
  const activeSketchId = useEngineStore((state) => state.activeSketchId)
  return activeSketchId === id
}
