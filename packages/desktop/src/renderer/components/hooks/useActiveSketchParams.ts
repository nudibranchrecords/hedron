import { useMemo } from 'react'
import { ParamWithInfo } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'

type GroupedParams = {
  groupTitle: string
  params: ParamWithInfo[]
}

export const useActiveSketchParams = () => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useActiveSketchParams hook: No active sketch found')
  }

  const [nodes, module] = useEngineStore((state) => [
    state.nodes,
    state.sketchModules[activeSketch.moduleId],
  ])

  const groupedParams: GroupedParams[] = useMemo(() => {
    const groups = [] as GroupedParams[]

    activeSketch.paramIds.forEach((id, index) => {
      const node = nodes[id]
      const paramConfig = module?.config.params[index]
      const title = paramConfig?.title ?? paramConfig?.key

      const groupIndex = node.groupIndex ?? module.config.groupInfo.length

      const group =
        groups[groupIndex] ||
        (groups[groupIndex] = {
          groupTitle: module?.config.groupInfo[groupIndex]?.groupTitle ?? null,
          params: [],
        })

      group.params.push({ ...node, title })
    })

    return groups
  }, [activeSketch, nodes, module])

  return groupedParams
}
