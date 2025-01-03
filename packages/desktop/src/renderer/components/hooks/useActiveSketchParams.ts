import { useMemo } from 'react'
import { ParamWithInfo } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useActiveSketchParams hook: No active sketch found')
  }

  const [nodes, module] = useEngineStore((state) => [
    state.nodes,
    state.sketchModules[activeSketch.moduleId],
  ])

  const params: ParamWithInfo[] = useMemo(
    () =>
      activeSketch.paramIds.map((id, index) => {
        const node = nodes[id]
        const paramConfig = module?.config.params[index]
        const title = paramConfig?.title ?? paramConfig?.key
        return { ...node, title }
      }),
    [activeSketch, nodes, module],
  )

  return params
}
