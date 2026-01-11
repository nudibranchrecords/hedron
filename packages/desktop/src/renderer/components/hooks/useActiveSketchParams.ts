import { useMemo } from 'react'
import { useEngineStore } from '@hedron/ui-core'
import { Param } from '@hedron/engine'
import { useActiveSketch } from '@components/hooks/useActiveSketch'

type GroupedParams = {
  isUngrouped?: boolean
  groupTitle: string
  groupIndex: number
  params: Param[]
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

    activeSketch.paramIds.forEach((id) => {
      const node = nodes[id]

      const isUngrouped = node.groupIndex === null
      const groupIndex = isUngrouped ? module.config.paramGroupInfo.length : node.groupIndex!

      const group =
        groups[groupIndex] ||
        (groups[groupIndex] = {
          isUngrouped,
          groupIndex,
          groupTitle: module?.config.paramGroupInfo[groupIndex]?.groupTitle,
          params: [],
        })

      group.params.push({ ...node })
    })

    return groups
  }, [activeSketch, nodes, module])

  return groupedParams
}
