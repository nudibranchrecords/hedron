import { useMemo } from 'react'
import { useActiveSketch } from './useActiveSketch'
import { useEngineStore } from '../../engine'

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()
  const nodes = useEngineStore((state) => state.nodes)

  const params = useMemo(() => {
    if (activeSketch) {
      return activeSketch.paramIds.map((id) => nodes[id])
    }

    return []
  }, [nodes, activeSketch])

  return params
}
