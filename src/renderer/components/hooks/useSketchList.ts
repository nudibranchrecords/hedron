import { useMemo } from 'react'
import { useEngineStore } from '../../engine'

export const useSketchList = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])

  return sketchesVals
}
