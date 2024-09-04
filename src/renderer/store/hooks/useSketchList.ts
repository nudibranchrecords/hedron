import { useMemo } from 'react'
import { useAppStore } from '../useAppStore'

export const useSketchList = () => {
  const sketches = useAppStore((state) => state.sketches)
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])

  return sketchesVals
}
