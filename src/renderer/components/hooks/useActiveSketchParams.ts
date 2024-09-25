import { useMemo } from 'react'
import { useActiveSketch } from './useActiveSketch'
import { useEngineStore } from '../../engine'
import { NodeParamEnum, Param } from 'src/engine/store/types'

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
        const node: ParamWithInfo = { ...nodes[id], title: undefined }
        const paramConfig = module?.config.params[index]
        if (paramConfig) {
          node.title = paramConfig.title
          if (paramConfig.valueType === 'enum') {
            ;(node as NodeParamEnum).options = paramConfig.options
          }
        }
        return node
      })
    }
    return []
  }, [activeSketch, nodes, module])

  return params
}
