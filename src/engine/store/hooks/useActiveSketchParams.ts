import { useMemo } from 'react'
import { useAppStore } from '../useAppStore'
import { useActiveSketch } from './useActiveSketch'

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()
  const nodes = useAppStore((state) => state.nodes)

  const params = useMemo(() => {
    if (activeSketch) {
      return activeSketch.paramIds.map((id) => nodes[id])
    }

    return []
  }, [nodes, activeSketch])

  return params
}
