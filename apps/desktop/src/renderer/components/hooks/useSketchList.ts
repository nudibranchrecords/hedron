import { useEngineStore } from '@hedron-gl/ui-core'
import { useMemo } from 'react'

export const useSketchList = () => {
  const sketches = useEngineStore((state) => state.sketches)
  const sketchesVals = useMemo(() => Object.values(sketches), [sketches])

  return sketchesVals
}
