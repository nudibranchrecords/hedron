import { useMemo } from 'react'
import { useActiveSketch } from './useActiveSketch'
import { useEngineStore } from '../../engine'
import { Param } from 'src/engine/store/types'

export type ParamWithInfo = Param & { title: string | undefined }

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()
  const nodes = useEngineStore((state) => state.nodes)
  const module = useEngineStore(
    (state) => activeSketch && state.sketchModules[activeSketch.moduleId],
  )

  const params: ParamWithInfo[] = useMemo(() => {
    if (activeSketch) {
      return activeSketch.paramIds.map((id, index) => {
        const node = nodes[id]
        const title = module?.config.params[index]?.title
        return { ...node, title }
      })
    }
    return []
  }, [activeSketch, nodes, module])

  return params
}
